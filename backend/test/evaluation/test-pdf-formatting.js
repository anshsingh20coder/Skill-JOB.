const {
  cleanExtractedText,
  analyzeLayout,
  segmentSections,
} = require('../../src/pdf/pdfExtractor');

function testPdfFormatting() {
  console.log('================================================================');
  console.log('       TESTING PDF FORMATTING & UNUSUAL LAYOUT HANDLING         ');
  console.log('================================================================\n');

  // 1. Test Unicode icons, ligatures, and broken line wraps
  console.log('Test 1: Cleaning Unicode Icons, Ligatures, and Broken Line Wraps');
  // \uFB01 is 'fi' (of\uFB01ce -> office), \uFB00 is 'ff' (e\uFB00ective -> effective)
  const dirtyText = `SUMMARY\nSenior of\uFB01ce manager with e\uFB00ective leadership.\n\u2022 Delivered scalable microser-\nvices architecture.\n\u27A2 Implemented Docker container-\nization.`;
  const cleaned = cleanExtractedText(dirtyText);
  console.log('Cleaned Result:\n' + cleaned);
  const passedLigature = cleaned.includes('office') && cleaned.includes('effective') && cleaned.includes('microservices') && cleaned.includes('containerization');
  console.log(`Ligature & hyphen fix status: ${passedLigature ? 'PASSED ✓' : 'FAILED ✗'}\n`);

  // 2. Test Two-Column Layout Detection
  console.log('Test 2: Two-Column Layout Detection');
  const twoColText = `CORE SKILLS                              WORK EXPERIENCE\nReact, TypeScript, Redux                 Senior Developer at TechCorp\nNode.js, Express, Docker                 Led team of 6 engineers\nPostgreSQL, AWS, GraphQL                 Architected real-time APIs\nGit, CI/CD, Jest                         Managed cloud infrastructure`;
  const layoutAnalysis = analyzeLayout(twoColText);
  console.log('Layout Analysis:', layoutAnalysis);
  const passedTwoCol = layoutAnalysis.isTwoColumn === true;
  console.log(`Two-column detection status: ${passedTwoCol ? 'PASSED ✓' : 'FAILED ✗'}\n`);

  // 3. Test Table and Tabular Separation
  console.log('Test 3: Tabular Formatting Detection');
  const tableText = `Skill | Proficiency | Years\nReact | Expert | 4 years\nNode.js | Advanced | 3 years\nDocker | Intermediate | 2 years`;
  const tableAnalysis = analyzeLayout(tableText);
  console.log('Table Analysis:', tableAnalysis);
  const passedTable = tableAnalysis.isTableDetected === true;
  console.log(`Table detection status: ${passedTable ? 'PASSED ✓' : 'FAILED ✗'}\n`);

  // 4. Test Section Segmentation
  console.log('Test 4: Logical Section Segmentation');
  const structuredDoc = `ALEX RIVERA\nFull Stack Developer\n\nPROFESSIONAL SUMMARY\nExperienced software engineer.\n\nSKILLS\nReact, Node.js, Docker, AWS\n\nEXPERIENCE\nSenior Developer at Alpha\n\nEDUCATION\nBS Computer Science`;
  const sections = segmentSections(structuredDoc);
  console.log(`Extracted ${sections.length} Sections:`, sections.map(s => s.title));
  const passedSections = sections.some(s => s.title.includes('SKILLS')) && sections.some(s => s.title.includes('EXPERIENCE'));
  console.log(`Section segmentation status: ${passedSections ? 'PASSED ✓' : 'FAILED ✗'}\n`);

  if (passedLigature && passedTwoCol && passedTable && passedSections) {
    console.log('✅ ALL PDF FORMATTING TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('❌ Some PDF formatting tests failed.');
    process.exit(1);
  }
}

testPdfFormatting();
