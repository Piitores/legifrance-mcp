// index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mcpHandlers = require('./mcp-handlers');

// Configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint pour la vérification de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Points d'entrée MCP (Claude)
app.post('/mcp/describe', mcpHandlers.describeMCP);
app.post('/mcp/execute', mcpHandlers.executeMCP);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur MCP Légifrance démarré sur le port ${PORT}`);
});