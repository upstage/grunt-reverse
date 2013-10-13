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
     reverse: {
      options: {
        ext: 'hbs',
        layout: 'default',
      },
      includes: {
        options: {
          parent: '.bs-example',
          components: ['btn', 'popover']
        },
        files: {
          'tmp/reverse/includes/': ['_demo/*.html']
        }
      },
      sections: {
        options: {
          tags: ['head', 'footer']
        },
        files: {
          'tmp/reverse/sections/': ['_demo/*.html']
        }
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['reverse']);
};