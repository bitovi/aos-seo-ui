var ajax = require('can-util/dom/ajax/ajax');
var Model = require('can-model');
require('can-map-define');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = Model.extend({
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
    create: function (entity) {
        var url = envVars.apiUrl() + '/notifications/create.json';
        return ajax({
            url: url,
            method: 'post',
            data: JSON.stringify(entity),
            contentType: 'application/json'
        });
    },
    findOne: function (req) {
        var url = envVars.apiUrl() + '/notifications/' + req.id + '.json';
        return ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            contentType: 'application/json'
        });
    }
});
