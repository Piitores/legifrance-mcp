// auth.js
require('dotenv').config();
const axios = require('axios');

// Configuration OAuth2
const CLIENT_ID = process.env.LEGIFRANCE_CLIENT_ID;
const CLIENT_SECRET = process.env.LEGIFRANCE_CLIENT_SECRET;
const TOKEN_URL = 'https://oauth.piste.gouv.fr/api/oauth/token';

let accessToken = null;
let tokenExpiry = 0;

// Fonction pour obtenir un token d'accès
async function getAccessToken() {
  // Vérifier si le token est encore valide
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }
  
  try {
    // Requête pour obtenir un nouveau token
    const response = await axios.post(
      TOKEN_URL,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        }
      }
    );
    
    accessToken = response.data.access_token;
    // Définir l'expiration (généralement 3600 secondes = 1 heure)
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    return accessToken;
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    throw new Error('Échec de l\'authentification à l\'API Légifrance');
  }
}

module.exports = { getAccessToken };