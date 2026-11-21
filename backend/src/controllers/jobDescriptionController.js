const { extractSkillsFromText } = require('../ai/skillExtractor');
const { jdRepo, extractedSkillRepo } = require('../services/dataStore');

// Save and parse Job Description
const createJobDescription = async (req, res) => {
  try {
    const { title, company, text } = req.body;

    if (!text || text.trim().length < 25) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid job description (minimum 25 characters).',
      });
    }

    const cleanTitle = (title && title.trim()) || 'Target Role';
    const cleanCompany = (company && company.trim()) || 'Target Company';

    // Extract skills with importance labeling (required vs preferred)
    const analysis = extractSkillsFromText(text, 'job_description');

    const requiredSkills = analysis.extractedSkills
      .filter(s => s.importance === 'required')
      .map(s => ({
        canonicalName: s.canonicalName,
        originalName: s.originalExtractedName,
        evidenceSentence: s.evidenceSentence,
      }));

    const preferredSkills = analysis.extractedSkills
      .filter(s => s.importance === 'preferred')
      .map(s => ({
        canonicalName: s.canonicalName,
        originalName: s.originalExtractedName,
        evidenceSentence: s.evidenceSentence,
      }));

    // Find main experience requirement if present
    const mainExp = analysis.experienceRequirements.length > 0
      ? analysis.experienceRequirements[0].mention
      : 'Not explicitly specified';

    // Save JD
    const jd = await jdRepo.create({
      userId: req.user.id,
      title: cleanTitle,
      company: cleanCompany,
      rawText: text.trim(),
      experienceRequirement: mainExp,
      requiredSkills,
      preferredSkills,
    });

    const jdId = jd._id || jd.id;

    // Save Extracted Skills
    for (const skill of analysis.extractedSkills) {
      await extractedSkillRepo.create({
        documentType: 'job_description',
        documentId: jdId,
        userId: req.user.id,
        canonicalName: skill.canonicalName,
        originalExtractedName: skill.originalExtractedName,
        category: skill.category,
        importance: skill.importance,
        confidenceScore: skill.confidenceScore,
        evidenceSentence: skill.evidenceSentence,
        sourceLocation: {
          lineNumber: skill.sourceLineNumber,
        },
      });
    }

    res.status(201).json({
      success: true,
      jobDescription: {
        id: jdId,
        title: jd.title,
        company: jd.company,
        experienceRequirement: mainExp,
        totalSkillsIdentified: analysis.extractedSkills.length,
        requiredSkillsCount: requiredSkills.length,
        preferredSkillsCount: preferredSkills.length,
        requiredSkills,
        preferredSkills,
        experienceRequirements: analysis.experienceRequirements,
        createdAt: jd.createdAt,
      },
    });
  } catch (error) {
    console.error('Job Description Parse Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse and store job description.',
    });
  }
};

// Get all JDs for user
const getJobDescriptions = async (req, res) => {
  try {
    const list = await jdRepo.find({ userId: req.user.id });
    res.json({
      success: true,
      count: list.length,
      jobDescriptions: list.map(j => ({
        id: j._id || j.id,
        title: j.title,
        company: j.company,
        experienceRequirement: j.experienceRequirement,
        requiredCount: j.requiredSkills ? j.requiredSkills.length : 0,
        preferredCount: j.preferredSkills ? j.preferredSkills.length : 0,
        createdAt: j.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve job descriptions.',
    });
  }
};

// Get single JD by ID
const getJobDescriptionById = async (req, res) => {
  try {
    const jd = await jdRepo.findById(req.params.id);

    if (!jd) {
      return res.status(404).json({
        success: false,
        error: 'Job description not found.',
      });
    }

    if (String(jd.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not own this job description.',
      });
    }

    res.json({
      success: true,
      jobDescription: jd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve job description.',
    });
  }
};

// Delete JD
const deleteJobDescription = async (req, res) => {
  try {
    const jd = await jdRepo.findById(req.params.id);

    if (!jd) {
      return res.status(404).json({
        success: false,
        error: 'Job description not found.',
      });
    }

    if (String(jd.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not own this job description.',
      });
    }

    await jdRepo.findByIdAndDelete(req.params.id);
    await extractedSkillRepo.deleteMany({ documentId: req.params.id });

    res.json({
      success: true,
      message: 'Job description deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete job description.',
    });
  }
};

module.exports = {
  createJobDescription,
  getJobDescriptions,
  getJobDescriptionById,
  deleteJobDescription,
};
