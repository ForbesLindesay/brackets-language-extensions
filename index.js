'use strict';

// http://codemirror.net/mode/index.html
// https://github.com/adobe/brackets/blob/master/src/language/languages.json
// https://github.com/git/hello-world

var fs = require('fs');
var rimraf = require('rimraf').sync;
var Zip = require('node-zip');

var languages = {
  'apl': {
    name: 'APL',
    mode: 'apl',
    fileExtensions: ['apl'],
    lineComment: ['⍝']
  },
  'cobol': {
    name: 'COBOL',
    mode: 'cobol',
    fileExtensions: ['cbl']
  },
  'commonlisp': {
    name: 'Common Lisp',
    mode: 'commonlisp',
    fileExtensions: ['clisp', 'lisp'],
    lineComment: [';', ';;']
  },
  'd': {
    name: 'D',
    mode: 'd',
    fileExtensions: ['d'],
    lineComment: ['//'],
    blockComment: ['/*', '*/']
  },
  'dtd': {
    name: 'DTD',
    mode: 'dtd',
    fileExtensions: ['dtd'],
    blockComment: ['<!--', '-->']
  },
  'ecl': {
    name: 'ECL',
    mode: 'ecl',
    fileExtensions: ['ecl'],
    lineComment: ['//'],
    blockComment: ['/*', '*/']
  },
  'eiffel': {
    name: 'Eiffel',
    mode: 'eiffel',
    fileExtensions: ['e', 'eiff'],
    lineComment: ['--']
  },
  'erlang': {
    name: 'Erlang',
    mode: 'erlang',
    fileExtensions: ['erl', 'escript'],
    lineComment: ['%%']
  },
  'fortran': {
    name: 'FORTRAN',
    mode: 'fortran',
    fileExtensions: ['f90', 'f77'],
    lineComment: ['!']
  },
  'haskell': {
    name: 'Haskell',
    mode: 'haskell',
    fileExtensions: ['hs'],
    lineComment: ['--']
  },
  'haxe': {
    name: 'Haxe',
    mode: 'haxe',
    fileExtensions: ['hx'],
    lineComment: ['//'],
    blockComment: ['/*', '*/']
  },
  'http': {
    name: 'HTTP',
    mode: 'http',
    fileExtensions: ['http']
  }
};

function plugin(name, mode) {
  return 'define(function (require, exports, module) {\n' +
    '  "use strict";\n' +
    '  var LanguageManager = brackets.getModule("language/LanguageManager");\n' +
    '  LanguageManager.defineLanguage(' + JSON.stringify(name) + ', ' +
    JSON.stringify(mode) + ');\n' +
    '});';
}
function pkg(name, mode) {
  var extensions = mode.fileExtensions.map(function (e) { return '.' + e }).join(', ');
  return JSON.stringify({
    name: name,
    title: mode.name + ' Syntax Highlighter',
    description: 'Add syntax highlighting support for the ' + mode.name + ' language (' + extensions + ').',
    homepage: 'https://github.com/ForbesLindesay/brackets-language-extensions',
    version: '1.0.0',
    author: 'Forbes Lindesay (http://www.forbeslindesay.co.uk)',
    license: 'MIT',
    engines: {
      'brackets': '>=0.24.0'
    }
  }, null, '  ');
}

rimraf(__dirname + '/output');
fs.mkdirSync(__dirname + '/output');
Object.keys(languages).forEach(function (name) {
  var zip = new Zip();
  zip.file('main.js', plugin(name, languages[name]));
  zip.file('package.json', pkg(name, languages[name]));
  var data = new Buffer(zip.generate({base64: false, compression: 'DEFLATE'}), 'binary');
  fs.writeFileSync(__dirname + '/output/' + name + '.zip', data);
});