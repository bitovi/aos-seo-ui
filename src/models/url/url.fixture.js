var _ = require('lodash');
var can = require('can');

require('can/util/fixture/fixture');

var urls = require('./urls.json').data;
var envVars = require('seo-ui/utils/environmentVars');

// Find All
can.fixture('GET' + envVars.apiUrl() + '/urls.json', function (request, response) {
    var data = request.data;
    var results = urls;
    var searchField;
    if (data.url) {
        searchField = 'url';
    } else if (data.pageTitle) {
        searchField = 'pageTitle';
    } else if (data.partNumber) {
        searchField = 'partNumber';
    } else {
        searchField = '';
    }
    var sort = data.sort;
    var sortArray;
    var sortField;
    var sortOrder;

    // Search
    if (searchField) {
        results = urls.filter(function (item) {
            return item[searchField].toLowerCase().indexOf(data[searchField].toLowerCase()) !== -1;
        });
    }

    // Sort
    if (sort) {
        sortArray = sort.split(' ');
        sortField = sortArray[0];
        sortOrder = sortArray[1];

        results = _.sortBy(results, sortField);

        if (sortOrder === 'desc') {
            results.reverse();
        }
    }

    response({
        count: results.length,
        data: results
    });
});

// Find One
can.fixture('GET' + envVars.apiUrl() + '/urls/{url}.json', function (request, response) {
    var urlIndex = _.findIndex(urls.data, {
        url: request.data.url
    });

    if (urlIndex !== -1) {
        response(urls.data[urlIndex]);
    } else {
        response(
            404,
            'error', {
                message: 'URL ' + request.data.url + ' not found.'
            }
        );
    }
});
