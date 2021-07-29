var express = require("express");
var router = express.Router();

//fred : ajout du require users  dans une const nommee UserModel pour call la db
const UserModel = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-in", async (req, res) => {
  console.log(req.body);
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
