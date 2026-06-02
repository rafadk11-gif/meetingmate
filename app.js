let openItems = [];
let pendingUnresolved = '';

// Update the clock
function tick() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('mm-clock').textContent = h + ':' + m;
  document.getElementById('mm-day').textContent = now.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}
tick(); 
setInterval(tick, 30000);

// Tab switching
function switchTab(tab, el) {
  document.querySelectorAll('.mm-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.mm-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
}

// Attendee management
function addAttendee() {
  const list = document.getElementById('attendee-list');
  const row = document.createElement('div');
  row.className = 'mm-attendee-row';
  row.innerHTML = '<i class="ti ti-user-circle pin"></i><input type="text" placeholder="Name and role" />';
  list.appendChild(row);
}

function getAttendees() {
  return Array.from(document.querySelectorAll('#attendee-list input'))
    .map(i => i.value.trim()).filter(Boolean).join(', ');
}

// Error handling
function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}

function clearErr(id) {
  document.getElementById(id).classList.remove('show');
}

// Copy to clipboard
function copyText(id) {
  const txt = document.getElementById(id).textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt);
  }
}

// Call Claude API through the Vercel serverless function
async function callClaude(prompt) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'API error ' + res.status);
  }
  
  const data = await res.json();
  return data.response;
}

// Generate agenda
async function generateAgenda() {
  const projName = document.getElementById('proj-name').value.trim();
  const meetingType = document.getElementById('meeting-type').value;
  const duration = document.getElementById('duration').value.trim() || '60';
  const date = document.getElementById('meeting-date').value.trim();
  const topics = document.getElementById('topics').value.trim();
  const attendees = getAttendees();
  const openIn = document.getElementById('open-in').value.trim();

  if (!projName || !topics) { 
    showErr('agenda-err', 'Please fill in the project name and key topics.'); 
    return; 
  }
  clearErr('agenda-err');

  const btn = document.getElementById('agenda-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="mm-spinner"></span> Generating...';

  const prompt = `You are MeetingMate, an AI meeting facilitator for project managers. Generate a professional, structured meeting agenda.

Project: ${projName}
Meeting type: ${meetingType}
Duration: ${duration} minutes
Date: ${date || 'TBD'}
Attendees: ${attendees || 'Not specified'}
Key topics: ${topics}
${openIn ? 'Open items to address: ' + openIn : ''}

Format the agenda clearly with:
1. A header section (meeting title, date, attendees, duration)
2. Numbered agenda items with time allocations in minutes and a brief description
3. A standing "wrap-up / next steps" item at the end
4. Any open items from prior meetings incorporated naturally

Keep it practical and concise. Use plain text formatting only.`;

  try {
    const result = await callClaude(prompt);
    document.getElementById('agenda-output').textContent = result;
    document.getElementById('agenda-result').style.display = 'block';
  } catch(e) { 
    showErr('agenda-err', 'Error: ' + e.message); 
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-sparkles"></i> Generate agenda';
}

// Generate summary
async function generateSummary() {
  const transcript = document.getElementById('transcript').value.trim();
  const context = document.getElementById('sum-context').value.trim();

  if (!transcript) { 
    showErr('summary-err', 'Please paste a transcript or meeting notes.'); 
    return; 
  }
  clearErr('summary-err');

  const btn = document.getElementById('summary-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="mm-spinner"></span> Analyzing...';

  const prompt = `You are MeetingMate. Analyze this meeting transcript and extract structured information.
${context ? 'Meeting context: ' + context : ''}

Transcript:
${transcript}

Respond with EXACTLY this format — two sections separated by "|||":

SECTION 1 — DECISIONS MADE:
List each confirmed decision as a bullet point. Format: "• [Decision description]"
If none, write "• No decisions recorded."

|||

SECTION 2 — ACTION ITEMS:
List each action item. Format: "• [Owner] — [Task description] — Due: [deadline or TBD]"
After all action items, on a new line write:
UNRESOLVED: [comma-separated list of any open questions or items not resolved, or write "None"]`;

  try {
    const result = await callClaude(prompt);
    const parts = result.split('|||');
    const decisions = (parts[0] || '').replace('SECTION 1 — DECISIONS MADE:','').trim();
    const actionsRaw = (parts[1] || '').replace('SECTION 2 — ACTION ITEMS:','').trim();
    const unresolvedMatch = actionsRaw.match(/UNRESOLVED:\s*(.+)/i);
    const unresolved = unresolvedMatch ? unresolvedMatch[1].trim() : '';
    const actionsClean = actionsRaw.replace(/UNRESOLVED:.*/is, '').trim();
    
    document.getElementById('decisions-output').textContent = decisions;
    document.getElementById('actions-output').textContent = actionsClean;
    pendingUnresolved = unresolved;
    document.getElementById('summary-result').style.display = 'block';
    document.getElementById('oi-sent-msg').textContent = '';
  } catch(e) { 
    showErr('summary-err', 'Error: ' + e.message); 
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-sparkles"></i> Generate summary';
}

// Add unresolved items to open items register
function addToOpenItems() {
  if (!pendingUnresolved || pendingUnresolved.toLowerCase() === 'none') {
    document.getElementById('oi-sent-msg').textContent = 'No unresolved items to carry forward.';
    return;
  }
  const items = pendingUnresolved.split(',').map(s => s.trim()).filter(Boolean);
  items.forEach(item => openItems.push({ 
    text: item, 
    owner: 'TBD', 
    source: 'Auto from summary', 
    id: Date.now() + Math.random() 
  }));
  renderOpenItems();
  document.getElementById('oi-sent-msg').textContent = items.length + ' item(s) added to the register.';
  pendingUnresolved = '';
}

// Add manual open item
function addManualItem() {
  const text = document.getElementById('manual-item').value.trim();
  const owner = document.getElementById('manual-owner').value.trim() || 'TBD';
  if (!text) return;
  openItems.push({ text, owner, source: 'Manual', id: Date.now() });
  document.getElementById('manual-item').value = '';
  document.getElementById('manual-owner').value = '';
  renderOpenItems();
}

// Resolve an open item
function resolveItem(id) {
  openItems = openItems.filter(i => i.id !== id);
  renderOpenItems();
}

// Render open items list
function renderOpenItems() {
  const list = document.getElementById('open-items-list');
  document.getElementById('oi-count').textContent = openItems.length;
  
  if (!openItems.length) {
    list.innerHTML = '<div class="mm-empty"><i class="ti ti-circle-check"></i>No open items. All clear!</div>';
    return;
  }
  
  list.innerHTML = openItems.map(item => `
    <div class="mm-openitem">
      <i class="ti ti-flag" style="font-size:16px; color:#BA7517; margin-top:2px; flex-shrink:0;"></i>
      <div class="mm-openitem-text">
        <div>${item.text}</div>
        <div class="mm-openitem-meta"><i class="ti ti-user" style="font-size:12px; vertical-align:-1px;"></i> ${item.owner} &nbsp;·&nbsp; ${item.source}</div>
      </div>
      <button class="mm-resolve-btn" onclick="resolveItem(${item.id})"><i class="ti ti-check"></i> Resolve</button>
    </div>`).join('');
}

// Initialize on page load
renderOpenItems();
