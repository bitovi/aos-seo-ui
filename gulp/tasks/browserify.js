/**
 * @page platform/gulp/tasks/browserify browserify
 * @parent platform/gulp/tasks
 *
 * Uses Browserify to bundle all JavaScript and template files using Browserify.
 *
 * ### Directory Aliases
 * The [remapify](https://github.com/joeybaker/remapify) plugin for Browserify allows the use of directory aliases. An alias is created for each [platform/gulp/config/remapify config] entry in the `remapify` property of the [platform/gulp/config/browserify browserify config].
 * For example, all of the Bootstrap files from `./node_modules/bootstrap/js/*.js` can be aliased to `bootstrap/*.js` so this:
 *
 * ```js
 * require('../../node_modules/bootstrap/js/tooltip.js');
 * ```
 *
 * becomes:
 *
 * ```js
 * require('bootstrap/tooltip.js');
 * ```
 *
 * ### Watching
 * The browserify task takes care of it's own watching using watchify. It will only do this if the global `isWatching` flag is true.
 *
 * ### Configuration
 * The behavior of this task can be changed using the [platform/gulp/config/browserify browserify] configuration
 *
 * @signature `gulp browserify`
 *
 * Runs the `browserify:app` and `browserify:demo`.
 *
 *
 *
 * @signature `gulp browserify:app`
 *
 * Runs the `browserify:app-debug` and `browserify:app-min` tasks to create the production and debug application bundles.
 *
 *
 *
 * @signature `gulp browserify:app-debug`
 *
 * Creates the [platform/gulp/config/appBundleConfig debug application bundle] which has sourcemaps.
 *
 *
 *
 * @signature `gulp browserify:app-min`
 *
 * Creates the [platform/gulp/config/appMinBundleConfig production application bundle] which has no sourcemaps and is minified.
 *
 *
 *
 * @signature `gulp browserify:demos`
 *
 * Creates the [platform/gulp/config/demoBundleConfig demo bundles]. Optionally you can filter the demos to be bundled which reduces the build time.
 *
 * @param {String} [--filter]  filters the demo bundles to be built
 *
*/

var browserify = require('browserify');
var watchify = require('watchify');
var bundleLogger = require('pui/src/gulp/util/bundleLogger');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var glob = require('glob');
var path = require('path');
var replacifyTransforms = require('../util/replacify');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var streamify = require('gulp-streamify');
var config = require('../config').browserify;
var minimist = require('minimist');
var aliasify = require('aliasify');
var compilifyTransform = require('../util/can-compilify.js');
var errorHandler = require('pui/src/gulp/util/handleErrors')({
    title: "Browserify Error",
});

var args = minimist(process.argv.slice(2));

function filterBundles(bundles) {
    var filter = args.filter || false;
    var filtered = bundles;
    if(filter) {
        filtered = bundles.filter(function(bundle){
            return bundle.entries.indexOf(filter) !== -1;
        });
    }
    return filtered;
}

function processBundles(bundles, min, requires, callback) {
    var bundleQueue = bundles.length;

    var browserifyThis = function(bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Enable source maps in non-minified builds
            debug: !min
        });

        //can-compilify
        //Global means all incoming stache files from dependencies get compiled
        bundler.transform(compilifyTransform, {
            global: true
        });

        //String replacement
        replacifyTransforms.forEach(function(r){
            bundler.transform(r);
        });

        if(requires.length > 0) {
            requires.forEach(function(toAdd){
                bundler.add(toAdd);
            });
        }

        var bundle = function() {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.dest + '/' + bundleConfig.outputName);

            return bundler
                .bundle()
                .on('error', errorHandler)
                .pipe(gulpif(!min, exorcist(bundleConfig.dest + '/' + bundleConfig.outputName + '.map')))
                .pipe(source(bundleConfig.outputName))
                .pipe(streamify(gulpif(min, uglify())))
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);
        };

        if(global.isWatching) {
            bundler = watchify(bundler);
            bundler.on('update', bundle);
        }

        var reportFinished = function() {
            bundleLogger.end(bundleConfig.dest + '/' + bundleConfig.outputName);

            if(bundleQueue) {
                bundleQueue--;
                if(bundleQueue === 0) {
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    bundles.forEach(browserifyThis);
}

gulp.task('browserify', ['browserify:app', 'browserify:demos']);

gulp.task('browserify:app', ['browserify:app-debug', 'browserify:app-min']);

gulp.task('browserify:app-debug', function(callback){
    processBundles(config.appBundles, false, ['./src/utils/debug.js', './src/models/fixtures.js'], callback);
});

gulp.task('browserify:app-min', function(callback){
    processBundles(config.appMinBundles, true, ['./src/utils/debug.js', './src/models/fixtures.js'], callback);
});

gulp.task('browserify:demos', function(callback){
    processBundles(filterBundles(config.demoBundles), false, ['./src/utils/debug.js'], callback);
});
