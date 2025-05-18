// mcp-handlers.js
const api = require('./api');

// Description du MCP pour Claude
function describeMCP(req, res) {
  res.json({
    name: "Légifrance",
    description: "Recherche et consultation de textes juridiques français via l'API Légifrance",
    endpoints: [
      {
        name: "searchLaw",
        description: "Recherche des textes juridiques français",
        parameters: {
          query: {
            type: "string",
            description: "Termes de recherche"
          }
        }
      },
      {
        name: "getLawById",
        description: "Récupère un texte juridique spécifique par son identifiant",
        parameters: {
          textId: {
            type: "string",
            description: "Identifiant du texte juridique"
          },
          textType: {
            type: "string",
            description: "Type de texte (code, article, loi, etc.)",
            enum: ["code", "article", "loi", "jorf", "jurisprudence"]
          }
        }
      }
    ]
  });
}

// Exécution des endpoints MCP
async function executeMCP(req, res) {
  const { endpoint, parameters } = req.body;
  
  try {
    if (endpoint === 'searchLaw') {
      const result = await api.searchLaw(parameters.query);
      
      // Formatage de la réponse pour Claude
      const formattedResults = result.results.map(item => ({
        title: item.title,
        id: item.id,
        type: item.type,
        nature: item.nature,
        url: item.url,
        excerpt: item.textExtract
      }));
      
      res.json({ results: formattedResults });
    } 
    else if (endpoint === 'getLawById') {
      const result = await api.getLawById(parameters.textId, parameters.textType);
      
      // Formatage de la réponse selon le type de texte
      let formattedResponse;
      if (parameters.textType === 'code') {
        formattedResponse = {
          title: result.title,
          text: result.text,
          articles: result.articles.map(a => ({
            id: a.id,
            content: a.content
          }))
        };
      } else {
        formattedResponse = result;
      }
      
      res.json(formattedResponse);
    }
    else {
      res.status(400).json({ error: "Endpoint inconnu" });
    }
  } catch (error) {
    console.error('Erreur MCP:', error);
    res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête' });
  }
}

module.exports = {
  describeMCP,
  executeMCP
};