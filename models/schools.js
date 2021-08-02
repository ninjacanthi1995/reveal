const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  template_name: {type: String, unique: true, required: true},
  template_dimensions: {type: mongoose.Schema.Types.Mixed},
  firstname_field: {type: mongoose.Schema.Types.Mixed, required: true},
  lastname_field: {type: mongoose.Schema.Types.Mixed, required: true},
  birth_date_field: {type: mongoose.Schema.Types.Mixed},
  curriculum_field: {type: mongoose.Schema.Types.Mixed},
  promo_field: {type: mongoose.Schema.Types.Mixed},
  year_field: {type: mongoose.Schema.Types.Mixed, required: true},
  mention_field: {type: mongoose.Schema.Types.Mixed},
  background_image_field: {type: mongoose.Schema.Types.Mixed, required: true},
  static_fields: [{type: mongoose.Schema.Types.Mixed}]
})

const schoolSchema = new mongoose.Schema({
  name: String,
  client_id: [String],
  templates: [templateSchema]
});

module.exports = mongoose.model('schools', schoolSchema);

