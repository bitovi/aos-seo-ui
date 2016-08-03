/* jshint camelcase: false */

var can = require('can');
var ServerVars = require('seo-ui/models/server-vars/');
var User = require('seo-ui/models/user/');
var $ = can.$;
require('seo-ui/app.less');

require('seo-ui/components/header/');

var AppState = require('seo-ui/models/appstate/');
var indexView = require('seo-ui/index.stache!');
var setupRoutes = require('seo-ui/routes');
var csrfPrefilter = require('seo-ui/utils/csrfPrefilter');
var Environment = require('seo-ui/models/environment/');
var envVars = require('seo-ui/utils/environmentVars');
var logger = require('seo-ui/utils/log');
var localDebug = require('seo-ui/utils/local-debug');
var fixtureLoader = require('seo-ui/models/fixtures');

require('seo-ui/utils/viewHelpers');

if (envVars.isDeployedBuild() === 'false') {
    window._environment = {
        'environment': 'Local Gulp'
    };
    window.seo = {
        'debug': true,
        'user': {
            'firstName': 'seo',
            'lastName': 'user',
            'email': 'seo_user@apple.com',
            'initials': 'SU'
        },
        'roles': ['ROLE_USER', 'ROLE_ADMIN'],
        'csrfToken': 'n3m0-r0ck5',
        'csrfHeader': 'X-AOS-CSRF',
        'csrfParameter': '_aos_csrf'
    };
}
/**
 * @description Initalizes the application.
 * @param isDeployed
 * @param fixturesOn
 */
function initApp(isDeployed, fixturesOn) {
    var user, serverVars, appState, environment;

    window.seo = new can.Map(window.seo);
    window._environment = new can.Map(window._environment);

    environment = new Environment(window._environment);
    window.seo.user.roles = window.seo.roles;
    user = new User(window.seo.user);

    serverVars = new ServerVars({
        user: user,
        fixtures: fixturesOn,
        environment: environment
    });
    appState = new AppState({
        user: user,
        environment: environment
    });

    if (!isDeployed) {
        window.seo.configure = serverVars;
    }

    logger.init(appState);
    localDebug(environment, serverVars);

    // Adds additional data to all Ajax requests
    $.ajaxPrefilter(csrfPrefilter());
    can.route.map(appState);

    $('#app').html(indexView(appState));

    setupRoutes(appState, $('#content'));
}

$(function () {
    var envVars = require('seo-ui/utils/environmentVars');
    var isDeployed = (envVars.isDeployedBuild() === 'true');
    window.seo.user.roles = window.seo.roles;
    if (!isDeployed) {
        System.import('seo-ui/models/fixtures').then(function () {
            var fixturesOn = sessionStorage.getItem('seoFixtures') === 'true';
            fixtureLoader(isDeployed, fixturesOn, initApp);
        });
    } else {
        initApp(isDeployed, false);
    }
});
