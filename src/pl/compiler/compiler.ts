/**
 * PL Language Compiler
 * Main entry point for compiling PL code to JavaScript
 */

import { Lexer } from '../parser/lexer'
import { Parser } from '../parser/parser'
import { Transpiler } from '../transpiler/transpiler'
import { PLRuntime, RuntimeError } from '../runtime/runtime'

export interface CompileOptions {
  sourceMap?: boolean
  minify?: boolean
  runtime?: boolean
}

export interface CompileResult {
  code: string
  errors: string[]
  warnings: string[]
  sourceMap?: any
}

export interface ExecutionContext {
  timeout?: number
  sandbox?: boolean
  globals?: Record<string, any>
}

export class PLCompiler {
  private readonly transpiler: Transpiler

  constructor() {
    this.transpiler = new Transpiler()
  }

  compile(source: string, options: CompileOptions = {}): CompileResult {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Lexical analysis
      const lexer = new Lexer(source)
      const tokens = lexer.tokenize()

      // Syntax analysis
      const parser = new Parser(tokens)
      const ast = parser.parse()

      // Transpilation to JavaScript
      let code = this.transpiler.transpile(ast)

      // Add runtime if requested
      if (options.runtime !== false) {
        code = this.wrapWithRuntime(code)
      }

      return {
        code,
        errors,
        warnings,
        sourceMap: options.sourceMap ? this.generateSourceMap(source, code) : undefined
      }
    } catch (error) {
      return {
        code: '',
        errors: [error instanceof Error ? error.message : String(error)],
        warnings
      }
    }
  }

  execute(source: string, context: ExecutionContext = {}): any {
    const result = this.compile(source, { runtime: false })

    if (result.errors.length > 0) {
      throw new RuntimeError(result.errors.join('\n'))
    }

    // Create execution environment
    const runtime = new PLRuntime()
    const globals = runtime.getGlobals()

    // Add custom globals if provided
    if (context.globals) {
      Object.entries(context.globals).forEach(([key, value]) => {
        globals.define(key, value)
      })
    }

    // Execute the compiled code
    try {
      const fn = new Function(...Object.keys(context.globals || {}), result.code)

      if (context.timeout) {
        return this.executeWithTimeout(fn, context.timeout, ...(Object.values(context.globals || {})))
      }

      return fn(...(Object.values(context.globals || {})))
    } catch (error) {
      if (error instanceof Error) {
        throw new RuntimeError(error.message)
      }
      throw error
    }
  }

  async executeAsync(source: string, context: ExecutionContext = {}): Promise<any> {
    const result = this.compile(source, { runtime: false })

    if (result.errors.length > 0) {
      throw new RuntimeError(result.errors.join('\n'))
    }

    const runtime = new PLRuntime()
    const globals = runtime.getGlobals()

    if (context.globals) {
      Object.entries(context.globals).forEach(([key, value]) => {
        globals.define(key, value)
      })
    }

    try {
      const fn = new Function(...Object.keys(context.globals || {}), `${result.code}; return Promise.resolve(result);`)

      if (context.timeout) {
        return await this.executeWithTimeoutAsync(fn, context.timeout, ...(Object.values(context.globals || {})))
      }

      return await fn(...(Object.values(context.globals || {})))
    } catch (error) {
      if (error instanceof Error) {
        throw new RuntimeError(error.message)
      }
      throw error
    }
  }

  createREPL(): PLREPL {
    return new PLREPL(this)
  }

  private wrapWithRuntime(code: string): string {
    return `
// PL Runtime
(function() {
  const print = (...args) => console.log(...args);
  const println = (...args) => console.log(...args);
  const len = (obj) => {
    if (Array.isArray(obj)) return obj.length;
    if (typeof obj === 'string') return obj.length;
    if (typeof obj === 'object' && obj !== null) return Object.keys(obj).length;
    throw new TypeError('Object has no length');
  };

  ${code}
})();
    `.trim()
  }

  private executeWithTimeout(fn: Function, timeout: number, ...args: any[]): any {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new RuntimeError(`Execution timeout after ${timeout}ms`))
      }, timeout)

      try {
        const result = fn(...args)
        clearTimeout(timer)
        resolve(result)
      } catch (error) {
        clearTimeout(timer)
        reject(error)
      }
    })
  }

  private async executeWithTimeoutAsync(fn: Function, timeout: number, ...args: any[]): Promise<any> {
    const timer = setTimeout(() => {
      throw new RuntimeError(`Execution timeout after ${timeout}ms`)
    }, timeout)

    try {
      const result = await fn(...args)
      clearTimeout(timer)
      return result
    } finally {
      clearTimeout(timer)
    }
  }

  private generateSourceMap(source: string, code: string): any {
    // Simplified source map generation
    return {
      version: 3,
      sources: ['input.pl'],
      names: [],
      mappings: ''
    }
  }
}

export class PLREPL {
  private readonly compiler: PLCompiler
  private readonly history: string[] = []
  private readonly context: Map<string, any> = new Map()

  constructor(compiler: PLCompiler) {
    this.compiler = compiler
  }

  evaluate(input: string): { output: any; errors: string[] } {
    this.history.push(input)

    try {
      const result = this.compiler.execute(input, {
        globals: Object.fromEntries(this.context)
      })

      return {
        output: result,
        errors: []
      }
    } catch (error) {
      return {
        output: null,
        errors: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  async evaluateAsync(input: string): Promise<{ output: any; errors: string[] }> {
    this.history.push(input)

    try {
      const result = await this.compiler.executeAsync(input, {
        globals: Object.fromEntries(this.context)
      })

      return {
        output: result,
        errors: []
      }
    } catch (error) {
      return {
        output: null,
        errors: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  getHistory(): string[] {
    return [...this.history]
  }

  clearHistory(): void {
    this.history.length = 0
  }

  setVariable(name: string, value: any): void {
    this.context.set(name, value)
  }

  getVariable(name: string): any {
    return this.context.get(name)
  }

  clearContext(): void {
    this.context.clear()
  }
}
