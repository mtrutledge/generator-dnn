'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');

module.exports = class extends DnnGeneratorBase {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

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
        message: 'What is the name of your MVC Module?',
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
      props.namespace = this._pascalCaseName(props.company);
      props.moduleName = this._pascalCaseName(props.name);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating MVC Module.'));

    let namespace = this.props.namespace;
    let moduleName = this.props.moduleName;
    let currentDate = this.props.currentDate;

    let template = {
      namespace: namespace,
      moduleName: moduleName,
      moduleFriendlyName: this.props.name,
      description: this.props.description,
      companyUrl: this.props.companyUrl,
      emailAddy: this.props.emailAddy,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName,
      parentMenu: this.props.parentMenu
    };

    this.fs.copyTpl(
      this.templatePath('../../common/build/*.*'),
      this.destinationPath(moduleName + '/_BuildScripts'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/Providers/**'),
      this.destinationPath(moduleName + '/Providers'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/NuGet.config'),
      this.destinationPath(moduleName + '/NuGet.config'),
      template
    );

    // Do all templated copies
    this.fs.copyTpl(
      this.templatePath('../../common/src/**'),
      this.destinationPath(moduleName + '/src/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('App_LocalResources/**'),
      this.destinationPath(moduleName + '/App_LocalResources/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('_BuildScripts/**'),
      this.destinationPath(moduleName + '/_BuildScripts/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Components/**'),
      this.destinationPath(moduleName + '/Components/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/**'),
      this.destinationPath(moduleName + '/Controllers/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Models/**'),
      this.destinationPath(moduleName + '/Models/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('src/**'),
      this.destinationPath(moduleName + '/src/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Views/**'),
      this.destinationPath(moduleName + '/Views/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('RouteConfig.cs'),
      this.destinationPath(moduleName + '/RouteConfig.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
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
        emailAddy: this.props.emailAddy
      }
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/_Project.csproj'),
      this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(moduleName + '/package.json'),
      template
    );

    const pkgJson = {
      devDependencies: {
        // eslint-disable-next-line prettier/prettier
        'archiver': '^3.0.0',
        'copy-webpack-plugin': '^4.6.0',
        'html-webpack-plugin': '^3.2.0',
        // eslint-disable-next-line prettier/prettier
        'marked': '^0.5.2',
        // eslint-disable-next-line prettier/prettier
        'webpack': '^4.27.1',
        'webpack-cli': '^3.1.2',
        'webpack-dev-server': '^3.1.10',
        'webpack-node-externals': '^1.7.2'
      }
    };

    // Extend package.json file in destination path
    this.fs.extendJSON(this.destinationPath(moduleName + '/package.json'), pkgJson);
  }

  install() {
    this._writeSolution();
    this._defaultInstall();
  }

  end() {
    this.log(chalk.white('Installed MVC Module npm Dependencies.'));
    this.log(chalk.white('Running dotnet restore.'));
    this.spawnCommand('dotnet', ['restore']);
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
