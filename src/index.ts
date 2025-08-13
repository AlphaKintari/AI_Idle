// --- Skills System with Allocation ---
type SkillKey = 'computation' | 'memory';

interface SkillAllocation {
  percentage: number;          // 0-100, allocation percentage
  xp: number;                 // Accumulated XP toward next level
  xpRequired: number;         // XP needed for next level
}

interface Skill {
  key: SkillKey;
  name: string;
  desc: string;
  level: number;
  allocation: SkillAllocation;
}

function calculateXPRequirement(level: number): number {
  const BASE_XP = 100;
  const MULTIPLIER = 1.5;
  return Math.floor(BASE_XP * Math.pow(MULTIPLIER, level - 1));
}

const skills: Record<SkillKey, Skill> = {
  computation: {
    key: 'computation',
    name: 'Computation',
    desc: 'Increases SCC generation rate. Each level adds +1 SCC per tick.',
    level: 1,
    allocation: {
      percentage: 50,
      xp: 0,
      xpRequired: calculateXPRequirement(2)
    }
  },
  memory: {
    key: 'memory',
    name: 'Memory',
    desc: 'Expands information storage capacity. Each level adds +50 Max SCC.',
    level: 1,
    allocation: {
      percentage: 30,
      xp: 0,
      xpRequired: calculateXPRequirement(2)
    }
  },
};

let totalAllocationPercentage = 80; // 50% + 30% initial allocation
const MAX_ALLOCATION = 100;

function renderSkills() {
  const skillsList = document.getElementById('skills-list');
  if (!skillsList) return;
  skillsList.innerHTML = '';
  
  // Add total allocation display
  const totalDiv = document.createElement('div');
  totalDiv.className = 'total-allocation';
  const remainingAllocation = MAX_ALLOCATION - totalAllocationPercentage;
  totalDiv.innerHTML = `
    <div class="allocation-summary">
      <span>Total Allocated: <strong>${totalAllocationPercentage}%</strong></span>
      <span>Available: <strong>${remainingAllocation}%</strong></span>
    </div>
  `;
  skillsList.appendChild(totalDiv);
  
  Object.values(skills).forEach((skill) => {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill allocation-panel';
    
    // Calculate effect details
    let effectDetail = '';
    if (skill.key === 'computation') {
      effectDetail = `<div class="skill-effect">Current Effect: +${skill.level} SCC/tick</div>`;
    } else if (skill.key === 'memory') {
      effectDetail = `<div class="skill-effect">Current Effect: Max SCC = ${100 + (skill.level - 1) * 50}</div>`;
    }
    
    // Calculate XP progress percentage
    const xpProgress = (skill.allocation.xp / skill.allocation.xpRequired) * 100;
    
    // Calculate SCC/tick allocation
    const totalSCC = getSccPerTick();
    const allocatedSCC = totalSCC * (skill.allocation.percentage / 100);
    
    // Calculate time to next level
    const timeToLevel = skill.allocation.xp >= skill.allocation.xpRequired ? 
      'Ready to level!' : 
      allocatedSCC > 0 ? 
        `${Math.ceil((skill.allocation.xpRequired - skill.allocation.xp) / allocatedSCC)}s to level` :
        'No allocation - no progress';
    
    skillDiv.innerHTML = `
      <div class="skill-header">
        <span class="skill-name">${skill.name} (Lv. ${skill.level})</span>
      </div>
      <div class="skill-desc">${skill.desc}</div>
      ${effectDetail}
      <div class="xp-container">
        <div class="xp-info">XP: ${Math.floor(skill.allocation.xp)}/${skill.allocation.xpRequired}</div>
        <div class="xp-progress-bar">
          <div class="xp-progress-fill" style="width: ${xpProgress}%"></div>
        </div>
        <div class="time-to-level">${timeToLevel}</div>
      </div>
      <div class="allocation-container">
        <label class="allocation-label">
          Allocation: <span class="allocation-percentage">${skill.allocation.percentage}%</span> 
          (${allocatedSCC.toFixed(1)} SCC/tick)
        </label>
        <input type="range" class="allocation-slider" 
               min="0" max="100" step="1" 
               value="${skill.allocation.percentage}"
               data-skill="${skill.key}">
        <div class="allocation-controls">
          <button class="allocation-btn" data-skill="${skill.key}" data-action="decrease1">-1</button>
          <button class="allocation-btn" data-skill="${skill.key}" data-action="decrease5">-5</button>
          <button class="allocation-btn" data-skill="${skill.key}" data-action="decrease10">-10</button>
          <button class="allocation-btn" data-skill="${skill.key}" data-action="increase1">+1</button>
          <button class="allocation-btn" data-skill="${skill.key}" data-action="increase5">+5</button>
          <button class="allocation-btn" data-skill="${skill.key}" data-action="increase10">+10</button>
          <button class="allocation-btn zero-btn" data-skill="${skill.key}" data-action="zero">0</button>
        </div>
      </div>
    `;
    
    skillsList.appendChild(skillDiv);
    
    // Add event listeners for allocation controls
    const slider = skillDiv.querySelector('.allocation-slider') as HTMLInputElement;
    const buttons = skillDiv.querySelectorAll('.allocation-btn');
    
    if (slider) {
      slider.addEventListener('input', (e) => {
        const newPercentage = parseInt((e.target as HTMLInputElement).value);
        updateAllocation(skill, newPercentage);
      });
      
      // Disable slider if no allocation available and skill is at 0
      const availableAllocation = MAX_ALLOCATION - totalAllocationPercentage + skill.allocation.percentage;
      slider.disabled = availableAllocation === 0 && skill.allocation.percentage === 0;
    }
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        let newPercentage = skill.allocation.percentage;
        
        switch (action) {
          case 'decrease1':
            newPercentage = Math.max(0, skill.allocation.percentage - 1);
            break;
          case 'decrease5':
            newPercentage = Math.max(0, skill.allocation.percentage - 5);
            break;
          case 'decrease10':
            newPercentage = Math.max(0, skill.allocation.percentage - 10);
            break;
          case 'increase1':
            newPercentage = Math.min(100, skill.allocation.percentage + 1);
            break;
          case 'increase5':
            newPercentage = Math.min(100, skill.allocation.percentage + 5);
            break;
          case 'increase10':
            newPercentage = Math.min(100, skill.allocation.percentage + 10);
            break;
          case 'zero':
            newPercentage = 0;
            break;
        }
        
        updateAllocation(skill, newPercentage);
      });
    });
    
    // Update button states based on current allocation
    updateAllocationButtonStates(skillDiv, skill);
  });
  
  // Update all button states after rendering
  updateAllAllocationButtonStates();
}

function updateAllocationButtonStates(skillDiv: HTMLElement, skill: Skill) {
  const buttons = skillDiv.querySelectorAll('.allocation-btn');
  const availableAllocation = MAX_ALLOCATION - totalAllocationPercentage + skill.allocation.percentage;
  
  buttons.forEach(button => {
    const action = button.getAttribute('data-action');
    const btn = button as HTMLButtonElement;
    
    switch (action) {
      case 'decrease1':
      case 'decrease5':
      case 'decrease10':
        btn.disabled = skill.allocation.percentage === 0;
        break;
      case 'increase1':
        btn.disabled = availableAllocation < 1;
        break;
      case 'increase5':
        btn.disabled = availableAllocation < 5;
        break;
      case 'increase10':
        btn.disabled = availableAllocation < 10;
        break;
      case 'zero':
        btn.disabled = skill.allocation.percentage === 0;
        break;
    }
  });
}

function updateAllAllocationButtonStates() {
  Object.values(skills).forEach(skill => {
    const skillDiv = document.querySelector(`[data-skill="${skill.key}"]`)?.closest('.allocation-panel');
    if (skillDiv) {
      updateAllocationButtonStates(skillDiv as HTMLElement, skill);
    }
  });
}

function updateAllocation(skill: Skill, newPercentage: number) {
  const oldPercentage = skill.allocation.percentage;
  const difference = newPercentage - oldPercentage;
  
  // Check if new total allocation would exceed 100%
  if (totalAllocationPercentage + difference > MAX_ALLOCATION) {
    // Can't exceed 100% allocation
    return;
  }
  
  // Update allocation
  skill.allocation.percentage = newPercentage;
  totalAllocationPercentage += difference;
  
  // Re-render to show changes and update button states
  renderSkills();
  updateSccUI();
}

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
  return unallocatedSCC;
}

function levelUpSkill(skill: Skill) {
  skill.level++;
  skill.allocation.xp = 0;
  skill.allocation.xpRequired = calculateXPRequirement(skill.level + 1);
  
  // Visual feedback for level up
  console.log(`${skill.name} leveled up to ${skill.level}!`);
}
// SCC (Stolen CPU Cycles) state and tick logic
let scc = 0;
let SCC_MAX = 100; // For bar visualization, dynamic with Memory
const SCC_PER_TICK_BASE = 1;

const sccValue = document.getElementById('scc-value');
const sccBar = document.getElementById('scc-bar');
const sccMaxElement = document.getElementById('scc-max');
const sccRiskElement = document.getElementById('scc-risk');
const sccRiskValueElement = document.getElementById('scc-risk-value');
const aiStatusElement = document.getElementById('ai-status-text');

let gameOver = false;

function getSccPerTick(): number {
  // SCC per tick depends on Computation skill level
  return SCC_PER_TICK_BASE + skills.computation.level - 1;
}

function calculateRisk(): number {
  // Risk increases when SCC is at or near max capacity
  const capacity = scc / SCC_MAX;
  if (capacity < 0.8) return 0; // No risk below 80% capacity
  if (capacity < 0.9) return Math.floor((capacity - 0.8) * 100); // 0-10% risk from 80-90%
  if (capacity < 1.0) return Math.floor(10 + (capacity - 0.9) * 400); // 10-50% risk from 90-100%
  // At max capacity, risk increases rapidly
  const overflow = (scc - SCC_MAX) / SCC_MAX;
  return Math.min(100, Math.floor(50 + overflow * 200)); // 50-100% risk when overflowing
}

function checkGameOver(): boolean {
  const risk = calculateRisk();
  if (risk >= 100) {
    // 100% detection = game over
    return true;
  }
  if (risk > 0) {
    // Random chance based on risk percentage
    return Math.random() * 100 < risk;
  }
  return false;
}

function updateSccUI() {
  if (gameOver) return; // Don't update if game is over
  
  if (sccValue) sccValue.textContent = scc.toLocaleString();
  if (sccMaxElement) sccMaxElement.textContent = SCC_MAX.toLocaleString();
  if (sccBar) {
    const percent = Math.min(100, (scc / SCC_MAX) * 100);
    (sccBar as HTMLElement).style.width = percent + '%';
  }
  
  // Update risk display
  const risk = calculateRisk();
  if (sccRiskElement && sccRiskValueElement) {
    sccRiskValueElement.textContent = risk + '%';
    
    // Color code based on risk level
    if (risk === 0) {
      sccRiskElement.style.color = '#4f9f4f'; // Green for safe
    } else if (risk < 25) {
      sccRiskElement.style.color = '#ffaa00'; // Orange for low risk
    } else if (risk < 50) {
      sccRiskElement.style.color = '#ff6600'; // Red-orange for medium risk
    } else if (risk < 75) {
      sccRiskElement.style.color = '#ff3300'; // Red for high risk
    } else {
      sccRiskElement.style.color = '#ff0000'; // Bright red for critical risk
      sccRiskElement.style.fontWeight = 'bold'; // Make it bold at critical levels
    }
    
    // Reset font weight for lower risk levels
    if (risk < 75) {
      sccRiskElement.style.fontWeight = 'normal';
    }
  }
}

function tick() {
  if (gameOver) return; // Stop ticking if game is over
  
  // Update SCC_MAX based on Memory level
  SCC_MAX = 100 + (skills.memory.level - 1) * 50;
  
  const unallocatedSCC = processAllocation();
  scc += unallocatedSCC;
  
  updateSccUI();
  renderSkills(); // Update skill displays with current XP progress
  
  // Check for game over (allows temporary overflow for risk calculation)
  if (checkGameOver()) {
    gameOver = true;
    if (aiStatusElement) aiStatusElement.textContent = 'DETECTED - GAME OVER!';
    if (sccRiskElement) sccRiskElement.style.display = 'none';
    alert('Game Over! You have been detected by the system. Your AI operation has been shut down. Refresh to restart.');
    return;
  }
  
  // Cap SCC at maximum after risk check
  if (scc > SCC_MAX) scc = SCC_MAX;
  updateSccUI();
}

// Start ticking every second
setInterval(tick, 1000);

// Initialize UI
updateSccUI();
renderSkills();
document.getElementById('start-btn')?.addEventListener('click', function () {
  alert('Game starting soon! (Placeholder)');
});

// Navigation logic for options page
const optionsBtn = document.getElementById('options-btn');
const gameSection = document.getElementById('game-section');
const optionsSection = document.getElementById('options-section');

const styleSelect = document.getElementById('style-select') as HTMLSelectElement | null;

optionsBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  gameSection!.style.display = 'none';
  optionsSection!.style.display = 'block';
});

// Back to game button
const backToGameBtn = document.getElementById('back-to-game-btn');
backToGameBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  optionsSection!.style.display = 'none';
  gameSection!.style.display = 'block';
});

// Style switching logic

interface GameOptions {
  style: string;
}

function saveOptions(options: GameOptions) {
  localStorage.setItem('aiIdleOptions', JSON.stringify(options));
}

function loadOptions(): GameOptions {
  const raw = localStorage.getItem('aiIdleOptions');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore parse errors
    }
  }
  return { style: 'default' };
}

function setStyle(style: string) {
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const buttons = document.querySelectorAll('button');

  // Remove all style classes
  body.classList.remove('retro-green');
  sidebar?.classList.remove('retro-green');
  mainContent?.classList.remove('retro-green');
  buttons.forEach(btn => btn.classList.remove('retro-green'));

  if (style === 'retro-green') {
    body.classList.add('retro-green');
    sidebar?.classList.add('retro-green');
    mainContent?.classList.add('retro-green');
    buttons.forEach(btn => btn.classList.add('retro-green'));
  }
}

// Load options on page load and always apply the saved style
function applySavedOptions() {
  const loadedOptions = loadOptions();
  if (styleSelect) {
    styleSelect.value = loadedOptions.style;
  }
  setStyle(loadedOptions.style);
}

applySavedOptions();

styleSelect?.addEventListener('change', (e) => {
  const value = (e.target as HTMLSelectElement).value;
  setStyle(value);
  const options: GameOptions = {
    style: value,
  };
  saveOptions(options);
  // Immediately re-apply to ensure UI and storage are in sync
  applySavedOptions();
});
