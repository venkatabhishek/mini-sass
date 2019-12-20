import Lexer from '../src/lexer';
import Parser from '../src/parser';
import Generator from '../src/generator';

const util = require('util');
const fs = require('fs');

let lexFull = function(l){
    let t;
    while(t = l.token()){
        console.log(t);
    }
}

let str = fs.readFileSync("./test/test.scss").toString();
let lex = new Lexer(str);
// lexFull(lex);
let p = new Parser(lex);
// console.log(util.inspect(p.ast(), {showHidden: false, depth: null}))
let g = new Generator(p.ast());
fs.writeFile('test/output.css', g.generateString(), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });