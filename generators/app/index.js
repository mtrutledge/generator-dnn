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
    this.log(yosay('Welcome to the ' + chalk.red('DNN') + ' project generator!'));
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
          {
            name: chalk.gray('Persona Bar'),
            value: 'personabar',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('Theme'),
            value: 'theme',
            disabled: chalk.gray(
              'For the best starter DNN theme use nvQuickTheme (https://www.nvquicktheme.com)'
            )
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
