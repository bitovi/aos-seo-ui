var can = require('can'),
    $ = require('jquery');
var envVars = require('seo-ui/utils/environmentVars');

require('can/map/define/');

module.exports = can.Model.extend({
    /**
     * @function export-urls.findOne is used to get the progress of a download
     * @description is used to get the progress of a download.
     * @param {Object} the request query params.
     * @return {Object} Returns the export progress.
     */
    findOne: function (req) {
        var url = envVars.apiUrl() + '/export-urls.json';
        return $.ajax({
            url: url,
            data: req,
            method: 'POST',
            processData: false,
            contentType: 'application/json'
        });
    }
}, {});