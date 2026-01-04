/**
 * PL Editor E2E Tests
 * Testing complete user workflows with Playwright
 */

import { test, expect, Page } from '@playwright/test'

test.describe('PL Editor Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pl/editor')
    await page.waitForLoadState('networkidle')
  })

  test('should load editor interface', async ({ page }) => {
    await expect(page.locator('[data-test="pl-editor"]')).toBeVisible()
    await expect(page.locator('[data-test="execute-btn"]')).toBeVisible()
    await expect(page.locator('[data-test="output-panel"]')).toBeVisible()
  })

  test('should execute hello world', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'print("Hello, World!")')
    await page.click('[data-test="execute-btn"]')
    await page.waitForSelector('[data-test="output"]')

    const output = page.locator('[data-test="output"]')
    await expect(output).toContainText('Hello, World!')
  })

  test('should display syntax errors', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'print("unclosed string')
    await page.click('[data-test="execute-btn"]')

    const error = page.locator('[data-test="error"]')
    await expect(error).toBeVisible()
    await expect(error).toContainText('SyntaxError')
  })

  test('should show line numbers', async ({ page }) => {
    const code = `print("line 1")
print("line 2")
print("line 3")`

    await page.fill('[data-test="pl-editor"]', code)

    const lineNumbers = page.locator('[data-test="line-numbers"]')
    await expect(lineNumbers).toContainText('1')
    await expect(lineNumbers).toContainText('2')
    await expect(lineNumbers).toContainText('3')
  })

  test('should provide syntax highlighting', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'let x = 10')

    const editor = page.locator('[data-test="pl-editor"]')
    const highlighted = await editor.evaluate((el: any) => {
      return el.innerHTML.includes('class="keyword"') ||
             el.innerHTML.includes('class="number"')
    })

    expect(highlighted).toBe(true)
  })

  test('should support autocomplete', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'let x = ')
    await page.keyboard.type('M')

    const autocomplete = page.locator('[data-test="autocomplete"]')
    await expect(autocomplete).toBeVisible()
    await expect(autocomplete).toContainText('Math')
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'print("test")')

    // Ctrl+Enter to execute
    await page.keyboard.press('Control+Enter')

    const output = page.locator('[data-test="output"]')
    await expect(output).toContainText('test')
  })

  test('should show execution metrics', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'for (let i = 0; i < 100; i++) { print(i) }')
    await page.click('[data-test="execute-btn"]')

    const metrics = page.locator('[data-test="execution-metrics"]')
    await expect(metrics).toBeVisible()
    await expect(metrics).toContainText('ms')
  })

  test('should support code sharing', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'print("Share me!")')
    await page.click('[data-test="share-btn"]')

    const shareUrl = page.locator('[data-test="share-url"]')
    await expect(shareUrl).toBeVisible()

    const url = await shareUrl.inputValue()
    expect(url).toContain('http')
  })

  test('should load shared code', async ({ page }) => {
    await page.goto('/pl/editor?code=cHJpbnQoIkhlbGxvISIp')
    await page.waitForLoadState('networkidle')

    const editor = page.locator('[data-test="pl-editor"]')
    await expect(editor).toContainText('print("Hello!")')
  })
})

test.describe('PL Authentication Flow', () => {
  test('should protect execution without auth', async ({ page }) => {
    await page.goto('/pl/editor')
    await page.fill('[data-test="pl-editor"]', 'print("test")')
    await page.click('[data-test="execute-btn"]')

    const loginPrompt = page.locator('[data-test="login-prompt"]')
    await expect(loginPrompt).toBeVisible()
  })

  test('should allow execution after login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('/pl/editor')
    await page.fill('[data-test="pl-editor"]', 'print("authenticated")')
    await page.click('[data-test="execute-btn"]')

    const output = page.locator('[data-test="output"]')
    await expect(output).toContainText('authenticated')
  })
})

test.describe('PL Error Recovery', () => {
  test('should continue after syntax error', async ({ page }) => {
    await page.goto('/pl/editor')

    await page.fill('[data-test="pl-editor"]', 'print("error)')
    await page.click('[data-test="execute-btn"]')
    await page.waitForTimeout(500)

    await page.fill('[data-test="pl-editor"]', 'print("fixed")')
    await page.click('[data-test="execute-btn"]')

    const output = page.locator('[data-test="output"]')
    await expect(output).toContainText('fixed')
  })

  test('should suggest error fixes', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'print("test')
    await page.click('[data-test="execute-btn"]')

    const suggestion = page.locator('[data-test="error-suggestion"]')
    await expect(suggestion).toBeVisible()
    await expect(suggestion).toContainText('Did you mean')
  })
})

test.describe('PL Performance', () => {
  test('should handle large outputs', async ({ page }) => {
    const largeCode = `
      for (let i = 0; i < 1000; i++) {
        print("Line " + i)
      }
    `

    await page.fill('[data-test="pl-editor"]', largeCode)
    await page.click('[data-test="execute-btn"]')

    const output = page.locator('[data-test="output"]')
    await expect(output).toContainText('Line 999')
  })

  test('should update metrics in real-time', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', `
      for (let i = 0; i < 10; i++) {
        print(i)
      }
    `)

    await page.click('[data-test="execute-btn"]')

    const metrics = page.locator('[data-test="execution-metrics"]')
    const durationBefore = await metrics.textContent()

    await page.waitForTimeout(100)
    const durationAfter = await metrics.textContent()

    expect(durationAfter).not.toBe(durationBefore)
  })
})

test.describe('PL Responsive Design', () => {
  test('should work on mobile', async ({ page, viewport }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/pl/editor')

    await expect(page.locator('[data-test="pl-editor"]')).toBeVisible()
    await expect(page.locator('[data-test="execute-btn"]')).toBeVisible()
  })

  test('should hide panels on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/pl/editor')

    const panels = page.locator('[data-test="side-panel"]')
    const isVisible = await panels.isVisible().catch(() => false)

    expect(isVisible).toBe(false)
  })

  test('should show mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/pl/editor')

    const menuToggle = page.locator('[data-test="mobile-menu-toggle"]')
    await expect(menuToggle).toBeVisible()

    await menuToggle.click()
    const menu = page.locator('[data-test="mobile-menu"]')
    await expect(menu).toBeVisible()
  })
})

test.describe('PL Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/pl/editor')

    const editor = page.locator('[data-test="pl-editor"]')
    await expect(editor).toHaveAttribute('aria-label', 'Code Editor')

    const executeBtn = page.locator('[data-test="execute-btn"]')
    await expect(executeBtn).toHaveAttribute('aria-label', 'Execute Code')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/pl/editor')

    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName)

    expect(focused).toBeDefined()
  })

  test('should announce screen reader updates', async ({ page }) => {
    await page.fill('[data-test="pl-editor"]', 'print("test")')
    await page.click('[data-test="execute-btn"]')

    const announcement = page.locator('[role="status"]')
    await expect(announcement).toBeVisible()
  })
})
