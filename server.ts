/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Import Vercel handlers for local Express backend routing
import chatHandler from './api/chat.js';
import generateReflectionHandler from './api/generate-reflection.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Add Request Logging Middleware to aid debugging
app.use((req, res, next) => {
  console.log(`[local-server] ${req.method} ${req.url}`);
  next();
});

// Delegate Express routes directly to the modular Vercel API handlers
app.post('/api/chat', (req, res) => {
  chatHandler(req, res).catch((err) => {
    console.error('Unhandled chat exception in local Express:', err);
    res.status(500).json({ error: err.message || 'Internals Error' });
  });
});

app.post('/api/generate-reflection', (req, res) => {
  generateReflectionHandler(req, res).catch((err) => {
    console.error('Unhandled reflection exception in local Express:', err);
    res.status(500).json({ error: err.message || 'Internals Error' });
  });
});

// Dev server Setup & Production serving configs
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
