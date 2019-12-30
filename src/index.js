// API

import Lexer from './lexer';
import Parser from './parser';
import Generator from './generator';


let compile = function (s) {

    let l = new Lexer(s);
    let p = new Parser(l);
    let g = new Generator(p.ast());

    return g.generateString();
}

export { compile }