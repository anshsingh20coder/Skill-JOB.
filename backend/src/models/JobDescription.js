const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Software Role',
  },
  company: {
    type: String,
    default: 'Target Company',
  },
  rawText: {
    type: String,
    required: true,
  },
  experienceRequirement: {
    type: String,
    default: 'Not specified',
  },
  requiredSkills: [{
    canonicalName: String,
    originalName: String,
    evidenceSentence: String,
  }],
  preferredSkills: [{
    canonicalName: String,
    originalName: String,
    evidenceSentence: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
