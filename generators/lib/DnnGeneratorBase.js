'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const uuid = require('uuid-v4');
const pascalCase = require('pascal-case');
const which = require('which');

module.exports = class DnnGeneratorBase extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

  _hasYarn() {
    return which.sync('yarn', { nothrow: true }) !== undefined;
  }

  _generateGuid() {
    return uuid();
  }

  _pascalCaseName(val) {
    return pascalCase(val);
  }

  _createSolutionFromTemplate() {
    this.log(chalk.white('Creating sln.'));
    return this.spawnCommandSync('dotnet', [
      'new',
      'sln',
      '-n',
      this.props.company,
      '-o',
      this.destinationRoot()
    ]);
  }

  _addProjectToSolution() {
    this.log(chalk.white('Adding project to sln.'));
    this.spawnCommandSync('dotnet', [
      'sln',
      this.destinationPath(this.props.company + '.sln'),
      'add',
      this.destinationPath(`${this.props.moduleName}/${this.props.moduleName}.csproj`)
    ]);
  }

  _writeSolution() {
    let namespace = this.props.company;
    let slnFileName = this.destinationPath(namespace + '.sln');
    this.log(
      chalk.white(
        'Looking for sln [' + slnFileName + ']. Result: ' + this.fs.exists(slnFileName)
      )
    );
    if (this.fs.exists(slnFileName) === false) {
      this._createSolutionFromTemplate();
    }
    this._addProjectToSolution();
  }

  _copyCommon(namespace, moduleName) {
    this.fs.copyTpl(
      this.templatePath('../../gulp/*.js'),
      this.destinationPath(moduleName + '/_BuildScripts/gulp/'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );
  }

  _defaultInstall() {
    if (!this.options.noinstall) {
      let hasYarn = this._hasYarn();
      process.chdir(this.props.moduleName);
      this.installDependencies({ npm: !hasYarn, bower: false, yarn: hasYarn });
    }
  }
};
