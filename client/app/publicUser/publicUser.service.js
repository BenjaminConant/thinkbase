'use strict';

angular.module('quizerdApp')
  .factory('publicUser', function ($http) {
    // Public API here
    return {
      findOneUser: function (userId) {
        return $http.get('api/users/'+userId+'/public');
      }
    };
  });
