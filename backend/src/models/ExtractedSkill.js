const mongoose = require('mongoose');

const extractedSkillSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ['resume', 'job_description'],
    required: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  canonicalName: {
    type: String,
    required: true,
  },
  originalExtractedName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  importance: {
    type: String,
    enum: ['required', 'preferred', 'optional'],
    default: 'optional',
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  evidenceSentence: {
    type: String,
    default: '',
  },
  sourceLocation: {
    section: String,
    lineNumber: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ExtractedSkill', extractedSkillSchema);
