/**
 * @page platform/gulp/tasks/build build
 * @parent platform/gulp/tasks
 *
 * Builds the demos and final output for the application.
 *
 * @signature `gulp build`
 * Runs the [platform/gulp/tasks/jshint jshint], [platform/gulp/tasks/test test], [platform/gulp/tasks/browserify browserify] and [platform/gulp/tasks/less less] tasks.
 *
 * @signature `gulp build:production`
 * The same as `build` except it runs the [platform/gulp/tasks/setProduction setProduction] task first. This sets the `NODE_ENV` to `'production'` which is used in some tasks to disable some of the debugging that is output with development builds like sourcemaps.
*/

var gulp = require('gulp');
var tasks = ['jshint'];

// The default will go to build:app
gulp.task('build', ['build:app']);

// This one runs on commit, and builds the main app consumed by seo
gulp.task('build:app', ['setProduction', 'clean:build', 'copy:app']);
// This one runs on commit, and builds the demos. They are deployed to a special QA server
gulp.task('build:demos', ['setProduction', 'clean:build', 'copy:demos']);
// This one runs 4 times a day, and runs all the unit tests
gulp.task('build:full', ['setProduction','test', 'clean:build', 'copy']);

gulp.task('build:full:skip-tests', ['setProduction', 'clean:build', 'copy']);
