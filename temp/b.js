const css = require('css')
const fs = require('fs')
var s  = fs.readFileSync('test/css/basicVariable.css').toString();
var obj = css.parse(s);
console.log(css.stringify(obj));