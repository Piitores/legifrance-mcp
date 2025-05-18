// api.js
const axios = require('axios');
const auth = require('./auth');

// URL de base de l'API Légifrance
const BASE_URL = 'https://api.piste.gouv.fr/dila/legifrance/lf-engine-app';

// Fonction pour rechercher des textes juridiques
async function searchLaw(query, pageSize = 10, pageNumber = 0) {
  try {
    const token = await auth.getAccessToken();
    
    const response = await axios.post(
      `${BASE_URL}/consult/fullText`, 
      { 
        query: query,
        pageSize: pageSize,
        pageNumber: pageNumber 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
}

// Fonction pour récupérer un texte juridique par son ID
async function getLawById(textId, textType) {
  try {
    const token = await auth.getAccessToken();
    
    const response = await axios.post(
      `${BASE_URL}/consult/${textType}`, 
      { id: textId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du texte:', error);
    throw error;
  }
}

module.exports = {
  searchLaw,
  getLawById
};