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


http://getbootstrap.com/

exports.scrapeLink = function (req, res) {

  var url = req.body.url;
  request(url, function(error, response, html){



    if (req.body.url.substring(0,7) === "http://") {
      var domain = req.body.url.substring(7, req.body.url.length).split("/")[0];
      domain = domain.split('.');
      if (domains.indexOf(domain[0]) !== -1) {
        domain.shift();
      }
      domain = domain.join('.');

    } else {
      var domain = req.body.url.substring(8, req.body.url.length).split("/")[0];
    }




    var $ = cheerio.load(html);
    var title = $('title').html();
    var body = $('body').html();



    var images = $('body img').get();
    var imageArray = [];

    images.forEach(function(imageObject) {
      if (imageObject.attribs.src) {
        var imageFilePath = imageObject.attribs.src;
      } else {
        var imageFilePath = imageObject.attribs["ng-src"];
      }

      if (imageFilePath.substring(0,2) === "//" ) {
        imageFilePath = "http:" + imageFilePath;
      } else if (imageFilePath.substring(0,1) === "/" ) {
        imageFilePath = "http://" + domain + imageFilePath;
      } else if ((imageFilePath.substring(0,7) === "http://") || (imageFilePath.substring(0,8) === "https://") ) {
        // do nothing!!!
      } else {
      //  console.log("there may be a problem with this image ... check link.controller line 31");
        // do nothing!!!
      }
      imageArray.push(imageFilePath)
    });



  //   var favicon = $('link[rel="shortcut icon"]').get()
  //   if (favicon[0]) {
  //   favicon = favicon[0].attribs.href;
  // } else {
  //   favicon = $('link[rel="Shortcut Icon"]').get();
  //   console.log("____________________________________________________________fdasfdasfdas");
  //   console.log($('link[rel="Shortcut Icon"]').get());
  //   var domain = req.body.url.substring(7, req.body.url.length - 1).split("/")[0];
  //   favicon = "http://" + domain + favicon[0].attribs.href;
  // }
  //
  //
  //   console.log(favicon);



  //  console.log(imageArray);
    return res.json(200, {'title': title, 'images': imageArray, 'domain': domain});
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