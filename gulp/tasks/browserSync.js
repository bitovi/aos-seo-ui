/**
 * @page platform/gulp/tasks/browserSync browserSync
 * @parent platform/gulp/tasks
 *
 * Creates a static server using [BrowserSync](http://www.browsersync.io/) that provides browser synchronization and live reload.
 *
 * ### Live Reload
 * BrowserSync listens for changes to any built/bunled files and will reload the browser automatically. JavaScript bundles will cause all connected browsers to refresh while CSS bundles will be injected (usually) without a refresh.
 *
 * ### HTML5 Pushstate Support
 * To support pushstate, any request to the browserSync server will seve the `index.html` if the request is a GET which accepts text/html and is not a direct file request, i.e. the requested path does not contain a . (DOT) character.
 *
 * This means that reloading the browser window while at a URL like `http://localhost3000text/list` will not trigger a 404. Instead, the application loads as expected with the route set to the correct state.
 *
 * ### Configuration
 * The behavior of this task can be changed using the [platform/gulp/config/browserSync browserSync] configuration
 *
 * @signature `gulp browserSync:<proxyENV>`
 *
 * Runs the `browserSync:app:<proxyENV>` and `browserSync:demos:<proxyENV>`.
 *
 * @signature `gulp browserSync:app:<proxyENV>`
 *
 * Runs the [platform/gulp/tasks/copy:app copy:app] task before creating a static server at `localhost:3000` with the
 * appropriate API proxy based on `<proxyENV>`.
 *
 * @signature `gulp browserSync:demos:<proxyENV>`
 *
 * Runs the [platform/gulp/tasks/copy:demos copy:demos] task before creating a static server at `localhost:3000` with the
 * appropriate API proxy based on `<proxyENV>`.

 */

var browserSync = require('browser-sync');
var gulp = require('gulp');
var historyApiMiddleware = require('@apple/pui/src/gulp/util/historyApiMiddleware')({index: '/index.html'});
var productionMiddleware = require('@apple/pui/src/gulp/util/productionMiddleware');
var url = require('url');
var _ = require('lodash');
var proxy = require('proxy-middleware');
var config = require('../config').browserSync;

function createTask(env, proxyOptions) {
    var envName = env !== '' ? ':' + env : '';
    var taskConfig = _.cloneDeep(config.options);
    taskConfig.server.middleware = [historyApiMiddleware, productionMiddleware];

    if(typeof proxyOptions !== 'undefined') {
        taskConfig.server.middleware.push(proxy(proxyOptions));
    }

    gulp.task('browserSync' + envName, function() {
        browserSync(taskConfig);
    });

}

// Create a task for each API environment
for(var env in config.apiProxies) {
    var proxyOptions = url.parse(config.apiProxies[env]);
    proxyOptions.route = '/apiProxy';

    createTask(env, proxyOptions);
}

createTask('none');
