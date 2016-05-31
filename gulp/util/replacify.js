/**
 * Returns an array of replacify transforms that are pre-configured.
 * This is done so the logic for the transforms can be in one place yet
 * used by browserify and karma-browserify.
*/
var replacify = require('pui/src/gulp/util/browserify-replace');

/**
 * @typedef {{}} platform/gulp/config/replace browserify replace
 * Replace configurations for the [platform/gulp/tasks/browserify Browserify] task.
 *
 * @option {String} search string to search for
 * @option {Function} replace returns a string to replace matches with
 * @option {RegExp} filter file filter
 */
var browserifyReplace = [
    {
        search: '{@API_URL}',
        replace: function() {
			//  The replacement is the same for Prod, substitution is done server side
            return (process.env.NODE_ENV !== 'production') ? '/apiProxy' : '{@API_URL}';
        },
        filter: /src\/.*.js$/
    },
    {
        search: '{@ROUTE_ROOT}',
        replace: function() {
			//  The replacement is the same for Prod, substitution is done server side
            return (process.env.NODE_ENV !== 'production') ? '' : '{@ROUTE_ROOT}';
        },
        filter: /src\/.*.js$/
    },
    {
        search: '@{IS_DEPLOYED_BUILD}',
        replace: function(){
            return (process.env.NODE_ENV === 'production') ? 'true' : 'false';
        },
        filter: /src\/.*.js$/
    }
];

var transforms = browserifyReplace.map(function(r){
    var config = {
        search: r.search,
        replace: r.replace
    };
    if(typeof r.filter !== 'undefined') {
        config.filter = r.filter;
    }
    return replacify.configure(config);
});

module.exports = transforms;
