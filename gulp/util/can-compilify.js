/**
 * Returns a can-compilify transform that is pre-configured.
 * This is done so the logic for the transform can be in one place yet
 * used by browserify and karma-browserify.
*/
var compilify = require('can-compilify');
var path = require('path');

var normalizePath = function(filePath) {
    return path.resolve(process.cwd(), path.normalize(filePath));
};

var options = {
    version: '2.2.6',
    paths: {
        jquery: normalizePath('./node_modules/jquery/dist/jquery.js'),
        can: normalizePath('./node_modules/can/dist/can.jquery.js'),
        ejs: normalizePath('./node_modules/can/dist/can.ejs.js'),
        stache: normalizePath('./node_modules/can/dist/can.stache.js')
    }
}

module.exports = compilify.configure(options);
