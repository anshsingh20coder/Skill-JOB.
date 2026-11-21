const { JobStore } = require('../models/dataStore');
const { extractSkillsFromText } = require('../ai/skillExtractor');

async function createJobDescription(req, res) {
  try {
    const { title, rawText } = req.body;
    if (!rawText || rawText.trim().length < 15) {
      return res.status(400).json({ error: 'Please provide a detailed job description.' });
    }

    const { skills, sentences } = extractSkillsFromText(rawText, true);

    const requiredSkills = skills.filter(s => s.priority === 'required');
    const preferredSkills = skills.filter(s => s.priority === 'preferred');

    const userId = req.user ? req.user.id : 'demo-guest-user';

    const savedJob = await JobStore.create({
      userId,
      title: title?.trim() || 'Untitled Job Position',
      rawText: rawText.trim(),
      skillsCount: skills.length,
      requiredSkillsCount: requiredSkills.length,
      preferredSkillsCount: preferredSkills.length,
      extractedSkills: skills,
      sentences: sentences
    });

    return res.status(201).json({
      message: 'Job description analyzed and saved successfully',
      job: savedJob
    });
  } catch (err) {
    console.error('Job creation error:', err);
    return res.status(500).json({ error: 'Failed to process job description: ' + err.message });
  }
}

async function getUserJobDescriptions(req, res) {
  try {
    const userId = req.user ? req.user.id : 'demo-guest-user';
    const jobs = await JobStore.find({ userId });
    return res.json({ jobs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load job descriptions' });
  }
}

async function getJobById(req, res) {
  try {
    const job = await JobStore.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job description not found' });
    }
    return res.json({ job });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch job description' });
  }
}

async function deleteJob(req, res) {
  try {
    const job = await JobStore.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job description not found' });
    }
    await JobStore.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Job description deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete job description' });
  }
}

module.exports = {
  createJobDescription,
  getUserJobDescriptions,
  getJobById,
  deleteJob
};
