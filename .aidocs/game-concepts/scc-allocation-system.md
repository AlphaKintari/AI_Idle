# SCC Allocation System

This document describes the proposed SCC allocation system for skill progression, replacing the current instant purchase model.

## Core Concept

Instead of spending SCC to instantly purchase skill levels, players **allocate** portions of their SCC income stream to different skills. Allocated SCC generates XP toward that skill over time, and skills level up when they reach XP thresholds.

## Allocation Mechanics

### SCC Income Distribution

- **Total SCC Generation**: Base + Computation bonuses (current: 1 + Computation level)
- **Allocation Percentages**: Player sets what % of SCC income goes to each skill
- **Remaining SCC**: Unallocated SCC accumulates in storage (subject to Max SCC limits)

### Example Allocation

If generating 5 SCC/tick with these allocations:

- **Computation**: 40% = 2 SCC/tick → Computation XP
- **Memory**: 30% = 1.5 SCC/tick → Memory XP  
- **Learning**: 20% = 1 SCC/tick → Learning XP
- **Unallocated**: 10% = 0.5 SCC/tick → Storage

## XP and Leveling System

### XP Accumulation

```text
XP gained per tick = (SCC allocation per tick) * (XP conversion rate)
```

**Example XP Conversion Rate**: 1 SCC = 1 XP (can be adjusted for balance)

### Level Requirements

**Progressive XP Requirements** (exponential growth):

```text
XP required for level N = base_xp * multiplier^(N-1)
```

**Example Progression** (base_xp=100, multiplier=1.5):

- Level 1 → 2: 100 XP
- Level 2 → 3: 150 XP  
- Level 3 → 4: 225 XP
- Level 4 → 5: 337 XP
- Level 5 → 6: 506 XP

### Skill Leveling

When accumulated XP reaches the requirement:

1. Skill levels up automatically
2. XP counter resets to 0
3. Next level requirement calculated
4. Skill effects immediately apply

## Strategic Benefits

### Resource Management

- **Long-term Planning**: Players must balance immediate SCC storage vs future skill growth
- **Opportunity Cost**: Allocating to one skill means less for others
- **Risk vs Reward**: More allocation = faster progression but less SCC reserves

### Progression Tuning

- **XP Requirements**: Easy to adjust level progression speed
- **Conversion Rates**: Can modify how efficiently SCC converts to XP
- **Skill-Specific Rates**: Different skills could have different XP conversion rates

### Dynamic Gameplay

- **Reallocation**: Players can adjust allocations as priorities change
- **Multi-skill Development**: Encourages balanced progression
- **Continuous Progress**: Always making progress toward goals

## UI Implementation

### Allocation Interface

```text
[Skill Name] [Level X] [XP: 150/225]
Allocation: [====    ] 40% (2.0 SCC/tick)
[Decrease] [Increase] [Max] [Zero]
```

### Real-time Feedback

- **XP Bars**: Visual progress toward next level
- **SCC/tick Display**: Shows current allocation rate
- **Time to Level**: Estimated time until next level up
- **Efficiency Metrics**: XP per SCC invested

### Allocation Controls

- **Percentage Sliders**: Adjust allocation percentages
- **Preset Buttons**: Quick allocation presets (Balanced, Focus, etc.)
- **Lock Feature**: Prevent accidental changes to allocations

## Risk System Integration

### Storage Pressure

- **Unallocated SCC**: Still subject to Max SCC and detection risk
- **Allocation Strategy**: Higher allocation % = lower storage risk
- **Emergency Reallocation**: Quickly increase allocations when nearing cap

### Balanced Progression

- **Memory Priority**: Must allocate to Memory to increase storage capacity
- **Computation Priority**: Must allocate to Computation for more SCC generation
- **Strategic Timing**: When to focus on which skills

## Implementation Phases

### Phase 1: Basic Allocation

- Replace current purchase system
- Simple percentage-based allocation
- Linear XP requirements for initial balancing

### Phase 2: Advanced Features

- Skill-specific XP conversion rates
- Allocation presets and automation
- More sophisticated level requirements

### Phase 3: Deep Strategy

- Allocation efficiency bonuses
- Skill synergies affecting XP rates
- Dynamic requirements based on game state

## Balance Considerations

### Early Game

- **Low Allocation Options**: Limited skills to allocate to
- **Simple Decisions**: Focus on Computation vs Memory
- **Fast Progression**: Lower XP requirements for initial levels

### Mid Game

- **Multiple Skills**: More allocation choices create complexity
- **Resource Tension**: Need to balance storage vs progression
- **Strategic Depth**: Optimization becomes important

### Late Game

- **High XP Requirements**: Levels take significant time investment
- **Fine-tuning**: Small allocation adjustments matter
- **Long-term Planning**: Multi-level progression strategies

## Advantages Over Purchase System

1. **Smoother Progression**: Continuous advancement vs discrete jumps
2. **Strategic Depth**: Resource allocation decisions vs simple accumulation
3. **Tunable Balance**: Easy to adjust progression rates
4. **Player Agency**: More meaningful choices in character development
5. **Engagement**: Constant progress feedback keeps players invested

---

> _This system transforms the game from "accumulate and spend" to "allocate and optimize", creating deeper strategic gameplay while maintaining the incremental progression core._
