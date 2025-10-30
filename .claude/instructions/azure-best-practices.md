# Azure Best Practices Guide

## Security First Principles

### Authentication & Identity
- **Use Managed Identities**: Prefer system/user-assigned managed identities over service principals
- **DefaultAzureCredential**: Always use credential chaining for flexibility
- **No Credential Sharing**: Each resource gets its own identity where possible
- **MFA Default**: Guide users to enable MFA on their accounts
- **Service Principal Rotation**: Document credential rotation if service principals are used

### RBAC & Least Privilege

**Default Rule**: Assign minimum required permissions, document why

**Common Roles**:
- `Reader` - Read-only access (monitoring)
- `Contributor` - Full resource management
- `Storage Blob Data Reader` - Read storage blobs
- `Storage Blob Data Contributor` - Read/write storage blobs
- `Key Vault Secrets User` - Read secrets from Key Vault
- `Virtual Machine Administrator Login` - SSH/RDP access

**Custom Roles**: Create only if built-in roles don't fit

**Example - Storage Access**:
```json
{
  "principalId": "<managed-identity-id>",
  "roleDefinitionId": "<Storage-Blob-Data-Reader-role-id>",
  "scope": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}"
}
```

### Network Security

**Virtual Networks**:
- Default deny for all inbound traffic
- Explicitly allow only required traffic
- Use service endpoints to restrict Azure service access to VNET
- Enable DDoS Protection Standard for public endpoints

**Network Security Groups (NSGs)**:
```
Inbound Rules (default):
- DENY all

Then add:
- ALLOW HTTP 80 (if web traffic)
- ALLOW HTTPS 443 (always)
- ALLOW RDP 3389 (Windows, restricted to admin IPs)
- ALLOW SSH 22 (Linux, restricted to admin IPs)
```

**Deny Rules**:
- Always add explicit DENY for known bad actors
- Log all denied connections

### Encryption

**Data at Rest**:
- Enable Azure Storage Encryption (automatic)
- Enable SQL TDE (Transparent Data Encryption)
- Enable Cosmos DB encryption
- Use Customer-Managed Keys (CMK) in Key Vault for high-security needs

**Data in Transit**:
- HTTPS only (TLS 1.2 minimum)
- Service-to-service: Use managed identities, not connection strings
- VPN Gateway for site-to-site communication

**Key Management**:
- Store all keys in Azure Key Vault
- Enable soft delete and purge protection
- Implement key rotation policies
- Audit key access

### Azure Key Vault Integration

**Never Do**:
```typescript
// ❌ WRONG
const connectionString = "DefaultEndpointsProtocol=https;...";
```

**Always Do**:
```typescript
// ✅ RIGHT
const client = new SecretClient(
  vaultUrl,
  new DefaultAzureCredential()
);
const secret = await client.getSecret("db-connection-string");
```

## Resource Provisioning Best Practices

### Virtual Machines

**Security Configuration**:
```typescript
{
  // Use managed identity (no credentials)
  identity: {
    type: 'SystemAssigned'
  },

  // Enable disk encryption
  hardwareProfile: {
    vmSize: 'Standard_B2s' // Appropriate for workload
  },

  // Use managed disks (automatic encryption)
  storageProfile: {
    osDisk: {
      managedDisk: {
        storageAccountType: 'Premium_LRS' // Encrypted by default
      }
    }
  },

  // Enable monitoring
  diagnosticsProfile: {
    bootDiagnostics: {
      enabled: true
    }
  }
}
```

**Monitoring**:
- Enable Azure Monitor agent
- Enable boot diagnostics
- Configure alerts for high CPU/memory
- Send logs to Log Analytics workspace

**Patching**:
- Enable auto-patching for Windows (Patch Tuesday)
- Configure Linux updates
- Test patches before applying to production

### Storage Accounts

**Security Settings**:
```typescript
{
  // HTTPS only
  supportsHttpsTrafficOnly: true,

  // Modern TLS
  minimumTlsVersion: 'TLS1_2',

  // Encryption
  encryption: {
    services: {
      blob: { enabled: true },
      file: { enabled: true }
    },
    keySource: 'Microsoft.Storage' // or Key Vault CMK
  },

  // Public access disabled by default
  publicNetworkAccess: 'Disabled', // Then add service endpoints

  // Firewall rules
  networkAcls: {
    defaultAction: 'Deny',
    bypass: ['AzureServices'], // Allow ARM templates, etc.
    virtualNetworkRules: [{
      id: '/subscriptions/.../subnet'
    }]
  }
}
```

**Lifecycle Management**:
- Auto-delete old backups
- Archive infrequently accessed data
- Set retention policies

### SQL Database

**Security**:
```typescript
{
  // Enable TDE (automatic)
  transparentDataEncryption: true,

  // Always Encrypted for sensitive columns
  alwaysEncrypted: true,

  // Firewall rules
  firewallRules: [{
    name: 'AllowVnet',
    startIpAddress: 'Virtual Network',
    endIpAddress: 'Virtual Network'
  }],

  // Managed identity auth (no passwords)
  useManagedIdentity: true,

  // Vulnerability assessment
  vulnerabilityAssessment: {
    enabled: true,
    storageContainerPath: 'https://....'
  },

  // Threat detection
  threatDetectionPolicy: {
    enabled: true,
    emailNotifications: ['admin@example.com']
  }
}
```

**Backup**:
- LRS redundancy minimum
- GRS for production
- Retention: 7-35 days (longer for compliance)
- Test restore procedures

### Cosmos DB

**Security**:
```typescript
{
  // Strong consistency or bounded staleness
  consistencyPolicy: 'Strong',

  // Encryption with CMK
  keyVaultKeyUri: 'https://vault.azure.net/keys/...',

  // IP firewall
  ipRangeFilter: ['203.0.113.0'],

  // Virtual network rules
  virtualNetworkRules: [{
    id: '/subscriptions/.../subnet'
  }],

  // Private endpoint (recommended)
  // Disable public endpoint

  // Managed identity for auth
  useManagedIdentity: true
}
```

**Consistency Levels**:
- `Strong`: Read latest writes (lower performance)
- `BoundedStaleness`: Configurable lag (balance)
- `Session`: Session consistency (best for users)
- `Eventual`: Highest performance (eventual consistency)

## Well-Architected Framework Alignment

### Reliability
- [x] Use availability zones (multi-zone deployment)
- [x] Enable auto-failover for databases
- [x] Configure backup and recovery
- [x] Use load balancers for distribution
- [x] Implement circuit breaker patterns

### Security
- [x] Least privilege access (RBAC)
- [x] Encryption at rest and in transit
- [x] Network isolation (NSGs, firewalls)
- [x] Identity verification (AAD integration)
- [x] Regular security assessments

### Cost Optimization
- [x] Right-sizing VMs (advisor recommendations)
- [x] Reserved instances for predictable workloads
- [x] Spot instances for non-critical workloads
- [x] Archive cold data
- [x] Monitor and alert on cost spikes

### Operational Excellence
- [x] Infrastructure as Code (Terraform/Bicep)
- [x] Automated deployments (CI/CD)
- [x] Comprehensive monitoring and logging
- [x] Clear documentation
- [x] Regular reviews and optimization

### Performance Efficiency
- [x] Use CDN for static content
- [x] Enable caching (Redis, App Service)
- [x] Optimize database queries
- [x] Use appropriate service tiers
- [x] Monitor and tune regularly

## Compliance & Governance

### CIS Azure Foundations Benchmark
Apply these controls:
- [ ] Ensure MFA is required for all users
- [ ] Ensure storage is encrypted
- [ ] Ensure network security groups are configured
- [ ] Ensure SQL databases have auditing enabled
- [ ] Ensure key vault logging is enabled

### PCI-DSS (Payment Card Industry)
If handling card data:
- [ ] Strong encryption for cardholder data
- [ ] Regular security testing
- [ ] Access controls and audit logs
- [ ] Incident response plan
- [ ] Annual compliance assessment

### HIPAA (Healthcare)
If handling health information:
- [ ] Encryption at rest and in transit
- [ ] Access controls with audit logging
- [ ] Data residency in US (if required)
- [ ] Business Associate Agreement (BAA)
- [ ] Regular risk assessments

### SOC 2 Type II
For service organizations:
- [ ] Comprehensive audit logging
- [ ] Access controls and reviews
- [ ] Change management procedures
- [ ] Incident detection and response
- [ ] Regular attestations

## Code Patterns

### Connection Retry Pattern
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, delayMs * Math.pow(2, i))
      );
    }
  }
}
```

### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private failureCount = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') throw new Error('Circuit open');

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

## Monitoring & Logging

### What to Log
- Resource creation/deletion operations
- RBAC changes
- Authentication failures
- Configuration changes
- Errors and exceptions
- Performance metrics

### What NOT to Log
- Passwords or connection strings
- Secret keys
- Personal identifiable information (PII)
- API keys or tokens
- Encryption keys

### Log Retention
- Operational logs: 30 days
- Audit logs: 90 days
- Compliance logs: 1-7 years (regulatory requirement)

## Automation & Infrastructure as Code

### Preferred Approaches
1. **Terraform**: Multi-cloud support, large community
2. **Bicep**: Azure-native, good for ARM templates
3. **Azure CLI**: Great for scripting
4. **Azure SDK**: Programmatic control

### Code Generation
Always generate code with:
- Proper comments explaining resources
- Security settings documented
- Parameterized values (not hardcoded)
- Tested and validated before deployment

## Performance Optimization

### Database
- Add indexes on frequently filtered columns
- Use partitioning for large tables
- Monitor query performance
- Use connection pooling

### Storage
- Use CDN for static files
- Enable compression
- Implement caching strategies
- Consider archive tier for old data

### Networking
- Use private endpoints instead of public
- Enable acceleration for large files
- Consider ExpressRoute for high-bandwidth

### Compute
- Right-size VMs based on metrics
- Use autoscaling for variable workloads
- Enable caching at application level
- Profile and optimize hot paths

## Regular Review Checklist

Run monthly:
- [ ] Review access logs for anomalies
- [ ] Check for unused resources (cost savings)
- [ ] Verify RBAC assignments are still appropriate
- [ ] Check encryption status
- [ ] Review security recommendations from Azure Advisor
- [ ] Test backup/restore procedures
- [ ] Update documentation if changed
