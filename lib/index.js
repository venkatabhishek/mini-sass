"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = void 0;

var _lexer = _interopRequireDefault(require("./lexer"));

var _parser = _interopRequireDefault(require("./parser"));

var _generator = _interopRequireDefault(require("./generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// API
var fs = require('fs');

var compile = function compile(s) {
  var l = new _lexer["default"](s);
  var p = new _parser["default"](l);
  var g = new _generator["default"](p.ast());
  return g.generateString();
};

exports.compile = compile;