# Technical Context - Azure Infrastructure Creator

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         User (CLI/TUI)                   │
│      via Inquirer + Chalk                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      CLI Commands & Menus                │
│    (src/cli/*.ts)                        │
│    - Main menu                           │
│    - Resource wizards                    │
│    - Configuration management            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Service Layer (Business Logic)         │
│    (src/services/*.ts)                   │
│    - AuthService                         │
│    - ConfigService                       │
│    - AzureClient (wrapper)               │
│    - VMService, StorageService, etc.     │
│    - RBACService, KeyVaultService        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     Azure SDKs (@azure/*)                │
│    - arm-compute                         │
│    - arm-storage                         │
│    - arm-network                         │
│    - arm-resources                       │
│    - identity                            │
│    - keyvault-secrets                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Azure APIs                       │
│    (REST endpoints)                      │
└─────────────────────────────────────────┘
```

## Technology Stack Rationale

### Language: TypeScript
**Why**:
- Strong type safety (catch errors early)
- Excellent Azure SDK support
- Better IDE experience with IntelliSense
- Node.js ecosystem maturity

**Constraints**:
- Strict mode enabled
- All files typed (no implicit `any`)
- tsconfig set for ES2020 target

---

### CLI Framework: Commander.js
**Why**:
- Robust command parsing
- Familiar syntax for users
- Easy subcommand nesting
- Good error handling

**Usage Pattern**:
```typescript
program
  .command('provision <resource-type>')
  .description('Provision Azure resource')
  .action(handler)
```

---

### TUI Components

#### Inquirer.js
**Purpose**: Interactive prompts and selection menus
**Why**:
- Rich question types (list, checkbox, input, password)
- Validation support
- Conditional questions
- Default values
- Good for guided workflows

#### Chalk
**Purpose**: Terminal color and styling
**Why**:
- Easy to use
- Consistent cross-platform
- Good for visual hierarchy

**Color Scheme**:
- `chalk.blue.bold()` - Headers, section titles
- `chalk.green()` - Success messages, checkmarks
- `chalk.yellow()` - Warnings, upcoming actions
- `chalk.red()` - Errors
- `chalk.gray()` - Metadata, secondary info
- `chalk.cyan()` - Information, tips

#### Ora
**Purpose**: Spinners and progress indicators
**Why**:
- Good for long-running operations
- Shows operation status clearly
- Prevents user frustration

---

### Azure SDKs

**Core Packages**:
- `@azure/identity` - Authentication (DefaultAzureCredential chain)
- `@azure/arm-resources` - Resource Groups, Subscriptions
- `@azure/arm-compute` - Virtual Machines
- `@azure/arm-storage` - Storage Accounts
- `@azure/arm-network` - VNets, NSGs, etc.
- `@azure/keyvault-secrets` - Key Vault operations

**Authentication Strategy**:
Use DefaultAzureCredential which tries in order:
1. Environment variables (CI/CD)
2. Service Principal (AZURE_CLIENT_ID, etc.)
3. Managed Identity (in Azure resources)
4. User credentials (interactive login)
5. Azure CLI credentials (fallback)

---

## Module Organization

```
src/
├── index.ts                 # Entry point
├── cli/
│   ├── main.ts             # Main menu & app orchestration
│   ├── vm.ts               # VM provisioning menu
│   ├── storage.ts          # Storage provisioning menu
│   ├── database.ts         # Database provisioning menu
│   ├── network.ts          # Network provisioning menu
│   └── config.ts           # Configuration management menu
├── services/
│   ├── auth.ts             # Authentication logic
│   ├── config.ts           # Configuration file management
│   ├── azure-client.ts     # Azure SDK wrapper
│   ├── vm.ts               # VM provisioning service
│   ├── storage.ts          # Storage provisioning service
│   ├── database.ts         # Database provisioning service
│   ├── network.ts          # Network provisioning service
│   ├── rbac.ts             # RBAC management
│   ├── keyvault.ts         # Key Vault operations
│   └── logger.ts           # Logging utilities
├── config/
│   ├── constants.ts        # App constants (colors, etc.)
│   ├── defaults.ts         # Default configurations
│   └── schemas.ts          # Config validation schemas
└── templates/
    ├── rbac.ts             # RBAC role templates
    ├── nsg-rules.ts        # NSG rule templates
    └── encryption.ts       # Encryption templates
```

## Key Design Patterns

### 1. Service Layer Pattern
Each Azure resource type has a dedicated service class that encapsulates all API calls and business logic.

```typescript
class VMService {
  private client: ComputeManagementClient;

  async createVM(params: VMCreationParams): Promise<VM> {
    // Implementation
  }
}
```

### 2. Wrapper Pattern
AzureClient wraps multiple Azure SDKs to provide unified error handling and logging.

```typescript
class AzureClient {
  private computeClient: ComputeManagementClient;
  private storageClient: StorageManagementClient;
  // Delegated methods with error handling
}
```

### 3. Configuration Management
Single source of truth for user settings.

```typescript
class ConfigService {
  static readonly DEFAULT_CONFIG_PATH =
    path.join(os.homedir(), '.azureinfracreator');

  load(): Config { /* ... */ }
  save(config: Config): void { /* ... */ }
}
```

### 4. Template Pattern
Predefined configurations for common scenarios.

```typescript
const RBAC_TEMPLATES = {
  vmReader: { role: 'Reader', scope: 'VM' },
  storageWriter: { role: 'Storage Blob Data Contributor' }
};
```

## Error Handling Strategy

**Hierarchy**:
1. **Try-catch blocks** for async Azure operations
2. **Custom error classes** for domain-specific errors
3. **Helpful error messages** with remediation steps
4. **Logging** of all errors for debugging

**Example**:
```typescript
try {
  await vmService.createVM(params);
} catch (error) {
  if (error instanceof CredentialUnavailableError) {
    console.error(chalk.red('❌ Authentication failed'));
    console.error('Run: az login');
  } else {
    console.error(chalk.red(`Error: ${error.message}`));
  }
}
```

## Security Considerations

### 1. No Hardcoded Secrets
- All secrets in Azure Key Vault
- Configs use references, not values
- Environment variables for CI/CD

### 2. Input Validation
- Validate all user inputs
- Reject invalid names, sizes, etc.
- Prevent injection attacks

### 3. RBAC by Default
- Every resource assigned appropriate RBAC
- Use managed identities, not service principals
- Follow least privilege principle

### 4. Audit Logging
- Log all provisioning operations
- Include who, what, when, where
- Store in Azure Monitor/Log Analytics

### 5. Secure Credential Storage
- Credentials cached in user home directory
- File permissions restricted (700)
- Automatic cleanup on logout

## Testing Strategy

### Unit Tests (Jest)
- Test each service in isolation
- Mock Azure SDK responses
- Test error handling paths
- Target: 80%+ coverage

### Integration Tests
- Real Azure SDK calls (against test subscription)
- Real resource creation in test RG
- Cleanup afterwards

### E2E Tests
- Full workflow testing
- CLI command execution
- Real Azure provisioning

## Performance Considerations

1. **Parallel API Calls**: Use Promise.all() for independent operations
2. **Caching**: Cache subscription/region lists locally
3. **Progress Indication**: Show spinners for long operations (>2s)
4. **Lazy Loading**: Load features only when needed

## Deployment & Distribution

### Development
```bash
npm run dev          # Run with ts-node
npm run build        # Compile TypeScript
npm run test         # Run Jest tests
```

### Production
- Publish to NPM as `@azureinfracreator/cli`
- Bundle with esbuild for smaller size
- Provide prebuilt binaries for Windows/Mac/Linux
- GitHub Actions for CI/CD

## Azure Best Practices Enforced

1. **Well-Architected Framework**
   - Reliability: Built-in redundancy options
   - Security: Least privilege, encryption, Key Vault
   - Cost Optimization: Show costs, suggest optimizations
   - Operational Excellence: Logging, monitoring setup
   - Performance: Appropriate sizing guidance

2. **Security Baseline**
   - CIS Azure Foundations Benchmark compliance
   - Azure Security Center recommendations
   - NSG rules follow security group best practices
   - Encryption enabled by default

3. **Compliance Ready**
   - PCI-DSS configuration templates
   - HIPAA consideration for database setup
   - SOC 2 audit logging
   - Data residency options

## Dependencies Management

**Key Dependencies**:
- `@azure/identity`: v4.0.0+
- `@azure/arm-*`: v33.0.0+
- `inquirer`: v8.2.5+
- `commander`: v11.1.0+
- `chalk`: v5.3.0+
- `ora`: v8.0.0+

**Dev Dependencies**:
- `typescript`: v5.3.2+
- `jest`: for testing
- `ts-node`: for dev running
- `@types/*`: for type definitions

**Update Strategy**:
- Regular dependency updates (monthly)
- Security patches (immediate)
- Major version changes (quarterly review)
