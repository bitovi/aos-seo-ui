var can = require('can');
var User = require('models/user/user');
require('can/map/define/define');

var Layout = can.Map.extend({
    define: {
        hasMarketingContext: {
            type: 'boolean',
            value: false
        },
        hideFooter: {
            type: 'boolean',
            value: false
        },
        hideHeader: {
            type: 'boolean',
            value: false
        }
    }
});

var AppState = can.Map.extend({
    define: {
        page: {
            type: 'string'
        },
        layoutState: {
            // Since we already have our defaults defined,
            // our default 'value' can just be set to an empty
            // object. The `Type` will mean the default value of
            // layoutState is set to `new Layout({})`
            value: function(){return {};},
            // Any time the entire layoutState property is replaced,
            // the new object will be passed to the Layout constructor
            // which preserves defaults
            Type: Layout,
            serialize: false
        },
        error: {
            type: '*',
            serialize: false
        },
        isAlertVisible: {
            value: false,
            type: 'boolean',
            serialize: false
        },
        alert: {
            type: '*',
            set: function (newVal) {
                this.attr('isAlertVisible', !!newVal);
                return newVal;
            },
            serialize: false
        },
        user: {
            Type: User,
            serialize: false
        },
        
        /**
         * Storage is used to maintain data between page transitions. If a page must pass data
         * to another page, it can be set in `appState.storage`. Remember to always remove the
         * temporary data on data retrieval.
         */
        storage: {
            value: function(){return {};},
            serialize: false
        }
    }
});

module.exports = AppState;
