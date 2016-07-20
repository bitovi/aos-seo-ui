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

module.exports = function() {
    return function (options, originalOptions, jqXhr) {
        var seoObj = window.seo,
            csrfHeader,
            csrfToken;

        // Cross-Site Request Forgery protection
        if (typeof seoObj !== 'undefined' && typeof seoObj.csrfHeader !== 'undefined' && typeof seoObj.csrfToken !== 'undefined') {
            csrfHeader = seoObj.csrfHeader;
            csrfToken = seoObj.csrfToken;
        }

        if (options.type === 'post' || options.type === 'put' || options.type === 'delete') {
            // CSRF (not needed for GET requests)
            if (csrfHeader && csrfToken) {
                jqXhr.setRequestHeader(csrfHeader, csrfToken);
            }
        }
    };
};
