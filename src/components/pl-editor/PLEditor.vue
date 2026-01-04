<template>
  <div class="pl-editor-container">
    <div class="pl-editor-header">
      <h3>PL Language Editor</h3>
      <div class="actions">
        <n-button size="small" @click="loadExample('basic')">
          Basic Example
        </n-button>
        <n-button size="small" @click="loadExample('advanced')">
          Advanced Example
        </n-button>
        <n-button size="small" @click="loadExample('chatgpt')">
          ChatGPT Example
        </n-button>
        <n-button size="small" type="primary" @click="executeCode" :loading="executing">
          Run
        </n-button>
        <n-button size="small" @click="clearAll">
          Clear
        </n-button>
      </div>
    </div>

    <div class="pl-editor-content">
      <div class="editor-section">
        <div class="section-header">
          <span>Input</span>
          <span class="stats">{{ codeStats }}</span>
        </div>
        <n-input
          v-model:value="code"
          type="textarea"
          placeholder="Enter PL code here..."
          :autosize="{ minRows: 20, maxRows: 30 }"
          @input="onCodeChange"
          class="pl-input"
        />
      </div>

      <div class="output-section">
        <div class="section-header">
          <span>Output</span>
          <n-button size="tiny" @click="clearOutput">
            Clear Output
          </n-button>
        </div>
        <div class="output-content" :class="{ 'has-error': hasError }">
          <pre v-if="output">{{ output }}</pre>
          <div v-else class="placeholder">
            Run your code to see output here...
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSyntaxHelp" class="syntax-help">
      <div class="help-header">
        <h4>PL Language Quick Reference</h4>
        <n-button size="tiny" @click="showSyntaxHelp = false">
          Close
        </n-button>
      </div>
      <div class="help-content">
        <h5>Variables</h5>
        <pre><code>var x = 10
const name = "PL"</code></pre>

        <h5>Functions</h5>
        <pre><code>function add(a, b) {
  return a + b
}

// Arrow function
var square = x -> x * x</code></pre>

        <h5>Control Flow</h5>
        <pre><code>if (x > 0) {
  println("Positive")
} else {
  println("Negative")
}

while (x < 10) {
  x = x + 1
}</code></pre>

        <h5>Built-in Functions</h5>
        <pre><code>print(value)
println(value)
len(array/string)
push(array, item)
pop(array)</code></pre>
      </div>
    </div>

    <div class="pl-editor-footer">
      <n-button text @click="showSyntaxHelp = !showSyntaxHelp">
        {{ showSyntaxHelp ? 'Hide' : 'Show' }} Syntax Help
      </n-button>
      <span class="version">PL v{{ version }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NInput } from 'naive-ui'
import { execute, executeAsync, VERSION } from '@/pl'

const code = ref('')
const output = ref('')
const executing = ref(false)
const hasError = ref(false)
const showSyntaxHelp = ref(false)
const version = VERSION

const codeStats = computed(() => {
  const lines = code.value.split('\n').length
  const chars = code.value.length
  const words = code.value.trim().split(/\s+/).filter(w => w.length > 0).length
  return `${lines} lines | ${chars} chars | ${words} words`
})

const onCodeChange = () => {
  hasError.value = false
}

const executeCode = async () => {
  if (!code.value.trim()) {
    output.value = 'Please enter some PL code to execute.'
    return
  }

  executing.value = true
  hasError.value = false

  try {
    // Capture console output
    const logs: string[] = []
    const originalLog = console.log
    console.log = (...args: any[]) => {
      logs.push(args.map(arg => String(arg)).join(' '))
      originalLog(...args)
    }

    const startTime = Date.now()

    // Try async execution first, fall back to sync
    try {
      const result = await executeAsync(code.value)
      const executionTime = Date.now() - startTime

      console.log = originalLog

      if (logs.length > 0) {
        output.value = logs.join('\n')
      } else if (result !== undefined) {
        output.value = String(result)
      } else {
        output.value = 'Code executed successfully (no output)'
      }

      output.value += `\n\nExecution time: ${executionTime}ms`
    } catch (asyncError) {
      // Try sync execution
      try {
        const result = execute(code.value)
        const executionTime = Date.now() - startTime

        console.log = originalLog

        if (logs.length > 0) {
          output.value = logs.join('\n')
        } else if (result !== undefined) {
          output.value = String(result)
        } else {
          output.value = 'Code executed successfully (no output)'
        }

        output.value += `\n\nExecution time: ${executionTime}ms`
      } catch (syncError: any) {
        console.log = originalLog
        hasError.value = true
        output.value = `Error: ${syncError.message || syncError}`
      }
    }
  } catch (error: any) {
    hasError.value = true
    output.value = `Error: ${error.message || error}`
  } finally {
    executing.value = false
  }
}

const clearOutput = () => {
  output.value = ''
  hasError.value = false
}

const clearAll = () => {
  code.value = ''
  clearOutput()
}

const loadExample = async (type: 'basic' | 'advanced' | 'chatgpt') => {
  try {
    let exampleCode = ''

    switch (type) {
      case 'basic':
        exampleCode = await import('@/pl/examples/basic.pl?raw')
        break
      case 'advanced':
        exampleCode = await import('@/pl/examples/advanced.pl?raw')
        break
      case 'chatgpt':
        exampleCode = await import('@/pl/examples/chatgpt-integration.pl?raw')
        break
    }

    code.value = exampleCode.default || exampleCode
    clearOutput()
  } catch (error: any) {
    hasError.value = true
    output.value = `Failed to load example: ${error.message}`
  }
}
</script>

<style scoped>
.pl-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.pl-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pl-editor-header h3 {
  margin: 0;
  color: #333;
}

.actions {
  display: flex;
  gap: 8px;
}

.pl-editor-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
  min-height: 400px;
}

.editor-section,
.output-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #e8e8e8;
  border-bottom: 1px solid #d0d0d0;
}

.stats {
  font-size: 12px;
  color: #666;
}

.pl-input {
  flex: 1;
}

.pl-input :deep(.n-input__textarea-el) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.output-content {
  flex: 1;
  padding: 12px;
  overflow: auto;
  background: #fafafa;
}

.output-content.has-error {
  background: #fff5f5;
  color: #c00;
}

.output-content pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.placeholder {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.syntax-help {
  margin-top: 16px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #e8e8e8;
  border-bottom: 1px solid #d0d0d0;
}

.help-header h4 {
  margin: 0;
}

.help-content {
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.help-content h5 {
  margin: 16px 0 8px 0;
  color: #333;
}

.help-content h5:first-child {
  margin-top: 0;
}

.help-content pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.help-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.pl-editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #d0d0d0;
}

.version {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .pl-editor-content {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-wrap: wrap;
  }
}
</style>
