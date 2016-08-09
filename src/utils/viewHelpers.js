var can = require('can');
var formatDate = require('pui/utils/formatDate');

// Register helper to show tags as delimited string
can.stache.registerHelper('showTagAsString', function(options) {
    return options.scope.attr('tags').join(',');
});

// Register helper to return dateFormat
can.stache.registerHelper('dateFormat', function (value) {
    return formatDate(value());
});
