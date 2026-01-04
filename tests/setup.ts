import { expect, beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/vue'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Global test utilities
global.testUtils = {
  waitForAnimationFrame: () =>
    new Promise(resolve => requestAnimationFrame(resolve)),

  delay: (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms)),

  createMockEvent: (type: string, data?: any) =>
    new CustomEvent(type, { detail: data })
}

// Mock APIs that don't exist in test environment
global.fetch = vi.fn()
window.scrollTo = vi.fn()

// Performance tracking
const performanceMetrics: Map<string, number[]> = new Map()

beforeAll(() => {
  // Setup performance monitoring
  global.performance.mark('test-suite-start')
})

afterAll(() => {
  global.performance.mark('test-suite-end')
  global.performance.measure(
    'total-test-suite-time',
    'test-suite-start',
    'test-suite-end'
  )
})
