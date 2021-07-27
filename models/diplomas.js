const mongoose = require("mongoose");

const diplomaSchema = new mongoose.Schema({
  name: String,
  year: Number,
  curriculum: String,
  promo: Number,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "schools" },
  studentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  templateName: String 
});

const diplomaModel = mongoose.model('diplomas', diplomaSchema);

module.exports = diplomaModel;
