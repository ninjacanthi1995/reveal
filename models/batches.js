const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  year: Number,
  curriculum: String,
  promo: Number,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "schools" },
  studentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  templateName: String 
});

const BatchModel = mongoose.model('batches', batchSchema);

module.exports = BatchModel;
