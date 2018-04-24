var gulp = require('gulp');
var testee = require('testee');
var buildTests = require('../build-tests.js');
var runSequence = require('run-sequence');
var phantom = 'phantom';
var chrome = 'chrome';
var config = require('../config').testee;

// --> BEGIN: This is currently not being used. Once the issues with hanging tests are resolved
// then the dynamic test building can be restored
var buildFiles = [
    {
        files: ['test/utils/**/*.test.js', 'test/models/**/*.test.js', 'test/components/**/*.test.js', 'test/pages/**/*.test.js'],
        output: 'test/tests.js'
    }
];

// DYNAMIC BUILDERS

gulp.task('build-tests', function () {
    // Get a collection of all the test files
    // For each collection, call ten tests at a time

    return buildFiles.map(function (fileConfig) {
        buildTests({
            files: fileConfig.files,
            output: fileConfig.output
        });
    });
});

// END <--

// DEFAULT TASK

gulp.task('test', ['test:local']);

// LOCAL

gulp.task('local-test', function () {
    return testee.test(config.other.files, phantom, {
        reporter: 'Spec'
    });
});

// WEB

gulp.task('web-test', function () {
    return testee.test(config.other.files, chrome, {});
});

// SEQUENCED TESTS - When dynamic tests are restored, just add the 'build-tests' task after 'xo'

gulp.task('test:local', function (cb) {
    runSequence('xo', 'build-tests', 'local-test', cb);
});

gulp.task('test:web', function (cb) {
    runSequence('xo', 'build-tests', 'web-test', cb);
});

gulp.task('test:coverage', ['xo', 'build-tests'], function () {
    return testee.test(config.other.files, phantom, {
        reporter: 'Spec',
        coverage: {
            dir: 'docs/coverage',
            reporters: ['text', 'html'],
            ignore: ['node_modules/*', 'test/*', 'gulp/*', 'fixture.js']
        }
    });
});
