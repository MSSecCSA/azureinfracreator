import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

export class AzureInfraCreator {
  private spinner = ora();

  async run(): Promise<void> {
    this.printHeader();
    await this.mainMenu();
  }

  private printHeader(): void {
    console.log(chalk.blue.bold('\n╔═══════════════════════════════════╗'));
    console.log(chalk.blue.bold('║   Azure Infrastructure Creator    ║'));
    console.log(chalk.blue.bold('║   Secure. Simple. Best Practices. ║'));
    console.log(chalk.blue.bold('╚═══════════════════════════════════╝\n'));
  }

  private async mainMenu(): Promise<void> {
    let continueApp = true;

    while (continueApp) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Create new infrastructure', value: 'create' },
            { name: 'View existing resources', value: 'view' },
            { name: 'Configure settings', value: 'settings' },
            { name: 'Exit', value: 'exit' }
          ]
        }
      ]);

      switch (answers.action) {
        case 'create':
          await this.createInfrastructure();
          break;
        case 'view':
          await this.viewResources();
          break;
        case 'settings':
          await this.configureSettings();
          break;
        case 'exit':
          continueApp = false;
          this.printGoodbye();
          break;
      }
    }
  }

  private async createInfrastructure(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'resourceType',
        message: 'What type of infrastructure do you want to create?',
        choices: [
          { name: 'Virtual Machine', value: 'vm' },
          { name: 'Storage Account', value: 'storage' },
          { name: 'Database', value: 'database' },
          { name: 'Network Resources', value: 'network' },
          { name: 'Web App / App Service', value: 'webapp' },
          { name: 'Back', value: 'back' }
        ]
      }
    ]);

    if (answers.resourceType !== 'back') {
      console.log(chalk.yellow(`\n📋 Infrastructure creation for ${answers.resourceType} not yet implemented.`));
      console.log(chalk.gray('Coming soon with full Azure SDK integration!\n'));
    }
  }

  private async viewResources(): Promise<void> {
    console.log(chalk.yellow('\n📊 Resource viewing not yet implemented.'));
    console.log(chalk.gray('This will list all provisioned Azure resources.\n'));
  }

  private async configureSettings(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'subscriptionId',
        message: 'Enter your Azure Subscription ID:',
        validate: (input) => input.length > 0 ? true : 'Subscription ID is required'
      },
      {
        type: 'input',
        name: 'resourceGroup',
        message: 'Enter default Resource Group name:',
        default: 'rg-infra-creator'
      },
      {
        type: 'list',
        name: 'region',
        message: 'Select default Azure region:',
        choices: [
          'eastus',
          'westus',
          'northeurope',
          'westeurope',
          'southeastasia',
          'eastasia'
        ]
      }
    ]);

    console.log(chalk.green('\n✓ Settings saved (local storage not yet implemented)'));
    console.log(chalk.gray(`Subscription: ${answers.subscriptionId}`));
    console.log(chalk.gray(`Resource Group: ${answers.resourceGroup}`));
    console.log(chalk.gray(`Region: ${answers.region}\n`));
  }

  private printGoodbye(): void {
    console.log(chalk.blue('\n╔═══════════════════════════════════╗'));
    console.log(chalk.blue('║        Until next time! 👋        ║'));
    console.log(chalk.blue('╚═══════════════════════════════════╝\n'));
  }
}
