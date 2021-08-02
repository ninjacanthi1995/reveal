const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require("fs");
const ejs = require("ejs");
const studentModel = require('../models/students');


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})


const sendMail = (templatePath, matchings, options, errors) => {
  ejs.renderFile(templatePath, matchings, function (err, data) {
    if (err) {
      console.log('ERR: ', err);
    } else {
      var mainOptions = {
          from: 'Reveal Diplomes <reveal.diploma@gmail.com>',
          to: options.to,
          subject: options.subject,
          html: data
      };
      //console.log("html data ======================>", mainOptions.html);
      transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log('ERROR: ', err);
            return err;
          } else {
              console.log('Message sent: ' + info.response);
          }
      });
    }
  });
}




router.post("/confirmation", async (req, res) => {
  const diplomasData = req.body;     // un tableau de dilpomasData
  
  let errors = []

  for (const diplomaData of diplomasData) {
    //console.log('STudent: ', diplomaData)

    const options = {
      to: diplomaData.email,
      subject: 'Informations importantes pour votre DIPLOME',
    }

    const matchings = {
      curriculum: diplomaData.curriculum,
      promo: diplomaData.promo,
      firstname: diplomaData.firstname,
      lastname: diplomaData.lastname,
      birth_date: diplomaData.birth_date,
      studentId: diplomaData.studentId,
      diplomaId: diplomaData.diplomaId
    }

    const err = sendMail('emails/firstEmail.ejs', matchings, options);
    if (err) {
      errors.push(err);
      continue;
    }

    const student = await studentModel.findById(diplomaData.studentId);
    const diplomas = student.diplomas.map(diploma => {
      if (diploma._id == diplomaData.diplomaId){
        //console.log('in the IF of /confirmed');
        diploma.status = 'non confirmé';      // nb: non confirmé = mail envoyé, pas encore de confirmation
      }
      return diploma;
    })
    student.diplomas = diplomas;
    const studentSaved = await student.save();
    //console.log('apres envoi mail: ', studentSaved);
    if (!studentSaved._id){
      console.log(`Error while updating the status of student with id: ${diplomaData.studentId}`);
      errors.push({message: `Error while updating the status of student with id: ${diplomaData.studentId}`});
    }
  };

  if (errors.length !== 0){
    return res.json({success: false, message: 'one or more errors occured: ', errors})
  }
  res.json({success: true});
});


router.get('/confirmed/:studentId/:diplomaId', async (req, res) => {
  const student = await studentModel.findById(req.params.studentId);
  //console.log('student: ', student);
  const diplomas = student.diplomas.map(diploma => {
    if (diploma._id == req.params.diplomaId){
      console.log('in the IF of /confirmed');
      diploma.status = 'confirmé';
    }
    return diploma;
  });
  //console.log('diplomas: ', diplomas);
  student.diplomas = diplomas;
  //console.log(' before save: ', student);

  const studentSaved = await student.save();
  console.log('after save: ', studentSaved);
  if (!studentSaved._id){
    return res.json({message: "Echec de la confirmation, veuillez ré-essayer!"});
  }
  res.json({message: "Votre confirmation de donnée a bien été prise en compte"});

})


module.exports = router;


// RESTE A ECRIRE LES MAILS EN HTML OU EN TEXT / A LES PERSONALISER ET
// A LES ASSIGNER CHACUN A UNE ROUTE.
// BLOQUER LA REPONSE AU MAIL APRES LA 1ERE REPONSE