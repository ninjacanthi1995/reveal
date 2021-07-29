var express = require("express");
var router = express.Router();
const BatchModel = require("../models/batches");
const schoolModel = require("../models/schools");
const studentModel = require("../models/students");
const PDFDocument = require("pdfkit");
const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/create-batch", async (req, res) => {
  const searchBatch = await BatchModel.findOne({
    year: req.body.year,
    curriculum: req.body.curriculum,
    promo: req.body.promo,
    school_id: req.body.school_id,
  });
  if (searchBatch) {
    res.json({ result: false, msg: "Batch deja existant" });
  } else {
    const newBatch = new BatchModel({
      year: req.body.year,
      curriculum: req.body.curriculum,
      promo: req.body.promo,
      school_id: req.body.school_id,
      studentsId: [],
      templateName: req.body.templateName,
    });
    const savedBatch = await newBatch.save();
    if(savedBatch) res.json({ result: true, msg: "Batch cree" });
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

const batch = {
  cursus: "Web Dev Fullstack JS",
  promo: 34,
  year: 2021,
  mention: "Tres bien",
};

router.get("/create-pdf", async (req, res) => {
  // const searchStudent = await studentModel.findById(req.query.studentId);
  // const searchBatch = await BatchModel.findById(req.query.batchId);
  // if (!searchStudent || !searchBatch) {
  //   res.json({ result: false, msg: "Student or batch not found" });
  // } else 
  if (fs.existsSync("./client/public/diploma_student1_batch1.pdf")) {
    res.json({ result: false, msg: "File existe" });
  } else {
    // const searchSchool = await schoolModel.populate('schoolId');
    // const searchTemplate = searchSchool.find(template => template.template_name === searchBatch.templateName);
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    doc.pipe(
      fs.createWriteStream("./client/public/diploma_student1_batch1.pdf")
    );
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
      batch.cursus,
      template.cursusField.positionX,
      template.cursusField.positionY
    );
    doc.text(
      "Promo " + batch.promo,
      template.promoField.positionX,
      template.promoField.positionY
    );
    doc.text(
      batch.year,
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
      "Mention: " + batch.mention,
      template.mentionField.positionX,
      template.mentionField.positionY
    );
    doc.end();

    res.json({ result: true });
  }
});

router.get("/delete-pdf", async (req, res) => {
  if (fs.existsSync("./client/public/diploma_student1_batch1.pdf")) {
    fs.unlinkSync("./client/public/diploma_student1_batch1.pdf");
    res.json({ result: true, msg: "File supprime" });
  } else {
    res.json({ result: false, msg: "File non existant" });
  }
});

router.post("/create-diploma", async (req, res) => {
  const searchStudent = await studentModel.findById(req.body.studentId);
  if (!searchStudent) {
    res.json({ result: false, msg: "Student non existant" });
  } else {
    const searchDiploma = searchStudent.diplomas.find(
      (diploma) => diploma.id_batch === req.body.id_batch
    );
    if (searchDiploma) {
      res.json({ result: false, msg: "Diplome deja existant" });
    } else {
      searchStudent.diplomas.push({
        id_batch: req.body.id_batch,
        mention: req.body.mention,
        status: req.body.status,
        url_SmartContract: "abc",
      });
      res.json({ result: true, msg: "Diplome cree" });
    }
  }
});

router.get("/batch", async (req, res) => {
  // A MODIFIER QUAND DB EN FORME
  //const school_batches = await diplomaModel.find({schoolId: req.query.school_id});
  const school_batches = [
    {
      year: 2020,
      curriculum: "Bac Technologique",
      _id: "61015592b527c72f100f7481",
      id_School: "6101c0b6208679b2ab7f0884",
      template_name: "Bac tec",
    },
    {
      year: 2021,
      curriculum: "BTS mécanique",
      _id: "6101c206564b97b34f9e16ea",
      id_School: "6101c0b6208679b2ab7f0884",
      template_name: "BTS méca",
    },
    {
      year: 2019,
      curriculum: "BEP comptabilité",
      _id: "61015592b527c72f100f7483",
      id_School: "6101c0b6208679b2ab7f0884",
      template_name: "BEP compta",
    },
  ];
  //console.log('BATCHES FROM DB: ', school_batches);
  if (school_batches.length === 0) {
    return res.json({
      success: false,
      message: "no template or no school for this school id",
    });
  }
  return res.json({ success: true, batches: school_batches });
});

router.get("/template", async (req, res) => {
  // A MODIFIER QUAND DB EN FORME
  //const school = await schoolModel.findOne({schoolId: req.query.school_id});
  const school = {
    _id: "6101084673a5f1dcafefa064c",
    client_id: ["60ffda648dac09e6d540eb27"],
    id_students: [],
    templates: [
      {
        _id: "010001",
        template_name: "Bac tec",
        firstname_field: {
          name: "prénom",
          position_x: 10,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        lastname_field: {
          name: "nom",
          position_x: 40,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        birth_date_field: {
          name: "date de naissance",
          position_x: 160,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        autresChamps: "PAS UTILE POUR LE MOMENT",
      },
      {
        _id: "010002",
        template_name: "BTS méca",
        firstname_field: {
          name: "prénom",
          position_x: 10,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        lastname_field: {
          name: "nom",
          position_x: 40,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        birth_date_field: {
          name: "date de naissance",
          position_x: 160,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        autresChamps: "PAS UTILE POUR LE MOMENT",
      },
      {
        _id: "010003",
        template_name: "BEP compta",
        firstname_field: {
          name: "prénom",
          position_x: 10,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        lastname_field: {
          name: "nom",
          position_x: 40,
          autresChamps: "PAS UTILE POUR LE MOMENT",
        },
        autresChamps: "PAS UTILE POUR LE MOMENT",
      },
    ],
  };
  //console.log('school: ', school);
  const template = school.templates.filter(
    (template) => template.template_name === req.query.template_name
  );

  if (template.length === 0) {
    return res.json({
      success: false,
      message: "no template or no school found",
    });
  }
  //console.log('template: ', template[0]);
  return res.json({ success: true, template: template[0] });
});

router.post("/post-csv-import", async (req, res) => {
  ///// 1 - save diploma in the student document
  const dataStudent = req.body;
  //console.log('DATA: ', dataStudent);
  let student = await studentModel.findOne({
    email: dataStudent.email,
  });
  //console.log('STUDENT 1: ', student);
  if (!student) {
    student = new studentModel({ ...dataStudent });
  }
  // AJOUT CONTROLE DIPLOME DEJA PRESENT CHEZ LE STUDENT ??
  student.diplomas.push(dataStudent.diplom_student[0]);
  //console.log('STUDENT 2: ', student);
  const studentSaved = await student.save();

  if (!studentSaved._id) {
    return res.json({
      success: false,
      message: `data of student with email ${dataStudent.email} are not saved.`,
    });
  }

  ///// 2 - add student._id in the batch document
  let batch = await diplomaModel.findOne({
    _id: dataStudent.diplom_student[0].id_batch,
  });
  if (!batch) {
    //batch = new diplomaModel({year: 2021, curriculum: 'BTS mécanique', schoolId:'6101c0b6208679b2ab7f0884', templateName: 'BTS méca', studentsId: []})
    return res.json({
      success: false,
      message: `Impossible to find the batch with id: ${dataStudent.diplom_student[0].id_batch}.`,
    });
  }
  //console.log('BATCH: ', batch);
  if (!batch.studentsId.includes(studentSaved._id)) {
    batch.studentsId.push(studentSaved._id);
  }
  const batchSaved = await batch.save();

  if (!batchSaved._id) {
    return res.json({
      success: false,
      message: `Enabled to save student id (${studentSaved._id}) in the document of batch with id: ${dataStudent.diplom_student[0].id_batch}.`,
    });
  }
  //console.log(`student ${studentSaved.lastname} saved in Batch`)
  res.json({ success: true });
});

module.exports = router;
