/**
 * PL Code Samples for Testing
 * Valid and invalid code patterns for comprehensive test coverage
 */

export const validPLCode = {
  helloWorld: `print("Hello, World!")`,

  fibonacci: `
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
print(fibonacci(10))
`,

  loops: `
for (let i = 0; i < 10; i++) {
  print(i)
}
`,

  conditionals: `
let x = 10
if (x > 5) {
  print("x is greater than 5")
} else {
  print("x is less than or equal to 5")
}
`,

  functions: `
function greet(name) {
  return "Hello, " + name + "!"
}
print(greet("World"))
`,

  arrays: `
let numbers = [1, 2, 3, 4, 5]
for (let num in numbers) {
  print(num * 2)
}
`,

  recursion: `
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}
print(factorial(5))
`,

  scope: `
let x = 10
function outer() {
  let x = 20
  function inner() {
    let x = 30
    print(x)
  }
  inner()
  print(x)
}
outer()
print(x)
`,

  complexLogic: `
function isPrime(n) {
  if (n < 2) return false
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false
  }
  return true
}

for (let i = 2; i <= 20; i++) {
  if (isPrime(i)) {
    print(i + " is prime")
  }
}
`,

  stringOperations: `
let str = "Hello, World!"
print(str.length)
print(str.toUpperCase())
print(str.substring(0, 5))
print(str.split(", "))
`
}

export const invalidPLCode = {
  syntaxError: {
    unclosedString: `print("Hello, World)`,
    missingParen: `print "Hello, World!"`,
    invalidOperator: `let x = 5 ++ 3`,
    incompleteBlock: `if (true) { print("test")`,
    invalidIdentifier: `let 123abc = 5`
  },

  runtimeError: {
    undefinedVariable: `print(undefinedVariable)`,
    divisionByZero: `print(10 / 0)`,
    nullReference: `let x = null; print(x.length)`,
    typeError: `print("5" + 5)`,
    invalidFunctionCall: `print(nonExistentFunction())`
  },

  infiniteLoop: {
    whileTrue: `while (true) { print("loop") }`,
    forInfinity: `for (let i = 0; i >= 0; i++) { print(i) }`,
    recursiveNoBase: `
function infiniteRecurse() {
  infiniteRecurse()
}
infiniteRecurse()
`
  },

  securityRisk: {
    prototypePollution: `Object.prototype polluted = true`,
    evalLike: `eval("print('dangerous')")`,
    dangerousImport: `import('fs')`,
    systemAccess: `require('child_process')`
  }
}

export const edgeCases = {
  empty: ``,
  whitespace: `   \n\t   `,
  singleToken: `print`,
  veryLongString: `print("${'a'.repeat(10000)}")`,
  deeplyNested: `
function a() {
  function b() {
    function c() {
      function d() {
        function e() {
          print("deep")
        }
        e()
      }
      d()
    }
    c()
  }
  b()
}
a()
`,
  unicode: `print("Hello 世界 🌍")`,
  specialChars: `print("Test\\n\\t\\r\\\\"`)`,
  largeArray: `
let arr = []
for (let i = 0; i < 10000; i++) {
  arr.push(i)
}
print(arr.length)
`
}

export const performanceTestCases = {
  smallProgram: validPLCode.helloWorld,
  mediumProgram: validPLCode.fibonacci,
  largeProgram: `
${Array(100).fill(0).map((_, i) =>
  `function test${i}() { return ${i} }`
).join('\n')}
`,

  computationallyIntensive: `
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}
print(fib(35))
`,

  memoryIntensive: `
let largeArray = []
for (let i = 0; i < 100000; i++) {
  largeArray.push({ id: i, data: "test data " + i })
}
print(largeArray.length)
`
}

export const apiTestCases = {
  validExecution: {
    code: validPLCode.helloWorld,
    expectedOutput: 'Hello, World!'
  },

  syntaxErrorResponse: {
    code: invalidPLCode.syntaxError.missingParen,
    expectedError: 'SyntaxError'
  },

  runtimeErrorResponse: {
    code: invalidPLCode.runtimeError.undefinedVariable,
    expectedError: 'ReferenceError'
  },

  timeoutResponse: {
    code: invalidPLCode.infiniteLoop.whileTrue,
    expectedError: 'TimeoutError'
  },

  quotaExceeded: {
    code: edgeCases.veryLongString,
    expectedError: 'QuotaExceededError'
  }
}
