var glob = require('glob');
var path = require('path');
var fs = require('fs');
var replacifyTransforms = require('./util/replacify.js');
var compilifyTransform = require('./util/can-compilify.js');

var dest = './target';
var src = './src';
var test = './test';

var demoScripts = glob.sync('./src/**/demo.js');
var pkg = require('../package.json');

/**
 * @typedef {{}} platform/gulp/config/bundleConfig bundleConfig
 * Bundle configuration for the [platform/gulp/tasks/browserify browserify] task.
 *
 * @parent platform/gulp/config
 * @option {String} entries The entry file for the bundle. This is where Browserify will start to build its dependency graph from.
 * @option {String} dest destination file path of the bundle
 * @option {String} outputName file name of the bundle
 */

/**
 * @typedef {{}} platform/gulp/config/appBundleConfig appBundleConfig
 * Collection of [platform/gulp/config/bundleConfig bundle configurations] the [platform/gulp/tasks/browserify:app browserify:app] task should use.
 */
var appBundleConfig = [{
  entries: './src/app.js',
  dest: dest,
  outputName: 'app.js'
}];

/**
 * @typedef {{}} platform/gulp/config/appBundleConfig appMinBundleConfig
 * Collection of [platform/gulp/config/bundleConfig bundle configurations] the [platform/gulp/tasks/browserify:app browserify:app] task should use.
 */
var appMinBundleConfig = [{
  entries: './src/app.js',
  dest: dest,
  outputName: 'app.min.js'
}];

/**
 * @typedef {{}} platform/gulp/config/demoBundleConfig demoBundleConfig
 * Collection of [platform/gulp/config/bundleConfig bundle configurations] the [platform/gulp/tasks/browserify:demos browserify:demos] task should use.
 */
var demoBundleConfig = [];
var demoCopyConfig = [];

demoScripts.forEach(function (file) {
  var dir = path.dirname(file);
  var componentName = dir.split('/')[3];
  var destination = dest + '/demos/' + componentName;

  demoBundleConfig.push({
    entries: file,
    dest: destination,
    outputName: 'demo.bundle.js'
  });

  demoCopyConfig.push({
    src: dir + '/**',
    dest: destination
  });
});

demoCopyConfig.push({
  src: './src/components/base/demos/**',
  dest: dest + '/demos/base'
});

var config = {
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
        './target/**/*.*'
      ],
      server: {
        baseDir: './target',
        index: 'index.html'
      },
      open: false
    },
    /*
		When you run gulp watch add --apiProxy <key> to the command to select whiuch proxy you want to use
  --  Using the dummy machines for time being --
		*/
    apiProxies: {
      'dev': 'http://md03d-pubsys-cs-app-02.aoslab.apple.com:5387/seo',
      'qa': 'http://nc1d-p11-app-1001.corp.apple.com:5387/seo',
      'uat': 'http://md03d-pubsys-cs-app-07.aoslab.apple.com:5387/seo',
      'auth-dev': 'https://storedev-pubsys.corp.apple.com/seo',
      'auth-qa': 'https://storeqa-pubsys.corp.apple.com/seo',
      'auth-uat': 'https://storeuat-pubsys.corp.apple.com/seo'
    }
  },

  /**
   * @typedef {{}} platform/gulp/config/jshint jshint
   * Configuration for the [platform/gulp/tasks/jshint jshint] task.
   *
   * @parent platform/gulp/config
   * @option {String} files glob of files to run jshint on
   */
  jshint: {
    files: [
      src + '/{components,utils,models,pages}/**/!(demo)*!(.bundle).js',
      src + '/!(app.bundle).js',
      test + '/**/*.test.js'
    ]
  },

  /**
   * @typedef {{}} platform/gulp/config/browserify browserify
   * Configuration for the [platform/gulp/tasks/browserify browserify] task
   *
   * @parent platform/gulp/config
   * @option {Boolean} debug whether to enable source maps
   * @option {Array.<platform/gulp/config/bundleConfig>} bundleConfigs bundles to create using browserify
   * @option {Array.<platform/gulp/config/remapify>} remapify directories to alias
   * @option {Array.<platform/gulp/config/replace>} replace strings within bundleed files
   */
  browserify: {
    appBundles: appBundleConfig,
    appMinBundles: appMinBundleConfig,
    demoBundles: demoBundleConfig,
    options: {
      debug: true
    }
  },

  /**
   * @typedef {{}} platform/gulp/config/karma karma
   * Configuration for the [platform/gulp/tasks/test test] task.
   *
   * @parent platform/gulp/config
   * @option {{}} coverage karma-coverage [configuration](https://github.com/karma-runner/karma-coverage#configuration)
   * @option {{}} options Karma [configuration](http://karma-runner.github.io/0.12/config/configuration-file.html)
   */
  karma: {
    coverage: {
      coverageReporter: {
        type: 'html',
        dir: './coverage/'
      }
    },
    options: {
      frameworks: ['browserify', 'jasmine-jquery', 'jasmine'],
      files: [
        'src/{pages,components}/*/*.{js,stache}',
        'test/**/*.{js,stache}',
        'target/app.css'
      ],
      preprocessors: {
        'src/{pages,components,models,utils}/*/*.{js,stache}': ['browserify'],
        'test/**/*.{js,stache}': ['browserify']
      },
      exclude: [
        '**/fixture*',
        'src/utils/debug.js'
      ],
      browserify: {
        debug: true,
        transform: ['aliasify', 'browserify-shim'].concat(replacifyTransforms),
        configure: function (bundle) {
          bundle.on('prebundle', function () {
            bundle.transform(compilifyTransform, {
              global: true
            });
          });
        }
      },
      reporters: ['dots', 'html'],
      browserNoActivityTimeout: 9999999
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
        pattern: "**/*.{less,css,md,js}",
        ignore: [
          '{node_modules,target,test,coverage}/**/*',
          'docs/{seo-ui,theme}/*',
          '**/{demo,fixture}/*',
          '**/*.bundle.js'
        ]
      },
      dest: './docs/seo-ui',
      parent: 'seo-ui',
      templates: './docs/theme/templates'
    },
    watchFiles: [
      '.gulpfile.js',
      './readme.md',
      './src/**/*{js,md,less}',
      './docs/{guides,platform,api,styles}/*{js,md}',
      './gulp/**/*.js'
    ]
  },

  /**
   * @typedef {{}} platform/gulp/config/copy copy
   * Copy configuration for the [platform/gulp/tasks/copy copy] task
   *
   * @parent platform/gulp/config
   * @option {Array.<platform/gulp/config/copyObj>} copy files
   */
  copy: {
    app: [
      /**
       * @typedef {{}} platform/gulp/config/copyObj copyObj
       * Copy configurations for the [platform/gulp/tasks/copy copy] task.
       *
       * @parent platform/gulp/config
       * @option {Array.<String>} src files to copy
       * @option {String} dest file destination
       * @option {Object} replace
       *   @option {String} search string to search for
       *   @option {String} replace string to replace matches with
       *   @option {String} outputName name of new file (optional)
       */
      {
        src: [src + '/index.html'],
        dest: dest,
        replace: [{
          search: '{@ASSET_PATH}',
          replace: '/'
        }]
      }, {
        src: [src + '/index.production.html'],
        dest: dest,
        replace: [{
          search: '{@BUILD_NUMBER}',
          replace: new Date().getTime()
        }]
      }, {
        src: [src + '/route-list.json'],
        dest: dest
      }, {
        src: [src + '/bootstrap-theme.html'],
        dest: dest
      },
    ],
    demos: demoCopyConfig
  }
};

module.exports = config;
