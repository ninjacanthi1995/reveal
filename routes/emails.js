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


router.post("/demande-inscription", function (req, res) {
  const newUser = req.body.values;
  const errors = []
  let mailOptions = {
    from: `Reveal <${newUser.email}>`,
    to: "dorian.gentine@mail.novancia.fr", // MAIL A CHANGER
    subject: 'Bonjour Fred, vous avez une nouvelle demande sur Reveal.com',
    html: '<body>Hello World</body>',
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      errors.push(err);
      console.log('email failed');
    } else {
      console.log('email success');
    }
  })

  if (errors.length !== 0) res.json({result: false, error: "Votre demande n'a pas pu être envoyé, vous pouvez nous contacter à cette adresse: A_REMPLIR"})
  res.json({result: true, message: "Votre demande a bien été envoyée, nous revenons vers vous au plus vite !"});
});



module.exports = router;


// RESTE A ECRIRE LES MAILS EN HTML OU EN TEXT / A LES PERSONALISER ET
// A LES ASSIGNER CHACUN A UNE ROUTE.