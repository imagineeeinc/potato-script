//constans

const DIGITS = '0123456789'

//error

class Error {
    constructor(error_name, details) {
        this.error_name = error_name
        this.detatils = details
    }

    asString() {
        var result = this.error_name + ': ' + this.details
        return result
    }
}

class illegalCharError {
    constructor(details) {
        this.det = details
    }
    string() {
        return qError('Illegal Character', `${this.det} is not a integer or a floating point number`)
    }
}
function qError(error_name, details) {
    return `${error_name}: ${details}`
}
//tokens

var TT_INT		= 'INT'
var TT_FLOAT    = 'FLOAT'
var TT_PLUS     = 'PLUS'
var TT_MINUS    = 'MINUS'
var TT_MUL      = 'MUL'
var TT_DIV      = 'DIV'
var TT_LPAREN   = 'LPAREN'
var TT_RPAREN   = 'RPAREN'


class Token {
    constructor(type_, value=null) {
        this.type = type_;
        this.value = value;

        if (this.value) {
            return `${this.type}: ${this.value}`
        }
        return `${this.type}`
    }
}

//lexar

class Lexar {
    constructor(text) {
        this.text = text;
        this.pos = -1
        this.cur_char = null
        this.advance()
    }
    advance() {
        this.pos += 1
        this.cur_char = (this.pos < this.text.length) ? this.text[this.pos]:null
    }
    makeTokens() {
        var tokens = []
        
        while (this.cur_char != null) {
            if ('\t'.includes(this.cur_char)) {
            } else if (DIGITS.includes(this.cur_char)) {
                tokens.push(this.makeNumber())
            } else if (this.cur_char == "+") {
                tokens.push(new Token(TT_PLUS, "+"))
                this.advance()
            } else if (this.cur_char == "-") {
                tokens.push(new Token(TT_MINUS, "-"))
                this.advance()
            } else if (this.cur_char == "*") {
                tokens.push(new Token(TT_MUL, "*"))
                this.advance()
            } else if (this.cur_char == "/") {
                tokens.push(new Token(TT_DIV, "/"))
                this.advance()
            } else if (this.cur_char == "(") {
                tokens.push(new Token(TT_LPAREN, "("))
                this.advance()
            } else if (this.cur_char == ")") {
                tokens.push(new Token(TT_RPAREN, ")"))
                this.advance()
            } else {
                var char = this.cur_char
                var er = new illegalCharError(`'${char}'`)
                //return [[], qError('Illegal Character', `[${this.pos}:${this.pos+1}]'${char}' is not a integer or a floating point number`)]
                return [[], er.string()]
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
            return new Token(TT_INT, parseInt(num_str))
        } else {
            return new Token(TT_FLOAT, parseFloat(num_str))
        }
    }
}

function run(text) {
    var lexar = new Lexar(text)
    var tokens = lexar.makeTokens()
    return JSON.stringify(tokens)
}

function _() {
    return "_"
}

module.exports = {
    _,
    Token,
    Lexar,
    illegalCharError,
    Error,
    run,
    print
}

function print(text) {
    return console.log(text)
}