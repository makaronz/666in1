# PL Language Documentation

## Overview

PL (Programming Language) is a simple, expressive programming language designed for web applications. It provides a clean syntax for scripting, data manipulation, and integration with JavaScript ecosystems.

## Version

Current Version: 1.0.0

## Quick Start

```javascript
import { execute, compile } from '@/pl'

// Execute PL code
const result = execute(`
  function greet(name) {
    println("Hello, " + name + "!")
  }
  greet("World")
`)

// Compile to JavaScript
const compiled = compile('var x = 42')
console.log(compiled.code)
```

## Language Syntax

### Variables

```pl
var name = "PL Language"
const version = 1.0
var count = 0
```

### Data Types

- **Number**: `42`, `3.14`, `1.5e10`
- **String**: `"hello"`, `'world'`
- **Boolean**: `true`, `false`
- **Null**: `null`
- **Array**: `[1, 2, 3]`
- **Object**: `{ name: "Alice", age: 30 }`

### Operators

#### Arithmetic
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `%` Modulo
- `^` Power

#### Comparison
- `==` Equal
- `!=` Not equal
- `<` Less than
- `>` Greater than
- `<=` Less or equal
- `>=` Greater or equal

#### Logical
- `and` Logical AND
- `or` Logical OR
- `not` Logical NOT

### Control Flow

#### If Statement
```pl
if (condition) {
  // code
} else {
  // code
}
```

#### While Loop
```pl
while (condition) {
  // code
}
```

#### For Loop
```pl
for (var i = 0; i < 10; i = i + 1) {
  // code
}
```

#### Switch Statement
```pl
switch (value) {
  case 1:
    // code
  case 2:
    // code
  default:
    // code
}
```

### Functions

#### Function Declaration
```pl
function add(a, b) {
  return a + b
}
```

#### Arrow Functions
```pl
var square = x -> x * 2
var add = (a, b) -> a + b
```

#### Higher-Order Functions
```pl
function map(arr, fn) {
  var result = []
  for (var i = 0; i < len(arr); i = i + 1) {
    push(result, fn(arr[i]))
  }
  return result
}
```

### Arrays

#### Array Operations
```pl
var numbers = [1, 2, 3, 4, 5]
push(numbers, 6)
var last = pop(numbers)
var length = len(numbers)
```

#### Array Iteration
```pl
for (var i = 0; i < len(arr); i = i + 1) {
  println(arr[i])
}
```

### Objects

#### Object Creation
```pl
var person = {
  name: "Alice",
  age: 30,
  greet: function() {
    println("Hi, I'm " + this.name)
  }
}
```

#### Object Access
```pl
println(person.name)
println(person["age"])
person.greet()
```

## Built-in Functions

### Console
- `print(...args)` - Print without newline
- `println(...args)` - Print with newline

### Array/String
- `len(obj)` - Get length of array or string
- `push(arr, item)` - Add item to array
- `pop(arr)` - Remove and return last item

### Object
- `keys(obj)` - Get object keys
- `values(obj)` - Get object values

### Type Conversion
- `parseInt(str, radix)` - Parse string to integer
- `parseFloat(str)` - Parse string to float
- `toString(value)` - Convert to string
- `type(value)` - Get type name

### Math
- `Math.random()` - Random number [0, 1)
- `Math.floor(x)` - Round down
- `Math.ceil(x)` - Round up
- `Math.round(x)` - Round to nearest
- `Math.abs(x)` - Absolute value
- `Math.min(...args)` - Minimum value
- `Math.max(...args)` - Maximum value
- `Math.pow(x, y)` - Power function
- `Math.sqrt(x)` - Square root

### String Methods
- `String.substring(str, start, end)` - Extract substring
- `String.toUpperCase(str)` - Convert to uppercase
- `String.toLowerCase(str)` - Convert to lowercase
- `String.trim(str)` - Remove whitespace

### Array Methods
- `Array.join(arr, separator)` - Join array elements
- `Array.reverse(arr)` - Reverse array in-place
- `Array.sort(arr, compareFn)` - Sort array

## Advanced Features

### Closures
```pl
function createCounter(start) {
  var count = start
  return function() {
    count = count + 1
    return count
  }
}

var counter = createCounter(0)
println(counter())  // 1
println(counter())  // 2
```

### Recursion
```pl
function factorial(n) {
  if (n <= 1) {
    return 1
  }
  return n * factorial(n - 1)
}
```

### Higher-Order Functions
```pl
function filter(arr, predicate) {
  var result = []
  for (var i = 0; i < len(arr); i = i + 1) {
    if (predicate(arr[i])) {
      push(result, arr[i])
    }
  }
  return result
}

var evens = filter([1, 2, 3, 4, 5], x -> x % 2 == 0)
```

### Method Chaining
```pl
var result = Array.reverse(Array.sort(numbers))
```

## Integration with JavaScript

### Calling JavaScript Functions
```pl
// JavaScript built-ins are available
var json = JSON.stringify({ name: "PL" })
var parsed = JSON.parse(json)
```

### Custom Runtime Context
```javascript
import { execute } from '@/pl'

const result = execute(`
  println(customMessage)
`, {
  globals: {
    customMessage: 'Hello from JavaScript!'
  }
})
```

## Best Practices

### 1. Use `const` for immutable values
```pl
const PI = 3.14159
const MAX_SIZE = 100
```

### 2. Prefer arrow functions for callbacks
```pl
var numbers = [1, 2, 3, 4, 5]
var doubled = map(numbers, x -> x * 2)
```

### 3. Use meaningful variable names
```pl
// Good
var userAge = 30

// Avoid
var x = 30
```

### 4. Handle errors gracefully
```pl
function safeDivide(a, b) {
  if (b == 0) {
    println("Error: Division by zero")
    return null
  }
  return a / b
}
```

### 5. Comment complex logic
```pl
// Calculate factorial using recursion
// Base case: 0! = 1 and 1! = 1
// Recursive case: n! = n * (n-1)!
function factorial(n) {
  if (n <= 1) {
    return 1
  }
  return n * factorial(n - 1)
}
```

## Performance Tips

1. **Pre-allocate arrays** when size is known
2. **Use built-in functions** instead of manual implementations
3. **Cache repeated calculations** in variables
4. **Avoid deep nesting** - use early returns
5. **Use appropriate data structures** (arrays vs objects)

## Examples

See `/src/pl/examples/` for complete examples:
- `basic.pl` - Basic syntax and features
- `advanced.pl` - Advanced patterns and techniques
- `chatgpt-integration.pl` - Integration with ChatGPT API

## API Reference

### Compiler API
```javascript
import { PLCompiler } from '@/pl'

const compiler = new PLCompiler()
const result = compiler.compile(source, {
  sourceMap: true,
  minify: false,
  runtime: true
})
```

### REPL API
```javascript
import { createREPL } from '@/pl'

const repl = createREPL()
const { output, errors } = repl.evaluate('1 + 1')
```

### Execution API
```javascript
import { execute, executeAsync } from '@/pl'

// Synchronous
const result = execute('var x = 42')

// Asynchronous
const result = await executeAsync('asyncFunction()')
```

## Error Handling

PL provides runtime errors for:
- Undefined variables
- Type mismatches
- Division by zero
- Invalid operations

Example:
```pl
try {
  var result = safeDivide(10, 0)
  if (result == null) {
    println("Division failed")
  }
} catch {
  println("An error occurred")
}
```

## Limitations

1. No class-based inheritance (use objects and functions)
2. No async/await syntax (use callbacks)
3. No destructuring (manual extraction required)
4. No spread operator (use push/concat)
5. No template literals (use string concatenation)

## Future Enhancements

Potential features for future versions:
- Async/await syntax
- Class declarations
- Pattern matching
- Module system
- Type annotations

## Resources

- Source: `/src/pl/`
- Examples: `/src/pl/examples/`
- Tests: `/tests/pl/`
- API: `/src/api/pl.ts`
- Component: `/src/components/pl-editor/PLEditor.vue`

## Support

For issues, questions, or contributions, please refer to the project repository.
