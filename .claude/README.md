# Claude Code Integration

This directory contains structured guidance for developing the Azure Infrastructure Creator with Claude Code.

Inspired by the [GitHub Copilot Agent Mode Starter Kit](https://github.com/bradcstevens/github-copilot-agent-mode-starter-kit), adapted for Claude and Azure infrastructure provisioning.

## Directory Structure

```
.claude/
├── memory-bank/          # Single source of truth for project context
├── instructions/         # Development guidance and best practices
├── templates/            # Reusable planning and task documents
└── chatmodes/           # Workflow modes for different development phases
```

## Quick Start

### For Starting New Work

1. **Read the context** - Start with `.claude/memory-bank/`:
   - `projectbrief.md` - Understand the project vision
   - `activeContext.md` - See what we're currently working on
   - `tasks.md` - Find the next task to implement

2. **Plan the feature** - Use `chatmodes/PLAN.md`:
   - Determine complexity level
   - Design the architecture
   - Create PLANNING.md from template
   - Create TASKS.md from template

3. **Implement** - Follow `chatmodes/IMPLEMENT.md`:
   - Code using TypeScript best practices
   - Write tests alongside code
   - Follow module organization
   - Mark tasks complete as you go

4. **Reflect** - Use `chatmodes/REFLECT.md`:
   - Review what you built
   - Document lessons learned
   - Update memory bank
   - Plan next features

## Key Files

### Memory Bank (Single Source of Truth)

**projectbrief.md**
- Project vision and goals
- Target users and success metrics
- Core features and technical stack
- **Read first to understand what we're building**

**activeContext.md**
- Current focus and status
- Recent work completed
- Next immediate steps
- Any current blockers

**progress.md**
- Phase-by-phase implementation status
- What's complete and what's pending
- Known issues and metrics
- Updated throughout development

**tasks.md**
- Breakdown of all work (current and planned)
- Task effort estimates
- Acceptance criteria for each task
- **Reference during implementation**

**techContext.md**
- Architecture overview and diagrams
- Technology stack and rationale
- Module organization
- Design patterns and best practices
- Security considerations

### Instructions

**claude-instructions.md**
- Code quality standards (TypeScript, testing, docs)
- Task management workflow
- Common pitfalls to avoid
- Development checklist

**azure-best-practices.md**
- Azure security and compliance guidance
- Resource provisioning best practices
- RBAC and least privilege patterns
- Performance and cost optimization
- CIS/PCI-DSS/HIPAA compliance templates

**cli-development-guide.md**
- TUI/menu design patterns
- Inquirer.js, Chalk, Ora usage
- Error handling and user feedback
- Command structure examples

**security-architecture-guide.md** ⭐ COMPREHENSIVE REFERENCE
- Secure CLI architecture with Azure (from microsoft-learn-researcher)
- Complete security implementation checklist (50+ items)
- Cost optimization patterns for Azure resources
- Code citation templates with Microsoft Learn links
- CIS, PCI-DSS, HIPAA compliance mappings
- 14-week implementation roadmap
- Critical feedback on anti-patterns
- 50+ direct citations to Microsoft Learn
- **Start here for security decisions**

### Templates

**PLANNING.template.md**
- Use when planning a new feature
- Covers overview, objectives, design, security, implementation plan
- Copy, fill in, then reference during development

**TASKS.template.md**
- Break down a feature into concrete tasks
- Multi-phase structure (Design → Implementation → Testing → Docs)
- Use for effort estimation and progress tracking

### Chatmodes (Workflows)

**PLAN.md** - Strategic Planning
- Determine complexity level
- Design the architecture
- Validate technology stack
- Create planning and task documents
- **Use this first for any new feature**

**IMPLEMENT.md** - Build Phase
- Write code following best practices
- TDD approach with tests
- Error handling and logging
- Verification and commit

**REFLECT.md** - Review & Learning
- Assess what was built
- Document lessons learned
- Identify improvements
- Update memory bank
- **Use after completing work**

## Development Workflow

### Starting a New Feature

```
1. Read .claude/memory-bank/ to understand context
2. Refer to .claude/chatmodes/PLAN.md
3. Create PLANNING.md and TASKS.md from templates
4. Get alignment on design
5. Begin implementation
```

### During Implementation

```
1. Refer to .claude/chatmodes/IMPLEMENT.md
2. Follow code patterns in cli-development-guide.md
3. Apply security practices from azure-best-practices.md
4. Follow coding standards in claude-instructions.md
5. Mark tasks complete in memory-bank/tasks.md as you go
```

### After Implementation

```
1. Use .claude/chatmodes/REFLECT.md
2. Write reflection document
3. Update memory-bank files
4. Document lessons learned
5. Plan next features
```

## Memory Bank Files - Update Schedule

**Daily**:
- `activeContext.md` - Update current focus

**Per Task Completion**:
- `tasks.md` - Mark task complete, add discovered work
- `progress.md` - Update what's done

**Per Feature Completion**:
- `progress.md` - Mark phase complete
- `activeContext.md` - Update next steps
- Create reflection in `reflection/` subdirectory

**Per Sprint/Milestone**:
- Review and summarize progress
- Identify technical debt
- Plan upcoming work

## Key Principles

### 1. Memory Bank is Source of Truth
All context lives in `.claude/memory-bank/`. If it's not there, it doesn't exist for future work.

### 2. Plan Before Code
Use PLAN mode to think through features before writing code. Good planning prevents rework.

### 3. Documentation as Code
Keep documentation in the repo alongside code. Update it as features change.

### 4. Security First
All provisioned infrastructure follows least privilege and encryption by default. Refer to azure-best-practices.md.

### 5. TDD Approach
Write tests before code. Tests are documentation of expected behavior.

## Using These Files with Claude

### When asking Claude to work on a feature:

```
"Please help me implement [Feature Name].

Context:
- Read .claude/memory-bank/projectbrief.md for vision
- Read .claude/memory-bank/tasks.md for specific tasks
- Refer to .claude/chatmodes/PLAN.md for approach
- Use patterns from .claude/instructions/*

When done, update:
- .claude/memory-bank/tasks.md (mark complete)
- .claude/memory-bank/progress.md (what was done)
- Commit with reference to task"
```

### When Claude is stuck:

```
"Can you check:
- .claude/memory-bank/techContext.md for architecture
- .claude/instructions/azure-best-practices.md for patterns
- .claude/instructions/cli-development-guide.md for examples

What patterns should we follow?"
```

### When reviewing work:

```
"Please verify:
- Acceptance criteria in .claude/memory-bank/tasks.md
- Patterns in .claude/instructions/claude-instructions.md
- Security checklist in .claude/instructions/azure-best-practices.md

Does this meet our standards?"
```

## Quick Reference

### Find Information About:

**"What are we building?"**
→ `.claude/memory-bank/projectbrief.md`

**"What's our current focus?"**
→ `.claude/memory-bank/activeContext.md`

**"What's the next task?"**
→ `.claude/memory-bank/tasks.md`

**"How should I code this?"**
→ `.claude/instructions/claude-instructions.md`

**"How does Azure [resource] work securely?"**
→ `.claude/instructions/security-architecture-guide.md` (comprehensive)
→ `.claude/instructions/azure-best-practices.md` (detailed patterns)

**"What's the secure architecture for this CLI?"**
→ `.claude/instructions/security-architecture-guide.md` - Start here

**"How do I build the CLI?"**
→ `.claude/instructions/cli-development-guide.md`

**"How do I plan a feature?"**
→ `.claude/chatmodes/PLAN.md`

**"How do I implement?"**
→ `.claude/chatmodes/IMPLEMENT.md`

**"What did we learn?"**
→ `.claude/memory-bank/reflection/`

## Contributing to This Structure

### Adding New Chatmodes

Create `.claude/chatmodes/[MODE].md` with:
1. Purpose (when to use)
2. Process flow (steps)
3. Checklist (verification)
4. Transitions (what comes next)
5. Tips and examples

### Updating Memory Bank

Edit `.claude/memory-bank/` files:
- Small updates directly
- Major changes: discuss with team first
- Always keep files in sync with reality

### Improving Instructions

Edit `.claude/instructions/` files to:
- Add patterns that worked well
- Remove patterns that didn't work
- Share lessons learned
- Improve examples and clarity

## Questions?

If something is unclear:
1. Check the specific instruction file
2. Look for related patterns in the codebase
3. Ask Claude to clarify the guidance
4. Update documentation if it was confusing

## References

- Original Kit: [GitHub Copilot Agent Mode Starter Kit](https://github.com/bradcstevens/github-copilot-agent-mode-starter-kit)
- Azure Docs: [Azure Architecture](https://docs.microsoft.com/en-us/azure/architecture/)
- Best Practices: [Azure Well-Architected Framework](https://docs.microsoft.com/en-us/azure/architecture/framework/)
- Security: [CIS Azure Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
