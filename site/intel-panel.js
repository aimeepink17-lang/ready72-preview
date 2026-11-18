(() => {
  const dialog = document.getElementById('intelDialog');
  if (!dialog) return;
  const $ = id => document.getElementById(id);
  const tabs = [...dialog.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => $(tab.getAttribute('aria-controls')));
  const entries = {
    weather: { title: 'Weather', card: 'weatherCard', summary: 'Official Met Éireann warnings for the areas represented in the source check.', evidence: 'A warning describes a forecast hazard and its validity period. Historical rainfall is a different measure: READY72’s 2016–2025 analysis varies by year and does not establish a simple upward national trend. Rainfall alone cannot show whether flooding is increasing.', evidenceLink: ['Explore the rainfall and flood study', 'evidence.html#evidence'], prepare: 'Check the warning level, affected places and expiry time on Met Éireann. Secure loose outdoor items when advised, plan around travel disruption, and follow official instructions for your area.', source: ['Met Éireann warnings', 'https://www.met.ie/weather-warnings'] },
    floods: { title: 'Floods & rivers', card: 'riverCard', summary: 'OPW river-gauge readings are recent observations, not flood warnings.', evidence: 'River readings are useful context but need station location, catchment conditions and event records to interpret. The rainfall study explains the data quality checks and why a rainfall-to-flood analysis is the next research step.', evidenceLink: ['Explore the rainfall and flood study', 'evidence.html#evidence'], prepare: 'Know whether your home or regular route is in a flood-prone area. Keep important items above likely water levels, avoid walking or driving through floodwater, and follow local authority and emergency-service advice.', source: ['OPW latest readings', 'https://waterlevel.ie/last/'] },
    electricity: { title: 'Electricity', card: 'electricityCard', summary: 'The ESB PowerCheck connection is a work-in-progress public feed, not an address-level confirmation.', evidence: 'Electricity supports other household services, including communications and some water treatment. The evidence page links documented service disruptions and clearly separates those events from forecasts about future outages.', evidenceLink: ['Explore service disruption evidence', 'evidence.html#cyber-resilience'], prepare: 'Keep a torch, spare batteries, charged power bank, essential medicines and written contact details accessible. Check ESB Networks for the current status and restoration information.', source: ['ESB PowerCheck', 'https://powercheck.esbnetworks.ie/'] },
    water: { title: 'Water supply', card: 'waterCard', summary: 'Public Uisce Éireann notices can be matched to a county, but do not verify an individual address.', evidence: 'Water supply can depend on electricity for pumping and treatment. READY72 labels public map listings as incomplete context and avoids treating an empty result as proof that a home is unaffected.', evidenceLink: ['Explore linked-service evidence', 'evidence.html#cyber-resilience'], prepare: 'Follow any local boil-water or do-not-consume notice exactly. Keep suitable drinking water for household needs and check Uisce Éireann’s official map or alerts if an issue affects your area.', source: ['Uisce Éireann service updates', 'https://www.water.ie/in-your-area?map=supply-and-service-updates'] },
    cyber: { title: 'Cyber security', card: 'cyberCard', summary: 'NCSC advisories describe security issues; an advisory alone does not mean a household or utility has been attacked.', evidence: 'Ireland’s National Cyber Risk Assessment and ENISA’s threat landscape describe risks to connected services and potential cross-sector effects. They support practical resilience, not a claim that an Irish grid attack is imminent.', evidenceLink: ['Explore cyber and resilience evidence', 'evidence.html#cyber-resilience'], prepare: 'Install updates, use multi-factor authentication where available, keep a backup of essential information and know how to access official updates if your usual digital services are unavailable.', source: ['Irish NCSC updates', 'https://www.ncsc.gov.ie/news/'] },
    services: { title: 'Essential services', card: 'servicesCard', summary: 'READY72 currently links to official fire-risk and national-road information; these are not integrated feeds.', evidence: 'Weather, power, water, transport and communications can be connected in practical ways. The evidence page uses documented sources and events to explain those dependencies without treating them as predictions.', evidenceLink: ['Explore Evidence & Insights', 'evidence.html'], prepare: 'Before severe weather or travel, check the official source relevant to your route or location. Keep a household contact plan and allow extra time if public advice reports disruption.', source: ['TII traffic information', 'https://traffic.tii.ie/'] }
  };
  function setTab(index, focus = false) {
    tabs.forEach((tab, i) => { const selected = i === index; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; panels[i].hidden = !selected; });
    if (focus) tabs[index].focus();
  }
  function addTextSection(parent, kicker, text, link) {
    const section = document.createElement('div'); section.className = 'intel-explanation';
    const heading = document.createElement('h3'); heading.textContent = kicker;
    const paragraph = document.createElement('p'); paragraph.textContent = text;
    section.append(heading, paragraph);
    if (link) { const anchor = document.createElement('a'); anchor.href = link[1]; anchor.textContent = `${link[0]} →`; section.append(anchor); }
    parent.replaceChildren(section);
  }
  function open(key, trigger) {
    const entry = entries[key]; if (!entry) return;
    $('intelTitle').textContent = entry.title;
    $('intelSummary').textContent = entry.summary;
    const current = panels[0], original = entry.card && document.getElementById(entry.card);
    if (original) {
      const clone = original.cloneNode(true);
      clone.removeAttribute('id'); clone.classList.add('intel-current-card');
      clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      clone.querySelectorAll('.card-detail-button,.esb-map').forEach(node => node.remove());
      current.replaceChildren(clone);
    } else {
      const section = document.createElement('div'); section.className = 'intel-unavailable';
      const notice = document.createElement('p'); notice.textContent = entry.summary;
      const link = document.createElement('a'); link.href = entry.source[1]; link.target = '_blank'; link.rel = 'noopener'; link.textContent = `Check ${entry.source[0]} directly ↗`;
      section.append(notice, link); current.replaceChildren(section);
    }
    addTextSection(panels[1], 'What the evidence can tell us', entry.evidence, entry.evidenceLink);
    addTextSection(panels[2], 'Practical steps', entry.prepare, ['Ask READY72 for help with a household plan', 'ask.html']);
    setTab(0);
    dialog.showModal();
    requestAnimationFrame(() => tabs[0].focus());
    dialog.dataset.returnFocus = trigger?.id || '';
  }
  document.querySelectorAll('[data-open-intel]').forEach(button => button.addEventListener('click', () => open(button.dataset.openIntel, button)));
  $('closeIntel').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setTab(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      setTab(next, true);
    });
  });
})();
