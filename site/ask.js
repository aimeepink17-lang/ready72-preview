(() => {
  const $ = id => document.getElementById(id);
  const form = $('askForm'), input = $('askInput'), messages = $('askMessages'), area = $('askCounty');
  if (!form || !input || !messages || !area) return;
  try { area.value = localStorage.getItem('ready72County') || 'all'; } catch {}
  area.addEventListener('change', () => { try { localStorage.setItem('ready72County', area.value); } catch {} });
  const addMessage = ({ text, who = 'assistant', sources = [], mode = '' }) => {
    const row = document.createElement('div'); row.className = `chat-message ${who === 'user' ? 'user-message' : 'assistant-message'}`;
    const avatar = document.createElement('div'); avatar.className = 'message-avatar'; avatar.textContent = who === 'user' ? 'Y' : 'R';
    const bubble = document.createElement('div'); bubble.className = 'message-bubble';
    const answer = String(text || ''), ids = [...new Set([...answer.matchAll(/\[S(\d+)\]/g)].map(match => Number(match[1])))];
    const paragraph = document.createElement('p'); paragraph.textContent = answer.replace(/\s*\[S\d+\]/g, '').replace(/\s{2,}/g, ' ').trim(); bubble.append(paragraph);
    const stamp = document.createElement('small'); stamp.textContent = who === 'user' ? 'You' : `READY72 · ${mode || 'Source-grounded answer'}`; bubble.append(stamp);
    const cited = ids.map(id => sources[id - 1]).filter(Boolean);
    if (cited.length) { const details = document.createElement('details'); details.className = 'message-sources'; const summary = document.createElement('summary'); summary.textContent = `Sources (${cited.length})`; const links = document.createElement('div'); links.className = 'message-source-links'; cited.forEach(source => { const link = document.createElement('a'); link.href = source.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = String(source.label || 'Source').replace(/^\[S\d+\]\s*/, ''); links.append(link); }); details.append(summary, links); bubble.append(details); }
    row.append(avatar, bubble); messages.append(row); messages.scrollTop = messages.scrollHeight; return row;
  };
  const ask = async question => {
    const clean = String(question || '').trim(); if (!clean) return;
    addMessage({ text: clean, who: 'user' }); input.value = ''; input.style.height = 'auto';
    const submit = form.querySelector('button[type="submit"]'); submit.disabled = true; submit.textContent = '…';
    const pending = addMessage({ text: 'Checking the available information…', mode: 'Working' });
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: clean, county: area.value }) });
      const result = await response.json(); pending.remove();
      if (!response.ok) throw new Error(result.error || 'The assistant is unavailable right now.');
      addMessage({ text: result.answer, sources: result.sources || [], mode: result.mode === 'ai-grounded' ? 'AI · source grounded' : 'Grounded preview' });
      if (result.mode === 'ai-grounded') $('askAiMode').textContent = 'AI · GROUNDED';
    } catch (error) { pending.remove(); addMessage({ text: `${error.message} Please try again, or check the official sources on the Live Intelligence page.`, mode: 'Connection notice' }); }
    finally { submit.disabled = false; submit.textContent = '↑'; input.focus(); }
  };
  form.addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 130)}px`; });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });
  $('askExamples').addEventListener('click', event => { const button = event.target.closest('button'); if (button) ask(button.textContent); });
  fetch('/api/health', { cache: 'no-store' }).then(response => response.ok ? response.json() : Promise.reject()).then(status => { $('askAiMode').textContent = status.aiConfigured ? 'AI READY' : 'LOCAL PREVIEW'; }).catch(() => { $('askAiMode').textContent = 'PREVIEW'; });
})();
