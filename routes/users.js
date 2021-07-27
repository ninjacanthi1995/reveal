var express = require('express');
var router = express.Router();

//fred : ajout du require users  dans une const nommee UserModel pour call la db 
const UserModel = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-in', async (req, res) => {

  const result = false
  const user = null
  const error = []

  if(req.body.emailFromFront === ''
  || req.body.passwordFromFront === ''
  ){
    error.push('champs vides')
  }

if (error.length == 0){
  const user = await UserModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

if (user){
  result = true

}else{
  error.push('email or password incorrect ')
}
}

res.json({result, user, error})
})

module.exports = router;
