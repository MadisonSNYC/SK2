# 🔧 SK2 Codebase Refactoring Plan

**Status:** 🔒 **POST-AUDIT ENFORCEMENT MODE ACTIVE**
**Document Version:** 1.2
**Last Updated:** January 8, 2026 7:55 AM EST
**Audit Date:** January 7, 2026

---

## 📋 Executive Summary

### Audit Findings Overview

**Total Files Analyzed:** 44 TypeScript files
**Files Over 200 Lines:** 6 files (14% of codebase)
**Code Health Score:** 7/10

| Priority | Task Count | Estimated Effort |
|----------|------------|------------------|
| **P0 (Critical)** | 3 tasks | ~8 hours |
| **P1 (High)** | 4 tasks | ~5.5 hours |
| **P2 (Medium)** | 4 tasks | ~2 hours |
| **TOTAL** | **11 tasks** | **~15.5 hours** |

### Critical Issues Identified

1. **FollowMeHelper.tsx** (337 lines) - Monolithic component with mixed concerns
2. **StartSessionPage.tsx** (294 lines) - Form logic embedded in page component
3. **types/index.ts** (272 lines) - Monolithic type file covering all domains
4. **MachineForm.tsx** (227 lines) - Complex form with embedded validation
5. **ActiveSessionDashboard.tsx** (212 lines) - Multiple UI concerns in one component
6. **useSession.ts** (207 lines) - Hook with feature creep (session + transactions)

### Current Phase Status

- **Phase 0-4:** ✅ Complete (Foundation, Machine Mgmt, Follow Me, Sessions, Transactions)
- **Refactoring Phase:** ⬜ **NOT STARTED** (this plan)
- **Phase 5+:** ⏸️ **BLOCKED** until P0 refactoring complete

### Success Criteria

✅ **Phase R1-R5 Complete When:**
- All files under 200 lines (except justified data files)
- Zero TypeScript compilation errors
- All features working identically to pre-refactoring state
- No visual regressions
- Clean separation of concerns
- Comprehensive test coverage verified

---

## 🔒 Pre-Refactoring Checklist

**MANDATORY:** Complete ALL items before beginning ANY refactoring task.

### Environment Verification
- [ ] Node.js version: v20+ installed
- [ ] npm dependencies: `npm install` runs without errors
- [ ] TypeScript version: 5.0+ confirmed

### Baseline Verification
- [ ] `npm run build` passes without errors
- [ ] `npx tsc --noEmit` passes without errors
- [ ] Dev server starts: `npm run dev` runs successfully
- [ ] App loads at http://localhost:5173 without errors
- [ ] No console errors in browser devtools

### Functionality Snapshot
- [ ] Follow Me: Can complete full 20-round sequence
- [ ] Sessions: Can start, log transactions, and end session
- [ ] Transactions: +Win and -Loss buttons work correctly
- [ ] Navigation: All tabs (Home, Follow Me, Stats, Settings) navigate correctly
- [ ] Persistence: Data survives page refresh

### Git Strategy
- [ ] Current branch: Verify on `feat/phase-four-transactions`
- [ ] Working directory: Clean (no uncommitted changes)
- [ ] Remote: Synced with origin
- [ ] Backup branch created: `git branch backup-pre-refactoring`

### Documentation
- [ ] Current file sizes documented (see audit report)
- [ ] Screenshots of all major UI states captured
- [ ] Test cases written for each feature area

### Rollback Plan
- [ ] Rollback procedure documented below
- [ ] Team notified of refactoring start
- [ ] Estimated completion timeline communicated

**Rollback Procedure:**
```bash
# If anything goes wrong during refactoring:
git checkout backup-pre-refactoring
npm install
npm run dev
# Verify app works, then reassess
```

---

## 📊 Phase Breakdown

### Phase R1: Type System Reorganization (P0)
**Goal:** Split monolithic types file into domain-specific files
**Duration:** ~2 hours
**Risk:** Low (backwards compatible)
**Dependencies:** None

**Tasks:**
- R1.1: Split types/index.ts into domain files

**Success Criteria:**
- TypeScript compilation passes
- All imports resolve correctly
- Zero breaking changes (backward compatible re-exports)

---

### Phase R2: Component Decomposition (P0)
**Goal:** Break down oversized components into manageable pieces
**Duration:** ~6 hours
**Risk:** Medium (UI regression potential)
**Dependencies:** Phase R1 complete

**Tasks:**
- R2.1: Refactor FollowMeHelper.tsx (337 → ~80 lines)
- R2.2: Refactor StartSessionPage.tsx (294 → ~50 lines)

**Success Criteria:**
- All components under 150 lines
- Feature functionality identical
- No visual regressions
- Improved testability

---

### Phase R3: Hook Optimization (P1)
**Goal:** Extract hook logic for better separation of concerns
**Duration:** ~2 hours
**Risk:** Low
**Dependencies:** Phase R2 complete

**Tasks:**
- R3.1: Split useSession.ts into useSession + useTransactions
- R3.2: Create useFollowMeOrchestrator.ts
- R3.3: Create useMachineDefaults.ts

**Success Criteria:**
- Each hook focused on single concern
- Hooks under 150 lines
- All session/transaction features work
- Follow Me orchestration cleaner

---

### Phase R4: Dashboard Cleanup (P1)
**Goal:** Extract reusable UI components
**Duration:** ~2.5 hours
**Risk:** Low
**Dependencies:** Phase R3 complete

**Tasks:**
- R4.1: Refactor ActiveSessionDashboard.tsx
- R4.2: Simplify MachineForm.tsx

**Success Criteria:**
- Dashboard components reusable
- Active session UI works correctly
- Machine form validation extracted

---

### Phase R5: Utilities & Cleanup (P2)
**Goal:** DRY principle, remove duplication, cleanup deprecated code
**Duration:** ~2 hours
**Risk:** Low
**Dependencies:** Phase R4 complete

**Tasks:**
- R5.1: Create formatting utilities
- R5.2: Create validation utilities
- R5.3: Archive deprecated machine components
- R5.4: Consolidate constants

**Success Criteria:**
- Zero code duplication in formatting
- Validation logic centralized
- Deprecated code archived
- Constants consolidated

---

## 📝 Detailed Task Specifications

---

## Task R1.1: Split types/index.ts into Domain Files

### Metadata
- **Priority:** P0 (Critical - Blocking Phase 5)
- **Estimated Time:** 2 hours
- **Dependencies:** None
- **Risk Level:** Low
- **Affected Features:** All (types used throughout)

### Problem Statement
From audit: "types/index.ts (272 lines) - Single file contains types for ALL domains. 17 different exports covering unrelated concerns. Makes it hard to find specific types. Violates single responsibility principle. Forces unnecessary imports."

### Current State
- **File:** `src/types/index.ts`
- **Line Count:** 272 lines
- **Issues:**
  - Follow Me types mixed with Session types
  - Machine types mixed with App types
  - Storage keys buried in type definitions
  - Difficult to navigate and find types
  - Unnecessary coupling

### Target State
**New File Structure:**
```
src/types/
├── index.ts (re-exports, ~30 lines)
├── follow-me.types.ts (~80 lines)
├── session.types.ts (~60 lines)
├── machine.types.ts (~50 lines)
├── app.types.ts (~30 lines)
└── storage.types.ts (~20 lines)
```

**New Files:**
- `src/types/follow-me.types.ts` - ColorKey, ColorDefinition, FollowMeVariant, FollowMeAttempt, FollowMeState, BonusType, BonusDetails, CurrencyMode
- `src/types/session.types.ts` - Session, Transaction, TransactionType, LifetimeStats
- `src/types/machine.types.ts` - Machine, Manufacturer, MachineStats
- `src/types/app.types.ts` - AppSettings
- `src/types/storage.types.ts` - STORAGE_KEYS constant

**Modified Files:**
- `src/types/index.ts` - Convert to re-export hub

### Implementation Steps

1. [ ] Create `src/types/follow-me.types.ts`
   - Copy ColorKey type (lines 13-22)
   - Copy ColorDefinition interface (lines 25-30)
   - Copy FollowMeVariant type (line 37)
   - Copy BonusType type (line 78)
   - Copy CurrencyMode type (line 81)
   - Copy BonusDetails interface (lines 87-98)
   - Copy FollowMeAttempt interface (lines 100-130)
   - Copy FollowMeState interface (lines 182-189)

2. [ ] Create `src/types/session.types.ts`
   - Copy TransactionType type (line 214)
   - Copy Transaction interface (lines 219-232)
   - Copy Session interface (lines 234-271)
   - Copy LifetimeStats interface (lines 132-165)

3. [ ] Create `src/types/machine.types.ts`
   - Copy Manufacturer type (lines 40-46)
   - Copy Machine interface (lines 52-76)
   - Copy MachineStats interface (lines 167-180)

4. [ ] Create `src/types/app.types.ts`
   - Copy AppSettings interface (lines 191-212)

5. [ ] Create `src/types/storage.types.ts`
   - Copy STORAGE_KEYS constant (lines 257-262)

6. [ ] Update `src/types/index.ts`
   - Remove all type definitions
   - Add re-exports from all domain files
   - Verify exports are identical to before

7. [ ] Run verification checks
   - `npx tsc --noEmit`
   - Check for any import errors
   - Build the app

### Pre-Task Verification
Before starting this task:
- [ ] No uncommitted changes in git
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] App runs without errors
- [ ] Baseline snapshot created

### Post-Task Verification
After completing this task:
- [ ] `npm run build` passes (no build errors)
- [ ] `npx tsc --noEmit` passes (no type errors)
- [ ] No new TypeScript errors in IDE
- [ ] App runs without errors
- [ ] All imports still resolve correctly
- [ ] No console errors
- [ ] Can navigate to all pages
- [ ] All existing functionality works

### Test Cases

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|-----------------|--------|
| T1.1 | TypeScript compilation | Run `npx tsc --noEmit` | Zero errors | ⬜ |
| T1.2 | Build succeeds | Run `npm run build` | Build completes | ⬜ |
| T1.3 | Dev server starts | Run `npm run dev` | Server starts, no errors | ⬜ |
| T1.4 | Import resolution | Check IDE, look for red squiggles | No import errors | ⬜ |
| T1.5 | Follow Me loads | Navigate to Follow Me page | Page loads without errors | ⬜ |
| T1.6 | Session starts | Try to start a new session | Session starts successfully | ⬜ |

### Rollback Plan
If issues occur:
```bash
git checkout src/types/
rm src/types/*.types.ts  # Remove new files
npm run dev
# Verify app works
# Document what went wrong in issue log
```

### Git Workflow
```bash
# Create feature branch
git checkout -b refactor/r1-1-split-types

# After completion
git add src/types/
git commit -m "refactor(types): split monolithic types file into domain files

- Create follow-me.types.ts (80 lines)
- Create session.types.ts (60 lines)
- Create machine.types.ts (50 lines)
- Create app.types.ts (30 lines)
- Create storage.types.ts (20 lines)
- Update index.ts to re-export all types (backward compatible)

Resolves audit task R1.1
Reduces types/index.ts from 272 → 30 lines"
```

### Sign-off
- [ ] Developer verified: __________ - Date: __________
- [ ] All test cases pass: ✅
- [ ] TypeScript compilation: ✅
- [ ] Ready for Phase R2: ✅

---

## Task R2.1: Refactor FollowMeHelper.tsx

### Metadata
- **Priority:** P0 (Critical - Most complex component)
- **Estimated Time:** 3 hours
- **Dependencies:** Task R1.1 complete
- **Risk Level:** Medium (complex UI orchestration)
- **Affected Features:** Follow Me Helper, Bonus tracking

### Problem Statement
From audit: "FollowMeHelper.tsx (337 lines) - Monolithic component orchestrating 5+ hooks. Contains UI rendering + orchestration logic + event handling. 337 lines of mixed concerns. Difficult to test individual pieces. High cognitive load."

### Current State
- **File:** `src/components/follow-me/FollowMeHelper.tsx`
- **Line Count:** 337 lines
- **Issues:**
  - Single component doing too much
  - Orchestrates 5 custom hooks
  - Modal state management embedded
  - Event handler logic mixed with render
  - Hard to test in isolation
  - Hard to understand flow

### Target State
**New Files:**
```
src/components/follow-me/
├── FollowMeHelper.tsx (orchestrator, ~80 lines)
├── FollowMeGameView.tsx (game UI, ~100 lines)
└── FollowMeBonusManager.tsx (bonus modals, ~60 lines)

src/hooks/
└── useFollowMeOrchestrator.ts (hook coordination, ~80 lines)
```

**File Responsibilities:**
- **FollowMeHelper.tsx** - Thin composition layer, connects pieces
- **FollowMeGameView.tsx** - Renders grid, sequence, controls only
- **FollowMeBonusManager.tsx** - Handles bonus modal logic and state
- **useFollowMeOrchestrator.ts** - Coordinates hooks, provides event handlers

### Implementation Steps

1. [ ] Create `src/hooks/useFollowMeOrchestrator.ts`
   - Move hook calls (useFollowMe, useSpeech, useVoiceInput, useFollowMeAttempts)
   - Move event handlers (handleColorTap, handleVoiceColorDetected, etc.)
   - Return orchestrated state and handlers
   - Export interface for return type

2. [ ] Create `src/components/follow-me/FollowMeBonusManager.tsx`
   - Accept props: showBonusModal, showBonusDetailsForm, handlers
   - Move BonusModal component usage
   - Move BonusDetailsForm component usage
   - Move bonus state management

3. [ ] Create `src/components/follow-me/FollowMeGameView.tsx`
   - Accept props: sequence, progress, handlers, speaking state
   - Move ColorGrid component
   - Move SequenceDisplay component
   - Move FollowMeControls component
   - Render game UI only

4. [ ] Refactor `src/components/follow-me/FollowMeHelper.tsx`
   - Import useFollowMeOrchestrator
   - Import FollowMeGameView
   - Import FollowMeBonusManager
   - Compose the three pieces
   - Remove all moved logic

5. [ ] Update imports in dependent files
   - Verify FollowMePage.tsx still works

### Pre-Task Verification
Before starting this task:
- [ ] Task R1.1 complete and verified
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Follow Me feature works:
  - [ ] Can tap colors
  - [ ] Sequence updates
  - [ ] TTS speaks (if enabled)
  - [ ] Can complete 20 rounds
  - [ ] Bonus modal works
  - [ ] Reset works

### Post-Task Verification
After completing this task:
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] No new TypeScript errors in IDE
- [ ] App runs without errors
- [ ] Follow Me feature works identically:
  - [ ] Can tap colors and see update
  - [ ] Sequence displays correctly
  - [ ] TTS reads sequence (if enabled)
  - [ ] Voice input works (if enabled)
  - [ ] Can complete full 20-round game
  - [ ] Next Round button works
  - [ ] Bonus modal opens
  - [ ] Bonus details form works
  - [ ] Can save bonus
  - [ ] Reset clears everything
  - [ ] No visual regressions
- [ ] No console errors
- [ ] Files under target size:
  - [ ] FollowMeHelper.tsx < 100 lines
  - [ ] FollowMeGameView.tsx < 120 lines
  - [ ] FollowMeBonusManager.tsx < 80 lines
  - [ ] useFollowMeOrchestrator.ts < 100 lines

### Test Cases

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|-----------------|--------|
| T2.1 | Color tap | 1. Navigate to Follow Me 2. Tap a color | Color added to sequence | ⬜ |
| T2.2 | Sequence display | 1. Add 5 colors | Sequence shows all 5 | ⬜ |
| T2.3 | Remove color | 1. Add colors 2. Tap "Undo" | Last color removed | ⬜ |
| T2.4 | Complete round | 1. Add 20 correct colors | Round completes, Next Round appears | ⬜ |
| T2.5 | Next round | 1. Complete round 2. Tap "Next Round" | New round starts | ⬜ |
| T2.6 | TTS | 1. Tap "Speak Sequence" | TTS reads colors aloud | ⬜ |
| T2.7 | Bonus modal | 1. Complete round 2. Tap bonus icon | Bonus modal opens | ⬜ |
| T2.8 | Save bonus | 1. Open bonus modal 2. Fill form 3. Save | Bonus saved, modal closes | ⬜ |
| T2.9 | Reset | 1. Add colors 2. Tap "Reset" | Everything clears | ⬜ |
| T2.10 | Visual check | Compare before/after | UI looks identical | ⬜ |

### Rollback Plan
```bash
git checkout src/components/follow-me/FollowMeHelper.tsx
rm src/components/follow-me/FollowMeGameView.tsx
rm src/components/follow-me/FollowMeBonusManager.tsx
rm src/hooks/useFollowMeOrchestrator.ts
npm run dev
# Verify Follow Me works
```

### Git Workflow
```bash
git checkout -b refactor/r2-1-follow-me-helper

git commit -m "refactor(follow-me): decompose FollowMeHelper into smaller components

- Create useFollowMeOrchestrator.ts hook (80 lines)
- Create FollowMeGameView.tsx component (100 lines)
- Create FollowMeBonusManager.tsx component (60 lines)
- Refactor FollowMeHelper.tsx to composition layer (80 lines)

Reduces FollowMeHelper from 337 → 80 lines
Improves testability and maintainability

Resolves audit task R2.1"
```

### Sign-off
- [ ] Developer verified: __________ - Date: __________
- [ ] All test cases pass: ✅
- [ ] No regressions: ✅
- [ ] Ready for Task R2.2: ✅

---

## Task R2.2: Refactor StartSessionPage.tsx

### Metadata
- **Priority:** P0 (Critical - Key user flow)
- **Estimated Time:** 3 hours
- **Dependencies:** Task R2.1 complete
- **Risk Level:** Medium (complex form flow)
- **Affected Features:** Session creation, Location/Machine/Game selection

### Problem Statement
From audit: "StartSessionPage.tsx (294 lines) - Page component contains too much form logic. Multiple state variables (8+) for form fields. Event handlers mixed with validation logic. Progressive disclosure logic embedded. Large JSX render block (~200 lines)."

### Current State
- **File:** `src/pages/StartSessionPage.tsx`
- **Line Count:** 294 lines
- **Issues:**
  - 8+ useState variables in page component
  - Form logic should be in form component
  - Progressive disclosure embedded
  - Validation mixed with UI
  - ~200 lines of JSX

### Target State
**New Files:**
```
src/pages/
└── StartSessionPage.tsx (page wrapper, ~50 lines)

src/components/session/
├── StartSessionForm.tsx (form logic, ~120 lines)
├── LocationSelector.tsx (~40 lines)
├── MachineSelector.tsx (~40 lines)
└── GameSelector.tsx (~40 lines)
```

**File Responsibilities:**
- **StartSessionPage.tsx** - Page wrapper, navigation only
- **StartSessionForm.tsx** - Form state, validation, submission
- **LocationSelector.tsx** - Location dropdown + custom location
- **MachineSelector.tsx** - Filtered machine dropdown
- **GameSelector.tsx** - Game chip selection UI

### Implementation Steps

1. [ ] Create `src/components/session/LocationSelector.tsx`
   - Props: value, onChange, locations
   - Render location dropdown
   - Handle custom location toggle
   - Custom location text input

2. [ ] Create `src/components/session/MachineSelector.tsx`
   - Props: value, onChange, machines, disabled
   - Render machine dropdown
   - Filter machines based on location
   - Show manufacturer in option

3. [ ] Create `src/components/session/GameSelector.tsx`
   - Props: selectedGame, onGameSelect, games
   - Render game chips in grid
   - Show selected state (yellow highlight)
   - Show game description

4. [ ] Create `src/components/session/StartSessionForm.tsx`
   - Move all form state from page
   - Import and compose selectors
   - Add balance input
   - Add notes textarea
   - Handle form submission
   - Handle validation

5. [ ] Refactor `src/pages/StartSessionPage.tsx`
   - Import StartSessionForm
   - Pass onSessionStarted callback
   - Handle navigation
   - Keep page thin

### Pre-Task Verification
Before starting this task:
- [ ] Task R2.1 complete and verified
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Session creation works:
  - [ ] Can select location
  - [ ] Machines filter by location
  - [ ] Games appear when machine selected
  - [ ] Can select game
  - [ ] Can enter balance
  - [ ] Can start session

### Post-Task Verification
After completing this task:
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] No TypeScript errors
- [ ] Session creation flow works identically:
  - [ ] Location dropdown shows preloaded locations
  - [ ] Can select location
  - [ ] "Custom Location" option works
  - [ ] Machine dropdown filters by location
  - [ ] Machine dropdown shows all types for custom location
  - [ ] Selecting machine shows game chips
  - [ ] Game chips highlight when selected
  - [ ] Selected game shows description
  - [ ] Balance input validates (>$0)
  - [ ] Notes textarea optional
  - [ ] "Let's Play!" button disabled until all required fields
  - [ ] Clicking "Let's Play!" starts session and navigates
  - [ ] Back button works
- [ ] No visual regressions
- [ ] Files under target size:
  - [ ] StartSessionPage.tsx < 60 lines
  - [ ] StartSessionForm.tsx < 130 lines
  - [ ] LocationSelector.tsx < 50 lines
  - [ ] MachineSelector.tsx < 50 lines
  - [ ] GameSelector.tsx < 50 lines

### Test Cases

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|-----------------|--------|
| T2.2.1 | Select location | 1. Open start session 2. Select "Moose Lodge Ebensburg" | Location selected | ⬜ |
| T2.2.2 | Machines filter | 1. Select location | Only location's machines show | ⬜ |
| T2.2.3 | Custom location | 1. Select "Custom Location" | Text input appears | ⬜ |
| T2.2.4 | Custom machine list | 1. Enter custom location | All machine types available | ⬜ |
| T2.2.5 | Game chips appear | 1. Select machine | Game chips display | ⬜ |
| T2.2.6 | Select game | 1. Tap game chip | Chip highlights yellow, description shows | ⬜ |
| T2.2.7 | Balance input | 1. Enter "$100" | Accepts valid input | ⬜ |
| T2.2.8 | Balance validation | 1. Enter "$0" 2. Submit | Error: "amount > $0" | ⬜ |
| T2.2.9 | Button disabled | Without all fields | "Let's Play!" disabled | ⬜ |
| T2.2.10 | Submit success | 1. Fill all fields 2. Submit | Navigates to /session | ⬜ |

### Rollback Plan
```bash
git checkout src/pages/StartSessionPage.tsx
rm src/components/session/LocationSelector.tsx
rm src/components/session/MachineSelector.tsx
rm src/components/session/GameSelector.tsx
rm src/components/session/StartSessionForm.tsx
npm run dev
```

### Git Workflow
```bash
git checkout -b refactor/r2-2-start-session-page

git commit -m "refactor(session): decompose StartSessionPage into form components

- Create LocationSelector.tsx (40 lines)
- Create MachineSelector.tsx (40 lines)
- Create GameSelector.tsx (40 lines)
- Create StartSessionForm.tsx (120 lines)
- Refactor StartSessionPage.tsx to thin wrapper (50 lines)

Reduces StartSessionPage from 294 → 50 lines
Improves form component reusability

Resolves audit task R2.2"
```

### Sign-off
- [ ] Developer verified: __________ - Date: __________
- [ ] All test cases pass: ✅
- [ ] No regressions: ✅
- [ ] Ready for Phase R3: ✅

---

## Task R3.1: Split useSession.ts Hook

### Metadata
- **Priority:** P1 (High - Hook organization)
- **Estimated Time:** 1 hour
- **Dependencies:** Phase R2 complete
- **Risk Level:** Low
- **Affected Features:** Session management, Transaction logging

### Problem Statement
From audit: "useSession.ts (207 lines) - Started simple, now has 13+ functions. Mixing session CRUD with transaction management. Single hook doing too much. Should split concerns."

### Current State
- **File:** `src/hooks/useSession.ts`
- **Line Count:** 207 lines
- **Issues:**
  - Session CRUD mixed with transaction management
  - 13+ exported functions
  - Violates single responsibility

### Target State
**New Files:**
```
src/hooks/
├── useSession.ts (session CRUD, ~100 lines)
└── useTransactions.ts (transaction management, ~80 lines)
```

**Split Strategy:**
- **useSession.ts** - startSession, endSession, getSessionDuration, getNetProfitLoss, session state
- **useTransactions.ts** - addTransaction, getSessionTransactions, getSessionStats

### Implementation Steps

1. [ ] Create `src/hooks/useTransactions.ts`
   - Import types from session.types
   - Accept activeSession as parameter (or from context)
   - Move addTransaction function
   - Move getSessionTransactions function
   - Move getSessionStats function
   - Return transaction methods

2. [ ] Update `src/hooks/useSession.ts`
   - Keep session CRUD functions
   - Remove transaction functions (now in useTransactions)
   - Keep session state management
   - Keep persistence logic

3. [ ] Update `src/context/SessionContext.tsx`
   - Import both hooks
   - Expose both sets of methods
   - Ensure activeSession passed to useTransactions

4. [ ] Verify all consumers work
   - Check ActiveSessionDashboard imports
   - Check any other components using transaction methods

### Pre-Task Verification
- [ ] Phase R2 complete
- [ ] All tests passing
- [ ] Session and transaction features work

### Post-Task Verification
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] Session features work:
  - [ ] Can start session
  - [ ] Can end session
  - [ ] Session persists
- [ ] Transaction features work:
  - [ ] Can add win
  - [ ] Can add loss
  - [ ] Transactions appear in list
  - [ ] Balance updates
- [ ] Files under target:
  - [ ] useSession.ts < 110 lines
  - [ ] useTransactions.ts < 90 lines

### Test Cases

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|-----------------|--------|
| T3.1.1 | Start session | Start a session | Session active | ⬜ |
| T3.1.2 | End session | End session | Session completed | ⬜ |
| T3.1.3 | Add transaction | Log a win | Transaction added | ⬜ |
| T3.1.4 | Balance updates | Log win/loss | Balance changes | ⬜ |
| T3.1.5 | Transaction list | View transactions | All transactions show | ⬜ |

### Git Workflow
```bash
git checkout -b refactor/r3-1-split-use-session

git commit -m "refactor(hooks): split useSession into session + transactions

- Create useTransactions.ts hook (80 lines)
- Refactor useSession.ts to focus on session CRUD (100 lines)
- Update SessionContext to expose both hooks

Resolves audit task R3.1"
```

### Sign-off
- [ ] Developer verified: __________ - Date: __________
- [ ] All tests pass: ✅
- [ ] Ready for R3.2: ✅

---

## Task R3.2: Create useFollowMeOrchestrator Hook

_Note: This was created as part of R2.1. Verify it exists and meets requirements._

### Metadata
- **Priority:** P1
- **Status:** ✅ **Likely complete from R2.1**
- **Verification Required:** Check if hook was created during R2.1

### Verification Steps
- [ ] File exists: `src/hooks/useFollowMeOrchestrator.ts`
- [ ] File is under 100 lines
- [ ] Properly orchestrates Follow Me hooks
- [ ] Used by FollowMeHelper.tsx

If not created, follow similar pattern to R3.1 to extract orchestration logic.

---

## Task R3.3: Create useMachineDefaults Hook

### Metadata
- **Priority:** P1
- **Estimated Time:** 30 minutes
- **Dependencies:** Task R3.1 complete
- **Risk Level:** Low
- **Affected Features:** Machine form auto-fill

### Problem Statement
From audit: "MachineForm.tsx has auto-fill logic in useEffect that should be extracted to a hook."

### Target State
- **New File:** `src/hooks/useMachineDefaults.ts`
- Extract auto-fill logic from MachineForm

### Implementation Steps

1. [ ] Create `src/hooks/useMachineDefaults.ts`
   - Accept manufacturer as parameter
   - Return default values object
   - Use MANUFACTURER_DEFAULTS from config

2. [ ] Update `src/components/machines/MachineForm.tsx`
   - Import useMachineDefaults
   - Replace useEffect with hook call
   - Apply defaults to form

### Post-Task Verification
- [ ] Machine form auto-fill still works
- [ ] Changing manufacturer updates defaults
- [ ] Hook is under 50 lines

### Git Workflow
```bash
git checkout -b refactor/r3-3-machine-defaults-hook

git commit -m "refactor(hooks): extract machine defaults to custom hook

- Create useMachineDefaults.ts hook
- Simplify MachineForm.tsx useEffect

Resolves audit task R3.3"
```

---

## Task R4.1: Refactor ActiveSessionDashboard

### Metadata
- **Priority:** P1
- **Estimated Time:** 2 hours
- **Dependencies:** Phase R3 complete
- **Risk Level:** Low
- **Affected Features:** Active session display

### Problem Statement
From audit: "ActiveSessionDashboard.tsx (212 lines) - Combines timer, balance display, transaction UI, modals. Multiple responsibilities. Hard to test."

### Target State
**New Files:**
```
src/components/common/
└── SessionTimer.tsx (~30 lines)

src/components/tracker/
├── ActiveSessionDashboard.tsx (orchestrator, ~80 lines)
├── SessionBalanceCard.tsx (~40 lines)
└── SessionInfoCard.tsx (~30 lines)
```

### Implementation Steps

1. [ ] Create `src/components/common/SessionTimer.tsx`
   - Props: startTime
   - Timer logic (HH:MM:SS)
   - useEffect with setInterval
   - Return formatted time display

2. [ ] Create `src/components/tracker/SessionBalanceCard.tsx`
   - Props: currentBalance, startingBalance
   - Display large balance
   - Show net profit/loss
   - Color coding (green/red/white)

3. [ ] Create `src/components/tracker/SessionInfoCard.tsx`
   - Props: session details
   - Display starting balance, machine, location, notes
   - Render info grid

4. [ ] Refactor `src/components/tracker/ActiveSessionDashboard.tsx`
   - Import extracted components
   - Compose timer, balance, info, transactions
   - Keep modals and transaction logic
   - Thin orchestration layer

### Post-Task Verification
- [ ] Timer counts correctly
- [ ] Balance displays with correct colors
- [ ] Session info shows all details
- [ ] Transaction buttons work
- [ ] End session works
- [ ] No visual regressions

### Test Cases

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|-----------------|--------|
| T4.1.1 | Timer counts | Wait 5 seconds | Timer shows 00:00:05 | ⬜ |
| T4.1.2 | Balance color (profit) | Log win | Balance shows green | ⬜ |
| T4.1.3 | Balance color (loss) | Log loss exceeding start | Balance shows red | ⬜ |
| T4.1.4 | Session info | View dashboard | All info displayed | ⬜ |
| T4.1.5 | Transactions | Log win/loss | Transactions list updates | ⬜ |

### Git Workflow
```bash
git checkout -b refactor/r4-1-active-session-dashboard

git commit -m "refactor(tracker): decompose ActiveSessionDashboard into components

- Create SessionTimer.tsx (30 lines)
- Create SessionBalanceCard.tsx (40 lines)
- Create SessionInfoCard.tsx (30 lines)
- Refactor ActiveSessionDashboard.tsx (80 lines)

Reduces ActiveSessionDashboard from 212 → 80 lines

Resolves audit task R4.1"
```

---

## Task R4.2: Simplify MachineForm

### Metadata
- **Priority:** P1
- **Estimated Time:** 1 hour
- **Dependencies:** Task R4.1 complete
- **Risk Level:** Low
- **Affected Features:** Machine form validation

### Target State
- Extract validation to `src/utils/validation.ts`
- MachineForm.tsx uses validation utilities

### Implementation Steps

1. [ ] Create `src/utils/validation.ts`
   - Create validateMachineForm function
   - Export validation helpers

2. [ ] Update MachineForm.tsx
   - Import validation utilities
   - Replace inline validation
   - Simplify form logic

### Post-Task Verification
- [ ] Machine form validation works
- [ ] Error messages display correctly
- [ ] Form submission validates

### Git Workflow
```bash
git commit -m "refactor(forms): extract machine form validation to utils

- Create validation.ts utility
- Simplify MachineForm.tsx

Resolves audit task R4.2"
```

---

## Task R5.1: Create Formatting Utilities

### Metadata
- **Priority:** P2
- **Estimated Time:** 1 hour
- **Dependencies:** Phase R4 complete
- **Risk Level:** Low
- **Affected Features:** Date/currency/time formatting across app

### Problem Statement
From audit: "Formatting logic duplicated across HomePage, SessionSummary, TransactionList, ActiveSessionDashboard."

### Target State
- **New File:** `src/utils/formatting.ts`
- Centralized formatting functions
- DRY principle

### Implementation Steps

1. [ ] Create `src/utils/formatting.ts`
   ```typescript
   export function formatCurrency(amount: number): string
   export function formatTime(seconds: number): string // HH:MM:SS
   export function formatDuration(minutes: number): string // Xh Ym
   export function formatDate(date: Date, format?: string): string
   ```

2. [ ] Find and replace duplicated logic in:
   - HomePage.tsx (formatCurrency, formatDate, formatDuration)
   - SessionSummary.tsx (formatCurrency, formatDuration)
   - TransactionList.tsx (formatCurrency, formatTime/date)
   - ActiveSessionDashboard.tsx (formatTime)

3. [ ] Test all formatted displays

### Post-Task Verification
- [ ] Currency formats correctly ($X.XX)
- [ ] Time formats as HH:MM:SS
- [ ] Duration formats as "Xh Ym"
- [ ] Dates format consistently
- [ ] No visual regressions

### Git Workflow
```bash
git commit -m "refactor(utils): create formatting utilities to reduce duplication

- Create formatting.ts with currency/time/date formatters
- Replace duplicated logic in HomePage, SessionSummary, TransactionList, ActiveSessionDashboard

Resolves audit task R5.1"
```

---

## Task R5.2: Create Validation Utilities

_Note: May be partially complete from R4.2. Extend validation.ts with additional helpers._

### Metadata
- **Priority:** P2
- **Estimated Time:** 30 minutes
- **Dependencies:** Task R5.1 complete
- **Risk Level:** Low

### Target State
Expand `src/utils/validation.ts` with:
- Form field validators
- Input sanitizers
- Validation error messages

---

## Task R5.3: Archive Deprecated Machine Components

### Metadata
- **Priority:** P2
- **Estimated Time:** 15 minutes
- **Dependencies:** Task R5.2 complete
- **Risk Level:** Very Low
- **Affected Features:** None (deprecated code)

### Problem Statement
From audit: "Phase 1 Machine components (MachineForm, MachineList, MachineCard) are deprecated. Machine data now preloaded. These add unnecessary bundle size."

### Implementation Steps

1. [ ] Create directory `src/components/_deprecated/machines/`
2. [ ] Move deprecated files:
   - MachineCard.tsx
   - MachineForm.tsx
   - MachineList.tsx
3. [ ] Create README in _deprecated explaining why
4. [ ] Verify app still builds
5. [ ] Verify no imports reference old paths

### Post-Task Verification
- [ ] App builds successfully
- [ ] No import errors
- [ ] Deprecated files in _deprecated folder
- [ ] README exists explaining archival

### Git Workflow
```bash
git commit -m "chore: archive deprecated Phase 1 machine components

- Move MachineCard, MachineForm, MachineList to _deprecated/
- Add README explaining deprecation
- Reduces active component count

Resolves audit task R5.3"
```

---

## Task R5.4: Consolidate Constants

### Metadata
- **Priority:** P2
- **Estimated Time:** 30 minutes
- **Dependencies:** Task R5.3 complete
- **Risk Level:** Low
- **Affected Features:** Game/machine data

### Problem Statement
From audit: "games.ts appears to be legacy/duplicate of gameData.ts. Need to verify usage and consolidate."

### Implementation Steps

1. [ ] Check if `src/constants/games.ts` is imported anywhere
   ```bash
   grep -r "from.*games" src/
   ```

2. [ ] If not used:
   - Delete or move to _deprecated

3. [ ] If used:
   - Merge with gameData.ts
   - Update imports

### Post-Task Verification
- [ ] No duplicate data
- [ ] All imports resolve
- [ ] App builds and runs

### Git Workflow
```bash
git commit -m "chore(constants): consolidate game data files

- Remove duplicate games.ts (merged into gameData.ts)
OR
- Archive unused games.ts

Resolves audit task R5.4"
```

---

## 📊 Progress Dashboard

### Overall Status

| Phase | Tasks | Completed | In Progress | Not Started | Status |
|-------|-------|-----------|-------------|-------------|--------|
| **R1** | 1 | 1 | 0 | 0 | ✅ Complete |
| **R2** | 2 | 1 | 0 | 1 | 🔄 In Progress |
| **R3** | 3 | 1 | 0 | 2 | 🔄 In Progress |
| **R4** | 2 | 0 | 0 | 2 | ⬜ Not Started |
| **R5** | 4 | 0 | 0 | 4 | ⬜ Not Started |
| **TOTAL** | **12** | **3** | **0** | **9** | **25% Complete** |

### Task Status

| Task ID | Task Name | Priority | Estimated | Status | Completed By | Date |
|---------|-----------|----------|-----------|--------|--------------|------|
| R1.1 | Split types/index.ts | P0 | 2h | ✅ | Claude | Jan 7, 2026 8:09 PM EST |
| R2.1 | Refactor FollowMeHelper | P0 | 3h | ✅ | Claude | Jan 8, 2026 7:55 AM EST |
| R2.2 | Refactor StartSessionPage | P0 | 3h | ⬜ | - | - |
| R3.1 | Split useSession hook | P1 | 1h | ⬜ | - | - |
| R3.2 | Create useFollowMeOrchestrator | P1 | 0h* | ✅ | Claude | Jan 8, 2026 7:55 AM EST |
| R3.3 | Create useMachineDefaults | P1 | 0.5h | ⬜ | - | - |
| R4.1 | Refactor ActiveSessionDashboard | P1 | 2h | ⬜ | - | - |
| R4.2 | Simplify MachineForm | P1 | 1h | ⬜ | - | - |
| R5.1 | Create formatting utils | P2 | 1h | ⬜ | - | - |
| R5.2 | Create validation utils | P2 | 0.5h | ⬜ | - | - |
| R5.3 | Archive deprecated components | P2 | 0.25h | ⬜ | - | - |
| R5.4 | Consolidate constants | P2 | 0.5h | ⬜ | - | - |

*R3.2 may already be complete from R2.1

### Status Legend
- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked
- ⏸️ On Hold
- ⚠️ Issues Found

### Completion Log

| Task ID | Completed By | Date | Time Spent | Notes |
|---------|--------------|------|------------|-------|
| R1.1 | Claude | January 7, 2026 8:09 PM EST | ~1.5h | ✅ All tests pass. Branch: refactor/r1.1-split-types |
| R2.1 | Claude | January 8, 2026 7:55 AM EST | ~2.5h | ✅ 337→88 lines (74% reduction). Branch: refactor/r2.1-follow-me-helper |
| R3.2 | Claude | January 8, 2026 7:55 AM EST | ~0h | ✅ Created as part of R2.1. Included in useFollowMeOrchestrator.ts |

---

## 🧪 Testing Protocol

### Automated Testing
_Note: Automated tests to be added in future phases. For now, rely on TypeScript compilation and manual testing._

**Future:**
- Unit tests for utilities (formatting, validation)
- Component tests for extracted components
- Integration tests for key user flows

### Manual Test Checklist

Execute ALL tests after EACH task completion.

#### ✅ Build & Compilation Tests
- [ ] `npm run build` completes without errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run dev` starts without errors
- [ ] App loads at http://localhost:5173
- [ ] No console errors in browser devtools
- [ ] No TypeScript errors in IDE (VS Code)

#### ✅ Follow Me Helper Tests
- [ ] Navigate to Follow Me page
- [ ] Tap colors on grid → sequence updates
- [ ] Tap "Undo" → last color removed
- [ ] Tap "Reset" → sequence clears
- [ ] Tap "Speak Sequence" → TTS reads colors (if enabled)
- [ ] Add 20 colors correctly → round completes
- [ ] Tap "Next Round" → new round starts with +1 color
- [ ] Tap bonus icon → bonus modal opens
- [ ] Fill bonus details form → saves successfully
- [ ] Voice input works (if enabled)
- [ ] Visual: No layout shifts or styling changes

#### ✅ Session Tracker Tests
- [ ] Navigate to Home page
- [ ] Tap "Start New Session" → navigates to /start-session
- [ ] Select location from dropdown → works
- [ ] Select "Custom Location" → text input appears
- [ ] Select machine → machine dropdown works
- [ ] Machine list filters by location
- [ ] Select machine → game chips appear
- [ ] Tap game chip → highlights yellow, description shows
- [ ] Enter starting balance → accepts input
- [ ] Validation: Enter $0 → shows error
- [ ] Fill all fields → "Let's Play!" enabled
- [ ] Tap "Let's Play!" → navigates to /session
- [ ] Timer starts counting: 00:00:01, 00:00:02, etc.
- [ ] Balance displays correctly
- [ ] Net shows $0.00 (white)
- [ ] Tap "+Win" → modal opens
- [ ] Tap quick amount ($25) → fills input
- [ ] Submit → transaction added, modal closes
- [ ] Balance updates to $125
- [ ] Net shows +$25.00 (green)
- [ ] Transaction appears in list with time
- [ ] Tap "-Loss" → modal opens
- [ ] Enter $10 → submit
- [ ] Balance updates to $115
- [ ] Net shows +$15.00 (still green)
- [ ] Add loss > starting balance → balance goes red
- [ ] Tap "End Session" → confirmation appears
- [ ] Confirm → navigates to /session/summary
- [ ] Summary shows duration, profit/loss, details
- [ ] Tap "Done" → navigates to /home
- [ ] Session appears in Recent Sessions
- [ ] Visual: No layout shifts or styling changes

#### ✅ Navigation Tests
- [ ] Tap "🏠 Home" tab → navigates to /home
- [ ] Tap "🎯 Follow Me" tab → navigates to /follow-me
- [ ] Tap "📊 Stats" tab → navigates to /stats
- [ ] Tap "⚙️ Settings" tab → navigates to /settings
- [ ] Active tab highlights in yellow
- [ ] All pages load without errors
- [ ] Back button works correctly

#### ✅ Persistence Tests
- [ ] Start a session with transactions
- [ ] Refresh page (F5)
- [ ] Session still active
- [ ] Transactions still present
- [ ] Balance correct
- [ ] Timer resumes
- [ ] End session
- [ ] Refresh page
- [ ] Completed session in history
- [ ] Follow Me: Add colors, refresh → sequence persists

#### ✅ Visual Regression Tests
- [ ] Compare screenshots before/after refactoring
- [ ] Home page looks identical
- [ ] Follow Me looks identical
- [ ] Session page looks identical
- [ ] No color changes
- [ ] No layout shifts
- [ ] No font changes
- [ ] All icons display
- [ ] All spacing consistent

---

## ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation Strategy | Owner |
|------|------------|--------|---------------------|-------|
| Breaking existing functionality during refactoring | Medium | High | • Comprehensive testing after each task<br>• Small, focused changes<br>• Git commits after each task<br>• Rollback plan for each task | Dev |
| Type errors after splitting types | Low | Medium | • Run `npx tsc --noEmit` after each change<br>• Use IDE TypeScript checking<br>• Verify imports resolve | Dev |
| Import path issues when moving files | Medium | Low | • Use IDE refactoring tools<br>• Search & replace for import paths<br>• Verify with TypeScript compiler | Dev |
| Merge conflicts if working on multiple tasks | Low | Medium | • Work on one task at a time<br>• Small, focused branches<br>• Frequent commits | Dev |
| Visual regressions (UI changes) | Medium | Medium | • Screenshot comparison<br>• Manual visual testing<br>• Test on multiple screen sizes | Dev |
| Performance degradation from extracted components | Very Low | Low | • Monitor app performance<br>• Check bundle size<br>• Profile if needed | Dev |
| Losing track of progress | Low | Low | • Update progress dashboard after each task<br>• Document completion in log | Dev |
| Testing fatigue (skipping tests) | Medium | High | • Automate what can be automated<br>• Create test checklist<br>• Take breaks between tasks | Dev |

---

## 📋 Definition of Done

A refactoring task is considered **DONE** when ALL of the following are true:

### ✅ Implementation Complete
- [ ] All implementation steps in task are checked off
- [ ] All code changes committed to git
- [ ] Branch follows naming convention
- [ ] Commit message follows template

### ✅ Technical Verification
- [ ] `npm run build` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No new TypeScript errors in IDE
- [ ] App runs without errors (`npm run dev`)
- [ ] No console errors in browser

### ✅ Functional Verification
- [ ] All test cases for task pass
- [ ] All affected features work identically to before
- [ ] No regressions in other features
- [ ] Manual test checklist complete

### ✅ Code Quality
- [ ] Target file sizes achieved (under 200 lines, ideally under 150)
- [ ] Code follows existing patterns and conventions
- [ ] No code duplication introduced
- [ ] Imports are clean and organized

### ✅ Documentation
- [ ] Task marked complete in progress dashboard
- [ ] Completion log updated with name, date, time
- [ ] Any issues or deviations documented
- [ ] Sign-off recorded

### ✅ Git Workflow
- [ ] Changes committed with proper message
- [ ] Branch ready to merge (or merged)
- [ ] No merge conflicts

### ✅ Sign-off
- [ ] Developer name: __________
- [ ] Date/Time: __________
- [ ] Verified all checklist items: ✅
- [ ] Ready for next task: ✅

---

## 🚀 Next Steps After Refactoring

Once ALL tasks (R1-R5) are complete:

1. **Final Verification**
   - Run full manual test suite
   - Verify all files under 200 lines
   - Check bundle size
   - Review code quality

2. **Documentation**
   - Update architecture docs
   - Document new component structure
   - Update developer onboarding guide

3. **Commit & Merge**
   - Merge all refactoring branches
   - Create refactoring completion PR
   - Get code review
   - Merge to main

4. **Phase 5 Preparation**
   - Review Phase 5 requirements
   - Ensure blockers removed
   - Clean, maintainable codebase ready

5. **Celebrate!** 🎉
   - Refactoring is hard work
   - Codebase is now cleaner and more maintainable
   - Ready for future development

---

## 📚 References

- **Original Audit Report:** See previous conversation (January 7, 2026)
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **React Best Practices:** https://react.dev/learn
- **Git Commit Conventions:** https://www.conventionalcommits.org/

---

## 🔐 Enforcement Mode

This document is the **single source of truth** for refactoring work.

**Rules:**
1. ✅ **NO** refactoring without a task in this document
2. ✅ **NO** skipping verification steps
3. ✅ **NO** moving to next task without completing current task
4. ✅ **YES** update progress dashboard after each task
5. ✅ **YES** run all tests after each task
6. ✅ **YES** document any issues or deviations

**Questions?** Refer to this document first.

---

**END OF REFACTORING PLAN**

_Last updated: January 7, 2026 - Ready for execution_
