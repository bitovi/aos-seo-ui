var can = require('can'),
    formatDate = require('pui/utils/formatDate');

// Register helper to calculate colspan for expanded detail stache
can.stache.registerHelper('calculateColspan', function (options) {
    // plus 1 takes into account the arrow column
    return options.scope.attr('columns').length + 1;
});

// Register helper to show tags as delimited string
can.stache.registerHelper('showTagAsString', function(options) {
    return options.scope.attr('tags').join(',');
});

// Register helper to return dateFormat
can.stache.registerHelper('dateFormat', function (value) {
    return formatDate(value());
});
