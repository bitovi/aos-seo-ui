/* jshint camelcase: false */

var can = require('can');
var ServerVars = require('seo-ui/models/server-vars/');
var User = require('seo-ui/models/user/');
var $ = can.$;

require('seo-ui/components/header/');

var AppState = require('seo-ui/models/appstate/');
var indexView = require('seo-ui/index.stache!');
var setupRoutes = require('seo-ui/routes.js');
var csrfPrefilter = require('seo-ui/utils/csrfPrefilter');
var envVars = require('seo-ui/utils/environmentVars');
require('seo-ui/utils/viewHelpers');

$(function () {
  var user, appState, serverVars, fixturesOn;
  var isDeployed = (envVars.isDeployedBuild() === 'true');
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
