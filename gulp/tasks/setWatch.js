/**
 * @page platform/gulp/tasks/setWatch setWatch
 * @parent platform/gulp/tasks
 *
 * @signature `gulp setWatch`
 * Sets the global `isWatching` flag to `true`. Useless on its own, but very useful when combined with other tasks that need to know whether a task should be watching the file system.
*/

var gulp = require('gulp');

gulp.task('setWatch', function () {
    global.isWatching = true;
});
