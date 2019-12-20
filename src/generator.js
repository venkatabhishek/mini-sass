class Generator {

    constructor(ast) {
        this.ast = ast;
        this.vars = [];
    }

    generateString() {
        let output = "";
        let level = 0;

        this.ast.forEach(rule => {

            output += ((name) => {

                switch (name) {
                    case "var":
                        return this.generateVar();
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

            })(rule.name)+"\n";

        })

        return output;
    }

    generateStyle(rule, level){
        let indent = this.indent(level);
        let nestedIndent = this.indent(level+1);
        let selector = rule.id.join(" ");
        let decls = rule.decls.reduce((s, decl) => (
            s + `${nestedIndent}${decl.name}: ${decl.value.join(" ")};\n` 
        ), "")

        return `${indent}${selector} {\n` +
            `${decls}` +
        `${indent}}\n`

    }

    generateAtRule(){}

    generateVar(){}

    generateFile(filename) {
        
    }

    indent(level){
        return " ".repeat(4).repeat(level);
    }


}

export default Generator