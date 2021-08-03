var express = require("express");
var router = express.Router();
const BatchModel = require("../models/batches");
const schoolModel = require("../models/schools");
const studentModel = require("../models/students");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const fetch = require("node-fetch");
var QRCode = require("qrcode");

const pdfWidth = 841.89;
const pdfHeight = 595.28;

async function downloadImg(url, path) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(path, buffer, () => console.log("finished downloading!"));
}

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
    res.json({ result: false, msg: "Batch deja existant" });
  } else {
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
  }
});

router.get("/create-pdf", async (req, res) => {
  const searchStudent = await studentModel.findById(req.query.studentId);
  const searchBatch = await BatchModel.findById(req.query.batchId);
  if (!searchStudent || !searchBatch) {
    res.json({ result: false, msg: "Student or batch not found" });
  } else if (
    fs.existsSync(
      `./client/public/diploma_student${req.query.studentId}_batch${req.query.batchId}.pdf`
    )
  ) {
    res.json({ result: false, msg: "File existe" });
  } else {
    const searchSchool = await schoolModel.findById(searchBatch.schoolId);
    const searchTemplate = searchSchool.templates.find(
      (template) => template.template_name === searchBatch.templateName
    );
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    doc.pipe(
      fs.createWriteStream(
        `./client/public/diploma_student${req.query.studentId}_batch${req.query.batchId}.pdf`
      )
    );

    const bgImgField = searchTemplate.background_image_field;
    if (!fs.existsSync("./client/public/backgroundImage.jpg"))
      await downloadImg(
        bgImgField.imagePreview,
        "./client/public/backgroundImage.jpg"
      );

    doc.image(
      "./client/public/backgroundImage.jpg",
      bgImgField.position.x,
      bgImgField.position.y,
      {
        width:
          (Number(
            bgImgField.size.width.slice(0, bgImgField.size.width.length - 1)
          ) *
            pdfWidth) /
          100,
        height:
          (Number(
            bgImgField.size.height.slice(0, bgImgField.size.height.length - 1)
          ) *
            pdfHeight) /
          100,
      }
    );

    // let qrCodeUrl;
    // QRCode.toDataURL(
    //   `http://localhost:3001/diploma-student/${req.query.studentId}/${req.query.batchId}`,
    //   function (err, url) {
    //     console.log(url);
    //     qrCodeUrl = url;
    //   }
    // );

    // const qrcodeField = searchTemplate.qrcode_field;
    // if (!fs.existsSync("./client/public/qrcode.png"))
    //   await downloadImg(
    //     qrCodeUrl,
    //     "./client/public/qrcode.png"
    //   );

    doc.fontSize(searchTemplate.firstname_field.style.fontSize);
    doc
      .fillColor(searchTemplate.firstname_field.style.color)
      .text(
        searchStudent.firstname,
        searchTemplate.firstname_field.position.x,
        searchTemplate.firstname_field.position.y
      );
    doc.fontSize(searchTemplate.lastname_field.style.fontSize);
    doc
      .fillColor(searchTemplate.lastname_field.style.color)
      .text(
        searchStudent.lastname,
        searchTemplate.lastname_field.position.x,
        searchTemplate.lastname_field.position.y
      );
    doc
      .fillColor(searchTemplate.birth_date_field.style.color)
      .text(
        searchStudent.birth_date,
        searchTemplate.birth_date_field.position.x,
        searchTemplate.birth_date_field.position.y
      );
    doc
      .fillColor(searchTemplate.curriculum_field.style.color)
      .text(
        searchBatch.curriculum,
        searchTemplate.curriculum_field.position.x,
        searchTemplate.curriculum_field.position.y
      );
    doc
      .fillColor(searchTemplate.promo_field.style.color)
      .text(
        searchBatch.promo,
        searchTemplate.promo_field.position.x,
        searchTemplate.promo_field.position.y
      );
    doc
      .fillColor(searchTemplate.year_field.style.color)
      .text(
        searchBatch.year,
        searchTemplate.year_field.position.x,
        searchTemplate.year_field.position.y
      );
    doc
      .fillColor(searchTemplate.mention_field.style.color)
      .text(
        searchBatch.mention,
        searchTemplate.mention_field.position.x,
        searchTemplate.mention_field.position.y
      );
    

    const textFields = await searchTemplate.static_fields.filter(
      (field) => field.type === "text"
    );
    const imgFields = await searchTemplate.static_fields.filter(
      (field) => field.type === "image"
    );

    textFields.forEach((field) =>
      doc
        .fillColor(field.style.color)
        .text(field.value, field.position.x, field.position.y)
    );

    for (let i = 0; i < imgFields.length; i++) {
      if (!fs.existsSync(`./client/public/image${i}.png`))
        await downloadImg(
          imgFields[i].imagePreview,
          `./client/public/image${i}.png`
        );
    }

    imgFields.forEach((field, i) => {
      if (fs.existsSync(`./client/public/image${i}.png`))
        doc.image(
          `./client/public/image${i}.png`,
          field.position.x,
          field.position.y,
          {
            width:
              Number(field.size.width.slice(0, field.size.width.length - 2)) *
              0.75,
            height:
              Number(field.size.height.slice(0, field.size.width.length - 2)) *
              0.75,
          }
        );
    });

    doc.end();

    fs.unlinkSync("./client/public/backgroundImage.jpg");
    imgFields.forEach((field, i) => {
      if (fs.existsSync(`./client/public/image${i}.png`))
        fs.unlinkSync(`./client/public/image${i}.png`);
    });

    res.json({ result: true });
  }
});

router.get("/delete-pdf", async (req, res) => {
  if (
    fs.existsSync(
      `./client/public/diploma_student${req.query.studentId}_batch${req.query.batchId}.pdf`
    )
  ) {
    fs.unlinkSync(
      `./client/public/diploma_student${req.query.studentId}_batch${req.query.batchId}.pdf`
    );
    res.json({ result: true, msg: "File supprime" });
  } else {
    res.json({ result: false, msg: "File non existant" });
  }
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
    res.json({ result: false, msg: "Ecole non existante" })
  } else {
    res.json({ result: true, school: searchSchool });
  }
});

router.post("/update-student", async (req, res) => {
  const {studentId, firstname, lastname, birth_date, email, diplomaId, status} = req.body;
  const student = await studentModel.findById(studentId);

  student.firstname = firstname;
  student.lastname = lastname;
  student.email = email;
  student.birth_date = birth_date;
  const diplomaIndex = student.diplomas.findIndex(diploma => diploma._id == diplomaId);  
  student.diplomas[diplomaIndex].status = status;
  const updated = await student.save();

  if (!updated._id) {
    return res.json({result: false, message: 'student informations not updated.'})
  }
  res.json({result: true});
})

module.exports = router;
