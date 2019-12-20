import Lexer from '../src/lexer';
import Parser from '../src/parser';
const util = require('util');
const fs = require('fs');

let lexFull = function(l){
    let t;
    while(t = l.token()){
        console.log(t);
    }
}

let str = fs.readFileSync("./test/test.css").toString();
let lex = new Lexer(str);
// lexFull(lex);
let p = new Parser(lex);
console.log(util.inspect(p.ruleList(), {showHidden: false, depth: null}))