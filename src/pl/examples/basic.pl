// PL Language - Basic Examples
// This file demonstrates basic PL language syntax

// Variable declarations
var name = "PL Language"
const version = 1.0

// Functions
function greet(name) {
  println("Hello, " + name + "!")
}

function add(a, b) {
  return a + b
}

// Control flow
function factorial(n) {
  if (n <= 1) {
    return 1
  } else {
    return n * factorial(n - 1)
  }
}

// Loops
function sumArray(arr) {
  var sum = 0
  for (var i = 0; i < len(arr); i = i + 1) {
    sum = sum + arr[i]
  }
  return sum
}

// Arrays and objects
var numbers = [1, 2, 3, 4, 5]
var person = {
  name: "Alice",
  age: 30,
  city: "NYC"
}

// Higher-order functions
function map(arr, fn) {
  var result = []
  for (var i = 0; i < len(arr); i = i + 1) {
    push(result, fn(arr[i]))
  }
  return result
}

function filter(arr, fn) {
  var result = []
  for (var i = 0; i < len(arr); i = i + 1) {
    if (fn(arr[i])) {
      push(result, arr[i])
    }
  }
  return result
}

// Run examples
greet("World")
println("5! = " + factorial(5))
println("Sum of [1,2,3,4,5] = " + sumArray(numbers))
println("Double numbers: " + toString(map(numbers, x -> x * 2)))
println("Even numbers: " + toString(filter(numbers, x -> x % 2 == 0)))
