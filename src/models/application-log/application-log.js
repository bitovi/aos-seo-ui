var ajax = require('can-util/dom/ajax/ajax');
var Model = require('can-model');
var envVars = require('seo-ui/utils/environmentVars');
require('can-map-define');

module.exports = Model.extend({
    create: function (params) {
        var url = envVars.apiUrl() + '/log.json';

        return ajax({
            url: url,
            data: JSON.stringify(params),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json'
        });
    }
}, {});
