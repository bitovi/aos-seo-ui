require('can/util/fixture/fixture');
require('can/view/stache/stache');
require('../export-urls');
require('./demo.less!');

var $ = require('jquery');
var can = require('can');

var template = require('./demo.stache!');
var ViewModel = require('seo-ui/components/export-urls/export-urls.viewmodel');

$('#demo').append(template({count : "660"}));
