var deparam = require('can-util/js/deparam/deparam');
var fixture = require('can-fixture');
/* eslint global-require: 0 */

require('can-fixture');

module.exports = function loadFixtures(isDeployed, fixturesOn, cb) {
    var queryParams = deparam(window.location.search.slice(1));
    var fixturePath = queryParams['fixtures.mock'] === 'bad' ? 'seo-ui/models/bad.fixtures' : 'seo-ui/models/good.fixtures';

    fixture.on = fixturesOn;
    fixture.delay = 500;

    System.import(fixturePath).then(function () {
        cb(isDeployed, fixturesOn);
    });
};
