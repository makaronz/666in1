/**
 * PL Runtime Environment
 * Provides execution context and built-in functions for PL code
 */

export class RuntimeError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message)
    this.name = 'RuntimeError'
  }
}

export class ReturnValue {
  constructor(public value: any) {}
}

export class Environment {
  private readonly parent?: Environment
  private readonly values: Map<string, any> = new Map()

  constructor(parent?: Environment) {
    this.parent = parent
  }

  define(name: string, value: any): void {
    this.values.set(name, value)
  }

  get(name: string): any {
    if (this.values.has(name)) {
      return this.values.get(name)
    }

    if (this.parent) {
      return this.parent.get(name)
    }

    throw new RuntimeError(`Undefined variable '${name}'`)
  }

  assign(name: string, value: any): void {
    if (this.values.has(name)) {
      this.values.set(name, value)
      return
    }

    if (this.parent) {
      this.parent.assign(name, value)
      return
    }

    throw new RuntimeError(`Undefined variable '${name}'`)
  }
}

export class PLRuntime {
  private globals: Environment
  private environment: Environment
  private readonly locals: Map<any, Map<string, number>> = new Map()

  // Built-in functions
  private readonly builtins: Map<string, (...args: any[]) => any>

  constructor() {
    this.globals = new Environment()
    this.environment = this.globals

    this.builtins = new Map([
      ['print', this.print.bind(this)],
      ['println', this.println.bind(this)],
      ['len', this.len.bind(this)],
      ['push', this.push.bind(this)],
      ['pop', this.pop.bind(this)],
      ['keys', this.keys.bind(this)],
      ['values', this.values.bind(this)],
      ['type', this.type.bind(this)],
      ['parseInt', this.parseInt.bind(this)],
      ['parseFloat', this.parseFloat.bind(this)],
      ['toString', this.toString.bind(this)],
      ['Math.random', Math.random],
      ['Math.floor', Math.floor],
      ['Math.ceil', Math.ceil],
      ['Math.round', Math.round],
      ['Math.abs', Math.abs],
      ['Math.min', Math.min],
      ['Math.max', Math.max],
      ['Math.pow', Math.pow],
      ['Math.sqrt', Math.sqrt],
      ['String.substring', this.substring.bind(this)],
      ['String.toUpperCase', this.toUpperCase.bind(this)],
      ['String.toLowerCase', this.toLowerCase.bind(this)],
      ['String.trim', this.trim.bind(this)],
      ['Array.join', this.join.bind(this)],
      ['Array.reverse', this.reverse.bind(this)],
      ['Array.sort', this.sort.bind(this)]
    ])

    this.initializeBuiltins()
  }

  private initializeBuiltins(): void {
    this.builtins.forEach((func, name) => {
      if (name.includes('.')) {
        const parts = name.split('.')
        const obj = parts[0]
        const method = parts[1]

        if (!this.globals.get(obj)) {
          this.globals.define(obj, {})
        }

        const object = this.globals.get(obj)
        object[method] = func
      } else {
        this.globals.define(name, func)
      }
    })
  }

  // Built-in function implementations
  private print(...args: any[]): void {
    console.log(...args.map(arg => this.stringify(arg)))
  }

  private println(...args: any[]): void {
    console.log(...args.map(arg => this.stringify(arg)))
  }

  private len(obj: any): number {
    if (Array.isArray(obj)) return obj.length
    if (typeof obj === 'string') return obj.length
    if (typeof obj === 'object' && obj !== null) return Object.keys(obj).length
    throw new RuntimeError(`Object of type ${typeof obj} has no length`)
  }

  private push(arr: any[], item: any): number {
    return arr.push(item)
  }

  private pop(arr: any[]): any {
    return arr.pop()
  }

  private keys(obj: any): string[] {
    return Object.keys(obj)
  }

  private values(obj: any): any[] {
    return Object.values(obj)
  }

  private type(value: any): string {
    if (value === null) return 'null'
    if (Array.isArray(value)) return 'array'
    return typeof value
  }

  private parseInt(str: string, radix?: number): number {
    return radix ? parseInt(str, radix) : parseInt(str)
  }

  private parseFloat(str: string): number {
    return parseFloat(str)
  }

  private toString(value: any): string {
    return String(value)
  }

  private substring(str: string, start: number, end?: number): string {
    return end ? str.substring(start, end) : str.substring(start)
  }

  private toUpperCase(str: string): string {
    return str.toUpperCase()
  }

  private toLowerCase(str: string): string {
    return str.toLowerCase()
  }

  private trim(str: string): string {
    return str.trim()
  }

  private join(arr: any[], separator?: string): string {
    return arr.join(separator || ',')
  }

  private reverse(arr: any[]): any[] {
    return arr.reverse()
  }

  private sort(arr: any[], compareFn?: (a: any, b: any) => number): any[] {
    return arr.sort(compareFn)
  }

  private stringify(value: any): string {
    if (value === null) return 'null'
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    if (Array.isArray(value)) return `[${value.map(v => this.stringify(v)).join(', ')}]`
    if (typeof value === 'object') return `{${Object.keys(value).map(k => `${k}: ${this.stringify(value[k])}`).join(', ')}}`
    return String(value)
  }

  // Environment management
  getGlobals(): Environment {
    return this.globals
  }

  getCurrentEnvironment(): Environment {
    return this.environment
  }

  pushEnvironment(): Environment {
    const newEnv = new Environment(this.environment)
    this.environment = newEnv
    return newEnv
  }

  popEnvironment(): void {
    this.environment = this.environment!.parent!
  }

  // Variable resolution
  resolve(name: string, depth: number): void {
    if (!this.locals.has(depth)) {
      this.locals.set(depth, new Map())
    }
    this.locals.get(depth)!.set(name, depth)
  }

  resolveLocal(name: string): any {
    return this.lookup name(name)
  }

  private lookup name(name: string, distance: number): any {
    // Simplified lookup - in real implementation, traverse environment chain
    return this.environment.get(name)
  }
}
