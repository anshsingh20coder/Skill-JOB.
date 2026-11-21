const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const AnalysisResult = require('../models/AnalysisResult');
const LearningPlan = require('../models/LearningPlan');
const SkillSynonym = require('../models/SkillSynonym');
const ExtractedSkill = require('../models/ExtractedSkill');

// In-memory fallback collections
const memStore = {
  users: new Map(),
  resumes: new Map(),
  jobDescriptions: new Map(),
  analysisResults: new Map(),
  learningPlans: new Map(),
  skillSynonyms: new Map(),
  extractedSkills: new Map(),
};

const isMongoActive = () => mongoose.connection.readyState === 1;

function matchFilter(item, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const [key, val] of Object.entries(filter)) {
    const itemVal = item[key];
    if (val && typeof val === 'object' && val.$in) {
      if (!val.$in.includes(itemVal)) return false;
    } else if (String(itemVal) !== String(val)) {
      return false;
    }
  }
  return true;
}

function createRepo(Model, memKey) {
  return {
    async create(data) {
      if (isMongoActive()) {
        const doc = new Model(data);
        return await doc.save();
      }
      const _id = data._id ? String(data._id) : uuidv4();
      const record = {
        ...data,
        _id,
        id: _id,
        createdAt: data.createdAt || new Date(),
        updatedAt: new Date(),
      };
      memStore[memKey].set(_id, record);
      return { ...record };
    },

    async find(filter = {}) {
      if (isMongoActive()) {
        return await Model.find(filter).sort({ createdAt: -1 });
      }
      const list = [];
      for (const item of memStore[memKey].values()) {
        if (matchFilter(item, filter)) {
          list.push({ ...item });
        }
      }
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async findOne(filter = {}) {
      if (isMongoActive()) {
        return await Model.findOne(filter);
      }
      for (const item of memStore[memKey].values()) {
        if (matchFilter(item, filter)) {
          return { ...item };
        }
      }
      return null;
    },

    async findById(id) {
      if (isMongoActive()) {
        return await Model.findById(id);
      }
      const item = memStore[memKey].get(String(id));
      return item ? { ...item } : null;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      if (isMongoActive()) {
        return await Model.findByIdAndUpdate(id, update, { new: true, ...options });
      }
      const key = String(id);
      const existing = memStore[memKey].get(key);
      if (!existing) return null;
      const updated = {
        ...existing,
        ...(update.$set || update),
        updatedAt: new Date(),
      };
      memStore[memKey].set(key, updated);
      return { ...updated };
    },

    async findByIdAndDelete(id) {
      if (isMongoActive()) {
        return await Model.findByIdAndDelete(id);
      }
      const key = String(id);
      const existing = memStore[memKey].get(key);
      if (existing) {
        memStore[memKey].delete(key);
        return { ...existing };
      }
      return null;
    },

    async deleteMany(filter = {}) {
      if (isMongoActive()) {
        return await Model.deleteMany(filter);
      }
      let count = 0;
      for (const [key, item] of memStore[memKey].entries()) {
        if (matchFilter(item, filter)) {
          memStore[memKey].delete(key);
          count++;
        }
      }
      return { deletedCount: count };
    },

    async countDocuments(filter = {}) {
      if (isMongoActive()) {
        return await Model.countDocuments(filter);
      }
      let count = 0;
      for (const item of memStore[memKey].values()) {
        if (matchFilter(item, filter)) count++;
      }
      return count;
    }
  };
}

const userRepo = createRepo(User, 'users');
const resumeRepo = createRepo(Resume, 'resumes');
const jdRepo = createRepo(JobDescription, 'jobDescriptions');
const analysisRepo = createRepo(AnalysisResult, 'analysisResults');
const learningPlanRepo = createRepo(LearningPlan, 'learningPlans');
const synonymRepo = createRepo(SkillSynonym, 'skillSynonyms');
const extractedSkillRepo = createRepo(ExtractedSkill, 'extractedSkills');

module.exports = {
  userRepo,
  resumeRepo,
  jdRepo,
  analysisRepo,
  learningPlanRepo,
  synonymRepo,
  extractedSkillRepo,
  memStore,
};
