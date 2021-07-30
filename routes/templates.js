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

router.post("/create/:school_id", async function (req, res) {
  console.log(`req.params.school_id`, req.params.school_id)
  const school = await SchoolModel.findById(req.params.school_id)
  if(!school) res.json({result: false, error: "Nous ne retrouvons pas votre école 😕"})
  
  const checkName = school.templates.findIndex(e=> e.template_name === req.body.template_name) >= 0
  if(checkName) {
    res.json({result: false, error: "Vous avez déjà un template avec ce nom 😕"})
  }else{
    const template = {...req.body}
  
    const saveImgInCloudinary = async (path, name) => {
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
  
    school.templates.push(template)
    school.save()
    res.json({
      result: true, 
      message: "Votre template est bien enregistré, vous allez être redirigé vers le dashboard",
      template
    })
  }
  
});

module.exports = router;