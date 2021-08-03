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
            return false
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


router.post("/demande-inscription", function (req, res) {
  const newUser = req.body.values;

  const mailGerant = "frederic.garnier@mycommunicationtoolbox.com"
  
  const options = {
    to: mailGerant,
    subject: 'Bonjour Fred, vous avez une nouvelle demande sur Reveal.com',
  }

  const err = sendMail('emails/inscriptionEmail.ejs', newUser, options);

  if (err) res.json({result: false, error: `Votre demande n'a pas pu être envoyé, vous pouvez nous contacter à cette adresse: ${mailGerant}`})
  res.json({result: true, message: "Votre demande a bien été envoyée, nous revenons vers vous au plus vite !"});
});



module.exports = router;


// RESTER A CREER LA ROUTE ET LE MAIL POUR L ENVOI DU DIPLOME + URL SMARTCONTRACT