const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const Rule = require('./models/Rule');
const classifyImage = require('./utils/imageClassifier');
const otpStore = {}; // { email: { code, expiresAt } }
const nodemailer = require('nodemailer');



const app = express();
app.use(cors());
app.use(express.json());



// 🔗 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion MongoDB réussie'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err.message));

// 📁 Middleware pour upload d’image
const upload = multer({ dest: 'uploads/' });

// 🔐 Middleware de vérification du token admin
function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token || token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Accès refusé : token invalide' });
  }
  next();
}


const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

app.post('/admin/login', async (req, res) => {
  const { login, password } = req.body;
  if (login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore[login] = { code, expiresAt };

  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.ADMIN_EMAIL,
            Name: 'Lense Solidaire'
          },
          To: [
            {
              Email: process.env.ADMIN_EMAIL,
              Name: 'Admin'
            }
          ],
          Subject: 'Code de vérification',
          TextPart: `Votre code temporaire est : ${code}`
        }
      ]
    });

    res.json({ success: true, message: 'Code OTP envoyé par email' });
  } catch (err) {
    console.error('Erreur Mailjet :', err.message);
    res.status(500).json({ error: 'Erreur lors de l’envoi du code' });
  }
});


app.post('/admin/verify', (req, res) => {
  const { login, code } = req.body;
  const record = otpStore[login];

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Code expiré ou invalide' });
  }

  if (record.code !== code) {
    return res.status(401).json({ error: 'Code incorrect' });
  }

  delete otpStore[login];
  res.json({ success: true, token: process.env.ADMIN_TOKEN });
});


app.listen(5000, () => console.log('✅ Serveur lancé sur http://localhost:5000'));
// 🌐 Traduction des noms IA vers noms en base
function traduireNom(nomIA) {
  const dictionnaire = {
    'cup': 'tasse', 'teacup': 'tasse', 'mug': 'tasse',
    'plate': 'assiette', 'plate rack': 'assiette', 'tray': 'plateau',
    'soup bowl': 'bol', 'mixing bowl': 'bol',
    'pan': 'casserole', 'frying pan': 'poêle', 'frypan': 'poêle',
    'skillet': 'poêle', 'pot': 'cocotte', 'dutch oven': 'cocotte',
    'pressure cooker': 'cocotte minute',
    'chair': 'chaise', 'folding chair': 'chaise pliante',
    'rocking chair': 'chaise à bascule', 'rocker': 'chaise à bascule',
    'pedestal': 'chaise', 'plinth': 'chaise', 'footstall': 'chaise',
    'dining table': 'table à manger', 'board': 'table à manger',
    'table': 'table à manger', 'desk': 'bureau',
    'vacuum': 'aspirateur', 'vacuum cleaner': 'aspirateur',
    'hoover': 'aspirateur', 'iron': 'fer à repasser',
    'smoothing iron': 'fer à repasser', 'steam iron': 'fer à repasser',
  };

  const nomNettoye = nomIA.toLowerCase().trim();
  if (dictionnaire[nomNettoye]) return dictionnaire[nomNettoye];

  for (const [cleIA, traduction] of Object.entries(dictionnaire)) {
    if (nomNettoye.includes(cleIA)) return traduction;
  }

  return nomNettoye;
}

// 🔐 Route de connexion admin
app.post('/admin/login', (req, res) => {
  const { login, password } = req.body;
  if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: process.env.ADMIN_TOKEN });
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
    const nomObjet = traduireNom(nomObjetIA);

    const rule = await Rule.findOne({
      nom: { $regex: new RegExp(nomObjet, 'i') },
      etat,
      taille,
    });

    if (rule) {
      res.json({ prix: rule.prix, nomObjet });
    } else {
      res.json({ prix: 0, nomObjet, message: 'Aucune règle trouvée' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’estimation' });
  }
});

// 📝 Route d’ajout de règle (protégée)
app.post('/admin/rules', verifyAdminToken, async (req, res) => {
  try {
    const rule = new Rule(req.body);
    await rule.save();
    res.json({ message: 'Règle enregistrée avec succès !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Route pour récupérer toutes les règles (protégée)
app.get('/admin/rules', verifyAdminToken, async (req, res) => {
  try {
    const rules = await Rule.find().sort({ nom: 1 });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des règles' });
  }
});

// 🔄 Route pour modifier une règle (protégée)
app.put('/admin/rules/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// 🗑️ Route pour supprimer une règle (protégée)
app.delete('/admin/rules/:id', verifyAdminToken, async (req, res) => {
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
