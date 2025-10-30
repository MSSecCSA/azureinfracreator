# Azure Infrastructure Creator - Project Brief

## Project Overview

**Name**: Azure Infrastructure Creator
**Purpose**: A secure, interactive CLI tool for provisioning Azure infrastructure following best practices and least privilege principles
**Author**: MSSecCSA
**Repository**: https://github.com/MSSecCSA/azureinfracreator

## Vision

Enable non-experts to provision enterprise-grade Azure infrastructure with built-in security, compliance, and best practices enforcement. Eliminate manual configuration errors and security misconfigurations through guided, interactive provisioning.

## Core Goals

1. **Security-First** - All infrastructure provisioned with least privilege by default
2. **Best Practices** - Adhere to Azure Well-Architected Framework
3. **User-Friendly** - Interactive TUI makes complex infrastructure accessible
4. **Extensible** - Easy to add new resource types and patterns
5. **Documented** - Clear deployment, usage, and security documentation

## Target Users

- DevOps engineers
- Cloud architects
- IT operations teams
- Organizations migrating to Azure
- Security-conscious teams needing compliant infrastructure

## Key Features (Current & Planned)

**MVP Features**:
- Interactive TUI menu system
- Azure authentication integration
- Virtual Machine provisioning
- Storage Account creation
- Database setup (SQL, Cosmos DB)
- Network configuration (VNets, NSGs, Firewalls)
- RBAC policy enforcement
- Configuration persistence

**Future Enhancements**:
- Terraform/Bicep template generation
- Cost estimation before provisioning
- Compliance checklist validation
- Infrastructure drift detection
- Multi-region deployment
- Backup & disaster recovery configuration

## Technical Stack

- **Language**: TypeScript/Node.js
- **CLI Framework**: Commander.js
- **TUI**: Inquirer.js + Chalk + Ora
- **Azure SDKs**: @azure/arm-* packages
- **Auth**: @azure/identity (Managed Identity / User credentials)
- **Testing**: Jest
- **Build**: TypeScript compiler
- **VCS**: Git / GitHub

## Design Principles

### Security
- Least privilege access by default
- No hardcoded secrets (use Azure Key Vault integration)
- Input validation on all user inputs
- Audit logging of all operations
- Role-based access control (RBAC) enforcement

### Usability
- Clear, step-by-step guided workflows
- Sensible defaults with override options
- Real-time feedback and progress indicators
- Helpful error messages with remediation steps
- Non-technical language in prompts

### Maintainability
- Modular component architecture
- Clear separation of concerns
- Comprehensive test coverage
- Well-documented code
- Type-safe TypeScript throughout

### Compliance
- Azure Well-Architected Framework alignment
- CIS Azure Foundations Benchmark compliance
- PCI-DSS ready patterns
- HIPAA consideration for healthcare
- SOC 2 Type II compatible practices

## Success Metrics

- **Usability**: Non-cloud users can provision infrastructure
- **Security**: Zero security misconfigurations in provisioned resources
- **Speed**: 80% reduction in manual provisioning time
- **Reliability**: >99% successful deployments
- **Adoption**: 100+ GitHub stars within 6 months
