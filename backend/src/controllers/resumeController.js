const multer = require('multer');
const { extractResumePdf } = require('../pdf/pdfExtractor');
const { extractSkillsFromText } = require('../ai/skillExtractor');
const { resumeRepo, extractedSkillRepo } = require('../services/dataStore');

// Configure Multer for PDF memory storage
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10) * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF files are accepted.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Upload and Parse Resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF resume file.',
      });
    }

    const buffer = req.file.buffer;

    // Validate PDF magic bytes: %PDF-
    const header = buffer.slice(0, 5).toString('ascii');
    if (!header.startsWith('%PDF-')) {
      return res.status(400).json({
        success: false,
        error: 'Security verification failed: uploaded file is not a valid PDF document.',
      });
    }

    console.log(`[Resume Upload] Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Extract text and analyze layout
    const extractionResult = await extractResumePdf(buffer);

    if (!extractionResult.success && (!extractionResult.text || extractionResult.text.length < 20)) {
      return res.status(422).json({
        success: false,
        error: 'Unable to extract text from this PDF. The document may be corrupted, image-only, or encrypted.',
        warnings: extractionResult.warnings,
      });
    }

    // Extract skills from resume
    const skillAnalysis = extractSkillsFromText(extractionResult.text, 'resume');

    // Save resume record
    const resume = await resumeRepo.create({
      userId: req.user.id,
      filename: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText: extractionResult.text,
      extractionConfidence: extractionResult.extractionConfidence,
      isScanned: extractionResult.isScanned,
      hasWarnings: extractionResult.hasWarnings,
      warnings: extractionResult.warnings,
      pageCount: extractionResult.pageCount,
      metadata: extractionResult.metadata,
    });

    const resumeId = resume._id || resume.id;

    // Save extracted skills
    for (const skill of skillAnalysis.extractedSkills) {
      await extractedSkillRepo.create({
        documentType: 'resume',
        documentId: resumeId,
        userId: req.user.id,
        canonicalName: skill.canonicalName,
        originalExtractedName: skill.originalExtractedName,
        category: skill.category,
        importance: 'optional',
        confidenceScore: skill.confidenceScore,
        evidenceSentence: skill.evidenceSentence,
        sourceLocation: {
          lineNumber: skill.sourceLineNumber,
        },
      });
    }

    res.status(201).json({
      success: true,
      resume: {
        id: resumeId,
        filename: resume.filename,
        originalName: resume.originalName,
        fileSize: resume.fileSize,
        pageCount: resume.pageCount,
        extractionConfidence: resume.extractionConfidence,
        isScanned: resume.isScanned,
        hasWarnings: resume.hasWarnings,
        warnings: resume.warnings,
        metadata: resume.metadata,
        extractedSkillsCount: skillAnalysis.extractedSkills.length,
        extractedSkills: skillAnalysis.extractedSkills.map(s => ({
          canonicalName: s.canonicalName,
          originalName: s.originalExtractedName,
          category: s.category,
        })),
        previewText: extractionResult.text.substring(0, 350) + (extractionResult.text.length > 350 ? '...' : ''),
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error('[Resume Upload Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while processing resume.',
    });
  }
};

// Get all resumes of the current user
const getResumes = async (req, res) => {
  try {
    const resumes = await resumeRepo.find({ userId: req.user.id });
    const formatted = resumes.map(r => ({
      id: r._id || r.id,
      originalName: r.originalName,
      fileSize: r.fileSize,
      pageCount: r.pageCount,
      extractionConfidence: r.extractionConfidence,
      isScanned: r.isScanned,
      hasWarnings: r.hasWarnings,
      warnings: r.warnings,
      createdAt: r.createdAt,
    }));

    res.json({
      success: true,
      count: formatted.length,
      resumes: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resumes.',
    });
  }
};

// Get single resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await resumeRepo.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found.',
      });
    }

    if (String(resume.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not own this resume.',
      });
    }

    const skills = await extractedSkillRepo.find({
      documentType: 'resume',
      documentId: resume._id || resume.id,
    });

    res.json({
      success: true,
      resume: {
        id: resume._id || resume.id,
        originalName: resume.originalName,
        fileSize: resume.fileSize,
        pageCount: resume.pageCount,
        extractionConfidence: resume.extractionConfidence,
        isScanned: resume.isScanned,
        hasWarnings: resume.hasWarnings,
        warnings: resume.warnings,
        metadata: resume.metadata,
        extractedText: resume.extractedText,
        skills,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resume details.',
    });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await resumeRepo.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found.',
      });
    }

    if (String(resume.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not own this resume.',
      });
    }

    await resumeRepo.findByIdAndDelete(req.params.id);
    await extractedSkillRepo.deleteMany({ documentId: req.params.id });

    res.json({
      success: true,
      message: 'Resume and associated skill data deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume.',
    });
  }
};

module.exports = {
  upload,
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
};
