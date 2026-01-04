// PL Language - Advanced Examples
// Demonstrates advanced language features

// Recursion and memoization
function fibonacci(n) {
  if (n <= 1) {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// Closures
function createCounter(start) {
  var count = start
  return function() {
    count = count + 1
    return count
  }
}

// Class-like patterns using objects and functions
function createPerson(name, age) {
  return {
    name: name,
    age: age,
    greet: function() {
      println("Hi, I'm " + this.name + ", " + this.age + " years old")
    },
    haveBirthday: function() {
      this.age = this.age + 1
      println(this.name + " is now " + this.age)
    }
  }
}

// Switch statement
function getDayName(dayNum) {
  switch (dayNum) {
    case 0:
      return "Sunday"
    case 1:
      return "Monday"
    case 2:
      return "Tuesday"
    case 3:
      return "Wednesday"
    case 4:
      return "Thursday"
    case 5:
      return "Friday"
    case 6:
      return "Saturday"
    default:
      return "Invalid day"
  }
}

// Array operations
function bubbleSort(arr) {
  var n = len(arr)
  for (var i = 0; i < n - 1; i = i + 1) {
    for (var j = 0; j < n - i - 1; j = j + 1) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

// String operations
function reverseString(str) {
  var reversed = ""
  for (var i = len(str) - 1; i >= 0; i = i - 1) {
    reversed = reversed + str[i]
  }
  return reversed
}

// Higher-order utilities
function reduce(arr, fn, initial) {
  var result = initial
  for (var i = 0; i < len(arr); i = i + 1) {
    result = fn(result, arr[i])
  }
  return result
}

function compose(f, g) {
  return function(x) {
    return f(g(x))
  }
}

// Async-like patterns using callbacks
function fetchData(url, callback) {
  // Simulated async operation
  println("Fetching data from " + url + "...")
  setTimeout(function() {
    callback({ data: "Sample data from " + url })
  }, 1000)
}

// Error handling patterns
function safeDivide(a, b) {
  if (b == 0) {
    println("Error: Division by zero")
    return null
  }
  return a / b
}

// Run examples
println("=== Fibonacci ===")
println("Fibonacci(10) = " + fibonacci(10))

println("\n=== Closures ===")
var counter = createCounter(0)
println("Counter: " + counter())
println("Counter: " + counter())
println("Counter: " + counter())

println("\n=== Objects ===")
var person = createPerson("Bob", 25)
person.greet()
person.haveBirthday()

println("\n=== Switch ===")
for (var i = 0; i < 3; i = i + 1) {
  println("Day " + i + " is " + getDayName(i))
}

println("\n=== Sorting ===")
var unsorted = [64, 34, 25, 12, 22, 11, 90]
println("Unsorted: " + toString(unsorted))
println("Sorted: " + toString(bubbleSort(unsorted)))

println("\n=== String ===")
println("Reverse 'hello' = " + reverseString("hello"))

println("\n=== Reduce ===")
var sum = reduce([1, 2, 3, 4, 5], function(acc, x) { return acc + x }, 0)
println("Sum: " + sum)

println("\n=== Safe Operations ===")
println("10 / 2 = " + safeDivide(10, 2))
println("10 / 0 = " + safeDivide(10, 0))
