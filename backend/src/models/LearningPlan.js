const mongoose = require('mongoose');

const learningPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisResult',
    required: true,
  },
  topMissingSkills: [{
    type: String,
    required: true,
  }],
  title: {
    type: String,
    default: '14-Day Targeted Skill Acquisition Plan',
  },
  totalDays: {
    type: Number,
    default: 14,
  },
  dailySchedules: [{
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 14,
    },
    skill: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    learningObjective: {
      type: String,
      required: true,
    },
    practicalTask: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: String,
      default: '1.5 - 2 Hours',
    },
    freeResources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['Documentation', 'Interactive Tutorial', 'Video', 'Article', 'CheatSheet'],
        default: 'Documentation',
      }
    }],
    miniProject: {
      title: String,
      instructions: String,
      deliverable: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('LearningPlan', learningPlanSchema);
