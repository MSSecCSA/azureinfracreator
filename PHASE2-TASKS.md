# Phase 2: Core Infrastructure & Authentication - TASKS

**Overall Status**: Ready to Start
**Complexity**: 3 (Intermediate)
**Total Estimated Hours**: 13-17
**Security Reference**: `.claude/instructions/security-architecture-guide.md`

---

## Phase 2.1: Authentication Module Implementation

### Task 2.1.1: Create AuthService - Basic Structure [2 hours]

- [ ] Create file `src/services/auth.ts`
- [ ] Import @azure/identity packages
  - [ ] `DefaultAzureCredential`
  - [ ] `CredentialUnavailableError`
  - [ ] `AuthenticationFailedError`

- [ ] Define AuthService class
  - [ ] Constructor with ConfigService injection
  - [ ] Private credential cache (Map)
  - [ ] Private credential field

- [ ] Implement `getCredential()` method
  - [ ] Initialize DefaultAzureCredential
  - [ ] Return cached credential if valid
  - [ ] Handle credential errors gracefully
  - [ ] Log auth attempt (not sensitive data)

- [ ] Implement `getSubscriptionId()` method
  - [ ] Validate subscription from ConfigService
  - [ ] Return subscription ID string

- [ ] Implement `clearCache()` method
  - [ ] Clear in-memory credential cache
  - [ ] Log cache clear event

- [ ] Implement `getTokenInfo()` method (non-sensitive)
  - [ ] Return token age (not token value)
  - [ ] Return client type (e.g., "EnvironmentCredential")
  - [ ] Return expiration status

**Citation**:
- DefaultAzureCredential: https://learn.microsoft.com/dotnet/api/azure.identity.defaultazurecredential
- Security Guide: Section 1.2 - Authentication Flow Best Practices

**Acceptance Criteria**:
- Class compiles with strict TypeScript
- All methods typed (no `any`)
- No secrets logged
- Credential initialization tested manually

---

### Task 2.1.2: Error Handling Layer [1 hour]

- [ ] Define error wrapper types in `src/services/auth.ts`
  - [ ] `AuthError` base class
  - [ ] `CredentialNotFoundError` (no auth methods available)
  - [ ] `InvalidSubscriptionError` (subscription not set/found)
  - [ ] `TokenExpiredError` (credential refresh needed)

- [ ] Implement error messages with remediation
  - [ ] "Run: az login" for interactive auth
  - [ ] "Set AZURE_CLIENT_ID environment variables" for CI/CD
  - [ ] "Check subscription ID in config" for subscription errors
  - [ ] Link to troubleshooting guide

- [ ] Add error logging
  - [ ] Log error type (not full error)
  - [ ] Log attempted credential methods
  - [ ] Log timestamp and context

**Citation**:
- Error Handling: https://learn.microsoft.com/azure/identity/troubleshoot
- Security Guide: Section 8 - Critical Feedback & Anti-Patterns

**Acceptance Criteria**:
- Specific error types for different failures
- Error messages guide user to solution
- No sensitive data in error messages
- Errors logged without secrets

---

### Task 2.1.3: Credential Caching [1.5 hours]

- [ ] Implement in-memory cache
  - [ ] Store credential in private field
  - [ ] Track last access time
  - [ ] Implement cache expiry (token lifetime)

- [ ] Add cache management methods
  - [ ] `isCacheValid()` - Check if cached credential still valid
  - [ ] `invalidateCache()` - Force cache refresh
  - [ ] `cacheStats()` - Return non-sensitive cache info

- [ ] Implement credential refresh
  - [ ] Detect expired credentials
  - [ ] Automatic refresh on expiry
  - [ ] Log refresh events (not tokens)

- [ ] Add cache invalidation on error
  - [ ] If auth fails, clear cache
  - [ ] Force re-authentication next call
  - [ ] Log cache clear reason

**Citation**:
- Caching Best Practices: https://learn.microsoft.com/azure/developer/javascript/javascript-sdk-best-practices

**Acceptance Criteria**:
- Cached credentials reused (performance)
- Cache invalidates on token age
- No sensitive data in cache logs
- Force refresh works

---

### Task 2.1.4: AuthService Unit Tests [2-2.5 hours]

- [ ] Create `src/services/auth.test.ts`

- [ ] Test DefaultAzureCredential initialization
  - [ ] Test successful initialization
  - [ ] Test with mock credentials
  - [ ] Test credential chain order

- [ ] Test credential methods
  - [ ] Test `getCredential()` returns credential
  - [ ] Test `getSubscriptionId()` returns subscription
  - [ ] Test `getTokenInfo()` returns non-sensitive info

- [ ] Test error scenarios
  - [ ] No credentials available
  - [ ] Invalid subscription ID
  - [ ] Credential refresh fails
  - [ ] Timeout during auth

- [ ] Test caching
  - [ ] Cache hit returns same credential
  - [ ] Cache miss requires auth
  - [ ] Cache invalidation works
  - [ ] Expired cache triggers refresh

- [ ] Test error handling
  - [ ] Specific error types thrown
  - [ ] Error messages are helpful
  - [ ] Errors logged without secrets

- [ ] Coverage target: >90% for AuthService

**Mocking Strategy**:
```typescript
// Mock @azure/identity
jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn(),
  CredentialUnavailableError: Error,
}));
```

**Acceptance Criteria**:
- All methods tested
- >90% code coverage
- No console.logs in code
- Error paths covered
- All tests passing

---

## Phase 2.2: Configuration Management Implementation

### Task 2.2.1: Design Config Schema [1 hour]

- [ ] Define config interface in `src/config/schema.ts`
  ```typescript
  interface AppConfig {
    // Required
    subscriptionId: string;      // Azure subscription ID
    resourceGroup: string;       // Default resource group
    region: string;              // Azure region (eastus, westus, etc)

    // Optional
    defaultVMSize?: string;      // e.g., "Standard_B2s"
    defaultStorageTier?: string; // "Hot" | "Cool" | "Archive"
    loggingEnabled?: boolean;    // Enable structured logging
    logLevel?: string;           // "debug" | "info" | "warn" | "error"
  }
  ```

- [ ] Define validation rules
  - [ ] subscriptionId: UUID format
  - [ ] resourceGroup: 1-90 alphanumeric + hyphens
  - [ ] region: must be valid Azure region
  - [ ] defaults: valid for their resource type

- [ ] Define defaults
  ```typescript
  const DEFAULTS = {
    region: 'eastus',
    defaultVMSize: 'Standard_B2s',
    defaultStorageTier: 'Hot',
    loggingEnabled: true,
    logLevel: 'info',
  };
  ```

- [ ] Define config file path
  - [ ] ~/.azureinfracreator/config.json
  - [ ] Permissions: 600 (user only)

**Acceptance Criteria**:
- Schema clearly documented
- Validation rules comprehensive
- Default values sensible
- File path documented

---

### Task 2.2.2: Implement ConfigService [2 hours]

- [ ] Create `src/config/service.ts`

- [ ] Implement `load()` method
  - [ ] Load from file if exists
  - [ ] Merge with environment variables
  - [ ] Apply defaults
  - [ ] Validate complete config

- [ ] Implement `save()` method
  - [ ] Create ~/.azureinfracreator/ if needed
  - [ ] Write config to config.json
  - [ ] Set file permissions to 600
  - [ ] Log save event

- [ ] Implement `get(key)` method
  - [ ] Get value from current config
  - [ ] Return null if not found
  - [ ] No type inference

- [ ] Implement `set(key, value)` method
  - [ ] Update in-memory config
  - [ ] Validate new value
  - [ ] Save to file
  - [ ] Return success/error

- [ ] Implement `validate()` method
  - [ ] Check required fields present
  - [ ] Validate field formats
  - [ ] Return validation errors
  - [ ] Helpful error messages

- [ ] Implement environment variable override
  - [ ] AZURE_SUBSCRIPTION_ID
  - [ ] AZURE_RESOURCE_GROUP
  - [ ] AZURE_REGION
  - [ ] AZUREINFRACREATOR_LOG_LEVEL

**Citation**:
- Configuration Best Practices: https://learn.microsoft.com/azure/app-service/configure-common

**Acceptance Criteria**:
- Config loads from file and environment
- Validation catches errors
- File permissions secure (600)
- Environment overrides work
- Helpful error messages

---

### Task 2.2.3: Add CLI Commands for Config [1 hour]

- [ ] Create `src/cli/config.ts`

- [ ] Implement `config init` command
  - [ ] Interactive prompts for required fields
  - [ ] Validation of inputs
  - [ ] Save to config.json
  - [ ] Confirm with user before saving

- [ ] Implement `config set` command
  - [ ] Accept `<key> <value>` arguments
  - [ ] Update config
  - [ ] Save to file
  - [ ] Confirmation message

- [ ] Implement `config get` command
  - [ ] Display current config
  - [ ] Pretty-print with colors
  - [ ] Mask sensitive values if any

- [ ] Implement `config validate` command
  - [ ] Check config validity
  - [ ] Report any errors
  - [ ] Suggest fixes

- [ ] Add to main menu
  - [ ] Add "Configure Settings" option
  - [ ] Call config menu functions

**Acceptance Criteria**:
- All commands working
- User-friendly prompts
- Proper error messages
- Config persists

---

### Task 2.2.4: Configuration Service Tests [1 hour]

- [ ] Create `src/config/service.test.ts`

- [ ] Test file operations
  - [ ] Load from file
  - [ ] Save to file
  - [ ] File permissions (600)
  - [ ] Create directory if missing

- [ ] Test validation
  - [ ] Valid config passes
  - [ ] Missing required field fails
  - [ ] Invalid format detected
  - [ ] Error messages helpful

- [ ] Test environment variables
  - [ ] Environment overrides file
  - [ ] Multiple env vars work
  - [ ] Partial override works

- [ ] Test defaults
  - [ ] Defaults applied if missing
  - [ ] Explicit config overrides defaults
  - [ ] Env vars override all

- [ ] Coverage target: >85% for ConfigService

**Acceptance Criteria**:
- >85% code coverage
- All tests passing
- File operations tested
- Validation comprehensive

---

## Phase 2.3: Azure Client Setup Implementation

### Task 2.3.1: Create AzureClient Wrapper [1.5 hours]

- [ ] Create `src/services/azure-client.ts`

- [ ] Import Azure SDK packages
  - [ ] `ResourceManagementClient` (@azure/arm-resources)
  - [ ] `ComputeManagementClient` (@azure/arm-compute)
  - [ ] `StorageManagementClient` (@azure/arm-storage)
  - [ ] `NetworkManagementClient` (@azure/arm-network)

- [ ] Define AzureClient class
  - [ ] Constructor with AuthService, ConfigService, Logger
  - [ ] Initialize all ARM clients
  - [ ] Error handling for client initialization

- [ ] Implement subscription operations
  - [ ] `getSubscriptions()` - List all subscriptions
  - [ ] `validateSubscription(id)` - Verify subscription exists
  - [ ] Handle subscription access errors

- [ ] Implement resource group operations
  - [ ] `listResourceGroups()` - List RGs in subscription
  - [ ] `createResourceGroup(name, region)` - Create new RG
  - [ ] `deleteResourceGroup(name)` - Delete RG (safety prompt)
  - [ ] `getResourceGroup(name)` - Get RG details

- [ ] Implement region operations
  - [ ] `listRegions()` - List all Azure regions
  - [ ] `getRegionInfo(region)` - Get region details

- [ ] Add error handling wrapper
  - [ ] Catch Azure SDK errors
  - [ ] Add context to error messages
  - [ ] Log errors with context
  - [ ] Specific error types

**Citation**:
- Azure SDK for JavaScript: https://learn.microsoft.com/javascript/api/overview/azure/
- Resource Management: https://learn.microsoft.com/azure/azure-resource-manager/

**Acceptance Criteria**:
- All clients initialized
- Basic operations working
- Error handling consistent
- TypeScript strict mode

---

### Task 2.3.2: Add Logging & Instrumentation [0.5 hours]

- [ ] Create `src/services/logger.ts`

- [ ] Implement Logger class
  - [ ] `debug(message, context?)` - Debug logs
  - [ ] `info(message, context?)` - Info logs
  - [ ] `warn(message, context?)` - Warning logs
  - [ ] `error(message, error?, context?)` - Error logs

- [ ] Format logs as JSON
  - [ ] Timestamp (ISO format)
  - [ ] Log level
  - [ ] Message
  - [ ] Context (operation, resource, etc)

- [ ] Add sensitive data masking
  - [ ] Mask tokens and credentials
  - [ ] Mask API keys
  - [ ] Mask passwords
  - [ ] Only log safe fields

- [ ] Implement log output
  - [ ] Console output (dev)
  - [ ] File output (production ready)
  - [ ] Log rotation if file-based

- [ ] Add operation timing
  - [ ] Track operation duration
  - [ ] Log slow operations
  - [ ] Performance metrics

**Citation**:
- Structured Logging: https://learn.microsoft.com/azure/security/fundamentals/logging-and-monitoring

**Acceptance Criteria**:
- JSON format structured
- No secrets logged
- Timestamps accurate
- Performance tracked

---

### Task 2.3.3: Integration Tests for AzureClient [1 hour]

- [ ] Create `src/services/azure-client.test.ts`

- [ ] Mock Azure SDK clients
  ```typescript
  jest.mock('@azure/arm-resources');
  jest.mock('@azure/arm-compute');
  // etc.
  ```

- [ ] Test subscription operations
  - [ ] List subscriptions succeeds
  - [ ] Validate subscription works
  - [ ] Error on invalid subscription

- [ ] Test resource group operations
  - [ ] List RGs succeeds
  - [ ] Create RG succeeds
  - [ ] Delete RG prompts for safety
  - [ ] Get RG details works
  - [ ] Handle not found error

- [ ] Test region operations
  - [ ] List regions succeeds
  - [ ] Get region info works
  - [ ] Handle invalid region

- [ ] Test error handling
  - [ ] Network timeout handled
  - [ ] 403 Forbidden handled
  - [ ] 404 Not Found handled
  - [ ] Generic errors wrapped

- [ ] Coverage target: >85% for AzureClient

**Mocking Strategy**:
- Mock each ARM client
- Mock successful responses
- Mock error scenarios
- Verify error handling

**Acceptance Criteria**:
- >85% code coverage
- All operations tested
- Error paths covered
- Mock setup clean

---

## Phase 2.4: Integration & Documentation

### Task 2.4.1: Update Main CLI with Auth [1 hour]

- [ ] Update `src/cli/main.ts`
  - [ ] Initialize AuthService on app start
  - [ ] Initialize ConfigService
  - [ ] Initialize AzureClient
  - [ ] Handle initialization errors gracefully

- [ ] Add auth status check
  - [ ] Display current subscription
  - [ ] Display logged-in user/service principal
  - [ ] Refresh auth info if needed

- [ ] Handle auth errors
  - [ ] Catch auth failures
  - [ ] Suggest remediation
  - [ ] Offer config setup wizard

- [ ] Pass services to CLI commands
  - [ ] AuthService available to all commands
  - [ ] ConfigService available to all commands
  - [ ] AzureClient available when needed

**Acceptance Criteria**:
- App initializes auth on startup
- Services available to CLI
- Auth errors handled gracefully

---

### Task 2.4.2: Update README Documentation [1 hour]

- [ ] Add "Authentication Setup" section
  - [ ] DefaultAzureCredential overview
  - [ ] All 4 auth methods (env vars, MI, user, CLI)
  - [ ] Setup instructions for each
  - [ ] Troubleshooting for each

- [ ] Add "Configuration" section
  - [ ] Config file location
  - [ ] Required vs optional fields
  - [ ] Environment variable override
  - [ ] `config init` command

- [ ] Add "Development Setup" section
  - [ ] Local auth (az login)
  - [ ] Service principal for CI/CD
  - [ ] Managed identity for Azure VMs

- [ ] Add "Troubleshooting" section
  - [ ] "No credentials found" error
  - [ ] "Subscription not found" error
  - [ ] "Permission denied" error
  - [ ] Link to security guide

**Acceptance Criteria**:
- Setup instructions clear
- All auth methods documented
- Troubleshooting helpful

---

### Task 2.4.3: Add Code Comments & Citations [0.5 hours]

- [ ] Add file headers with citations
  ```typescript
  /**
   * Authentication Service - DefaultAzureCredential implementation
   *
   * microsoft-learn: Identity and authentication
   * Reference: https://learn.microsoft.com/dotnet/api/azure.identity.defaultazurecredential
   * Compliance: CIS 1.1 - Ensure secure authentication
   * Security Guide: .claude/instructions/security-architecture-guide.md Section 1.2
   */
  ```

- [ ] Add method documentation
  - [ ] JSDoc for all public methods
  - [ ] Security notes where relevant
  - [ ] Link to Microsoft Learn where applicable

- [ ] Add inline comments for security decisions
  - [ ] Why we use DefaultAzureCredential
  - [ ] Why we cache credentials
  - [ ] Why we never log tokens
  - [ ] Why we validate config

**Acceptance Criteria**:
- All public methods documented
- Security decisions explained
- Links to references

---

### Task 2.4.4: Final Testing & Validation [1.5 hours]

- [ ] Run full test suite
  - [ ] `npm test` - All tests passing
  - [ ] Coverage report - >85% overall

- [ ] Verify TypeScript compilation
  - [ ] `npm run build` - No errors
  - [ ] Strict mode enabled
  - [ ] All types properly inferred

- [ ] Manual testing
  - [ ] `npm run dev` - App starts
  - [ ] Auth initializes successfully
  - [ ] Config commands work
  - [ ] Error handling graceful

- [ ] Security validation
  - [ ] No secrets in logs (grep check)
  - [ ] No hardcoded credentials
  - [ ] Error messages helpful
  - [ ] File permissions correct

- [ ] Documentation check
  - [ ] README complete
  - [ ] Code comments helpful
  - [ ] All citations present

**Acceptance Criteria**:
- All tests passing
- No TypeScript errors
- Manual testing successful
- Security validated
- Documentation complete

---

## Discovered During Work

(This section tracks tasks discovered/added during implementation)

---

## Notes

### Security Reminders
- Never log credentials, tokens, or secrets
- Never hardcode secrets in code
- Always use DefaultAzureCredential
- Always validate user input
- Always handle auth errors gracefully

### Performance Considerations
- Credential cache is critical (1s+ overhead per auth)
- Region and subscription lists can be cached
- Log only when necessary (no debug logs in production)

### Testing Considerations
- Mock @azure/identity thoroughly
- Test error paths, not just success
- Cover all credential methods in tests
- Use fixtures for config testing

### Dependencies
- @azure/identity ^4.0.0
- @azure/arm-resources ^13.0.0
- @azure/arm-compute ^33.0.0
- @azure/arm-storage ^18.0.0
- @azure/arm-network ^33.0.0

All are already in package.json ✅
