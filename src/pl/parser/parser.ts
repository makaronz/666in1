/**
 * PL Language Parser
 * Parses tokens into an Abstract Syntax Tree (AST)
 */

import { Token, TokenType } from './lexer'

export enum NodeType {
  // Statements
  Program = 'Program',
  Block = 'Block',
  ExpressionStatement = 'ExpressionStatement',
  IfStatement = 'IfStatement',
  WhileStatement = 'WhileStatement',
  ForStatement = 'ForStatement',
  ReturnStatement = 'ReturnStatement',
  BreakStatement = 'BreakStatement',
  ContinueStatement = 'ContinueStatement',
  VariableDeclaration = 'VariableDeclaration',
  FunctionDeclaration = 'FunctionDeclaration',
  SwitchStatement = 'SwitchStatement',
  CaseStatement = 'CaseStatement',

  // Expressions
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  AssignmentExpression = 'AssignmentExpression',
  LogicalExpression = 'LogicalExpression',
  CallExpression = 'CallExpression',
  MemberExpression = 'MemberExpression',
  Identifier = 'Identifier',
  Literal = 'Literal',
  ArrayExpression = 'ArrayExpression',
  ObjectExpression = 'ObjectExpression',
  Property = 'Property',
  ArrowFunctionExpression = 'ArrowFunctionExpression',
  ConditionalExpression = 'ConditionalExpression'
}

export interface ASTNode {
  type: NodeType
  line: number
  column: number
}

export interface ProgramNode extends ASTNode {
  type: NodeType.Program
  body: StatementNode[]
}

export interface BlockNode extends ASTNode {
  type: NodeType.Block
  body: StatementNode[]
}

export interface ExpressionStatementNode extends ASTNode {
  type: NodeType.ExpressionStatement
  expression: ExpressionNode
}

export interface IfStatementNode extends ASTNode {
  type: NodeType.IfStatement
  test: ExpressionNode
  consequent: StatementNode
  alternate?: StatementNode
}

export interface WhileStatementNode extends ASTNode {
  type: NodeType.WhileStatement
  test: ExpressionNode
  body: StatementNode
}

export interface ForStatementNode extends ASTNode {
  type: NodeType.ForStatement
  init?: VariableDeclarationNode | ExpressionNode
  test?: ExpressionNode
  update?: ExpressionNode
  body: StatementNode
}

export interface ReturnStatementNode extends ASTNode {
  type: NodeType.ReturnStatement
  argument?: ExpressionNode
}

export interface BreakStatementNode extends ASTNode {
  type: NodeType.BreakStatement
}

export interface ContinueStatementNode extends ASTNode {
  type: NodeType.ContinueStatement
}

export interface VariableDeclarationNode extends ASTNode {
  type: NodeType.VariableDeclaration
  kind: 'var' | 'const'
  declarations: VariableDeclarator[]
}

export interface VariableDeclarator {
  id: IdentifierNode
  init?: ExpressionNode
}

export interface FunctionDeclarationNode extends ASTNode {
  type: NodeType.FunctionDeclaration
  id: IdentifierNode
  params: IdentifierNode[]
  body: BlockNode
}

export interface SwitchStatementNode extends ASTNode {
  type: NodeType.SwitchStatement
  discriminant: ExpressionNode
  cases: CaseStatementNode[]
}

export interface CaseStatementNode extends ASTNode {
  type: NodeType.CaseStatement
  test?: ExpressionNode
  consequent: StatementNode[]
}

export interface BinaryExpressionNode extends ASTNode {
  type: NodeType.BinaryExpression
  operator: string
  left: ExpressionNode
  right: ExpressionNode
}

export interface UnaryExpressionNode extends ASTNode {
  type: NodeType.UnaryExpression
  operator: string
  argument: ExpressionNode
  prefix: boolean
}

export interface AssignmentExpressionNode extends ASTNode {
  type: NodeType.AssignmentExpression
  operator: string
  left: ExpressionNode
  right: ExpressionNode
}

export interface LogicalExpressionNode extends ASTNode {
  type: NodeType.LogicalExpression
  operator: string
  left: ExpressionNode
  right: ExpressionNode
}

export interface CallExpressionNode extends ASTNode {
  type: NodeType.CallExpression
  callee: ExpressionNode
  arguments: ExpressionNode[]
}

export interface MemberExpressionNode extends ASTNode {
  type: NodeType.MemberExpression
  object: ExpressionNode
  property: ExpressionNode
  computed: boolean
}

export interface IdentifierNode extends ASTNode {
  type: NodeType.Identifier
  name: string
}

export interface LiteralNode extends ASTNode {
  type: NodeType.Literal
  value: any
}

export interface ArrayExpressionNode extends ASTNode {
  type: NodeType.ArrayExpression
  elements: ExpressionNode[]
}

export interface ObjectExpressionNode extends ASTNode {
  type: NodeType.ObjectExpression
  properties: PropertyNode[]
}

export interface PropertyNode extends ASTNode {
  type: NodeType.Property
  key: ExpressionNode
  value: ExpressionNode
  kind: 'init' | 'get' | 'set'
}

export interface ArrowFunctionExpressionNode extends ASTNode {
  type: NodeType.ArrowFunctionExpression
  params: IdentifierNode[]
  body: BlockNode | ExpressionNode
}

export interface ConditionalExpressionNode extends ASTNode {
  type: NodeType.ConditionalExpression
  test: ExpressionNode
  alternate: ExpressionNode
  consequent: ExpressionNode
}

export type StatementNode =
  | BlockNode
  | ExpressionStatementNode
  | IfStatementNode
  | WhileStatementNode
  | ForStatementNode
  | ReturnStatementNode
  | BreakStatementNode
  | ContinueStatementNode
  | VariableDeclarationNode
  | FunctionDeclarationNode
  | SwitchStatementNode

export type ExpressionNode =
  | BinaryExpressionNode
  | UnaryExpressionNode
  | AssignmentExpressionNode
  | LogicalExpressionNode
  | CallExpressionNode
  | MemberExpressionNode
  | IdentifierNode
  | LiteralNode
  | ArrayExpressionNode
  | ObjectExpressionNode
  | ArrowFunctionExpressionNode
  | ConditionalExpressionNode

export class Parser {
  private tokens: Token[]
  private position: number = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): ProgramNode {
    const statements: StatementNode[] = []

    while (!this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) {
        statements.push(stmt)
      }
    }

    return {
      type: NodeType.Program,
      body: statements,
      line: 1,
      column: 1
    }
  }

  private statement(): StatementNode | null {
    // Skip newlines between statements
    while (this.match(TokenType.NEWLINE)) {
      // continue
    }

    if (this.check(TokenType.IF)) return this.ifStatement()
    if (this.check(TokenType.WHILE)) return this.whileStatement()
    if (this.check(TokenType.FOR)) return this.forStatement()
    if (this.check(TokenType.RETURN)) return this.returnStatement()
    if (this.check(TokenType.BREAK)) return this.breakStatement()
    if (this.check(TokenType.CONTINUE)) return this.continueStatement()
    if (this.check(TokenType.VAR) || this.check(TokenType.CONST)) return this.variableDeclaration()
    if (this.check(TokenType.FUNCTION)) return this.functionDeclaration()
    if (this.check(TokenType.SWITCH)) return this.switchStatement()

    const expr = this.expression()
    return {
      type: NodeType.ExpressionStatement,
      expression: expr,
      line: expr.line,
      column: expr.column
    }
  }

  private ifStatement(): IfStatementNode {
    this.consume(TokenType.IF, 'Expect "if"')
    this.consume(TokenType.LPAREN, 'Expect "(" after "if"')
    const test = this.expression()
    this.consume(TokenType.RPAREN, 'Expect ")" after condition')
    const consequent = this.statement()
    let alternate: StatementNode | undefined

    if (this.match(TokenType.ELSE)) {
      alternate = this.statement()
    }

    return {
      type: NodeType.IfStatement,
      test,
      consequent,
      alternate,
      line: test.line,
      column: test.column
    }
  }

  private whileStatement(): WhileStatementNode {
    this.consume(TokenType.WHILE, 'Expect "while"')
    this.consume(TokenType.LPAREN, 'Expect "(" after "while"')
    const test = this.expression()
    this.consume(TokenType.RPAREN, 'Expect ")" after condition')
    const body = this.statement()

    return {
      type: NodeType.WhileStatement,
      test,
      body,
      line: test.line,
      column: test.column
    }
  }

  private forStatement(): ForStatementNode {
    this.consume(TokenType.FOR, 'Expect "for"')
    this.consume(TokenType.LPAREN, 'Expect "(" after "for"')

    let init: VariableDeclarationNode | ExpressionNode | undefined
    if (this.match(TokenType.SEMICOLON)) {
      init = undefined
    } else if (this.check(TokenType.VAR) || this.check(TokenType.CONST)) {
      init = this.variableDeclaration()
    } else {
      init = this.expression()
      this.consume(TokenType.SEMICOLON, 'Expect ";" after for loop initializer')
    }

    let test: ExpressionNode | undefined
    if (!this.check(TokenType.SEMICOLON)) {
      test = this.expression()
    }
    this.consume(TokenType.SEMICOLON, 'Expect ";" after for loop condition')

    let update: ExpressionNode | undefined
    if (!this.check(TokenType.RPAREN)) {
      update = this.expression()
    }
    this.consume(TokenType.RPAREN, 'Expect ")" after for clauses')

    const body = this.statement()

    return {
      type: NodeType.ForStatement,
      init,
      test,
      update,
      body,
      line: body.line,
      column: body.column
    }
  }

  private returnStatement(): ReturnStatementNode {
    const token = this.peek()
    this.consume(TokenType.RETURN, 'Expect "return"')
    let argument: ExpressionNode | undefined

    if (!this.check(TokenType.NEWLINE) && !this.check(TokenType.SEMICOLON)) {
      argument = this.expression()
    }

    return {
      type: NodeType.ReturnStatement,
      argument,
      line: token.line,
      column: token.column
    }
  }

  private breakStatement(): BreakStatementNode {
    const token = this.peek()
    this.consume(TokenType.BREAK, 'Expect "break"')
    return { type: NodeType.BreakStatement, line: token.line, column: token.column }
  }

  private continueStatement(): ContinueStatementNode {
    const token = this.peek()
    this.consume(TokenType.CONTINUE, 'Expect "continue"')
    return { type: NodeType.ContinueStatement, line: token.line, column: token.column }
  }

  private variableDeclaration(): VariableDeclarationNode {
    const token = this.peek()
    const kind = this.match(TokenType.VAR) ? 'var' : 'const'
    const declarations: VariableDeclarator[] = []

    do {
      const id = this.identifier()
      let init: ExpressionNode | undefined

      if (this.match(TokenType.ASSIGN)) {
        init = this.expression()
      }

      declarations.push({ id, init })
    } while (this.match(TokenType.COMMA))

    return {
      type: NodeType.VariableDeclaration,
      kind,
      declarations,
      line: token.line,
      column: token.column
    }
  }

  private functionDeclaration(): FunctionDeclarationNode {
    const token = this.peek()
    this.consume(TokenType.FUNCTION, 'Expect "function"')
    const id = this.identifier()

    this.consume(TokenType.LPAREN, 'Expect "(" after function name')
    const params: IdentifierNode[] = []

    if (!this.check(TokenType.RPAREN)) {
      do {
        params.push(this.identifier())
      } while (this.match(TokenType.COMMA))
    }

    this.consume(TokenType.RPAREN, 'Expect ")" after parameters')
    const body = this.block()

    return {
      type: NodeType.FunctionDeclaration,
      id,
      params,
      body,
      line: token.line,
      column: token.column
    }
  }

  private switchStatement(): SwitchStatementNode {
    const token = this.peek()
    this.consume(TokenType.SWITCH, 'Expect "switch"')
    this.consume(TokenType.LPAREN, 'Expect "(" after "switch"')
    const discriminant = this.expression()
    this.consume(TokenType.RPAREN, 'Expect ")" after switch value')
    this.consume(TokenType.LBRACE, 'Expect "{" after switch value')

    const cases: CaseStatementNode[] = []

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.CASE)) {
        const test = this.expression()
        this.consume(TokenType.COLON, 'Expect ":" after case value')
        const consequent: StatementNode[] = []

        while (!this.check(TokenType.CASE) && !this.check(TokenType.DEFAULT) && !this.check(TokenType.RBRACE)) {
          const stmt = this.statement()
          if (stmt) consequent.push(stmt)
        }

        cases.push({
          type: NodeType.CaseStatement,
          test,
          consequent,
          line: test.line,
          column: test.column
        })
      } else if (this.match(TokenType.DEFAULT)) {
        this.consume(TokenType.COLON, 'Expect ":" after default')
        const consequent: StatementNode[] = []

        while (!this.check(TokenType.CASE) && !this.check(TokenType.RBRACE)) {
          const stmt = this.statement()
          if (stmt) consequent.push(stmt)
        }

        cases.push({
          type: NodeType.CaseStatement,
          test: undefined,
          consequent,
          line: token.line,
          column: token.column
        })
      }
    }

    this.consume(TokenType.RBRACE, 'Expect "}" after switch cases')

    return {
      type: NodeType.SwitchStatement,
      discriminant,
      cases,
      line: token.line,
      column: token.column
    }
  }

  private block(): BlockNode {
    const token = this.peek()
    this.consume(TokenType.LBRACE, 'Expect "{"')
    const body: StatementNode[] = []

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) body.push(stmt)
    }

    this.consume(TokenType.RBRACE, 'Expect "}" after block')
    return {
      type: NodeType.Block,
      body,
      line: token.line,
      column: token.column
    }
  }

  private expression(): ExpressionNode {
    return this.assignment()
  }

  private assignment(): ExpressionNode {
    const expr = this.conditional()

    if (this.match(TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN)) {
      const operator = this.previous().value
      const value = this.assignment()

      return {
        type: NodeType.AssignmentExpression,
        operator,
        left: expr,
        right: value,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private conditional(): ExpressionNode {
    const expr = this.logicalOr()

    if (this.match(TokenType.IF)) {
      const test = this.expression()
      const consequent = this.expression()
      const alternate = expr

      return {
        type: NodeType.ConditionalExpression,
        test,
        consequent,
        alternate,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private logicalOr(): ExpressionNode {
    let expr = this.logicalAnd()

    while (this.match(TokenType.OR)) {
      const operator = this.previous().value
      const right = this.logicalAnd()

      expr = {
        type: NodeType.LogicalExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private logicalAnd(): ExpressionNode {
    let expr = this.equality()

    while (this.match(TokenType.AND)) {
      const operator = this.previous().value
      const right = this.equality()

      expr = {
        type: NodeType.LogicalExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private equality(): ExpressionNode {
    let expr = this.comparison()

    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value
      const right = this.comparison()

      expr = {
        type: NodeType.BinaryExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private comparison(): ExpressionNode {
    let expr = this.term()

    while (this.match(TokenType.GREATER_THAN, TokenType.GREATER_EQUAL, TokenType.LESS_THAN, TokenType.LESS_EQUAL)) {
      const operator = this.previous().value
      const right = this.term()

      expr = {
        type: NodeType.BinaryExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private term(): ExpressionNode {
    let expr = this.factor()

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value
      const right = this.factor()

      expr = {
        type: NodeType.BinaryExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private factor(): ExpressionNode {
    let expr = this.unary()

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.previous().value
      const right = this.unary()

      expr = {
        type: NodeType.BinaryExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private unary(): ExpressionNode {
    if (this.match(TokenType.NOT, TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous().value
      const right = this.unary()

      return {
        type: NodeType.UnaryExpression,
        operator,
        argument: right,
        prefix: true,
        line: right.line,
        column: right.column
      }
    }

    return this.power()
  }

  private power(): ExpressionNode {
    let expr = this.call()

    while (this.match(TokenType.POWER)) {
      const operator = this.previous().value
      const right = this.unary()

      expr = {
        type: NodeType.BinaryExpression,
        operator,
        left: expr,
        right,
        line: expr.line,
        column: expr.column
      }
    }

    return expr
  }

  private call(): ExpressionNode {
    let expr = this.primary()

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        const args: ExpressionNode[] = []

        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.expression())
          } while (this.match(TokenType.COMMA))
        }

        this.consume(TokenType.RPAREN, 'Expect ")" after arguments')

        expr = {
          type: NodeType.CallExpression,
          callee: expr,
          arguments: args,
          line: expr.line,
          column: expr.column
        }
      } else if (this.match(TokenType.LBRACKET)) {
        const property = this.expression()
        this.consume(TokenType.RBRACKET, 'Expect "]" after subscript')

        expr = {
          type: NodeType.MemberExpression,
          object: expr,
          property,
          computed: true,
          line: expr.line,
          column: expr.column
        }
      } else if (this.match(TokenType.DOT)) {
        const property = this.primary()

        expr = {
          type: NodeType.MemberExpression,
          object: expr,
          property,
          computed: false,
          line: expr.line,
          column: expr.column
        }
      } else {
        break
      }
    }

    return expr
  }

  private primary(): ExpressionNode {
    if (this.match(TokenType.NUMBER, TokenType.STRING, TokenType.BOOLEAN, TokenType.NULL)) {
      const token = this.previous()
      return {
        type: NodeType.Literal,
        value: token.value,
        line: token.line,
        column: token.column
      }
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous()
      return {
        type: NodeType.Identifier,
        name: token.value,
        line: token.line,
        column: token.column
      }
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression()
      this.consume(TokenType.RPAREN, 'Expect ")" after expression')
      return expr
    }

    if (this.match(TokenType.LBRACKET)) {
      const elements: ExpressionNode[] = []

      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.expression())
        } while (this.match(TokenType.COMMA))
      }

      this.consume(TokenType.RBRACKET, 'Expect "]" after array elements')

      return {
        type: NodeType.ArrayExpression,
        elements,
        line: this.previous().line,
        column: this.previous().column
      }
    }

    if (this.match(TokenType.LBRACE)) {
      const properties: PropertyNode[] = []

      if (!this.check(TokenType.RBRACE)) {
        do {
          const key = this.primary()
          this.consume(TokenType.COLON, 'Expect ":" after property key')
          const value = this.expression()

          properties.push({
            type: NodeType.Property,
            key,
            value,
            kind: 'init',
            line: key.line,
            column: key.column
          })
        } while (this.match(TokenType.COMMA))
      }

      this.consume(TokenType.RBRACE, 'Expect "}" after object properties')

      return {
        type: NodeType.ObjectExpression,
        properties,
        line: this.previous().line,
        column: this.previous().column
      }
    }

    if (this.match(TokenType.ARROW)) {
      const params: IdentifierNode[] = [this.identifier()]

      this.consume(TokenType.ARROW, 'Expect "->"')
      let body: BlockNode | ExpressionNode

      if (this.check(TokenType.LBRACE)) {
        body = this.block()
      } else {
        body = this.expression()
      }

      return {
        type: NodeType.ArrowFunctionExpression,
        params,
        body,
        line: this.previous().line,
        column: this.previous().column
      }
    }

    throw new Error(`Unexpected token ${this.peek().type} at line ${this.peek().line}`)
  }

  private identifier(): IdentifierNode {
    this.consume(TokenType.IDENTIFIER, 'Expect identifier')
    const token = this.previous()
    return {
      type: NodeType.Identifier,
      name: token.value,
      line: token.line,
      column: token.column
    }
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }
    return false
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.position++
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  private peek(): Token {
    return this.tokens[this.position]
  }

  private previous(): Token {
    return this.tokens[this.position - 1]
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance()

    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`)
  }
}
