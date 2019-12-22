class Generator {

    constructor(ast) {
        this.ast = ast;
        this.vars = {};
    }

    generateString() {
        let output = "";

        this.ast.forEach(rule => {

            output += ((name) => {

                switch (name) {
                    case "var":
                        return this.generateVar(rule);
                        break;
                    case "style":
                        return this.generateStyle(rule);
                        break;
                    case "at":
                        return this.generateAtRule(rule);
                        break;
                    default:
                        break;
                }

            })(rule.name);

        })

        return output;
    }

    generateStyle(rule,){
        let indent = this.indent();
        let selector = rule.id.join(" ");

        // generate declarations
        let decls = rule.decls.filter(d => d.name == "decl");
        let declsStr = decls.reduce((s, d) => (
            s + `${indent+indent}${d.id}: ${this.replaceVars(d.value)};\n`
        ), "")

        // generate nested styles
        let nested = rule.decls.filter(d => d.name == "style");
        let nestedStr = nested.reduce((s, n) => {
            n.id.unshift(selector);
            return s + this.generateStyle(n);
        }, "")
        
        let ret = "";

        if(decls.length != 0){
            ret += `${indent}${selector} {\n` +
            `${declsStr}` +
            `${indent}}\n\n`
        }

        if(nested.length != 0){
            ret += nestedStr;
        }

        return ret;

    }

    generateAtRule(rule){

    }

    generateVar(rule){
        this.vars[rule.id] = this.replaceVars(rule.value);
        return "";
    }

    // replace vars with value in declaration
    replaceVars(lst){
        return lst.map((d) => {
            if(d.startsWith("$")){

                let id = d.substring(1);

                if(id in this.vars){
                    return this.vars[id];
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