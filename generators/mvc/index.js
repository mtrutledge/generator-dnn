'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const uuid = require('uuid-v4');
const pascalCase = require('pascal-case');

module.exports = class extends Generator {
  prompting() {
    const prompts = [
      {
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
    this.log(chalk.white('Creating MVC Module.'));

    // TODO: Need to remove spaces and pascal case namespace and module name
    let namespace = pascalCase(this.props.company);
    let moduleName = pascalCase(this.props.name);

    this.fs.copy(
      this.templatePath('App_LocalResources/**'),
      this.destinationPath(moduleName + '/App_LocalResources/')
    );
    this.fs.copy(
      this.templatePath('Components/**'),
      this.destinationPath(moduleName + '/Components/')
    );
    this.fs.copy(
      this.templatePath('Controllers/**'),
      this.destinationPath(moduleName + '/Controllers/')
    );
    this.fs.copy(
      this.templatePath('Models/**'),
      this.destinationPath(moduleName + '/Models/')
    );
    this.fs.copy(
      this.templatePath('Providers/**'),
      this.destinationPath(moduleName + '/Providers/')
    );
    this.fs.copy(
      this.templatePath('Resources/**'),
      this.destinationPath(moduleName + '/Resources/')
    );
    this.fs.copy(
      this.templatePath('Views/**'),
      this.destinationPath(moduleName + '/Views/')
    );
    this.fs.copy(
      this.templatePath('Properties/**'),
      this.destinationPath(moduleName + '/Properties/')
    );

    this.fs.copyTpl(
      this.templatePath('Components/FeatureController.cs'),
      this.destinationPath(moduleName + '/Components/FeatureController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/SettingsController.cs'),
      this.destinationPath(moduleName + '/Controllers/SettingsController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/HomeController.cs'),
      this.destinationPath(moduleName + '/Controllers/HomeController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Models/Settings.cs'),
      this.destinationPath(moduleName + '/Models/Settings.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/_ViewStart.cshtml'),
      this.destinationPath(moduleName + '/Views/_ViewStart.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/Settings/Settings.cshtml'),
      this.destinationPath(moduleName + '/Views/Settings/Settings.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/Home/Edit.cshtml'),
      this.destinationPath(moduleName + '/Views/Home/Edit.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/Home/Index.cshtml'),
      this.destinationPath(moduleName + '/Views/Home/Index.cshtml'),
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
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy
      }
    );

    let currentDate = new Date();

    this.fs.copyTpl(
      this.templatePath('Properties/AssemblyInfo.cs'),
      this.destinationPath(moduleName + '/Properties/AssemblyInfo.cs'),
      {
        namespace: namespace,
        moduleName: moduleName,
        currentYear: currentDate.getFullYear()
      }
    );

    let projectGuid = uuid();
    let solutionGuid = uuid();

    this.fs.copyTpl(
      this.templatePath('_Project.csproj'),
      this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
      {
        namespace: namespace,
        moduleName: moduleName,
        projectGuid: projectGuid
      }
    );

    this.fs.copyTpl(
      this.templatePath('_Template.sln'),
      this.destinationPath(namespace + '.sln'),
      {
        moduleName: moduleName,
        projectGuid: projectGuid,
        solutionGuid: solutionGuid
      }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(moduleName + '/package.json'),
      {
        namespace: namespace,
        moduleName: moduleName,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy
      }
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath(moduleName + '/gulpfile.js'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copy(
      this.templatePath('packages.config'),
      this.destinationPath(moduleName + '/packages.config')
    );
    this.fs.copy(
      this.templatePath('License.txt'),
      this.destinationPath(moduleName + '/License.txt')
    );
    this.fs.copy(
      this.templatePath('ReleaseNotes.txt'),
      this.destinationPath(moduleName + '/ReleaseNotes.txt')
    );
  }

  install() {
    process.chdir(this.props.name);
    this.installDependencies({ npm: true, bower: false, yarn: false }).then(() => {
      this.log(chalk.white('Creating MVC Module.'));
      process.chdir('../');
    });
  }
};
