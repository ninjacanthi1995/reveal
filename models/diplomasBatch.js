const mongoose = require("mongoose");

const diplomaBatchSchema = new mongoose.Schema({
  name: String,
  year: Number,
  curriculum: String,
  promo: Number,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "schools" },
  studentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  templateName: String 
});

const diplomasBatchModel = mongoose.model('batchDiplomas', diplomaBatchSchema);

module.exports = diplomasBatchModel;
