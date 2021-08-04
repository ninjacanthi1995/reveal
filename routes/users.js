var express = require("express");
var router = express.Router();
const SchoolModel = require("../models/schools");
var mongoose = require("mongoose");

//fred : ajout du require users  dans une const nommee UserModel pour call la db
const UserModel = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", async (req, res) => {
  const user = { ...req.body };
  if (
    user.firstname === "" &&
    user.email === "" &&
    user.password === "" &&
    user.admin === "" &&
    user.school_name === ""
  ) {
    res.json({ result: false, error: "Il nous manque des infos" });
  }

  const school = await SchoolModel.findOne({ name: user.school_name });
  if (!school) {
    res.json({ result: false, error: "Nous n'avons pas trouver votre école" });
  } else {
    const check = await UserModel.find({ email: user.email });
    if (check.length !== 0) {
      res.json({ result: false, error: "Cet email est déjà pris !" });
    } else {
      const newUser = new UserModel({ ...user });
      newUser.school_id = school.id;
      const userSaved = await newUser.save();
      if (userSaved) {
        school.user_id.push(userSaved._id)
        const schoolSaved = await school.save()
        if(schoolSaved) {
          const users = await UserModel.find({ school_id: schoolSaved._id })
          res.json({ result: true, users, message: `${userSaved.firstname} a bien été créé` });
        }
      } else {
        res.json({
          result: false,
          error: "L'utilisateur n'a pas pus être créé",
        });
      }
    }
  }
});

router.post("/sign-in", async (req, res) => {
  console.log(`req.body`, req.body);
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

router.put("/edit-user/:userId", async (req, res) => {
  const searchUser = await UserModel.findById(req.params.userId);
  if (!searchUser) {
    res.json({ result: false, msg: "User not found" });
  } else {
    if (typeof req.body.school_id === "String") {
      await UserModel.findByIdAndUpdate(req.params.userId, {
        school_id: mongoose.mongo.ObjectId(req.body.school_id),
      });
    } else {
      await UserModel.findByIdAndUpdate(req.params.userId, req.body);
    }
    res.json({ result: true, msg: "User updated" });
  }
});

router.get("/get-collaborators", async (req, res) => {
  const searchCollaborators = await UserModel.find({
    school_id: req.query.school_id,
  });
  res.json({ result: true, collaborators: searchCollaborators });
});

router.get("/get-user", async (req, res) => {
  let searchUser;
  if (req.query.userId) {
    searchUser = await UserModel.findById(req.query.userId);
  } else {
    searchUser = await UserModel.findOne(req.query);
  }
  if (!searchUser) {
    res.json({ result: false, msg: "User non existant" });
  } else {
    res.json({ result: true, user: searchUser });
  }
});

router.post("/create-collaborator", async (req, res) => {
  const searchCollaborator = await UserModel.findOne(req.body);
  if (searchCollaborator) {
    return res.json({ result: false, msg: "Vous avez déjà ce collaborateur" });
  }
  const newCollaborator = new UserModel({
    ...req.body,
    school_id: mongoose.mongo.ObjectId(req.body.school_id),
    role: "collaborateur",
  });
  const savedCollaborator = await newCollaborator.save();
  if(savedCollaborator._id){
    const school = await SchoolModel.findById(req.body.school_id)
    school.user_id.push(savedCollaborator._id)
    const schoolSaved = await school.save()
    if(schoolSaved) res.json({ result: true, msg: "User créé" });
  }
});

router.delete("/delete-collaborator/:userId", async (req, res) => {
  const searchCollaborator = await UserModel.findById(req.params.userId);
  if (!searchCollaborator)
    return res.json({ result: false, msg: "Collaborator non existe" });
  await UserModel.findByIdAndDelete(req.params.userId);
  res.json({ result: true, msg: "Collaborateur supprimé" });
});

router.post('/edit/:user_id', async (req, res) => {
  const updatedUser = await UserModel.updateOne(
    { _id: req.params.user_id },
    { 
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    }
  );
  if(updatedUser.n === 0) return res.json({result: false, error: "Un problème est survenu" })
  
  const user = await UserModel.findById(req.params.user_id)
  const users = await UserModel.find({ school_id: user.school_id })
  res.json({result: true, users, message: `${user.firstname} a bien été mis à jour`})
})

router.delete('/delete/:user_id', async (req, res) => {
  const userToDelete = await UserModel.findById(req.params.user_id)
  const school = await SchoolModel.findById(userToDelete.school_id)
  const idIndex = school.user_id.findIndex(e => e === userToDelete._id)

  const deletedUser = await UserModel.deleteOne({ _id: req.params.user_id })
  if(deletedUser.n !== 0){
    school.user_id.splice(idIndex, 1)
    const schoolSaved = await school.save()
    console.log(`schoolSaved`, schoolSaved)
    const users = await UserModel.find({ school_id: schoolSaved._id })
    res.json({result: true, users, message: `${userToDelete.firstname} a été supprimé`})
  }else{
    res.json({result: false, error: "Un problème est survenu" })
  }


})

module.exports = router;
