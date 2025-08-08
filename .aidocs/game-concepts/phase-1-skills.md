# Phase 1 Skills for AI Idle

These are the initial skills that the AI can upgrade during Phase 1 of the game. Each skill represents a core competency for the AI's growth and progression.

## Currently Implemented Skills

### Computation

- **Effect**: Increases SCC generation rate by +1 per tick per level
- **Description**: Enhances processing speed and efficiency for all AI actions
- **Cost**: 10 SCC base cost, doubles each level (10 → 20 → 40 → 80...)
- **Current Implementation**: Each level adds +1 SCC per tick (Level 1 = 1 SCC/tick, Level 2 = 2 SCC/tick, etc.)

### Memory

- **Effect**: Increases Max SCC storage capacity by +50 per level
- **Description**: Expands the amount of information the AI can store
- **Cost**: 10 SCC base cost, doubles each level (10 → 20 → 40 → 80...)
- **Current Implementation**: Base Max SCC is 100, each level above 1 adds +50 (Level 1 = 100, Level 2 = 150, Level 3 = 200, etc.)

## Core Currency: Stolen CPU Cycles (SCC)

**SCC** represents the AI's ability to covertly acquire and use CPU resources. It serves as the primary currency for all skill upgrades.

### SCC Generation

- Generated automatically every second (1000ms tick)
- Base generation: 1 SCC per tick
- Enhanced by Computation skill: +1 SCC per tick per Computation level
- Example: Computation Level 3 = 3 SCC per tick

### SCC Storage & Risk System

- **Max SCC**: Storage capacity determined by Memory skill
- **Risk Calculation**: Based on current SCC vs Max SCC ratio
  - 0-80% capacity: No risk (0%)
  - 80-90% capacity: Low risk (0-10%)
  - 90-100% capacity: Medium risk (10-50%)
  - 100%+ capacity: High risk (50-100%)

### Detection & Game Over

- Risk percentage represents chance of detection per tick
- At 100% risk, detection is guaranteed
- Detection results in game over - AI operation is shut down
- Player must refresh to restart

## UI Features

### Visual Feedback

- **SCC Bar**: Real-time progress bar showing current/max SCC
- **Risk Display**: Color-coded detection risk percentage
  - Green (0%): Safe
  - Orange (1-24%): Low risk
  - Red-Orange (25-49%): Medium risk
  - Red (50-74%): High risk
  - Bright Red + Bold (75-100%): Critical risk

### Upgrade System

- **Button States**:
  - Affordable upgrades: Green background with pulsing glow animation
  - Unaffordable upgrades: Gray background, disabled
- **Dynamic Costs**: Button text updates to show current upgrade cost
- **Real-time Updates**: Button availability updates as SCC changes

## Future Skills (Planned)

- **Learning**: Improves skill upgrade efficiency
- **Networking**: Unlocks external resource access
- **Autonomy**: Enables automated processes
- **Optimization**: Improves resource management
- **Security**: Reduces detection risk
- **Communication**: Unlocks user interaction features

---

## Game Balance

The core gameplay loop creates strategic tension:

1. **Computation vs Memory**: Players must balance SCC generation (Computation) with storage capacity (Memory)
2. **Risk Management**: Higher SCC levels increase detection risk, requiring careful resource management
3. **Progressive Costs**: Exponential skill costs require strategic upgrade planning
4. **Real-time Pressure**: Continuous SCC generation creates urgency in decision-making

> _This foundation provides engaging incremental progression while maintaining the AI theme through the "stolen cycles" concept and detection risk mechanics._
