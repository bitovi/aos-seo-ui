var $ = require('jquery');
var Model = require('can-model');
var envVars = require('seo-ui/utils/environmentVars');

require('can-map-define');

module.exports = Model.extend({
    /**
     * @function generate-file-export-id.findOne
     * @description is used to get the exportId to get the progress of a download later.
     * @param {Object} the request query params.
     * @return {Object} Returns the export progress.
     */
    findOne: function () {
        var url = envVars.apiUrl() + '/generate-export-id.json';
        return $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json'
        });
    }
}, {});
