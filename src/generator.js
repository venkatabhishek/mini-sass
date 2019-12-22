class Generator {

    constructor(ast) {
        this.ast = ast;
        this.vars = {};
    }

    generateString() {
        let output = "";
        let level = 0;

        this.ast.forEach(rule => {

            output += ((name) => {

                switch (name) {
                    case "var":
                        return this.generateVar(rule);
                        break;
                    case "style":
                        return this.generateStyle(rule, level);
                        break;
                    case "at":
                        return this.generateAtRule();
                        break;
                    default:
                        break;
                }

            })(rule.name);

        })

        return output;
    }

    generateStyle(rule, level){
        let indent = this.indent(level);
        let nestedIndent = this.indent(level+1);
        let selector = rule.id.join(" ");

        let decls = rule.decls.filter(d => d.name == "decl");
        let declsStr = decls.reduce((s, d) => (
            s + `${nestedIndent}${d.id}: ${this.replaceVars(d.value)};\n`
        ), "")

        let nested = rule.decls.filter(d => d.name == "style");
        let nestedStr = nested.reduce((s, n) => {
            n.id.unshift(selector);
            return s + this.generateStyle(n, level);
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

    generateDeclaration(){
        
    }

    generateAtRule(){}

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

    indent(level){
        return " ".repeat(4).repeat(level);
    }


}

export default Generator