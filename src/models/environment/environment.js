var can = require('can');
require('can/map/define/');

/**
 * @module {function} models/environment data
 * @parent models
 *
 * Provides information about a environment and their access rights
 *
 */
module.exports = can.Map.extend({

    define: {
        features: {
            Type: can.Map
        }
    },

    init: function (seo) {
        can.extend(this, seo);
    },

    env: function () {
        return this.environment;
    }
});
