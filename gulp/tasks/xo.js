var gulp = require('gulp');
var src = './src';
var xo = require('gulp-xo');

gulp.task('xo', function () {
    return gulp.src([
        src + '/{components,utils,models,pages}/**/!(demo)*!(.bundle).js',
        src + '/!(app.bundle).js'
    ]).pipe(xo());
});
