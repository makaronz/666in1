/**
 * PL API Integration Tests
 * Testing API endpoints, WebSocket connections, and authentication
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PLAPIRoutes } from '@/api/pl/routes'
import { createTestServer } from '@/tests/helpers/server'
import { validPLCode, invalidPLCode } from '@/tests/fixtures/code-samples/pl-samples'

describe('PL API Integration', () => {
  let app: express.Application
  let server: any

  beforeAll(async () => {
    const testServer = await createTestServer()
    app = testServer.app
    server = testServer.server
  })

  afterAll(async () => {
    if (server) {
      await server.close()
    }
  })

  describe('POST /api/pl/execute', () => {
    describe('Valid Execution', () => {
      it('should execute valid PL code', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: validPLCode.helloWorld })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.output).toContain('Hello, World!')
        expect(response.body.duration).toBeDefined()
      })

      it('should execute fibonacci function', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: validPLCode.fibonacci })
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.output).toBeDefined()
      })

      it('should handle loop iterations', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: validPLCode.loops })
          .expect(200)

        expect(response.body.success).toBe(true)
        for (let i = 0; i < 10; i++) {
          expect(response.body.output).toContain(i.toString())
        }
      })

      it('should return execution metrics', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: validPLCode.helloWorld })
          .expect(200)

        expect(response.body.duration).toBeGreaterThan(0)
        expect(response.body.memoryUsed).toBeDefined()
      })
    })

    describe('Error Handling', () => {
      it('should return 400 for syntax errors', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: invalidPLCode.syntaxError.missingParen })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('SyntaxError')
      })

      it('should return 400 for runtime errors', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: invalidPLCode.runtimeError.undefinedVariable })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('ReferenceError')
      })

      it('should return 408 for timeout errors', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: invalidPLCode.infiniteLoop.whileTrue })
          .expect(408)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Timeout')
      })

      it('should return 413 for oversized payloads', async () => {
        const largeCode = 'print("' + 'a'.repeat(1000000) + '")'
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: largeCode })
          .expect(413)

        expect(response.body.success).toBe(false)
      })
    })

    describe('Security', () => {
      it('should require authentication', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .set('Authorization', 'Bearer invalid-token')
          .send({ code: validPLCode.helloWorld })
          .expect(401)

        expect(response.body.success).toBe(false)
      })

      it('should block dangerous code', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: invalidPLCode.securityRisk.prototypePollution })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Security')
      })

      it('should enforce rate limiting', async () => {
        const requests = Array(100).fill(null).map(() =>
          request(app)
            .post('/api/pl/execute')
            .send({ code: validPLCode.helloWorld })
        )

        const responses = await Promise.all(requests)
        const rateLimited = responses.filter(r => r.status === 429)

        expect(rateLimited.length).toBeGreaterThan(0)
      })

      it('should sanitize input', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: '<script>alert("XSS")</script>' })
          .expect(400)

        expect(response.body.success).toBe(false)
      })
    })

    describe('Content Validation', () => {
      it('should reject empty code', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: '' })
          .expect(400)

        expect(response.body.success).toBe(false)
      })

      it('should reject non-string code', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({ code: 123 })
          .expect(400)

        expect(response.body.success).toBe(false)
      })

      it('should reject missing code field', async () => {
        const response = await request(app)
          .post('/api/pl/execute')
          .send({})
          .expect(400)

        expect(response.body.success).toBe(false)
      })
    })
  })

  describe('GET /api/pl/validate', () => {
    it('should validate correct code', async () => {
      const response = await request(app)
        .get('/api/pl/validate')
        .query({ code: validPLCode.helloWorld })
        .expect(200)

      expect(response.body.valid).toBe(true)
      expect(response.body.errors).toHaveLength(0)
    })

    it('should detect syntax errors', async () => {
      const response = await request(app)
        .get('/api/pl/validate')
        .query({ code: invalidPLCode.syntaxError.missingParen })
        .expect(200)

      expect(response.body.valid).toBe(false)
      expect(response.body.errors.length).toBeGreaterThan(0)
    })

    it('should return line and column numbers', async () => {
      const response = await request(app)
        .get('/api/pl/validate')
        .query({ code: invalidPLCode.syntaxError.unclosedString })
        .expect(200)

      expect(response.body.valid).toBe(false)
      expect(response.body.errors[0]).toHaveProperty('line')
      expect(response.body.errors[0]).toHaveProperty('column')
    })
  })

  describe('WebSocket /api/pl/stream', () => {
    it('should establish connection', async () => {
      const ws = new WebSocket('ws://localhost:3000/api/pl/stream')

      await new Promise((resolve, reject) => {
        ws.on('open', resolve)
        ws.on('error', reject)
      })

      ws.close()
    })

    it('should stream execution output', async () => {
      const ws = new WebSocket('ws://localhost:3000/api/pl/stream')

      const outputPromise = new Promise((resolve) => {
        ws.on('message', (data) => {
          const message = JSON.parse(data.toString())
          if (message.type === 'output') {
            resolve(message.data)
          }
        })
      })

      ws.send(JSON.stringify({
        type: 'execute',
        code: validPLCode.helloWorld
      }))

      const output = await outputPromise
      expect(output).toContain('Hello')

      ws.close()
    })

    it('should handle connection errors', async () => {
      const ws = new WebSocket('ws://localhost:3000/api/pl/stream')

      const errorPromise = new Promise((resolve) => {
        ws.on('message', (data) => {
          const message = JSON.parse(data.toString())
          if (message.type === 'error') {
            resolve(message.data)
          }
        })
      })

      ws.send(JSON.stringify({
        type: 'execute',
        code: invalidPLCode.syntaxError.missingParen
      }))

      const error = await errorPromise
      expect(error).toContain('SyntaxError')

      ws.close()
    })

    it('should close connections cleanly', async () => {
      const ws = new WebSocket('ws://localhost:3000/api/pl/stream')

      await new Promise((resolve) => {
        ws.on('open', () => {
          ws.send(JSON.stringify({ type: 'close' }))
        })
        ws.on('close', resolve)
      })
    })
  })
})
