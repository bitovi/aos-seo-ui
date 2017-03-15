require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Model.extend({
    reviewFileFromInput: function (params) {
        var url = environmentVars.apiUrl() + '/process-for-textarea-input.json';

        return can.ajax({
            contentType: false,
            data: params,
            method: 'post',
            dataType: 'json',
            processData: false,
            url: url
        });
    }
}, {});
