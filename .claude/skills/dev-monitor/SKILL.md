---
name: dev-monitor
description: Run React Native/Expo apps in background with continuous error monitoring and auto-fixing. Use when developing locally and need to run the app (iOS, Android, or Expo dev server) with automatic detection and fixing of common errors like missing dependencies, cache issues, port conflicts, or configuration problems. Monitors continuously until manually stopped.
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
<step_1_platform_selection>
**Determine which platform to run**

If user specified platform:
- "run iOS" ’ `pnpm run ios`
- "run Android" ’ `pnpm run android`
- "start Expo" or "run dev server" ’ `pnpm expo start`

If not specified, ask:
```
Which platform would you like to run?
1. iOS (pnpm run ios)
2. Android (pnpm run android)
3. Expo dev server (pnpm expo start)
```

Store the selected command for restarts after fixes.
</step_1_platform_selection>

<step_2_start_background>
**Start command in background**

1. Run the selected command in background:
   ```bash
   pnpm run ios  # or android, or expo start
   ```
   Use `run_in_background: true` parameter

2. Capture the shell ID for monitoring

3. Report to user:
   ```
   Started iOS app in background (shell_id: xyz)
   Monitoring output for errors...
   ```

4. Store shell ID for later use with BashOutput
</step_2_start_background>

<step_3_continuous_monitoring>
**Monitor output and detect errors**

1. Poll BashOutput every 5-10 seconds:
   ```
   BashOutput(bash_id: shell_id)
   ```

2. Analyze output for error patterns (see error_patterns below)

3. When error detected:
   - Identify error type
   - Apply appropriate fix
   - Report fix to user
   - Restart command if needed
   - Continue monitoring

4. When successful startup:
   - Report "App running successfully"
   - Continue monitoring for runtime errors

5. Loop until user says stop or sends termination signal
</step_3_continuous_monitoring>

<step_4_auto_fix_errors>
**Automatic error detection and fixing**

When errors detected, apply fixes automatically:

**Missing dependencies:**
- Pattern: `Cannot find module`, `Module not found`, `ENOENT`
- Fix: `pnpm install`
- Report: "Fixed missing dependencies, restarting..."

**Cache issues:**
- Pattern: `Metro cache`, `Unable to resolve module`, `Cached`
- Fix: `pnpm expo start -c` (clear cache)
- Report: "Cleared Metro cache, restarting..."

**Port conflicts:**
- Pattern: `EADDRINUSE`, `Port 8081 already in use`
- Fix: `lsof -ti:8081 | xargs kill -9` then retry
- Report: "Killed conflicting process on port 8081, restarting..."

**Build/prebuild needed:**
- Pattern: `native module`, `CocoaPods`, `Gradle`
- Fix: `pnpm expo prebuild --clean`
- Report: "Running prebuild, this may take a moment..."

**TypeScript errors:**
- Pattern: `Type error`, `TS[0-9]+:`
- Fix: Show errors, ask user to fix code
- Report: "TypeScript errors detected. Please fix the errors shown above."
- Don't restart automatically (requires code changes)

After each fix:
- Kill previous background process if still running
- Restart the command in background
- Resume monitoring
</step_4_auto_fix_errors>

<step_5_reporting>
**Report fixes and status**

When error fixed:
```
=' Fixed: [error type]
   Action: [what was done]
   Restarting: [command]
   Status: Monitoring...
```

When app running successfully:
```
 App running successfully
   Monitoring for errors... (Ctrl+C or say "stop" to end)
```

When runtime error occurs:
```
   Runtime error detected:
   [error message]
   Attempting fix...
```

Keep user informed but don't spam with too many messages.
</step_5_reporting>
</workflow>

<error_patterns>
<dependency_errors>
**Pattern matching:**
```regex
Cannot find module ['"](.+)['"]
Module not found: Error: Can't resolve ['"](.+)['"]
ENOENT: no such file or directory
```

**Fix:**
```bash
pnpm install
```

**Restart:** Yes
</dependency_errors>

<cache_errors>
**Pattern matching:**
```regex
Metro.*cache
Unable to resolve module.*metro
Cached.*unable to resolve
Transform cache
```

**Fix:**
```bash
# Kill existing metro
pkill -f "expo|metro"

# Clear cache and restart
pnpm expo start -c
```

**Restart:** Command already includes restart with -c flag
</cache_errors>

<port_conflicts>
**Pattern matching:**
```regex
EADDRINUSE.*:(\d+)
Port (\d+) is already in use
address already in use.*:(\d+)
```

**Fix:**
```bash
# Extract port number from error
# Kill process on that port
lsof -ti:8081 | xargs kill -9

# Retry command
```

**Restart:** Yes
</port_conflicts>

<native_build_errors>
**Pattern matching:**
```regex
CocoaPods could not find
Gradle build failed
native module.*not found
expo-modules.*not configured
```

**Fix:**
```bash
pnpm expo prebuild --clean
```

**Restart:** Yes, after prebuild completes
</native_build_errors>

<typescript_errors>
**Pattern matching:**
```regex
Type error: .+
TS\d+: .+
TypeScript error in .+
```

**Fix:** Don't auto-fix, requires code changes

**Action:**
1. Show errors to user
2. Ask user to fix code
3. Continue monitoring (may auto-recover when files saved)
4. Don't restart automatically

**Restart:** No
</typescript_errors>

<configuration_errors>
**Pattern matching:**
```regex
babel\.config\.js
metro\.config\.js
app\.json.*invalid
Config file.*error
```

**Fix:**
- Check config files exist
- Verify syntax is correct
- Show specific error to user
- May require manual fix

**Restart:** After user confirms fix
</configuration_errors>
</error_patterns>

<monitoring_loop>
**Continuous monitoring implementation:**

```pseudocode
while (!user_stopped) {
  // Poll output every 5 seconds
  output = BashOutput(shell_id)

  if (output.contains_error) {
    error_type = detect_error_type(output)

    if (auto_fixable(error_type)) {
      apply_fix(error_type)
      kill_process(shell_id)
      shell_id = restart_command()
      report_fix(error_type)
    } else {
      report_error_needs_manual_fix(output)
      wait_for_user_action()
    }
  } else if (output.contains_success_indicator) {
    if (!already_reported_success) {
      report_success()
      already_reported_success = true
    }
  }

  wait(5_seconds)
}
```

**Success indicators:**
- "Bundling complete"
- "Waiting on"
- "Metro waiting"
- "Successfully compiled"

**Stop conditions:**
- User says "stop monitoring" or "stop"
- User presses Ctrl+C (detected via shell termination)
- Unrecoverable error after multiple fix attempts
</monitoring_loop>

<anti_patterns>
L **Don't restart on every output line:**
```
# Wrong - too eager
if (output) { restart(); }
```

L **Don't ignore errors:**
```
# Wrong - silent failures
if (error) { continue; }
```

L **Don't run in foreground:**
```
# Wrong - blocks conversation
pnpm run ios  # without run_in_background
```

 **Correct approach:**
```
# Right - background with monitoring
1. Start: pnpm run ios (background)
2. Poll: BashOutput every 5-10 seconds
3. Detect: Match error patterns
4. Fix: Auto-fix when possible
5. Report: What was done
6. Resume: Continue monitoring
```
</anti_patterns>

<success_criteria>
Successful monitoring session includes:

-  App started in background (command running)
-  Output being monitored continuously
-  Errors detected automatically
-  Common errors fixed without user intervention
-  Fixes reported clearly to user
-  App restarts automatically after fixes
-  Monitoring continues until user stops
-  User can continue chatting while monitoring runs

The skill provides hands-free development environment.
</success_criteria>

<common_commands>
<ios_monitoring>
```bash
# Start iOS in background
pnpm run ios

# Common fixes for iOS:
- pnpm install (missing deps)
- pnpm expo prebuild --clean (native modules)
- pkill -f "expo|metro" && pnpm expo start -c (cache)
- pod install (iOS specific, in ios/ directory)
```
</ios_monitoring>

<android_monitoring>
```bash
# Start Android in background
pnpm run android

# Common fixes for Android:
- pnpm install (missing deps)
- pnpm expo prebuild --clean (native modules)
- pkill -f "expo|metro" && pnpm expo start -c (cache)
- ./gradlew clean (Android specific, in android/ directory)
```
</android_monitoring>

<expo_monitoring>
```bash
# Start Expo dev server in background
pnpm expo start

# Common fixes for Expo:
- pnpm install (missing deps)
- pnpm expo start -c (cache)
- lsof -ti:8081 | xargs kill -9 (port conflict)
```
</expo_monitoring>
</common_commands>

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
# Find and kill manually
ps aux | grep "expo\|metro"
kill -9 <pid>
```

**User wants to stop monitoring:**
- Use KillShell to terminate background process
- Report final status
- Clean up any temporary files/processes
</troubleshooting>
