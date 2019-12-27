// grammar

// stylsheet ::=  ruleList

// ruleList ::= rule ruleList | e

// rule ::=  var | @ rule | style | comment

// var ::= $ id : any ;

// style ::= id+  { styleList }

// styleList ::= innerRule styleList | e

// innerRule ::= var | @ rule | style | declaration | comment

// declaration ::= id : any ;

// idList ::= id (,|\s) idList | e
// example: id1, id2 id3

// any ::= valid any | e 

// valid ::= id | num | lparen | rparen | quote | squote | comma | hyphen | cash

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
        if(this.lookahead){
            let r = this.rule();
            return [r].concat(this.ruleList());
        }else{
            return [];
        }
        
    }

    rule() {
        switch (this.lookahead.name) {
            case "at":
                return this.at();
            case "cash":
                return this.var();
            case "id":
                let id = this.idList();
                return this.style(id);
            case "comment":
                return this.comment();
            default:
                throw new Error(`Line ${this.lookahead.line}: Column ${this.lookahead.column}: `
                                + `Expected one of @, $, or ID`);
                break;
        }
    }

    at() {
        this.match("at");
        let id = this.lookahead.value;
        this.match("id");
        let v = this.joinVars(this.any());
        let type = this.lookahead.name;
        if(type == "semicolon"){
            this.match("semicolon");

            return {
                name: "at",
                type: "inline",
                id,
                value: v
            }
        }else if(type == "lbrace"){
            this.match("lbrace");
            let body = this.styleList();
            this.match("rbrace");

            return {
                name: "at",
                type: "block",
                id,
                idx: v,
                body 
            }
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

    style(id){
        this.match("lbrace");
        let decls = this.styleList();
        this.match("rbrace");
        return {
            name: "style",
            id,
            decls
        }

    }

    comment(){
        let { name, value } = this.lookahead;
        this.match("comment");
        return {
            name,
            value
        }
    }

    styleList() {
        if(this.lookahead.name == "rbrace"){
            return [];
        }else{
            let inner = this.innerRule();
            return [inner].concat(this.styleList());
        }
    }

    innerRule() {
        switch (this.lookahead.name) {
            case "at":
                return this.at();
            case "cash":
                return this.var();
            case "comment":
                return this.comment();
            case "id":
                // style or declaration
                let id = this.idList();
                if(this.lookahead.name == "colon"){
                    return this.declaration(id);
                }else if(this.lookahead.name == "lbrace"){
                    return this.style(id);
                }else{
                    throw new Error(`Line ${this.lookahead.line}: Column ${this.lookahead.column}: `
                                + `Expected one of : or {`);
                }
            default:
                throw new Error(`Line ${this.lookahead.line}: Column ${this.lookahead.column}: `
                                + `Expected one of @, $, or ID`);
        }
    }


    declaration(id){
        this.match("colon");
        let value = this.joinVars(this.any());
        this.match("semicolon");
        return {
            name: "decl",
            id,
            value
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

        let valid = ["id", "num", "paren", "quote", "squote", "comma", "hyphen", "cash"]

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
