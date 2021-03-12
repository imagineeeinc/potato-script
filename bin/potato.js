//imports
const _error_list = require("./errors.js")._error_list
const TT = require("./tokens.js").TT
const stringWithArrows = require("./stringsWithArrows.js").stringWithArrows

//constans

const DIGITS = '0123456789'

//error
class Error {
    constructor(error_num, details, startpos, endpos) {
        this.error_num = error_num
        this.detatils = details
        this.startpos = startpos
        this.endpos = endpos
    }

    asString() {
        if (typeof this.error_num == 'number') {
            var num = this.error_num
            return qError(`[ ${num}: `+_error_list[num]+']', this.detatils, this.startpos, this.endpos)
        } else if (typeof this.error_num == 'string') {
            return qError('[ '+this.error_num+']', this.detatils, this.startpos, this.endpos)
        } else {
            return qError('[ '+this.error_num+']', this.detatils, this.startpos, this.endpos)
        }
    }
}
function invalidChar(char, startpos, endpos) {
    var er = new Error(2, `'${char}' is not a integer or a floating point number`, startpos, endpos)
    return er.asString()
}
function qError(error_name, details, startpos, endpos, fn, ftxt) {
    var pos
    if (startpos != null ||pos != null) {
        pos = `\n(${startpos.fn}:${startpos.ln + 1}:${startpos.idx})`
    } else if (startpos == null || pos == null) {
        pos = ``
    } else {
        error_name = 'Error positon not provided'
        details = 'looks like no error position was given, please conact developer, with version number (to get current version type: \'potato ver\''
    }
    var result = '\n' + stringWithArrows(startpos.fntxt, startpos, endpos)
    result += '\n' + pos
    result += `${error_name}: ${details}`
    return result
}
//position
class Position {
    constructor(idx, ln, col, fn, ftxt) {
        this.idx = idx
        this.ln = ln
        this.col = col
        this.fn = fn
        this.fntxt = ftxt
    }
    advance(cur_char) {
        this.idx += 1
        this.col += 1

        if (cur_char == '\n') {
            this.ln += 1
            this.col = 0
        }
    }
    copy() {
        return new Position(this.idx, this.ln, this.col, this.fn, this.fntxt)
    }
}
//tokens
class Token {
    constructor(type_, value=null, startpos=null, endpos=null) {
        this.type = type_;
        this.value = value;

        if (startpos != null) {
            this.startpos = startpos.copy()
            this.endpos = startpos.copy()
            this.endpos.advance()
        }
        if (endpos != null) {
            this.endpos = endpos
        }

        if (this.value) {
            return `${this.type}: ${this.value}`
        }
        return `${this.type}`
    }
}
//lexar
class Lexar {
    constructor(text, fn) {
        this.text = text
        this.fn = fn
        this.pos = new Position(-1, 0, -1, fn, text)
        this.cur_char = null
        this.advance()
    }
    advance() {
        this.pos.advance(this.cur_char)
        this.cur_char = (this.pos.idx < this.text.length) ? this.text[this.pos.idx]:null
    }
    makeTokens() {
        if (this.text == "") {
            var er = new Error(3, `'${char}' no input was given`, null, null)
            return [[], er.asString()]
        }
        var tokens = []
        
        while (this.cur_char != null) {
            if ('\t'.includes(this.cur_char)) {
                this.advance()
            } else if (' '.includes(this.cur_char)) {
                this.advance()
            } else if (DIGITS.includes(this.cur_char)) {
                tokens.push(this.makeNumber())
            } else if (this.cur_char == "+") {
                tokens.push(new Token(TT.PLUS, "+"))
                this.advance()
            } else if (this.cur_char == "-") {
                tokens.push(new Token(TT.MINUS, "-"))
                this.advance()
            } else if (this.cur_char == "*") {
                tokens.push(new Token(TT.MUL, "*"))
                this.advance()
            } else if (this.cur_char == "/") {
                tokens.push(new Token(TT.DIV, "/"))
                this.advance()
            } else if (this.cur_char == "(") {
                tokens.push(new Token(TT.LPAREN, "("))
                this.advance()
            } else if (this.cur_char == ")") {
                tokens.push(new Token(TT.RPAREN, ")"))
                this.advance()
            } else {
                var char = this.cur_char
                var startpos = this.pos.copy()
                var er = new Error(2, `'${char}' is not a integer or a floating point number`, startpos, this.pos)
                //var er = new invalidChar(char, startpos, this.pos)
                //return [[], qError('Illegal Character', `[${this.pos}:${this.pos+1}]'${char}' is not a integer or a floating point number`)]
                this.advance()
                return [[], er.asString()]
            }
        }
        return [tokens, null]
    }
    makeNumber() {
        var num_str = ''
        var dot_count = 0
        var digs = DIGITS + '.'
        while (digs.includes(this.cur_char)) {
            if (this.cur_char == '.') {
                if (dot_count == 1) {} else {dot_count += 1}
                num_str += '.'
            } else {
                //TODO: number not coming
                num_str += this.cur_char
            }
            this.advance()
        }
        if (dot_count == 0) {
            return new Token(TT.INT, parseInt(num_str))
        } else {
            return new Token(TT.FLOAT, parseFloat(num_str))
        }
    }
}
//nodes
class NumberNode {
    constructor(tok) {
        this.tok = tok
    }
    _repr() {
        return this.tok
    }
}
class BinOpNode {
    constructor(left_node, op_token, right_node) {
        this.left_n = left_node
        this.opToken = op_token
        this.right_n = right_node
    }
    _repr() {
        return `(${this.left_n}, ${this.opToken}, ${this.right_n})`
    }
}
//parser result
class ParseResult {
    constructor() {
        
    }
}
//parser
class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.tok_idx = -1
        this.advance()
    }
    advance() {
        this.tok_idx += 1
        if (this.tok_idx < this.tokens[0].length) {
            this.cur_tok = this.tokens[0][this.tok_idx]
        }
        return this.cur_tok
    }
    parse() {
        var res = this.expr()
        return res
    }
    factor() {
        var tok = this.cur_tok
        if (tok.type == TT.INT || tok.type == TT.FLOAT) {
            this.advance()
            return new NumberNode(tok)
        }
    }
    term() {
        var left = this.factor()
        while (this.cur_tok.type == TT.MUL || this.cur_tok.type == TT.DIV) {
            var op_tok = this.cur_tok
            this.advance()
            var right = this.factor()
            left = new BinOpNode(left, op_tok, right)
        }
        return left
        //var ops = this.Bin_Ops(thi.factor, [TT.MUL, TT.DIV])
        //return ops
    }
    expr() {
        var left = this.term()
        while (this.cur_tok.type == TT.PLUS || this.cur_tok.type == TT.MINUS) {
            var op_tok = this.cur_tok
            this.advance()
            var right = this.term()
            left = new BinOpNode(left, op_tok, right)
        }
        return left
        //var ops = this.Bin_Ops(this.term(this), [TT.PLUS, TT.MINUS])
        //return ops
    }
    
    Bin_Ops(func, ops) {
        var left = func(this)
        while (this.cur_tok.type == ops[0] || this.cur_tok.type == ops[1]) {
            var op_tok = this.cur_tok
            this.advance()
            var right = func()
            left = new BinOpNode(left, op_tok, right)
        }
        return left
    }
}
//run
function run(text, fn) {
    //generate tokens
    var lexar = new Lexar(text, fn)
    var tokens = lexar.makeTokens()
    //remove this\/
    if (tokens[1] != null) {
        return [null, tokens[1]]
    }
    //generate ast
    var parser = new Parser(tokens)
    var ast = parser.parse()
    //to this /\ for normal lexar
    return ast//JSON.stringify(ast)//<= replace ast with tokens
}
//underscores
function _() {
    return "_"
}
//extras
function print(text) {
    return console.log(text)
}
//exports
module.exports = {
    _,
    Token,
    Lexar,
    Error,
    run,
    print
}