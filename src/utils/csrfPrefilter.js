/**
 * @module {function} utils/csrfPrefilter csrfPrefilter
 * @parent utils
 *
 * Augments API requests by adding a jQuery AJAX Prefilter.
 * Adds a CSRF token to POST, PUT and DELETE requests.
 *
 * @body
 *
 * ## Use
 *
 * Pass the results of this function to $.ajaxPrefilter.
 */
var can = require('can');

module.exports = function() {
    return function (options, originalOptions, jqXhr) {
        var nemoObj = window.nemo,
            csrfHeader,
            csrfToken;

        // Cross-Site Request Forgery protection
        if (typeof nemoObj !== 'undefined' && typeof nemoObj.csrfHeader !== 'undefined' && typeof nemoObj.csrfToken !== 'undefined') {
            csrfHeader = nemoObj.csrfHeader;
            csrfToken = nemoObj.csrfToken;
        }

        if (options.type === 'post' || options.type === 'put' || options.type === 'delete') {
            // CSRF (not needed for GET requests)
            if (csrfHeader && csrfToken) {
                jqXhr.setRequestHeader(csrfHeader, csrfToken);
            }
        }
    };
};
