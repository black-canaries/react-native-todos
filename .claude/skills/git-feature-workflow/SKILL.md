---
name: git-feature-workflow
description: Streamline feature and fix development from branch creation to pull request. Use when implementing new features or bug fixes that need to go through the full development workflow - create branch, make changes, test, commit, push, and create PR. Follows conventional commits, ensures type safety and build verification before pushing.
---

<objective>
Guide developers through a complete, validated feature/fix development workflow from branch creation to pull request submission. Ensure code quality through automated checks (TypeScript, builds), follow git best practices with conventional commits, and streamline PR creation.
</objective>

<quick_start>
<basic_workflow>
Invoke this skill when starting a new feature or fix:

```
"Create a new feature to add dark mode toggle to settings"
"Fix the login crash on iOS"
```

The skill will:
1. Create a properly named branch (`feature/add-dark-mode-toggle` or `fix/login-crash-ios`)
2. Guide you through implementation
3. Run validation checks (TypeScript, build)
4. Create conventional commit
5. Push to GitHub
6. Create pull request with gh CLI
</basic_workflow>

<branch_naming>
**Convention:** `feature/description` or `fix/description`

Examples:
- `feature/add-dark-mode`
- `feature/user-profile-screen`
- `fix/login-crash`
- `fix/memory-leak-tasks-list`

The skill automatically determines the prefix based on your request and creates a descriptive kebab-case name.
</branch_naming>
</quick_start>

<workflow>
<step_1_create_branch>
**Create feature or fix branch**

1. Analyze the user's request to determine type (feature vs fix)
2. Generate descriptive branch name in kebab-case
3. Check current git status
4. Create and checkout new branch:
   ```bash
   git checkout -b feature/description
   # or
   git checkout -b fix/description
   ```
5. Confirm branch created successfully
</step_1_create_branch>

<step_2_implement_changes>
**Implement the feature or fix**

1. Make the code changes requested by the user
2. Follow project patterns and conventions (check existing code)
3. Update related files (types, tests, documentation if needed)
4. Ensure changes are focused on the specific feature/fix
</step_2_implement_changes>

<step_3_validation>
**Run validation checks**

Execute these checks in order:

1. **TypeScript type checking:**
   ```bash
   pnpm tsc --noEmit
   ```
   - Fix any type errors before proceeding
   - Re-run until clean

2. **Build verification:**
   ```bash
   pnpm expo prebuild --clean
   ```
   Or if project has custom build command:
   ```bash
   pnpm build
   ```
   - Ensure app builds successfully
   - Fix build errors before proceeding

3. **Manual testing prompt:**
   - Ask user to test the changes manually
   - Confirm: "Have you tested the changes? (yes/no)"
   - If no, wait for testing before proceeding

**Critical:** All checks must pass before committing.
</step_3_validation>

<step_4_commit>
**Create conventional commit**

1. Stage all changes:
   ```bash
   git add .
   ```

2. Review what's being committed:
   ```bash
   git status
   git diff --staged
   ```

3. Create commit with conventional format:
   ```bash
   git commit -m "$(cat <<'EOF'
   type: brief description

   Detailed explanation of changes and why they were made.

   - List key changes
   - Explain implementation decisions
   - Note any breaking changes or important details
   EOF
   )"
   ```

**Conventional commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance, deps, config
- `refactor:` - Code restructuring without behavior change
- `docs:` - Documentation only
- `test:` - Test additions or fixes
- `style:` - Code style/formatting (not UI styling)
- `perf:` - Performance improvements

**Example commits:**
```
feat: add dark mode toggle to settings

Implemented system-level dark mode support with toggle in settings screen.

- Added dark mode context provider
- Created toggle component in settings
- Updated theme to support dark colors
```

```
fix: resolve login crash on iOS devices

Fixed null pointer exception when accessing user profile before auth completes.

- Added null check in profile screen
- Initialize user state properly
- Added loading state during auth
```

**Important:** Do NOT add "Generated with Claude Code" footer to commits in this workflow (only in direct commit slash commands).
</step_4_commit>

<step_5_push>
**Push to GitHub**

1. Push branch to remote with upstream tracking:
   ```bash
   git push -u origin branch-name
   ```

2. Verify push succeeded
3. Note the remote branch URL for PR creation
</step_5_push>

<step_6_create_pr>
**Create pull request**

Use GitHub CLI to create PR:

```bash
gh pr create --title "Brief PR title" --body "$(cat <<'EOF'
## Summary
Brief description of what this PR does

## Changes
- List key changes made
- Implementation details
- Any important notes

## Testing
- [ ] TypeScript type checking passed
- [ ] Build verification passed
- [ ] Manual testing completed
- [ ] Changes tested on [platform(s)]

## Screenshots
[Add if UI changes]
EOF
)"
```

**PR title format:**
- Features: "Add dark mode toggle to settings"
- Fixes: "Fix login crash on iOS"
- Use imperative mood (Add, Fix, Update, not Added, Fixed, Updated)

**Auto-generate from commits:**
- Parse commit messages to build PR description
- Include all commits since branching from main
- Summarize changes and testing done

After PR created:
- Display PR URL
- Confirm next steps (wait for review, merge, etc.)
</step_6_create_pr>
</workflow>

<validation_checks>
<typescript_validation>
Run TypeScript compiler in no-emit mode:

```bash
pnpm tsc --noEmit
```

**Common fixes:**
- Missing type annotations
- Incorrect prop types
- Null/undefined handling
- Import errors

If errors found:
1. Show errors to user
2. Fix errors in code
3. Re-run type check
4. Repeat until clean
</typescript_validation>

<build_validation>
Ensure project builds successfully:

```bash
# For Expo projects
pnpm expo prebuild --clean

# Or custom build command
pnpm build
```

**Common issues:**
- Missing dependencies ’ `pnpm install`
- Babel/Metro config errors
- Native module issues
- Environment variables missing

If build fails:
1. Show error output
2. Diagnose issue
3. Apply fix
4. Re-run build
5. Repeat until successful
</build_validation>

<manual_testing>
Before committing, confirm user has tested:

"Have you tested the following:
- [ ] Feature/fix works as expected
- [ ] No regressions in existing functionality
- [ ] Tested on relevant platform(s) (iOS/Android/Web)
- [ ] Edge cases handled

Please confirm testing is complete (yes/no):"

Wait for user confirmation before proceeding to commit.
</manual_testing>
</validation_checks>

<error_handling>
**Git conflicts:**
- If branch already exists, ask to checkout existing or create new name
- If push fails due to remote changes, pull and resolve conflicts
- If commit fails, show error and retry

**Build failures:**
- Parse error output
- Suggest likely fixes
- Apply fix if user confirms
- Re-run validation

**PR creation failures:**
- Ensure gh CLI is authenticated (`gh auth status`)
- Check if PR already exists for branch
- Verify remote branch exists
</error_handling>

<anti_patterns>
L **Don't skip validation:**
```
# Wrong - committing without checks
git add . && git commit -m "feat: add feature" && git push
```

L **Don't use vague commit messages:**
```
# Wrong
git commit -m "fix stuff"
git commit -m "update code"
```

L **Don't push before testing:**
```
# Wrong - no build verification
git add . && git commit && git push
```

 **Correct approach:**
```
# Right - full workflow with validation
1. git checkout -b feature/new-feature
2. [make changes]
3. pnpm tsc --noEmit  # TypeScript check
4. pnpm expo prebuild --clean  # Build check
5. [manual testing]
6. git add .
7. git commit -m "feat: add new feature with details"
8. git push -u origin feature/new-feature
9. gh pr create [...]
```
</anti_patterns>

<success_criteria>
A successful workflow completion includes:

-  Branch created with proper naming convention (`feature/` or `fix/`)
-  TypeScript type checking passed (no errors)
-  Build verification passed (app builds successfully)
-  Manual testing confirmed by user
-  Conventional commit created with clear message
-  Changes pushed to GitHub successfully
-  Pull request created with descriptive title and body
-  PR URL provided to user

The workflow ensures code quality gates are met before creating PR.
</success_criteria>

<troubleshooting>
**Branch already exists:**
```bash
# Checkout existing or create numbered variant
git checkout feature/description
# or
git checkout -b feature/description-2
```

**TypeScript errors persist:**
- Check tsconfig.json is correct
- Verify all imports are valid
- Run `pnpm install` if types are missing
- Check for conflicting type definitions

**Build failures:**
- Clear Metro cache: `pnpm expo start -c`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check babel.config.js and metro.config.js
- Verify environment variables are set

**gh CLI not authenticated:**
```bash
gh auth login
```

**Push rejected:**
```bash
# Pull latest changes first
git pull origin main
# Resolve conflicts
# Then push again
git push -u origin branch-name
```
</troubleshooting>
