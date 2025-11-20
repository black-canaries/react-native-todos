---
name: git-feature-workflow
description: Streamline feature and fix development from branch creation to pull request. Use when implementing new features or bug fixes that need to go through the full development workflow - create branch, make changes, test, commit, push, and create PR. Follows conventional commits, ensures type safety and build verification before pushing.
---

<objective>
Guide developers through a complete, validated feature/fix development workflow from branch creation to pull request submission. Ensure code quality through automated checks (TypeScript, builds), follow git best practices with conventional commits, and streamline PR creation.
</objective>

<quick_start>
Invoke with: `"Create feature to add dark mode"` or `"Fix login crash on iOS"`

The workflow:
1. Create branch (`feature/add-dark-mode` or `fix/login-crash-ios`)
2. Implement changes
3. Run validation (TypeScript + build)
4. Create conventional commit
5. Push to GitHub
6. Create PR with gh CLI

Branch naming: `feature/description` or `fix/description` (kebab-case, auto-determined from request)
</quick_start>

<workflow>
**1. Create branch**
- Determine type (feature vs fix) from user request
- Generate kebab-case branch name: `git checkout -b feature/description` or `git checkout -b fix/description`
- Verify branch created successfully

**2. Implement changes**
- Make requested code changes
- Follow project patterns (check existing code)
- Update related files (types, tests, docs)
- Keep changes focused on specific feature/fix

**3. Validation (MUST complete before committing)**
Run in order:
1. TypeScript: `pnpm tsc --noEmit` (fix errors, re-run until clean)
2. Build: `pnpm expo prebuild --clean` or `pnpm build` (fix errors, re-run until successful)
3. Manual testing: Confirm user has tested changes before proceeding

**4. Commit**
- Stage changes: `git add .`
- Review: `git status && git diff --staged`
- Create commit using heredoc format:
```bash
git commit -m "$(cat <<'EOF'
type: brief description

Detailed explanation of changes.

- List key changes
- Explain decisions
EOF
)"
```

**Commit types:** `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`

NEVER add "Generated with Claude Code" footer (workflow commits only).

**5. Push**
Push with upstream tracking: `git push -u origin branch-name`

**6. Create PR**
Use gh CLI with auto-generated description from commits:
```bash
gh pr create --title "Add feature name" --body "$(cat <<'EOF'
## Summary
[Description from commits]

## Changes
[Key changes from commits]

## Testing
- [ ] TypeScript passed
- [ ] Build passed
- [ ] Manual testing completed
EOF
)"
```

PR titles: Use imperative mood ("Add", "Fix", not "Added", "Fixed")
</workflow>

<error_handling>
**Git conflicts:**
- If branch already exists, ask to checkout existing or create new name
- If push fails due to remote changes, pull and resolve conflicts
- If commit fails, show error and retry

**Build failures:**
- Parse error output and suggest likely fixes
- Apply fix if user confirms, then re-run validation

**PR creation failures:**
- Ensure gh CLI is authenticated: `gh auth status`
- Check if PR already exists for branch
- Verify remote branch exists
</error_handling>

<anti_patterns>
**NEVER skip validation:**
```bash
# Wrong - committing without checks
git add . && git commit -m "feat: add feature" && git push
```

**NEVER use vague commit messages:**
```bash
# Wrong
git commit -m "fix stuff"
git commit -m "update code"
```

**NEVER push before testing:**
```bash
# Wrong - no build verification
git add . && git commit && git push
```

**Correct approach:**
```bash
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

- Branch created with proper naming convention (`feature/` or `fix/`)
- TypeScript type checking passed (no errors)
- Build verification passed (app builds successfully)
- Manual testing confirmed by user
- Conventional commit created with clear message
- Changes pushed to GitHub successfully
- Pull request created with descriptive title and body
- PR URL provided to user

The workflow ensures code quality gates are met before creating PR.
</success_criteria>

<troubleshooting>
**Branch already exists:**
```bash
git checkout feature/description  # Checkout existing
# or
git checkout -b feature/description-2  # Create numbered variant
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
git pull origin main  # Pull latest changes first
# Resolve conflicts
git push -u origin branch-name  # Then push again
```
</troubleshooting>
