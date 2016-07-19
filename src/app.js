/* jshint camelcase: false */

var can = require('can');
var User = require('models/user/user.js');
var ServerVars = require('models/server-vars/server-vars.js');
var $ = can.$;

require('components/header/header.js');

var AppState = require('models/appstate/appstate.js');
var indexView = require('./index.stache');
var setupRoutes = require('./routes.js');
var csrfPrefilter = require('./utils/csrfPrefilter.js');
require('utils/viewHelpers.js');

$(function () {
  var user, appState, serverVars, fixturesOn;
  var isDeployed = ('{@IS_DEPLOYED_BUILD}' === 'true');
  window.seo.user.roles = window.seo.roles;
  user = new User(window.seo.user);
  can.fixture.on = !isDeployed;
  if (!isDeployed) {
    fixturesOn = sessionStorage.getItem('seoFixtures') === 'true';
    can.fixture.on = fixturesOn;
  }
  serverVars = new ServerVars({
    user: new User(window.seo.user),
    fixtures: fixturesOn
  });
  appState = new AppState({
    user: user
  });
  if (!isDeployed) {
    window.seo.configure = serverVars;
  }
  // Adds additional data to all Ajax requests
  $.ajaxPrefilter(csrfPrefilter());
  can.route.map(appState);

  $('#app').html(indexView(appState));

  setupRoutes(appState, $('#content'));
});
