/**
 * @module {Function} utils.setPageTitle setPageTitle
 * @parent utils
 *
 * @description Sets the title descriptor of the page based on the route and descriptor provided.
 *
 * @signature 'utils.setPageTitle()'
 * @param {string} appState used to get values of the route being loaded
 * @param {string} titleTemplate title micro template for the route being loaded
 *
 * @body
 * ## Use
 *
 * ```js
 * var setPageTitle = require('utils/setPageTitle.js');
 * setPageTitle(newRoute, titleTemplate);
 *
 * ```
 */

var can = require('can');

module.exports = function setPageTitle(titleTemplate, appState) {
    var keyExpression = /:([a-zA-Z]*)/gi;
    var match;
    var newRoute = appState.attr('route');
    var parsedTitle = '';
    var pathElementValue = {};

    if (newRoute.indexOf(':') > -1) {
        match = keyExpression.exec(newRoute);

        while (match !== null) {
            pathElementValue[match[1]] = appState.attr(match[1]);
        }

        parsedTitle = can.sub(titleTemplate, pathElementValue);
    }

    document.title = (parsedTitle || titleTemplate) + ' | SEO Manager';
};
