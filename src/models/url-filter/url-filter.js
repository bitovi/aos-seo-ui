require('can/map/define/define');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');

module.exports = can.Model.extend(
    {
        getFilters: function () {
            var url = envVars.apiUrl() + '/url-filters.json';

            return can.ajax({
                url: url,
                method: 'get',
                dataType: 'json',
                contentType: 'application/json'
            });
        }
    },
    {
        define: {
            parameter: {
                type: 'string'
            },
            options: {
                type: 'Array'
            }
        }
    }
);
