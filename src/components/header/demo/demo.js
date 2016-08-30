var $ = require('jquery');
var can = require('can');
require('can/view/stache/');
require('./demo.less');

var template = require('./demo.stache!');
var User =  require('seo-ui/models/user/user');

var user = new User({
  'firstName': 'seo',
  'lastName': 'user',
  'initials': 'SU'
});

require('../header');

$('#demo').append(template({
    user: user
}));
