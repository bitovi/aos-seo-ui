var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

require('can/map/define/');

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

    create: function (entity) {
        var url = envVars.apiUrl() + '/notifications/create.json';

        return can.ajax({
            url: url,
            method: 'post',
            data: JSON.stringify(entity),
            contentType: 'application/json'
        });
    },

    findOne: function (req) {
        var url = envVars.apiUrl() + '/notifications/' + req.id + '.json';

        return can.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            contentType: 'application/json'
        });
    }
});
