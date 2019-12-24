"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Generator =
/*#__PURE__*/
function () {
  function Generator(ast) {
    _classCallCheck(this, Generator);

    this.ast = ast;
  }

  _createClass(Generator, [{
    key: "generateString",
    value: function generateString() {
      var _this = this;

      var output = "";
      var env = {};
      var mixins = {};
      this.ast.forEach(function (rule) {
        output += function (name) {
          switch (name) {
            case "var":
              env = _this.generateVar(rule, env);
              return "";

            case "style":
              return _this.generateStyle(rule, env, mixins);

            case "at":
              var ret = _this.generateAtRule(rule, env, mixins);

              mixins = ret[1];
              return ret[0];

            default:
              break;
          }
        }(rule.name);
      });
      return output;
    }
  }, {
    key: "generateStyle",
    value: function generateStyle(rule, env, mixins) {
      var indent = this.indent();

      var currentEnv = _objectSpread({}, env);

      var currentMixins = _objectSpread({}, mixins);

      var currentDecls = _toConsumableArray(rule.decls);

      var selector = rule.id.join(" ");
      var currentStr = "";
      var nestedStr = "";

      for (var i = 0; i < currentDecls.length; i++) {
        var r = currentDecls[i];

        switch (r.name) {
          case "var":
            currentEnv = this.generateVar(r, currentEnv);
            break;

          case "decl":
            currentStr += this.generateDeclaration(r, currentEnv);
            break;

          case "at":
            // include
            if (r.id == "include") {
              var body = this.replaceMixins(r.value[0], currentMixins);
              currentDecls.splice.apply(currentDecls, [i + 1, 0].concat(_toConsumableArray(body)));
            } else {
              var _ret = this.generateAtRule(r, currentMixins);

              currentMixins = _ret[1];
              currentStr += _ret[0];
            }

            break;

          case "style":
            r.id.unshift(selector);
            nestedStr += this.generateStyle(r, currentEnv, currentMixins);
            break;

          default:
            break;
        }
      }

      var ret = "";

      if (currentStr.length != 0) {
        ret += "".concat(selector, " {") + "".concat(currentStr) + "\n}\n\n";
      }

      if (nestedStr.length != 0) {
        ret += nestedStr;
      }

      return ret;
    }
  }, {
    key: "generateDeclaration",
    value: function generateDeclaration(rule, env) {
      return "\n".concat(this.indent()).concat(rule.id, ": ").concat(this.replaceVars(rule.value, env), ";");
    }
  }, {
    key: "generateAtRule",
    value: function generateAtRule(rule, env, mixins) {
      if (rule.type == "inline") {
        return ["\n".concat(this.indent(), "@").concat(rule.id, " ").concat(rule.value.join(""), ";"), mixins];
      } else if (rule.type == "block") {
        // @mixin
        if (rule.id == "mixin") {
          switch (rule.idx.length) {
            case 0:
              throw new Error("Incorrect mixin syntax");

            case 1:
              // no args
              var name = rule.idx[0];
              mixins[name] = rule.body;
              break;

            case 2:
              // args
              break;

            default:
              break;
          }
        }

        return ["", mixins];
      } else {
        //will never reach here
        return ["", mixins];
      }
    }
  }, {
    key: "generateVar",
    value: function generateVar(rule, env) {
      env[rule.id] = this.replaceVars(rule.value, env);
      return env;
    } // replace vars with value in declaration

  }, {
    key: "replaceVars",
    value: function replaceVars(lst, env) {
      return lst.map(function (d) {
        if (d.startsWith("$")) {
          var id = d.substring(1);

          if (id in env) {
            return env[id];
          } else {
            throw new Error("Variable \"".concat(id, "\" undefined"));
          }
        } else {
          return d;
        }
      }).join(" ");
    }
  }, {
    key: "replaceMixins",
    value: function replaceMixins(id, mixins) {
      if (id in mixins) {
        return mixins[id];
      } else {
        throw new Error("Mixin ".concat(id, " undefined"));
      }
    }
  }, {
    key: "indent",
    value: function indent() {
      return " ".repeat(4);
    }
  }]);

  return Generator;
}();

var _default = Generator;
exports["default"] = _default;