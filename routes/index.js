var express = require("express");
var router = express.Router();
const BatchModel = require("../models/batches");
const schoolModel = require("../models/schools");
const studentModel = require("../models/students");
const PDFDocument = require("pdfkit");
const fs = require("fs");
var QRCode = require("qrcode");
const downloadImg = require("../client/src/helpers/downloadImg");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/create-batch", async (req, res) => {
  const searchBatch = await BatchModel.findOne({
    year: req.body.year,
    curriculum: req.body.curriculum,
    promo: req.body.promo,
    schoolId: req.body.school_id,
  });
  if (searchBatch) {
    return res.json({ result: false, msg: "Batch deja existant" });
  }
  const newBatch = new BatchModel({
    year: req.body.year,
    curriculum: req.body.curriculum,
    promo: req.body.promo,
    schoolId: req.body.school_id,
    studentsId: [],
    templateName: req.body.templateName,
  });
  const savedBatch = await newBatch.save();
  if (savedBatch) res.json({ result: true, msg: "Batch cree" });
});

router.get("/create-pdf", async (req, res) => {
  const searchStudent = await studentModel.findById(req.query.studentId);
  const searchBatch = await BatchModel.findById(req.query.batchId);
  if (!searchStudent || !searchBatch)
    return res.json({ result: false, msg: "Student or batch not found" });

  const pdfPath = `./client/public/diploma_student${req.query.studentId}_batch${req.query.batchId}.pdf`;
  if (fs.existsSync(pdfPath))
    return res.json({ result: false, msg: "File existe" });

  const searchSchool = await schoolModel.findById(searchBatch.schoolId);
  const searchTemplate = searchSchool.templates.find(
    (template) => template.template_name === searchBatch.templateName
  );
  const searchDiploma = searchStudent.diplomas.find(
    (diploma) => diploma.id_batch.toString() === req.query.batchId
  );

  const doc = new PDFDocument({ size: "A4", layout: "landscape" });
  doc.pipe(fs.createWriteStream(pdfPath));

  const pdfWidth = 841.89;
  const pdfHeight = 595.28;
  const ratio = pdfWidth / searchTemplate.template_dimensions.width;

  const qrcodePath = "./client/public/qrcode.png";
  QRCode.toDataURL(
    `${process.env.DOMAIN_NAME}/diploma-student/${req.query.studentId}/${req.query.batchId}`,
    async function (err, url) {
      var base64Data = url.replace(/^data:image\/png;base64,/, "");
      if (!fs.existsSync(qrcodePath))
        fs.writeFileSync(qrcodePath, base64Data, "base64", function (err) {
          console.log(err);
        });
    }
  );

  const bgImgField = searchTemplate.background_image_field;
  const bgImgPath = "./client/public/backgroundImage.jpg";
  if (!fs.existsSync(bgImgPath))
    await downloadImg(bgImgField.imagePreview, bgImgPath);

  const bgW = bgImgField.size.width;
  const bgH = bgImgField.size.height;
  doc.image(
    bgImgPath,
    bgImgField.position.x * ratio,
    bgImgField.position.y * ratio,
    {
      width: (Number(bgW.slice(0, bgW.length - 1)) * pdfWidth) / 100,
      height: (Number(bgH.slice(0, bgH.length - 1)) * pdfHeight) / 100,
    }
  );

  const qrWidth = searchTemplate.qrcode_field.size.width;
  const qrHeight = searchTemplate.qrcode_field.size.height;
  doc.image(
    qrcodePath,
    searchTemplate.qrcode_field.position.x * ratio,
    searchTemplate.qrcode_field.position.y * ratio,
    {
      width: Number(qrWidth.slice(0, qrWidth.length - 2)) * ratio,
      height: Number(qrHeight.slice(0, qrHeight.length - 2)) * ratio,
    }
  );

  const firstnameField = searchTemplate.firstname_field;
  doc.fontSize(firstnameField.style.fontSize);
  doc
    .font(
      `Courier${
        firstnameField.style.bold || firstnameField.style.italic ? "-" : ""
      }${firstnameField.style.bold ? "Bold" : ""}${
        firstnameField.style.italic ? "Oblique" : ""
      }`
    )
    .fillColor(firstnameField.style.color)
    .text(
      searchStudent.firstname,
      firstnameField.position.x * ratio,
      firstnameField.position.y * ratio,
      {
        underline: firstnameField.style.underline,
      }
    );

  const lastnameField = searchTemplate.lastname_field;
  doc.fontSize(lastnameField.style.fontSize);
  doc
    .font(
      `Courier${
        lastnameField.style.bold || lastnameField.style.italic ? "-" : ""
      }${lastnameField.style.bold ? "Bold" : ""}${
        lastnameField.style.italic ? "Oblique" : ""
      }`
    )
    .fillColor(lastnameField.style.color)
    .text(
      searchStudent.lastname,
      lastnameField.position.x * ratio,
      lastnameField.position.y * ratio,
      {
        underline: lastnameField.style.underline,
      }
    );

  const birthdayField = searchTemplate.birth_date_field;
  doc
    .font(
      `Courier${
        birthdayField.style.bold || birthdayField.style.italic ? "-" : ""
      }${birthdayField.style.bold ? "Bold" : ""}${
        birthdayField.style.italic ? "Oblique" : ""
      }`
    )
    .fillColor(birthdayField.style.color)
    .text(
      searchStudent.birth_date,
      birthdayField.position.x * ratio,
      birthdayField.position.y * ratio,
      {
        underline: birthdayField.style.underline,
      }
    );

  const curriculumField = searchTemplate.curriculum_field;
  doc
    .font(
      `Courier${
        curriculumField.style.bold || curriculumField.style.italic ? "-" : ""
      }${curriculumField.style.bold ? "Bold" : ""}${
        curriculumField.style.italic ? "Oblique" : ""
      }`
    )
    .fillColor(curriculumField.style.color)
    .text(
      searchBatch.curriculum,
      curriculumField.position.x * ratio,
      curriculumField.position.y * ratio,
      {
        underline: curriculumField.style.underline,
      }
    );

  const promoField = searchTemplate.promo_field;
  doc
    .font(
      `Courier${promoField.style.bold || promoField.style.italic ? "-" : ""}${
        promoField.style.bold ? "Bold" : ""
      }${promoField.style.italic ? "Oblique" : ""}`
    )
    .fillColor(promoField.style.color)
    .text(
      searchBatch.promo,
      promoField.position.x * ratio,
      promoField.position.y * ratio,
      {
        underline: promoField.style.underline,
      }
    );

  const yearField = searchTemplate.year_field;
  doc
    .font(
      `Courier${yearField.style.bold || yearField.style.italic ? "-" : ""}${
        yearField.style.bold ? "Bold" : ""
      }${yearField.style.italic ? "Oblique" : ""}`
    )
    .fillColor(yearField.style.color)
    .text(
      searchBatch.year,
      yearField.position.x * ratio,
      yearField.position.y * ratio,
      {
        underline: yearField.style.underline,
      }
    );

  const mentionField = searchTemplate.mention_field;
  doc
    .font(
      `Courier${
        mentionField.style.bold || mentionField.style.italic ? "-" : ""
      }${mentionField.style.bold ? "Bold" : ""}${
        mentionField.style.italic ? "Oblique" : ""
      }`
    )
    .fillColor(mentionField.style.color)
    .text(
      searchDiploma.mention,
      mentionField.position.x * ratio,
      mentionField.position.y * ratio,
      {
        underline: mentionField.style.underline,
      }
    );

  const textFields = await searchTemplate.static_fields.filter(
    (field) => field.type === "text"
  );
  const imgFields = await searchTemplate.static_fields.filter(
    (field) => field.type === "image"
  );

  textFields.forEach((field) =>
    doc
      .font(
        `Courier${field.style.bold || field.style.italic ? "-" : ""}${
          field.style.bold ? "Bold" : ""
        }${field.style.italic ? "Oblique" : ""}`
      )
      .fillColor(field.style.color)
      .text(field.value, field.position.x * ratio, field.position.y * ratio, {
        underline: field.style.underline,
      })
  );

  for (let i = 0; i < imgFields.length; i++) {
    if (!fs.existsSync(`./client/public/image${i}.png`))
      await downloadImg(
        imgFields[i].imagePreview,
        `./client/public/image${i}.png`
      );
  }

  let fieldWidth;
  let fieldHeight;
  imgFields.forEach((field, i) => {
    if (fs.existsSync(`./client/public/image${i}.png`)) {
      fieldWidth = field.size.width;
      fieldHeight = field.size.height;
      doc.image(
        `./client/public/image${i}.png`,
        field.position.x,
        field.position.y,
        {
          width: Number(fieldWidth.slice(0, fieldWidth.length - 2)) * ratio,
          height: Number(fieldHeight.slice(0, fieldHeight.length - 2)) * ratio,
        }
      );
    }
  });

  doc.end();

  if (fs.existsSync(bgImgPath)) fs.unlinkSync(bgImgPath);
  if (fs.existsSync(qrcodePath)) fs.unlinkSync(qrcodePath);
  imgFields.forEach((field, i) => {
    if (fs.existsSync(`./client/public/image${i}.png`))
      fs.unlinkSync(`./client/public/image${i}.png`);
  });

  res.json({ result: true });
});

router.get("/delete-pdf", async (req, res) => {
  const path = `./client/public/diploma_student${req.query.studentId}_batch${req.query.batchId}.pdf`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return res.json({ result: true, msg: "File supprime" });
  }
  res.json({ result: false, msg: "File non existant" });
});

router.get("/batch", async (req, res) => {
  const school_batches = await BatchModel.find({
    schoolId: req.query.school_id,
  });
  if (school_batches.length === 0) {
    return res.json({
      success: false,
      message: "no template or no school for this school id",
    });
  }
  return res.json({ success: true, batches: school_batches });
});

router.post("/post-csv-import", async (req, res) => {
  ///// 1 - save diploma in the student document
  const dataStudent = req.body;
  //console.log('DATA: ', dataStudent);
  const batchId = dataStudent.diplomas[0].id_batch;
  let student = await studentModel.findOne({
    email: dataStudent.email,
  });
  // Check if diploma is already registered in the student data.
  if (student) {
    const diplomaIsAlreadyRegistered =
      student.diplomas.filter((diploma) => diploma.id_batch == batchId).length >
      0;
    if (diplomaIsAlreadyRegistered) {
      return res.json({
        success: true,
        message: `this diploma was already registered to the student ${student.lastname}`,
      });
    }
    student.diplomas.push(dataStudent.diplomas[0]);
  }
  //console.log('STUDENT 1: ', student);
  if (!student) {
    student = new studentModel({ ...dataStudent });
  }
  //console.log('STUDENT 2: ', student);
  const studentSaved = await student.save();

  if (!studentSaved._id) {
    return res.json({
      success: false,
      message: `data of student with email ${dataStudent.email} are not saved.`,
    });
  }

  ///// 2 - add student._id in the batch document
  let batch = await BatchModel.findOne({
    _id: dataStudent.diplomas[0].id_batch,
  });
  if (!batch) {
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

  // AJOUTER AUSSI LE STUDENT ID DANS LA TABLE DE SA SCHOOL ????
});

router.get("/batches-populated", async (req, res) => {
  const batchesOfYearWithStudents = await BatchModel.find({
    schoolId: req.query.schoolId,
    year: req.query.year,
  }).populate("studentsId");

  if (!batchesOfYearWithStudents) {
    return res.json({
      success: false,
      message: "no batches match the given schoolId and year",
    });
  }
  return res.json({ success: true, batchesOfYearWithStudents });
});

router.get("/get-school", async (req, res) => {
  const searchSchool = await schoolModel.findById(req.query.school_id);
  if (!searchSchool) {
    res.json({ result: false, msg: "Ecole non existante" });
  } else {
    res.json({ result: true, school: searchSchool });
  }
});

router.post("/update-student", async (req, res) => {
  const {
    studentId,
    firstname,
    lastname,
    birth_date,
    email,
    diplomaId,
    status,
  } = req.body;
  const student = await studentModel.findById(studentId);

  student.firstname = firstname;
  student.lastname = lastname;
  student.email = email;
  student.birth_date = birth_date;
  const diplomaIndex = student.diplomas.findIndex(
    (diploma) => diploma._id == diplomaId
  );
  student.diplomas[diplomaIndex].status = status;
  const updated = await student.save();

  if (!updated._id) {
    return res.json({
      result: false,
      message: "student informations not updated.",
    });
  }
  res.json({ result: true });
});

module.exports = router;
