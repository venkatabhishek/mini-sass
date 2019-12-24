"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var types = {
  colon: {
    regex: /^\:/
  },
  semicolon: {
    regex: /^\;/
  },
  comma: {
    regex: /^\,/
  },
  at: {
    regex: /^\@/
  },
  cash: {
    regex: /^\$/
  },
  quote: {
    regex: /^\".+\"/
  },
  squote: {
    regex: /^\'.+\'/
  },
  id: {
    regex: /^[\#\.-]?[_\.\#a-zA-Z]+[_a-zA-Z0-9-]*/
  },
  num: {
    regex: /^-?[0-9]+(px|\%|em)?/
  },
  hyphen: {
    regex: /^\-/
  },
  lbrace: {
    regex: /^\{/
  },
  rbrace: {
    regex: /^\}/
  },
  paren: {
    regex: /^\(.+\)/
  },
  lsquare: {
    regex: /^\[/
  },
  rsquare: {
    regex: /^\]/
  }
};
var _default = types;
exports["default"] = _default;