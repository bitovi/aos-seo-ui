var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
require('can/map/define/');

module.exports = can.Model.extend({
    create: function (params) {
        var url = envVars.apiUrl() + '/log.json';

        return can.ajax({
            url: url,
            data: JSON.stringify(params),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json'
        });
    }
}, {});
