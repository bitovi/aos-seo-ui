/* jshint camelcase: false */

var can = require('can');
var User = require('models/user/user');
var $ = can.$;

require('components/header/header.js');

var AppState = require('models/appstate/appstate.js');
var indexView = require('./index.stache');
var setupRoutes = require('./routes.js');
var csrfPrefilter = require('./utils/csrfPrefilter.js');
require('utils/viewHelpers.js');

$(function () {
    var userData = window.userData,
        appState = new AppState({
            user: new User(userData)
        });

    // Adds additional data to all Ajax requests
    $.ajaxPrefilter(csrfPrefilter());
    can.route.map(appState);

    $('#app').html(indexView(appState));

    setupRoutes(appState, $('#content'));
});
