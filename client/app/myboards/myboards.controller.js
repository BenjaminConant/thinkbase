'use strict';

angular.module('quizerdApp')
  .controller('MyboardsCtrl', function ($scope, board, $location, Auth, $route, $routeParams, User, $http, $window) {

    // if there is no board id parameter passed, redirect to route with the first board id in user boards passed
    // if there is a board id paramerter passed, find that board and set it equal to $scope.Board
    $scope.findBoard = function () {
      User.get(function(user) {
        $scope.currentUser = user;
        if (!$routeParams.boardId) {
            $location.path('myboards/' + $scope.currentUser._id + '/' + $scope.currentUser.boards[0].id);
        } else {
            board.findOne($routeParams.boardId).success(function(board) {
              console.log(board);
              $scope.Board = board;
              $scope.Board.links.forEach(function(link) {
                link.removeNote = function(index) {
                  link.notes.splice(index, 1);
                  $scope.updateBoard();
                }
              });

              $scope.Board.editTitle = false;
              $scope.isActive = function(id) {
                if ($scope.Board._id === id) {
                  return true;
                } else {
                  return false;
                }
              }
            });
          }
        });
      }
    $scope.findBoard();



    function Link() {
      this.url = "";
      this.title = "";
      this.notes = [];
    }

    function Note() {
      this.text = "";
      this.date = "timestamp";
      this.author = "person who wrote the note"
    }
     // hanndels adding a link to a Board
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

       $scope.Board.links.push(link);
       $scope.updateBoard();
     }
     // reomve link from board
     $scope.removeLink = function (index) {
       $scope.Board.links.splice(index, 1);
       $scope.updateBoard();
     }

     // api call to server side scrape of link url
     $scope.scrapeLink = function(link) {
       $http.post('/api/links/', {'url': link.url}).success(function(linkData) {
         console.log(linkData);
         link.title = linkData.title;
         link.favicon = linkData.favicon; 
         link.edit = !link.edit;
         $scope.updateBoard();
       });
     }


     // open a link
     $scope.openLink = function (url){
       $window.open(url);
     }



    // handels adding a note to a board
    $scope.addNote = function (link, text) {
      var note = new Note;
      note.text = text;
      note.edit = false;
      note.toggleEdit = function(){
        note.edit = !note.edit;
      }
      link.notes.push(note);
      $scope.updateBoard();
    }




    // handels editing a boards title
    $scope.toggleEditBoardTitle = function() {
      if (!$scope.Board.editTitle) {
        $scope.Board.editTitle = true;
      } else {
        $scope.Board.editTitle = false;
        $scope.updateBoard();
        $scope.currentUser.boards.forEach(function(boardMeta) {
          if (boardMeta.id === $scope.Board._id) {
            boardMeta.title = $scope.Board.title;
          }
        });
        User.changeBoards({ id: $scope.currentUser._id }, {boards: $scope.currentUser.boards},
        function (user){
          console.log("hello _________________________");
          console.log(user);
          console.log("hello _________________________");
        })
      }
    }

    $scope.updateBoard = function(){
      board.update($scope.Board).success(function(boardMeta) {
        $scope.findBoard();
      });
    }

    $scope.deleteBoard = function() {
      board.delete($scope.Board._id).success(function(board){
        var index;
        $scope.currentUser.boards.forEach(function(boardMeta, indx) {
          if (boardMeta.id === $scope.Board._id) {
            index = indx;
          }
        });
        $scope.currentUser.boards.splice(index, 1);
        User.changeBoards({ id: $scope.currentUser._id }, {boards: $scope.currentUser.boards},
          function (user){
            console.log("hello _________________________");
            console.log(user);
            console.log("hello _________________________");
          })
        $location.path('/myboards/' + $scope.currentUser._id + '/' + $scope.currentUser.boards[0].id);
      })
    }



  });