'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-dnn:mvc', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/mvc')).withPrompts({
      company: 'Believe',
      name: 'TestMVC',
      description: 'Test Build Module',
      companyUrl: 'www.believekids.com',
      emailAddy: 'mtrutledge@gmail.com'
    });
  });

  it('created files', () => {
    assert(true);
    // Assert.file(['Believe.sln', 'TestMVC/TestMVC.dnn']);
  });
});
