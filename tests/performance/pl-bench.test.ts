/**
 * PL Performance Benchmarks
 * Testing execution speed, memory usage, and scalability
 */

import { describe, bench, expect, beforeAll, afterAll } from 'vitest'
import { PLParser } from '@/pl/parser/PLParser'
import { PLExecutor } from '@/pl/executor/PLExecutor'
import { performanceTestCases } from '@/tests/fixtures/code-samples/pl-samples'

describe('PL Performance Benchmarks', () => {
  let parser: PLParser
  let executor: PLExecutor

  beforeAll(() => {
    parser = new PLParser()
    executor = new PLExecutor({
      timeout: 10000,
      memoryLimit: 100 * 1024 * 1024
    })
  })

  afterAll(() => {
    executor.cleanup()
  })

  describe('Parser Performance', () => {
    bench('should tokenize simple code', () => {
      parser.tokenize('let x = 10')
    }, { iterations: 10000 })

    bench('should tokenize medium code', () => {
      parser.tokenize(performanceTestCases.mediumProgram)
    }, { iterations: 1000 })

    bench('should tokenize large code (100 lines)', () => {
      const code = Array(100).fill(0).map((_, i) =>
        `let x${i} = ${i}`
      ).join('\n')
      parser.tokenize(code)
    }, { iterations: 100 })

    bench('should parse simple expression', () => {
      parser.parse('1 + 2 * 3')
    }, { iterations: 10000 })

    bench('should parse function declaration', () => {
      parser.parse('function test(a, b) { return a + b }')
    }, { iterations: 1000 })

    bench('should parse fibonacci (10)', () => {
      parser.parse(performanceTestCases.mediumProgram)
    }, { iterations: 1000 })

    bench('should parse large program (100 functions)', () => {
      parser.parse(performanceTestCases.largeProgram)
    }, { iterations: 100 })

    bench('should parse deeply nested code', () => {
      const nested = `
        function a() {
          function b() {
            function c() {
              function d() {
                function e() {
                  return 1
                }
                return e()
              }
              return d()
            }
            return c()
          }
          return b()
        }
      `
      parser.parse(nested)
    }, { iterations: 500 })
  })

  describe('Executor Performance', () => {
    bench('should execute print statement', () => {
      const ast = parser.parse('print("test")')
      executor.execute(ast)
    }, { iterations: 1000 })

    bench('should execute variable assignment', () => {
      const ast = parser.parse('let x = 10')
      executor.execute(ast)
    }, { iterations: 10000 })

    bench('should execute function call', () => {
      const ast = parser.parse(`
        function add(a, b) { return a + b }
        add(5, 3)
      `)
      executor.execute(ast)
    }, { iterations: 1000 })

    bench('should execute loop (10 iterations)', () => {
      const ast = parser.parse(`
        for (let i = 0; i < 10; i++) {
          print(i)
        }
      `)
      executor.execute(ast)
    }, { iterations: 500 })

    bench('should execute fibonacci(10)', () => {
      const ast = parser.parse(performanceTestCases.mediumProgram)
      executor.execute(ast)
    }, { iterations: 100 })

    bench('should execute array operations (100 elements)', () => {
      const ast = parser.parse(`
        let arr = []
        for (let i = 0; i < 100; i++) {
          arr.push(i)
        }
        print(arr.length)
      `)
      executor.execute(ast)
    }, { iterations: 200 })

    bench('should execute string operations', () => {
      const ast = parser.parse(`
        let str = "Hello, World!"
        print(str.length)
        print(str.toUpperCase())
        print(str.substring(0, 5))
      `)
      executor.execute(ast)
    }, { iterations: 500 })
  })

  describe('Memory Performance', () => {
    bench('should manage memory for 100 executions', () => {
      for (let i = 0; i < 100; i++) {
        const ast = parser.parse(`let x${i} = ${i}`)
        executor.execute(ast)
      }
      executor.cleanup()
    }, { iterations: 10 })

    bench('should handle large arrays (10000 elements)', () => {
      const ast = parser.parse(`
        let largeArray = []
        for (let i = 0; i < 10000; i++) {
          largeArray.push(i)
        }
        print(largeArray.length)
      `)
      executor.execute(ast)
    }, { iterations: 10 })

    bench('should handle deep recursion', () => {
      const ast = parser.parse(`
        function recurse(n) {
          if (n <= 0) return 0
          return n + recurse(n - 1)
        }
        print(recurse(100))
      `)
      executor.execute(ast)
    }, { iterations: 10 })
  })

  describe('Concurrent Execution', () => {
    bench('should handle 10 concurrent executions', async () => {
      const promises = Array(10).fill(null).map(() => {
        const ast = parser.parse('print("test")')
        return Promise.resolve(executor.execute(ast))
      })
      await Promise.all(promises)
    }, { iterations: 100 })

    bench('should handle 50 concurrent executions', async () => {
      const promises = Array(50).fill(null).map(() => {
        const ast = parser.parse('print("test")')
        return Promise.resolve(executor.execute(ast))
      })
      await Promise.all(promises)
    }, { iterations: 10 })
  })

  describe('Scalability', () => {
    bench('should scale with code size (small)', () => {
      parser.parse(performanceTestCases.smallProgram)
    }, { iterations: 10000 })

    bench('should scale with code size (medium)', () => {
      parser.parse(performanceTestCases.mediumProgram)
    }, { iterations: 1000 })

    bench('should scale with code size (large)', () => {
      parser.parse(performanceTestCases.largeProgram)
    }, { iterations: 100 })

    bench('should scale with computational complexity', () => {
      parser.parse(performanceTestCases.computationallyIntensive)
    }, { iterations: 50 })
  })
})
