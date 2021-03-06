'use strict';

angular.module('quizerdApp')
  .controller('MyboardsCtrl', function ($scope, board, $location, Auth, $route, $routeParams, User, $http, $window, publicUser) {


   $scope.userloggedin = true;
    // if there is no board id parameter passed, redirect to route with the first board id in user boards passed
    // if there is a board id paramerter passed, find that board and set it equal to $scope.Board
    
    $scope.findBoard = function () {
     Auth.isLoggedInAsync(function(loggedIn){
    $scope.userloggedin = loggedIn;      
      if (!loggedIn) {
        publicUser.findOneUser($routeParams.userId).success(function(user) {
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
                var realImgArray = [];
                link.images.forEach(function(imgURL) {
                  var img = new Image();
                  img.onload = function() {
                    if (this.width >= 20 && this.height >= 20){
                      realImgArray.push(imgURL);
                      link.images = realImgArray;
                    }
                  }
                  img.src = imgURL;
                });
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
       })
      }else{
        User.get(function(user, err) {
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
                var realImgArray = [];
                link.images.forEach(function(imgURL) {
                  var img = new Image();
                  img.onload = function() {
                    if (this.width >= 20 && this.height >= 20){
                      realImgArray.push(imgURL);
                      link.images = realImgArray;
                    }
                  }
                  img.src = imgURL;
                });
                
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
    });
    }
    $scope.findBoard();




    function Link() {
      this.url = "";
      this.title = "";
      this.description= "";
      this.domain = "";
      this.notes = [];
      this.images = [];
      this.displayImageIndex;
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
         link.description = linkData.description;
         link.images = linkData.images;
         link.domain = linkData.domain;
         link.displayImageIndex = 0;
         link.edit = !link.edit;
         $scope.updateBoard();
       });
     }


     // handels scrolling through images of a link
     $scope.linkImageScroll = function (link, direction) {
       if (direction === "right") {
         link.displayImageIndex += 1;
       } else {
         link.displayImageIndex -= 1;
       }
       $scope.updateBoard();


       if (link.displayImageIndex > link.images.length - 1) {
         link.displayImageIndex = 0;
       } else if (link.displayImageIndex < 0) {
         link.displayImageIndex = link.images.length -1;
       }

   }

     // open a link
     $scope.openLink = function (url){
       $window.open(url);
     }

     function Board() {
       this.creatorId = "";
       this.title = "";
       this.description = "";
       this.links = [];
     }

     // creates a new board
     $scope.newBoard = function () {
      if ($scope.userloggedin) { 
      var newBoard = new Board;
      newBoard.creatorId = Auth.getCurrentUser()._id;
      newBoard.title = "New Board"
      newBoard.description = "A description of my new board!"
      board.save(newBoard).success(function(board) {
        $location.path('/myboards/' + Auth.getCurrentUser()._id +'/' + board._id);
      });
    }
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
       if ($scope.userloggedin) { 
        if ($scope.userisloggedin)
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
    }

    $scope.toggleEditBoardDescription = function() {
      if ($scope.userloggedin) { 
        if (!$scope.Board.editDescription) {
          $scope.Board.editDescription = true;
        } else {
          $scope.Board.editDescription = false;
          $scope.updateBoard();
        }
    }
    }

    $scope.updateBoard = function(){
        board.update($scope.Board).success(function(boardMeta) {
          $scope.findBoard();
        });
    }

    $scope.deleteBoard = function() {
     if ($scope.userloggedin) { 
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
        $location.path('/myboards/' + $scope.currentUser._id + '/' + $scope.currentUser.boards[$scope.currentUser.boards.length - 1].id);
      })
    }
    }



  });