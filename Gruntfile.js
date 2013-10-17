/*!
 * grunt-reverse
 * http://github.com/upstage/grunt-reverse
 *
 * Copyright 2013 Sellside, Inc.
 * Licensed under the MIT License
 * http://opensource.org/licenses/MIT
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {jshintrc: '.jshintrc'},
      all: {
        src: ['Gruntfile.js', 'tasks/**/*.js']
      }
    },

    reverse: {
      options: {
        ext: 'hbs',
        layout: 'default'
      },
      bootstrap: {
        options: {
          parent: 'bs-example'
        },
        files: {
          'tmp/reverse/': ['_demo/**/*.html']
        }
      },
      tags: {
        options: {
          tags: ['head', 'footer', 'title']
        },
        files: {
          'tmp/reverse/tags/': ['_demo/**/*.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // These plugins provide necessary tasks.
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['jshint', 'reverse']);
};