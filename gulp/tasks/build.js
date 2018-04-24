/**
 * @page platform/gulp/tasks/build build
 * @parent platform/gulp/tasks
 *
 * Builds the demos and final output for the application.
 *
 * @signature `gulp build`
 * Runs the [platform/gulp/tasks/xo xo], [platform/gulp/tasks/test test], [platform/gulp/tasks/setProduction setProduction], [platform/gulp/tasks/clean clean:build], [platform/gulp/tasks/copy copy], and [platform/gulp/tasks/steal steal] tasks.
 *
 * @signature `gulp build:skip`
 * The same as `build` except it skips the lint and unit test tasks.
*/

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function (cb) {
    runSequence('xo', 'test', ['setProduction', 'clean:build'], 'copy', 'steal', cb);
});

gulp.task('build:skip', function (cb) {
    runSequence(['setProduction', 'clean:build'], 'copy', 'steal', cb);
});
