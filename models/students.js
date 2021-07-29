const mongoose = require("mongoose");

const diplomSchema = new mongoose.Schema({
  url_SmartContract: String,
  mention: String,
  status: String,
  id_batch: { type: mongoose.Schema.Types.ObjectId, ref: "batches" },
})

const studentSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  birth_date: {type: String},
  diplomas: [diplomSchema]
});

module.exports = mongoose.model('students', studentSchema);

