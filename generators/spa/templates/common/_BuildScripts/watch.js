/* eslint-disable no-console */
const pkg = require('../package.json');
const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

function copy(srcDir, srcRelativePath, destDir) {
  const fullSrcPath = path.join(srcDir, srcRelativePath);
  const fullDestPath = path.join(destDir, srcRelativePath);

  return fs
    .ensureDir(path.dirname(fullSrcPath))
    .then(() => fs.copy(fullSrcPath, fullDestPath));
}

const relative = srcFullPath => path.relative(srcDir, srcFullPath);

const srcDir = "dist/**";
const binDir = './bin';
let destAssemblyDir = `${pkg.dnn.dnnRoot}/bin/`;
// eslint-disable-next-line prettier/prettier
let destModuleDir = `${pkg.dnn.dnnRoot}/DesktopModules/<%= namespace %>/<%= moduleName %>/Resources`;

const moduleWatcher = chokidar.watch(srcDir, {
  ignoreInitial: true,
  ignored: ['**/*.{pdb,dll,js,sql,dnn}']
});

moduleWatcher.on('add', path => {
  copy(srcDir, relative(path), destModuleDir)
    .then(() => console.log({ relative: relative(path), type: 'add' }))
    .catch(reason => console.log(reason));
});

moduleWatcher.on('change', path => {
  copy(srcDir, relative(path), destModuleDir)
    .then(() => console.log({ relative: relative(path), type: 'change' }))
    .catch(reason => console.log(reason));
});

const assemblyWatcher = chokidar.watch(srcDir, {
  ignoreInitial: true,
  ignored: ['!**/*.dll', '!**/*.pdb', '**']
});

const assemblyWatcher = chokidar.watch(`${binDir}/*.{dll,pdb}`, {
  ignoreInitial: true,
  ignored: ['Dnn*', 'DotNetNuke*', 'System*', 'Microsoft*', 'Newtonsoft*', '*.deps.json']
});

assemblyWatcher.on("add", file => {
  copy(binDir,  path.relative(binDir, file), destAssemblyDir)
      .then(() => console.log({ src: 'Assembly Watcher', relative: path.relative(binDir, file), type: "add" }))
      .catch(reason => console.log(reason));
});

assemblyWatcher.on("change", file => {
  copy(binDir,  path.relative(binDir, file), destAssemblyDir)
      .then(() => console.log({ src: 'Assembly Watcher', relative: path.relative(binDir, file), type: "change" }))
      .catch(reason => console.log(reason));
});