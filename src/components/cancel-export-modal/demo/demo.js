require('can-fixture');
require('can-stache');
require('../cancel-export-modal');
require('./demo.less!');

var $ = require('jquery');
var template = require('./demo.stache!');

$('#demo').append(template());
