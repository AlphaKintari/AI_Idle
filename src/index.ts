// --- Skills System ---
type SkillKey = 'computation' | 'memory';
interface Skill {
  key: SkillKey;
  name: string;
  desc: string;
  level: number;
  baseCost: number;
}

const skills: Record<SkillKey, Skill> = {
  computation: {
    key: 'computation',
    name: 'Computation',
    desc: 'Increases SCC generation rate. Each level adds +1 SCC per tick.',
    level: 1,
    baseCost: 10,
  },
  memory: {
    key: 'memory',
    name: 'Memory',
    desc: 'Expands information storage. (Future: increases Max SCC and unlocks advanced skills.)',
    level: 1,
    baseCost: 10,
  },
};

function getSkillCost(skill: Skill): number {
  // Example: cost doubles each level
  return skill.baseCost * Math.pow(2, skill.level - 1);
}

function renderSkills() {
  const skillsList = document.getElementById('skills-list');
  if (!skillsList) return;
  skillsList.innerHTML = '';
    Object.values(skills).forEach((skill) => {
      const skillDiv = document.createElement('div');
      skillDiv.className = 'skill';
      let effectDetail = '';
      if (skill.key === 'computation') {
        effectDetail = `<div class="skill-effect">Current Effect: +${skill.level} SCC/tick</div>`;
      } else if (skill.key === 'memory') {
        effectDetail = `<div class="skill-effect">Current Effect: Max SCC = ${100 + (skill.level - 1) * 50}</div>`;
      }
      skillDiv.innerHTML = `
        <div class="skill-header">
          <span class="skill-name">${skill.name} (Lv. ${skill.level})</span>
        </div>
        <div class="skill-desc">${skill.desc}</div>
        ${effectDetail}
        <div class="skill-upgrade-btn-container">
          <button class="upgrade-btn" data-skill="${skill.key}">Upgrade (${getSkillCost(skill)})</button>
        </div>
      `;
      skillsList.appendChild(skillDiv);
      
      // Add event listener for upgrade button
      const upgradeBtn = skillDiv.querySelector('.upgrade-btn') as HTMLButtonElement;
      if (upgradeBtn) {
        upgradeBtn.disabled = scc < getSkillCost(skill);
        upgradeBtn.onclick = () => {
          if (scc >= getSkillCost(skill)) {
            scc -= getSkillCost(skill);
            skill.level++;
            updateSccUI();
            renderSkills();
          }
        };
      }
    });
}

function updateSkillButtonStates() {
  Object.values(skills).forEach((skill) => {
    const upgradeBtn = document.querySelector(`[data-skill="${skill.key}"]`) as HTMLButtonElement;
    if (upgradeBtn) {
      upgradeBtn.disabled = scc < getSkillCost(skill);
    }
  });
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
  
  updateSkillButtonStates();
}

function tick() {
  if (gameOver) return; // Stop ticking if game is over
  
  // Update SCC_MAX based on Memory level
  SCC_MAX = 100 + (skills.memory.level - 1) * 50;
  scc += getSccPerTick();
  
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
