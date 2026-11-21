const { startServer } = require('./src/server');
startServer().catch(err => { console.error('Failed to start server:', err); });
