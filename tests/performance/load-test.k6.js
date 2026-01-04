/**
 * PL API Load Tests
 * K6 performance testing for API endpoints
 */

import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },     // Ramp up to 50 users
    { duration: '2m', target: 100 },    // Ramp up to 100 users
    { duration: '1m', target: 0 },      // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
  },
}

const validCode = 'print("Hello, World!")'
const invalidCode = 'print("unclosed string'

export default function () {
  // Test execution endpoint
  const executePayload = JSON.stringify({ code: validCode })
  const executeParams = {
    headers: { 'Content-Type': 'application/json' },
  }

  const executeRes = http.post(`${BASE_URL}/api/pl/execute`, executePayload, executeParams)

  check(executeRes, {
    'execute status is 200': (r) => r.status === 200,
    'execute response time < 500ms': (r) => r.timings.duration < 500,
    'execute has output': (r) => JSON.parse(r.body).output !== undefined,
  })

  sleep(1)

  // Test validation endpoint
  const validatePayload = JSON.stringify({ code: validCode })
  const validateRes = http.post(`${BASE_URL}/api/pl/validate`, validatePayload, executeParams)

  check(validateRes, {
    'validate status is 200': (r) => r.status === 200,
    'validate response time < 100ms': (r) => r.timings.duration < 100,
    'validate returns valid': (r) => JSON.parse(r.body).valid === true,
  })

  sleep(1)

  // Test error handling
  const errorPayload = JSON.stringify({ code: invalidCode })
  const errorRes = http.post(`${BASE_URL}/api/pl/execute`, errorPayload, executeParams)

  check(errorRes, {
    'error status is 400': (r) => r.status === 400,
    'error has message': (r) => JSON.parse(r.body).error !== undefined,
  })

  sleep(2)
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data),
  }
}
