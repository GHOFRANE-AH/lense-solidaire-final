const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const Rule = require('./models/Rule');
const classifyImage = require('./utils/imageClassifier');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion MongoDB réussie'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err.message));

// 📁 Middleware pour upload d’image
const upload = multer({ dest: 'uploads/' });

// 🌐 Traduction des noms IA vers noms en base
function traduireNom(nomIA) {
  const dictionnaire = {
    // Vaisselle & cuisine
    'cup': 'tasse',
    'teacup': 'tasse',
    'mug': 'tasse',
    'plate': 'assiette',
    'plate rack': 'assiette',
    'tray': 'plateau',
    'soup bowl': 'bol',
    'mixing bowl': 'bol',
    'pan': 'casserole',
    'frying pan': 'poêle',
    'frypan': 'poêle',
    'skillet': 'poêle',
    'pot': 'cocotte',
    'dutch oven': 'cocotte',
    'pressure cooker': 'cocotte minute',

    // Meubles
    'chair': 'chaise',
    'folding chair': 'chaise pliante',
    'rocking chair': 'chaise à bascule',
    'rocker': 'chaise à bascule',
    'pedestal': 'chaise',
    'plinth': 'chaise',
    'footstall': 'chaise',
    'dining table': 'table à manger',
    'board': 'table à manger',
    'table': 'table à manger',
    'desk': 'bureau',

    // Électroménager
    'vacuum': 'aspirateur',
    'vacuum cleaner': 'aspirateur',
    'hoover': 'aspirateur',
    'iron': 'fer à repasser',
    'smoothing iron': 'fer à repasser',
    'steam iron': 'fer à repasser',
  };

  const nomNettoye = nomIA.toLowerCase().trim();

  // 🔍 Recherche exacte
  if (dictionnaire[nomNettoye]) {
    return dictionnaire[nomNettoye];
  }

  // 🔍 Recherche partielle
  for (const [cleIA, traduction] of Object.entries(dictionnaire)) {
    if (nomNettoye.includes(cleIA)) {
      return traduction;
    }
  }

  // 🔙 Retour brut si rien trouvé
  return nomNettoye;
}
// 🔐 Route de connexion admin
app.post('/admin/login', (req, res) => {
  const { login, password } = req.body;
  const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Identifiants incorrects' });
  }
});

// 📷 Route d’estimation d’objet
app.post('/estimation', upload.single('image'), async (req, res) => {
  const { etat, taille } = req.body;
  const imagePath = req.file.path;

  try {
    const nomObjetIA = await classifyImage(imagePath);
    console.log('🧠 Objet IA brut :', nomObjetIA);

    const nomObjet = traduireNom(nomObjetIA);
    console.log('🔤 Objet traduit :', nomObjet);

    const rule = await Rule.findOne({
      nom: { $regex: new RegExp(nomObjet, 'i') },
      etat,
      taille,
    });

    console.log('📦 Règle trouvée :', rule);

    if (rule) {
      res.json({ prix: rule.prix, nomObjet });
    } else {
      res.json({ prix: 0, nomObjet, message: 'Aucune règle trouvée' });
    }
  } catch (err) {
    console.error('❌ Erreur estimation :', err.message);
    res.status(500).json({ error: 'Erreur lors de l’estimation' });
  }
});

// 📝 Route d’ajout de règle
app.post('/admin/rules', async (req, res) => {
  try {
    console.log('📦 Données reçues :', req.body);
    const rule = new Rule(req.body);
    await rule.save();
    res.json({ message: 'Règle enregistrée avec succès !' });
  } catch (err) {
    console.error('❌ Erreur lors de l’enregistrement :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📋 Route pour récupérer toutes les règles
app.get('/admin/rules', async (req, res) => {
  try {
    const rules = await Rule.find().sort({ nom: 1 });
    res.json(rules);
  } catch (err) {
    console.error('❌ Erreur récupération des règles :', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des règles' });
  }
});

// 🔄 Route pour modifier une règle
app.put('/admin/rules/:id', async (req, res) => {
  try {
    const updated = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// 🗑️ Route pour supprimer une règle
app.delete('/admin/rules/:id', async (req, res) => {
  try {
    await Rule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Règle supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// 🚀 Lancement du serveur
app.listen(5000, () => {
  console.log('🚀 Serveur backend lancé sur http://localhost:5000');
});
