const mongoose = require('mongoose');

const skillSynonymSchema = new mongoose.Schema({
  canonicalName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'Frontend',
      'Backend',
      'Full Stack',
      'Database',
      'DevOps & Cloud',
      'Programming Languages',
      'Testing & QA',
      'Data & AI',
      'Mobile',
      'Architecture & Methodologies',
      'Soft Skills',
      'Tools & Other'
    ],
    default: 'Tools & Other',
  },
  synonyms: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  relatedSkills: [{
    type: String,
  }],
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('SkillSynonym', skillSynonymSchema);
