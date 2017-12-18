'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-dnn:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      company: 'Believe',
      name: 'TestBuildMVC',
      description: 'Mock Test prompts',
      companyUrl: 'www.believekids.com',
      emailAddy: 'mtrutledge@gmail.com'
    });
  });

  it('creates files', () => {
    assert.file(['*.sln']);
  });
});
