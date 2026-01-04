/**
 * PL Parser Tests
 */

import { describe, it, expect } from 'vitest'
import { Lexer } from '@/pl/parser/lexer'
import { Parser, NodeType } from '@/pl/parser/parser'

describe('Parser', () => {
  const parse = (source: string) => {
    const lexer = new Lexer(source)
    const tokens = lexer.tokenize()
    const parser = new Parser(tokens)
    return parser.parse()
  }

  describe('Literals', () => {
    it('should parse number literals', () => {
      const ast = parse('42')
      expect(ast.body[0].type).toBe(NodeType.ExpressionStatement)
      const expr = (ast.body[0] as any).expression
      expect(expr.type).toBe(NodeType.Literal)
      expect(expr.value).toBe(42)
    })

    it('should parse string literals', () => {
      const ast = parse('"hello"')
      const expr = (ast.body[0] as any).expression
      expect(expr.type).toBe(NodeType.Literal)
      expect(expr.value).toBe('hello')
    })

    it('should parse boolean literals', () => {
      const ast = parse('true')
      const expr = (ast.body[0] as any).expression
      expect(expr.type).toBe(NodeType.Literal)
      expect(expr.value).toBe(true)
    })

    it('should parse null literal', () => {
      const ast = parse('null')
      const expr = (ast.body[0] as any).expression
      expect(expr.type).toBe(NodeType.Literal)
      expect(expr.value).toBe(null)
    })
  })

  describe('Binary Expressions', () => {
    it('should parse arithmetic expressions', () => {
      const ast = parse('1 + 2 * 3')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.BinaryExpression)
      expect(expr.operator).toBe('+')
      expect(expr.left.type).toBe(NodeType.Literal)
      expect(expr.right.type).toBe(NodeType.BinaryExpression)
      expect(expr.right.operator).toBe('*')
    })

    it('should parse comparison expressions', () => {
      const ast = parse('a == b')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.BinaryExpression)
      expect(expr.operator).toBe('==')
    })

    it('should parse logical expressions', () => {
      const ast = parse('a and b or c')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.LogicalExpression)
      expect(expr.operator).toBe('or')
    })
  })

  describe('Unary Expressions', () => {
    it('should parse unary minus', () => {
      const ast = parse('-42')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.UnaryExpression)
      expect(expr.operator).toBe('-')
      expect(expr.prefix).toBe(true)
    })

    it('should parse logical not', () => {
      const ast = parse('not true')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.UnaryExpression)
      expect(expr.operator).toBe('not')
    })
  })

  describe('Variable Declarations', () => {
    it('should parse var declarations', () => {
      const ast = parse('var x = 42')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.VariableDeclaration)
      expect(stmt.kind).toBe('var')
      expect(stmt.declarations).toHaveLength(1)
      expect(stmt.declarations[0].id.name).toBe('x')
    })

    it('should parse const declarations', () => {
      const ast = parse('const y = 100')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.VariableDeclaration)
      expect(stmt.kind).toBe('const')
    })

    it('should parse multiple declarations', () => {
      const ast = parse('var a = 1, b = 2, c = 3')
      const stmt = ast.body[0]

      expect(stmt.declarations).toHaveLength(3)
    })
  })

  describe('Function Declarations', () => {
    it('should parse function declarations', () => {
      const ast = parse('function add(a, b) { return a + b }')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.FunctionDeclaration)
      expect(stmt.id.name).toBe('add')
      expect(stmt.params).toHaveLength(2)
      expect(stmt.params[0].name).toBe('a')
      expect(stmt.params[1].name).toBe('b')
    })

    it('should parse functions with no parameters', () => {
      const ast = parse('function greet() { println("Hello") }')
      const stmt = ast.body[0]

      expect(stmt.params).toHaveLength(0)
    })
  })

  describe('If Statements', () => {
    it('should parse if statements', () => {
      const ast = parse('if (x > 0) { println("positive") }')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.IfStatement)
      expect(stmt.test.type).toBe(NodeType.BinaryExpression)
      expect(stmt.consequent.type).toBe(NodeType.Block)
    })

    it('should parse if-else statements', () => {
      const ast = parse('if (x > 0) { println("positive") } else { println("non-positive") }')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.IfStatement)
      expect(stmt.alternate).toBeDefined()
      expect(stmt.alternate.type).toBe(NodeType.Block)
    })
  })

  describe('While Statements', () => {
    it('should parse while statements', () => {
      const ast = parse('while (x < 10) { x = x + 1 }')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.WhileStatement)
      expect(stmt.test.type).toBe(NodeType.BinaryExpression)
      expect(stmt.body.type).toBe(NodeType.Block)
    })
  })

  describe('For Statements', () => {
    it('should parse for statements', () => {
      const ast = parse('for (var i = 0; i < 10; i = i + 1) { println(i) }')
      const stmt = ast.body[0]

      expect(stmt.type).toBe(NodeType.ForStatement)
      expect(stmt.init.type).toBe(NodeType.VariableDeclaration)
      expect(stmt.test.type).toBe(NodeType.BinaryExpression)
      expect(stmt.update.type).toBe(NodeType.AssignmentExpression)
    })
  })

  describe('Call Expressions', () => {
    it('should parse function calls', () => {
      const ast = parse('add(1, 2)')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.CallExpression)
      expect(expr.callee.name).toBe('add')
      expect(expr.arguments).toHaveLength(2)
    })

    it('should parse nested calls', () => {
      const ast = parse('add(add(1, 2), 3)')
      const expr = (ast.body[0] as any).expression

      expect(expr.arguments[0].type).toBe(NodeType.CallExpression)
    })
  })

  describe('Array Expressions', () => {
    it('should parse empty arrays', () => {
      const ast = parse('[]')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.ArrayExpression)
      expect(expr.elements).toHaveLength(0)
    })

    it('should parse arrays with elements', () => {
      const ast = parse('[1, 2, 3]')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.ArrayExpression)
      expect(expr.elements).toHaveLength(3)
    })
  })

  describe('Object Expressions', () => {
    it('should parse empty objects', () => {
      const ast = parse('{}')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.ObjectExpression)
      expect(expr.properties).toHaveLength(0)
    })

    it('should parse objects with properties', () => {
      const ast = parse('{ name: "Alice", age: 30 }')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.ObjectExpression)
      expect(expr.properties).toHaveLength(2)
    })
  })

  describe('Member Expressions', () => {
    it('should parse dot notation', () => {
      const ast = parse('obj.property')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.MemberExpression)
      expect(expr.computed).toBe(false)
      expect(expr.property.name).toBe('property')
    })

    it('should parse bracket notation', () => {
      const ast = parse('arr[0]')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.MemberExpression)
      expect(expr.computed).toBe(true)
    })
  })

  describe('Arrow Functions', () => {
    it('should parse arrow functions', () => {
      const ast = parse('x -> x * 2')
      const expr = (ast.body[0] as any).expression

      expect(expr.type).toBe(NodeType.ArrowFunctionExpression)
      expect(expr.params).toHaveLength(1)
      expect(expr.params[0].name).toBe('x')
    })
  })
})
