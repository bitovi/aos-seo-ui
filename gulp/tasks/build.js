/**
 * @page platform/gulp/tasks/build build
 * @parent platform/gulp/tasks
 *
 * Builds final output for the application.
 *
 * @signature `gulp build`
 * Runs the [platform/gulp/tasks/jshint jshint], [platform/gulp/tasks/test test], and
 * [platform/gulp/tasks/steal steal] tasks.
 *
 * @signature `gulp build:skip`
 * The same as `build` except it skips the tests.
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(cb){
    runSequence('jshint', 'test', ['setProduction', 'clean:build'], 'copy', 'steal', cb);
});

gulp.task('build:skip', function(cb){
    runSequence(['setProduction', 'clean:build'], 'copy', 'steal',  cb);
});
