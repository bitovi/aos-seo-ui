var $ = require('jquery');
var can = require('can');
require('can/view/stache/');
require('./demo.less');

var template = require('./demo.stache!');

require('../status-badges');
var data = new can.Map({
    operation: 'Added'
});
$('#demo').append(template(data));
