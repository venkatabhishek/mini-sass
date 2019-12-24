"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tokenTypes = _interopRequireDefault(require("./tokenTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var Lexer =
/*#__PURE__*/
function () {
  // init lexer with source string
  function Lexer(buf) {
    _classCallCheck(this, Lexer);

    this.pos = 0;
    this.buf = buf;
    this.bufLength = buf.length;
    this.line = 1;
    this.column = 0;
  } // get next token


  _createClass(Lexer, [{
    key: "token",
    value: function token() {
      if (this.pos >= this.bufLength) {
        // EOF token
        return null;
      } else {
        var current = this.buf.substring(this.pos); // newline

        var newline = current.match(/^(\r\n|\r|\n)/);

        if (newline) {
          this.line++;
          this.column = 0;
          this.pos += newline[0].length;
          current = this.buf.substring(this.pos);
        } // whitespace - change to ws-token in future


        var whitespace = current.match(/^( )+/);

        if (whitespace) {
          this.column += whitespace[0].length;
          this.pos += whitespace[0].length;
          current = this.buf.substring(this.pos);
        }

        for (var key in _tokenTypes["default"]) {
          var tempToken = _tokenTypes["default"][key];
          var matches = current.match(tempToken.regex);

          if (matches) {
            this.pos += matches[0].length;
            this.column += matches[0].length; // token 

            return {
              name: key,
              value: matches[0],
              line: this.line,
              column: this.column
            };
          }
        } // ignore unknown - including whitespace


        this.pos++;
        return this.token();
      }
    }
  }]);

  return Lexer;
}();

var _default = Lexer;
exports["default"] = _default;