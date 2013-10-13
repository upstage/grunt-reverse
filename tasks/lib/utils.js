/*!
 * Upstage Component Builder: Prettify
 * http://github.com/upstage/upstage
 *
 * Copyright 2013 Sellside, Inc.
 * Licensed under the MIT License
 * http://opensource.org/licenses/MIT
 *
 * Designed and built by @jonschlinkert.
 */

var path = require('path');


var padcomments = function(str) {
  return str.replace(/(\s*<!--)/g, '\n$1');
}

/**
 * Prettify HTML
 */
var prettify = function(src) {
  return require('js-prettify').html(src, {
    indent_size: 2,
    indent_inner_html: true,
    unformatted: ['code', 'pre', 'em', 'strong']
  }).replace(/(\r\n|\n\r|\n|\r){2,}/g, '\n').replace(/<\/a>\s*<\/li>/g, '</a> </li>');
};

/**
 * Format generated HTML
 * @param  {String} src       Unformatted HTML
 * @param  {String} separator The separator to use between sections of joined content.
 * @return {String}     
 */
exports.format = function(src, separator) {
  separator = separator || '';
  return padcomments(separator + prettify(src)).replace(/^\s*/g, '');
};

/**
 * Default separator
 */
exports.sep = function(str) {
  return '<!-- ' + str + '-->\n';
}

/**
 * Create an array of strings that match the 
 * given regex pattern.
 * @param  {RegExp} regex 
 * @param  {String} src   
 * @return {Array}       
 */
exports.patternArray = function(regex, src) {
  src = require('grunt').file.read(src);
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

