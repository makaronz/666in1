// PL Language - Quick Start Guide
// Run this file in the PL editor to test the language

// ============================================
// 1. VARIABLES AND DATA TYPES
// ============================================

println("=== Variables and Types ===")

var name = "PL Language"
const version = 1.0
var isActive = true
var nothing = null

println("Name: " + name)
println("Version: " + version)
println("Active: " + toString(isActive))
println("Nothing: " + toString(nothing))

// ============================================
// 2. ARRAYS AND OBJECTS
// ============================================

println("\n=== Arrays and Objects ===")

var numbers = [1, 2, 3, 4, 5]
var person = {
  name: "Alice",
  age: 30,
  city: "NYC"
}

println("Numbers: " + toString(numbers))
println("Person: " + toString(person))
println("First number: " + numbers[0])
println("Person name: " + person.name)

// ============================================
// 3. FUNCTIONS
// ============================================

println("\n=== Functions ===")

function add(a, b) {
  return a + b
}

function greet(name) {
  println("Hello, " + name + "!")
}

var square = x -> x * 2

println("5 + 3 = " + add(5, 3))
greet("PL User")
println("Square of 7: " + square(7))

// ============================================
// 4. CONTROL FLOW
// ============================================

println("\n=== Control Flow ===")

// If statement
var x = 10
if (x > 5) {
  println(toString(x) + " is greater than 5")
} else {
  println(toString(x) + " is not greater than 5")
}

// While loop
println("Countdown:")
var count = 5
while (count > 0) {
  println(count)
  count = count - 1
}
println("Liftoff!")

// For loop
println("Squares:")
for (var i = 1; i <= 5; i = i + 1) {
  println(toString(i) + " squared = " + toString(i * i))
}

// ============================================
// 5. BUILT-IN FUNCTIONS
// ============================================

println("\n=== Built-in Functions ===")

println("Length of array: " + len(numbers))
println("Type of name: " + type(name))

push(numbers, 6)
println("After push: " + toString(numbers))

var last = pop(numbers)
println("Popped: " + toString(last))
println("After pop: " + toString(numbers))

// ============================================
// 6. HIGHER-ORDER FUNCTIONS
// ============================================

println("\n=== Higher-Order Functions ===")

function mapArray(arr, fn) {
  var result = []
  for (var i = 0; i < len(arr); i = i + 1) {
    push(result, fn(arr[i]))
  }
  return result
}

var doubled = mapArray([1, 2, 3], x -> x * 2)
println("Doubled: " + toString(doubled))

// ============================================
// 7. CLOSURES
// ============================================

println("\n=== Closures ===")

function createCounter(start) {
  var count = start
  return function() {
    count = count + 1
    return count
  }
}

var counter = createCounter(0)
println("Counter 1: " + toString(counter()))
println("Counter 2: " + toString(counter()))
println("Counter 3: " + toString(counter()))

// ============================================
// 8. RECURSION
// ============================================

println("\n=== Recursion ===")

function factorial(n) {
  if (n <= 1) {
    return 1
  }
  return n * factorial(n - 1)
}

println("5! = " + toString(factorial(5)))

function fibonacci(n) {
  if (n <= 1) {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

println("Fibonacci(10) = " + toString(fibonacci(10)))

// ============================================
// 9. STRING OPERATIONS
// ============================================

println("\n=== String Operations ===")

var text = "  Hello, PL!  "
println("Original: '" + text + "'")
println("Trimmed: '" + String.trim(text) + "'")
println("Upper: '" + String.toUpperCase(text) + "'")
println("Lower: '" + String.toLowerCase(text) + "'")
println("Substring: '" + String.substring(text, 2, 7) + "'")

// ============================================
// 10. MATH OPERATIONS
// ============================================

println("\n=== Math Operations ===")

println("Random: " + toString(Math.random()))
println("Floor 3.7: " + toString(Math.floor(3.7)))
println("Ceil 3.2: " + toString(Math.ceil(3.2)))
println("Round 3.5: " + toString(Math.round(3.5)))
println("Abs -5: " + toString(Math.abs(-5)))
println("Min(1, 5, 3): " + toString(Math.min(1, 5, 3)))
println("Max(1, 5, 3): " + toString(Math.max(1, 5, 3)))
println("Power 2^8: " + toString(Math.pow(2, 8)))
println("Sqrt 16: " + toString(Math.sqrt(16)))

println("\n=== Quick Start Complete! ===")
println("PL Language is ready to use!")
