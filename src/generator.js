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
        let decls = rule.decls.reduce((s, decl) => (
            s + `${nestedIndent}${decl.name}: ${this.replaceVars(decl.value)};\n` 
        ), "")

        return `${indent}${selector} {\n` +
            `${decls}` +
        `${indent}}\n\n`

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