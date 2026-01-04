/**
 * Test Server Helper
 * Creates Express server for integration testing
 */

import express from 'express'
import { PLAPIRoutes } from '@/api/pl/routes'

export interface TestServer {
  app: express.Application
  server: any
  port: number
}

export async function createTestServer(): Promise<TestServer> {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Mock authentication middleware
  app.use((req, res, next) => {
    if (req.headers.authorization) {
      req.user = { id: 'test-user', email: 'test@example.com' }
    }
    next()
  })

  // PL API routes
  app.use('/api/pl', PLAPIRoutes)

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500).json({
      success: false,
      error: err.message
    })
  })

  // Start server
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = (server.address() as any).port
      resolve({ app, server, port })
    })
    server.on('error', reject)
  })
}

export async function stopTestServer(server: any): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => resolve())
  })
}
