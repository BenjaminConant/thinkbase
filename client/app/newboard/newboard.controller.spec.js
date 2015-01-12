'use strict';

describe('Controller: NewboardCtrl', function () {

  // load the controller's module
  beforeEach(module('quizerdApp'));

  var NewboardCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewboardCtrl = $controller('NewboardCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
