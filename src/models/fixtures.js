require('can/util/fixture/fixture');

// Model Fixtures
require('seo-ui/url/url.fixture.js');


/* eslint global-require: 0 */

var can = require('can');
require('can/util/fixture/');

module.exports = function loadFixtures(isDeployed, fixturesOn, cb) {
    var queryParams = can.deparam(window.location.search.slice(1));
    var fixturePath = queryParams['fixtures.mock'] === 'bad' ? 'seo-ui/models/bad.fixtures' : 'seo-ui/models/good.fixtures';

    can.fixture.on = fixturesOn;
    can.fixture.delay = 500;

    System.import(fixturePath).then(function () {
        cb(isDeployed, fixturesOn);
    });
};
