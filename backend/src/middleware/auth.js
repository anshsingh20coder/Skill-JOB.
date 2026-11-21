const jwt = require('jsonwebtoken');
const { userRepo } = require('../services/dataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'skillgap_ai_jwt_secret_production_key_2026_super_secure';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please provide a valid token.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepo.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User belonging to this token no longer exists.',
      });
    }

    req.user = {
      _id: user._id || user.id,
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token.',
    });
  }
};

module.exports = {
  protect,
  JWT_SECRET,
};
