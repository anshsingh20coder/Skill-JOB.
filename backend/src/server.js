require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDbStatus } = require('./utils/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jdRoutes = require('./routes/jdRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const skillRoutes = require('./routes/skillRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging (sanitized, avoiding sensitive document bodies)
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'SkillGap AI Backend',
    version: '1.0.0',
    database: getDbStatus(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jdRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/skills', skillRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.',
  });
});

let server = null;
let isStarting = false;

const startServer = (port = PORT) => {
  if (isStarting || (server && server.listening)) {
    return Promise.resolve(server);
  }
  isStarting = true;
  return new Promise((resolve, reject) => {
    server = app.listen(port, async () => {
      console.log(`=================================================`);
      console.log(`🚀 SkillGap AI Backend running on port ${port}`);
      console.log(`📡 URL: http://localhost:${port}`);
      console.log(`   Health Check: http://localhost:${port}/api/health`);
      console.log(`=================================================`);
      await connectDB();
      resolve(server);
    }).on('error', (err) => {
      isStarting = false;
      reject(err);
    });
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

module.exports = { app, startServer, getDbStatus };
