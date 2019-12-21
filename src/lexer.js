const fs = require('fs');
import types from './tokenTypes';

class Lexer {

    // init lexer with source string
    constructor(buf) {
        this.pos = 0;
        this.buf = buf;
        this.bufLength = buf.length;
        
        this.line = 1;
        this.column = 0;        

    }

    // get next token
    token() {
        
        if(this.pos >= this.bufLength){
            // EOF token
            return null;
        }else{

            let current = this.buf.substring(this.pos);

            // newline
            let newline = current.match(/^(\r\n|\r|\n)/);
            if(newline){
                this.line++;
                this.column = 0;
                this.pos+=newline[0].length;
                current = this.buf.substring(this.pos);
            }

            // whitespace - change to ws-token in future
            let whitespace = current.match(/^( )+/)
            if(whitespace){
                this.column += whitespace[0].length;
                this.pos +=whitespace[0].length;
                current = this.buf.substring(this.pos);
            }

            for(let key in types){

                let tempToken = types[key];
                let matches = current.match(tempToken.regex);

                if(matches){

                    this.pos+=matches[0].length;
                    this.column+=matches[0].length
                    
                    // token 
                    return {
                        name: key,
                        value: matches[0],
                        line: this.line,
                        column: this.column
                    }

                }               

            }

            // ignore unknown - including whitespace
            this.pos++;
            return this.token();


        }

    }


}

export default Lexer;