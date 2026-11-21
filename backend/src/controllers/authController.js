const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepo } = require('../services/dataStore');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await userRepo.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepo.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      targetRole: targetRole || 'Full Stack Software Engineer',
      experienceLevel: experienceLevel || 'entry',
    });

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration.',
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepo.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login.',
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching user.',
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, targetRole, experienceLevel } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (targetRole) updates.targetRole = targetRole.trim();
    if (experienceLevel) updates.experienceLevel = experienceLevel;

    const user = await userRepo.findByIdAndUpdate(req.user.id, updates);

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile.',
    });
  }
};

// Demo user login convenience
exports.demoLogin = async (req, res) => {
  try {
    const demoEmail = 'alex.dev@skillgap.ai';
    let user = await userRepo.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('SkillGapDemo123!', salt);
      user = await userRepo.create({
        name: 'Alex Rivera',
        email: demoEmail,
        password: hashedPassword,
        targetRole: 'Full Stack Developer',
        experienceLevel: 'mid',
      });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Demo login error',
    });
  }
};
