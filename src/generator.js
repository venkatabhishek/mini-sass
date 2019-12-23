class Generator {

    constructor(ast) {
        this.ast = ast;
    }

    generateString() {
        let output = "";
        let env = {};

        this.ast.forEach(rule => {

            output += ((name) => {

                switch (name) {
                    case "var":
                        env = this.generateVar(r, env);
                        return "";
                    case "style":
                        return this.generateStyle(rule, env);
                    case "at":
                        return this.generateAtRule(rule);
                    default:
                        break;
                }

            })(rule.name);

        })

        return output;
    }

    generateStyle(rule, env){
        let indent = this.indent();
        let currentEnv = {...env};
        let selector = rule.id.join(" ");
        
        let currentStr = "";
        let nestedStr = "";

        rule.decls.forEach(r => {
            switch(r.name){
                case "var":
                    currentEnv = this.generateVar(r, currentEnv);
                    break;
                case "decl":
                    currentStr += this.generateDeclaration(r, currentEnv);
                    break;
                case "at":
                    currentStr += this.generateAtRule(r);
                    break;
                case "style":
                    r.id.unshift(selector);
                    nestedStr += this.generateStyle(r, currentEnv);
                    break;
                default:
                    break;
            }
        })

        let ret = "";

        if(currentStr.length != 0){
            ret += `${selector} {` +
            `${currentStr}` +
            `\n}\n\n`
        }

        if(nestedStr.length != 0){
            ret += nestedStr;
        }

        return ret;

    }

    generateDeclaration(rule, env) {
        return `\n${this.indent()}${rule.id}: ${this.replaceVars(rule.value, env)};`
    }

    generateAtRule(rule){
        return `\n${this.indent()}@${rule.id} ${rule.value.join("")};`
    }

    generateVar(rule, env){
        env[rule.id] = this.replaceVars(rule.value, env);
        return env;
    }

    // replace vars with value in declaration
    replaceVars(lst, env){
        return lst.map((d) => {
            if(d.startsWith("$")){

                let id = d.substring(1);

                if(id in env){
                    return env[id];
                }else{
                    throw new Error(`Variable "${id}" undefined`)
                }

            }else{
                return d;
            }
        }).join(" ");
    }

    generateFile(filename) {
        
    }

    indent(){
        return " ".repeat(4);
    }


}

export default Generator