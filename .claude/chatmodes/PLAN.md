# PLAN Mode - Strategic Planning

## Purpose
Determine feature complexity, design the implementation approach, and validate the technology stack before coding begins.

## When to Use
- Starting a new feature
- Planning major refactoring
- Designing system changes
- Before implementing anything significant

## Process Flow

```
1. Understand Requirements
   ├─ Read task/feature description
   ├─ Check existing codebase for similar patterns
   └─ Ask clarifying questions if needed

2. Determine Complexity Level
   ├─ Identify scope and impact
   ├─ Assess design decisions needed
   ├─ Evaluate risk and effort
   └─ Assign Level 1-4

3. Technology Validation Gate
   ├─ Document required technologies
   ├─ Verify availability and compatibility
   ├─ Check for version conflicts
   └─ Create minimal POC if uncertain

4. Design Phase
   ├─ Sketch architecture
   ├─ Identify components
   ├─ Design API contracts
   └─ Document security model

5. Create Plan Document
   ├─ Use PLANNING.template.md
   ├─ Fill in all sections
   ├─ Get alignment on approach
   └─ Document dependencies

6. Create Task List
   ├─ Use TASKS.template.md
   ├─ Break into concrete tasks
   ├─ Assign effort estimates
   └─ Identify dependencies
```

## Complexity Assessment

### Level 1: Quick Fix (1-4 hours)
Single bug fix with minimal refactoring
- Example: Fix null pointer in VM creation
- Process: Direct fix, test, document
- No planning document needed

### Level 2: Simple Enhancement (4-8 hours)
Add feature to existing component, minimal design decisions
- Example: Add new VM size option
- Process: PLAN (brief) → IMPLEMENT → TEST
- Simple PLANNING document

### Level 3: Intermediate Feature (2-3 days)
New feature requiring design, multiple components
- Example: VM provisioning service
- Process: PLAN → DESIGN → IMPLEMENT → TEST
- Comprehensive PLANNING document
- Multiple TASKS phases

### Level 4: Enterprise System (1-2 weeks+)
Major architectural change, multiple subsystems
- Example: Complete security/RBAC redesign
- Process: PLAN → DESIGN (extensive) → IMPLEMENT (phased) → TEST → DEPLOY
- Detailed PLANNING with risk assessment
- Detailed TASKS with multiple phases

## Key Questions to Answer

### Scope & Impact
- [ ] What problem does this solve?
- [ ] Who are the users?
- [ ] What components are affected?
- [ ] What's the blast radius if this breaks?

### Design Decisions
- [ ] What are the architectural options?
- [ ] What are the trade-offs?
- [ ] Why this approach over others?
- [ ] What design patterns apply?

### Technology
- [ ] What Azure services needed?
- [ ] What npm packages required?
- [ ] Are they compatible?
- [ ] Any version conflicts?

### Security
- [ ] What data needs protection?
- [ ] What RBAC model needed?
- [ ] How are secrets handled?
- [ ] What compliance applies?

### Testing
- [ ] What test strategy?
- [ ] Unit/integration/E2E coverage?
- [ ] How to mock Azure services?
- [ ] Test data requirements?

### Effort & Risk
- [ ] What's the realistic timeline?
- [ ] What could go wrong?
- [ ] What's the mitigation?
- [ ] Any blockers?

## Technology Validation Gate

Before proceeding to implementation:

1. **Document Stack**
   ```
   - @azure/arm-compute v33.0.0 (VM provisioning)
   - @azure/identity v4.0.0 (Authentication)
   - inquirer v8.2.5 (User prompts)
   ```

2. **Verify Compatibility**
   - Check package.json for conflicts
   - Verify with latest npm
   - Test imports in Node.js version

3. **Create Minimal POC**
   ```typescript
   // Minimal test to verify tech works
   import { ComputeManagementClient } = require('@azure/arm-compute');
   const client = new ComputeManagementClient(...);
   // Can we instantiate and call a method?
   ```

4. **Confirm Stack**
   - All required packages available
   - No version conflicts
   - Proof of concept working
   - Dependencies documented

## Planning Document Template

Always use `.claude/templates/PLANNING.template.md`

Required sections:
1. Overview (problem, users, success metrics)
2. Objectives & Scope (goals, in/out scope)
3. Technical Approach (architecture, components, decisions)
4. Security (data protection, RBAC, compliance)
5. Implementation Plan (phases and tasks)
6. Testing Strategy
7. Documentation Plan
8. Risks & Mitigations
9. Success Criteria
10. References

## Task List Template

Always use `.claude/templates/TASKS.template.md`

Structure:
- Phase 1: Analysis & Design (2-3 days worth)
- Phase 2: Core Implementation (3-5 days worth)
- Phase 3: Integration & Enhancement (1-2 days worth)
- Phase 4: Testing (2-3 days worth)
- Phase 5: Documentation (1-2 days worth)
- Phase 6: Release & Cleanup (0.5-1 day)

Each task:
- Specific and actionable
- 2-8 hours of effort
- Clear acceptance criteria
- Ordered with dependencies

## Checklist Before Exiting PLAN Mode

- [ ] Complexity level assigned
- [ ] Requirements clearly understood
- [ ] Architecture designed and reviewed
- [ ] Technology stack validated
- [ ] PLANNING document complete
- [ ] TASKS document complete
- [ ] Team alignment achieved
- [ ] No blockers identified
- [ ] Risk mitigation planned

## What NOT to Do in PLAN Mode

❌ Write any implementation code
❌ Create pull requests
❌ Make design decisions without documentation
❌ Skip the technology validation gate
❌ Proceed if you're unsure about approach

## Transitions

**From PLAN Mode**:
- → **DESIGN Mode**: For Level 3-4 features requiring detailed architecture design
- → **IMPLEMENT Mode**: For Level 1-2 features or after DESIGN phase complete

**To PLAN Mode** (from IMPLEMENT):
- If unexpected complexity discovered
- If architecture needs rethinking
- If new technologies needed
- Update PLANNING and TASKS documents

## Output

When PLAN mode is complete:

1. **PLANNING.md** - Feature planning document
2. **TASKS.md** - Actionable task breakdown
3. **Approval** - Team alignment on approach
4. **Handoff** - Ready to start implementation

## Example Flow

```
User: "Add cost estimation feature"

PLAN Mode:
1. Read requirements
2. Check existing services
3. Identify: Azure pricing API, cost display logic
4. Level: 2 (intermediate feature)
5. Create PLANNING.md
6. Create TASKS.md (5 phases)
7. Validate technology stack
8. Get team alignment
9. Transition to IMPLEMENT

Ready to code!
```

## Tips for Effective Planning

1. **Be Specific**: General plans lead to wasted effort
2. **Document Decisions**: Future you needs to know WHY
3. **Validate Early**: Catch blockers before coding
4. **Realistic Estimates**: Account for testing and docs
5. **Security First**: Address security in planning, not later
6. **Ask Questions**: Better now than midway through
7. **Risk Assessment**: Identify and mitigate risks upfront
8. **Team Alignment**: Everyone should understand the plan
