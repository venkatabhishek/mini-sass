let types = {
    colon: {
        regex: /^\:/
    },
    semicolon: {
        regex: /^\;/
    },
    comma: {
        regex: /^\,/
    },
    id: {
        regex: /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*/
    },
    num: {
        regex: /^[0-9]+(px|\%)?/
    },
    lbrace: {
        regex: /^\{/
    },
    rbrace: {
        regex: /^\}/
    },
    lparen: {
        regex: /^\(/
    },
    rparen: {
        regex: /^\)/
    },
    lsquare: {
        regex: /^\[/
    },
    rsquare: {
        regex: /^\]/
    }

}

export default types;