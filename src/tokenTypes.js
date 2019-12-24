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
    at: {
        regex: /^\@/
    },
    cash: {
        regex: /^\$/
    },
    quote: {
        regex: /^\".+\"/
    },
    squote: {
        regex: /^\'.+\'/
    },
    id: {
        regex: /^[\#\.-]?[_\.\#a-zA-Z]+[_a-zA-Z0-9-]*/
    },
    num: {
        regex: /^-?[0-9]+(px|\%|em)?/
    },
    hyphen: {
        regex: /^\-/
    },
    lbrace: {
        regex: /^\{/
    },
    rbrace: {
        regex: /^\}/
    },
    paren: {
        regex: /^\(.+\)/
    },
    lsquare: {
        regex: /^\[/
    },
    rsquare: {
        regex: /^\]/
    }

}

export default types;