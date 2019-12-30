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
                        let ret = this.generateAtRule(rule, env, mixins, "");
                        mixins = ret[1];
                        return ret[0].outer;
                    default:
                        break;
                }

            })(rule.name);

        })

        return output;
    }

    generateStyle(rule, env, mixins) {
        let indent = this.indent();
        let currentEnv = { ...env };
        let currentMixins = { ...mixins };
        let currentDecls = [...rule.decls];

        let selector = rule.id.join(" ");

        let currentStr = "";
        let nestedStr = "";


        for (let i = 0; i < currentDecls.length; i++) {
            let r = currentDecls[i];
            switch (r.name) {
                case "var":
                    currentEnv = this.generateVar(r, currentEnv);
                    break;
                case "comment":
                    currentStr += this.generateComment(r);
                case "decl":
                    currentStr += this.generateDeclaration(r, currentEnv);
                    break;
                case "at":
                    let ret = this.generateAtRule(r, currentEnv, currentMixins, selector);
                    currentMixins = ret[1];
                    currentStr += ret[0].inner;
                    nestedStr += ret[0].outer;
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

        if (currentStr.length != 0) {
            ret += `${selector} {` +
                `${currentStr}` +
                `\n}\n\n`
        }

        if (nestedStr.length != 0) {
            ret += nestedStr;
        }

        return ret;

    }

    generateDeclaration(rule, env) {
        return `\n${this.indent()}${rule.id}: ${this.replaceVars(rule.value, env)};`
    }

    generateComment(rule) {
        return `/*${rule.value}*/`
    }

    generateAtRule(rule, env, mixins, parent) {
        if (rule.type == "inline") {

            if (rule.id == "include") {

                let mix = this.replaceMixin(rule.value[0], mixins);

                let currentMixins = { ...mixins }, currentEnv = { ...env };
                let currentStr = "", nestedStr = "";

                // mixin args

                currentEnv = this.replaceArgs(currentEnv, mix.args, rule.args);


                mix.body.forEach(statement => {
                    switch (statement.name) {
                        case "var":
                            currentEnv = this.generateVar(statement, currentEnv);
                            break;
                        case "comment":
                            currentStr += this.generateComment(statement);
                        case "decl":
                            currentStr += this.generateDeclaration(statement, currentEnv);
                            break;
                        case "at":
                            let ret = this.generateAtRule(statement, currentEnv, currentMixins, parent);
                            currentMixins = ret[1];
                            currentStr += ret[0].inner;
                            nestedStr += ret[0].outer;
                            break;
                        case "style":
                            statement.id.unshift(parent);
                            nestedStr += this.generateStyle(statement, currentEnv, currentMixins);
                            break;
                        default:
                            break;
                    }
                })

                return [{ inner: currentStr, outer: nestedStr }, mixins];

            }


            return [
                {
                    inner: `\n${this.indent()}@${rule.id} ${rule.value.join("")};`,
                    outer: ""
                },
                mixins
            ]
        } else if (rule.type == "block") {

            // @mixin

            if (rule.id == "mixin") {
                let name = rule.idx[0];
                mixins[name] = {
                    body: rule.body,
                    args: rule.args
                };
            }

            return [{ inner: "", outer: "" }, mixins]

        } else {
            //will never reach here
            return [{ inner: "", outer: "" }, mixins];
        }

    }


    generateVar(rule, env) {
        env[rule.id] = this.replaceVars(rule.value, env);
        return env;
    }

    // replace vars with value in declaration
    replaceVars(lst, env) {
        return lst.map((d) => {
            if (d.startsWith("$")) {

                let id = d.substring(1);

                if (id in env) {
                    return env[id];
                } else {
                    throw new Error(`Variable "${id}" undefined`)
                }

            } else {
                return d;
            }
        }).join(" ");
    }

    replaceMixin(id, mixins) {
        if (id in mixins) {
            return mixins[id];
        } else {
            throw new Error(`Mixin ${id} undefined`)
        }
    }

    replaceArgs(env, args, rargs){
        args.forEach((arg, index) => {
            if(arg.startsWith("$")){
                arg = arg.substring(1);
            }

            if(rargs[index]){
                env[arg] = rargs[index];
            }else{
                throw new Error(`Missing argument $${arg}`)
            }
            

        })

        return env;
    }

    indent() {
        return " ".repeat(4);
    }


}

export default Generator