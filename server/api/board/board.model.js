'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BoardSchema = new Schema({
  creatorId: String,
  title: String,
  description: String,
  links: Array
});

module.exports = mongoose.model('Board', BoardSchema);
