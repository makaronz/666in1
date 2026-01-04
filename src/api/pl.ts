/**
 * PL Language API
 * REST API endpoints for PL code execution and compilation
 */

import axios from 'axios'

export interface PLExecutionRequest {
  code: string
  context?: Record<string, any>
  timeout?: number
  async?: boolean
}

export interface PLExecutionResponse {
  output: any
  errors: string[]
  executionTime: number
}

export interface PLCompileRequest {
  code: string
  options?: {
    sourceMap?: boolean
    minify?: boolean
    runtime?: boolean
  }
}

export interface PLCompileResponse {
  code: string
  errors: string[]
  warnings: string[]
  sourceMap?: any
}

export interface PLValidationRequest {
  code: string
}

export interface PLValidationResponse {
  valid: boolean
  errors: string[]
  warnings: string[]
  ast?: any
}

export class PLAPI {
  private readonly baseURL: string

  constructor(baseURL: string = '/api/pl') {
    this.baseURL = baseURL
  }

  /**
   * Execute PL code
   */
  async execute(request: PLExecutionRequest): Promise<PLExecutionResponse> {
    try {
      const response = await axios.post<PLExecutionResponse>(
        `${this.baseURL}/execute`,
        request
      )
      return response.data
    } catch (error: any) {
      throw new Error(`PL execution failed: ${error.message}`)
    }
  }

  /**
   * Execute PL code asynchronously
   */
  async executeAsync(request: PLExecutionRequest): Promise<PLExecutionResponse> {
    try {
      const response = await axios.post<PLExecutionResponse>(
        `${this.baseURL}/execute/async`,
        {
          ...request,
          async: true
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`PL async execution failed: ${error.message}`)
    }
  }

  /**
   * Compile PL code to JavaScript
   */
  async compile(request: PLCompileRequest): Promise<PLCompileResponse> {
    try {
      const response = await axios.post<PLCompileResponse>(
        `${this.baseURL}/compile`,
        request
      )
      return response.data
    } catch (error: any) {
      throw new Error(`PL compilation failed: ${error.message}`)
    }
  }

  /**
   * Validate PL code syntax
   */
  async validate(request: PLValidationRequest): Promise<PLValidationResponse> {
    try {
      const response = await axios.post<PLValidationResponse>(
        `${this.baseURL}/validate`,
        request
      )
      return response.data
    } catch (error: any) {
      throw new Error(`PL validation failed: ${error.message}`)
    }
  }

  /**
   * Format PL code
   */
  async format(code: string): Promise<{ formatted: string; errors: string[] }> {
    try {
      const response = await axios.post<{ formatted: string; errors: string[] }>(
        `${this.baseURL}/format`,
        { code }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`PL formatting failed: ${error.message}`)
    }
  }

  /**
   * Get PL language examples
   */
  async getExamples(): Promise<
    Array<{ name: string; description: string; code: string }>
  > {
    try {
      const response = await axios.get<
        Array<{ name: string; description: string; code: string }>
      >(`${this.baseURL}/examples`)
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch examples: ${error.message}`)
    }
  }

  /**
   * Get PL language documentation
   */
  async getDocumentation(): Promise<{
    version: string
    syntax: any
    builtinFunctions: Array<{ name: string; signature: string; description: string }>
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/docs`)
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch documentation: ${error.message}`)
    }
  }
}

// Export singleton instance
export const plAPI = new PLAPI()

// Export for testing
export { PLAPI }
