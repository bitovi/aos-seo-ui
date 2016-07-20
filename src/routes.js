var can = require('can');
var setPageTitle = require('seo-ui/utils/setPageTitle');

require('can/view/stache/stache');
require('can/route/pushstate/pushstate');

// Browserify can only use `require`s that can be statically analyzed meaning the module
// name must be a string. So we have to manually require the modules we will use in our
// routes: https://github.com/substack/node-browserify/issues/377
require('seo-ui/pages/home/home.js');
require('seo-ui/pages/url-list/url-list.js');

var routes = require('./route-list.json');

module.exports = function (appState, content) {
    window.appState = appState;
    // This @ROUTE_ROOT is replaced by the build to whatever is on config.js file
    can.route.bindings.pushstate.root = '{@ROUTE_ROOT}/';
    can.each(routes, function (data, path) {
        can.route(path, data.params);
    });

    can.route.bind('route', function (ev, newRoute, oldRoute) {
        var alertTimeout = 25000;
        var data = routes[newRoute || ''];
        var oldData = routes[oldRoute];

        if (newRoute !== undefined && data && (!oldData || (oldData.template !== data.template))) {
            appState.attr('layoutState', data.layout);

            //Make sure we hide the error when we navigate
            setTimeout(function () {
                appState.attr('alert', false);
            }, alertTimeout);

            content.html(can.stache(data.template)(appState));

            if (data.title) {
                setPageTitle(data.title, appState);
            }
        }
    });

    can.route.ready();
};
