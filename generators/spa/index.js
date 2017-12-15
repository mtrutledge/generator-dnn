'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
    prompting() {
        const prompts = [{
          when: !this.options.name,
          type: 'input',
          name: 'name',
          message: 'What is the name of your SPA Module?'
        }];
    
        return this.prompt(prompts).then(props => {
          // To access props later use this.props.someAnswer;
          this.props = props;
        });
      }

    writing() {
        this.log(
            chalk.white('Creating SPA Module.')
        );

      this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    //this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
