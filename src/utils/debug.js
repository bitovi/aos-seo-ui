/**
 * @module {function} utils/debug Debug
 * @parent utils
 *
 * Enables debugging utilities for seo
 *
 * @body
 *
 * ## Use
 *
 * ### Fixtures
 *
 * Turns fixtures off if `'debug.fixtures=false'` or `'debug.fixtures=0'` is in the querystring of the current URL.
 *
 * Simply including this file will add this functionality. There is no method to call to enable this behavior.
 */
var can = require('can');
require('can/util/fixture/fixture');

var isDeployed = ('@{IS_DEPLOYED_BUILD}' === 'true');

//FIXTURES
//Default on for non-deployed, off for deployed
can.fixture.on = !isDeployed;
// Override with the query string
var queryParams = can.deparam(window.location.search.slice(1));
if(queryParams['debug.fixtures'] === 'false' || queryParams['debug.fixtures'] === '0') {
    can.fixture.on = false;
} else if(queryParams['debug.fixtures'] === 'true') {
    can.fixture.on = true;
}
