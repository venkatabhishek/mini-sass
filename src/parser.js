// grammar

// stylsheet ::=  ruleList

// ruleList ::= rule ruleList | e

// rule ::=  var | style

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
        return this.style();
    }

    style(){
        let ids = this.idList();
        this.match("lbrace");
        let decls = this.declarationList();
        this.match("rbrace");
        return {
            name: "style",
            ids,
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
        let vlist = this.any();
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
        let t = this.term();
        if(t){
            if(this.lookahead == "comma"){
                match("comma");
                return [t, "comma"].concat(this.any());
            }else{
                return [t].concat(this.any());
            }
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



}

export default Parser;
