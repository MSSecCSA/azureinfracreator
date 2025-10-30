# IMPLEMENT Mode - Build & Execution

## Purpose
Write code, create tests, and implement features following the PLANNING and TASKS documents.

## When to Use
- After PLAN mode completes
- When implementing from TASKS document
- Building new components
- Fixing identified bugs

## Pre-Implementation Checklist

Before starting implementation:

- [ ] PLANNING.md exists and is clear
- [ ] TASKS.md exists with breakdown
- [ ] PLANNING has been reviewed
- [ ] Technology stack validated
- [ ] No blockers identified
- [ ] Project structure ready

## Implementation Process

### 1. Setup Phase
```
- Review current TASKS.md
- Understand which phase we're in
- Check project structure
- Ensure build works
- Run existing tests
```

### 2. Task Selection
```
- Choose next incomplete task
- Read full task description
- Understand acceptance criteria
- Identify dependencies
- Check for blockers
```

### 3. Implementation
```
- Follow TypeScript best practices (strict mode)
- Write tests alongside code (TDD)
- Follow module organization
- Add proper error handling
- Include logging/debugging
- Update documentation
```

### 4. Verification
```
- Run all tests
- Check TypeScript compilation
- Manual testing of features
- Verify acceptance criteria met
```

### 5. Commit & Mark Complete
```
- Clear, descriptive commit message
- Reference task in commit
- Mark task COMPLETE in tasks.md
- Update progress.md
```

## Workflow for Each Task

### Step 1: Understand the Task

```
Read the task:
- What exactly needs to be built?
- What are the acceptance criteria?
- What should NOT be done?
- What are the dependencies?
- What tests are needed?
```

### Step 2: Design Before Coding

```
For each task:
- Sketch the architecture
- Identify required files/classes
- List all methods needed
- Design test cases
- Review with best practices
```

### Step 3: Test-Driven Development (TDD)

```
1. Write the test (it should fail)
   - What behavior should exist?
   - What edge cases?
   - What error conditions?

2. Write minimal code to pass test
   - Just enough to pass
   - Don't over-engineer

3. Refactor
   - Clean up code
   - Remove duplicates
   - Add comments

4. Repeat for next test
```

**Example - TDD Flow**:
```typescript
// 1. Write the test FIRST
describe('VMService', () => {
  it('should create VM with managed identity', async () => {
    const service = new VMService(client);
    const vm = await service.createVM({ name: 'test-vm' });
    expect(vm.identity.type).toBe('SystemAssigned');
  });
});

// 2. Test fails (red)

// 3. Write minimal code to pass
class VMService {
  async createVM(params: VMParams): Promise<VM> {
    return { ...params, identity: { type: 'SystemAssigned' } };
  }
}

// 4. Test passes (green)

// 5. Refactor if needed
// ... add error handling, validation, etc.
```

### Step 4: Implementation Loop

For each component in the task:

1. **Create the file**
   ```bash
   src/services/[component].ts  # Implementation
   src/services/[component].test.ts  # Tests
   ```

2. **Write interfaces/types**
   ```typescript
   interface VMParams {
     name: string;
     size: string;
     location: string;
   }

   interface VM {
     id: string;
     name: string;
     // ...
   }
   ```

3. **Write the class/function**
   ```typescript
   export class VMService {
     async createVM(params: VMParams): Promise<VM> {
       // Implementation with proper typing
     }
   }
   ```

4. **Write tests**
   ```typescript
   describe('VMService.createVM', () => {
     it('should handle success', async () => {});
     it('should handle auth error', async () => {});
     it('should handle validation error', async () => {});
   });
   ```

5. **Run tests**
   ```bash
   npm test -- src/services/vm.test.ts
   ```

6. **Add to module exports**
   ```typescript
   export { VMService } from './vm';
   ```

### Step 5: Integration

Once service layer is complete:

1. **Create CLI component**
   ```typescript
   src/cli/vm.ts
   ```

2. **Import the service**
   ```typescript
   import { VMService } from '../services/vm';
   ```

3. **Build the TUI workflow**
   ```typescript
   async createVMWorkflow() {
     const params = await inquirer.prompt([...]);
     const service = new VMService(this.client);
     const vm = await service.createVM(params);
     // Show success
   }
   ```

4. **Test the workflow**
   - Run end-to-end
   - Test error cases
   - Verify user experience

### Step 6: Error Handling

For EVERY error scenario:

```typescript
try {
  const resource = await azureClient.create(params);
  spinner.succeed(`Created: ${resource.id}`);
} catch (error) {
  if (error instanceof CredentialUnavailableError) {
    spinner.fail('Authentication required');
    console.error(chalk.red('Run: az login'));
  } else if (error.code === 'ResourceExistsError') {
    spinner.fail('Resource already exists');
  } else {
    spinner.fail(`Error: ${error.message}`);
  }
  throw error;
}
```

### Step 7: Logging & Debugging

Add meaningful logs:

```typescript
// Good logging
logger.debug(`Creating VM with params: ${JSON.stringify(params)}`);
logger.info(`VM creation started: ${params.name}`);
logger.error(`Failed to create VM: ${error.message}`);

// Avoid
console.log('test');  // ❌ Unprofessional
logger.debug(params); // ❌ Might include sensitive data
```

### Step 8: Documentation

As you code:

```typescript
/**
 * Create a new Azure Virtual Machine with security defaults
 * @param params VM configuration parameters
 * @returns Created VM object
 * @throws {ValidationError} If params are invalid
 * @throws {CredentialUnavailableError} If not authenticated
 */
async createVM(params: VMParams): Promise<VM> {
  // Why we do this, not what we do
  // This retry logic handles transient Azure API failures
  return withRetry(async () => {
    // Implementation
  });
}
```

## Code Organization During Implementation

### Keep Files Small

Each file should have ONE responsibility:

```
✅ GOOD:
src/services/vm.ts          (just VM logic)
src/services/vm.test.ts     (just VM tests)
src/cli/vm.ts               (just VM UI)

❌ BAD:
src/services/everything.ts  (VM + storage + network)
```

### Module Imports

Use this order:

```typescript
// External packages
import { Client } from '@azure/client';
import inquirer from 'inquirer';

// Internal services
import { ConfigService } from './config';
import { logger } from './logger';

// Types/interfaces
import type { VMParams } from '../types';

// Exports
export class VMService { }
```

### TypeScript Strict Mode

Every file must compile in strict mode:

```typescript
// ✅ Good
async function create(name: string): Promise<VM> {
  if (!name) throw new Error('Name required');
  // ...
}

// ❌ Bad - TypeScript errors in strict mode
async function create(name: any): Promise<any> {
  // ...
}
```

## Testing During Implementation

### Unit Tests

Test each service method:

```typescript
describe('VMService', () => {
  let service: VMService;

  beforeEach(() => {
    // Mock Azure client
    const mockClient = {
      virtualmachines: { createOrUpdate: jest.fn() }
    };
    service = new VMService(mockClient as any);
  });

  it('should create VM with managed identity', async () => {
    mockClient.virtualmachines.createOrUpdate.mockResolvedValueOnce({
      id: '/subscriptions/sub/resource/vm',
      name: 'test-vm'
    });

    const vm = await service.createVM({
      name: 'test-vm',
      size: 'Standard_B2s'
    });

    expect(vm.name).toBe('test-vm');
    expect(mockClient.virtualmachines.createOrUpdate).toHaveBeenCalled();
  });

  it('should throw on validation error', async () => {
    expect(() => service.createVM({ name: '' })).toThrow();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/services/vm.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Debugging

### When Tests Fail

```
1. Read the error message carefully
2. Is it a code error or logic error?
3. Check TypeScript compilation
4. Review the test - is it correct?
5. Add console.log (temporary) to debug
6. Use debugger if needed
```

### When Code Works But Feels Wrong

```
1. Check if it matches the design
2. Review best practices
3. Ask: "Will future me understand this?"
4. Refactor if needed
5. Make sure tests still pass
```

## Verification Checklist

Before marking task COMPLETE:

- [ ] All code written for task
- [ ] All tests written and passing
- [ ] TypeScript strict mode: clean
- [ ] No console.logs or debug code
- [ ] Error handling complete
- [ ] Comments explain WHY not WHAT
- [ ] Acceptance criteria met
- [ ] Integration with existing code works
- [ ] No breaking changes

## Commit Message Format

```
[TASK] Brief description of what changed

More detailed explanation of:
- What changed and why
- Acceptance criteria met
- Any trade-offs made

References:
- Task: Phase X.Y
- Related: PR #123
```

Example:
```
[TASK 2.2] Implement VMService with Azure SDK

- Created VMService class with createVM method
- Added managed identity setup by default
- Integrated with DefaultAzureCredential
- Full error handling with retry logic
- 100% test coverage
- Ready for CLI integration

Task: Phase 2.2 - Core Implementation
```

## Transitions

**During IMPLEMENT**:
- → **Back to PLAN**: If complexity changes or design issues found
  - Document what changed in activeContext.md
  - Update PLANNING and TASKS
  - Continue from new understanding

**After IMPLEMENT**:
- → **REFLECT Mode**: After all implementation complete

## Common Issues & Solutions

### Issue: Test keeps failing
```
Solution:
1. Read test error carefully
2. Check mock setup
3. Verify the code under test
4. Run with --verbose for details
5. Add temporary logging
```

### Issue: TypeScript compilation errors
```
Solution:
1. Fix type errors (don't use 'any')
2. Check imports
3. Verify interface definitions
4. Use 'strict: true' to catch issues
```

### Issue: Code doesn't feel right
```
Solution:
1. Sleep on it (come back fresh)
2. Compare with similar code in repo
3. Review best practices docs
4. Refactor to improve clarity
5. Re-run tests after refactoring
```

### Issue: Can't figure out how to do something
```
Solution:
1. Check if it's already in the codebase
2. Review similar implementations
3. Read Azure SDK docs
4. Search for examples
5. Ask for clarification on design
```

## Tips for Successful Implementation

1. **Small steps**: Commit frequently, tests run constantly
2. **Test first**: Write test before code (TDD)
3. **Follow patterns**: Use existing code as template
4. **Ask questions**: Don't guess on design
5. **Read errors**: Error messages are your friend
6. **Test edge cases**: Not just happy path
7. **Document as you go**: Don't leave it for the end
8. **Keep it simple**: Don't over-engineer
9. **Refactor safely**: Only when tests are green
10. **Celebrate wins**: Mark tasks COMPLETE proudly!
