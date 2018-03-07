var can = require('can');
var setPageTitle = require('seo-ui/utils/setPageTitle');
var envVars = require('seo-ui/utils/environmentVars');

require('can/view/stache/stache');
require('can/route/pushstate/pushstate');

require('seo-ui/pages/generate-page/generate-page.js');
require('seo-ui/pages/home/home.js');
require('seo-ui/pages/review-page/review-page.js');
require('seo-ui/pages/url-list/url-list.js');
require('seo-ui/pages/edit-metadata-list/edit-metadata-list.js');

var routes = require('./route-list.json');

module.exports = function (appState, content) {
    window.appState = appState;
    // This @ROUTE_ROOT is replaced by the build to whatever is on config.js file
    can.route.bindings.pushstate.root = envVars.rootApp() + '/';
    can.each(routes, function (data, path) {
        can.route(path, data.params);
    });

    can.route.bind('route', function (ev, newRoute, oldRoute) {
        var alert = appState.attr('alert');
        var data = routes[newRoute || ''];
        var oldData = routes[oldRoute];

        if (newRoute !== undefined && data && (!oldData || (oldData.template !== data.template))) {
            
            // Allow an alert to persist through a route change (but only once)
            // Useful for sub-page navigation where the sub-page displays an alert before returning to their parent.
            if (alert) {
                if (alert.persist) {
                    alert.persist = false;
                } else {
                    appState.attr('alert', false);
                }
            }

            content.html(can.stache(data.template)(appState));

            if (data.title) {
                setPageTitle(data.title, appState);
            }
        }
    });

    can.route.ready();
};
