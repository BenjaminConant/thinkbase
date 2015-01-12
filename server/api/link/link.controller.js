'use strict';

var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var _ = require('lodash');
var Link = require('./link.model');



exports.imdb = function (req, res) {
   var url = 'http://www.imdb.com/title/tt1229340/';
   request(url, function(error, response, html){
     var $ = cheerio.load(html);
     var title = $('title').html();
     return res.json(200, title);
 })
};

http://en.wikipedia.org/wiki/Website
exports.scrapeLink = function (req, res) {
  console.log(req.body);
  var url = req.body.url;
  request(url, function(error, response, html){
    var $ = cheerio.load(html);
    var title = $('title').html();
    var images = $('img').get();
    if (images[0].attribs.src) {
      var imageString = images[0].attribs.src;
    } else if (images[0].attribs['ng-src']) {
      var imageString = images[0].attribs['ng-src'];
    } else {
      var imageString = "no image :(";
    }

    if (!(imageString.substring(0,7) === "http://") && !(imageString.substring(0,8) === "https://")) {
      if (imageString.substring(0,2) === '//') {
        imageString = "http:" + imageString;
      } else {
        imageString = req.body.url + imageString;
      }
    }

    var favicon = $('link[rel="shortcut icon"]').get()

    if (favicon === []) {
      favicon = $('link[type="image/x-icon"]').get();
    }

    console.log(favicon);

    console.log(obj);
    console.log(obj);
    console.log(obj);


    return res.json(200, {'title': title, 'image': imageString, 'favicon': favicon});
  })
};




// Get list of links
exports.index = function(req, res) {
  Link.find(function (err, links) {
    if(err) { return handleError(res, err); }
    return res.json(200, links);
  });
};

// Get a single link
exports.show = function(req, res) {
  Link.findById(req.params.id, function (err, link) {
    if(err) { return handleError(res, err); }
    if(!link) { return res.send(404); }
    return res.json(link);
  });
};

// Creates a new link in the DB.
exports.create = function(req, res) {
  Link.create(req.body, function(err, link) {
    if(err) { return handleError(res, err); }
    return res.json(201, link);
  });
};

// Updates an existing link in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Link.findById(req.params.id, function (err, link) {
    if (err) { return handleError(res, err); }
    if(!link) { return res.send(404); }
    var updated = _.merge(link, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, link);
    });
  });
};

// Deletes a link from the DB.
exports.destroy = function(req, res) {
  Link.findById(req.params.id, function (err, link) {
    if(err) { return handleError(res, err); }
    if(!link) { return res.send(404); }
    link.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}