# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Azure Infrastructure Creator** is a secure, interactive CLI tool for provisioning Azure infrastructure following best practices and least privilege principles. The tool uses a TUI (Terminal User Interface) to guide users through resource creation with built-in security, compliance, and Azure Well-Architected Framework alignment.

**Key Goals**: Security-first, user-friendly, extensible CLI for enterprise Azure infrastructure provisioning.

> **⭐ IMPORTANT**: For comprehensive security architecture, cost optimization, and compliance guidance, see `.claude/instructions/security-architecture-guide.md` - This is your north star for all security and architecture decisions. Created by microsoft-learn-researcher with 50+ Microsoft Learn citations.

## Essential Commands

### Development
```bash
npm run dev          # Run with ts-node in development mode (live changes)
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled version from dist/
npm run lint         # Check code quality with ESLint
npm run format       # Format code with Prettier
npm test             # Run Jest tests (when configured)
```

### Building & Deployment
```bash
npm install          # Install dependencies
npm run build        # TypeScript strict mode compilation
```

### Testing (Future)
```bash
npm test -- src/services/[service].test.ts  # Run specific test file
npm test -- --watch                          # Watch mode
npm test -- --coverage                       # Coverage report
```

## Architecture Overview

### Three-Layer Design

```
User Interface Layer (src/cli/)
    ↓ calls
Service Layer (src/services/)
    ↓ calls
Azure SDKs (@azure/arm-*, @azure/identity)
```

**CLI Layer** (`src/cli/*`):
- TUI menu interfaces using inquirer.js
- User prompts and confirmations
- Progress indicators with Ora spinner
- Colored output with Chalk
- **Never calls Azure SDKs directly**

**Service Layer** (`src/services/*`):
- Business logic and Azure operations
- Authentication and credential management
- Error handling with retry logic
- RBAC and security policy enforcement
- Configuration management
- **Core implementation goes here**

**Configuration & Templates** (`src/config/*`, `src/templates/*`):
- Default values and constants
- RBAC role templates
- NSG rule templates
- Encryption configuration templates

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Language | TypeScript 5.3+ | Type-safe development, strict mode |
| Build | TypeScript Compiler | ES2020 target with declaration maps |
| CLI Framework | Commander.js | Command parsing (future expansion) |
| TUI | Inquirer.js + Chalk + Ora | Interactive menus, colors, spinners |
| Azure | @azure/arm-* packages | Azure resource management |
| Auth | @azure/identity | DefaultAzureCredential chain |
| Linting | ESLint + TypeScript parser | Code quality |
| Formatting | Prettier | Code formatting (2-space indent) |

## Code Organization

```
src/
├── index.ts                 # Entry point, CLI app initialization
├── cli/
│   ├── main.ts             # Main menu & orchestration (TUI entry)
│   ├── vm.ts               # VM provisioning workflow
│   ├── storage.ts          # Storage account workflow
│   ├── database.ts         # Database provisioning workflow
│   ├── network.ts          # Network resource workflow
│   └── config.ts           # Configuration management workflow
├── services/
│   ├── auth.ts             # Authentication (DefaultAzureCredential)
│   ├── azure-client.ts     # Azure SDK wrapper & client
│   ├── config.ts           # Config file management
│   ├── vm.ts               # VM provisioning logic
│   ├── storage.ts          # Storage provisioning logic
│   ├── database.ts         # Database provisioning logic
│   ├── network.ts          # Network provisioning logic
│   ├── rbac.ts             # RBAC management & policies
│   ├── keyvault.ts         # Key Vault operations
│   └── logger.ts           # Logging utilities
├── config/
│   ├── constants.ts        # App constants (colors, defaults)
│   └── defaults.ts         # Default configurations
└── templates/
    ├── rbac.ts             # RBAC role definitions
    ├── nsg-rules.ts        # Network Security Group rules
    └── encryption.ts       # Encryption policies

.claude/                     # Claude Code integration (documented separately in .claude/README.md)
├── memory-bank/           # Project context & tracking
├── instructions/          # Development guidance
├── templates/             # Planning & task templates
└── chatmodes/             # Workflow modes (PLAN, IMPLEMENT, REFLECT)
```

## Key Design Patterns

### Service Pattern with Dependency Injection
```typescript
class VMService {
  constructor(private azureClient: AzureClient) {}

  async createVM(params: VMParams): Promise<VM> {
    // Business logic here
  }
}
```

### CLI Wizard Pattern
```typescript
async createResourceWizard() {
  const input1 = await inquirer.prompt([...]); // Step 1
  const input2 = await inquirer.prompt([...]); // Step 2
  const confirmed = await inquirer.prompt([...]); // Review & confirm
  // Call service layer
}
```

### Error Handling with Helpful Messages
- Catch specific Azure SDK errors
- Provide actionable remediation steps
- Use chalk for color-coded output
- Log for debugging without exposing secrets

### RBAC by Default
- Every resource gets appropriate managed identity
- Follow least privilege principle
- Use templates for consistent role assignments
- Never create overly permissive roles

## TypeScript Standards

**Strict Mode is Required**:
- No `any` types (use `unknown` if necessary)
- All function parameters and returns must be typed
- Interfaces for all data structures
- Create specific error classes

**File Structure**:
- Max 500 lines per file
- One responsibility per class
- camelCase for variables/functions
- PascalCase for classes/interfaces
- 2-space indentation

**Example**:
```typescript
// ✓ GOOD
async createVM(params: VMParams): Promise<VM> {
  if (!params.name) throw new ValidationError('Name required');
  const vm = await this.client.create(params);
  return vm;
}

// ✗ BAD
async createVM(params: any): Promise<any> {
  const vm = await this.client.create(params);
  return vm;
}
```

## Development Workflow

### Before Starting Work

1. **Understand the context** (read `.claude/memory-bank/`):
   - `projectbrief.md` - Project vision
   - `activeContext.md` - Current focus
   - `tasks.md` - What needs to be done
   - `techContext.md` - Architecture decisions

2. **For new features**: Follow PLAN mode (`.claude/chatmodes/PLAN.md`)
   - Determine complexity level
   - Design before coding
   - Validate technology choices

3. **During implementation**: Follow IMPLEMENT mode (`.claude/chatmodes/IMPLEMENT.md`)
   - Write tests first (TDD)
   - Mark tasks complete as you go
   - Update progress.md

4. **After completing work**: Use REFLECT mode (`.claude/chatmodes/REFLECT.md`)
   - Document lessons learned
   - Update memory bank

### Code Review Checklist

Before committing:

- [ ] TypeScript strict mode: clean (no errors)
- [ ] Code follows naming conventions (camelCase/PascalCase)
- [ ] No hardcoded secrets (use Azure Key Vault)
- [ ] Error messages are helpful to users
- [ ] Comments explain WHY, not WHAT
- [ ] All public APIs have JSDoc
- [ ] No console.logs or debug code
- [ ] Task marked complete in `.claude/memory-bank/tasks.md`

## Azure Best Practices

### Security (Always)
- **Least Privilege**: Minimal required permissions only
- **No Hardcoded Secrets**: All secrets in Azure Key Vault
- **Input Validation**: Validate all user inputs
- **Managed Identities**: Prefer over service principals
- **Encryption**: At rest (TDE, CMK) and in transit (HTTPS)
- **RBAC**: Explicit role assignments, not admin access

### Resource Provisioning
- System-assigned managed identities by default
- Encryption enabled by default
- Monitoring and logging configured
- Firewall/NSG with least privilege rules
- Private endpoints preferred over public

### Compliance
- Align with Azure Well-Architected Framework
- CIS Azure Foundations Benchmark compliance
- PCI-DSS ready (if handling card data)
- HIPAA considerations (if healthcare)
- SOC 2 audit logging

**See `.claude/instructions/azure-best-practices.md` for detailed guidance.**

## TUI & CLI Development

### Chalk Color Conventions
```typescript
chalk.blue.bold()   // Headers, section titles
chalk.green()       // Success, checkmarks (✓)
chalk.yellow()      // Warnings (⚠)
chalk.red()         // Errors (❌)
chalk.gray()        // Secondary info
chalk.cyan()        // Important values
```

### Inquirer.js Patterns
- Use `type: 'list'` for single selection
- Use `type: 'checkbox'` for multiple
- Add `validate` for input constraints
- Use `when` for conditional questions
- Provide sensible defaults

### Ora Spinners for Long Operations
```typescript
const spinner = ora('Creating VM...').start();
try {
  const result = await service.create(params);
  spinner.succeed(`Created: ${result.id}`);
} catch (error) {
  spinner.fail(`Error: ${error.message}`);
}
```

**See `.claude/instructions/cli-development-guide.md` for examples.**

## Module Boundaries (Important)

**CLI modules** (`src/cli/*`):
- ONLY call Service layer
- ONLY interact with users
- NEVER call Azure SDKs directly
- NEVER contain business logic

**Service modules** (`src/services/*`):
- ONLY call Azure SDKs or other services
- NEVER directly interact with CLI/prompts
- Handle all errors and retries
- Implement all business logic

**Config/Templates**:
- Reusable constants and defaults
- Used by both CLI and services

This separation makes testing and refactoring easier.

## Testing Strategy (When Ready)

### Unit Tests
- Mock Azure SDK responses
- Test each service method
- Test error paths (not just happy path)
- Test validation
- Target >80% coverage

### Integration Tests
- Test end-to-end workflows
- Use actual Azure SDK (against test subscription)
- Clean up test resources after

### Manual Testing
- Full user workflow
- Cross-platform (Windows/Mac/Linux)
- Different Azure roles
- Slow network conditions

Test files mirror source structure:
- `src/services/vm.ts` → `src/services/vm.test.ts`
- Use Jest framework

## Getting Unstuck

| Question | Reference |
|----------|-----------|
| **"How should I architect the security?"** | **`.claude/instructions/security-architecture-guide.md`** ⭐ |
| "What are we building?" | `.claude/memory-bank/projectbrief.md` |
| "What should I code next?" | `.claude/memory-bank/tasks.md` |
| "How should I structure this?" | `.claude/memory-bank/techContext.md` |
| "What code patterns to use?" | `.claude/instructions/claude-instructions.md` |
| "Azure security best practices?" | `.claude/instructions/security-architecture-guide.md` (comprehensive) or `.claude/instructions/azure-best-practices.md` (detailed) |
| "Cost optimization for resources?" | `.claude/instructions/security-architecture-guide.md` - Section 3 |
| "Compliance mapping (CIS/PCI-DSS/HIPAA)?" | `.claude/instructions/security-architecture-guide.md` - Section 6 |
| "How to build a CLI menu?" | `.claude/instructions/cli-development-guide.md` |
| "How to approach a feature?" | `.claude/chatmodes/PLAN.md` |
| "How to implement?" | `.claude/chatmodes/IMPLEMENT.md` |

## Common Pitfalls to Avoid

❌ **Don't**:
- Hardcode secrets or API keys anywhere
- Skip error handling or tests
- Mix CLI logic with service logic
- Use `any` types (TypeScript strict mode)
- Commit debug code or console.logs
- Modify existing code without understanding it
- Assume Azure API behavior (test it)
- Leave tasks incomplete without updating tasks.md

✅ **Do**:
- Validate all user inputs
- Handle errors with helpful messages
- Write tests before code (TDD)
- Keep files under 500 lines
- Use specific error classes
- Document WHY, not WHAT
- Update memory bank as you work
- Test on real Azure (test subscription)

## Dependency Management

**Direct dependencies** (in package.json):
- @azure/arm-* (v33.0.0+) - Azure resource management
- @azure/identity (v4.0.0+) - Authentication
- inquirer (v8.2.5+) - Interactive prompts
- chalk (v5.3.0+) - Terminal colors
- ora (v8.0.0+) - Spinners
- commander (v11.1.0+) - CLI framework

**Dev dependencies** (in package.json):
- TypeScript (v5.3.2+)
- ESLint + TypeScript parser
- Prettier

**Update strategy**:
- Regular dependency updates (monthly)
- Security patches (immediate)
- Major version changes (quarterly review)

## Commit Message Format

```
[TASK X.Y] Brief description of what changed

Longer explanation of:
- What was implemented
- Why this approach was chosen
- Any important decisions or trade-offs

Task: Phase X.Y reference
```

Example:
```
[TASK 2.1] Implement AuthService with DefaultAzureCredential

- Created AuthService class with credential chaining
- Supports environment variables, managed identity, user login
- Added error handling for common auth failures
- Includes unit tests for all auth flows

Task: Phase 2.1 - Core Infrastructure
```

## Additional Resources

### Primary References
- **`.claude/instructions/security-architecture-guide.md`** ⭐ - Comprehensive security, cost, and compliance guide (50+ Microsoft Learn citations)
- `.claude/README.md` - Claude Code integration overview
- `.claude/memory-bank/` - Project context and tracking
- `.claude/instructions/` - All development guidance and best practices
- `README.md` - User-facing project documentation

### External Resources
- Azure Docs: https://docs.microsoft.com/azure/
- Well-Architected Framework: https://docs.microsoft.com/azure/architecture/framework/
- Azure Security Benchmark: https://learn.microsoft.com/security/benchmark/azure/
- CIS Microsoft Azure Foundations Benchmark: https://www.cisecurity.org/cis-benchmarks/
