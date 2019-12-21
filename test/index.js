const css = require('css');
const fs = require('fs');
import Lexer from '../src/lexer';
import Parser from '../src/parser';
import Generator from '../src/generator';
import { expect, assert } from "chai"

const testDir = "test/"


describe("Lexer", () => {
    describe("#token()", () => {
        it("Should return null when EOF is reached", () => {
            let empty = new Lexer("");
            let token = empty.token();
            expect(token).to.be.null;
        })

        it("Will identify multiple selectors", () => {
            let multiple = new Lexer("div.test");
            let token = multiple.token();
            assert.equal(token.value, "div.test");
        })

        it("Will identify separate selectors", () => {
            let separate = new Lexer("div .test");
            let token = separate.token();
            assert.equal(token.value, "div")
            token = separate.token();
            assert.equal(token.value, ".test");
        })
    })
})

describe("Parser", () => {
    describe("#declaration()", () => {
        it("parses a single style declaration", () => {
            let d = new Lexer("width: 100%;");
            let p = new Parser(d);
            expect(p.declaration()).to.eql({
                name: "width",
                value: ["100%"]
            });
        })
    })

    describe("#style()", () => {
        it("parses a style: selector + series of declarations", () => {
            let d = new Lexer("div { width: 100%; height: 90%; }");
            let p = new Parser(d);
            expect(p.style()).to.eql({
                name: "style",
                id: ["div"],
                decls: [
                    {
                        name: "width",
                        value: ["100%"]
                    },
                    {
                        name: "height",
                        value: ["90%"]
                    }
                ]
            })
        })
    })

    describe("#var()", () => {
        it("parses a variable definition", () => {
            let d = new Lexer("$myvar: 60%;");
            let p = new Parser(d);
            expect(p.var()).to.eql({
                name: "var",
                id: "myvar",
                value: ["60%"]
            })
        })
    })
})

describe("Generator", () => {
    describe("Feature: Variables", () => {
        it("Replaces variables in styles", () => {
            compareCSS("basicVariable");
        })

        it("Replaces variables within variables", () => {
            compareCSS("variableNest");
        })
    })
})

let compareCSS = function(filename){
    let f = fs.readFileSync(`${testDir}/scss/${filename}.scss`).toString();
    let l = new Lexer(f);
    let p = new Parser(l);
    let g = new Generator(p.ast());
    let s = g.generateString();

    let customAST = css.parse(s);
    let customS = css.stringify(customAST);

    let actualF = fs.readFileSync(`${testDir}/css/${filename}.css`).toString();
    let actualAST = css.parse(actualF);
    let actualS = css.stringify(actualAST);

    assert.equal(customS, actualS);
}