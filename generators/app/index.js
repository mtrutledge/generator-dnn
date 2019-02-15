'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

updateNotifier({
  pkg
}).notify({
  message: 'Run yo and select Update Generators to get the latest'
});

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ' + chalk.green('DNN') + ' project generator!'));
    this.log(chalk.white('This scaffolds the project in your current directory.'));


    const prompts = [
      {
        when: !this.options.projType,
        type: 'list',
        name: 'projType',
        message: 'What type of project would you like to scaffold?',
        choices: [
          { name: 'MVC Module', value: 'mvc' },
          { name: 'SPA Module', value: 'spa' },
          { name: 'Persona Bar', value: 'personabar' }
        ]
      },
      {
        when: !this.options.dnnHost,
        type: 'input',
        name: 'dnnHost',
        message: 'What is the url to your local DNN site?',
        default: 'http://dnndev.me',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.dnnRoot,
        type: 'input',
        name: 'dnnRoot',
        message: 'What is the local path to the root of your DNN site?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  composing() {
    const options = {
      projType: this.props.value,
      dnnHost: this.props.dnnHost,
      dnnRoot: this.props.dnnRoot
    };

    this.composeWith(require.resolve(`../${this.props.projType}`), options);
  }

  writing() {}

  install() {}
};
