const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Variables pour stocker le token
let accessToken = null;
let tokenExpiration = 0;

// Fonction pour obtenir un token
async function getToken() {
  // Si le token est valide, on le réutilise
  if (accessToken && tokenExpiration > Date.now()) {
    return accessToken;
  }

  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://sandbox-oauth.piste.gouv.fr/api/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&scope=openid`
    });

    accessToken = tokenResponse.data.access_token;
    // Expiration en millisecondes (avec une marge de sécurité de 60 secondes)
    tokenExpiration = Date.now() + (tokenResponse.data.expires_in - 60) * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token:', error.response?.data || error.message);
    throw new Error('Erreur d\'authentification');
  }
}

// Endpoint pour la recherche
app.post('/search', async (req, res) => {
  try {
    const token = await getToken();
    
    const response = await axios({
      method: 'post',
      url: 'https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app/search',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Erreur de recherche:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erreur lors de la recherche',
      details: error.response?.data || error.message
    });
  }
});

// Endpoint pour obtenir un article
app.post('/getArticle', async (req, res) => {
  try {
    const token = await getToken();
    
    const response = await axios({
      method: 'post',
      url: 'https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app/consult/getArticle',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erreur lors de la récupération de l\'article',
      details: error.response?.data || error.message
    });
  }
});

// Endpoint pour obtenir un code
app.post('/getCode', async (req, res) => {
  try {
    const token = await getToken();
    
    const response = await axios({
      method: 'post',
      url: 'https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app/consult/code',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération du code:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erreur lors de la récupération du code',
      details: error.response?.data || error.message
    });
  }
});

// Endpoint pour obtenir un texte LODA
app.post('/getLoda', async (req, res) => {
  try {
    const token = await getToken();
    
    const response = await axios({
      method: 'post',
      url: 'https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app/consult/legiPart',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: req.body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération du texte LODA:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: 'Erreur lors de la récupération du texte LODA',
      details: error.response?.data || error.message
    });
  }
});

// Route pour l'envoi du manifeste
app.get('/.well-known/ai-plugin.json', (req, res) => {
  const manifest = require('./manifest.json');
  res.json(manifest);
});

// Route pour l'envoi du schéma OpenAPI
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(__dirname + '/openapi.yaml');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur MCP démarré sur le port ${PORT}`);
}); 