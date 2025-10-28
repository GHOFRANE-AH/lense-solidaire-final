const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { type: String, required: true },
  etat: { type: String, required: true },
  taille: { type: String },
  prix: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model('Rule', ruleSchema);
