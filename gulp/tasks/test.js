/**
 * @page platform/gulp/tasks/test test
 * @parent platform/gulp/tasks
 *
 * Uses the [Karma](http://karma-runner.github.io/0.12/index.html) test runner to run this project's tests.
 *
 * ### Frameworks
 * This test setup use the karma-bro, jasmine-jquery and jasmine frameworks
 *
 * @signature `gulp test`
 * Runs all tests using PhantomJS
 *
 * @signature `gulp test:manual`
 * Starts a Karma server at `localhost:9876` that you can visit with any browser to make the tests run. To debug tests go to `localhost:9876/debug.html` where the normal Jasmine UI will be displayed.
 *
 * @signature `gulp test:coverage`
 * Runs tests in PhantomJS and generates a coverage report.
 *
 * @signature `gulp test:full`
 * Runs tests in the locally installed versions of Chrome, Firefox and Safari.
*/

var gulp = require('gulp');
var path = require('path');
var karma = require('karma').server;
var xtend = require('xtend');
var config = require('../config.js').karma;


// Quick tests via PhantomJS
gulp.task('test', ['jshint', 'less:app', 'bootstrapify'], function(done) {
    var options = xtend(config.options, {
        browsers: ['PhantomJS'],
        reporters: ['mocha', 'bamboo'],
        singleRun: true
    });

    karma.start(options, function(){ done() });
});

gulp.task('test:manual', ['jshint', 'less:app', 'bootstrapify'], function(done) {
    var options = xtend(config.options, {
        browsers: [],
        autoWatch: true
    });

    karma.start(options, function(){ done() });
});

gulp.task('test:coverage', ['jshint', 'less:app', 'bootstrapify'], function(done) {

    var options = xtend(config.options, {
        browsers: ['PhantomJS'],
        reporters: ['dots', 'coverage'],
        coverageReporter: config.coverage.coverageReporter,
        singleRun: true
    });

    options.browserify.transform.push('browserify-istanbul');

    karma.start(options, function(){ done() });
});

gulp.task('test:full', ['jshint', 'less:app', 'bootstrapify'], function(done) {

    var options = xtend(config.options, {
        browsers: ['Chrome', 'Safari', 'Firefox'],
        reporters: ['dots'],
        singleRun: true
    });

    karma.start(options, function(){ done() });
});
