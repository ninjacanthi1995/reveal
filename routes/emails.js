var express = require("express");
var router = express.Router();
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})





router.post("/confirmation", function (req, res) {
  const students = req.body;     // un tableau de user
  
  let errors = []

  students.forEach(student => {
    console.log('STudent: ', student)
    let mailOptions = {
      from: 'reveal.diploma@gmail.com',
      to: student.email,
      subject: 'Informations importantes pour votre DIPLOME',
      html: '<body>Hello World</body>',
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        errors.push(err);
        console.log('email failed');
      } else {
        console.log('email success');
      }
    });
  });

  if (errors.length !== 0){
    return res.json({success: false, message: 'one or more errors occured: ', errors})
  }
  res.json({success: true});
});



module.exports = router;


// RESTE A ECRIRE LES MAILS EN HTML OU EN TEXT / A LES PERSONALISER ET
// A LES ASSIGNER CHACUN A UNE ROUTE.