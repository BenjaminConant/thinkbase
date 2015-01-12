'use strict';

angular.module('quizerdApp')
  .controller('NewboardCtrl', function ($scope, $routeParams, $window, $http, board, Auth, $location) {
    $scope.name = "newboardController";
    $scope.params = $routeParams;
    $scope.noteText = "";



    function Board() {
      this.creatorId = "";
      this.title = "";
      this.description = "";
      this.links = [];
    }

    function Link() {
      this.url = "";
      this.title = "";
      this.image = "";
      this.notes = [];
    }

    function Note() {
      this.text = "";
      this.date = "timestamp";
      this.author = "person who wrote the note"
    }

    $scope.Board = new Board;
    $scope.Board.editTitle = true;
    $scope.Board.editDescription = true;
    $scope.Board.toggleEditTitle = function () {
      $scope.Board.editTitle = !$scope.Board.editTitle;
    }
    $scope.Board.toggleEditDescription = function( ) {
      $scope.Board.editDescription = !$scope.Board.editDescription;
    }

    $scope.addLink = function () {
      var link = new Link;
      link.edit = false;
      link.shouldEdit = function() {
        if (link.url === "") link.edit = true;
      };
      link.shouldEdit();
      link.toggleEdit = function(){
        link.edit = !link.edit;
      };
      link.removeNote = function(index) {
        link.notes.splice(index, 1);
      }
      $scope.Board.links.push(link);
    }
    $scope.addLink();

    $scope.removeLink = function (index) {
      $scope.Board.links.splice(index, 1);
    }

    $scope.openLink = function (url){
     $window.open(url);
    }

    $scope.addNote = function (link, text) {
      var note = new Note;
      note.text = text;
      note.edit = false;
      note.toggleEdit = function(){
        note.edit = !note.edit;
      }
      link.notes.push(note);
    }

    $scope.scrapeLink = function(link) {
      $http.post('/api/links/', {'url': link.url}).success(function(linkData) {
        link.title = linkData.title;
        link.image = linkData.image;
        link.edit = !link.edit;
      });
    }

    $scope.saveBoard = function(){
      $scope.Board.creatorId = Auth.getCurrentUser()._id;
      board.save($scope.Board).success(function(board) {
        $location.path('/myboards/' + Auth.getCurrentUser()._id +'/' + board._id);
      });
    }



});
