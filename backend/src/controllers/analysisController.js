const { extractSkillsFromText } = require('../ai/skillExtractor');
const { analyzeSkillGap } = require('../ai/matchingEngine');
const { generate14DayLearningPlan } = require('../ai/learningPlanner');
const {
  resumeRepo,
  jdRepo,
  analysisRepo,
  learningPlanRepo,
} = require('../services/dataStore');

// Run Resume vs Job Description Gap Analysis
const runAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescriptionId, customRoleTitle } = req.body;

    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both resumeId and jobDescriptionId.',
      });
    }

    // Retrieve documents
    const resume = await resumeRepo.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume document not found.',
      });
    }

    const jd = await jdRepo.findById(jobDescriptionId);
    if (!jd) {
      return res.status(404).json({
        success: false,
        error: 'Job description document not found.',
      });
    }

    // Verify ownership
    if (String(resume.userId) !== String(req.user.id) || String(jd.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not have permission to analyze these documents.',
      });
    }

    console.log(`[Analysis] Running gap analysis for user ${req.user.id}...`);

    // Extract skills fresh from documents
    const resumeSkillExtraction = extractSkillsFromText(resume.extractedText, 'resume');
    const jdSkillExtraction = extractSkillsFromText(jd.rawText, 'job_description');

    // Run matching engine
    const analysis = analyzeSkillGap({
      resumeSkills: resumeSkillExtraction.extractedSkills,
      jdSkills: jdSkillExtraction.extractedSkills,
      resumeText: resume.extractedText,
      jdText: jd.rawText,
      jdExperienceReqs: jdSkillExtraction.experienceRequirements,
      resumeExtractionConfidence: resume.extractionConfidence || 100,
      roleTitle: customRoleTitle || jd.title || 'Software Engineer',
    });

    // Save Analysis Result
    const analysisDoc = await analysisRepo.create({
      userId: req.user.id,
      resumeId: resume._id || resume.id,
      jobDescriptionId: jd._id || jd.id,
      scores: analysis.scores,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      partiallyMatchedSkills: analysis.partiallyMatchedSkills,
      relatedSkills: analysis.relatedSkills,
      experienceGaps: analysis.experienceGaps,
      aiRecommendations: analysis.aiRecommendations,
    });

    const analysisId = analysisDoc._id || analysisDoc.id;

    // Generate 14-Day Learning Plan from top missing skills
    const planData = generate14DayLearningPlan(analysis.missingSkills);
    const learningPlanDoc = await learningPlanRepo.create({
      userId: req.user.id,
      analysisId,
      topMissingSkills: planData.topMissingSkills,
      title: planData.title,
      totalDays: planData.totalDays,
      dailySchedules: planData.dailySchedules,
    });

    res.status(201).json({
      success: true,
      analysis: {
        id: analysisId,
        resumeInfo: {
          id: resume._id || resume.id,
          name: resume.originalName,
          extractionConfidence: resume.extractionConfidence,
        },
        jdInfo: {
          id: jd._id || jd.id,
          title: jd.title,
          company: jd.company,
        },
        scores: analysis.scores,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        partiallyMatchedSkills: analysis.partiallyMatchedSkills,
        relatedSkills: analysis.relatedSkills,
        experienceGaps: analysis.experienceGaps,
        aiRecommendations: analysis.aiRecommendations,
        learningPlan: {
          id: learningPlanDoc._id || learningPlanDoc.id,
          title: learningPlanDoc.title,
          topMissingSkills: learningPlanDoc.topMissingSkills,
          totalDays: learningPlanDoc.totalDays,
          dailySchedules: learningPlanDoc.dailySchedules,
        },
        createdAt: analysisDoc.createdAt,
      },
    });
  } catch (error) {
    console.error('[Analysis Error]:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete gap analysis.',
    });
  }
};

// Get Analysis History for user
const getAnalysisHistory = async (req, res) => {
  try {
    const list = await analysisRepo.find({ userId: req.user.id });

    const enrichedHistory = await Promise.all(
      list.map(async (item) => {
        const resume = await resumeRepo.findById(item.resumeId);
        const jd = await jdRepo.findById(item.jobDescriptionId);

        return {
          id: item._id || item.id,
          resumeName: resume ? resume.originalName : 'Uploaded Resume',
          jobTitle: jd ? jd.title : 'Target Position',
          company: jd ? jd.company : 'Company',
          overallMatchPercentage: item.scores ? item.scores.overallMatchPercentage : 0,
          requiredMatchPercentage: item.scores ? item.scores.requiredMatchPercentage : 0,
          matchedCount: item.matchedSkills ? item.matchedSkills.length : 0,
          missingCount: item.missingSkills ? item.missingSkills.length : 0,
          createdAt: item.createdAt,
        };
      })
    );

    res.json({
      success: true,
      count: enrichedHistory.length,
      history: enrichedHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis history.',
    });
  }
};

// Get Single Analysis by ID
const getAnalysisById = async (req, res) => {
  try {
    const item = await analysisRepo.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Analysis record not found.',
      });
    }

    if (String(item.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not own this analysis report.',
      });
    }

    const resume = await resumeRepo.findById(item.resumeId);
    const jd = await jdRepo.findById(item.jobDescriptionId);
    const learningPlan = await learningPlanRepo.findOne({ analysisId: item._id || item.id });

    res.json({
      success: true,
      analysis: {
        id: item._id || item.id,
        resumeInfo: resume ? {
          id: resume._id || resume.id,
          name: resume.originalName,
          extractionConfidence: resume.extractionConfidence,
        } : null,
        jdInfo: jd ? {
          id: jd._id || jd.id,
          title: jd.title,
          company: jd.company,
        } : null,
        scores: item.scores,
        matchedSkills: item.matchedSkills,
        missingSkills: item.missingSkills,
        partiallyMatchedSkills: item.partiallyMatchedSkills,
        relatedSkills: item.relatedSkills,
        experienceGaps: item.experienceGaps,
        aiRecommendations: item.aiRecommendations,
        learningPlan: learningPlan ? {
          id: learningPlan._id || learningPlan.id,
          title: learningPlan.title,
          topMissingSkills: learningPlan.topMissingSkills,
          totalDays: learningPlan.totalDays,
          dailySchedules: learningPlan.dailySchedules,
        } : null,
        createdAt: item.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis details.',
    });
  }
};

// Update Learning Plan Day status (completion toggle or note update)
const updateLearningPlanDay = async (req, res) => {
  try {
    const { id, dayNumber } = req.params;
    const { isCompleted, notes } = req.body;

    const plan = await learningPlanRepo.findOne({ analysisId: id });
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Learning plan not found for this analysis.',
      });
    }

    if (String(plan.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    const dayNum = parseInt(dayNumber, 10);
    const daySchedule = plan.dailySchedules.find(d => d.day === dayNum);

    if (!daySchedule) {
      return res.status(404).json({
        success: false,
        error: `Day ${dayNumber} not found in this learning plan.`,
      });
    }

    if (typeof isCompleted === 'boolean') {
      daySchedule.isCompleted = isCompleted;
    }
    if (typeof notes === 'string') {
      daySchedule.notes = notes;
    }

    await learningPlanRepo.findByIdAndUpdate(plan._id || plan.id, {
      dailySchedules: plan.dailySchedules,
    });

    res.json({
      success: true,
      message: `Day ${dayNumber} updated successfully.`,
      dailySchedules: plan.dailySchedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update learning plan schedule.',
    });
  }
};

// Delete Analysis and associated learning plan
const deleteAnalysis = async (req, res) => {
  try {
    const item = await analysisRepo.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Analysis record not found.',
      });
    }

    if (String(item.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    await analysisRepo.findByIdAndDelete(req.params.id);
    await learningPlanRepo.deleteMany({ analysisId: req.params.id });

    res.json({
      success: true,
      message: 'Analysis report and learning plan deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete analysis.',
    });
  }
};

// Export formatted plain-text / markdown gap summary
const exportAnalysis = async (req, res) => {
  try {
    const item = await analysisRepo.findById(req.params.id);
    if (!item || String(item.userId) !== String(req.user.id)) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }

    const resume = await resumeRepo.findById(item.resumeId);
    const jd = await jdRepo.findById(item.jobDescriptionId);

    const report = `# SkillGap AI - Gap Analysis Report
Generated: ${new Date(item.createdAt).toLocaleString()}
Target Position: ${jd ? jd.title : 'Software Engineer'} (${jd ? jd.company : 'Company'})
Resume File: ${resume ? resume.originalName : 'Resume'}

## Match Scores
- Overall Skill Match: ${item.scores.overallMatchPercentage}%
- Required Skills Match: ${item.scores.requiredMatchPercentage}%
- Preferred Skills Match: ${item.scores.preferredMatchPercentage}%
- Total Matched Skills: ${item.scores.totalMatchedSkills}
- Total Missing Skills: ${item.scores.totalMissingSkills}

## Matched Skills (${item.matchedSkills.length})
${item.matchedSkills.map(s => `- ${s.canonicalName} (${s.matchStatus.toUpperCase()} MATCH) [${s.category}]`).join('\n')}

## Missing Skills with JD Evidence (${item.missingSkills.length})
${item.missingSkills.map(s => `### ${s.canonicalName} (${s.importance.toUpperCase()})
- JD Evidence: "${s.jdEvidenceSentence}"
- Explanation: ${s.explanation}
- Recommended Action: ${s.suggestedAction}
`).join('\n')}

## Recommended 14-Day Priority Skills
${item.aiRecommendations.skillsToLearnFirst.map((s, idx) => `${idx + 1}. ${s.skill} - ${s.urgency}`).join('\n')}
`;

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename=skillgap-analysis-${item._id || item.id}.md`);
    res.send(report);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
};

module.exports = {
  runAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  updateLearningPlanDay,
  deleteAnalysis,
  exportAnalysis,
};
