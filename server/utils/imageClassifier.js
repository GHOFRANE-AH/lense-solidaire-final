const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

async function classifyImage(imagePath) {
  const imageStream = fs.createReadStream(imagePath);
  const ext = path.extname(imagePath).toLowerCase();

  // Déterminer le bon type MIME
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

const response = await fetch('https://api-inference.huggingface.co/models/microsoft/resnet-50', {
    
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
      'Content-Type': contentType,
    },
    body: imageStream,
  });

  const result = await response.json();
  console.log('🔍 Réponse Hugging Face :', result);

  if (Array.isArray(result)) {
    return result[0].label.toLowerCase();
  } else {
    throw new Error('Erreur de classification');
  }
}

module.exports = classifyImage;
