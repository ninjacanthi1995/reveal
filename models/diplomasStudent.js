const mongoose = require("mongoose");

const diplomaStudentSchema = new mongoose.Schema({
  urlSmartContract: String,
  mention: String,
  status: String,
  diplomaBatchId: { type: mongoose.Schema.Types.ObjectId, ref: "batchDiplomas" }
});

const diplomasStudentModel = mongoose.model('studentDiplomas', diplomaStudentSchema);

module.exports = diplomasStudentModel;
