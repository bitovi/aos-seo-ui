require('can-fixture');
require('can-stache');
require('../export-urls');
require('./demo.less!');

var $ = require('jquery');

var template = require('./demo.stache!');

$('#demo').append(template({count: '660'}));
