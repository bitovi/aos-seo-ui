require('can/util/fixture/fixture');

var can = require('can');
var envVars = require('seo-ui/utils/environmentVars');
var createRequestResponse = require('./create-request.json');
var notificationDetails = require('./notification-details.json');
var requestList = require('./request-list.json').data;

can.fixture('GET ' + envVars.apiUrl() + '/request-list.json', function (request, response) {
    var data = request.data;

    var results = requestList;
    var searchField;
    var sort = data.sort;
    var sortArray;
    var sortField;
    var sortOrder;

    if (data.radarNumber) {
        searchField = 'radarNumber';
    } else if (data.radarTitle) {
        searchField = 'radarTitle';
    } else if (data.radarDescription) {
        searchField = 'radarDescription';
    } else if (data.state) {
        searchField = 'state';
    } else if (data.subState) {
        searchField = 'subState';
    } else if (data.createUser) {
        searchField = 'createUser';
    } else {
        searchField = '';
    }

    // Search
    if (searchField) {
        results = requestList.filter(function (item) {
            if (item[searchField] && data[searchField]) {
                return item[searchField].toLowerCase().indexOf(data[searchField].toLowerCase()) !== -1;
            }
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
    
	return results;
});

can.fixture('POST ' + envVars.apiUrl() + '/notifications/create.json', function (req, res) {
    var notification = req.data;

    if (!notification) {
        res(404, 'Not able to create request');
    }
    return createRequestResponse;
});

can.fixture('GET ' + envVars.apiUrl() + '/notifications/{id}.json', function (req, res) {
    return notificationDetails;
});