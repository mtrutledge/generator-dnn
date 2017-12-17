'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const Utils = require('../../lib/Utils');

module.exports = class extends Generator {
    prompting() {
        const prompts = [{
            when: !this.options.company,
            type: 'input',
            name: 'company',
            message: 'Namespace for your module (Usually a company name)?',
            validate: str => {
              return str.length > 0;
            }
          },
          {
          when: !this.options.name,
          type: 'input',
          name: 'name',
          message: 'What is the name of your MVC Module?',
          validate: str => {
            return str.length > 0;
            }
          },
          {
            when: !this.options.description,
            type: 'input',
            name: 'description',
            message: 'Describe your module:',
            validate: str => {
              return str.length > 0;
            }
          },
          {
            when: !this.options.companyUrl,
            type: 'input',
            name: 'companyUrl',
            message: 'Company Website:',
            validate: str => {
              return str.length > 0;
            }
          },
          {
            when: !this.options.emailAddy,
            type: 'input',
            name: 'emailAddy',
            message: 'Your e-mail address:',
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

    writing() {
        this.log(
            chalk.white('Creating MVC Module.')
        );

        // TODO: Need to remove spaces and pascal case namespace and module name

        this.fs.copy(this.templatePath('App_LocalResources/*'), this.destinationPath(this.props.name + '/App_LocalResources/'));
                
        this.fs.copyTpl(
            this.templatePath('Controllers/SettingsController.cs'),
            this.destinationPath(this.props.name + '/Controllers/SettingsController.cs'),
            { 
                namespace: this.props.company,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('Models/Settings.cs'),
            this.destinationPath(this.props.name + '/Models/Settings.cs'),
            { 
                namespace: this.props.company,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('Views/_ViewStart.cshtml'),
            this.destinationPath(this.props.name + '/Views/_ViewStart.cshtml'),
            { 
                namespace: this.props.company,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('Views/Settings/Settings.cshtml'),
            this.destinationPath(this.props.name + '/Views/Settings/Settings.cshtml'),
            { 
                namespace: this.props.company,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath(this.props.name + '/manifest.dnn'),
            this.destinationPath(this.props.name + '.dnn'),
            { 
                namespace: this.props.company,
                moduleName: this.props.name,
                description: this.props.description,
                companyUrl: this.props.companyUrl,
                emailAddy: this.props.emailAddy,
            }
        );
        
        let projectGuid = Utils.generateGuid();

        this.fs.copyTpl(
            this.templatePath('_Project.csproj'),
            this.destinationPath(this.props.name + '/' + this.props.name + '.csproj'),
            { 
                namespace: this.props.company,
                moduleName: this.propßs.name,
                projectGuid: projectGuid
            }
        );

        this.fs.copy(this.templatePath('License.txt'), this.destinationPath(this.props.name + '/License.txt'));
        this.fs.copy(this.templatePath('ReleaseNotes.txt'), this.destinationPath(this.props.name + '/ReleaseNotes.txt'));
    }

  install() {
    //this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
