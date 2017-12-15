'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('DNN') + ' project generator!'
    ));
    this.log(
      chalk.white('This scaffolds the project in your current directory.')
    );

    const prompts = [{
      when: !this.options.projType,
      type: 'list',
      name: 'projType',
      message: 'What type of project would you like to scaffold?',
      choices: [
        {name: 'MVC Module', value: 'mvc'},
        {name: chalk.gray('Spa Module'), value: 'spa', disabled: chalk.gray('Coming Soon')},
        {name: chalk.gray('Webforms Module'), value: 'webforms', disabled: chalk.gray('Coming Soon')},
        {name: chalk.gray('Persona Bar'), value: 'personabar', disabled: chalk.gray('Coming Soon')},
        {name: chalk.gray('Theme'), value: 'theme', disabled: chalk.gray('Coming Soon')}
      ]
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  composing() {
    const options = {
      projType: this.props.sample
    };

    this.composeWith(require.resolve(`../${this.props.projType}`), options);
    //this.composeWith(require.resolve('generator-fountain-gulp/generators/app'), options);
  }

  writing() {
  }

  install() {
    //this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
