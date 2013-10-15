/*!
 * grunt-reverse
 * http://github.com/upstage/grunt-reverse
 *
 * Copyright 2013 Sellside, Inc.
 * Licensed under the MIT License
 * http://opensource.org/licenses/MIT
 */

'use strict';

// Node.js
var path = require('path');
var fs   = require('fs');


// node_modules
var cheerio = require('cheerio')
var _       = require('grunt').util._;


// Local utils
var Utils = require('./lib/utils.js');


module.exports = function (grunt) {


  grunt.registerMultiTask('reverse', 'Deconstruct your HTML into components.', function () {

    var cb = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      tags: []
    });

    var files = this.files;

    if (!files.length) {
      grunt.log.writeln('No existing files in this target.');
      return cb();
    }

    var data = [];

    grunt.util.async.forEachSeries(files, function(fp, callback) {
      var dest = fp.dest;
      var src = fp.dest;

      // Concat banner + specified files + footer.
      fp.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(file) {


        var $ = cheerio.load(grunt.file.read(file));

        var filename = path.basename(file);
        var basename = path.basename(file, path.extname(file));
        var dirname  = path.dirname(file);


        /**
         * Components
         */
        if(!options.elements) {
          var components = [];
          var parent = '.' + (options.parent || 'bs-example');

          $(parent).each(function (i, elem, cb) {
            components[i] = $(this).html();

            var num = 0;
            var totalComponents = components.length;
            if (num < totalComponents) {

              // Search for the first class name of each component
              var name = $(components[i]).filter(function (i, el) {
                return $(this).attr('class') !== undefined;
              }).attr('class');

              // Slugify, then remove duplicate name segments.
              // "nav-nav-tabs" => "nav-tabs"
              var slug = ((_.slugify(name) + i) || (parent + i) || 'element');
              slug = _.unique(slug.split('-')).join('-');

              // Prettify HTML and add a separator between any sibling components.
              var result = Utils.format(components[i], Utils.sep(slug));

              // Write the component to disk.
              grunt.file.write(path.join(dest, basename, slug + '.' + options.ext), result);
            } else {
              if (cb) {
                cb(null, true);
              }
              return true;
            }
          });
          grunt.log.ok('Components generated in'.yellow, path.join(dest, basename));
        }


        // Attempt to extract reasonable file names.
        var name;
        if(basename === 'index') {
          name = path.basename(dirname);
        } else {
          name = basename;
        }


        // var destpath = path.join(dest, basename, name + '.html');

        // grunt.file.write(destpath, Utils.format($(this).html(), Utils.sep(name)));
        _(options.tags).map(function(tag) {
          $(tag).each(function(i, element) {

            var title = $(this).text();

            // Extract components from DOM
            var metadata = {
              filename: name,
              src: file,
              dest: dest,
              title: Utils.stripWhitespace(title)
            };

            // Push meta-data into repos array
            data.push(metadata);
            grunt.file.write(path.join(path.dirname(files.dest), options.tags + '.json'), JSON.stringify(data, null, 2));
          });
        });
        console.log(data)

      });
    }, function (err) {
      callback(!err);
    });
  });
};
