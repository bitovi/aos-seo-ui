var can = require('can');
require('can/map/define/');
var $ = require('jquery');
var envVars = require('seo-ui/utils/environmentVars');


module.exports = can.Model.extend({
        define: {
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            dueDate: {
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


