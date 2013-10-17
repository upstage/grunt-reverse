/*!
 * Upstage Component Builder: Reverse
 * http://github.com/upstage/upstage
 *
 * Copyright 2013 Sellside, Inc.
 * Licensed under the MIT License
 * http://opensource.org/licenses/MIT
 *
 * Designed and built by @jonschlinkert.
 */

var path = require('path');


/**
 * Prettify HTML
 */
var prettify = function(str) {
  return require('js-prettify').html(str, {
    indent_size: 2,
    indent_inner_html: true,
    unformatted: ['code', 'pre', 'em', 'strong']
  });
};

exports.stripWhitespace = function(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
};

var collapseli = function(str) {
  return str.replace(/<\/a>\s*<\/li>/g, '</a> </li>');
};

// Add a newline above each code comment.
var padcomments = function(str) {
  return str.replace(/(\s*<!--)/g, '\n$1');
};

// Remove superfluous whitespace
var condense = function(str) {
  return str.replace(/(\r\n|\n\r|\n|\r){2,}/g, '\n');
};

// If one exists, lop the first empty line off the top of a file.
var shave = function(str) {
  return str.replace(/^\s*/g, '');
};

var fixClosingComments = function(str) {
  return str.replace(/\s*(<!--\s*\/.+)/g, '$1');
};

var padComponents = function(str) {
  return str.replace(/^<(?:(?!\/))/gm, '\n<');
};

/**
 * Format generated HTML
 * @param  {String} src       Unformatted HTML
 * @param  {String} separator The separator to use between sections of joined content.
 * @return {String}
 */
exports.format = function(src, sep) {
  src = prettify(src);
  src = condense(src);
  src = padcomments(src);
  src = padComponents(src, sep);
  src = shave(src);
  return fixClosingComments(src);
};

/**
 * Default separator
 */
exports.sep = function(str) {
  return '<!--  ' + str + '  -->\n';
};

/**
 * Create an array of strings that match the
 * given regex pattern.
 * @param  {RegExp} regex
 * @param  {String} src
 * @return {Array}
 */
exports.patternArray = function(regex, src) {
  // src = require('grunt').file.read(src);
  var match;
  var matches = [];
  while (match = regex.exec(src)) {
    matches.push(match[1]);
  }
  return matches;
};

// basename, excluding extension
exports.base = function(filepath) {
  return path.basename(filepath, path.extname(filepath));
};
// Remove trailing "s"
exports.sanitize = function(src, blacklist) {
  return exports.base(src).replace(/s$/, '');
};

