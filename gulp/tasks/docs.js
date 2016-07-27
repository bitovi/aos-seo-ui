/**
 * @page platform/gulp/tasks/docs docs
 * @parent platform/gulp/tasks
 * @group components 0 Components
 * Generates HTML documentation using [DocumentJS](http://documentjs.com).
 *
 * ### Customizing the Docs
 * To customize the look of the documentation edit the files in the `docs/theme` folder. For more detailed guide, refer to the [DocumentJS documentation](http://documentjs.com/docs/DocumentJS.guides.customizing.html).
 *
 * @signature `gulp docs`
 * Generates the documentation.
 *
 * @signature `gulp docs:serve`
 * Generates the documentation and serves it locally at `http://localhost:8080`. It also regenerates the documentation when source files change.
 *
*/

var gulp = require('gulp');
var glob = require('glob');
var del = require('del');
// DocJS does not export configured
// Issue: https://github.com/bitovi/documentjs/pull/71
var documentjs = require('documentjs/lib/configured/configured');
var connect = require('gulp-connect');
var config = require('../config').documentjs;

gulp.task('docs', ['clean:docs'], function(callback){
    return documentjs.generateProject({
        docConfig: {
            sites: {
                docs: config.siteConfig
            }
        },
        path: process.cwd()
    }, undefined, {
        // debug: true
    });
});

gulp.task('docs:serve', ['docs'], function(){
    gulp.watch(config.watchFiles, ['docs']);

    connect.server({
        root: 'docs/nemo-ui'
    });
});
