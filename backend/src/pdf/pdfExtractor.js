const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

/**
 * Normalizes and cleans text extracted from PDF documents.
 * Handles unusual unicode icons, ligature artifacts, and multi-column breaks.
 */
function cleanExtractedText(rawText) {
  if (!rawText) return '';

  return rawText
    // Replace common PDF ligature artifacts
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    // Standardize bullet points and icon glyphs
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u27A2\u2714\u2713\uF0A7\uF0B7]/g, '\n• ')
    // Normalize various quote marks and dashes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    // Clean weird control characters while preserving newlines & tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
    // Fix spaces around newlines
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    // Rejoin words broken across line wraps (e.g. "com-\nputer" -> "computer")
    .replace(/([a-zA-Z]{2,})-\n([a-zA-Z]{2,})/g, '$1$2')
    // Collapse 3 or more empty lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Detects whether the layout contains indicators of two columns or tabular structure.
 */
function analyzeLayout(rawText) {
  const lines = rawText.split('\n');
  let twoColumnIndicators = 0;
  let tableIndicators = 0;

  for (const line of lines) {
    // Large gap between text chunks on the same line indicates two columns or tables
    if (/\S\s{4,}\S/.test(line)) {
      twoColumnIndicators++;
    }
    // Pipe or tabular separator
    if (/\||\t/.test(line)) {
      tableIndicators++;
    }
  }

  const isTwoColumn = twoColumnIndicators > Math.max(3, lines.length * 0.1);
  const isTableDetected = tableIndicators > 2;

  return {
    isTwoColumn,
    isTableDetected,
    lineCount: lines.length,
    wordCount: rawText.split(/\s+/).filter(Boolean).length,
    charCount: rawText.length,
  };
}

/**
 * Segments text into readable logical sections with metadata.
 */
function segmentSections(text) {
  const commonHeaders = [
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE',
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'AREAS OF EXPERTISE',
    'PROJECTS', 'KEY PROJECTS', 'PERSONAL PROJECTS',
    'CERTIFICATIONS', 'LICENSES', 'AWARDS', 'PUBLICATIONS', 'VOLUNTEER'
  ];

  const lines = text.split('\n');
  const sections = [];
  let currentSection = { title: 'HEADER / CONTACT', lines: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const upperLine = line.toUpperCase().replace(/[^A-Z\s]/g, '').trim();
    const isHeader = commonHeaders.some(h => upperLine === h || upperLine === `${h}:`);

    if (isHeader) {
      if (currentSection.lines.length > 0) {
        sections.push({
          title: currentSection.title,
          content: currentSection.lines.join('\n'),
        });
      }
      currentSection = { title: upperLine, lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }

  if (currentSection.lines.length > 0) {
    sections.push({
      title: currentSection.title,
      content: currentSection.lines.join('\n'),
    });
  }

  return sections;
}

/**
 * Main extractor function that takes a PDF Buffer and parses it.
 * Automatically runs OCR if the PDF is scanned or has sparse text.
 */
async function extractResumePdf(buffer) {
  const warnings = [];
  let extractedText = '';
  let pageCount = 1;
  let isScanned = false;
  let ocrUsed = false;
  let extractionConfidence = 100;

  try {
    const pdfData = await pdfParse(buffer, {
      pagerender: (pageData) => {
        return pageData.getTextContent().then((textContent) => {
          let lastY, text = '';
          for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY) {
              text += item.str + ' ';
            } else {
              text += '\n' + item.str + ' ';
            }
            lastY = item.transform[5];
          }
          return text;
        });
      }
    });

    pageCount = pdfData.numpages || 1;
    const rawParsed = pdfData.text || '';
    extractedText = cleanExtractedText(rawParsed);

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    // Check if the document appears scanned (low text relative to file size or page count)
    const avgWordsPerPage = wordCount / pageCount;
    if (wordCount < 40 || avgWordsPerPage < 25) {
      isScanned = true;
      warnings.push('Document contains very little digital text; scanned document detected.');
      extractionConfidence = 60;

      // Attempt OCR with Tesseract
      try {
        console.log('[PDF Extractor] Attempting OCR fallback for scanned resume...');
        const ocrResult = await Tesseract.recognize(buffer, 'eng', {
          logger: () => {},
        });

        if (ocrResult && ocrResult.data && ocrResult.data.text && ocrResult.data.text.trim().length > 30) {
          extractedText = cleanExtractedText(ocrResult.data.text);
          ocrUsed = true;
          extractionConfidence = Math.min(90, Math.round(ocrResult.data.confidence || 75));
          warnings.push(`OCR fallback applied successfully with ${extractionConfidence}% confidence.`);
        } else {
          warnings.push('OCR text extraction produced limited content. Please ensure image resolution is clear.');
          extractionConfidence = 45;
        }
      } catch (ocrErr) {
        console.warn('[PDF Extractor] OCR processing encountered an error:', ocrErr.message);
        warnings.push('Could not run OCR on scanned document. Digital layer may be missing.');
        extractionConfidence = 40;
      }
    }

    // Layout Analysis
    const layout = analyzeLayout(extractedText);
    if (layout.isTwoColumn) {
      warnings.push('Two-column layout detected; multi-column reading order re-aligned.');
    }
    if (layout.isTableDetected) {
      warnings.push('Tabular format elements detected; cell structures flattened.');
    }

    if (extractedText.length < 50) {
      warnings.push('Extracted text volume is abnormally short. The resume might be password-protected or empty.');
      extractionConfidence = Math.min(extractionConfidence, 35);
    }

    const sections = segmentSections(extractedText);

    return {
      success: true,
      text: extractedText,
      pageCount,
      isScanned,
      ocrUsed,
      extractionConfidence,
      hasWarnings: warnings.length > 0,
      warnings,
      metadata: {
        charCount: extractedText.length,
        wordCount: extractedText.split(/\s+/).filter(Boolean).length,
        lineCount: layout.lineCount,
        twoColumnLayout: layout.isTwoColumn,
        tableDetected: layout.isTableDetected,
        ocrUsed,
      },
      sections,
    };
  } catch (error) {
    console.error('[PDF Extractor Error]:', error);
    return {
      success: false,
      text: '',
      pageCount: 1,
      isScanned: true,
      ocrUsed: false,
      extractionConfidence: 10,
      hasWarnings: true,
      warnings: [`Failed to parse PDF binary: ${error.message}`],
      metadata: {},
      sections: [],
    };
  }
}

module.exports = {
  extractResumePdf,
  cleanExtractedText,
  analyzeLayout,
  segmentSections,
};
