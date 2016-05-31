/**
 * @page platform/gulp/tasks/watch watch
 * @parent platform/gulp/tasks
 *
 * Starts a BrowserSync server that reloads when any source files are modified.
 *
 * @signature `gulp watch`
 *
 * Runs the `watch:app` and `watch:demos` tasks.
 *
 * @param {String} [--apiProxy="dev"] API proxy configuration to use
 *
 * * @signature `gulp watch:app`
 *
 * Runs the [platform/gulp/tasks/setWatch setWatch:app] and [platform/gulp/tasks/browserSync browserSync:app] tasks
 *
 * @param {String} [--apiProxy="dev"] API proxy configuration to use
 *
 * * @signature `gulp watch:demos`
 *
 * Runs the [platform/gulp/tasks/setWatch setWatch:demos] and [platform/gulp/tasks/browserSync browserSync:demos] tasks
 *
 * @param {String} [--apiProxy="dev"] API proxy configuration to use
 * @param {String} [--filter] filters the demo bundles to be built
 *
 * ## API Proxying
 * By default `watch` will proxy all API requests to the proxy defined by the `dev` proxy. To change this provide an `apiProxy` command line argument like:
 *  `--apiProxy none`.
*/

var gulp  = require('gulp');
var minimist = require('minimist');
var config = require('../config');

var args = minimist(process.argv.slice(2));


var browserSyncAPI = ':' + (typeof args.apiProxy !== 'undefined' ? args.apiProxy : 'dev');

gulp.task('watch:app', ['setWatch', 'browserSync:app' + browserSyncAPI]);
gulp.task('watch:demos', ['setWatch', 'browserSync:demos' + browserSyncAPI]);
gulp.task('watch', ['setWatch', 'browserSync' + browserSyncAPI]);
