# 📋 SkillMachine - Task Protocol

**Last Updated:** January 6, 2026
**Repository:** https://github.com/MadisonSNYC/Skillmachine.git
**Platform:** Web (React/TypeScript) → iOS App Store (future Capacitor wrap or Swift rebuild)

---

## 🎯 Project Overview

SkillMachine is an integrated app with two core features:

### Feature 1: Follow Me Helper
A Simon Says-style sequence memory assistant for skill game machines:
- 3x3 color grid (9 colors): Hot Pink, Blue, Red / Yellow, Green, Teal / Grey, Pink, Burgundy
- User taps color they see → App adds to sequence → Reads back FULL sequence via TTS
- Tracks round count, links to active session/machine
- Records outcomes for correlation analysis

### Feature 2: Slot Tracker
Session and lifetime gambling statistics tracker:
- Machine management (manufacturer, model, Follow Me variant)
- Start/end sessions with bankroll
- Log wins, losses, expenses, buy-ins
- Calculate running balance, ROI, streaks
- Track Follow Me attempts and correlate with outcomes

---

## 📋 Workflow Rules

### ⚠️ CRITICAL: BRANCH FIRST - NO EXCEPTIONS
**STOP! Before ANY work:** Run `git branch --show-current`
- If output is "main" or "master" → CREATE FEATURE BRANCH IMMEDIATELY
- ALL work requires a feature branch

### Branch Naming
- Features → `feat/<slug>`
- Fixes → `fix/<slug>`
- Tests → `test/<slug>`
- Chores → `chore/<slug>`

---

## ⏱️ Phase-Level Gates

Every phase requires:

### 1. Implementation
- Follow coding best practices
- Preserve all working features
- If unexpected issues arise → STOP and report

### 2. Verification Gate
After completing each phase, you MUST:
1. State what was completed
2. Ask: **"Madison, please verify this phase is correct. Yes/No"**
3. Ask: **"Also, please confirm the date and time for this phase entry."**
4. WAIT for response before proceeding

### 3. If YES + Date/Time Received → Push & Log
- Verify branch: `git branch --show-current` (must NOT be "main")
- Push to feature branch
- Record in TASKS.md:
  - Verification: YES
  - Commit SHA (short)
  - Date/Time Confirmed

### 4. If NO or Missing Date/Time → Stop
- Do not push
- Must receive BOTH verification AND date/time
- Log blockers/questions
- Await guidance

---

## 📁 File Structure
```
src/
├── components/
│   ├── common/           # Shared UI (Button, Card, Modal)
│   ├── tracker/          # Slot tracker components
│   ├── follow-me/        # Follow Me helper components
│   ├── machines/         # Machine management components
│   └── layout/           # Navigation, Header, TabBar
├── hooks/                # Custom React hooks
├── types/                # TypeScript interfaces
├── utils/                # Utility functions
├── constants/            # App constants, colors
└── context/              # React context providers
```

---

## ✅ Definition of Done (Per Phase)

- [ ] Code complete and compiling
- [ ] Feature works as specified
- [ ] No console errors
- [ ] Mobile-responsive UI verified
- [ ] Madison Verified: YES
- [ ] Date/Time confirmed
- [ ] Pushed to feature branch
- [ ] TASKS.md updated with commit SHA

---

**Remember:**
1. **Always check branch first**
2. **Verify branch before pushing**
3. **Stop and report if something breaks**
4. **Madison verification required before ANY push**
5. **Date/Time must be confirmed for logging**

---

*Protocol Version: 1.0*
*Project: SkillMachine*
