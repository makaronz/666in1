/**
 * PL Language Lexer
 * Tokenizes PL source code into tokens for parsing
 */

export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
  BOOLEAN = 'BOOLEAN',

  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  MODULO = 'MODULO',
  POWER = 'POWER',

  // Comparison
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN = 'GREATER_THAN',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER_EQUAL = 'GREATER_EQUAL',

  // Logical
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',

  // Assignment
  ASSIGN = 'ASSIGN',
  PLUS_ASSIGN = 'PLUS_ASSIGN',
  MINUS_ASSIGN = 'MINUS_ASSIGN',

  // Delimiters
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  LBRACKET = 'LBRACKET',
  RBRACKET = 'RBRACKET',
  COMMA = 'COMMA',
  DOT = 'DOT',
  COLON = 'COLON',
  SEMICOLON = 'SEMICOLON',
  ARROW = 'ARROW',

  // Keywords
  IF = 'IF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FOR = 'FOR',
  FUNCTION = 'FUNCTION',
  RETURN = 'RETURN',
  VAR = 'VAR',
  CONST = 'CONST',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  SWITCH = 'SWITCH',
  CASE = 'CASE',
  DEFAULT = 'DEFAULT',

  // Special
  EOF = 'EOF',
  NEWLINE = 'NEWLINE',
  COMMENT = 'COMMENT'
}

export interface Token {
  type: TokenType
  value: any
  line: number
  column: number
}

export class Lexer {
  private source: string
  private position: number = 0
  private line: number = 1
  private column: number = 1
  private readonly keywords: Map<string, TokenType>

  constructor(source: string) {
    this.source = source
    this.keywords = new Map([
      ['if', TokenType.IF],
      ['else', TokenType.ELSE],
      ['while', TokenType.WHILE],
      ['for', TokenType.FOR],
      ['function', TokenType.FUNCTION],
      ['return', TokenType.RETURN],
      ['var', TokenType.VAR],
      ['const', TokenType.CONST],
      ['true', TokenType.TRUE],
      ['false', TokenType.FALSE],
      ['null', TokenType.NULL],
      ['break', TokenType.BREAK],
      ['continue', TokenType.CONTINUE],
      ['switch', TokenType.SWITCH],
      ['case', TokenType.CASE],
      ['default', TokenType.DEFAULT],
      ['and', TokenType.AND],
      ['or', TokenType.OR],
      ['not', TokenType.NOT]
    ])
  }

  tokenize(): Token[] {
    const tokens: Token[] = []

    while (this.position < this.source.length) {
      const token = this.getNextToken()
      if (token.type !== TokenType.COMMENT) {
        tokens.push(token)
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: null,
      line: this.line,
      column: this.column
    })

    return tokens
  }

  private getNextToken(): Token {
    this.skipWhitespace()

    if (this.position >= this.source.length) {
      return {
        type: TokenType.EOF,
        value: null,
        line: this.line,
        column: this.column
      }
    }

    const char = this.source[this.position]

    // Newline
    if (char === '\n') {
      const token = {
        type: TokenType.NEWLINE,
        value: '\n',
        line: this.line,
        column: this.column
      }
      this.position++
      this.line++
      this.column = 1
      return token
    }

    // String
    if (char === '"' || char === "'") {
      return this.readString()
    }

    // Number
    if (this.isDigit(char)) {
      return this.readNumber()
    }

    // Identifier or keyword
    if (this.isLetter(char) || char === '_') {
      return this.readIdentifier()
    }

    // Comments
    if (char === '/' && this.peek() === '/') {
      return this.readComment()
    }

    // Multi-character operators
    if (char === '=' && this.peek() === '=') {
      const token = this.createToken(TokenType.EQUAL, '==')
      this.position += 2
      this.column += 2
      return token
    }

    if (char === '!' && this.peek() === '=') {
      const token = this.createToken(TokenType.NOT_EQUAL, '!=')
      this.position += 2
      this.column += 2
      return token
    }

    if (char === '<' && this.peek() === '=') {
      const token = this.createToken(TokenType.LESS_EQUAL, '<=')
      this.position += 2
      this.column += 2
      return token
    }

    if (char === '>' && this.peek() === '=') {
      const token = this.createToken(TokenType.GREATER_EQUAL, '>=')
      this.position += 2
      this.column += 2
      return token
    }

    if (char === '-' && this.peek() === '>') {
      const token = this.createToken(TokenType.ARROW, '->')
      this.position += 2
      this.column += 2
      return token
    }

    if (char === '+' && this.peek() === '=') {
      const token = this.createToken(TokenType.PLUS_ASSIGN, '+=')
      this.position += 2
      this.column += 2
      return token
    }

    if (char === '-' && this.peek() === '=') {
      const token = this.createToken(TokenType.MINUS_ASSIGN, '-=')
      this.position += 2
      this.column += 2
      return token
    }

    // Single-character tokens
    const singleCharTokens: { [key: string]: TokenType } = {
      '+': TokenType.PLUS,
      '-': TokenType.MINUS,
      '*': TokenType.MULTIPLY,
      '/': TokenType.DIVIDE,
      '%': TokenType.MODULO,
      '^': TokenType.POWER,
      '=': TokenType.ASSIGN,
      '<': TokenType.LESS_THAN,
      '>': TokenType.GREATER_THAN,
      '(': TokenType.LPAREN,
      ')': TokenType.RPAREN,
      '{': TokenType.LBRACE,
      '}': TokenType.RBRACE,
      '[': TokenType.LBRACKET,
      ']': TokenType.RBRACKET,
      ',': TokenType.COMMA,
      '.': TokenType.DOT,
      ':': TokenType.COLON,
      ';': TokenType.SEMICOLON
    }

    if (char in singleCharTokens) {
      const token = this.createToken(singleCharTokens[char], char)
      this.position++
      this.column++
      return token
    }

    throw new Error(`Unexpected character '${char}' at line ${this.line}, column ${this.column}`)
  }

  private readString(): Token {
    const quote = this.source[this.position]
    const startLine = this.line
    const startColumn = this.column
    this.position++
    this.column++

    let value = ''

    while (this.position < this.source.length && this.source[this.position] !== quote) {
      if (this.source[this.position] === '\\') {
        this.position++
        this.column++
        if (this.position < this.source.length) {
          const escaped = this.source[this.position]
          const escapeChars: { [key: string]: string } = {
            'n': '\n',
            't': '\t',
            'r': '\r',
            '\\': '\\',
            '"': '"',
            "'": "'"
          }
          value += escapeChars[escaped] || escaped
        }
      } else {
        value += this.source[this.position]
        if (this.source[this.position] === '\n') {
          this.line++
          this.column = 1
        } else {
          this.column++
        }
      }
      this.position++
    }

    if (this.position >= this.source.length) {
      throw new Error(`Unterminated string at line ${startLine}, column ${startColumn}`)
    }

    this.position++ // Skip closing quote
    this.column++

    return {
      type: TokenType.STRING,
      value,
      line: startLine,
      column: startColumn
    }
  }

  private readNumber(): Token {
    const startLine = this.line
    const startColumn = this.column
    let value = ''

    while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
      value += this.source[this.position]
      this.position++
      this.column++
    }

    // Decimal part
    if (this.position < this.source.length && this.source[this.position] === '.') {
      value += '.'
      this.position++
      this.column++

      while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
        value += this.source[this.position]
        this.position++
        this.column++
      }
    }

    // Exponential part
    if (this.position < this.source.length && (this.source[this.position] === 'e' || this.source[this.position] === 'E')) {
      value += this.source[this.position]
      this.position++
      this.column++

      if (this.position < this.source.length && (this.source[this.position] === '+' || this.source[this.position] === '-')) {
        value += this.source[this.position]
        this.position++
        this.column++
      }

      while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
        value += this.source[this.position]
        this.position++
        this.column++
      }
    }

    return {
      type: TokenType.NUMBER,
      value: parseFloat(value),
      line: startLine,
      column: startColumn
    }
  }

  private readIdentifier(): Token {
    const startLine = this.line
    const startColumn = this.column
    let value = ''

    while (this.position < this.source.length && (this.isLetter(this.source[this.position]) || this.isDigit(this.source[this.position]) || this.source[this.position] === '_')) {
      value += this.source[this.position]
      this.position++
      this.column++
    }

    const keyword = this.keywords.get(value.toLowerCase())
    const type = keyword || TokenType.IDENTIFIER

    return {
      type,
      value,
      line: startLine,
      column: startColumn
    }
  }

  private readComment(): Token {
    const startLine = this.line
    const startColumn = this.column
    this.position += 2 // Skip //
    this.column += 2

    let value = '//'

    while (this.position < this.source.length && this.source[this.position] !== '\n') {
      value += this.source[this.position]
      this.position++
      this.column++
    }

    return {
      type: TokenType.COMMENT,
      value,
      line: startLine,
      column: startColumn
    }
  }

  private skipWhitespace(): void {
    while (this.position < this.source.length) {
      const char = this.source[this.position]
      if (char === ' ' || char === '\t' || char === '\r') {
        this.position++
        this.column++
      } else {
        break
      }
    }
  }

  private peek(): string {
    if (this.position + 1 < this.source.length) {
      return this.source[this.position + 1]
    }
    return ''
  }

  private isLetter(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9'
  }

  private createToken(type: TokenType, value: any): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column
    }
  }
}
