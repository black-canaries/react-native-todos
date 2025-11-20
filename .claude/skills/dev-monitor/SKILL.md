---
name: dev-monitor
description: Runs React Native/Expo development servers (iOS/Android/Expo) in background with continuous error monitoring and automatic fixes for missing dependencies, cache issues, port conflicts, and configuration problems. Use when developing locally to maintain hands-free development until manually stopped.
---

<objective>
Provide hands-free local development by running React Native/Expo apps in background, continuously monitoring output, automatically detecting and fixing common errors, and keeping the development server running smoothly without manual intervention.
</objective>

<quick_start>
<basic_usage>
Start monitoring with simple commands:

```
"Run the iOS app and fix any errors"
"Start Android with error monitoring"
"Run Expo dev server and monitor for issues"
```

The skill will:
1. Ask which platform if not specified (iOS / Android / Expo)
2. Start the command in background
3. Monitor output continuously
4. Auto-fix common errors (deps, cache, config, ports)
5. Report what was fixed
6. Keep running until you say stop
</basic_usage>

<platform_options>
**Supported commands:**
- `pnpm run ios` - iOS simulator
- `pnpm run android` - Android emulator
- `pnpm expo start` - Expo development server

The skill handles all three and auto-detects the correct command based on your request.
</platform_options>
</quick_start>

<workflow>
**1. Platform selection**
- Determine from user request or ask: iOS (`pnpm run ios`), Android (`pnpm run android`), or Expo (`pnpm expo start`)
- Store selected command for restarts

**2. Start in background**
- Run command with `run_in_background: true`
- Capture shell ID for monitoring
- Report: "Started [platform] in background, monitoring..."

**3. Continuous monitoring**
- Poll BashOutput every 5-10 seconds
- Analyze for error patterns (see error_patterns section)
- On error: identify type, apply fix, restart, report
- On success: report once, continue monitoring
- Loop until user stops

**4. Auto-fix errors**
Apply fixes automatically when detected:

- **Missing deps**: `pnpm install` → restart
- **Cache issues**: Kill metro, `pnpm expo start -c` → already restarted
- **Port conflicts**: `lsof -ti:8081 | xargs kill -9` → restart
- **Native build**: `pnpm expo prebuild --clean` → restart after complete
- **TypeScript**: Show errors, ask user to fix (no auto-restart)

After fix: Kill previous process, restart command, resume monitoring

**5. Reporting**
Keep user informed:
- "Fixed: [error type], restarting..."
- "App running successfully, monitoring..."
- "Runtime error detected: [message], attempting fix..."
</workflow>

<error_patterns>
<dependency_errors>
**Regex patterns:**
```regex
Cannot find module ['"](.+)['"]
Module not found: Error: Can't resolve ['"](.+)['"]
ENOENT: no such file or directory
```

**Fix:** `pnpm install`
**Restart:** Yes
</dependency_errors>

<cache_errors>
**Regex patterns:**
```regex
Metro.*cache
Unable to resolve module.*metro
Cached.*unable to resolve
Transform cache
```

**Fix:**
```bash
pkill -f "expo|metro"
pnpm expo start -c
```

**Restart:** Command includes restart with -c flag
</cache_errors>

<port_conflicts>
**Regex patterns:**
```regex
EADDRINUSE.*:(\d+)
Port (\d+) is already in use
address already in use.*:(\d+)
```

**Fix:** `lsof -ti:8081 | xargs kill -9` (extract port from error)
**Restart:** Yes
</port_conflicts>

<native_build_errors>
**Regex patterns:**
```regex
CocoaPods could not find
Gradle build failed
native module.*not found
expo-modules.*not configured
```

**Fix:** `pnpm expo prebuild --clean`
**Restart:** Yes, after prebuild completes
</native_build_errors>

<typescript_errors>
**Regex patterns:**
```regex
Type error: .+
TS\d+: .+
TypeScript error in .+
```

**Fix:** Don't auto-fix (requires code changes)
**Action:** Show errors, ask user to fix, continue monitoring
**Restart:** No
</typescript_errors>

<configuration_errors>
**Regex patterns:**
```regex
babel\.config\.js
metro\.config\.js
app\.json.*invalid
Config file.*error
```

**Fix:** Check config files, show error, may require manual fix
**Restart:** After user confirms fix
</configuration_errors>
</error_patterns>

<anti_patterns>
**NEVER restart on every output line:**
```bash
# Wrong - too eager, causes restart loops
if (output) { restart(); }
```

**NEVER ignore errors:**
```bash
# Wrong - silent failures prevent fixes
if (error) { continue; }
```

**NEVER run in foreground:**
```bash
# Wrong - blocks conversation
pnpm run ios  # without run_in_background
```

**Correct approach:**
1. Start command in background: `pnpm run ios` (with `run_in_background: true`)
2. Poll output: BashOutput every 5-10 seconds
3. Detect errors: Match against error patterns
4. Auto-fix: Apply fixes when possible
5. Report: Inform user what was done
6. Resume: Continue monitoring loop
</anti_patterns>

<success_criteria>
Successful monitoring session includes:

- App started in background (command running)
- Output being monitored continuously
- Errors detected automatically
- Common errors fixed without user intervention
- Fixes reported clearly to user
- App restarts automatically after fixes
- Monitoring continues until user stops
- User can continue chatting while monitoring runs

The skill provides hands-free development environment.
</success_criteria>

<troubleshooting>
**Monitoring stopped unexpectedly:**
- Check if shell process exited
- Look for unrecoverable errors in output
- Restart monitoring with fresh command

**Fixes not working:**
- Check fix commands completed successfully
- Verify error pattern matching is correct
- Some errors may require manual intervention

**Too many restarts:**
- May indicate deeper issue
- After 3 failed attempts, stop and report to user
- Ask user to investigate root cause

**Can't kill background process:**
```bash
ps aux | grep "expo\|metro"
kill -9 <pid>
```

**User wants to stop monitoring:**
- Use KillShell to terminate background process
- Report final status
- Clean up any temporary files/processes
</troubleshooting>
