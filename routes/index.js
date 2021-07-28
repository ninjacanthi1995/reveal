var express = require("express");
var router = express.Router();
const diplomaModel = require("../models/diplomas");
const schoolModel = require("../models/schools");
const studentModel = require("../models/students");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const pdfModel = require("../models/pdfs");
const dropboxV2Api = require("dropbox-v2-api");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'la-capsule-chau',
  api_key: '215156496698694',
  api_secret: 'a_eGuCdkfLlPZsizH_XWeYsVwwg' 
 });

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

router.get("/send-diploma", async (req, res) => {
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
  await cloudinary.uploader.upload("output.pdf", function(error, result) {console.log(result, error); });

  res.json({ result: true });
});



router.get('/batch', async (req, res) => {
  // A MODIFIER QUAND DB EN FORME
  //const school_batches = await diplomaModel.find({schoolId: req.query.school_id});
  const school_batches = [
    {year: 2020, curriculum: 'Bac Technologique', _id:'0001', id_School:'00101', template_name: 'Bac tec'},
    {year: 2021, curriculum: 'BTS mécanique', _id:'0003', id_School:'00103', template_name: 'BTS méca'},
    {year: 2019, curriculum: 'BEP comptabilité', _id:'0006', id_School:'00101', template_name: 'BEP compta'}
  ]
  //console.log('BATCHES FROM DB: ', school_batches);
  if (school_batches.length === 0){
    return res.json({success: false, message:'no template or no school for this school id'})
  }
  return res.json({success: true, batches: school_batches})
})


router.get('/template', async (req, res) => {
  // A MODIFIER QUAND DB EN FORME
  //const school = await schoolModel.findOne({schoolId: req.query.school_id});
  const school = {
    _id: '6101084673a5f1dcafefa064c',
    client_id: ['60ffda648dac09e6d540eb27'],
    id_students: [],
    templates: [
      {
        _id: '010001',
        template_name: 'Bac tec',
        firstname_field: {
          name: 'prénom',
          position_x: 10,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        lastname_field: {
          name: 'nom',
          position_x: 40,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        birth_date_field: {
          name: 'date de naissance',
          position_x: 160,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        autresChamps: 'PAS UTILE POUR LE MOMENT'
    },
      {
        _id: '010002',
        template_name: 'BTS méca',
        firstname_field: {
          name: 'prénom',
          position_x: 10,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        lastname_field: {
          name: 'nom',
          position_x: 40,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        birth_date_field: {
          name: 'date de naissance',
          position_x: 160,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        autresChamps: 'PAS UTILE POUR LE MOMENT'
      },
      {
        _id: '010003',
        template_name: 'BEP compta',
        firstname_field: {
          name: 'prénom',
          position_x: 10,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        lastname_field: {
          name: 'nom',
          position_x: 40,
          autresChamps: 'PAS UTILE POUR LE MOMENT'
        },
        autresChamps: 'PAS UTILE POUR LE MOMENT'
      }
    ]
  }
  //console.log('school: ', school);
  const template = school.templates.filter(template => template.template_name === req.query.template_name);

  if (template.length === 0){
    return res.json({success: false, message:'no template or no school found'})
  }
  //console.log('template: ', template[0]);
  return res.json({success: true, template: template[0]})
})


router.post('/post-csv-import', async (req, res) => {
  const dataStudent = req.body;
  //console.log('DATA: ', dataStudent);
  let student = await studentModel.findOne({email: dataStudent.email});
  console.log('STUDENT 1: ', student);
  if (!student) {
    student = new studentModel({ ...dataStudent })
  }
  student.diplomas.push(dataStudent.diplom_student[0])
  console.log('STUDENT 2: ', student);
  const studentSaved = await student.save();

  if (studentSaved){
    res.json({success: true});
  } else {
    res.json({success: false, message: `data of student with email ${dataStudent.email} are not saved.`})
  }
})

module.exports = router;

