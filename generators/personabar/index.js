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
          message: 'What is the name of your Persona Bar Module?',
          validate: str => {
            return str.length > 0;
          }
        }];
    
        return this.prompt(prompts).then(props => {
          // To access props later use this.props.someAnswer;
          this.props = props;
        });
      }

    writing() {
      this.log(
          chalk.white('Creating Persona Bar Module.')
      );
    }

  install() {
    //this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
