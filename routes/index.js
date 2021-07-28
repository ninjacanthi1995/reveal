var express = require("express");
var router = express.Router();
const diplomasBatchModel = require("../models/diplomasBatch");
const diplomasStudentModel = require("../models/diplomasStudent");
const PDFDocument = require("pdfkit");
const fs = require("fs");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/create-diploma-batch", async (req, res) => {
  const searchDiploma = await diplomasBatchModel.findOne({
    year: req.body.year,
    curriculum: req.body.curriculum,
    promo: req.body.promo,
    // schoolId: req.body.schoolId,
  });
  if (searchDiploma) {
    res.json({ result: false, msg: "Diplome est deja existant" });
  } else {
    const newDiploma = new diplomasBatchModel({
      name: req.body.name,
      year: req.body.year,
      curriculum: req.body.curriculum,
      promo: req.body.promo,
      // schoolId: req.body.schoolId,
      studentsId: [],
      templateName: req.body.templateName
    });
    const savedDiploma = await newDiploma.save();
    res.json({ result: true, msg: "Diplome cree" });
  }
});

const template = {
  firstNameField: {
    positionX: 300,
    positionY: 300,
  },
  lastNameField: {
    positionX: 450,
    positionY: 300,
  },
  cursusField: {
    positionX: 425,
    positionY: 400,
  },
  promoField: {
    positionX: 415,
    positionY: 200,
  },
  yearField: {
    positionX: 500,
    positionY: 200,
  },
  logoField: {
    url: "client/public/reveal.png",
    positionX: 100,
    positionY: 50,
    scale: 0.1,
  },
  signatureField: {
    url: "client/public/signature.png",
    positionX: 700,
    positionY: 550,
    scale: 0.1,
  },
  mentionField: {
    positionX: 410,
    positionY: 450,
  },
};

const student = {
  firstName: "Minh Chau",
  lastName: "Hoang",
};

const diploma = {
  cursus: "Web Dev Fullstack JS",
  promo: 34,
  year: 2021,
  mention: "Tres bien",
};

router.get("/create-pdf", async (req, res) => {
  // const template = await templateModel.findOne({ name: req.body.templateName });
  // const student = await studentModel.findById({ id: req.body.studentId });
  // const diploma = await diplomaModel.findOne({ name: req.body.diplomaName });
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });
  doc.pipe(fs.createWriteStream("output.pdf"));
  doc.text(
    student.firstName,
    template.firstNameField.positionX,
    template.firstNameField.positionY
  );
  doc.text(
    student.lastName,
    template.lastNameField.positionX,
    template.lastNameField.positionY
  );
  doc.text(
    diploma.cursus,
    template.cursusField.positionX,
    template.cursusField.positionY
  );
  doc.text(
    "Promo " + diploma.promo,
    template.promoField.positionX,
    template.promoField.positionY
  );
  doc.text(
    diploma.year,
    template.yearField.positionX,
    template.yearField.positionY
  );
  doc.image(
    template.logoField.url,
    template.logoField.positionX,
    template.logoField.positionY,
    { scale: template.logoField.scale }
  );
  doc.image(
    template.signatureField.url,
    template.signatureField.positionX,
    template.signatureField.positionY,
    { scale: template.signatureField.scale }
  );
  doc.text(
    "Mention: " + diploma.mention,
    template.mentionField.positionX,
    template.mentionField.positionY
  );
  doc.end();

  res.json({ result: true, path: '/output.pdf' });
});

router.post('/create-student-diploma', async (req, res) => {
  if (req.body.status === "Info validees") {
    const searchDiploma = await diplomasStudentModel.findOne({
      batchDiplomaId: req.body.batchDiplomaId,
      mention: req.body.mention
    })  
    if (searchDiploma) {
      res.json({ result: false, msg: "Diploma deja existant" })
    } else {
      const newDiploma = new diplomasStudentModel({
        batchDiplomaId: req.body.batchDiplomaId,
        mention: req.body.mention,
        status: req.body.status,
        urlSmartContract: 'abc'
      })
      await newDiploma.save();
      res.json({ result: true, msg: "Diplome cree" });
    }
  }
})

router.get('/get-student-diploma', async (req, res) => {
  const searchDiploma = await diplomasStudentModel.findById(req.query.diplomaId);
  if (searchDiploma) {

  }
})

module.exports = router;
