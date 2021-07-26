const mongoose = require("mongoose");

const diplomaSchema = new mongoose.Schema({
  year: Number,
  curriculum: String,
  promo: Number,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "schools" },
  studentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
});

const diplomaModel = mongoose.model('diplomas', diplomaSchema);

module.exports = diplomaModel;
