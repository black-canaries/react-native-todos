# Installation Instructions for Your React Native Project

## Quick Install (Recommended)

Run these commands in your project root:

```bash
# Create the skills directory in your project
mkdir -p .claude/skills

# Copy the skill
cp -r react-native-expo-skill .claude/skills/

# Commit to git so your team has access
git add .claude/skills
git commit -m "Add React Native Expo Agent Skill"
git push
```

## What This Does

After installation, your project structure will look like:

```
your-react-native-project/
├── .claude/                                    # ← New directory
│   └── skills/                                # ← Skills directory
│       └── react-native-expo-skill/          # ← Your new skill
│           ├── SKILL.md                      # Main documentation
│           ├── README.md                     # Usage guide
│           ├── QUICK_REFERENCE.md           # Cheat sheet
│           ├── references/                   # API references
│           ├── scripts/                      # Helper scripts
│           └── assets/                       # Templates
├── app/                                      # Your app code
├── components/
├── convex/
└── package.json
```

## Verification

After installation, test that it works:

1. Open your project in Claude Code
2. Ask Claude: "Help me create an animated button with NativeWind"
3. Claude should automatically use the skill and reference proper patterns

You'll see in Claude's thinking process that it's loading the skill!

## Team Access

Once committed to git, anyone who clones or pulls your repository will automatically have access to the skill. No additional setup needed!

## Alternative: Personal Installation

If you want this skill available in ALL your projects (not just this one):

```bash
# Install to your personal skills directory
mkdir -p ~/.claude/skills
cp -r react-native-expo-skill ~/.claude/skills/
```

This makes the skill available globally across all your Claude Code projects.

## Using the Setup Script

The skill includes a script to quickly set up new Expo projects:

```bash
# Make it executable
chmod +x .claude/skills/react-native-expo-skill/scripts/setup-expo-project.sh

# Use it to create a new project
.claude/skills/react-native-expo-skill/scripts/setup-expo-project.sh my-new-app
```

This will create a fully configured Expo project with:
- NativeWind installed and configured
- Reanimated installed and configured
- Convex installed
- All config files (Babel, Metro, Tailwind) properly set up
- Environment file templates

## Customization

Feel free to modify the skill files to match your team's needs:

1. **Add your patterns** to `SKILL.md`
2. **Add custom components** to `assets/`
3. **Add your API docs** to `references/`
4. **Add team scripts** to `scripts/`

Then commit your changes so the whole team benefits!

## Support

If Claude isn't using the skill:
1. Restart Claude Code
2. Verify the files are in `.claude/skills/react-native-expo-skill/`
3. Check that `SKILL.md` exists and has the correct frontmatter
4. Try being more explicit: "Use the React Native Expo skill to help me..."

## What Claude Will Know

After installation, Claude will automatically have deep knowledge of:

✅ NativeWind styling patterns  
✅ Reanimated animation techniques  
✅ Convex backend integration  
✅ Convex authentication setup  
✅ Proper Babel/Metro configuration  
✅ pnpm workflow for Expo  
✅ Common patterns and troubleshooting  
✅ Performance best practices  

All triggered automatically when you ask relevant questions!

---

**Ready to install?** Just run the Quick Install commands above! 🚀
