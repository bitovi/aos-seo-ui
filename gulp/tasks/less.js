/**
 * @page platform/gulp/tasks/less less
 * @parent platform/gulp/tasks
 *
 * Bundles and concatenates all LESS files into CSS files. One CSS files is created for every demo in seo-ui and another for the `src` and `target` directories where the dev and production output files live respectibely.
 *
 * ## Autoprefix
 * The generated CSS is run through [autoprefixer](https://github.com/postcss/autoprefixer-core) that adds browser prefixes.
 *
 * ### Configuration
 * The behavior of this task can be changed using the [platform/gulp/config/less less] configuration
 *
 * @signature `gulp less`
 *
 * Runs the `less:app` and `less:demos` tasks.
 *
 * @signature `gulp less:app`
 *
 * Creates the application debug and production CSS files.
 *
 * @signature `gulp less:demos`
 *
 * Creates all demo CSS files
*/

var gulp = require('gulp');
var less = require('gulp-less');
var prefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var config = require('../config').less;
var mergeStream = require('merge-stream');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var errorHandler = require('@apple/pui/src/gulp/util/handleErrors')({
    title: "LESS Error",
});

function initSourceMap(noop){
    return noop ? gutil.noop : sourcemaps.init;
}

function writeSourceMap(noop){
    return noop ? gutil.noop : sourcemaps.write;
}

function lessApp(min){
    var outputName = 'app' + (min ? '.min' : '') + '.css';

    return gulp.src(config.app.src, {base: 'src'})
        .pipe(initSourceMap(min)())
        .pipe(less(config.options))
        .on('error', errorHandler)
        .pipe(prefixer(config.autoprefixer))
        .pipe(concat(outputName))
        .pipe(writeSourceMap(min)())
        .pipe(gulp.dest(config.app.dest));
}

// This is a quick workaround.  We shouldn't be changing the source
gulp.task('less', ['less:demos', 'less:app']);

gulp.task('less:app', function() {

    if(global.isWatching) {
        gulp.watch([config.app.watch], ['less:app']);
    }

    var appMin = lessApp(true);
    var app = lessApp(false);

    return mergeStream(appMin, app);

});

gulp.task('less:demos', function() {

    if(global.isWatching) {
        gulp.watch([config.demo.watch], ['less:demos']);
    }

    return gulp.src(config.demo.src)
        .pipe(initSourceMap()())
        .pipe(less(config.options))
        .on('error', errorHandler)
        .pipe(prefixer(config.autoprefixer))
        .pipe(writeSourceMap()())
        .pipe(gulp.dest(config.demo.dest));

});
