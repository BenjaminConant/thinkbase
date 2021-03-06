'use strict';

var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var _ = require('lodash');
var Link = require('./link.model');
var domains = ["www", "us"];



exports.imdb = function (req, res) {
   var url = 'http://www.imdb.com/title/tt1229340/';
   request(url, function(error, response, html){
     var $ = cheerio.load(html);
     var title = $('title').html();
     return res.json(200, title);
 })
};




exports.scrapeLink = function (req, res) {
  

  var url = req.body.url;
  if (url.substring(0,7) === "http://") {
    var domain = url.substring(7, url.length).split("/")[0];
    domain = domain.split('.');
    if (domains.indexOf(domain[0]) !== -1) {
      domain.shift();
    }
    domain = domain.join('.');
  } else {
    var domain = url.substring(8, url.length).split("/")[0];
  }

  request(url, function(error, response, html){
    if (error) {
      console.log(error);
      return res.json(200, {'title': url, 'images': [], 'domain': domain, 'rejected': true});
    } else {
      var $ = cheerio.load(html);
      var title = $('title').html();
      var metas = $('head meta').get();
      console.log(metas);
      var description = "";
      var imageArray = [];
      
      metas.forEach(function(metaObject) {
        // get non og description
        if (metaObject.attribs.name === 'description' || metaObject.attribs.name === 'Description' ) {
          description = metaObject.attribs.content;
        }
        // get og:image
        if (metaObject.attribs.property === 'og:image') {
          imageArray.push(metaObject.attribs.content);
        }
      });
     



      var body = $('body').html();
      var images = $('body img').get();
      images.forEach(function(imageObject) {
        if (imageObject.attribs.src) {
          var imageFilePath = imageObject.attribs.src;
        } else {
          var imageFilePath = imageObject.attribs["ng-src"];
        }
        if (imageFilePath) {
          if (imageFilePath.substring(0,2) === "//" ) {
            imageFilePath = "http:" + imageFilePath;
            imageArray.push(imageFilePath);
          } else if (imageFilePath.substring(0,1) === "/" ) {
            imageFilePath = "http://" + domain + imageFilePath;
            imageArray.push(imageFilePath);
          } else if ((imageFilePath.substring(0,7) === "http://") || (imageFilePath.substring(0,8) === "https://") ) {
            imageArray.push(imageFilePath);
          } else {
           
          }          
        }
      });
      
      console.log(description + "this is the description 84");
      var returnObject = {
        'title': title,
        'description': description,
        'images': imageArray, 
        'domain': domain
      }
      console.log(returnObject.description + "this is the description 91");
      return res.json(200, returnObject);
    }
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