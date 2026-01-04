/**
 * PL Language - Main Entry Point
 * A simple, expressive programming language for web applications
 */

export { Lexer, TokenType, Token } from './parser/lexer'
export {
  Parser,
  NodeType,
  ASTNode,
  ProgramNode,
  StatementNode,
  ExpressionNode,
  BlockNode,
  ExpressionStatementNode,
  IfStatementNode,
  WhileStatementNode,
  ForStatementNode,
  ReturnStatementNode,
  BreakStatementNode,
  ContinueStatementNode,
  VariableDeclarationNode,
  FunctionDeclarationNode,
  SwitchStatementNode,
  CaseStatementNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  AssignmentExpressionNode,
  LogicalExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  IdentifierNode,
  LiteralNode,
  ArrayExpressionNode,
  ObjectExpressionNode,
  PropertyNode,
  ArrowFunctionExpressionNode,
  ConditionalExpressionNode
} from './parser/parser'

export { Transpiler } from './transpiler/transpiler'
export { PLRuntime, RuntimeError, Environment, ReturnValue } from './runtime/runtime'
export { PLCompiler, PLREPL, CompileOptions, CompileResult, ExecutionContext } from './compiler/compiler'

// Convenience exports
export function compile(source: string, options?: CompileOptions): CompileResult {
  const compiler = new PLCompiler()
  return compiler.compile(source, options)
}

export function execute(source: string, context?: ExecutionContext): any {
  const compiler = new PLCompiler()
  return compiler.execute(source, context)
}

export async function executeAsync(source: string, context?: ExecutionContext): Promise<any> {
  const compiler = new PLCompiler()
  return await compiler.executeAsync(source, context)
}

export function createREPL(): PLREPL {
  const compiler = new PLCompiler()
  return compiler.createREPL()
}

// Version
export const VERSION = '1.0.0'
