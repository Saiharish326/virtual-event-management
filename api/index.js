// Vercel API route handler
const express = require('express');
const app = express();

// Import your main app
require('../app.js');

// Export for Vercel
module.exports = app;
