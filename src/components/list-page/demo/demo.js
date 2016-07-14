var $ = require('jquery');
var can = require('can');

var Model = require('models/url/url.js');
var rowTemplate = require('./row.stache');
var template = require('./demo.stache');
var ViewModel = require('components/list-page/list-page.viewmodel.js');

require('can/view/stache/stache');
require('models/url/url.fixture.js');

var map = new ViewModel({
    model: Model,
    title: 'Items',
    rowTemplate: rowTemplate,
    dataOptions: [
        {
            key: 'name',
            label: 'Node Name'
        },
        {
            key: 'lastEditor',
            label: 'Last Edited By'
        },
        {
            key: 'lastEdited',
            label: 'Last Edited Date'
        }
    ],
    columns: [
        {
            key: 'name',
            label: 'Node Name',
            cssClass: 'col-md-6'
        },
        {
            key: 'lastEditor',
            label: 'Last Edited By',
            cssClass: 'col-md-3'
        },
        {
            key: 'lastEdited',
            label: 'Last Edited Date',
            cssClass: 'col-md-3'
        }
    ],
    searchField: 'name'
});

$('#demo').append(template(map));
