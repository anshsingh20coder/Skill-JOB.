const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    default: 'application/pdf',
  },
  extractedText: {
    type: String,
    required: true,
  },
  extractionConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  isScanned: {
    type: Boolean,
    default: false,
  },
  hasWarnings: {
    type: Boolean,
    default: false,
  },
  warnings: [{
    type: String,
  }],
  pageCount: {
    type: Number,
    default: 1,
  },
  metadata: {
    charCount: Number,
    wordCount: Number,
    lineCount: Number,
    twoColumnLayout: Boolean,
    tableDetected: Boolean,
    ocrUsed: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
