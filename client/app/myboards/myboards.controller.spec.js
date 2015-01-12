'use strict';

describe('Controller: MyboardsCtrl', function () {

  // load the controller's module
  beforeEach(module('quizerdApp'));

  var MyboardsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyboardsCtrl = $controller('MyboardsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
