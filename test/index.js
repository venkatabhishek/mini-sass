const css = require('css');
const fs = require('fs');
const util = require('util');

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
            expect(p.innerRule()).to.eql({
                name: "decl",
                id: ["width"],
                value: ["100%"]
            });
        })
    })

    describe("#ast()", () => {
        it("parses ast", () => {
            let d = new Lexer("div { width: 24%; height: 90%; }");
            let p = new Parser(d);
            expect(p.ast()).to.eql([{
                name: "style",
                id: ["div"],
                decls: [
                    {
                        name: "decl",
                        id: ["width"],
                        value: ["24%"]
                    },
                    {
                        name: "decl",
                        id: ["height"],
                        value: ["90%"]
                    }
                ]
            }])
        })

        it("parses @ rules", () => {
            let d = new Lexer(`@import "test.css";`);
            let p = new Parser(d);
            expect(p.ast()).to.eql([{
                name: "at",
                type: "inline",
                id: "import",
                value: ['"test.css"']
            }])
        })

        it("parses nested styles", () => {
            let d = new Lexer(".one { .two { width: 3px; } }");
            let p = new Parser(d);
            expect(p.ast()).to.eql([{
                name: "style",
                id: [".one"],
                decls: [
                    {
                        name: "style",
                        id: [".two"],
                        decls: [
                            {
                                name: "decl",
                                id: ["width"],
                                value: ["3px"]
                            }
                        ]
                    }
                ]
            }])
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
            compareCSS("nestedVariable");
        })
    })

    describe("Feature: Nested Styles", () => {
        it("Replaces nested styles", () => {
            compareCSS("nestedStyles");
        })

        it("Replaces nested styles and declarations", () => {
            compareCSS("nestedStylesDeclarations");
        })
    })

    describe("Feature: Mixins", () => {
        it("Replaces without args", () => {
            compareCSS("mixin");
        })
    })
})

let compareCSS = function (filename) {
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