'use strict';

angular.module('quizerdApp')
  .controller('MainCtrl', function ($scope, $http, $route, $routeParams, $location, Auth, $sce) {
    
    function Board() {
       this.creatorId = "";
       this.title = "";
       this.description = "";
       this.links = [];
     }

     function Link() {
      this.url = "";
      this.title = "";
      this.notes = [];
      this.images = [];
      this.displayImageIndex;
    }

     var firstLink = new Link();
     firstLink.url = "http://www.google.com/";
     firstLink.title = "google.com";
     firstLink.notes.push({text: "This is a pretty good search engine! ... I like Bing better though ;)", edit: false});
     firstLink.images.push("http://www.google.com/images/icons/product/chrome-48.png");
     firstLink.displayImageIndex = 0;

     $scope.Board = new Board()
     $scope.Board.title = "My First linkwire Board";
     $scope.Board.description = $sce.trustAsHtml("<em>Welcome to <strong> linkwire </strong> - a tool that helps you organize, annotate, and share the internet that is important to you. Start building your first board by clicking around this page. Make sure to </em><span ng-click='hello()' class='btn btn-primary'> sign up </span><em> to save your progress!");
     $scope.Board.links.push(firstLink);

     console.log($scope.Board);


     $scope.hello = function () {
      console.log("hello");
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
         link.images = linkData.images;
         link.displayImageIndex = 0;
         link.edit = !link.edit;
         console.log(linkData.domain);
         link.domain = linkData.domain;
         $scope.updateBoard();
       });
     }

     



     

























    $scope.awesomeThings = [];
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.userId = Auth.getCurrentUser()._id;

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
