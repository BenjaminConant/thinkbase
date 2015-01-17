'use strict';

describe('Service: publicUser', function () {

  // load the service's module
  beforeEach(module('quizerdApp'));

  // instantiate service
  var publicUser;
  beforeEach(inject(function (_publicUser_) {
    publicUser = _publicUser_;
  }));

  it('should do something', function () {
    expect(!!publicUser).toBe(true);
  });

});
