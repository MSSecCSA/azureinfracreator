# Claude Development Instructions

## Core Principles

### 1. Code Quality Standards
- **File Size**: Keep files under 500 lines for maintainability
- **Modularity**: One responsibility per class/module
- **Naming**: Use camelCase for variables/functions, PascalCase for classes
- **Imports**: Use relative imports within packages, absolute from @/ root
- **Formatting**: 2-space indentation, trailing semicolons required

### 2. TypeScript Requirements
- **Strict Mode**: Always enabled (no `any` types)
- **Type Safety**: All functions must have parameter and return types
- **Interfaces**: Define interfaces for all data structures
- **Error Types**: Create specific error classes, don't throw generic Errors
- **Generics**: Use where appropriate for reusable components

### 3. Testing Standards
- **Unit Tests**: Test all services in isolation
- **Coverage**: Target >80% code coverage
- **Mocking**: Mock Azure SDK responses, use jest.mock()
- **Naming**: Test files mirror source structure (service.ts → service.test.ts)
- **Setup**: Use beforeEach/afterEach for test isolation
- **Assertions**: Clear, descriptive test names and assertions

**Example**:
```typescript
describe('VMService', () => {
  it('should create VM with security defaults', async () => {
    // Arrange, Act, Assert pattern
  });
});
```

### 4. Documentation Standards
- **README**: Update when adding major features or dependencies
- **Code Comments**: Explain WHY, not WHAT (code shows WHAT)
- **JSDoc**: Use for public APIs
- **Architecture**: Document design decisions in memory-bank/
- **Examples**: Provide usage examples for complex services

**Good Comment**:
```typescript
// Retry on transient Azure API failures (408, 429, 503)
// but fail immediately on auth errors (401, 403)
```

**Bad Comment**:
```typescript
// Try to create the VM
vmService.createVM()
```

### 5. Security Guardrails
- **No Secrets in Code**: Never hardcode API keys, connection strings, etc.
- **Validate Inputs**: All user inputs must be validated
- **Secure Storage**: Use Azure Key Vault for production secrets
- **Error Messages**: Don't leak sensitive info in error messages
- **Logging**: Don't log secrets even in debug mode

### 6. Task Management
- **Immediate Updates**: Mark tasks complete in `.claude/memory-bank/tasks.md` as soon as they're done
- **Sub-tasks**: Break work into discrete, completable units (2-8 hours each)
- **Discovered Work**: Add unexpected tasks to "Discovered During Work" section
- **Notes**: Document blockers or decisions made during implementation
- **Status**: Always keep progress.md updated with current status

### 7. File Operations
- **Verification**: Always confirm file paths exist before operations
- **Preservation**: Never delete or modify existing code unless explicitly instructed
- **Backups**: For critical changes, maintain previous versions
- **Relative Paths**: Use relative paths when within the project

### 8. Module Boundaries
Respect these module boundaries:
- `src/cli/*` - User interface (TUI menus, prompts)
- `src/services/*` - Business logic (Azure operations, validation)
- `src/config/*` - Configuration management and constants
- `src/templates/*` - Reusable templates (RBAC, NSG rules, etc.)

**Cross-module rules**:
- CLI calls Services (not directly calling Azure SDKs)
- Services use Config and Templates
- Never import CLI code into Services

## Development Workflow

### When Starting a New Feature

1. **Check Memory Bank**
   - Read `projectbrief.md` for context
   - Read `activeContext.md` for current focus
   - Read `tasks.md` for what you're doing
   - Read `techContext.md` for architecture

2. **Plan Before Coding**
   - Identify which service(s) are involved
   - Design the module structure
   - Write tests first (TDD approach)
   - Review with architecture in mind

3. **Implement**
   - Write the service layer first
   - Add CLI interface second
   - Follow TypeScript strict mode
   - Add comprehensive tests

4. **Document**
   - Update `tasks.md` - mark as complete
   - Update `progress.md` - note what was done
   - Add comments explaining complex logic
   - Update README if user-facing

5. **Commit**
   - Clear, descriptive commit message
   - Include what changed and why
   - Reference task number in commit

### During Implementation

**If you discover new work**:
- Add to "Discovered During Work" section in tasks.md
- Estimate the effort
- Note dependencies
- Continue with current task

**If you hit a blocker**:
- Document clearly in activeContext.md
- Explain what's blocking and why
- Propose a workaround if possible
- Don't proceed without clarification

**If you need to refactor**:
- Document the refactoring reason
- Ensure all tests still pass
- Update any affected documentation
- Note in commit message

## Code Review Checklist

Before committing, verify:

- [ ] All tests pass (`npm test`)
- [ ] TypeScript strict mode passes (`npm run build`)
- [ ] Code follows naming conventions
- [ ] No hardcoded secrets or sensitive data
- [ ] Error messages are helpful
- [ ] Comments explain WHY not WHAT
- [ ] Task marked complete in tasks.md
- [ ] Commit message is clear

## Common Pitfalls to Avoid

❌ **Don't**:
- Hardcode secrets or API keys
- Skip error handling
- Write files without checking paths first
- Create extra complexity "for the future"
- Leave failing tests
- Forget to update documentation

✅ **Do**:
- Validate all inputs
- Write tests as you code
- Verify file paths exist
- Keep it simple
- Fix tests immediately
- Update docs and tasks

## When in Doubt

Ask me to clarify:
- Architecture decisions
- Design approach
- Which service handles this
- Whether something needs a test
- How to structure a component
