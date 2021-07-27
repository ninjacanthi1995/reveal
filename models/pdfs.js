const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    type: String,
    data: Buffer
});

const pdfModel = mongoose.model('pdfs', pdfSchema);

module.exports = pdfModel;
