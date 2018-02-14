'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ' + chalk.red('DNN') + ' project generator!'));
    this.log(chalk.white('This scaffolds DNN Module projects for you.'));

    // Check to see if they are currently in the root of a DNN installation directory
    let insideDnnEnv = this.fs.exists('./DotNetNuke.log4net.config');

    const prompts = [
      {
        when: !this.options.devEnvChoice,
        type: 'list',
        name: 'devEnvChoice',
        message:
          'Do you prefer developing your modules inside a DNN instance or outside a DNN instance?',
        choices: [
          { name: 'Inside DNN', value: 'insideDnn' },
          { name: 'Outside DNN', value: 'outsideDnn' }
        ],
        store: true
      },
      {
        when: function(response) {
          return !insideDnnEnv && response.devEnvChoice === 'insideDnn';
        },
        type: 'input',
        name: 'dnnRoot',
        message: 'What is the root directory of your DNN instance?',
        default: 'C:\\inetpub\\wwwroot\\DNN',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.projType,
        type: 'list',
        name: 'projType',
        message: 'What type of project would you like to scaffold?',
        choices: [
          { name: 'MVC Module', value: 'mvc' },
          {
            name: 'SPA Module (Currently ReactJS with TypeScript components)',
            value: 'spa'
          },
          {
            name: chalk.gray('Persona Bar'),
            value: 'personabar',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('Theme'),
            value: 'theme',
            disabled: chalk.gray('Coming Soon')
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  composing() {
    const options = {
      projType: this.props.value
    };

    this.composeWith(require.resolve(`../${this.props.projType}`), options);
    // This.composeWith(require.resolve('generator-fountain-gulp/generators/app'), options);
  }

  writing() {}

  install() {
    // This.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
