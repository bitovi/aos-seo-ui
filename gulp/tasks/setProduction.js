/**
 * @page platform/gulp/tasks/setProduction setProduction
 * @parent platform/gulp/tasks
 *
 * @signature `gulp setProduction`
 * Sets the global `isProduction` flag to `true` and set the NODE_ENV environment variable to `'production'`.
*/

var gulp = require('gulp');

gulp.task('setProduction', function() {
    global.isProduction = true;
    process.env.NODE_ENV = 'production';

    // The build hanges in some environments, this helps it along
    gulp.on('stop', function() {
        process.nextTick(function() {
            process.exit(0);
        });
    });
});

