const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jobDescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true,
  },
  scores: {
    overallMatchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    requiredMatchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    preferredMatchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalMatchedSkills: {
      type: Number,
      default: 0,
    },
    totalMissingSkills: {
      type: Number,
      default: 0,
    },
    totalSkillsInJD: {
      type: Number,
      default: 0,
    },
    totalSkillsInResume: {
      type: Number,
      default: 0,
    },
    resumeExtractionConfidence: {
      type: Number,
      default: 100,
    },
  },
  matchedSkills: [{
    canonicalName: String,
    originalResumeName: String,
    originalJdName: String,
    category: String,
    importance: {
      type: String,
      enum: ['required', 'preferred', 'optional'],
      default: 'required',
    },
    matchStatus: {
      type: String,
      enum: ['exact', 'synonym', 'partial', 'related'],
      default: 'exact',
    },
    confidenceScore: Number,
    resumeEvidenceSentence: String,
    jdEvidenceSentence: String,
    sourceLocation: String,
  }],
  missingSkills: [{
    canonicalName: String,
    originalJdName: String,
    category: String,
    importance: {
      type: String,
      enum: ['required', 'preferred', 'optional'],
      default: 'required',
    },
    confidenceScore: Number,
    jdEvidenceSentence: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    suggestedAction: String,
  }],
  partiallyMatchedSkills: [{
    canonicalName: String,
    resumeSkill: String,
    jdSkill: String,
    reason: String,
    jdEvidence: String,
  }],
  relatedSkills: [{
    resumeSkill: String,
    relatedJdSkill: String,
    relationship: String,
  }],
  experienceGaps: [{
    requiredExperience: String,
    candidateExperience: String,
    gapDescription: String,
    status: {
      type: String,
      enum: ['met', 'gap_detected', 'unknown'],
      default: 'gap_detected',
    }
  }],
  aiRecommendations: {
    skillsToLearnFirst: [{
      skill: String,
      reason: String,
      urgency: String,
    }],
    resumeImprovements: [{
      section: String,
      currentDefect: String,
      suggestedBulletPoint: String,
    }],
    projectRecommendations: [{
      title: String,
      skillsTargeted: [String],
      description: String,
      portfolioImpact: String,
    }],
    interviewPreparationTopics: [{
      topic: String,
      sampleQuestion: String,
      keyConcepts: [String],
    }],
    jobReadinessTips: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
