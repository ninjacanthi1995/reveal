const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const SchoolModel = require("../models/schools");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

router.get("/get-templates/:school_id", async (req, res) => {
  const school = await SchoolModel.findById(req.params.school_id)
  if(!school){
    res.json({result: false, error: "Nous ne retrouvons pas votre école 😭"})
  }else{
    res.json({result:true, templateList: school.templates})
  }
})

router.get("/get/:school_id/:template_name", async (req, res) => {
  const school = await SchoolModel.findById(req.params.school_id)
  if(!school){
    res.json({result: false, error: "Nous ne retrouvons pas votre école 😭"})
  }else{
    const template = school.templates.find(e=> e.template_name.includes(req.params.template_name))
    res.json({result:true, template: template})
  }
})

const createTemplate = async (body, school) => {
  const template = {...body.template}
  const saveImgInCloudinary = async (path, name) => {
    if(path.includes("cloudinary")) return path
    const resultCloudinary = await cloudinary.uploader.upload(
      path,
      { public_id: `${school.name}/templates/${template.template_name}/${name}` }
    );
    return resultCloudinary.url
  }

  template.background_image_field.imagePreview = await saveImgInCloudinary(template.background_image_field.imagePreview, "background")
  for (let i = 0; i < template.static_fields.length; i++) {
    const field = template.static_fields[i];
    if(field.imagePreview) field.imagePreview = await saveImgInCloudinary(field.imagePreview, `image${i}`)
  }
  return template
}

router.post("/create/:school_id", async function (req, res) {
  const school = await SchoolModel.findById(req.params.school_id)
  if(!school) res.json({result: false, error: "Nous ne retrouvons pas votre école 😕"})
  
  const checkName = school.templates.findIndex(e=> e.template_name === req.body.template_name) >= 0
  if(checkName && !req.body.update) {
    res.json({result: false, error: "Vous avez déjà un template avec ce nom 😕"})
  }else if(!req.body.update){
    const template = await createTemplate(req.body, school)
  
    school.templates.push(template)
    school.save()
    res.json({
      result: true, 
      update: req.body.update,
      message: "Votre template est bien enregistré, vous allez être redirigé vers le dashboard",
      template
    })
  }else{
    const template = await createTemplate(req.body, school)
    const templateIndex = school.templates.findIndex(e=> e.template_name === template.template_name)
    school.templates.splice(templateIndex, 1, template)
    school.save()
    res.json({
      result: true,
      update: req.body.update,
      message: "Votre template a été mis à jour",
    })
  }
  
});

module.exports = router;