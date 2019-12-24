# mini-sass

An attempt at building a scss-like compiler in Javascript. [SCSS/SASS](https://sass-lang.com/) is a superset of CSS that provides additional functionality like variables and functions.

### Features

* Variables

```
$var: 20px;

div{
    width: $var;
}
```

* Nested Styles

```
div {
    ul{
        background: green;
    }
}
```

* Mixins

```
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

div{
    @include reset-list;
}
```

### Install

For CLI:

```npm install mini-sass -g```

For programmatic use:

```npm install mini-sass```

### Usage

#### CLI:

```
mini-sass [options] <files...>
```

If no input files are specified, mini-sass will read from STDIN. If no flags are specified, mini-sass will print to STDOUT. 

#### Options

```
Options:
  -o, --output <file>  Output file (default: STDOUT)
  -s, --separate       Generate separate output file for each input
```

When the `-o` flag is present, result of compiling all input files will be concatenated into a single file.

When the `-s` flag is present, each file compiled will be put into its own file terminated with the `.css` extension


#### Examples

```mini-sass myfile.scss -o output.css```

Will generate a single file `output.css`

```mini-sass myfile1.scss myfile2.scss -s```

Will generate two files: `myfile1.css` and `myfile2.css` corresponding to each input.


#### API References

Assuming proper installation, load as follows:

```var miniSass = require("mini-sass");```

There is a single high-level function `compile` that takes a SCSS string and returns the compiled CSS string:

```
var scss = "$var: 2px; div { width: $var; }"
var css = miniSass.compile(scss);
console.log(css) // "div { \n width: 2px; \n }"
 ```

### IMPORTANT

This compiler is not entirely rigorous and will most likely fail in certain cases. Specficially, the following are not supported out-right:

* Mixins do not support arguments


### How it works

First, a lexical analysis is performed, converting source code into a stream of tokens, such as IDs, brackets, etc. This corresponds to `src/lexer.js`

Then a parser converts the stream of tokens into an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST), a data structure that represents the input as a tree based on a [Context-Free Grammer](https://en.wikipedia.org/wiki/Context-free_grammar). More accurately, the parser gets the next token in the stream by calling the `token()` method. The parser and corresponding grammar exist in `src/parser.js`

Finally, the generator takes the AST and produces an output string based on various rules (i.e. the features listed above). This corresponds to `src/generator.js`

### TO DO

* Add support for mixin arguments
* Interpolation
* Partials and extended @import
* Extend API to allow retrieval of AST and tokens 