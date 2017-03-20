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
 *
 * ## String Replace
 *
 * Optionally any copy operation can also perform string replacement on the destination file.
*/
var gulp = require('gulp');

gulp.task('copy', function() {
    gulp.src(['./src/index.production.html', './src/route-list.json', './src/bootstrap-theme.html'])
        .pipe(gulp.dest('./target'));
});
