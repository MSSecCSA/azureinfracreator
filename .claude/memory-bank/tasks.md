# Project Tasks - Azure Infrastructure Creator

## Phase 1: Foundation (COMPLETED)

- [x] Initialize TypeScript/Node.js project structure
- [x] Set up package.json with Azure SDK dependencies
- [x] Configure tsconfig.json
- [x] Create GitHub repository
- [x] Initialize git and first commit
- [x] Create README documentation
- [x] Set up base TUI scaffolding with inquirer/chalk/ora

---

## Phase 2: Core Infrastructure & Authentication

### 2.1 Azure Authentication Module (Estimated: 6-8 hours)

- [ ] Implement @azure/identity integration
  - [ ] DefaultAzureCredential chain setup
  - [ ] Service Principal auth flow
  - [ ] User/Device Code auth flow
  - [ ] Credentials caching in ~/.azure/credentials

- [ ] Create AuthService class (`src/services/auth.ts`)
  - [ ] Credential provider initialization
  - [ ] Subscription ID validation
  - [ ] Token refresh handling
  - [ ] Error handling with helpful messages

- [ ] Write unit tests for authentication
  - [ ] Test successful authentication
  - [ ] Test failed credentials
  - [ ] Test token expiration

**Acceptance Criteria**:
- User can authenticate with Azure using multiple methods
- Credentials are cached securely
- Error messages guide users to fix auth issues
- All auth flows tested

---

### 2.2 Configuration Management (Estimated: 4-5 hours)

- [ ] Create config file structure (`src/config/`)
  - [ ] settings.json schema
  - [ ] Default config values
  - [ ] User home directory config path (~/.azureinfracreator/)

- [ ] Implement ConfigService (`src/config/service.ts`)
  - [ ] Load/save configuration
  - [ ] Merge defaults with user config
  - [ ] Environment variable overrides
  - [ ] Validate configuration

- [ ] Add config management commands to CLI
  - [ ] `config set` command
  - [ ] `config get` command
  - [ ] `config init` for first-time setup

**Acceptance Criteria**:
- Configuration persists between sessions
- Users can override settings via environment variables
- Config validation catches errors early
- Clear error messages for invalid configs

---

### 2.3 Azure Client Setup (Estimated: 3-4 hours)

- [ ] Create AzureClient class (`src/services/azure-client.ts`)
  - [ ] Wrap @azure/arm-resources
  - [ ] Wrap @azure/arm-compute
  - [ ] Wrap @azure/arm-storage
  - [ ] Wrap @azure/arm-network

- [ ] Implement common operations
  - [ ] List subscriptions
  - [ ] List/create resource groups
  - [ ] List regions
  - [ ] Error handling patterns

- [ ] Add logging/instrumentation
  - [ ] Debug logging for API calls
  - [ ] Operation timing
  - [ ] Error tracking

**Acceptance Criteria**:
- Can authenticate and interact with Azure APIs
- All common operations working
- Clear error messages for API failures
- Useful debug logging available

---

## Phase 3: Resource Provisioning Features

### 3.1 Virtual Machine Provisioning (Estimated: 10-12 hours)

- [ ] Create VMService (`src/services/vm.ts`)
  - [ ] VM SKU/size guidance
  - [ ] OS image selection (Windows/Linux)
  - [ ] Network interface creation
  - [ ] Storage configuration
  - [ ] System-assigned managed identity setup

- [ ] TUI workflow for VM creation (`src/cli/vm.ts`)
  - [ ] Interactive wizard for VM parameters
  - [ ] Display default recommended configurations
  - [ ] Confirm before provisioning
  - [ ] Progress tracking

- [ ] Security features
  - [ ] Automatic RBAC assignment
  - [ ] Enable Azure Disk Encryption
  - [ ] Azure Monitor agent setup
  - [ ] NSG with secure defaults

- [ ] Testing
  - [ ] Unit tests for VMService
  - [ ] Mock Azure SDK responses

**Acceptance Criteria**:
- User can provision a VM through interactive prompts
- VM created with least privilege and security defaults
- Provisioning provides progress feedback
- All operations logged and documented

---

### 3.2 Storage Account Provisioning (Estimated: 8-10 hours)

- [ ] Create StorageService (`src/services/storage.ts`)
  - [ ] Storage account creation
  - [ ] Access tier selection (Hot/Cool/Archive)
  - [ ] Replication strategy
  - [ ] Encryption configuration
  - [ ] Network access rules (firewall)

- [ ] TUI workflow for storage creation
  - [ ] Interactive selection of options
  - [ ] Explain security implications
  - [ ] Generate managed identity RBAC

- [ ] Security features
  - [ ] HTTPS only enforcement
  - [ ] Minimum TLS version enforcement
  - [ ] Service endpoints configuration
  - [ ] Shared access signature (SAS) guidance

**Acceptance Criteria**:
- Storage account created with security defaults
- User guided through configuration options
- RBAC permissions auto-assigned for services
- Clear documentation of connection methods

---

### 3.3 Database Provisioning (Estimated: 12-14 hours)

- [ ] Create DatabaseService (`src/services/database.ts`)
  - [ ] Azure SQL Database support
  - [ ] Azure Cosmos DB support
  - [ ] MySQL/PostgreSQL support (if applicable)

- [ ] Azure SQL features
  - [ ] Server and database creation
  - [ ] Firewall rules
  - [ ] Authentication method selection
  - [ ] Backup configuration
  - [ ] Encryption (TDE, Always Encrypted)

- [ ] Cosmos DB features
  - [ ] Account creation
  - [ ] Database and container setup
  - [ ] Consistency level selection
  - [ ] Backup policies

- [ ] TUI workflows for each database type
  - [ ] Parameter selection
  - [ ] Security configuration
  - [ ] Cost estimation preview

**Acceptance Criteria**:
- Multiple database types supported
- All databases provisioned with security best practices
- Connection strings generated securely
- Backup/recovery configured by default

---

### 3.4 Networking Resources (Estimated: 10-12 hours)

- [ ] Create NetworkService (`src/services/network.ts`)
  - [ ] Virtual Network (VNet) creation
  - [ ] Subnet configuration
  - [ ] Network Security Groups (NSGs)
  - [ ] Route tables

- [ ] Security features
  - [ ] NSG rule templates (HTTP, HTTPS, RDP, SSH)
  - [ ] Least privilege default rules
  - [ ] DDoS protection basic tier
  - [ ] Service endpoints

- [ ] TUI workflow for network setup
  - [ ] Guided VNet creation
  - [ ] NSG rule builder
  - [ ] Subnet planning assistance

**Acceptance Criteria**:
- Networks created with secure defaults
- NSG rules follow principle of least privilege
- Services properly isolated with subnets
- Clear documentation of network topology

---

## Phase 4: Security & Compliance

### 4.1 RBAC & Permissions (Estimated: 6-8 hours)

- [ ] Create RBACService (`src/services/rbac.ts`)
  - [ ] Built-in role definitions
  - [ ] Scope assignment
  - [ ] Service principal RBAC
  - [ ] Managed identity RBAC

- [ ] RBAC templates for common scenarios
  - [ ] Reader role for monitoring
  - [ ] Contributor for specific resources
  - [ ] Storage Blob Data Reader/Writer
  - [ ] Key Vault Secrets User

**Acceptance Criteria**:
- Resources automatically get appropriate RBAC
- Users understand what permissions are assigned
- Least privilege enforced by default
- Easy to audit who has what permissions

---

### 4.2 Azure Key Vault Integration (Estimated: 5-6 hours)

- [ ] Create KeyVaultService (`src/services/keyvault.ts`)
  - [ ] Key Vault creation
  - [ ] Secret management
  - [ ] Key rotation policies
  - [ ] Access policies

- [ ] Credential storage
  - [ ] Store connection strings in Key Vault
  - [ ] Reference secrets in configurations
  - [ ] Automatic secret expiration warnings

**Acceptance Criteria**:
- All secrets stored in Key Vault
- No secrets in config files or logs
- Easy credential rotation workflow

---

## Phase 5: Advanced Features

### 5.1 Infrastructure Template Generation (Estimated: 8-10 hours)

- [ ] Generate Bicep templates from provisioned resources
- [ ] Generate Terraform configurations
- [ ] Export infrastructure as code
- [ ] Versioning of templates

**Acceptance Criteria**:
- User can export infrastructure as IaC
- Generated code follows best practices
- Can re-provision from exported templates

---

### 5.2 Cost Estimation (Estimated: 6-8 hours)

- [ ] Integrate Azure Pricing API
- [ ] Estimate costs before provisioning
- [ ] Show cost breakdown by resource
- [ ] Cost optimization suggestions

**Acceptance Criteria**:
- Users see estimated monthly costs
- Suggestions for cost optimization
- Easy to compare configuration options

---

## Discovered During Work

(This section tracks tasks discovered/added during implementation)

---

## Notes

- All work follows TypeScript strict mode
- All features tested with Jest
- All UI uses consistent Chalk color scheme
- All Azure operations include retry logic
- All errors have helpful messages
- Documentation updated as features complete
