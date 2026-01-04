/**
 * PL to JavaScript Transpiler
 * Converts PL AST to executable JavaScript code
 */

import {
  ProgramNode,
  StatementNode,
  ExpressionNode,
  NodeType,
  BlockNode,
  ExpressionStatementNode,
  IfStatementNode,
  WhileStatementNode,
  ForStatementNode,
  ReturnStatementNode,
  BreakStatementNode,
  ContinueStatementNode,
  VariableDeclarationNode,
  FunctionDeclarationNode,
  SwitchStatementNode,
  CaseStatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  AssignmentExpressionNode,
  LogicalExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  IdentifierNode,
  LiteralNode,
  ArrayExpressionNode,
  ObjectExpressionNode,
  PropertyNode,
  ArrowFunctionExpressionNode,
  ConditionalExpressionNode
} from '../parser/parser'

export class Transpiler {
  private indent: number = 0
  private readonly INDENT_SIZE = 2

  transpile(node: ProgramNode | StatementNode | ExpressionNode): string {
    return this.visit(node)
  }

  private visit(node: ProgramNode | StatementNode | ExpressionNode): string {
    switch (node.type) {
      case NodeType.Program:
        return this.visitProgram(node as ProgramNode)
      case NodeType.Block:
        return this.visitBlock(node as BlockNode)
      case NodeType.ExpressionStatement:
        return this.visitExpressionStatement(node as ExpressionStatementNode)
      case NodeType.IfStatement:
        return this.visitIfStatement(node as IfStatementNode)
      case NodeType.WhileStatement:
        return this.visitWhileStatement(node as WhileStatementNode)
      case NodeType.ForStatement:
        return this.visitForStatement(node as ForStatementNode)
      case NodeType.ReturnStatement:
        return this.visitReturnStatement(node as ReturnStatementNode)
      case NodeType.BreakStatement:
        return this.visitBreakStatement(node as BreakStatementNode)
      case NodeType.ContinueStatement:
        return this.visitContinueStatement(node as ContinueStatementNode)
      case NodeType.VariableDeclaration:
        return this.visitVariableDeclaration(node as VariableDeclarationNode)
      case NodeType.FunctionDeclaration:
        return this.visitFunctionDeclaration(node as FunctionDeclarationNode)
      case NodeType.SwitchStatement:
        return this.visitSwitchStatement(node as SwitchStatementNode)
      case NodeType.BinaryExpression:
        return this.visitBinaryExpression(node as BinaryExpressionNode)
      case NodeType.UnaryExpression:
        return this.visitUnaryExpression(node as UnaryExpressionNode)
      case NodeType.AssignmentExpression:
        return this.visitAssignmentExpression(node as AssignmentExpressionNode)
      case NodeType.LogicalExpression:
        return this.visitLogicalExpression(node as LogicalExpressionNode)
      case NodeType.CallExpression:
        return this.visitCallExpression(node as CallExpressionNode)
      case NodeType.MemberExpression:
        return this.visitMemberExpression(node as MemberExpressionNode)
      case NodeType.Identifier:
        return this.visitIdentifier(node as IdentifierNode)
      case NodeType.Literal:
        return this.visitLiteral(node as LiteralNode)
      case NodeType.ArrayExpression:
        return this.visitArrayExpression(node as ArrayExpressionNode)
      case NodeType.ObjectExpression:
        return this.visitObjectExpression(node as ObjectExpressionNode)
      case NodeType.ArrowFunctionExpression:
        return this.visitArrowFunctionExpression(node as ArrowFunctionExpressionNode)
      case NodeType.ConditionalExpression:
        return this.visitConditionalExpression(node as ConditionalExpressionNode)
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`)
    }
  }

  private visitProgram(node: ProgramNode): string {
    return node.body.map(stmt => this.visit(stmt)).join('\n\n')
  }

  private visitBlock(node: BlockNode): string {
    this.indent += this.INDENT_SIZE
    const body = node.body.map(stmt => this.visit(stmt)).join('\n')
    this.indent -= this.INDENT_SIZE

    return `{\n${this.indentString(body)}\n${this.getIndent()}}`
  }

  private visitExpressionStatement(node: ExpressionStatementNode): string {
    return `${this.getIndent()}${this.visit(node.expression)};`
  }

  private visitIfStatement(node: IfStatementNode): string {
    let result = `${this.getIndent()}if (${this.visit(node.test)}) ${this.visit(node.consequent)}`

    if (node.alternate) {
      result += ` else ${this.visit(node.alternate)}`
    }

    return result
  }

  private visitWhileStatement(node: WhileStatementNode): string {
    return `${this.getIndent()}while (${this.visit(node.test)}) ${this.visit(node.body)}`
  }

  private visitForStatement(node: ForStatementNode): string {
    const init = node.init ? this.visit(node.init) : ''
    const test = node.test ? this.visit(node.test) : 'true'
    const update = node.update ? this.visit(node.update) : ''

    return `${this.getIndent()}for (${init}; ${test}; ${update}) ${this.visit(node.body)}`
  }

  private visitReturnStatement(node: ReturnStatementNode): string {
    if (node.argument) {
      return `${this.getIndent()}return ${this.visit(node.argument)};`
    }
    return `${this.getIndent()}return;`
  }

  private visitBreakStatement(node: BreakStatementNode): string {
    return `${this.getIndent()}break;`
  }

  private visitContinueStatement(node: ContinueStatementNode): string {
    return `${this.getIndent()}continue;`
  }

  private visitVariableDeclaration(node: VariableDeclarationNode): string {
    const declarations = node.declarations
      .map(decl => {
        const id = this.visit(decl.id)
        const init = decl.init ? ` = ${this.visit(decl.init)}` : ''
        return `${id}${init}`
      })
      .join(', ')

    return `${this.getIndent()}${node.kind} ${declarations};`
  }

  private visitFunctionDeclaration(node: FunctionDeclarationNode): string {
    const id = this.visit(node.id)
    const params = node.params.map(p => this.visit(p)).join(', ')
    const body = this.visit(node.body)

    return `${this.getIndent()}function ${id}(${params}) ${body}`
  }

  private visitSwitchStatement(node: SwitchStatementNode): string {
    const discriminant = this.visit(node.discriminant)

    this.indent += this.INDENT_SIZE
    const cases = node.cases
      .map(c => {
        const test = c.test ? `case ${this.visit(c.test)}:` : 'default:'
        const consequent = c.consequent
          .map(stmt => {
            this.indent += this.INDENT_SIZE
            const result = this.visit(stmt)
            this.indent -= this.INDENT_SIZE
            return result
          })
          .join('\n')

        return `${this.getIndent()}${test}\n${consequent}`
      })
      .join('\n')
    this.indent -= this.INDENT_SIZE

    return `${this.getIndent()}switch (${discriminant}) {\n${cases}\n${this.getIndent()}}`
  }

  private visitBinaryExpression(node: BinaryExpressionNode): string {
    return `(${this.visit(node.left)} ${node.operator} ${this.visit(node.right)})`
  }

  private visitUnaryExpression(node: UnaryExpressionNode): string {
    if (node.prefix) {
      return `(${node.operator}${this.visit(node.argument)})`
    } else {
      return `(${this.visit(node.argument)}${node.operator})`
    }
  }

  private visitAssignmentExpression(node: AssignmentExpressionNode): string {
    return `${this.visit(node.left)} ${node.operator} ${this.visit(node.right)}`
  }

  private visitLogicalExpression(node: LogicalExpressionNode): string {
    const jsOperator = node.operator === 'and' ? '&&' : node.operator === 'or' ? '||' : node.operator
    return `(${this.visit(node.left)} ${jsOperator} ${this.visit(node.right)})`
  }

  private visitCallExpression(node: CallExpressionNode): string {
    const callee = this.visit(node.callee)
    const args = node.arguments.map(arg => this.visit(arg)).join(', ')
    return `${callee}(${args})`
  }

  private visitMemberExpression(node: MemberExpressionNode): string {
    const object = this.visit(node.object)

    if (node.computed) {
      return `${object}[${this.visit(node.property)}]`
    } else {
      return `${object}.${this.visit(node.property)}`
    }
  }

  private visitIdentifier(node: IdentifierNode): string {
    return node.name
  }

  private visitLiteral(node: LiteralNode): string {
    if (typeof node.value === 'string') {
      return `"${node.value}"`
    }
    if (node.value === null) {
      return 'null'
    }
    if (typeof node.value === 'boolean') {
      return node.value ? 'true' : 'false'
    }
    return String(node.value)
  }

  private visitArrayExpression(node: ArrayExpressionNode): string {
    const elements = node.elements.map(el => this.visit(el)).join(', ')
    return `[${elements}]`
  }

  private visitObjectExpression(node: ObjectExpressionNode): string {
    const properties = node.properties
      .map(prop => {
        const key = this.visit(prop.key)
        const value = this.visit(prop.value)
        return `${key}: ${value}`
      })
      .join(', ')

    return `{${properties}}`
  }

  private visitArrowFunctionExpression(node: ArrowFunctionExpressionNode): string {
    const params = node.params.map(p => this.visit(p)).join(', ')

    if (node.body.type === NodeType.Block) {
      const body = this.visit(node.body)
      return `(${params}) => ${body}`
    } else {
      const body = this.visit(node.body)
      return `(${params}) => ${body}`
    }
  }

  private visitConditionalExpression(node: ConditionalExpressionNode): string {
    const test = this.visit(node.test)
    const consequent = this.visit(node.consequent)
    const alternate = this.visit(node.alternate)

    return `${test} ? ${consequent} : ${alternate}`
  }

  private getIndent(): string {
    return ' '.repeat(this.indent)
  }

  private indentString(code: string): string {
    return code
      .split('\n')
      .map(line => (line.trim() ? this.getIndent() + line : ''))
      .join('\n')
  }
}
