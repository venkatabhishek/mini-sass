var StateMachine = require('javascript-state-machine');

// init dfa

let states = ["var", "id", "colon", "lbrace", "rbrace", "semicolon"]

let transitions = [
    { name: "cash", from: "start", to: "var" },
    { name: "colon", from: "start", to: "colon" },
    { name: "lbrace", from: "start", to: "lbrace" },
    { name: "rbrace", from: "start", to: "rbrace" },
    { name: "semicolon", from: "start", to: "semicolon" },
    { name: "newline", from: "start", to: "newline" },
    { name: "newline", from: "newline", to: "newline" },
    { name: "alphanumeric", from: "start", to: "id" },
    { name: "alphanumeric", from: "id", to: "id" }
]

// reset transitions

states.forEach(s => {
    transitions.push({
        name: "reset",
        from: s,
        to: "start"
    })
})

// map character to transition name

let cmap = {
    "$": "cash",
    ":": "colon",
    "{": "lbrace",
    "}": "rbrace",
    ";": "semicolon",
    "\n": "newline",
    "\r": "newline",
}


let fsm = new StateMachine({
    init: 'start',
    transitions,
    data: {
        currentToken: ""
    },
    methods: {
        updateToken: function(c){
            this.currentToken += c;
        },
        resetToken: function(){
            this.currentToken = "";
        }
    }
}) 