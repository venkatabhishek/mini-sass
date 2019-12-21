// grammar

// stylsheet ::=  ruleList

// ruleList ::= rule ruleList | e

// rule ::=  var | @ rule | style

// var ::= $ id : idList ;

// style ::= id+  { declarationList }

// declarationList ::= declaration declarationList | e

// declaration ::= id : any

// idList ::= id (,|\s) idList | e
// example: id1, id2 id3

// any ::= term any | e 

// term ::= id | num

class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.lookahead = this.lexer.token();
    }

    // consume token
    match(tk) {
        if(tk != this.lookahead.name){
            throw new Error(`Line ${this.lookahead.line}: Column ${this.lookahead.column}: `
                            + `Expected token ${tk} but saw token ${this.lookahead.name}`)
        }

        this.lookahead = this.lexer.token();
    }

    ast() {
        // empty stylesheet
        if(!this.lookahead){
            return {};
        }
        return this.ruleList();
    }

    ruleList() {
        let r = this.rule();
        if(this.lookahead){
            let rl = this.ruleList();
            return [r].concat(rl);
        }
        return [r];
    }

    rule() {
        switch (this.lookahead.name) {
            case "at":
                return this.at();
            case "cash":
                return this.var();
            case "id":
                return this.style();
            default:
                throw new Error(`Line ${this.lookahead.line}: Column ${this.lookahead.column}: `
                                + `Expected one of @, $, or ID`);
                break;
        }
        return this.style();
    }

    at() {
        this.match("at");
        let id = this.lookahead.value;
        this.match("id");
        let v = this.joinVars(this.any());
        this.match("semicolon");
        return {
            name: "at",
            id,
            value: v
        }
    }

    var() {
        this.match("cash");
        let id = this.lookahead.value;
        this.match("id");
        this.match("colon");
        let value = this.joinVars(this.any());
        this.match("semicolon");
        return {
            name: "var",
            id,
            value
        }

    }

    style(){
        let id = this.idList();
        this.match("lbrace");
        let decls = this.declarationList();
        this.match("rbrace");
        return {
            name: "style",
            id,
            decls
        }

    }

    declarationList(){
        if(this.lookahead.name == "id"){
            let decl = this.declaration();
            return [decl].concat(this.declarationList());
        }else{
            return [];
        }
    }

    declaration(){
        let id = this.lookahead.value;
        this.match("id");
        this.match("colon");
        let vlist = this.joinVars(this.any());
        this.match("semicolon");
        return {
            name: id,
            value: vlist
        }
    }

    idList(){
        if(this.lookahead.name == "id"){
            let v = this.lookahead.value;
            this.match("id");

            if(this.lookahead.name == "comma"){
                this.match("comma");
                return [v, "comma"].concat(this.idList());
            }else{
                return [v].concat(this.idList());
            }

        }else{
            return [];
        }
    }

    any(){

        let valid = ["id", "num", "lparen", "rparen", "quote", "squote", "comma", "hyphen", "cash"]

        if(valid.indexOf(this.lookahead.name) != -1){
            
            let v = this.lookahead;

            this.match(this.lookahead.name);

            let rest = this.any();

            // checks

            if(v.name == "cash" && rest.length == 0){
                throw new Error(`Expected Identifier ${v.line}:${v.column}`)
            }
            
            return [v.value].concat(rest);
        }else{
            return [];
        }

    }

    term() {
        if(this.lookahead.name == "id" || this.lookahead.name == "num"){
            let v = {
                type: this.lookahead.name,
                value: this.lookahead.value
            }

            this.match(this.lookahead.name);
            return v;
        }else{
            return null;
        }
    }

    // join ['$', 'varname'] => ['$varname']
    joinVars(lst){
        let ret = [];
        for(let i = 0; i < lst.length; i++){
            if(lst[i] == "$"){
                ret.push("$"+lst[i+1]);
                i+=1;
            }else{
                ret.push(lst[i]);
            }
        }

        return ret;
    }



}

export default Parser;
