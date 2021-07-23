var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.post('/generateDiplome', (req, res) => {
//   if (req.body.template && req.body.student) {
//     res.json({ result: true })
//   } else res.json({ result: false })
// });

router.post('/orderRide', (req, res) => {
  let token = req.body.token;
  let depart = req.body.depart;
  let destination = req.body.destination;

  if (!token || !depart || !destination) {
    res.json({ result: false });
  } else {
    // Traitement de la réservation
    res.json({ result: true, tempsAttente: 10 });
  }
});

module.exports = router;
