// var StateMachine = require('javascript-state-machine');

// // init dfa

// let states = ["var", "id", "colon", "lbrace", "rbrace", "semicolon"]

// let transitions = [
//     { name: "cash", from: "start", to: "var" },
//     { name: "colon", from: "start", to: "colon" },
//     { name: "lbrace", from: "start", to: "lbrace" },
//     { name: "rbrace", from: "start", to: "rbrace" },
//     { name: "semicolon", from: "start", to: "semicolon" },
//     { name: "newline", from: "start", to: "newline" },
//     { name: "newline", from: "newline", to: "newline" },
//     { name: "alphanumeric", from: "start", to: "id" },
//     { name: "alphanumeric", from: "id", to: "id" }
// ]

// // reset transitions

// states.forEach(s => {
//     transitions.push({
//         name: "reset",
//         from: s,
//         to: "start"
//     })
// })

// // map character to transition name

// let cmap = {
//     "$": "cash",
//     ":": "colon",
//     "{": "lbrace",
//     "}": "rbrace",
//     ";": "semicolon",
//     "\n": "newline",
//     "\r": "newline",
// }


// let fsm = new StateMachine({
//     init: 'start',
//     transitions,
//     data: {
//         currentToken: ""
//     },
//     methods: {
//         updateToken: function(c){
//             this.currentToken += c;
//         },
//         resetToken: function(){
//             this.currentToken = "";
//         }
//     }
// }) 


import Lexer from '../src/lexer';
import Parser from '../src/parser';
import Generator from '../src/generator';
var css = require("css");

const util = require('util');
const fs = require('fs');

let lexFull = function(l){
    let t;
    while(t = l.token()){
        console.log(t);
    }
}

let str = fs.readFileSync("test/scss/nestedStyles.scss").toString();
let lex = new Lexer(str);
// lexFull(lex);
let p = new Parser(lex);
// console.log(util.inspect(p.ast(), {showHidden: false, depth: null}))
let g = new Generator(p.ast());
// console.log(JSON.stringify(g.generateString()));
// let ast = css.parse(g.generateString());
// console.log(css.stringify(ast));
fs.writeFile('temp/output.css', g.generateString(), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
// let actual = "test/css/basicVariable.css";
// let actualF = fs.readFileSync(actual).toString();
// let actualAST = css.parse(actual);
// let actualS = css.stringify(actualAST);
// console.log(actual);