require('can/util/fixture/fixture');
require('can/view/stache/stache');
require('../cancel-export-modal');
require('./demo.less!');

var $ = require('jquery');
var can = require('can');
var template = require('./demo.stache!');
var ViewModel = require('seo-ui/components/cancel-export-modal/cancel-export-modal.viewmodel');

$('#demo').append(template());
