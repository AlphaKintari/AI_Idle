# Technical Implementation

This document describes the current technical implementation of the AI Idle game.

## Technology Stack

- **Frontend**: HTML5, CSS3, TypeScript
- **Build System**: TypeScript Compiler (tsc)
- **Development Environment**: VS Code with Node.js
- **Code Quality**: ESLint, Prettier

## File Structure

```text
src/
├── index.html          # Main game HTML
├── index.ts            # Core game logic (TypeScript)
├── dist/
│   └── index.js        # Compiled JavaScript
├── css/
│   ├── style.css       # Main styles
│   ├── layout.css      # Layout and grid
│   ├── retro-green.css # Theme styles
│   ├── status.css      # Status window styles
│   └── scc-bar.css     # Progress bar styles
├── tsconfig.json       # TypeScript configuration
├── package.json        # Node.js dependencies
└── .eslintrc.json      # ESLint configuration
```

## Core Architecture

### Game State Management

```typescript
// Core game state
let scc: number = 0;              // Current SCC currency
let SCC_MAX: number = 100;        // Dynamic storage capacity
let gameOver: boolean = false;    // Game over flag

// Skills system
interface Skill {
  key: SkillKey;
  name: string;
  desc: string;
  level: number;
  baseCost: number;
}

const skills: Record<SkillKey, Skill> = {
  computation: { /* ... */ },
  memory: { /* ... */ }
};
```

### Game Loop

The game uses a 1-second interval tick system:

```typescript
function tick() {
  if (gameOver) return;
  
  // Update dynamic values
  SCC_MAX = 100 + (skills.memory.level - 1) * 50;
  scc += getSccPerTick();
  
  // Risk calculation and game over check
  if (checkGameOver()) {
    gameOver = true;
    // Handle game over...
  }
  
  // Cap SCC and update UI
  if (scc > SCC_MAX) scc = SCC_MAX;
  updateSccUI();
}

setInterval(tick, 1000);
```

### Risk System

Risk calculation based on SCC capacity:

```typescript
function calculateRisk(): number {
  const capacity = scc / SCC_MAX;
  if (capacity < 0.8) return 0;
  if (capacity < 0.9) return Math.floor((capacity - 0.8) * 100);
  if (capacity < 1.0) return Math.floor(10 + (capacity - 0.9) * 400);
  
  const overflow = (scc - SCC_MAX) / SCC_MAX;
  return Math.min(100, Math.floor(50 + overflow * 200));
}
```

## Allocation System Architecture (Planned)

### Extended Game State

```typescript
// Allocation system additions
interface SkillAllocation {
  percentage: number;          // 0-100, allocation percentage
  xp: number;                 // Accumulated XP toward next level
  xpRequired: number;         // XP needed for next level
}

interface ExtendedSkill extends Skill {
  allocation: SkillAllocation;
}

// Allocation state
let totalAllocationPercentage: number = 0;
const MAX_ALLOCATION: number = 100;
```

### Allocation Processing

```typescript
function processAllocation() {
  const totalSCC = getSccPerTick();
  
  Object.values(skills).forEach(skill => {
    // Calculate SCC allocated to this skill
    const allocatedSCC = totalSCC * (skill.allocation.percentage / 100);
    
    // Convert to XP (1:1 ratio)
    skill.allocation.xp += allocatedSCC;
    
    // Check for level up
    if (skill.allocation.xp >= skill.allocation.xpRequired) {
      levelUpSkill(skill);
    }
  });
  
  // Add unallocated SCC to storage
  const unallocatedPercentage = MAX_ALLOCATION - totalAllocationPercentage;
  const unallocatedSCC = totalSCC * (unallocatedPercentage / 100);
  scc += unallocatedSCC;
}

function levelUpSkill(skill: ExtendedSkill) {
  skill.level++;
  skill.allocation.xp = 0;
  skill.allocation.xpRequired = calculateXPRequirement(skill.level + 1);
  // Apply skill effects immediately
  updateSkillEffects();
}

function calculateXPRequirement(level: number): number {
  const BASE_XP = 100;
  const MULTIPLIER = 1.5;
  return Math.floor(BASE_XP * Math.pow(MULTIPLIER, level - 2));
}
```

### Allocation UI Components

```typescript
function renderAllocationControls() {
  skills.forEach(skill => {
    const allocationSlider = createAllocationSlider(skill);
    const xpProgressBar = createXPProgressBar(skill);
    const timeToLevelDisplay = createTimeToLevelDisplay(skill);
    
    // Update displays
    updateAllocationDisplays(skill);
  });
}

function createAllocationSlider(skill: ExtendedSkill): HTMLElement {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = skill.allocation.percentage.toString();
  
  slider.addEventListener('input', (e) => {
    updateAllocation(skill, parseInt(e.target.value));
  });
  
  return slider;
}

function updateAllocation(skill: ExtendedSkill, newPercentage: number) {
  const oldPercentage = skill.allocation.percentage;
  const difference = newPercentage - oldPercentage;
  
  // Validate total allocation doesn't exceed 100%
  if (totalAllocationPercentage + difference > MAX_ALLOCATION) {
    // Reduce other allocations proportionally
    redistributeAllocation(difference);
  }
  
  skill.allocation.percentage = newPercentage;
  totalAllocationPercentage += difference;
  
  updateAllocationDisplays();
}
```

## Current UI System

### Dynamic Elements

- **SCC Display**: Real-time currency updates
- **Progress Bar**: Visual SCC/Max SCC representation
- **Risk Indicator**: Color-coded detection chance
- **Skill Buttons**: State-dependent styling (enabled/disabled)

### CSS Classes

```css
/* Button states */
.upgrade-btn:not(:disabled) {
  background: #22c55e;           /* Green for affordable */
  animation: pulse-affordable 2s infinite;
}

.upgrade-btn:disabled {
  background: #333944;           /* Gray for unaffordable */
  cursor: not-allowed;
}

/* Risk color coding */
.risk-safe { color: #4f9f4f; }
.risk-low { color: #ffaa00; }
.risk-medium { color: #ff6600; }
.risk-high { color: #ff3300; }
.risk-critical { color: #ff0000; font-weight: bold; }

/* Allocation system styling (planned) */
.allocation-panel {
  background: #2a2f36;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
}

.xp-progress-bar {
  width: 100%;
  height: 8px;
  background: #444;
  border-radius: 4px;
  overflow: hidden;
}

.xp-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f8cff, #22c55e);
  transition: width 0.3s ease;
}

.allocation-slider {
  width: 100%;
  margin: 8px 0;
  accent-color: #4f8cff;
}

.allocation-percentage {
  font-weight: bold;
  color: #4f8cff;
}

.time-to-level {
  font-size: 0.9em;
  color: #aaa;
  font-style: italic;
}
```

### Event Handling

```typescript
// Skill upgrades
upgradeBtn.onclick = () => {
  if (scc >= getSkillCost(skill)) {
    scc -= getSkillCost(skill);
    skill.level++;
    updateSccUI();
    renderSkills();
  }
};

// Navigation
optionsBtn?.addEventListener('click', () => {
  gameSection!.style.display = 'none';
  optionsSection!.style.display = 'block';
});
```

## Game Balance

### Skill Costs

Exponential progression: `baseCost * 2^(level-1)`

- Level 1: 10 SCC
- Level 2: 20 SCC  
- Level 3: 40 SCC
- Level 4: 80 SCC
- Level 5: 160 SCC

### SCC Generation

Linear progression: `1 + (computation.level - 1)`

- Computation Level 1: 1 SCC/tick
- Computation Level 2: 2 SCC/tick
- Computation Level 3: 3 SCC/tick

### Storage Capacity

Linear progression: `100 + (memory.level - 1) * 50`

- Memory Level 1: 100 Max SCC
- Memory Level 2: 150 Max SCC
- Memory Level 3: 200 Max SCC

## Performance Considerations

- **1-second tick rate** prevents excessive CPU usage
- **Selective UI updates** only when necessary
- **Event delegation** for dynamic button elements
- **CSS animations** handled by browser, not JavaScript

## Development Workflow

### TypeScript Watch Mode (Recommended)

**Always start TypeScript watch mode for auto-compilation:**

```bash
cd src/
npx tsc --watch
```

This provides:

- **Auto-compilation**: Changes to `.ts` files automatically compile to `.js`
- **Real-time errors**: TypeScript errors show immediately on save
- **Hot development**: Edit → Save → Refresh browser workflow
- **Background processing**: Runs continuously without blocking work

### Manual Development Process

1. **Start TypeScript Watch**: `npx tsc --watch` (in src/ directory)
2. Edit TypeScript files in `src/`
3. **Auto-compile**: Watch mode handles compilation automatically  
4. Open `src/index.html` in browser to test
5. Use VS Code extensions for linting and formatting

**Note**: Always prefer watch mode over manual `npx tsc` compilation for active development.

## Future Enhancements

### Phase 2: SCC Allocation System (Next Major Feature)

- **Replace Purchase Model**: Transform instant skill purchases into allocation-based progression
- **XP System**: Implement continuous skill advancement through XP accumulation
- **Allocation UI**: Add sliders, progress bars, and real-time allocation feedback
- **Strategic Gameplay**: Create deeper resource management decisions

### Additional Features

- **Save/Load System**: LocalStorage persistence for game state and allocations
- **Additional Skills**: Extended skill tree with Learning, Networking, Autonomy, etc.
- **Allocation Presets**: Quick allocation templates (Balanced, Focused, etc.)
- **Advanced Mechanics**: Skill synergies, efficiency bonuses, allocation automation
- **Sound Effects**: Audio feedback for level ups and allocation changes
- **Animations**: Smooth transitions for XP gains and skill level increases
- **Mobile Support**: Responsive design improvements for touch interfaces
