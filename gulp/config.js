var glob = require('glob');
var path = require('path');
var fs = require('fs');

var dest = './target';
var src = './src';

var config = {

    /**
     * @typedef {{}} platform/gulp/config/steal steal
     * Configuration for the [platform/gulp/tasks/steal steal] task.
     *
     * @parent platform/gulp/config
     * @option {{}} options steal [options](http://stealjs.com/docs/steal.html)
     */
    steal: {
        buildConfig: {
            config: "package.json!npm"
        },
        buildOptions: {
            bundleSteal: true,
            quiet: false,
            minify: false,
            removeDevelopmentCode: true
        }
    },

    /**
     * @typedef {{}} platform/gulp/config/less less
     * Configuration for the [platform/gulp/tasks/less less] task.
     *
     * @parent platform/gulp/config
     * @option {{}} app less configuration for the application LESS
     *   @option {String} src glob of LESS files that make up the main application
     *   @option {Array.<String>} dest file paths where the main application bundle is placed
     * @option {{}} demo less configuration for the demo LESS files
     *   @option {String} demoSrc glob of LESS files that make up the demos
     *   @option {Array.<String>} demoDest file paths where the mdemo bundles are placed
     * @option {Array.<String>} options for gulp-less
     * @option {{browsers: Array}} autoprefixer [browsers](https://github.com/postcss/autoprefixer#browsers) configuration for autoprefixer
     */
    less: {
        app: {
            src: src + '/app.less',
            watch: [src + '/app.less', src + '/**/!(demo).less'],
            dest: dest
        },
        demo: {
            src: src + '/**/demo.less',
            watch: [src + '/app.less', src + '/**/*.less'],
            dest: src
        },
        options: {
            compress: true
        },
        autoprefixer: {
            browsers: ['last 2 versions']
        }
    },

    /**
     * @typedef {{}} platform/gulp/config/browserSync browserSync
     * Configuration for the [platform/gulp/tasks/browserSync browserSync] task.
     *
     * @parent platform/gulp/config
     * @option {{}} options BrowserSync [options](http://www.browsersync.io/docs/options/)
     * @option {{}} apiProxies proxies for API calls with each key being an environment and each value being an endpoint
     */
    browserSync: {
        options: {
            files: [
                './src/**/*.{js,less,json,stache}'
            ],
            server: {
                baseDir: './',
                index: 'index.html'
            },
            open: false
        },
        /*
        When you run gulp watch add --apiProxy <key> to the command to select which proxy you want to use
        */
        apiProxies: {
			       // This is Seo 2.0
            'dev': 'http://nc1d-dc1-pubdev-1002.corp.apple.com:9510/seo',
            'qa': 'http://nc1d-dc1-pubqa-1003.corp.apple.com:9510/seo',

            // Commenting out these machines since we don't have any URLs shared
            // This is Seo 1.0
            // 'dev-1.0': 'http://md03d-pubsys-dev1-1015.aoslab.apple.com:5397/seo',
            // 'qa-1.0': 'http://nc1d-dc1-pubqa-1007.corp.apple.com:8510/seo',
            // // This is Seo 2.0 that requires authentication
            // 'auth-dev-2.0': 'https://storedev-pubsys.corp.apple.com/seo',
            // 'auth-qa-2.0': 'https://storeqa-pubsys.corp.apple.com/seo'
        }
    },

    /**
     * @typedef {{}} platform/gulp/config/testee testee
     * Configuration for testee
     *
     * @parent platform/gulp/config
     * @option {Array.<platform/gulp/config/copyObj>} testee
     */
    testee: {
        other: {
            files: ['test/test.html'],
            manual: {
                server: {
                    baseDir: './'
                },
                open: true,
                startPath: './test/test.html'
            }
        }
    },

    /**
     * @typedef {{}} platform/gulp/config/documentjs documentjs
     * Configuration for the [platform/gulp/tasks/docs docs] task.
     *
     * @parent platform/gulp/config
     * @option {Object} siteConfig DocumentJS [siteConfig](http://documentjs.com/docs/DocumentJS.siteConfig.html)
     * @option {Array.<String>} watchFiles files that will trigger the documentation to regenerate
     */
    documentjs: {
        siteConfig: {
            glob: {
                ignore: [
                    '{node_modules,target,test,coverage}/**/*',
                    'docs/{nemo-ui,theme}/*',
                    '**/{demo,fixture}/*',
                    '**/*.bundle.js'
                ]
            },
            dest: './docs/nemo-ui',
            parent: 'nemo-ui',
            templates: './docs/theme/templates',
            'static': './docs/theme/static'
        },
        watchFiles: [
            '.gulpfile.js',
            './readme.md',
            './src/**/*{js,md}',
            './docs/{guides,platform}/*{js,md}',
            './gulp/**/*.js'
        ]
    }
};

module.exports = config;
