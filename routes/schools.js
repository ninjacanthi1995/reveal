const express = require("express");
const router = express.Router();
const SchoolModel = require("../models/schools");

router.get("/all", async (req, res) => {
  const schools = await SchoolModel.find()
  res.json({result: true, schools })
})

router.get("/:school_name/users", async (req, res) => {
  const school = await SchoolModel.findOne({name: req.params.school_name})
  .populate("user_id")
  res.json({result: true, users: school.user_id })
})

module.exports = router;