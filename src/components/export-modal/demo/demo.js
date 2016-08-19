require('can/util/fixture/fixture');
require('can/view/stache/stache');
require('../export-modal');
require('./demo.less!');

var $ = require('jquery');
var can = require('can');
var template = require('./demo.stache!');
var ViewModel = require('seo-ui/components/export-modal/export-modal.viewmodel');

$('#demo').append(template());
