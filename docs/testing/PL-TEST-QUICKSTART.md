# PL Testing Quick Start Guide

**Author**: Tester Agent (Hive Mind Collective)
**Version**: 1.0.0
**Last Updated**: 2026-01-04

## Quick Start

### Installation
```bash
# Install test dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install --with-deps
```

### Running Tests

#### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run in watch mode (development)
npm run test:unit:watch

# Run with coverage
npm run test:coverage
```

#### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

#### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run on specific browser
npx playwright test --project=chromium
```

#### Performance Tests
```bash
# Run benchmarks
npm run test:bench

# Run load tests (requires k6)
k6 run tests/performance/load-test.k6.js
```

#### Security Tests
```bash
# Run security tests
npm run test:security
```

### Test Structure

```
tests/
├── unit/              # Unit tests (60%)
│   ├── parser/       # PL parser tests
│   ├── executor/     # PL executor tests
│   ├── syntax/       # Syntax validation tests
│   └── utils/        # Utility function tests
├── integration/      # Integration tests (30%)
│   ├── api/          # API endpoint tests
│   ├── websocket/    # WebSocket tests
│   └── frontend/     # Frontend integration tests
├── e2e/             # E2E tests (10%)
│   ├── workflows/    # User workflow tests
│   └── scenarios/    # User scenario tests
├── performance/     # Performance tests
│   ├── pl-bench.test.ts      # Benchmarks
│   └── load-test.k6.js       # Load tests
├── security/        # Security tests
│   ├── injection/    # Injection prevention tests
│   └── limits/       # Resource limit tests
└── fixtures/        # Test data
    ├── code-samples/ # PL code samples
    └── mock-responses/ # API mocks
```

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { PLParser } from '@/pl/parser/PLParser'

describe('PLParser', () => {
  it('should parse variable declarations', () => {
    const parser = new PLParser()
    const ast = parser.parse('let x = 10')
    expect(ast.body[0].type).toBe('VariableDeclaration')
  })
})
```

### Integration Test Example
```typescript
import request from 'supertest'
import app from '@/app'

describe('PL API', () => {
  it('should execute code', async () => {
    const response = await request(app)
      .post('/api/pl/execute')
      .send({ code: 'print("test")' })
      .expect(200)

    expect(response.body.output).toContain('test')
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should execute code in editor', async ({ page }) => {
  await page.goto('/pl/editor')
  await page.fill('[data-test="pl-editor"]', 'print("Hello")')
  await page.click('[data-test="execute-btn"]')

  await expect(page.locator('[data-test="output"]'))
    .toContainText('Hello')
})
```

## Coverage Goals

- **Statements**: ≥90%
- **Branches**: ≥85%
- **Functions**: ≥90%
- **Lines**: ≥90%

## CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

Pipeline stages:
1. Unit Tests (with coverage)
2. Integration Tests
3. E2E Tests (multi-browser)
4. Performance Benchmarks
5. Load Tests (K6)
6. Security Tests

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (Vitest) |
| `npm run test:unit` | Run unit tests with coverage |
| `npm run test:unit:watch` | Watch mode for development |
| `npm run test:integration` | Run integration tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E with UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:bench` | Run performance benchmarks |
| `npm run test:security` | Run security tests |

## Troubleshooting

### Tests Failing Locally
```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm ci

# Reset Playwright
npx playwright install --force --with-deps
```

### Coverage Not Generating
```bash
# Check vitest config
cat vitest.config.ts

# Run coverage explicitly
npm run test:coverage -- --reporter=verbose
```

### E2E Tests Flaky
```bash
# Run with retries
npx playwright test --retries=3

# Run in headed mode to debug
npx playwright test --headed
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Fast Execution**: Unit tests should run in <100ms
3. **Clear Names**: Test names should describe what and why
4. **One Assertion**: Prefer single assertion per test
5. **Mock External**: Mock external dependencies
6. **Test Data**: Use fixtures for consistency
7. **Error Messages**: Provide helpful failure messages

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)

## Support

For issues or questions:
1. Check existing tests for patterns
2. Review test strategy documentation
3. Consult framework documentation
4. Contact hive mind via hooks

---

**Remember**: Tests are a safety net for confident development. Invest in quality tests, they pay dividends in maintainability!
