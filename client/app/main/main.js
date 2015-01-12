'use strict';

angular.module('quizerdApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/newboard', {
        templateUrl: 'app/views/newboard.html',
        controller: 'NewboardCtrl'
      })
      .when('/myboards/:userId', {
        templateUrl: 'app/views/myboards.html',
        controller: 'MyboardsCtrl'
      })
      .when('/myboards/:userId/:boardId', {
        templateUrl: 'app/views/myboards.html',
        controller: 'MyboardsCtrl'
      });

  });