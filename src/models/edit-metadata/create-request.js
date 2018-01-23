var can = require('can');
require('can/map/define/');
var $ = require('jquery');
var envVars = require('seo-ui/utils/environmentVars');
/*
var Contents = can.Map.extend({
    define: {
        displayName: {
            value: '',
            type: 'string',
            validate: {
                validateOnInit: false,
                required: {
                    message: '^Node title can\'t be blank'
                }
            }
        },

        navigationAttributes: {
            Type: can.Map.extend({
                define: {
                    isBlockedFromURL: {
                        type: 'boolean',
                        value: false
                    }
                }
            }),
            Value: Object
        }
    }
});*/

module.exports = can.Model.extend({
        define: {
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            priority: {
                type: 'string'
            }
        },
        create: function (entity, params) {
            var url = envVars.apiUrl()+'/notifications/create.json';
            return can.ajax({
                url: url,
                method: 'post',
                data: JSON.stringify(entity),
                contentType: 'application/json'
            });
        }
    }
);


