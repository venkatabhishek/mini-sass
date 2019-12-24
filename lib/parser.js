"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// grammar
// stylsheet ::=  ruleList
// ruleList ::= rule ruleList | e
// rule ::=  var | @ rule | style
// var ::= $ id : any ;
// style ::= id+  { styleList }
// styleList ::= innerRule styleList | e
// innerRule ::= var | @ rule | style | declaration
// declaration ::= id : any ;
// idList ::= id (,|\s) idList | e
// example: id1, id2 id3
// any ::= valid any | e 
// valid ::= id | num | lparen | rparen | quote | squote | comma | hyphen | cash
var Parser =
/*#__PURE__*/
function () {
  function Parser(lexer) {
    _classCallCheck(this, Parser);

    this.lexer = lexer;
    this.lookahead = this.lexer.token();
  } // consume token


  _createClass(Parser, [{
    key: "match",
    value: function match(tk) {
      if (tk != this.lookahead.name) {
        throw new Error("Line ".concat(this.lookahead.line, ": Column ").concat(this.lookahead.column, ": ") + "Expected token ".concat(tk, " but saw token ").concat(this.lookahead.name));
      }

      this.lookahead = this.lexer.token();
    }
  }, {
    key: "ast",
    value: function ast() {
      // empty stylesheet
      if (!this.lookahead) {
        return {};
      }

      return this.ruleList();
    }
  }, {
    key: "ruleList",
    value: function ruleList() {
      if (this.lookahead) {
        var r = this.rule();
        return [r].concat(this.ruleList());
      } else {
        return [];
      }
    }
  }, {
    key: "rule",
    value: function rule() {
      switch (this.lookahead.name) {
        case "at":
          return this.at();

        case "cash":
          return this["var"]();

        case "id":
          var id = this.idList();
          return this.style(id);

        default:
          throw new Error("Line ".concat(this.lookahead.line, ": Column ").concat(this.lookahead.column, ": ") + "Expected one of @, $, or ID");
          break;
      }
    } // MODIFY: CHECK FOR COLON - generic at rule - OR BRACE/PAREN - mixin/function

  }, {
    key: "at",
    value: function at() {
      this.match("at");
      var id = this.lookahead.value;
      this.match("id");
      var v = this.joinVars(this.any());
      var type = this.lookahead.name;

      if (type == "semicolon") {
        this.match("semicolon");
        return {
          name: "at",
          type: "inline",
          id: id,
          value: v
        };
      } else if (type == "lbrace") {
        this.match("lbrace");
        var body = this.styleList();
        this.match("rbrace");
        return {
          name: "at",
          type: "block",
          id: id,
          idx: v,
          body: body
        };
      }
    }
  }, {
    key: "var",
    value: function _var() {
      this.match("cash");
      var id = this.lookahead.value;
      this.match("id");
      this.match("colon");
      var value = this.joinVars(this.any());
      this.match("semicolon");
      return {
        name: "var",
        id: id,
        value: value
      };
    }
  }, {
    key: "style",
    value: function style(id) {
      this.match("lbrace");
      var decls = this.styleList();
      this.match("rbrace");
      return {
        name: "style",
        id: id,
        decls: decls
      };
    }
  }, {
    key: "styleList",
    value: function styleList() {
      if (this.lookahead.name == "rbrace") {
        return [];
      } else {
        var inner = this.innerRule();
        return [inner].concat(this.styleList());
      }
    }
  }, {
    key: "innerRule",
    value: function innerRule() {
      switch (this.lookahead.name) {
        case "at":
          return this.at();

        case "cash":
          return this["var"]();

        case "id":
          // style or declaration
          var id = this.idList();

          if (this.lookahead.name == "colon") {
            return this.declaration(id);
          } else if (this.lookahead.name == "lbrace") {
            return this.style(id);
          } else {
            throw new Error("Line ".concat(this.lookahead.line, ": Column ").concat(this.lookahead.column, ": ") + "Expected one of : or {");
          }

        default:
          throw new Error("Line ".concat(this.lookahead.line, ": Column ").concat(this.lookahead.column, ": ") + "Expected one of @, $, or ID");
      }
    }
  }, {
    key: "declaration",
    value: function declaration(id) {
      this.match("colon");
      var value = this.joinVars(this.any());
      this.match("semicolon");
      return {
        name: "decl",
        id: id,
        value: value
      };
    }
  }, {
    key: "idList",
    value: function idList() {
      if (this.lookahead.name == "id") {
        var v = this.lookahead.value;
        this.match("id");

        if (this.lookahead.name == "comma") {
          this.match("comma");
          return [v, "comma"].concat(this.idList());
        } else {
          return [v].concat(this.idList());
        }
      } else {
        return [];
      }
    }
  }, {
    key: "any",
    value: function any() {
      var valid = ["id", "num", "paren", "quote", "squote", "comma", "hyphen", "cash"];

      if (valid.indexOf(this.lookahead.name) != -1) {
        var v = this.lookahead;
        this.match(this.lookahead.name);
        var rest = this.any(); // checks

        if (v.name == "cash" && rest.length == 0) {
          throw new Error("Expected Identifier ".concat(v.line, ":").concat(v.column));
        }

        return [v.value].concat(rest);
      } else {
        return [];
      }
    } // join ['$', 'varname'] => ['$varname']

  }, {
    key: "joinVars",
    value: function joinVars(lst) {
      var ret = [];

      for (var i = 0; i < lst.length; i++) {
        if (lst[i] == "$") {
          ret.push("$" + lst[i + 1]);
          i += 1;
        } else {
          ret.push(lst[i]);
        }
      }

      return ret;
    }
  }]);

  return Parser;
}();

var _default = Parser;
exports["default"] = _default;