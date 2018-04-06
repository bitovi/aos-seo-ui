var fs = require('fs');
var path = require('path');
var glob = require('glob-all');

module.exports = function requireAll(options) {
    var destinationFile = path.join(__dirname, '/../', options.output);
    var fileContents = 'require(\'../src/app.less!\');\n';

    glob(options.files, options, function (er, files) {
        files.forEach(function (file) {
            fileContents += 'require(\'' + file.replace('.js', '') + '\');\n';
        });

        fs.writeFile(destinationFile, fileContents, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log('Test files created.');
        });
    });
};
