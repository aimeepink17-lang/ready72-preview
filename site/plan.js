(() => {
  const root = document.getElementById('planChecklist');
  if (!root) return;
  const groups = [
    ['Water & food', ['Keep drinking water: 2–3 litres per person per day where possible.','Keep non-perishable food to support your household for at least 72 hours, and rotate it before expiry.','Consider dietary needs, children, pets and ready-to-feed formula if used.','Use fresh and refrigerated food first if power is interrupted.']],
    ['Light, warmth & utilities', ['Keep a torch or lamp and spare batteries.','Have blankets, sleeping bags or emergency thermal blankets.','Know where electricity, water and gas shut-off points are.','Keep your MPRN and GPRN details somewhere accessible.','Know that gas must only be turned back on by a qualified engineer.']],
    ['Health & hygiene', ['Keep regular prescriptions up to date where possible.','Keep copies of prescriptions and a list of medical conditions.','Have a first aid kit and household hygiene supplies.']],
    ['Information & contacts', ['Keep a battery, wind-up or solar radio and spare batteries; a car radio can be a backup.','Keep a charged phone, charger and power bank ready.','Write down your Eircode and key emergency, family and service contacts.','Make a household plan that is available if phones or internet fail.']],
    ['Documents & getting out', ['Store key documents in a sealed waterproof file.','Keep local maps in case GPS is unavailable and spare keys somewhere accessible.','Consider a small, affordable cash reserve and an offline payment option for essential purchases if electronic payments are temporarily unavailable.','Know what you would take if leaving: medication, hygiene items, warm/waterproof clothes, phone, ID and cards/cash.']],
    ['People & animals', ['Plan how to keep animals safe and what supplies they need.','Agree a check-in plan with family, friends or neighbours.','Keep local community support contacts and check on others when safe.','If in supported or temporary accommodation, ask your service provider about its emergency arrangements.']]
  ];
  const totalItems = groups.reduce((sum, group) => sum + group[1].length, 0);
  const readSaved = () => { try { return JSON.parse(localStorage.getItem('ready72Plan') || '[]').filter(Number.isInteger); } catch { return []; } };
  function update() {
    const checked = [...root.querySelectorAll('input:checked')].map(input => Number(input.dataset.item));
    try { localStorage.setItem('ready72Plan', JSON.stringify(checked)); } catch {}
    document.getElementById('planComplete').textContent = String(checked.length);
    document.getElementById('planTotal').textContent = String(totalItems);
    document.getElementById('planBar').style.width = `${checked.length / totalItems * 100}%`;
    document.getElementById('progressMessage').textContent = checked.length === 0 ? 'Start with one thing you already have. Some preparation is better than none.' : checked.length === totalItems ? 'You have worked through the checklist. Review it from time to time.' : `${totalItems - checked.length} items left. Take them at your own pace.`;
  }
  let index = 0; const saved = readSaved();
  for (const [title, items] of groups) {
    const section = document.createElement('section'); section.className = 'plan-group';
    const heading = document.createElement('h3'); const dot = document.createElement('i'); dot.className = 'group-dot'; heading.append(dot, document.createTextNode(title)); section.append(heading);
    for (const text of items) {
      const label = document.createElement('label'); label.className = 'check-row';
      const input = document.createElement('input'); input.type = 'checkbox'; input.dataset.item = String(index); input.setAttribute('aria-label', text); input.checked = saved.includes(index); input.addEventListener('change', update);
      const span = document.createElement('span'); span.textContent = text; label.append(input, span); section.append(label); index++;
    }
    root.append(section);
  }
  document.getElementById('printHouseholdPlan').addEventListener('click', () => { document.body.classList.add('print-household-plan'); window.print(); });
  window.addEventListener('afterprint', () => document.body.classList.remove('print-household-plan'));
  document.getElementById('clearHouseholdPlan').addEventListener('click', () => { if (!window.confirm('Clear saved checklist progress in this browser?')) return; root.querySelectorAll('input:checked').forEach(input => { input.checked = false; }); update(); });
  update();
})();
