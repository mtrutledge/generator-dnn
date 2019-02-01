// require modules
var path = require("path");
var fs = require('fs');
var archiver = require('archiver');
var package = require('../package.json');

function createResourcesArchive(){
    var ws = fs.createWriteStream(`dist/Resources.zip`);
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    archive.pipe(ws);
    ws.on('end', function() {
        console.log('Data has been drained');
      });
    ws.on("close", function() { console.log(archive.pointer() + ' total bytes'); console.log("Created Resources"); createInstaller(); });
    
    archive.glob("**/*.{cshtml,ascx,asmx,htm,html,js,css,resx,png,gif,svg,jpg}", { cwd: "dist" }, { prefix: "" });

    archive.finalize();
    return ws;
}

function createInstaller() {

    var outputPath = path.resolve(`dist/${package.name}_${package.version}_Install.zip`);
    if(fs.existsSync(outputPath)) {
      console.log(`Removing existing package ${outputPath}`);
      fs.unlinkSync(outputPath);
    }

    var output = fs.createWriteStream(outputPath);
    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });
    archive.on('error', function(err) {
      throw err;
    });
    archive.pipe(output);

    output.on('end', function() {
        console.log('Data has been drained');
      });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        fs.unlinkSync(path.resolve("dist/Resources.zip"));
        console.log(archive.pointer() + ' total bytes');
        console.log('DNN Install Package Created.');
    });

    archive.glob("bin/*.*", { cwd: "dist", ignore: [outputPath] });
    archive.glob("Providers/**/*.*", { cwd: "dist", ignore: [outputPath] });
    archive.glob("*.{txt,dnn}", { cwd: "dist", ignore: [outputPath] });
    archive.file(path.resolve("dist/Resources.zip"), { name: "Resources.zip" });

    archive.finalize();
}
 
createResourcesArchive();