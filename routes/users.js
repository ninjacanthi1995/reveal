var express = require("express");
var router = express.Router();
const SchoolModel = require("../models/schools");

//fred : ajout du require users  dans une const nommee UserModel pour call la db
const UserModel = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", async (req, res) => {
  console.log(`req.body`, req.body)
  const user = {...req.body}
  if(user.firstname === "" &&
    user.email === "" &&
    user.password === "" &&
    user.admin === "" &&
    user.school_name === ""
  ) {
    res.json({result: false, error: "Il nous manque des infos"})
  }
  
  const school = await SchoolModel.findOne({ name: user.school_name })
  if(!school){
    res.json({result: false, error: "Nous n'avons pas trouver votre école"})
  } else {
    const check = await UserModel.find({ email: user.email })
    if(check.length !== 0){
      res.json({result: false, error: "Cet email est déjà pris !"})
    }else{
      const newUser = new UserModel({...user})
      newUser.school_id = school.id
      const userSaved = newUser.save()
      if(userSaved){
        res.json({result: true, message: "Utilisateur créé"})
      }else{
        res.json({result:false, error: "L'utilisateur n'a pas pus être créé"})
      }
    }
  }
})

router.post("/sign-in", async (req, res) => {
  console.log(`req.body`, req.body)
  var result = false;
  var user = null;
  var error = [];

  if (req.body.emailFromFront === "" && req.body.passwordFromFront === "") {
    error.push("les champs sont  vides");
  }

  if (error.length == 0) {
    user = await UserModel.findOne({
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    });

    if (user) {
      result = true;
    } else {
      error.push("email ou mot de passe incorrect ");
    }
  }

  res.json({ result, user, error });
});

router.put("/edit-my-account/:userId", async (req, res) => {
  const searchUser = await UserModel.findById(req.params.userId);
  if (!searchUser) {
    res.json({ result: false, msg: "User not found" });
  } else {
    await UserModel.findByIdAndUpdate(req.params.userId, req.body);
    res.json({ result: true, msg: "User updated" });
  }
});

module.exports = router;
