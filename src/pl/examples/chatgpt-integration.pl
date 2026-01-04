// PL Language - ChatGPT Integration Example
// Shows how to use PL for ChatGPT web interactions

// API client functions
function createChatMessage(role, content) {
  return {
    role: role,
    content: content
  }
}

function formatChatHistory(messages) {
  var formatted = []
  for (var i = 0; i < len(messages); i = i + 1) {
    push(formatted, messages[i].role + ": " + messages[i].content)
  }
  return toString(formatted)
}

// Message handling
function processUserInput(input, history) {
  // Add user message to history
  push(history, createChatMessage("user", input))

  // Generate response (simulated)
  var response = generateResponse(history)

  // Add assistant response to history
  push(history, createChatMessage("assistant", response))

  return response
}

function generateResponse(history) {
  // Simulated response generation
  var lastUserMessage = history[len(history) - 1].content

  if (len(lastUserMessage) > 100) {
    return "That's quite a detailed message! Let me help you with that."
  } else if (lastUserMessage includes "?") {
    return "That's an interesting question! Let me think about it."
  } else {
    return "I understand. How can I assist you further?"
  }
}

// Conversation flow
function startConversation() {
  var chatHistory = []
  var running = true

  println("=== ChatGPT PL Integration ===")
  println("Type 'quit' to exit")

  while (running) {
    println("\nYou: ")
    var input = // Would be read from input in real implementation

    if (input == "quit") {
      running = false
    } else {
      var response = processUserInput(input, chatHistory)
      println("\nAssistant: " + response)
    }
  }

  println("\n=== Chat History ===")
  println(formatChatHistory(chatHistory))
}

// Utility functions
function countTokens(text) {
  // Simplified token counting
  var words = split(text, " ")
  return len(words)
}

function truncateMessage(message, maxTokens) {
  var currentTokens = countTokens(message)

  if (currentTokens <= maxTokens) {
    return message
  }

  var words = split(message, " ")
  var truncated = ""

  for (var i = 0; i < maxTokens; i = i + 1) {
    truncated = truncated + words[i] + " "
  }

  return trim(truncated) + "..."
}

// Example usage
var messages = [
  createChatMessage("system", "You are a helpful assistant."),
  createChatMessage("user", "Hello! How are you?")
]

println("Initial Messages:")
println(formatChatHistory(messages))

var response = processUserInput("I'm doing great! Can you help me with something?", messages)
println("\nResponse: " + response)

println("\nToken counting:")
println("Message has " + countTokens("This is a test message") + " tokens")

println("\nMessage truncation:")
var longMessage = "This is a very long message that should be truncated to fit within a certain token limit"
println("Original: " + longMessage)
println("Truncated: " + truncateMessage(longMessage, 10))
