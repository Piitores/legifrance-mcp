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

// Ajout des headers CORS pour permettre l'accès depuis d'autres domaines
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Route par défaut
app.get('/', (req, res) => {
  res.redirect('/health');
});

// Endpoint pour la vérification de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Points d'entrée MCP (Claude) - acceptent maintenant GET et POST
app.post('/mcp/describe', mcpHandlers.describeMCP);
app.get('/mcp/describe', mcpHandlers.describeMCP); // Ajout du support GET

app.post('/mcp/execute', mcpHandlers.executeMCP);
app.get('/mcp/execute', (req, res) => {
  res.json({ error: "La méthode GET n'est pas prise en charge pour /mcp/execute. Veuillez utiliser POST." });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} non trouvée` });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur MCP Légifrance démarré sur le port ${PORT}`);
});