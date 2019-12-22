// one {
//     two{
//         width: 30px;
//     }

//     three {
//         height: 40px;
//     }
// }

let ast = [
    {
        name: "style",
        id: ["one"],
        decls: [
            {
                name: "style",
                id: "two",
                decls: [
                    {
                        name: "decl",
                        id: "width", 
                        value: ["30px"]
                    }
                ]
            },
            {
                name: "style",
                id: "three",
                decls: [
                    {
                        name: "decl",
                        id: "height", 
                        value: ["40px"]
                    }
                ]
            }
        ]
    }
]