# Phase 2: Core Infrastructure & Authentication - PLANNING

**Status**: Planning
**Complexity Level**: 3 (Intermediate Feature)
**Estimated Effort**: 13-17 hours
**Priority**: High (Blocks all resource provisioning)
**Created**: 2025-10-30

---

## 1. Overview

### Problem Statement
The Azure Infrastructure Creator CLI cannot currently authenticate to Azure or interact with Azure services. Phase 2 establishes the foundation for all infrastructure provisioning by implementing secure authentication, configuration management, and Azure SDK client wrappers.

### Target Users
- DevOps engineers setting up the CLI
- Cloud architects configuring infrastructure
- Automated deployments (CI/CD pipelines)

### Success Metrics
- Users can authenticate using 4+ methods (env vars, managed identity, user credentials, Azure CLI)
- Credentials are cached and reused securely
- All Azure SDK calls use consistent error handling
- >85% test coverage for auth and config
- No auth-related bugs in first 100 deployments

---

## 2. Objectives & Scope

### Goals
1. **Secure Authentication**: Implement DefaultAzureCredential chain with no hardcoded secrets
2. **Configuration Management**: Persist user settings across sessions
3. **Azure Integration Foundation**: Wrapper clients for common Azure operations
4. **Error Handling**: User-friendly error messages with remediation steps
5. **Audit Trail**: Structured logging for all authentication and operations

### In Scope
- AuthService with DefaultAzureCredential
- ConfigService with validation
- AzureClient wrapper for ARM operations
- Credential caching (memory + file)
- Structured JSON logging
- Unit tests (>85% coverage)
- Integration tests with mock Azure SDK

### Out of Scope
- Actual resource provisioning (Phase 3+)
- GUI/web interface
- Third-party auth providers (OIDC, SAML)
- Advanced PIM features
- Multi-tenant support (MVP single tenant)

### Deliverables
1. **src/services/auth.ts** - Complete AuthService with DefaultAzureCredential
2. **src/config/service.ts** - ConfigService with validation
3. **src/services/azure-client.ts** - Azure SDK wrapper client
4. **src/services/logger.ts** - Structured logging utility
5. **src/services/*.test.ts** - Unit tests for all services
6. **Updated README.md** - Auth setup instructions

---

## 3. Technical Approach

### Architecture Overview

```
User CLI Input
    ↓
AuthService (DefaultAzureCredential)
    ├─ Environment Variables (CI/CD)
    ├─ Managed Identity (Azure resources)
    ├─ Service Principal (env vars)
    ├─ User Interactive (device code)
    └─ Azure CLI fallback
    ↓
Credential Cache (secure storage)
    ↓
Logger (structured audit trail)
    ↓
AzureClient (Azure SDK wrapper)
    ├─ ComputeManagementClient
    ├─ StorageManagementClient
    ├─ SqlManagementClient
    └─ NetworkManagementClient
    ↓
Azure Resource Manager (REST API)
```

### Security Design Decisions

**Reference**: `.claude/instructions/security-architecture-guide.md` Section 1.2

1. **DefaultAzureCredential Chain** (REQUIRED)
   - ✅ Automatic credential discovery
   - ✅ No hardcoded secrets
   - ✅ Prod (managed identity) + Dev (user/CLI) compatible
   - Citation: https://learn.microsoft.com/dotnet/api/azure.identity.defaultazurecredential

2. **Credential Caching** (SECURITY-FIRST)
   - ✅ In-memory cache (process lifetime)
   - ✅ Optional file-based cache (~/.azureinfracreator/credentials)
   - ✅ File permissions: 600 (user read/write only)
   - ✅ Encrypt at-rest if using file cache
   - Citation: https://learn.microsoft.com/azure/developer/javascript/javascript-sdk-best-practices

3. **No Token Logging** (CRITICAL)
   - ❌ Never log credentials or tokens
   - ✅ Log token age, not token value
   - ✅ Mask sensitive fields in logs
   - Citation: https://learn.microsoft.com/azure/security/fundamentals/logging-and-monitoring

4. **Error Handling for Auth Failures**
   - ✅ Specific error types (CredentialUnavailableError, AuthenticationFailedError)
   - ✅ Helpful messages guide users to fix issues
   - ✅ Log errors for audit trail (without sensitive data)
   - Citation: https://learn.microsoft.com/azure/identity/troubleshoot

### Components & Responsibilities

#### AuthService (`src/services/auth.ts`)
- **Responsibility**: Credential acquisition and management
- **Methods**:
  - `getClient()` - Returns authenticated credential
  - `getSubscriptionId()` - Returns configured subscription
  - `clearCache()` - Clears cached credentials
  - `getTokenInfo()` - Returns non-sensitive token info (age, client ID)
- **Dependencies**: @azure/identity, ConfigService
- **Errors**: CredentialUnavailableError, ValidationError

#### ConfigService (`src/config/service.ts`)
- **Responsibility**: User configuration persistence
- **Methods**:
  - `load()` - Load from file and environment
  - `save()` - Save to file (~/.azureinfracreator/)
  - `get(key)` - Get single config value
  - `set(key, value)` - Set single config value
  - `validate()` - Validate all config values
- **Dependencies**: File system
- **Schema**: subscription ID, resource group, region, defaults

#### AzureClient (`src/services/azure-client.ts`)
- **Responsibility**: Unified Azure SDK interface
- **Methods**:
  - `listSubscriptions()` - List all subscriptions
  - `listResourceGroups()` - List RGs in subscription
  - `createResourceGroup()` - Create new RG
  - `listRegions()` - List Azure regions
- **Dependencies**: AuthService, Logger, @azure/arm-*
- **Errors**: Azure SDK errors with context

#### Logger (`src/services/logger.ts`)
- **Responsibility**: Structured audit logging
- **Format**: JSON with timestamp, level, context
- **Methods**: debug(), info(), warn(), error()
- **Features**: Console + file output, masking, context tracking

### Design Decisions & Rationale

| Decision | Choice | Why | Alternatives | Reference |
|----------|--------|-----|--------------|-----------|
| Credential Chain | DefaultAzureCredential | Works across dev/test/prod automatically | Manual ordering, single method | Security guide 1.2 |
| Credential Caching | Memory + optional file | Fast reuse, resilience to token expiry | Memory only, no caching | Best practices |
| Error Handling | Specific error types | Users can understand and fix issues | Generic errors | Security guide 8 |
| Logging Format | Structured JSON | Machine-readable for auditing | Free-form text | Compliance requirement |
| Subscription Config | File in home dir | Persists between sessions, easy override | Environment only | Usability |
| Secrets Storage | Azure Key Vault (future) | Never in config files | Local config files | Security benchmark |

---

## 4. Security Considerations

### Data Protection
- **Credentials**: Never logged, cached securely
- **Config files**: Stored in user home dir (700 permissions)
- **Tokens**: In-memory only, discarded after use
- **Error messages**: Never leak token/secret info

### Authentication & Authorization
- **Multi-method support**: Env vars, managed identity, user credentials, Azure CLI
- **RBAC validation**: Query user permissions before operations
- **Audit logging**: All auth attempts logged (success and failure)
- **Rate limiting**: Prevent brute force (if interactive)

### Compliance Requirements
- **CIS Azure Foundations Benchmark**
  - 1.1: Enable MFA (guidance in setup)
  - 1.2-1.3: Avoid Owner role (check permissions)
  - 2.3: Audit logs enabled (LogAnalytics integration)
- **PCI DSS**: Secure credential storage, audit trails
- **HIPAA**: Encrypted logging, access controls

### Secrets Management
- ✅ DefaultAzureCredential handles credential acquisition
- ✅ No hardcoded secrets in code
- ✅ Config file credentials via environment variables
- ✅ Future: Azure Key Vault for sensitive config

---

## 5. Implementation Plan

### Phase 2.1: Authentication Module (6-8 hours)

**Sub-tasks**:
1. Create AuthService class (2 hours)
   - DefaultAzureCredential setup
   - Credential chain configuration
   - Error handling for common failures

2. Implement credential caching (1.5 hours)
   - In-memory cache
   - Optional file-based cache
   - Cache invalidation on token age

3. Create error handling layer (1 hour)
   - CredentialUnavailableError wrapper
   - User-friendly error messages
   - Remediation guidance

4. Write unit tests (2-2.5 hours)
   - Test each credential method
   - Test error paths
   - Mock @azure/identity

**Outcome**: AuthService with full test coverage, no hardcoded secrets

---

### Phase 2.2: Configuration Management (4-5 hours)

**Sub-tasks**:
1. Design config schema (1 hour)
   - subscription ID (required)
   - resource group (required)
   - region (required)
   - default VM size, storage tier, etc.

2. Implement ConfigService (2 hours)
   - File I/O (~/.azureinfracreator/)
   - Validation logic
   - Environment variable merging

3. Create CLI commands (1 hour)
   - `config init` - first-time setup
   - `config set <key> <value>`
   - `config get <key>`

4. Write tests (1 hour)
   - Config loading and saving
   - Validation
   - Environment override

**Outcome**: User-friendly configuration that persists and validates

---

### Phase 2.3: Azure Client Setup (3-4 hours)

**Sub-tasks**:
1. Create AzureClient wrapper (1.5 hours)
   - Initialize all @azure/arm-* clients
   - Error handling for API calls
   - Consistent logging

2. Implement common operations (1 hour)
   - List subscriptions
   - List/create resource groups
   - List regions

3. Add logging/instrumentation (0.5 hours)
   - Operation timing
   - Error tracking
   - Audit trail

4. Write integration tests (1 hour)
   - Mock Azure SDK responses
   - Test error handling

**Outcome**: Unified client for all Azure operations with consistent error handling

---

## 6. Testing Strategy

### Unit Tests (Target: >85% coverage)

**AuthService Tests**:
- DefaultAzureCredential initialization
- Each credential type (env, managed identity, user, CLI)
- Cache hit/miss scenarios
- Token refresh
- Error scenarios (no credentials, expired token)

**ConfigService Tests**:
- Load from file, environment, defaults
- Validation (required fields, format)
- Save and reload
- Environment variable override

**AzureClient Tests**:
- All @azure/arm-* clients initialized
- List operations mock responses
- Error handling for API failures
- Logging verification

### Integration Tests

- Real credential flow (mock token)
- End-to-end auth → client → operation
- Error recovery

### Manual Testing

- Developer authentication (local machine)
- Service principal (CI/CD)
- Managed identity (Azure resource)
- Azure CLI fallback

---

## 7. Documentation Plan

### User Documentation
- README update: Auth setup instructions
- Troubleshooting guide: Common auth errors
- Environment variable reference

### Developer Documentation
- AuthService API documentation (JSDoc)
- ConfigService schema documentation
- Error handling patterns
- Logging format documentation

### Architecture Documentation
- Update `.claude/memory-bank/techContext.md`
- Document credential chain flow
- Security patterns applied

---

## 8. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Credential leak in logs | CRITICAL | Medium | Never log tokens, automated scanning |
| Token expiration during operation | High | Medium | Implement refresh logic, retry |
| Auth fails in CI/CD | High | Medium | Test all credential methods, docs |
| Secrets in config files | Critical | Medium | Use env vars, validate on load |
| Rate limiting on auth | Medium | Low | Implement backoff, user warning |

---

## 9. Success Criteria

### Functional
- [ ] User can authenticate using environment variables
- [ ] User can authenticate using managed identity
- [ ] User can authenticate using user credentials (interactive)
- [ ] Azure CLI credentials work as fallback
- [ ] Configuration persists between CLI invocations
- [ ] All Azure SDK operations wrapped in AzureClient
- [ ] Error messages are helpful and actionable

### Non-Functional
- [ ] Code coverage >85% for services
- [ ] All tests passing
- [ ] No hardcoded secrets in codebase
- [ ] No credentials logged (even in debug)
- [ ] Performance: Auth cache hit <10ms
- [ ] Audit trail in structured JSON logs

### Security
- [ ] No credentials in error messages
- [ ] No tokens in logs or config files
- [ ] Credential cache cleared on error
- [ ] File permissions secure (600)
- [ ] Tokens never written to disk

### Documentation
- [ ] README updated with auth setup
- [ ] Troubleshooting guide complete
- [ ] Code comments explain security decisions
- [ ] Architecture documented

---

## 10. References

### Microsoft Learn Resources
- DefaultAzureCredential: https://learn.microsoft.com/dotnet/api/azure.identity.defaultazurecredential
- Identity Best Practices: https://learn.microsoft.com/azure/developer/javascript/javascript-sdk-best-practices
- Authentication Troubleshooting: https://learn.microsoft.com/azure/identity/troubleshoot
- Security Logging: https://learn.microsoft.com/azure/security/fundamentals/logging-and-monitoring
- CIS Benchmark: https://www.cisecurity.org/cis-benchmarks/

### Project Resources
- Security Architecture Guide: `.claude/instructions/security-architecture-guide.md`
- Implementation Roadmap: Section 7 of security guide
- Code Citations: Section 5 of security guide

---

## Checklist Before Starting Implementation

- [x] Security architecture reviewed (security-architecture-guide.md)
- [x] Complexity level: 3 (Intermediate)
- [x] All components identified
- [x] Security decisions documented with citations
- [x] Testing strategy clear
- [x] Documentation plan ready
- [x] Team alignment on approach

---

## Notes

- DefaultAzureCredential is production-ready and recommended by Microsoft
- Credential caching is essential for performance (avoid 1s+ auth delay)
- File-based cache adds complexity; start with memory-only
- Error messages should guide users to `.claude/instructions/` for help
- All decisions cited to microsoft-learn resources
