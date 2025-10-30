# Azure Infrastructure Creator

A secure, easy-to-use CLI tool for provisioning Azure infrastructure following best practices and least privilege principles.

## Features

- **TUI Interface**: Interactive terminal user interface with intuitive prompts
- **Best Practices**: Built-in security best practices and compliance configurations
- **Least Privilege**: Always applies minimal required permissions (RBAC)
- **Multi-Resource Support**:
  - Virtual Machines
  - Storage Accounts
  - Databases (SQL, Cosmos DB)
  - Networking (VNets, NSGs)
  - Web Apps / App Services
  - And more...

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Azure CLI installed and authenticated
- Azure subscription with appropriate permissions

### Installation

```bash
# Clone the repository
git clone https://github.com/MSSecCSA/azureinfracreator.git
cd azureinfracreator

# Install dependencies
npm install

# Build the project
npm run build
```

### Usage

```bash
# Development mode with live reload
npm run dev

# Production mode
npm start
```

## Project Structure

```
azureinfracreator/
├── src/
│   ├── cli/              # CLI and TUI logic
│   ├── services/         # Azure SDK integration
│   ├── config/           # Configuration management
│   ├── templates/        # Infrastructure templates
│   └── index.ts         # Entry point
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture Principles

### Security-First Design
- RBAC (Role-Based Access Control) by default
- Managed identities where possible
- Encryption at rest and in transit
- Private endpoints for PaaS services

### Infrastructure as Code
- Consistent, reproducible deployments
- Version controlled configurations
- Easy to audit and review

### Best Practices
- Azure Well-Architected Framework compliance
- Scalability considerations
- Cost optimization
- Monitoring and logging ready

## Development

### Scripts

- `npm run dev` - Run in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run compiled version
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

### Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Author

MSSecCSA
