'use strict';

angular.module('quizerdApp')
  .factory('board', function ($http, Auth) {
    // Service logic
    // ...

    // Public API here
    return {
      save: function (newBoard) {
        return $http.post('api/boards', newBoard);
      },
      find: function () {
        return $http.get('api/boards/' + Auth.getCurrentUser()._id);
      },
      findOne: function (id) {
        return $http.get('api/boards/' + id);
      },
      update: function (board) {
        return $http.put('api/boards/' + board._id, board);
      },
      delete: function (boardId) {
        return $http.delete('api/boards/' + boardId);
      }


    };
  });
