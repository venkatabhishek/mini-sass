class Generator {

    constructor(ast) {
        this.ast = ast;
    }

    generateString() {
        let output = "";
        let env = {};
        let mixins = {};

        this.ast.forEach(rule => {

            output += ((name) => {

                switch (name) {
                    case "var":
                        env = this.generateVar(rule, env);
                        return "";
                    case "comment":
                        return this.generateComment(rule);
                    case "style":
                        return this.generateStyle(rule, env, mixins);
                    case "at":
                        let ret = this.generateAtRule(rule, env, mixins);
                        mixins = ret[1];
                        return ret[0];
                    default:
                        break;
                }

            })(rule.name);

        })

        return output;
    }

    generateStyle(rule, env, mixins){
        let indent = this.indent();
        let currentEnv = {...env};
        let currentMixins = {...mixins};
        let currentDecls = [...rule.decls];

        let selector = rule.id.join(" ");
        
        let currentStr = "";
        let nestedStr = "";


        for(let i = 0; i < currentDecls.length;i++){
            let r = currentDecls[i];
            switch(r.name){
                case "var":
                    currentEnv = this.generateVar(r, currentEnv);
                    break;
                case "comment":
                    currentStr += this.generateComment(r);
                case "decl":
                    currentStr += this.generateDeclaration(r, currentEnv);
                    break;
                case "at":
                    // include
                    if(r.id == "include"){
                        let body = this.replaceMixins(r.value[0], currentMixins);
                        currentDecls.splice(i+1, 0, ...body);
                    }else{
                        let ret = this.generateAtRule(r, currentMixins);
                        currentMixins = ret[1];
                        currentStr += ret[0]; 
                    }
                    
                    break;
                case "style":
                    r.id.unshift(selector);
                    nestedStr += this.generateStyle(r, currentEnv, currentMixins);
                    break;
                default:
                    break;
            }
        }

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

    generateComment(rule){
        return `/*${rule.value}*/`
    }

    generateAtRule(rule, env, mixins){
        if(rule.type == "inline"){
            return [`\n${this.indent()}@${rule.id} ${rule.value.join("")};`, mixins]
        }else if(rule.type == "block"){

            // @mixin

            if(rule.id == "mixin"){
                switch(rule.idx.length){
                    case 0:
                        throw new Error("Incorrect mixin syntax");
                    case 1: // no args
                        let name = rule.idx[0];
                        mixins[name] = rule.body;
                        break;
                    case 2: // args
                        break;
                    default:
                        break;
                }
            }

            return ["", mixins]

        }else{
            //will never reach here
            return ["", mixins];
        }
        
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

    replaceMixins(id, mixins){
        if(id in mixins){
            return mixins[id];
        }else{
            throw new Error(`Mixin ${id} undefined`)
        }
    }

    indent(){
        return " ".repeat(4);
    }


}

export default Generator