/*!
 * grunt-reverse
 * http://github.com/upstage/grunt-reverse
 *
 * Copyright 2013 Sellside, Inc.
 * Licensed under the MIT License
 * http://opensource.org/licenses/MIT
 */

// Node.js
var path = require('path');
var fs = require('fs');

// node_modules
var cheerio = require('cheerio')
var _ = require('grunt').util._;

// Local utils
var Utils = require('./lib/utils');

module.exports = function (grunt) {
  'use strict';

  var config = grunt.file.readJSON('package.json') || {};

  grunt.registerMultiTask('reverse', 'Deconstruct your HTML into components.', function () {
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({});

    this.files.forEach(function(fp) {
      fp.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(src) {
        var base = path.basename(src, path.extname(src));
 
         // Load the HTML
        var $ = cheerio.load(grunt.file.read(src));

        // Extract elements from DOM
        _(options.tags).map(function(tagname) {
          var content = Utils.sep(tagname) + $(tagname).map(function(i, el) {
            return $(this).html();
          }).join(Utils.sep(tagname));
          grunt.file.write(path.join(fp.dest, base + '-' + tagname + '.html'), Utils.format(content, ''));
        });

        // Extract components from DOM
        _(options.components).map(function(componentname) {
          var content = Utils.sep(componentname) + $(options.parent + ' .' + componentname).map(function(i, el) {
            return $(this).parent().html();
          }).join(Utils.sep(componentname));
          grunt.file.write(path.join(fp.dest, base, componentname + '.html'), Utils.format(content, ''));
        });

      });
    });
  });
};