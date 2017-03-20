/**
 * @page platform/gulp/tasks/steal steal
 * @parent platform/gulp/tasks
 *
 * Builds the application.
 *
 * @signature `gulp steal`
 * Runs the steal task.
 */
var gulp = require('gulp');
var stealTools = require('steal-tools');
var gutil = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var stealConfig = require('../config').steal;

gulp.task('steal', function () {
    var startTime = process.hrtime();

    gutil.log('Steal Building', gutil.colors.green('seo...'));
    return stealTools.build(stealConfig.buildConfig, stealConfig.buildOptions)
        .then(function () {
            var taskTime = process.hrtime(startTime);
            var prettyTime = prettyHrtime(taskTime);
            gutil.log('Built', gutil.colors.green('SEO'), 'in', gutil.colors.magenta(prettyTime));
        });
});
