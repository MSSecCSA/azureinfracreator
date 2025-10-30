# CLI Development Guide

## TUI Design Principles

### 1. User Flow - KISS Principle
Keep It Super Simple:
- One decision per prompt
- Clear option descriptions
- Logical grouping of related questions
- Always show defaults
- Provide escape route (back button)

### 2. Feedback & Reassurance
Users should always know:
- What's happening (spinner)
- How long it took (timing)
- What was created (summary)
- How to verify (next steps)
- How to undo (if applicable)

**Example Flow**:
```
1. Welcome banner
2. Gather input (step 1 of 3)
3. Gather input (step 2 of 3)
4. Gather input (step 3 of 3)
5. Confirm before creating
6. Show spinner while provisioning
7. Success message with resource info
8. Show next steps
```

### 3. Error Recovery
Never leave user stuck:
- Clear error messages
- Actionable remediation steps
- Option to retry
- Option to skip or go back
- Contact info for support

**Bad Error**:
```
Error: Failed to create resource
```

**Good Error**:
```
❌ Authentication failed
Make sure you're logged in:
  1. Run: az login
  2. Select your subscription
  3. Try again

If you continue having issues:
  - Verify your Azure account has permissions
  - Check that you have an active subscription
```

## Terminal UI Patterns

### Menu Pattern
```typescript
import inquirer from 'inquirer';
import chalk from 'chalk';

async function mainMenu(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.blue('What would you like to do?'),
      choices: [
        { name: chalk.green('✓ Create VM'), value: 'create-vm' },
        { name: chalk.green('✓ Create Storage'), value: 'create-storage' },
        { name: chalk.gray('⊘ Exit'), value: 'exit' }
      ],
      default: 'create-vm'
    }
  ]);

  switch (answers.action) {
    case 'create-vm':
      await createVMWorkflow();
      break;
    // ...
  }
}
```

### Input Validation Pattern
```typescript
const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'resourceName',
    message: 'Resource name (3-24 alphanumeric chars)',
    default: 'my-resource',
    validate: (input: string) => {
      if (!/^[a-z0-9]{3,24}$/.test(input)) {
        return 'Must be 3-24 lowercase alphanumeric characters';
      }
      return true;
    },
    filter: (input: string) => input.toLowerCase()
  }
]);
```

### Progress Indication Pattern
```typescript
import ora from 'ora';

const spinner = ora('Creating virtual machine...').start();

try {
  const vm = await vmService.createVM(params);
  spinner.succeed(
    chalk.green(`VM created: ${vm.name}`)
  );
} catch (error) {
  spinner.fail(chalk.red('Failed to create VM'));
  console.error(chalk.red(`Error: ${error.message}`));
}
```

### Success Message Pattern
```typescript
function showSuccess(resource: any): void {
  console.log('\n' + chalk.green('═══════════════════════════════════'));
  console.log(chalk.green.bold('✓ Success!'));
  console.log(chalk.green('═══════════════════════════════════'));
  console.log(chalk.cyan(`Resource ID: ${resource.id}`));
  console.log(chalk.cyan(`Name: ${resource.name}`));
  console.log(chalk.cyan(`Location: ${resource.location}`));
  console.log('\n' + chalk.gray('Next steps:'));
  console.log(chalk.gray(`1. Verify in Azure Portal`));
  console.log(chalk.gray(`2. Configure firewall rules`));
  console.log(chalk.gray(`3. Set up monitoring`));
  console.log('');
}
```

## Inquirer.js Advanced Patterns

### Conditional Questions
```typescript
const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'vmOs',
    message: 'Operating System',
    choices: ['Windows', 'Linux']
  },
  {
    type: 'list',
    name: 'winVersion',
    message: 'Windows Version',
    choices: ['2019', '2022'],
    // Only show if Windows selected
    when: (answers) => answers.vmOs === 'Windows'
  }
]);
```

### Checkbox with Validation
```typescript
{
  type: 'checkbox',
  name: 'features',
  message: 'Select features to enable',
  choices: [
    { name: 'Monitoring', checked: true },
    { name: 'Backup', checked: true },
    { name: 'Auto-scaling' }
  ],
  validate: (choices) => {
    if (choices.length === 0) {
      return 'Select at least one feature';
    }
    return true;
  }
}
```

### Password Input
```typescript
{
  type: 'password',
  name: 'password',
  message: 'Admin password (min 12 chars, upper, lower, number, special)',
  validate: (input) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{12,}$/.test(input)) {
      return 'Password must meet complexity requirements';
    }
    return true;
  },
  mask: '*'
}
```

## Chalk Color Conventions

```typescript
// Headers and success
chalk.blue.bold('Component Name')

// Positive actions
chalk.green('✓ Success')
chalk.green('✓ Create VM')

// Warnings
chalk.yellow('⚠ Warning message')

// Errors
chalk.red('❌ Error message')

// Metadata/secondary info
chalk.gray('Secondary information')
chalk.gray('- Detail 1')
chalk.gray('- Detail 2')

// Information/highlights
chalk.cyan('Important info')
chalk.cyan(`ID: ${id}`)

// Tables and structured data
console.table(data)
```

## Menu Structure Template

```typescript
class CLICommand {
  async run(): Promise<void> {
    this.printHeader();
    await this.mainMenu();
  }

  private printHeader(): void {
    console.log('\n' + chalk.blue.bold('╔══════════════════════════════════╗'));
    console.log(chalk.blue.bold('║     Feature Name                  ║'));
    console.log(chalk.blue.bold('╚══════════════════════════════════╝\n'));
  }

  private async mainMenu(): Promise<void> {
    let continueMenu = true;

    while (continueMenu) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Option 1', value: 'opt1' },
            { name: 'Option 2', value: 'opt2' },
            { name: 'Back', value: 'back' }
          ]
        }
      ]);

      switch (answers.action) {
        case 'opt1':
          await this.option1();
          break;
        case 'opt2':
          await this.option2();
          break;
        case 'back':
          continueMenu = false;
          break;
      }
    }
  }
}
```

## Wizard Pattern

For complex multi-step provisioning:

```typescript
async function createResourceWizard(): Promise<Resource> {
  console.log(chalk.blue('\n📋 Create Resource Wizard\n'));

  // Step 1
  const basicInfo = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Resource name' }
  ]);
  console.log(chalk.green(`✓ Name: ${basicInfo.name}\n`));

  // Step 2
  const config = await inquirer.prompt([
    { type: 'list', name: 'size', message: 'Size', choices: [...] }
  ]);
  console.log(chalk.green(`✓ Size: ${config.size}\n`));

  // Step 3
  const security = await inquirer.prompt([
    { type: 'confirm', name: 'encryption', message: 'Enable encryption?' }
  ]);
  console.log(chalk.green(`✓ Encryption: ${security.encryption}\n`));

  // Review
  console.log(chalk.blue.bold('\n Review\n'));
  console.log(chalk.cyan(`Name: ${basicInfo.name}`));
  console.log(chalk.cyan(`Size: ${config.size}`));
  console.log(chalk.cyan(`Encryption: ${security.encryption}`));

  const confirm = await inquirer.prompt([
    { type: 'confirm', name: 'proceed', message: 'Create resource?' }
  ]);

  if (!confirm.proceed) {
    console.log(chalk.yellow('Cancelled'));
    throw new Error('User cancelled operation');
  }

  // Create
  const spinner = ora('Creating resource...').start();
  const resource = await createResource({
    ...basicInfo,
    ...config,
    ...security
  });
  spinner.succeed(chalk.green(`Resource created: ${resource.id}`));

  return resource;
}
```

## Error Handling in CLI

```typescript
async function safeCLIOperation(
  operation: () => Promise<void>,
  operationName: string
): Promise<void> {
  try {
    await operation();
  } catch (error) {
    handleCLIError(error, operationName);
  }
}

function handleCLIError(error: any, operation: string): void {
  console.error('');

  // Auth error
  if (error.code === 'EAUTH' || error.message.includes('unauthorized')) {
    console.error(chalk.red('❌ Authentication Failed'));
    console.error(chalk.gray('You need to authenticate with Azure'));
    console.error(chalk.yellow('  az login'));
    return;
  }

  // Permission error
  if (error.code === 'EACCES' || error.statusCode === 403) {
    console.error(chalk.red('❌ Permission Denied'));
    console.error(chalk.gray('You don\'t have permission to perform this action'));
    console.error(chalk.gray('Contact your Azure administrator'));
    return;
  }

  // Validation error
  if (error instanceof ValidationError) {
    console.error(chalk.red('❌ Invalid Input'));
    console.error(chalk.gray(error.message));
    return;
  }

  // Generic error
  console.error(chalk.red(`❌ ${operation} Failed`));
  console.error(chalk.gray(error.message));

  // In debug mode
  if (process.env.DEBUG) {
    console.error(chalk.gray('\nStack trace:'));
    console.error(error.stack);
  }
}
```

## Configuration Display

```typescript
async function showConfiguration(config: Config): Promise<void> {
  console.log('\n' + chalk.blue.bold('Current Configuration'));
  console.log(chalk.blue('─────────────────────────────────'));

  const configTable = [
    { Setting: 'Subscription ID', Value: chalk.cyan(config.subscriptionId) },
    { Setting: 'Resource Group', Value: chalk.cyan(config.resourceGroup) },
    { Setting: 'Region', Value: chalk.cyan(config.region) },
    { Setting: 'Default VM Size', Value: chalk.cyan(config.defaultVMSize) },
    { Setting: 'Encryption', Value: config.encryption ? chalk.green('Enabled') : chalk.yellow('Disabled') }
  ];

  console.table(configTable);
}
```

## Testing CLI Code

```typescript
describe('MainMenu', () => {
  it('should handle user selection', async () => {
    inquirer.prompt = jest.fn().mockResolvedValueOnce({
      action: 'create'
    });

    const menu = new MainMenu();
    await menu.run();

    expect(inquirer.prompt).toHaveBeenCalled();
  });

  it('should display header', async () => {
    const logSpy = jest.spyOn(console, 'log');
    const menu = new MainMenu();

    menu.printHeader();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Azure Infrastructure Creator')
    );
  });
});
```

## Command Line Arguments (Commander.js)

```typescript
import { program } from 'commander';

program
  .name('azureinfra')
  .description('Azure Infrastructure Creator CLI')
  .version('0.1.0');

program
  .command('provision <type>')
  .description('Provision Azure resource')
  .option('-n, --name <name>', 'Resource name')
  .option('-l, --location <location>', 'Azure location')
  .action(async (type, options) => {
    // Implementation
  });

program.parse();
```

## Tips for Better UX

1. **Defaults**: Always provide sensible defaults
2. **Validation**: Validate early, give clear feedback
3. **Progress**: Show spinners for operations >1 second
4. **Confirmation**: Ask before destructive operations
5. **Next Steps**: Always tell user what to do next
6. **Escape Route**: Always provide "back" option
7. **Colors**: Use consistently for meaning
8. **Documentation**: Reference docs/tutorials in output
9. **Logging**: Let user know what's happening
10. **Cleanup**: Clean up on error (remove half-created resources)
