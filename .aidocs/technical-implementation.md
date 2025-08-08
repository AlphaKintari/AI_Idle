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

## UI System

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

1. Edit TypeScript files in `src/`
2. Run `npx tsc` to compile to JavaScript
3. Open `src/index.html` in browser to test
4. Use VS Code extensions for linting and formatting

## Future Enhancements

- **Save/Load System**: LocalStorage persistence
- **Additional Skills**: Extended skill tree implementation
- **Sound Effects**: Audio feedback for actions
- **Animations**: More sophisticated UI transitions
- **Mobile Support**: Responsive design improvements
