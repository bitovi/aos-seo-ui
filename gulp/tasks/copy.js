/**
 * @page platform/gulp/tasks/copy copy
 * @parent platform/gulp/tasks
 *
 * Copies files and directories
 *
 * @signature `gulp copy:`
 *
 * runs the `copy:app` and `copy:demos` tasks.
 *
 * @signature `gulp copy:app`
 *
 * Runs the [platform/gulp/tasks/browserify browserify:app] and [platform/gulp/tasks/less less:app] tasks before copying all the application assets needed to that /target/ folder.
 *
 * @signature `gulp copy:demos`
 *
 * Runs the [platform/gulp/tasks/browserify browserify:demos] and [platform/gulp/tasks/less less:demos] tasks before copying all component demos to the /target/demos/ directory.
 *
 * ## String Replace
 *
 * Optionally any copy operation can also perform string replacement on the destination file.
*/

var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var minimist = require('minimist');
var config = require('../config').copy;
var errorHandler = require('pui/src/gulp/util/handleErrors')({
    title: "Copy Error",
});

var args = minimist(process.argv.slice(2));

function filterCopies(copies) {
    var filter = args.filter || false;
    var filtered = copies;
    if(filter) {
        filtered = copies.filter(function(copy){
            return copy.src.indexOf(filter) !== -1;
        });
    }
    return filtered;
}

var processCopies = function(copies, callback){
    var copyQueue = copies.length;

    var copyThis = function(copyConfig) {

        var copy = function() {
            var copyStream = gulp.src(copyConfig.src)
                .on('error', errorHandler);

            if(typeof copyConfig.replace !== 'undefined') {
                copyConfig.replace.forEach(function(r){
                    copyStream.pipe(replace(r.search, r.replace));
                });
            }

            if(typeof copyConfig.outputName !== 'undefined') {
                copyStream.pipe(rename(copyConfig.outputName));
            }

            copyStream.pipe(gulp.dest(copyConfig.dest))
                .on('end', reportFinished);

                return copyStream;
        };

        if(global.isWatching) {
            gulp.watch([copyConfig.src], copy);
        }

        var reportFinished = function() {

            if(copyQueue) {
                copyQueue--;
                if(copyQueue === 0) {
                    callback();
                }
            }
        };

        return copy();
    };

    copies.forEach(copyThis);
};

gulp.task('copy:app', ['bootstrapify', 'browserify:app', 'less:app'], function(callback){
    processCopies(config.app, callback);
});

gulp.task('copy:demos', ['bootstrapify', 'browserify:demos', 'less:demos'], function(callback){
    processCopies(filterCopies(config.demos), callback);
});

gulp.task('copy', ['copy:app', 'copy:demos']);
