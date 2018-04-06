var assign = require('can-util/js/assign/assign');
var CanMap = require('can-map');
require('can-map-define');

/**
 * @module {function} models/environment data
 * @parent models
 *
 * Provides information about a environment and their access rights
 *
 */
module.exports = CanMap.extend({

    define: {
        features: {
            Type: CanMap
        }
    },

    init: function (seo) {
        assign(this, seo);
    },

    env: function () {
        return this.environment;
    }
});
