/**
 * @page platform/gulp/tasks/watch watch
 * @parent platform/gulp/tasks
 *
 * Starts a BrowserSync server that reloads when any source files are modified.
 *
 * @signature `gulp watch`
 *
 * Runs the `watch` and `browserSync` tasks, which run and watch for changes to the application and demos.
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

gulp.task('watch', ['browserSync' + browserSyncAPI]);
