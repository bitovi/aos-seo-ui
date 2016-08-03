require('can/util/fixture/fixture');
require('can/view/stache/stache');
require('../list-page');
require('./demo.less!');

var $ = require('jquery');
var can = require('can');
var items = {
    count: 5,
    hasMoreRecords: false,
    data: [
        {
            lastEdited: '2014-06-05T12:00:00-07:00',
            lastEditor: 'John Doe III',
            name: 'some.text.asset.key'
        },
        {
            lastEdited: '1979-11-06T03:53:00-08:00',
            lastEditor: 'Me',
            name: 'another.text.asset.key'
        },
        {
            lastEdited: '2000-01-01T01:32:00-08:00',
            lastEditor: 'You',
            name: 'bento.vday2014.ipad.family.l.20140127.p'
        },
        {
            lastEdited: '2012-06-08T00:00:00-07:00',
            lastEditor: 'myoung',
            name: 'account.login.message.barclay_checkout_info'
        },
        {
            lastEditor: '',
            lastEdited: '2013-03-18T00:00:00-07:00',
            name: 'app.bts2013.landing_page.cta'
        }
    ]
};
var Model = can.Model.extend({
    findAll: '/items'
});
var rowTemplate = require('./row.stache!');
var template = require('./demo.stache!');
var ViewModel = require('seo-ui/components/list-page/list-page.viewmodel');


can.fixture('GET /items', function () {
    return items;
});

var map = new ViewModel({
    model: Model,
    title: 'Items',
    rowTemplate: rowTemplate,
    dataOptions: [
        {
            key: 'name',
            label: 'Item Name'
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
            label: 'Item Name',
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
