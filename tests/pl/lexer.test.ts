/**
 * PL Lexer Tests
 */

import { describe, it, expect } from 'vitest'
import { Lexer, TokenType } from '@/pl/parser/lexer'

describe('Lexer', () => {
  describe('Numbers', () => {
    it('should tokenize integers', () => {
      const lexer = new Lexer('42')
      const tokens = lexer.tokenize()

      expect(tokens).toHaveLength(2) // NUMBER + EOF
      expect(tokens[0].type).toBe(TokenType.NUMBER)
      expect(tokens[0].value).toBe(42)
    })

    it('should tokenize decimals', () => {
      const lexer = new Lexer('3.14')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.NUMBER)
      expect(tokens[0].value).toBe(3.14)
    })

    it('should tokenize scientific notation', () => {
      const lexer = new Lexer('1.5e10')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.NUMBER)
      expect(tokens[0].value).toBe(1.5e10)
    })
  })

  describe('Strings', () => {
    it('should tokenize double-quoted strings', () => {
      const lexer = new Lexer('"hello"')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.STRING)
      expect(tokens[0].value).toBe('hello')
    })

    it('should tokenize single-quoted strings', () => {
      const lexer = new Lexer("'world'")
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.STRING)
      expect(tokens[0].value).toBe('world')
    })

    it('should handle escape sequences', () => {
      const lexer = new Lexer('"hello\\nworld"')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.STRING)
      expect(tokens[0].value).toBe('hello\nworld')
    })
  })

  describe('Identifiers and Keywords', () => {
    it('should tokenize identifiers', () => {
      const lexer = new Lexer('myVariable')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[0].value).toBe('myVariable')
    })

    it('should tokenize keywords', () => {
      const lexer = new Lexer('if else while for function')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.IF)
      expect(tokens[1].type).toBe(TokenType.ELSE)
      expect(tokens[2].type).toBe(TokenType.WHILE)
      expect(tokens[3].type).toBe(TokenType.FOR)
      expect(tokens[4].type).toBe(TokenType.FUNCTION)
    })

    it('should tokenize boolean literals', () => {
      const lexer = new Lexer('true false')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.TRUE)
      expect(tokens[1].type).toBe(TokenType.FALSE)
    })
  })

  describe('Operators', () => {
    it('should tokenize arithmetic operators', () => {
      const lexer = new Lexer('+ - * / % ^')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.PLUS)
      expect(tokens[1].type).toBe(TokenType.MINUS)
      expect(tokens[2].type).toBe(TokenType.MULTIPLY)
      expect(tokens[3].type).toBe(TokenType.DIVIDE)
      expect(tokens[4].type).toBe(TokenType.MODULO)
      expect(tokens[5].type).toBe(TokenType.POWER)
    })

    it('should tokenize comparison operators', () => {
      const lexer = new Lexer('== != < > <= >=')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.EQUAL)
      expect(tokens[1].type).toBe(TokenType.NOT_EQUAL)
      expect(tokens[2].type).toBe(TokenType.LESS_THAN)
      expect(tokens[3].type).toBe(TokenType.GREATER_THAN)
      expect(tokens[4].type).toBe(TokenType.LESS_EQUAL)
      expect(tokens[5].type).toBe(TokenType.GREATER_EQUAL)
    })

    it('should tokenize logical operators', () => {
      const lexer = new Lexer('and or not')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.AND)
      expect(tokens[1].type).toBe(TokenType.OR)
      expect(tokens[2].type).toBe(TokenType.NOT)
    })
  })

  describe('Delimiters', () => {
    it('should tokenize brackets and braces', () => {
      const lexer = new Lexer('() {} []')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.LPAREN)
      expect(tokens[1].type).toBe(TokenType.RPAREN)
      expect(tokens[2].type).toBe(TokenType.LBRACE)
      expect(tokens[3].type).toBe(TokenType.RBRACE)
      expect(tokens[4].type).toBe(TokenType.LBRACKET)
      expect(tokens[5].type).toBe(TokenType.RBRACKET)
    })

    it('should tokenize punctuation', () => {
      const lexer = new Lexer(', . : ; ->')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.COMMA)
      expect(tokens[1].type).toBe(TokenType.DOT)
      expect(tokens[2].type).toBe(TokenType.COLON)
      expect(tokens[3].type).toBe(TokenType.SEMICOLON)
      expect(tokens[4].type).toBe(TokenType.ARROW)
    })
  })

  describe('Complex Expressions', () => {
    it('should tokenize function declaration', () => {
      const lexer = new Lexer('function add(a, b) { return a + b }')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.FUNCTION)
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[2].type).toBe(TokenType.LPAREN)
      expect(tokens[3].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[4].type).toBe(TokenType.COMMA)
      expect(tokens[5].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[6].type).toBe(TokenType.RPAREN)
      expect(tokens[7].type).toBe(TokenType.LBRACE)
      expect(tokens[8].type).toBe(TokenType.RETURN)
      expect(tokens[9].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[10].type).toBe(TokenType.PLUS)
      expect(tokens[11].type).toBe(TokenType.IDENTIFIER)
      expect(tokens[12].type).toBe(TokenType.RBRACE)
    })

    it('should handle comments', () => {
      const lexer = new Lexer('// This is a comment\n42')
      const tokens = lexer.tokenize()

      expect(tokens[0].type).toBe(TokenType.NEWLINE)
      expect(tokens[1].type).toBe(TokenType.NUMBER)
      expect(tokens[1].value).toBe(42)
    })
  })

  describe('Line and Column Tracking', () => {
    it('should track line numbers', () => {
      const lexer = new Lexer('42\n"hello"')
      const tokens = lexer.tokenize()

      expect(tokens[0].line).toBe(1)
      expect(tokens[2].line).toBe(2)
    })

    it('should track column numbers', () => {
      const lexer = new Lexer('42 + 10')
      const tokens = lexer.tokenize()

      expect(tokens[0].column).toBe(1)
      expect(tokens[1].column).toBe(4)
      expect(tokens[2].column).toBe(6)
    })
  })
})
