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

gulp.task('copy', function() {
    gulp.src(['./src/index.production.html', './src/route-list.json', './src/bootstrap-theme.html'])
        .pipe(gulp.dest('./target'));
});
