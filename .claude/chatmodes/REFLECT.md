# REFLECT Mode - Review & Learning

## Purpose
Review completed work, document lessons learned, and prepare for next tasks.

## When to Use
- After completing a feature (IMPLEMENT phase done)
- Before archiving work for next phase
- End of sprint/milestone
- Major features or architectural changes

## When to Call REFLECT

You'll transition to REFLECT when:
- ✅ All code is written
- ✅ All tests are passing
- ✅ All acceptance criteria met
- ✅ Documentation is complete
- ✅ Code is committed

## REFLECT Process

### Phase 1: Structured Review

#### 1.1 Implementation Review
```
Questions to answer:

Did we accomplish the goals?
- [ ] All acceptance criteria met
- [ ] Features work as planned
- [ ] No critical bugs found
- [ ] Performance acceptable

Was the implementation quality good?
- [ ] Code is clean and maintainable
- [ ] Tests cover edge cases
- [ ] Error handling is robust
- [ ] Security properly implemented

Did we follow the plan?
- [ ] Stayed with architecture design
- [ ] Tasks completed as estimated
- [ ] No major deviations
- [ ] Blockers were resolved
```

#### 1.2 What Went Well

Document the successes:

```
Examples:
- TDD approach caught bugs early
- Mocking Azure SDK worked perfectly
- CLI flow was intuitive to users
- Performance was better than expected
- Security integration was straightforward
- Team collaboration was great

List 3-5 things that went well and WHY
```

#### 1.3 What Could Be Better

Identify improvements:

```
Examples:
- Azure error messages were unclear
- Test setup was verbose
- Documentation took longer than expected
- Initial estimate was off by 2 hours
- Some edge cases missed
- Code review found issues

List 3-5 areas for improvement
Why did each happen?
How to avoid in future?
```

#### 1.4 Lessons Learned

Extract wisdom:

```
Format:
Lesson: [What we learned]
Context: [When/why we learned it]
Application: [How to apply going forward]

Examples:

Lesson: Always mock Azure SDK in tests
Context: Real calls to test subscription were slow
Application: In future, create utility for mocking

Lesson: Get user feedback early
Context: UI flow needed redesign after user testing
Application: Plan user testing in PLAN phase

Lesson: Error messages matter
Context: Users got stuck on cryptic Azure errors
Application: Add error handling with user guidance
```

#### 1.5 Metrics Review

Analyze the numbers:

```
Planning Accuracy:
- Estimated: [X hours]
- Actual: [Y hours]
- Variance: [+/- %]

Quality Metrics:
- Test coverage: [X%]
- Build success rate: [X%]
- Bugs found: [X] (in testing)
- Bugs found: [X] (post-release)

Code Quality:
- Average file size: [X lines]
- Cyclomatic complexity: [X]
- TypeScript errors: [0]

Performance:
- Build time: [X seconds]
- Test suite time: [X seconds]
- Slowest operation: [X ms]
```

### Phase 2: Documentation

#### 2.1 Create Reflection Document

Save your analysis:

```markdown
# Reflection: [Feature Name]

## Summary
[1-2 sentences on what was built and outcome]

## What Went Well
- [Success 1] - [Why it worked]
- [Success 2] - [Why it worked]

## What Could Be Better
- [Issue 1] - [Why it happened] → [How to improve]
- [Issue 2] - [Why it happened] → [How to improve]

## Lessons Learned
- Lesson 1: [What we learned] → [How to apply]
- Lesson 2: [What we learned] → [How to apply]

## Metrics
- Estimated: X hours | Actual: Y hours | Variance: ±Z%
- Test Coverage: X%
- Bugs in testing: X | Post-release: X

## Technical Insights
- [Architecture decision that worked well]
- [Code pattern that simplified things]
- [Unexpected challenge and how we solved it]

## Next Time
If we build something similar again:
- [Do this again] - [It worked great]
- [Change this] - [Do this instead]
- [Investigate this] - [It was unclear]

## Notes
[Any additional context or follow-up items]
```

Location: `.claude/memory-bank/reflection/[feature-name].md`

#### 2.2 Update Memory Bank

Update main tracking files:

**progress.md**:
- Mark phase COMPLETE
- Note what was accomplished
- Add completion date
- Update metrics

**tasks.md**:
- Mark all tasks COMPLETE
- Note any discovered work that wasn't done
- Update "Discovered During Work" section
- Add any post-completion findings

**activeContext.md**:
- Update current status
- Note completion
- Identify what's next
- Clear any blockers

#### 2.3 Identify Next Work

Plan ahead:

```
Next Feature Ideas:
1. [Feature] - [Brief description] - [Estimated level 1-4]
2. [Feature] - [Brief description] - [Estimated level 1-4]

Technical Debt:
1. [Refactoring] - [Why needed] - [Estimated effort]
2. [Optimization] - [Why needed] - [Estimated effort]

Bug Fixes:
1. [Minor bug] - [Description] - [Estimated effort]

Improvements:
1. [Enhancement] - [Why it would help] - [Estimated effort]
```

### Phase 3: Knowledge Transfer

#### 3.1 Update Documentation

Make sure future developers understand:

**README.md**:
- Add/update feature description
- Add examples of usage
- Link to related docs

**.claude/memory-bank/**:
- Update techContext.md if architecture changed
- Add any new patterns discovered
- Document any workarounds

**Code comments**:
- Add JSDoc to newly created classes
- Document complex logic
- Add examples in docstrings

#### 3.2 Create Examples

If it's user-facing:

```typescript
/**
 * Example: Create a VM with all security defaults
 *
 * const service = new VMService(client);
 * const vm = await service.createVM({
 *   name: 'production-web',
 *   size: 'Standard_B2s',
 *   location: 'eastus'
 * });
 *
 * // VM created with:
 * // - System-assigned managed identity
 * // - Azure Disk Encryption enabled
 * // - Azure Monitor agent configured
 * // - Security updates enabled
 */
```

### Phase 4: Communication

#### 4.1 Summary for Team

Create a brief summary:

```
Title: [Feature] Completed

Highlights:
✓ [What was built]
✓ [Key capability]
✓ [Security/performance/usability improvement]

Metrics:
- 12 hours effort (estimated 10)
- 85% test coverage
- 0 post-release bugs

What's Next:
- Next feature planned for [when]
- Technical debt identified: [what]
- Enhancement ideas: [what]

Questions?
[Contact info if needed]
```

#### 4.2 Archive Decisions

If this is a significant feature:

Document in `.claude/memory-bank/archive/`:

```
Feature: [Name]
Completed: [Date]
Effort: [Hours]
Quality: [Metrics]

Key Decisions:
- [Decision 1]: Why [approach] over [alternative]
- [Decision 2]: Why [architecture] design

Patterns:
- [Pattern 1]: Use this for [similar features]
- [Pattern 2]: Use this when [conditions]

Warnings:
- Be careful of [issue we found]
- This was tricky: [explain]

Code Examples:
- Look at [file] for [pattern]
- Reference [service] for [implementation]
```

## Reflection Template

Save as `.claude/memory-bank/reflection/[feature].md`:

```markdown
# Reflection: [Feature Name]

**Date**: [Completion date]
**Duration**: [X hours]
**Complexity**: [Level 1-4]

## Accomplishments

[2-3 paragraph summary of what was built and achieved]

## Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Estimated Effort | X hrs | Y hrs |
| Test Coverage | >80% | X% |
| Build Success | 100% | X% |
| Release Bugs | 0 | X |

## What Went Well ✓

1. **[Success Area 1]**
   - What happened: [Description]
   - Why it worked: [Reason]
   - How to repeat: [Approach]

2. **[Success Area 2]**
   - What happened: [Description]
   - Why it worked: [Reason]
   - How to repeat: [Approach]

## What Could Be Better ⚠

1. **[Improvement Area 1]**
   - What happened: [Description]
   - Why it happened: [Root cause]
   - How to improve: [Solution]

2. **[Improvement Area 2]**
   - What happened: [Description]
   - Why it happened: [Root cause]
   - How to improve: [Solution]

## Lessons Learned 💡

### Lesson 1: [Title]
**What we learned**: [Concise statement of learning]
**Context**: When and why we learned it
**Apply next time**: How to use this knowledge

### Lesson 2: [Title]
**What we learned**: [Concise statement of learning]
**Context**: When and why we learned it
**Apply next time**: How to use this knowledge

## Technical Insights

### Architecture Decision
[Decision we made and why it worked well]

### Code Pattern
[Pattern we used that simplified implementation]

### Challenge & Solution
[Something unexpected and how we solved it]

## Recommendations for Next Time

If building a similar feature:
- [ ] [Do this] - It worked great
- [ ] [Avoid this] - It caused issues
- [ ] [Try this] - We should investigate
- [ ] [Plan for this] - It takes longer than expected

## Technical Debt & Opportunities

### Could Be Refactored
1. [Code/module]: Why and how
2. [Code/module]: Why and how

### Could Be Optimized
1. [Aspect]: Why and how
2. [Aspect]: Why and how

### Could Be Enhanced
1. [Feature]: Why and how
2. [Feature]: Why and how

## Files Modified

Summary of files touched:
- `src/services/[new].ts` - New service
- `src/cli/[feature].ts` - New CLI command
- Tests added: [X] new tests, [X]% coverage
- Docs updated: README, architecture, inline

## Related Issues & PRs

- Closes: #[issue number]
- Related to: #[issue], #[issue]
- PR: [Link to pull request]

## Post-Completion Notes

[Any notes from after the feature was released]
[User feedback]
[Issues discovered]
[Improvements made]

---

**Next**: [What feature/task comes next]
**Owner**: [Who maintains this code]
**Status**: ✓ Complete and merged
```

## Checklist

Before considering work truly COMPLETE:

- [ ] All code merged and deployed
- [ ] All tests passing
- [ ] All documentation updated
- [ ] Reflection written
- [ ] Lessons documented
- [ ] Team notified
- [ ] Tasks marked complete
- [ ] Next work identified

## Reflection Questions (Deep Dive)

Use these for more detailed reflection:

**On Planning**:
- Were the estimates accurate?
- Did we identify all edge cases?
- What assumptions were wrong?
- What surprised us?

**On Design**:
- Did the architecture work well?
- Would you design it differently?
- What patterns did you discover?
- What would you do differently?

**On Implementation**:
- Was the code easy to write?
- Did tests catch issues?
- How was the debugging experience?
- What was hardest?

**On Quality**:
- Is this something you're proud of?
- Would you show this to users?
- Is it maintainable?
- Is it secure?

**On Team**:
- Was communication clear?
- Did collaboration work?
- Were blockers resolved quickly?
- What could improve collaboration?

## After Reflection

### Next Steps
- Archive work in memory-bank/archive/
- Update master progress document
- Plan next feature
- Start new PLAN mode for next task

### Handoff (if needed)
- Write documentation for maintainer
- Create onboarding guide
- Schedule walkthrough if complex
- Answer questions

### Celebrate!
- Completed work deserves recognition
- Share accomplishments
- Thank team members
- Learn and grow

## Reflection is Not

❌ Blaming people
❌ Dwelling on mistakes
❌ Skipping the good parts
❌ Only listing problems
❌ Over-analyzing everything

## Reflection IS

✅ Honest assessment
✅ Celebrating wins
✅ Learning from experience
✅ Finding patterns
✅ Improving processes
✅ Sharing knowledge
✅ Growing as a team
