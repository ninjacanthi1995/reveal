var express = require("express");
var router = express.Router();
const diplomaModel = require("../models/diplomas");
// const PDFDocument = require("pdfkit");
// const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/create-diploma", async (req, res) => {
  const searchDiploma = await diplomaModel.findOne({
    year: req.body.year,
    curriculum: req.body.curriculum,
    promo: req.body.promo,
    schoolId: req.body.schoolId,
  });
  if (searchDiploma) {
    res.json({ result: false, msg: "Diplome est deja existant" });
  } else {
    const newDiploma = new diplomaModel({
      name: req.body.name,
      year: req.body.year,
      curriculum: req.body.curriculum,
      promo: req.body.promo,
      schoolId: req.body.schoolId,
      studentsId: [],
    });
    const savedDiploma = await newDiploma.save();

    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream("output.pdf"));
    // doc.text(savedDiploma.year, 100, 100);
    // doc.end();

    res.json({ result: true, msg: "Diplome cree" });
  }
});

router.post('/envoyer-diploma', async (req, res) => {
  const template = await templateModel.findOne({ name: req.body.templateName });
  
});

module.exports = router;
