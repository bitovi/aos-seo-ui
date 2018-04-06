var $ = require('jquery');
require('can-stache');
require('./demo.less');

var template = require('./demo.stache!');
var User = require('seo-ui/models/user/user');

var user = new User({
    firstName: 'seo',
    lastName: 'user',
    initials: 'SU'
});

require('../header');

$('#demo').append(template({
    user: user
}));
