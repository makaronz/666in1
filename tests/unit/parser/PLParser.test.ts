/**
 * PL Parser Unit Tests
 * Testing tokenization, syntax analysis, and AST generation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PLParser, TokenType, SyntaxError } from '@/pl/parser/PLParser'
import { validPLCode, invalidPLCode } from '@/tests/fixtures/code-samples/pl-samples'

describe('PLParser', () => {
  let parser: PLParser

  beforeEach(() => {
    parser = new PLParser()
  })

  describe('Tokenization', () => {
    it('should tokenize identifiers', () => {
      const tokens = parser.tokenize('let x = 10')
      expect(tokens).toHaveLength(5)
      expect(tokens[0].type).toBe(TokenType.KEYWORD)
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[1].value).toBe('x')
    })

    it('should tokenize numbers', () => {
      const tokens = parser.tokenize('42 3.14 -100')
      expect(tokens).toHaveLength(3)
      expect(tokens[0].type).toBe(TokenType.NUMBER)
      expect(tokens[0].value).toBe(42)
      expect(tokens[1].value).toBe(3.14)
      expect(tokens[2].value).toBe(-100)
    })

    it('should tokenize strings', () => {
      const tokens = parser.tokenize('"Hello" \'World\'')
      expect(tokens).toHaveLength(2)
      expect(tokens[0].type).toBe(TokenType.STRING)
      expect(tokens[0].value).toBe('Hello')
      expect(tokens[1].value).toBe('World')
    })

    it('should tokenize operators', () => {
      const tokens = parser.tokenize('+ - * / % **')
      expect(tokens).toHaveLength(6)
      tokens.forEach(token => {
        expect(token.type).toBe(TokenType.OPERATOR)
      })
    })

    it('should handle escaped characters in strings', () => {
      const tokens = parser.tokenize('"Hello\\nWorld\\t"')
      expect(tokens[0].value).toBe('Hello\nWorld\t')
    })

    it('should track line and column numbers', () => {
      const tokens = parser.tokenize('let x = 10\nlet y = 20')
      expect(tokens[0].line).toBe(1)
      expect(tokens[0].column).toBe(1)
      expect(tokens[6].line).toBe(2)
      expect(tokens[6].column).toBe(1)
    })

    it('should handle whitespace and newlines', () => {
      const tokens = parser.tokenize('let x = 10\n\n  let y = 20')
      expect(tokens).toHaveLength(10)
      expect(tokens.filter(t => t.type === TokenType.NEWLINE)).toHaveLength(2)
    })

    it('should tokenize comments', () => {
      const tokens = parser.tokenize('let x = 10 // this is a comment\nlet y = 20')
      expect(tokens).toHaveLength(10)
    })

    it('should throw on invalid tokens', () => {
      expect(() => parser.tokenize('@')).toThrow()
    })
  })

  describe('Syntax Analysis', () => {
    it('should parse variable declarations', () => {
      const ast = parser.parse('let x = 10')
      expect(ast.type).toBe('Program')
      expect(ast.body).toHaveLength(1)
      expect(ast.body[0].type).toBe('VariableDeclaration')
    })

    it('should parse function declarations', () => {
      const ast = parser.parse('function test() { return 1 }')
      expect(ast.body[0].type).toBe('FunctionDeclaration')
      expect(ast.body[0].id.name).toBe('test')
    })

    it('should parse function calls', () => {
      const ast = parser.parse('print("Hello")')
      expect(ast.body[0].type).toBe('ExpressionStatement')
      expect(ast.body[0].expression.type).toBe('CallExpression')
    })

    it('should parse binary expressions', () => {
      const ast = parser.parse('let x = 1 + 2 * 3')
      const expr = ast.body[0].init
      expect(expr.type).toBe('BinaryExpression')
      expect(expr.operator).toBe('+')
    })

    it('should parse if statements', () => {
      const ast = parser.parse('if (x > 5) { print(x) }')
      expect(ast.body[0].type).toBe('IfStatement')
    })

    it('should parse for loops', () => {
      const ast = parser.parse('for (let i = 0; i < 10; i++) { print(i) }')
      expect(ast.body[0].type).toBe('ForStatement')
    })

    it('should parse while loops', () => {
      const ast = parser.parse('while (x < 10) { x++ }')
      expect(ast.body[0].type).toBe('WhileStatement')
    })

    it('should parse return statements', () => {
      const ast = parser.parse('return x + 1')
      expect(ast.body[0].type).toBe('ReturnStatement')
    })

    it('should parse array literals', () => {
      const ast = parser.parse('let arr = [1, 2, 3]')
      expect(ast.body[0].init.type).toBe('ArrayExpression')
    })

    it('should parse object literals', () => {
      const ast = parser.parse('let obj = { x: 1, y: 2 }')
      expect(ast.body[0].init.type).toBe('ObjectExpression')
    })

    it('should handle operator precedence', () => {
      const ast = parser.parse('1 + 2 * 3')
      expect(ast.body[0].right.type).toBe('BinaryExpression')
      expect(ast.body[0].right.operator).toBe('*')
    })

    it('should handle nested expressions', () => {
      const ast = parser.parse('((1 + 2) * 3)')
      expect(ast.body[0].type).toBe('BinaryExpression')
    })

    it('should throw on syntax errors', () => {
      expect(() => parser.parse('print("unclosed')).toThrow(SyntaxError)
      expect(() => parser.parse('let x = ')).toThrow(SyntaxError)
      expect(() => parser.parse('function {')).toThrow(SyntaxError)
    })

    it('should provide helpful error messages', () => {
      try {
        parser.parse('print("unclosed')
      } catch (error: any) {
        expect(error.message).toContain('line')
        expect(error.message).toContain('column')
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty code', () => {
      const ast = parser.parse('')
      expect(ast.type).toBe('Program')
      expect(ast.body).toHaveLength(0)
    })

    it('should handle whitespace-only code', () => {
      const ast = parser.parse('   \n\t   ')
      expect(ast.body).toHaveLength(0)
    })

    it('should handle very long identifiers', () => {
      const longId = 'a'.repeat(1000)
      const ast = parser.parse(`let ${longId} = 1`)
      expect(ast.body[0].id.name).toBe(longId)
    })

    it('should handle deeply nested code', () => {
      const code = `
        function a() {
          function b() {
            function c() {
              print("deep")
            }
            c()
          }
          b()
        }
        a()
      `
      const ast = parser.parse(code)
      expect(ast.body).toHaveLength(1)
    })

    it('should handle unicode characters', () => {
      const ast = parser.parse('let 测试 = "Hello 世界"')
      expect(ast.body[0].id.name).toBe('测试')
    })
  })

  describe('Performance', () => {
    it('should tokenize 1000 lines quickly', () => {
      const code = Array(1000).fill(0).map((_, i) =>
        `let x${i} = ${i}`
      ).join('\n')

      const start = performance.now()
      parser.tokenize(code)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(50)
    })

    it('should parse complex code efficiently', () => {
      const code = `
        function fib(n) {
          if (n <= 1) return n
          return fib(n - 1) + fib(n - 2)
        }
        print(fib(10))
      `

      const start = performance.now()
      parser.parse(code)
      const duration = performance.now() - start

      expect(duration).toBeLessThan(10)
    })
  })

  describe('Error Recovery', () => {
    it('should continue after first error', () => {
      parser.mode = 'recover'

      try {
        parser.parse('let x = \nlet y = 10')
      } catch (error) {
        // Expected first error
      }

      expect(parser.errors.length).toBeGreaterThan(0)
    })

    it('should report multiple errors', () => {
      parser.mode = 'recover'

      try {
        parser.parse('let x = \nlet y = \nlet z = 10')
      } catch (error) {
        // Expected errors
      }

      expect(parser.errors.length).toBeGreaterThanOrEqual(2)
    })
  })
})
