var stache = require('can-stache');
var formatDate = require('@apple/pui/dist/cjs/utils/formatDate');

// Register helper to show tags as delimited string
stache.registerHelper('showTagAsString', function (options) {
    return options.scope.attr('tags').join(',');
});

// Register helper to return dateFormat
stache.registerHelper('dateFormat', function (value) {
    return formatDate(value());
});
