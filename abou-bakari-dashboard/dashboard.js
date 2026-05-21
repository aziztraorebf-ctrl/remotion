// Thiaroye V5 Dashboard — load and render scenes from scenes.json

async function loadData() {
  try {
    const response = await fetch('data/scenes.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error('Failed to load scenes.json:', err);
    document.getElementById('meta-info').textContent =
      `Erreur chargement: ${err.message}. Ouvre via un serveur local (python3 -m http.server).`;
    return null;
  }
}

function renderHeader(data) {
  document.getElementById('meta-info').textContent =
    `v${data.version} — ${data.last_updated} — ${data.style}`;

  document.getElementById('total-duration').textContent =
    `${data.total_duration_s.toFixed(1)}s`;

  const done = data.scenes.filter(s => s.status === 'done').length;
  const partial = data.scenes.filter(s => s.status === 'partial_done').length;
  const imageDone = data.scenes.filter(s => s.status === 'image_done').length;
  const clipHors = data.scenes.filter(s => s.status === 'clip_hors_controle').length;
  document.getElementById('scenes-done').textContent = done + partial + imageDone + clipHors;
  document.getElementById('scenes-total').textContent = data.scenes.length;

  const remaining = data.budget.remaining;
  const budgetEl = document.getElementById('budget-remaining');
  budgetEl.textContent = `$${remaining.toFixed(2)}`;
  if (remaining < 8) budgetEl.classList.add('budget-critical');
  else if (remaining < 15) budgetEl.classList.add('budget-warning');

  const spent = data.budget.spent_so_far;
  const initial = data.budget.initial;
  const spentPct = Math.min(100, (spent / initial) * 100);
  document.getElementById('progress-bar').style.width = `${spentPct}%`;
  document.getElementById('progress-bar').title = `$${spent.toFixed(2)} / $${initial.toFixed(2)} depense`;
}

function renderRules(data) {
  const list = document.getElementById('rules-list');
  data.rules_applied.forEach(rule => {
    const li = document.createElement('li');
    li.textContent = rule;
    list.appendChild(li);
  });
}

function createStrongLine(strongText, afterText) {
  const strong = document.createElement('strong');
  strong.textContent = strongText;
  const frag = document.createDocumentFragment();
  frag.appendChild(strong);
  if (afterText) frag.appendChild(document.createTextNode(afterText));
  return frag;
}

function statusLabel(status) {
  const labels = {
    'done': 'DONE',
    'partial_done': 'PARTIEL',
    'image_done': 'IMAGE OK',
    'clip_hors_controle': 'CLIP — A VALIDER',
    'todo': 'A FAIRE',
    'pending': 'EN ATTENTE',
    'failed': 'ECHEC',
  };
  return labels[status] || status.replace('_', ' ').toUpperCase();
}

function renderImageVersions(scene, container) {
  if (!scene.image_versions) return;
  const section = document.createElement('details');
  section.className = 'scene-section';
  const summary = document.createElement('summary');
  summary.textContent = 'Versions images disponibles';
  section.appendChild(summary);
  const ul = document.createElement('ul');
  ul.className = 'versions-list';
  for (const [key, v] of Object.entries(scene.image_versions)) {
    const li = document.createElement('li');
    const isSelected = v.status.includes('SELECTIONNEE');
    const isPending = v.status === 'a_valider';
    const isWarn = v.status.includes('non_validee');
    if (isSelected) li.className = 'version-selected';
    else if (isPending) li.className = 'version-pending';
    else if (isWarn) li.className = 'version-warn';
    const badge = isSelected ? ' [SELECTIONNEE AZIZ]' :
                  isPending ? ' [A VALIDER]' :
                  isWarn ? ' [non validee — clip HC]' : '';
    li.appendChild(createStrongLine(`${key}`, `: ${v.file}${badge}`));
    ul.appendChild(li);
  }
  section.appendChild(ul);
  container.appendChild(section);
}

function renderClipWarning(scene, container) {
  if (!scene.clip_warning) return;
  const warn = document.createElement('div');
  warn.className = 'clip-warning';
  const label = document.createElement('strong');
  label.textContent = 'Clip hors controle : ';
  warn.appendChild(label);
  warn.appendChild(document.createTextNode(scene.clip_warning));
  container.appendChild(warn);
}

function renderScene(scene, template) {
  const clone = template.content.cloneNode(true);
  const article = clone.querySelector('.scene');

  article.dataset.sceneId = scene.id;
  article.dataset.status = scene.status;

  clone.querySelector('.scene-id').textContent = scene.id.toUpperCase();
  clone.querySelector('.scene-status-badge').textContent = statusLabel(scene.status);
  clone.querySelector('.scene-title').textContent = scene.title;

  const timing = `${scene.start_s.toFixed(1)}s -- ${scene.end_s.toFixed(1)}s (${scene.duration_s.toFixed(1)}s)`;
  clone.querySelector('.scene-timing').textContent = timing;
  clone.querySelector('.scene-type').textContent = scene.type;
  clone.querySelector('.scene-narration').textContent = scene.narration;

  const desc = scene.image_description || scene.note || '';
  clone.querySelector('.scene-description').textContent = desc || 'Aucune description';

  clone.querySelector('.scene-prompt-gemini').textContent =
    scene.prompt_gemini_template || scene.prompt_gemini || 'A definir';
  clone.querySelector('.scene-prompt-seedance').textContent =
    scene.prompt_seedance_template || scene.prompt_seedance || 'A definir';

  // Camera options
  const cameraOptionsList = clone.querySelector('.scene-camera-options');
  if (scene.camera_movement_options) {
    const choice = scene.camera_movement_choice;
    for (const [level, description] of Object.entries(scene.camera_movement_options)) {
      const li = document.createElement('li');
      li.dataset.camera = level;
      const badge = level === choice ? ' [CHOIX]' : '';
      li.appendChild(createStrongLine(`${level}${badge}`, `: ${description}`));
      cameraOptionsList.appendChild(li);
    }
  } else if (scene.camera_movement) {
    const li = document.createElement('li');
    li.appendChild(createStrongLine(scene.camera_movement_choice || 'DEFAULT', `: ${scene.camera_movement}`));
    cameraOptionsList.appendChild(li);
  }

  // Intrinsic motions
  const motionsList = clone.querySelector('.scene-intrinsic-motions');
  (scene.intrinsic_motions || []).forEach(motion => {
    const li = document.createElement('li');
    li.textContent = motion;
    motionsList.appendChild(li);
  });

  // Assets
  const imageSlot = clone.querySelector('[data-asset="image"] .asset-status');
  if (scene.image_source) {
    imageSlot.textContent = scene.image_source.split('/').pop();
    imageSlot.classList.add('available');
  } else {
    imageSlot.textContent = 'A generer';
    imageSlot.classList.add('missing');
  }

  const clipSlot = clone.querySelector('[data-asset="clip"] .asset-status');
  if (scene.clip_final) {
    const clipName = scene.clip_final.split('/').pop();
    const durInfo = scene.clip_duration_s ? ` (${scene.clip_duration_s.toFixed(1)}s)` : '';
    const warnTag = scene.clip_status === 'HORS_CONTROLE_A_VALIDER' ? ' [HC]' : '';
    clipSlot.textContent = clipName + durInfo + warnTag;
    clipSlot.classList.add(scene.clip_status === 'HORS_CONTROLE_A_VALIDER' ? 'hors-controle' : 'available');
  } else {
    clipSlot.textContent = 'A generer';
    clipSlot.classList.add('missing');
  }

  // Cost
  clone.querySelector('.scene-cost-est').textContent =
    `$${(scene.cost_estimated || 0).toFixed(2)}`;
  if (scene.cost_actual !== undefined && scene.cost_actual > 0) {
    clone.querySelector('.scene-cost-actual').style.display = 'inline';
    clone.querySelector('.scene-cost-value').textContent = `$${scene.cost_actual.toFixed(2)}`;
  }

  // Notes
  if (scene.notes) {
    clone.querySelector('.scene-notes-text').textContent = scene.notes;
  } else {
    clone.querySelector('.scene-notes').style.display = 'none';
  }

  // History
  if (scene.history && scene.history.length > 0) {
    const historySection = clone.querySelector('.scene-history');
    historySection.style.display = 'block';
    const historyList = clone.querySelector('.scene-history-list');
    scene.history.forEach(entry => {
      const li = document.createElement('li');
      li.appendChild(createStrongLine(entry.version, ` ($${entry.cost.toFixed(2)}) — ${entry.result}`));
      historyList.appendChild(li);
    });
  }

  // Insert image versions + clip warning after assets block
  const assetsBlock = clone.querySelector('.scene-assets');
  const afterAssets = document.createDocumentFragment();
  renderImageVersions(scene, afterAssets);
  renderClipWarning(scene, afterAssets);
  assetsBlock.after(afterAssets);

  return clone;
}

async function init() {
  const data = await loadData();
  if (!data) return;
  renderHeader(data);
  renderRules(data);

  const template = document.getElementById('scene-template');
  const container = document.getElementById('scenes-container');
  data.scenes.forEach(scene => {
    container.appendChild(renderScene(scene, template));
  });
}

init();
