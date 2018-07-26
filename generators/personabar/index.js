'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');

module.exports = class extends DnnGeneratorBase {
  prompting() {
    const prompts = [
      {
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your module (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your Persona Bar Module?',
        default: this.appname,
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
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.emailAddy,
        type: 'input',
        name: 'emailAddy',
        message: 'Your e-mail address:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.projectGuid = this._generateGuid();
      props.solutionGuid = this._generateGuid();
      props.namespace = this._pascalCaseName(props.company);
      props.moduleName = this._pascalCaseName(props.name);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating Persona Bar Module.'));

    let namespace = this.props.namespace;
    let moduleName = this.props.moduleName;
    let currentDate = this.props.currentDate;
    let projectGuid = this.props.projectGuid;
    let solutionGuid = this.props.solutionGuid;

    // Copy gulp build files and other common files
    this._copyCommon(namespace, moduleName);

    // Do all regulare copies
    this.fs.copy(
      [
        this.templatePath('App_LocalResources/**'),
        this.templatePath('_BuildScripts/**'),
        this.templatePath('Components/**'),
        this.templatePath('Controllers/**'),
        this.templatePath('Providers/**'),
        this.templatePath('Resources/**'),
        this.templatePath('tsconfig.json'),
        this.templatePath('Properties/**'),
        this.templatePath('packages.config'),
        this.templatePath('License.md'),
        this.templatePath('ReleaseNotes.md'),
        this.templatePath('web.config'),
        this.templatePath('web.Debug.config'),
        this.templatePath('web.Release.config')
      ],
      this.destinationPath(moduleName + '/')
    );

    // Do all templated copies
    this.fs.copyTpl(
      [
        this.templatePath('Components/FeatureController.cs'),
        this.templatePath('Controllers/DataController.cs'),
        this.templatePath('src/**'),
        this.templatePath('RouteConfig.cs'),
        this.templatePath('Edit.html'),
        this.templatePath('Settings.html'),
        this.templatePath('View.html'),
        this.templatePath('manifest.dnn'),
        this.templatePath('Properties/AssemblyInfo.cs'),
        this.templatePath('_Project.csproj'),
        this.templatePath('package.json'),
        this.templatePath('gulpfile.js')
      ],
      this.destinationPath(moduleName + '/'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        currentYear: currentDate.getFullYear(),
        solutionGuid: solutionGuid,
        projectGuid: projectGuid
      }
    );

    this._writeSolution();
  }

  install() {
    this._defaultInstall();
  }
};
