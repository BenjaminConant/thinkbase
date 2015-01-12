'use strict';

var _ = require('lodash');
var Board = require('./board.model');
var User = require('../user/user.model');


// Get list of boards
exports.index = function(req, res) {
  Board.find(function (err, boards) {
    if(err) { return handleError(res, err); }
    return res.json(200, boards);
  });
};

// Get a single board
exports.show = function(req, res) {
  Board.findById(req.params.id, function (err, board) {
    if(err) { return handleError(res, err); }
    if(!board) { return res.send(404); }
    return res.json(board);
  });
};

// Creates a new board in the DB. Then adds the boards _id to the creators boards array.
exports.create = function(req, res) {
  Board.create(req.body, function(err, board) {
    if(err) { return handleError(res, err); }
    User.findById(board.creatorId, function(err, user) {
    user.boards.push({'title': board.title, 'id': board._id});
    user.save(function(err, user) {
      console.log(user);
      return res.json(201, board);
    });
    });
  });
};

// Updates an existing board in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Board.findById(req.params.id, function (err, board) {
    if (err) { return handleError(res, err); }
    if(!board) { return res.send(404); }
    var updated = _.extend(board, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, board);
    });
  });
};

// Deletes a board from the DB.
exports.destroy = function(req, res) {
  Board.findById(req.params.id, function (err, board) {
    if(err) { return handleError(res, err); }
    if(!board) { return res.send(404); }
    board.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}