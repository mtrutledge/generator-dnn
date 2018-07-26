import { Generator } from 'yeoman-generator';
import { chalk } from 'chalk';
import { uuid } from 'uuid-v4';
import { pascalCase } from 'pascal-case';
import { sln } from 'dotnet-solution';

export default class DnnGeneratorBase extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

  _generateGuid() {
    return uuid();
  }

  _pascalCaseName(val) {
    return pascalCase(val);
  }

  _createSolutionFromTemplate() {
    this.log(chalk.white('Creating sln from template.'));
    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let projectGuid = this.props.projectGuid;
    let solutionGuid = this.props.solutionGuid;

    this.fs.copyTpl(
      this.templatePath('_Template.sln'),
      this.destinationPath(namespace + '.sln'),
      {
        moduleName: moduleName,
        projectGuid: projectGuid,
        solutionGuid: solutionGuid
      }
    );
  }

  _addProjectToSolution() {
    this.log(chalk.white('Adding project to existing sln.'));
    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let projectGuid = this.props.projectGuid;
    let slnFileName = this.destinationPath(namespace + '.sln');

    // Create a reader, and build a solution from the lines
    const reader = new sln.SolutionReader();
    const sourceLines = this.fs
      .read(slnFileName)
      .toString()
      .split(/\r?\n/);
    const solution = reader.fromLines(sourceLines);

    solution.addProject({
      id: projectGuid, // This is the same id as in the csproj
      name: moduleName,
      path: moduleName + '\\' + moduleName + '.csproj', // Relative to the solution location
      parent: moduleName // The name or id of a folder to parent it to
    });

    // Create a writer and write back to the same file
    const writer = new sln.SolutionWriter();
    const lines = writer.write(solution);
    this.fs.write(slnFileName, lines.join('\r\n'));
  }

  _writeSolution() {
    let namespace = this.props.company;
    let slnFileName = this.destinationPath(namespace + '.sln');
    this.log(
      chalk.white(
        'Looking for sln [' + slnFileName + ']. Result: ' + this.fs.exists(slnFileName)
      )
    );
    if (this.fs.exists(slnFileName)) {
      this.log(chalk.white('Existing sln file found.'));
      this._addProjectToSolution();
    } else {
      // File does not exist
      this.log(chalk.white('No sln file found.'));
      this._createSolutionFromTemplate();
    }
  }

  _defaultInstall() {
    if (!this.options.noinstall) {
      process.chdir(this.props.moduleName);
      this.installDependencies({ npm: true, bower: false, yarn: false }).then(() => {
        this.log(chalk.white('Installed npm Dependencies.'));
        this.log(chalk.white('Running NuGet.'));
        this.spawnCommand('gulp', ['nuget']);
        process.chdir('../');
      });
    }
  }
}
