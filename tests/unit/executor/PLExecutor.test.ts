/**
 * PL Executor Unit Tests
 * Testing code execution, runtime errors, and security
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PLExecutor, RuntimeError, SecurityError } from '@/pl/executor/PLExecutor'
import { PLParser } from '@/pl/parser/PLParser'
import { validPLCode, invalidPLCode } from '@/tests/fixtures/code-samples/pl-samples'

describe('PLExecutor', () => {
  let executor: PLExecutor
  let parser: PLParser

  beforeEach(() => {
    executor = new PLExecutor({
      timeout: 5000,
      memoryLimit: 50 * 1024 * 1024, // 50MB
      maxOutputLength: 10000
    })
    parser = new PLParser()
  })

  afterEach(() => {
    executor.cleanup()
  })

  describe('Basic Execution', () => {
    it('should execute print statements', () => {
      const ast = parser.parse('print("Hello, World!")')
      const result = executor.execute(ast)
      expect(result.output).toContain('Hello, World!')
    })

    it('should execute variable declarations', () => {
      const ast = parser.parse('let x = 10')
      const result = executor.execute(ast)
      expect(result.success).toBe(true)
      expect(result.variables.x).toBe(10)
    })

    it('should execute function declarations', () => {
      const ast = parser.parse('function add(a, b) { return a + b }')
      const result = executor.execute(ast)
      expect(result.success).toBe(true)
      expect(typeof result.variables.add).toBe('function')
    })

    it('should execute function calls', () => {
      const ast = parser.parse(`
        function add(a, b) {
          return a + b
        }
        print(add(5, 3))
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('8')
    })

    it('should execute binary operations', () => {
      const ast = parser.parse('let x = 5 + 3')
      const result = executor.execute(ast)
      expect(result.variables.x).toBe(8)
    })

    it('should execute if statements', () => {
      const ast = parser.parse(`
        let x = 10
        if (x > 5) {
          print("greater")
        } else {
          print("smaller")
        }
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('greater')
    })

    it('should execute for loops', () => {
      const ast = parser.parse(`
        for (let i = 0; i < 3; i++) {
          print(i)
        }
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('0')
      expect(result.output).toContain('1')
      expect(result.output).toContain('2')
    })

    it('should execute while loops', () => {
      const ast = parser.parse(`
        let x = 0
        while (x < 3) {
          print(x)
          x = x + 1
        }
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('0')
      expect(result.output).toContain('1')
      expect(result.output).toContain('2')
    })

    it('should execute array operations', () => {
      const ast = parser.parse(`
        let arr = [1, 2, 3]
        print(arr[0])
        print(arr.length)
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('1')
      expect(result.output).toContain('3')
    })

    it('should handle string operations', () => {
      const ast = parser.parse(`
        let str = "Hello"
        print(str.length)
        print(str.toUpperCase())
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('5')
      expect(result.output).toContain('HELLO')
    })
  })

  describe('Scope Handling', () => {
    it('should maintain function scope', () => {
      const ast = parser.parse(`
        let x = 10
        function test() {
          let x = 20
          return x
        }
        print(test())
        print(x)
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('20')
      expect(result.output).toContain('10')
    })

    it('should handle nested scopes', () => {
      const ast = parser.parse(`
        let x = 10
        function outer() {
          let x = 20
          function inner() {
            let x = 30
            return x
          }
          return inner()
        }
        print(outer())
        print(x)
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('30')
      expect(result.output).toContain('10')
    })

    it('should support closures', () => {
      const ast = parser.parse(`
        function createAdder(x) {
          return function(y) {
            return x + y
          }
        }
        let add5 = createAdder(5)
        print(add5(3))
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('8')
    })
  })

  describe('Error Handling', () => {
    it('should throw on undefined variables', () => {
      const ast = parser.parse('print(undefinedVariable)')
      expect(() => executor.execute(ast)).toThrow(RuntimeError)
    })

    it('should throw on type errors', () => {
      const ast = parser.parse('let x = 5 + "text"')
      expect(() => executor.execute(ast)).toThrow(RuntimeError)
    })

    it('should throw on division by zero', () => {
      const ast = parser.parse('let x = 10 / 0')
      expect(() => executor.execute(ast)).toThrow(RuntimeError)
    })

    it('should throw on null reference', () => {
      const ast = parser.parse('let x = null; print(x.length)')
      expect(() => executor.execute(ast)).toThrow(RuntimeError)
    })

    it('should throw on invalid function call', () => {
      const ast = parser.parse('nonExistentFunction()')
      expect(() => executor.execute(ast)).toThrow(RuntimeError)
    })

    it('should provide helpful error messages', () => {
      const ast = parser.parse('print(undefinedVar)')
      try {
        executor.execute(ast)
      } catch (error: any) {
        expect(error.message).toContain('undefinedVar')
        expect(error.line).toBeDefined()
        expect(error.column).toBeDefined()
      }
    })
  })

  describe('Security', () => {
    it('should prevent prototype pollution', () => {
      const ast = parser.parse('Object.prototype.polluted = true')
      expect(() => executor.execute(ast)).toThrow(SecurityError)
    })

    it('should block dangerous eval-like constructs', () => {
      const ast = parser.parse('eval("print(1)")')
      expect(() => executor.execute(ast)).toThrow(SecurityError)
    })

    it('should restrict imports', () => {
      const ast = parser.parse('import("fs")')
      expect(() => executor.execute(ast)).toThrow(SecurityError)
    })

    it('should restrict require', () => {
      const ast = parser.parse('require("child_process")')
      expect(() => executor.execute(ast)).toThrow(SecurityError)
    })

    it('should sandbox execution context', () => {
      const ast = parser.parse('let global = this')
      const result = executor.execute(ast)
      expect(result.variables.global).not.toBe(global)
    })

    it('should restrict file system access', () => {
      const ast = parser.parse('let fs = require("fs")')
      expect(() => executor.execute(ast)).toThrow(SecurityError)
    })

    it('should restrict network access', () => {
      const ast = parser.parse('fetch("http://example.com")')
      expect(() => executor.execute(ast)).toThrow(SecurityError)
    })
  })

  describe('Resource Limits', () => {
    it('should enforce timeout limits', () => {
      executor.options.timeout = 100
      const ast = parser.parse('while (true) { }')
      expect(() => executor.execute(ast)).toThrow()
    }, 1000)

    it('should enforce memory limits', () => {
      executor.options.memoryLimit = 1024 // 1KB
      const ast = parser.parse(`
        let largeArray = []
        for (let i = 0; i < 10000; i++) {
          largeArray.push(new Array(1000))
        }
      `)
      expect(() => executor.execute(ast)).toThrow()
    })

    it('should limit output length', () => {
      executor.options.maxOutputLength = 100
      const ast = parser.parse(`
        for (let i = 0; i < 1000; i++) {
          print("aaaaaaaaaa")
        }
      `)
      const result = executor.execute(ast)
      expect(result.output.length).toBeLessThanOrEqual(100)
    })

    it('should prevent infinite recursion', () => {
      const ast = parser.parse(`
        function infiniteRecurse() {
          infiniteRecurse()
        }
        infiniteRecurse()
      `)
      expect(() => executor.execute(ast)).toThrow()
    }, 2000)

    it('should prevent infinite loops', () => {
      executor.options.timeout = 500
      const ast = parser.parse('while (true) { print("loop") }')
      expect(() => executor.execute(ast)).toThrow()
    }, 1000)
  })

  describe('Performance', () => {
    it('should execute small programs quickly', () => {
      const ast = parser.parse('print("Hello")')
      const start = performance.now()
      executor.execute(ast)
      const duration = performance.now() - start
      expect(duration).toBeLessThan(10)
    })

    it('should handle multiple executions efficiently', () => {
      const ast = parser.parse('print(1 + 1)')
      const iterations = 100

      const start = performance.now()
      for (let i = 0; i < iterations; i++) {
        executor.execute(ast)
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100)
    })

    it('should manage memory efficiently', () => {
      const initialMemory = process.memoryUsage().heapUsed

      for (let i = 0; i < 100; i++) {
        const ast = parser.parse(`
          let x = ${i}
          function test() { return x }
        `)
        executor.execute(ast)
        executor.cleanup()
      }

      global.gc && global.gc()
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB
    })
  })

  describe('Output Capture', () => {
    it('should capture console output', () => {
      const ast = parser.parse('print("Hello")')
      const result = executor.execute(ast)
      expect(result.output).toBe('Hello\n')
    })

    it('should capture multiple print statements', () => {
      const ast = parser.parse(`
        print("Line 1")
        print("Line 2")
        print("Line 3")
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('Line 1')
      expect(result.output).toContain('Line 2')
      expect(result.output).toContain('Line 3')
    })

    it('should capture return values', () => {
      const ast = parser.parse(`
        function add(a, b) {
          return a + b
        }
        let result = add(5, 3)
        print(result)
      `)
      const result = executor.execute(ast)
      expect(result.output).toContain('8')
    })

    it('should handle errors in output', () => {
      const ast = parser.parse('print(undefinedVar)')
      try {
        executor.execute(ast)
      } catch (error: any) {
        expect(error.message).toBeDefined()
      }
    })
  })

  describe('State Management', () => {
    it('should maintain state across executions', () => {
      const ast1 = parser.parse('let x = 10')
      executor.execute(ast1)

      const ast2 = parser.parse('print(x)')
      const result = executor.execute(ast2)
      expect(result.output).toContain('10')
    })

    it('should reset state on cleanup', () => {
      const ast1 = parser.parse('let x = 10')
      executor.execute(ast1)
      executor.cleanup()

      const ast2 = parser.parse('print(x)')
      expect(() => executor.execute(ast2)).toThrow()
    })

    it('should support isolated execution contexts', () => {
      const executor1 = new PLExecutor()
      const executor2 = new PLExecutor()

      const ast1 = parser.parse('let x = 10')
      executor1.execute(ast1)

      const ast2 = parser.parse('let x = 20')
      executor2.execute(ast2)

      expect(executor1.state.variables.x).toBe(10)
      expect(executor2.state.variables.x).toBe(20)

      executor1.cleanup()
      executor2.cleanup()
    })
  })
})
