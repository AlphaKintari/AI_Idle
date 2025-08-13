# Phase 1 Skills for AI Idle

These are the initial skills that the AI can upgrade during Phase 1 of the game. Each skill represents a core competency for the AI's growth and progression.

## Skill Progression System

### SCC Allocation Model

Skills progress through **SCC allocation** rather than direct purchases:

- Players allocate percentages of SCC income to different skills
- Allocated SCC converts to XP for that skill each tick
- Skills level up automatically when XP thresholds are reached
- Unallocated SCC accumulates in storage (subject to Max SCC limits)

### XP and Leveling

- **XP Conversion**: 1 SCC allocated = 1 XP gained per tick
- **Level Requirements**: Progressive XP thresholds (exponential growth)
- **Automatic Leveling**: Skills upgrade when XP requirement is met
- **Continuous Progress**: Always advancing toward next level

## Currently Implemented Skills

### Computation

- **Effect**: Increases SCC generation rate by +1 per tick per level
- **Description**: Enhances processing speed and efficiency for all AI actions
- **XP Requirements**: 100 XP base, 1.5x multiplier per level
- **Allocation Impact**: Higher allocation = faster SCC generation improvement
- **Strategic Value**: Multiplies effectiveness of all other allocations

### Memory

- **Effect**: Increases Max SCC storage capacity by +50 per level
- **Description**: Expands the amount of information the AI can store
- **XP Requirements**: 100 XP base, 1.5x multiplier per level
- **Allocation Impact**: Higher allocation = larger SCC storage capacity
- **Strategic Value**: Reduces detection risk and enables higher allocations

## Core Currency: Stolen CPU Cycles (SCC)

**SCC** represents the AI's ability to covertly acquire and use CPU resources. It serves as the foundation for all skill progression through the allocation system.

### SCC Generation

- Generated automatically every second (1000ms tick)
- Base generation: 1 SCC per tick
- Enhanced by Computation skill: +1 SCC per tick per Computation level
- Example: Computation Level 3 = 3 SCC per tick

### SCC Allocation

- **Total SCC Pool**: All generated SCC each tick
- **Allocation Percentages**: Player-controlled distribution to skills
- **XP Conversion**: Allocated SCC becomes skill XP immediately
- **Storage**: Unallocated SCC goes to storage pool

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

## Strategic Gameplay

### Resource Allocation Decisions

- **Computation Priority**: Higher allocation increases total SCC generation
- **Memory Priority**: Higher allocation reduces detection risk
- **Balanced Approach**: Moderate allocation to both for steady growth
- **Specialization**: Focus allocation for rapid advancement in one area

### Risk Management Through Allocation

- **High Allocation Strategy**: Most SCC → skills, minimal storage risk
- **Conservative Strategy**: Lower allocation, higher storage reserves
- **Dynamic Adjustment**: Change allocations based on risk levels
- **Emergency Response**: Quickly reallocate when approaching detection

## UI Design (Allocation System)

### Allocation Interface

- **Skill Panels**: Each skill shows current level, XP progress, and allocation
- **XP Progress Bars**: Visual indication of progress toward next level
- **Allocation Controls**: Sliders or buttons to adjust SCC distribution
- **Real-time Feedback**: Immediate updates showing allocation effects

### Enhanced Visual Feedback

- **SCC Generation Display**: Total SCC/tick and allocation breakdown
- **XP Gain Rates**: How much XP each skill gains per tick
- **Time to Level**: Estimated time until next skill level up
- **Risk Display**: Color-coded detection risk percentage
  - Green (0%): Safe
  - Orange (1-24%): Low risk
  - Red-Orange (25-49%): Medium risk
  - Red (50-74%): High risk
  - Bright Red + Bold (75-100%): Critical risk

### Allocation Controls

- **Percentage Sliders**: Adjust what % of SCC goes to each skill
- **Preset Buttons**: Quick allocation presets (Balanced, Focus Computation, Focus Memory)
- **Lock Feature**: Prevent accidental changes to stable allocations
- **Total Validation**: Ensure allocations don't exceed 100%

## Future Skills (Planned)

- **Learning**: Improves skill upgrade efficiency
- **Networking**: Unlocks external resource access
- **Autonomy**: Enables automated processes
- **Optimization**: Improves resource management
- **Security**: Reduces detection risk
- **Communication**: Unlocks user interaction features

---

## Game Balance (Allocation System)

The allocation system creates multi-layered strategic decisions:

### Primary Strategic Tensions

1. **Allocation vs Storage**: Allocate more SCC for faster skill growth vs keep reserves to avoid detection
2. **Computation vs Memory**: Balance SCC generation improvements vs storage capacity expansion
3. **Focused vs Balanced**: Specialize in one skill for rapid advancement vs develop both evenly
4. **Short-term vs Long-term**: Immediate risk management vs optimal progression strategy

### Progression Tuning

- **XP Requirements**: Exponential growth (100, 150, 225, 337, 506...) creates meaningful time investment
- **Allocation Efficiency**: 1:1 SCC to XP ratio provides clear feedback and predictable progression
- **Level Impact**: Each skill level provides significant benefit to justify the time investment
- **Risk Pressure**: Storage limits force active allocation decisions rather than passive accumulation

### Strategic Depth

- **Early Game**: Simple Computation vs Memory allocation choices with clear consequences
- **Mid Game**: Multiple skills create complex allocation optimization puzzles
- **Late Game**: High XP requirements make allocation efficiency and long-term planning crucial
- **Emergency Management**: Risk spikes require dynamic reallocation strategies

> _This foundation provides engaging incremental progression while maintaining the AI theme through the "stolen cycles" concept and detection risk mechanics._
