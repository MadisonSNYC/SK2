# Phase Zero - Project Foundation Plan

**Phase:** 0
**Branch:** feat/phase-0-protocol-and-plans
**Goal:** Establish project foundation with all scaffolding, types, and protocol files

---

## Objectives

Phase Zero sets up the complete foundation for SkillMachine development:

1. ✅ Initialize Vite + React + TypeScript project
2. ✅ Install and configure Tailwind CSS for mobile-first dark theme
3. ✅ Create folder structure following component organization
4. ✅ Define all TypeScript interfaces and types
5. ✅ Create color constants for Follow Me grid
6. ✅ Create app configuration constants
7. ✅ Create localStorage utility functions
8. ✅ Build basic App shell with tab navigation
9. ✅ Verify development server runs without errors

---

## Deliverables

### 1. Project Structure
```
SK2/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── tracker/
│   │   ├── follow-me/
│   │   ├── machines/
│   │   └── layout/
│   ├── hooks/
│   ├── types/
│   │   └── index.ts          (all TypeScript interfaces)
│   ├── utils/
│   │   └── storage.ts        (localStorage helpers)
│   ├── constants/
│   │   ├── colors.ts         (Follow Me color grid)
│   │   └── config.ts         (app settings)
│   ├── context/
│   ├── App.tsx               (tab navigation shell)
│   ├── main.tsx
│   └── index.css             (Tailwind setup)
├── task-md/
│   ├── TASK-PROTOCOL.md
│   ├── TASKS.md
│   └── phase-zero-plan.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

### 2. TypeScript Types
All data models defined in `src/types/index.ts`:
- `Machine` - Skill game machine profiles
- `Session` - Play sessions with bankroll tracking
- `Transaction` - Individual money movements
- `FollowMeAttempt` - Follow Me game records
- `LifetimeStats` - Aggregated statistics
- `MachineStats` - Per-machine statistics
- `FollowMeState` - Current Follow Me helper state
- `AppSettings` - User preferences
- `ColorKey` & `ColorDefinition` - Follow Me colors

### 3. Constants
- **colors.ts**: 3x3 Follow Me grid with 9 colors (Hot Pink, Blue, Red, Yellow, Green, Teal, Grey, Pink, Burgundy)
- **config.ts**: Default settings, Follow Me configurations, manufacturer defaults

### 4. Utilities
- **storage.ts**: Generic localStorage functions with JSON serialization, UUID generation

### 5. App Shell
Basic `App.tsx` with:
- Dark theme header
- Three-tab bottom navigation (Tracker, Follow Me, Settings)
- Placeholder screens for each tab
- Mobile-first responsive design

---

## Success Criteria

- [ ] Project builds without TypeScript errors
- [ ] `npm run dev` starts development server
- [ ] App loads at http://localhost:5173
- [ ] Dark theme applied correctly
- [ ] Tab navigation works
- [ ] No console errors
- [ ] All protocol files in place
- [ ] Git branch is NOT main

---

## Next Phase Preview

**Phase 1 - Machine Management**
- Machine profile creation form
- Machine list/grid view
- Machine detail view with stats
- Edit/delete machine functionality

---

*Created: January 6, 2026*
*Status: In Progress*
