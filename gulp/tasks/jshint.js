var gulp = require('gulp');
var config = require('../config').jshint;

require('pui/src/gulp/tasks/jshint')(gulp, config.files);
