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
      },
      {
        when: !this.options.parentMenu,
        type: 'list',
        name: 'parentMenu',
        message: 'What menu will your Persona Bar Module show in?',
        choices: [
          { name: 'Content', value: 'Content' },
          { name: 'Settings', value: 'Settings' }
        ]
      },
      {
        when: !this.options.menuLinkName,
        type: 'input',
        name: 'menuLinkName',
        message: 'How do you want your menu link to display?:',
        default: 'My Link',
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
        this.templatePath('Providers/**'),
        this.templatePath('.babelrc'),
        this.templatePath('tsconfig.json'),
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
      this.templatePath('_PersonaBar/App_LocalResources/_Module.resx'),
      this.destinationPath(moduleName + '/App_LocalResources/' + moduleName + '.resx'),
      {
        moduleName: moduleName,
        menuLinkName: this.props.menuLinkName
      }
    );
    this.fs.copy(
      this.templatePath('_PersonaBar/css/_Module.css'),
      this.destinationPath(moduleName + '/css/' + moduleName + '.css')
    );
    this.fs.copyTpl(
      this.templatePath('_PersonaBar/scripts/_Module.js'),
      this.destinationPath(moduleName + '/scripts/' + moduleName + '.js'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );
    this.fs.copyTpl(
      this.templatePath('_PersonaBar/_Module.html'),
      this.destinationPath(moduleName + '/' + moduleName + '.html'),
      { moduleName: moduleName }
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        currentYear: currentDate.getFullYear(),
        solutionGuid: solutionGuid,
        projectGuid: projectGuid,
        parentMenu: this.props.parentMenu
      }
    );

    this.fs.copyTpl(
      this.templatePath('_Project.csproj'),
      this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
      {
        namespace: namespace,
        moduleName: moduleName,
        projectGuid: this.props.projectGuid
      }
    );

    this.fs.copyTpl(
      [
        this.templatePath('_BuildScripts/**'),
        this.templatePath('Properties/**'),
        this.templatePath('src/**'),
        this.templatePath('MenuControllers/**'),
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
    this.log(chalk.white('Adding DNN NPM MyGet Registry'));
    this.spawnCommandSync('npm config set registry', [
      'https://www.myget.org/F/dnn-software-public/npm/'
    ]);
    this._defaultInstall();
  }
};
