/**
 * @page platform/gulp/tasks/build build
 * @parent platform/gulp/tasks
 *
 * Builds the demos and final output for the application.
 *
 * @signature `gulp build`
 * Runs the [platform/gulp/tasks/xo xo], [platform/gulp/tasks/test test], [platform/gulp/tasks/browserify browserify] and [platform/gulp/tasks/less less] tasks.
 *
 * @signature `gulp build:production`
 * The same as `build` except it runs the [platform/gulp/tasks/setProduction setProduction] task first. This sets the `NODE_ENV` to `'production'` which is used in some tasks to disable some of the debugging that is output with development builds like sourcemaps.
*/

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(cb){
    runSequence('xo', 'test', ['setProduction', 'clean:build'], 'copy', 'steal', cb);
});

gulp.task('build:skip', function(cb){
    runSequence(['setProduction', 'clean:build'], 'copy', 'steal',  cb);
});

// This one runs 4 times a day, and runs all the unit tests
gulp.task('build:full:skip-tests', function(cb){
    runSequence(['setProduction', 'clean:build'], 'copy', 'steal', cb);
});
