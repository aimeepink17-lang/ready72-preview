(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const countyCodes = {
    Carlow:'EI01', Cavan:'EI02', Clare:'EI03', Cork:'EI04', Donegal:'EI06', Dublin:'EI07', Galway:'EI10',
    Kerry:'EI11', Kildare:'EI12', Kilkenny:'EI13', Laois:'EI14', Leitrim:'EI15', Limerick:'EI16',
    Longford:'EI17', Louth:'EI18', Mayo:'EI19', Meath:'EI20', Monaghan:'EI21', Offaly:'EI22',
    Roscommon:'EI23', Sligo:'EI25', Tipperary:'EI26', Waterford:'EI27', Westmeath:'EI29', Wexford:'EI30', Wicklow:'EI31'
  };
  const countyLocations = {
    Carlow:[52.84,-6.93],Cavan:[53.99,-7.36],Clare:[52.90,-9.00],Cork:[51.90,-8.47],Donegal:[54.91,-8.05],Dublin:[53.35,-6.26],Galway:[53.27,-9.05],Kerry:[52.15,-9.57],
    Kildare:[53.16,-6.82],Kilkenny:[52.58,-7.25],Laois:[52.99,-7.33],Leitrim:[54.12,-8.00],Limerick:[52.66,-8.62],Longford:[53.73,-7.80],Louth:[53.92,-6.49],Mayo:[53.90,-9.25],
    Meath:[53.65,-6.68],Monaghan:[54.25,-6.97],Offaly:[53.23,-7.72],Roscommon:[53.63,-8.19],Sligo:[54.27,-8.47],Tipperary:[52.58,-7.93],Waterford:[52.26,-7.11],Westmeath:[53.53,-7.47],Wexford:[52.34,-6.46],Wicklow:[52.98,-6.37]
  };
  const countyNames=Object.keys(countyCodes);

  const plan = [
    { title:'Water & food', items:[
      'Keep drinking water: 2–3 litres per person per day where possible.',
      'Keep non-perishable food to support your household for at least 72 hours, and rotate it before expiry.',
      'Consider dietary needs, children, pets and ready-to-feed formula if used.',
      'Use fresh and refrigerated food first if power is interrupted.'
    ]},
    { title:'Light, warmth & utilities', items:[
      'Keep a torch or lamp and spare batteries.',
      'Have blankets, sleeping bags or emergency thermal blankets.',
      'Know where electricity, water and gas shut-off points are.',
      'Keep your MPRN and GPRN details somewhere accessible.',
      'Know that gas must only be turned back on by a qualified engineer.'
    ]},
    { title:'Health & hygiene', items:[
      'Keep regular prescriptions up to date where possible.',
      'Keep copies of prescriptions and a list of medical conditions.',
      'Have a first aid kit and household hygiene supplies.'
    ]},
    { title:'Information & contacts', items:[
      'Keep a battery, wind-up or solar radio and spare batteries; a car radio can be a backup.',
      'Keep a charged phone, charger and power bank ready.',
      'Write down your Eircode and key emergency, family and service contacts.',
      'Make a household plan that is available if phones or internet fail.'
    ]},
    { title:'Documents & getting out', items:[
      'Store key documents in a sealed waterproof file.',
      'Keep local maps in case GPS is unavailable and spare keys somewhere accessible.',
      'Consider a small, affordable cash reserve and an offline payment option for essential purchases if electronic payments are temporarily unavailable.',
      'Know what you would take if leaving: medication, hygiene items, warm/waterproof clothes, phone, ID and cards/cash.'
    ]},
    { title:'People & animals', items:[
      'Plan how to keep animals safe and what supplies they need.',
      'Agree a check-in plan with family, friends or neighbours.',
      'Keep local community support contacts and check on others when safe.',
      'If in supported or temporary accommodation, ask your service provider about its emergency arrangements.'
    ]}
  ];

  let latestData = null;
  let toastTimer = 0;
  let esbMap = null;
  let esbMarkers = null;

  function safeText(value, fallback='') {
    const text = String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text || fallback;
  }

  function dateTime(value) {
    if (!value) return 'Time not provided';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return safeText(value);
    return new Intl.DateTimeFormat('en-IE', { dateStyle:'medium', timeStyle:'short', timeZone:'Europe/Dublin' }).format(date);
  }

  function announce(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
  }

  function addPreview(parent, { badge, title, detail, value }) {
    const row = document.createElement('div');
    row.className = parent.id === 'weatherList' ? 'warning-item' : parent.id === 'cyberList' ? 'cyber-item' : parent.id === 'esbOutages' ? 'esb-item' : 'river-item';
    if (badge) {
      const pill = document.createElement('span');
      pill.className = `warning-level ${String(badge).toLowerCase()}`;
      pill.textContent = badge;
      row.append(pill);
    }
    const copy = document.createElement('span');
    copy.className = 'preview-copy';
    const heading = document.createElement('b');
    heading.textContent = safeText(title, 'Source record');
    const sub = document.createElement('small');
    sub.textContent = safeText(detail, 'Source details unavailable');
    copy.append(heading, sub);
    row.append(copy);
    if (value) {
      const valueNode = document.createElement('span');
      valueNode.className = 'river-value';
      valueNode.textContent = value;
      row.append(valueNode);
    }
    parent.append(row);
  }

  function setSourceStatus(id, status, state) {
    const node = $(id);
    if (!node) return;
    if (status === 'ok') {
      node.textContent = state || 'CONNECTED';
      node.className = 'card-connection';
    } else {
      node.textContent = 'UNAVAILABLE';
      node.className = 'card-connection linkout';
    }
  }

  function chosenWarnings(warnings) {
    const county = $('countySelect').value;
    if (county === 'all') return warnings;
    const origin=countyLocations[county];
    if (!origin) return warnings;
    return warnings.map(warning=>{
      const affected=countyNames.filter(name=>(warning.regions||[]).includes(countyCodes[name]));
      const nearest=affected.map(name=>({name,distance:distanceKm(origin,countyLocations[name])})).sort((a,b)=>a.distance-b.distance);
      return {...warning,_affected:nearest};
    }).filter(warning=>warning._affected.length).sort((a,b)=>a._affected[0].distance-b._affected[0].distance);
  }

  function distanceKm(a,b){const rad=n=>n*Math.PI/180;const dLat=rad(b[0]-a[0]),dLon=rad(b[1]-a[1]);const h=Math.sin(dLat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}

  function renderWarnings(source) {
    const target = $('weatherList');
    target.replaceChildren();
    setSourceStatus('weatherStatus', source?.status, 'LIVE SOURCE');
    if (!source || source.status !== 'ok') {
      const empty = document.createElement('div');
      empty.className = 'empty-preview';
      empty.textContent = 'Unable to check Met Éireann warnings right now. Use the official source link to confirm current information.';
      target.append(empty);
      return 0;
    }
    const all = Array.isArray(source.data) ? source.data : [];
    const active = all.filter(w => !w.expiry || new Date(w.expiry).getTime() >= Date.now());
    const relevant = chosenWarnings(active);
    if (!relevant.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-preview';
      const county = $('countySelect').value;
      empty.textContent = `No matching active weather warning found in the Met Éireann source${county === 'all' ? ' checked' : ` for ${county} in the source checked`}. This is not a guarantee that no local issue exists.`;
      target.append(empty);
    } else {
      for (const item of relevant.slice(0, 3)) {
        addPreview(target, {
          badge: safeText(item.level, 'Alert').toUpperCase(),
          title: item.headline || `${item.type || 'Weather'} warning`,
          detail: `${item.type || 'Weather'} · ${item._affected?.[0]?.name || 'Ireland'}${item._affected?.length && item._affected[0].name !== $('countySelect').value ? ` · about ${Math.round(item._affected[0].distance)} km from ${$('countySelect').value}` : ''} · until ${dateTime(item.expiry)}`
        });
      }
      if (relevant.length > 3) {
        const more = document.createElement('div'); more.className = 'source-stamp'; more.textContent = `${relevant.length - 3} more active notices · check the official source`;
        target.append(more);
      }
    }
    return relevant.length;
  }

  function renderRivers(source) {
    const target = $('riverList');
    target.replaceChildren();
    setSourceStatus('riverStatus', source?.status, 'LIVE OBSERVATIONS');
    if (!source || source.status !== 'ok') {
      const empty = document.createElement('div'); empty.className = 'empty-preview';
      empty.textContent = 'Unable to retrieve OPW readings. Check the official latest-readings page.';
      target.append(empty); return 0;
    }
    const features = Array.isArray(source.data?.features) ? source.data.features : [];
    const selected = features.filter(feature => {
      const p = feature.properties || {};
      const ref = Number(p.station_ref);
      return Number.isFinite(ref) && ref >= 1 && ref <= 41000 && ['0001','0011'].includes(String(p.sensor_ref));
    }).sort((a,b) => new Date(b.properties?.datetime || 0) - new Date(a.properties?.datetime || 0));
    const byStation = new Map();
    for (const feature of selected) {
      const p = feature.properties || {};
      const key = `${p.station_ref}-${p.sensor_ref}`;
      if (!byStation.has(key)) byStation.set(key, feature);
    }
    const readings = [...byStation.values()].slice(0, 3);
    if (!readings.length) {
      const empty = document.createElement('div'); empty.className = 'empty-preview'; empty.textContent = 'No eligible water-level sensor readings were returned in the latest source check.'; target.append(empty);
    } else {
      for (const feature of readings) {
        const p = feature.properties || {};
        const value = Number(p.value);
        addPreview(target, { title: p.station_name || `Station ${p.station_ref}`, detail: `${dateTime(p.datetime)} · OPW observed level`, value: Number.isFinite(value) ? `${value.toFixed(2)} m` : 'Reading unavailable' });
      }
      const note = document.createElement('div'); note.className = 'source-stamp'; note.textContent = 'Latest reported levels; no universal flood threshold is applied.'; target.append(note);
    }
    return readings.length;
  }

  function renderCyber(source) {
    const target = $('cyberList');
    target.replaceChildren();
    setSourceStatus('cyberStatus', source?.status, 'NCSC FEED');
    if (!source || source.status !== 'ok') {
      const empty = document.createElement('div'); empty.className = 'empty-preview'; empty.textContent = 'Unable to check NCSC advisories right now. Use the official source link.'; target.append(empty); return 0;
    }
    const items = Array.isArray(source.data) ? source.data : [];
    if (!items.length) {
      const empty = document.createElement('div'); empty.className = 'empty-preview'; empty.textContent = 'The NCSC feed returned no advisory entries.'; target.append(empty);
    } else {
      for (const item of items.slice(0, 2)) addPreview(target, { title:item.title, detail:`NCSC advisory · ${dateTime(item.updated)}` });
    }
    return items.length;
  }

  function renderEsb(source) {
    const target=$('esbOutages'),countNode=$('esbOutageCount'),customersNode=$('esbCustomerCount'),note=$('esbFeedNote');
    target.replaceChildren();
    setSourceStatus('esbStatus',source?.status,source?.status==='ok'?'WIP · CONNECTED':'WIP · FEED ISSUE');
    if(!source||!['ok','stale'].includes(source.status)){
      countNode.textContent='—';customersNode.textContent='PowerCheck feed could not be reached';
      const row=document.createElement('div');row.className='empty-preview';row.textContent=`The WIP PowerCheck request failed${source?.error?`: ${safeText(source.error)}`:'.'}`;target.append(row);
      note.textContent='WIP feed endpoint is responding with an error; use the ESB source link to check current outages.';return 0;
    }
    const rows=Array.isArray(source.data)?source.data:[];
    countNode.textContent=String(rows.length);
    const affected=rows.reduce((total,row)=>total+(Number(row.numCustAffected)||0),0);
    customersNode.textContent=affected?`${affected.toLocaleString('en-IE')} listed customer impacts*`:'customer impact not supplied in records';
    if(window.L&&$('esbMap')){
      if(!esbMap){esbMap=L.map('esbMap',{scrollWheelZoom:false}).setView([53.35,-8.1],6);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:13,attribution:'© OpenStreetMap contributors'}).addTo(esbMap);esbMarkers=L.featureGroup().addTo(esbMap);}
      esbMarkers.clearLayers();const points=[];
      for(const item of rows){
        const coord=String(item.point?.c||item.p?.c||'').split(',').map(Number);if(coord.length!==2||!coord.every(Number.isFinite))continue;
        const [lat,lon]=coord;if(lat<51||lat>56||lon<-12||lon>-5)continue;
        points.push([lat,lon]);const location=safeText(item.location||item.plannerGroup,'Area not supplied');const type=safeText(item.outageType||item.t||'Interruption');const customers=Number(item.numCustAffected);
        const popup=document.createElement('div');const title=document.createElement('strong');title.textContent=location;popup.append(title,document.createElement('br'),document.createTextNode(`${type}${Number.isFinite(customers)&&customers>0?` · ${customers.toLocaleString('en-IE')} customers`:''}`));if(item.estRestoreTime){popup.append(document.createElement('br'),document.createTextNode(`Est. restore: ${safeText(item.estRestoreTime)}`));}
        const marker=L.circleMarker([lat,lon],{radius:6,color:'#fff',weight:2,fillColor:type.toLowerCase()==='planned'?'#c58a2a':'#c85e4b',fillOpacity:.95}).bindPopup(popup);
        esbMarkers.addLayer(marker);
      }
      if(points.length>1)esbMap.fitBounds(points,{padding:[14,14],maxZoom:7});else if(points.length===1)esbMap.setView(points[0],8);else esbMap.setView([53.35,-8.1],6);
      window.setTimeout(()=>esbMap.invalidateSize(),80);
    }
    if(!rows.length){const empty=document.createElement('div');empty.className='empty-preview';empty.textContent='PowerCheck returned no outage records in this check. Its map only displays interruptions affecting more than 10 properties.';target.append(empty);}
    for(const item of rows.slice(0,2)){
      const type=safeText(item.outageType||item.type||item.t,'Service interruption');
      const location=safeText(item.location||item.area||item.plannerGroup,'Area not supplied');
      const count=Number(item.numCustAffected);
      const detail=[Number.isFinite(count)&&count>0?`${count.toLocaleString('en-IE')} customers`:null,item.estRestoreTime?`Est. restore ${dateTime(item.estRestoreTime)}`:null].filter(Boolean).join(' · ')||safeText(item.statusMessage,'Details not supplied');
      addPreview(target,{badge:type,title:location,detail});
    }
    if(rows.length>2){const more=document.createElement('div');more.className='source-stamp';more.textContent=`+ ${rows.length-2} more records shown on the map`;target.append(more);}
    note.textContent=`${source.stale?'Showing cached PowerCheck data':'PowerCheck feed · checked '+dateTime(source.checkedAt)}. *Record counts can overlap; map shows reported locations, not household-level status. WIP.`;
    return rows.length;
  }

  function renderWater(source) {
    const target=$('waterEvents'),note=$('waterFeedNote'),area=$('waterAreaLabel');
    if(!target)return;
    target.replaceChildren();
    const county=$('countySelect').value;
    area.textContent=county==='all'?'all Ireland':county;
    const usable=source&&['ok','stale'].includes(source.status);
    const rawRows=usable&&Array.isArray(source.data)?source.data:[];
    const mismatched=county==='all'?[]:rawRows.filter(item=>countyNames.some(other=>other!==county&&new RegExp(`\\b${other}\\b`,'i').test(item.title||'')));
    const rows=mismatched.length?rawRows.filter(item=>!mismatched.includes(item)):rawRows;
    const status=$('waterStatus');
    status.textContent=source?.status==='ok'?'LIVE · WIP':source?.status==='stale'?'CACHED · WIP':'FEED ISSUE';
    status.className=source?.status==='ok'?'card-connection':'card-connection linkout';
    if(!usable){
      const empty=document.createElement('div');empty.className='empty-preview';empty.textContent='Could not load Uisce Éireann notices just now. This does not confirm that your supply is unaffected.';target.append(empty);
      note.textContent='The READY72 water check is unavailable. Check again shortly or follow current local advice.';return;
    }
    if(!rows.length){
      const empty=document.createElement('div');empty.className='empty-preview';empty.textContent=`No open notices matched${county==='all'?' Ireland':` ${county}`} in this check.`;target.append(empty);
      note.textContent=`${source.stale?'Showing cached provider data':'Checked '+dateTime(source.checkedAt)} · Uisce Éireann notes that some issues may not be immediately visible.${mismatched.length?' Conflicting county labels were excluded.':''}`;return;
    }
    for(const item of rows.slice(0,3)){
      const row=document.createElement('article');row.className='water-event';
      const top=document.createElement('div');top.className='water-event-top';
      const badge=document.createElement('span');badge.className=`water-event-type ${/boil|consume/i.test(item.type)?'quality-alert':''}`;badge.textContent=safeText(item.type,'Service update');
      const time=document.createElement('small');time.textContent=item.startDate?dateTime(item.startDate):'Start time not supplied';top.append(badge,time);
      const title=document.createElement('b');title.className='water-event-title';title.textContent=safeText(item.title,'Service update');
      const location=document.createElement('small');location.className='water-event-location';location.textContent=[safeText(item.location,'Area not specified'),safeText(item.county)].filter(Boolean).join(', ');
      const summary=document.createElement('p');summary.textContent=safeText(item.description,'No additional details were supplied.');
      row.append(top,title,location,summary);target.append(row);
    }
    if(rows.length>3){const more=document.createElement('div');more.className='source-stamp';more.textContent=`+ ${rows.length-3}${source.limited?'+':''} more provider listings`;target.append(more);}
    note.textContent=`${source.stale?'Showing cached provider data':'Uisce Éireann public map · checked '+dateTime(source.checkedAt)} · provider-listed notices only; not household-level confirmation.${mismatched.length?' Conflicting county labels were excluded.':''}`;
  }

  async function loadPublicWater(county) {
    const endpoint='https://services2.arcgis.com/OqejhVam51LdtxGa/arcgis/rest/services/WaterAdvisoryCR021_DeptView/FeatureServer/0/query';
    const where=`STATUS='Open' AND APPROVALSTATUS='Approved'${county!=='all'?` AND COUNTY='${county}'`:''}`;
    const params=new URLSearchParams({where,outFields:'OBJECTID,TITLE,STARTDATE,ENDDATE,COUNTY,LOCATION,REFERENCENUM,DESCRIPTION,WATEROUTAGE,BOILWATERNOTICE,DONOTDRINK,REDUCEDPRESSURE,WATERRESTRICTIONS,DISCOLOURATION',returnGeometry:'false',orderByFields:'STARTDATE DESC',resultRecordCount:'300',f:'json'});
    const response=await fetch(`${endpoint}?${params}`,{cache:'no-store',signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw new Error(`Uisce Éireann map data returned HTTP ${response.status}`);
    const payload=await response.json();
    if(payload.error)throw new Error(payload.error.message||'Uisce Éireann map data query failed');
    const data=(payload.features||[]).map(feature=>{
      const a=feature.attributes||{};
      const type=a.DONOTDRINK?'Do not consume notice':a.BOILWATERNOTICE?'Boil water notice':a.WATEROUTAGE?'Supply interruption':a.REDUCEDPRESSURE?'Reduced pressure':a.WATERRESTRICTIONS?'Water restriction':a.DISCOLOURATION?'Discoloured water notice':'Service update';
      const description=new DOMParser().parseFromString(String(a.DESCRIPTION||''),'text/html').body.textContent.replace(/\s+/g,' ').trim().slice(0,280);
      return {id:String(a.OBJECTID??a.REFERENCENUM??''),title:String(a.TITLE||type).trim(),type,county:String(a.COUNTY||'').trim(),location:String(a.LOCATION||'Area not specified').trim(),reference:String(a.REFERENCENUM||'').trim(),startDate:a.STARTDATE?new Date(a.STARTDATE).toISOString():null,endDate:a.ENDDATE?new Date(a.ENDDATE).toISOString():null,description};
    });
    return {status:'ok',checkedAt:new Date().toISOString(),sourceUrl:'https://www.water.ie/in-your-area?map=supply-and-service-updates',area:county,data,recordCount:data.length,limited:Boolean(payload.exceededTransferLimit)};
  }

  async function refreshSources() {
    const button = $('refreshSources');
    button?.classList.add('spinning');
    try {
      const county=$('countySelect')?.value||'all';
      const response = await fetch(`/api/overview?county=${encodeURIComponent(county)}`, { cache:'no-store' });
      if (!response.ok) throw new Error(`Source service returned ${response.status}`);
      latestData = await response.json();
      const warnings = renderWarnings(latestData.weather);
      const rivers = renderRivers(latestData.river);
      const cyber = renderCyber(latestData.cyber);
      renderEsb(latestData.esb);
      let water=latestData.water;
      if(!water||water.status!=='ok'){
        try{water=await loadPublicWater(county);}
        catch(error){if(!water||water.status!=='stale')water={status:'unavailable',checkedAt:new Date().toISOString(),area:county,data:[],error:safeText(error.message)};}
      }
      renderWater(water);
      $('warningCount').textContent = warnings;
      $('riverCount').textContent = rivers;
      $('cyberCount').textContent = cyber;
      $('checkedAt').textContent = `Last checked ${dateTime(latestData.checkedAt)}`;
    } catch (error) {
      for (const [listId,statusId] of [['weatherList','weatherStatus'],['riverList','riverStatus'],['cyberList','cyberStatus']]) {
        const node = $(listId); node.replaceChildren();
        const message = document.createElement('div'); message.className='empty-preview'; message.textContent='READY72 could not reach its local source service. Start the local preview server and try again.'; node.append(message);
        setSourceStatus(statusId, 'unavailable');
      }
      $('checkedAt').textContent = 'Source service unavailable';
      $('warningCount').textContent = '—'; $('riverCount').textContent = '—'; $('cyberCount').textContent = '—';
      console.error(error);
    } finally {
      button?.classList.remove('spinning');
    }
  }

  async function checkAiConnection() {
    try {
      const response=await fetch('/api/health',{cache:'no-store'});
      if(!response.ok) throw new Error('AI status unavailable');
      const status=await response.json();
      $('aiMode').textContent=status.aiConfigured?'AI · SOURCE GROUNDED':'LOCAL ANSWER PREVIEW';
      $('aiSetupNote').hidden=Boolean(status.aiConfigured);
    } catch (_) { $('aiMode').textContent='PREVIEW MODE'; }
  }

  function setupKitBuilder() {
    const root=$('kitChecklist');
    if(!root)return;
    const boxes=[...root.querySelectorAll('[data-kit-item]')];
    let saved={};
    try{saved=JSON.parse(localStorage.getItem('ready72Kit')||'{}')||{};}catch{saved={};}
    for(const box of boxes)box.checked=Boolean(saved[box.dataset.kitItem]);
    const updateProgress=()=>{
      const done=boxes.filter(box=>box.checked).length;
      $('kitProgressText').textContent=`${done} of ${boxes.length} essentials checked`;
      $('kitProgressBar').style.width=`${boxes.length?done/boxes.length*100:0}%`;
    };
    const updateWater=()=>{
      const field=$('kitHouseholdSize');
      const count=Math.max(1,Math.min(20,Number.parseInt(field.value,10)||1));
      $('kitWaterMin').textContent=String(count*6);
      $('kitWaterMax').textContent=String(count*9);
    };
    for(const box of boxes)box.addEventListener('change',()=>{
      const state=Object.fromEntries(boxes.map(item=>[item.dataset.kitItem,item.checked]));
      try{localStorage.setItem('ready72Kit',JSON.stringify(state));}catch{announce('Your browser could not save kit progress. You can still use this checklist.');}
      updateProgress();
    });
    $('kitHouseholdSize').addEventListener('input',updateWater);
    $('kitHouseholdSize').addEventListener('change',()=>{
      const field=$('kitHouseholdSize');field.value=String(Math.max(1,Math.min(20,Number.parseInt(field.value,10)||1)));updateWater();
    });
    $('printKit').addEventListener('click',()=>window.print());
    updateWater();updateProgress();
  }

  function renderPlan() {
    const target = $('planChecklist');
    if (!target) return;
    target.replaceChildren();
    let index = 0;
    for (const group of plan) {
      const section = document.createElement('section'); section.className = 'plan-group';
      const heading = document.createElement('h3'); const dot = document.createElement('i'); dot.className='group-dot'; heading.append(dot, document.createTextNode(group.title)); section.append(heading);
      for (const text of group.items) {
        const label = document.createElement('label'); label.className='check-row';
        const checkbox = document.createElement('input'); checkbox.type='checkbox'; checkbox.dataset.item=String(index); checkbox.setAttribute('aria-label', text);
        const span = document.createElement('span'); span.textContent=text;
        label.append(checkbox,span); section.append(label); index += 1;
      }
      target.append(section);
    }
    $('planTotal').textContent = index;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem('ready72Plan') || '[]'); } catch (_) { saved=[]; }
    target.querySelectorAll('input[type=checkbox]').forEach(box => { box.checked = saved.includes(Number(box.dataset.item)); box.addEventListener('change', savePlan); });
    updatePlanProgress();
  }

  function savePlan() {
    const checked = [...$('planChecklist').querySelectorAll('input:checked')].map(box => Number(box.dataset.item));
    try { localStorage.setItem('ready72Plan', JSON.stringify(checked)); } catch (_) { announce('Your browser could not save checklist progress. You can still print this page.'); }
    updatePlanProgress();
  }

  function updatePlanProgress() {
    const target=$('planChecklist');if(!target)return;
    const total = target.querySelectorAll('input[type=checkbox]').length;
    const complete = target.querySelectorAll('input:checked').length;
    $('planComplete').textContent = complete;
    $('planTotal').textContent = total;
    $('planBar').style.width = total ? `${complete / total * 100}%` : '0%';
    const message = complete === 0 ? 'Start with one thing you already have. Some preparation is better than none.' : complete === total ? 'You have worked through the checklist. Review it from time to time.' : `${total - complete} items left. Take them at your own pace.`;
    $('progressMessage').textContent = message;
  }

  let rainfallRows=[];
  let rainfallThreshold=20;
  function renderRainfallChart(){
    const root=$('rainfallChart');
    if(!root||!rainfallRows.length)return;
    const metric=`grid_days_ge_${rainfallThreshold}mm`,denominator='grid_point_days';
    const rows=rainfallRows.map(row=>({year:row.year,value:Number(row[metric])/Number(row[denominator])*100})).filter(row=>Number.isFinite(row.value));
    root.replaceChildren();const max=Math.max(1,...rows.map(row=>row.value));
    rows.forEach(row=>{const group=document.createElement('div');group.className='chart-bar-group';const bar=document.createElement('i');bar.className='chart-bar';bar.style.setProperty('--bar-height',`${Math.max(4,row.value/max*92)}%`);bar.setAttribute('aria-label',`${row.year}: ${row.value.toFixed(2)} percent of valid grid-point days at or above ${rainfallThreshold} millimetres`);bar.title=`${row.year}: ${row.value.toFixed(2)}%`;const year=document.createElement('span');year.textContent=row.year.slice(2);group.append(bar,year);root.append(group);});
    $('thresholdCaption').textContent=`Share of valid grid-point days at ≥${rainfallThreshold} mm/day`;
    document.querySelectorAll('.threshold-button').forEach(button=>{const active=Number(button.dataset.threshold)===rainfallThreshold;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  }

  function loadRainfallChart() {
    fetch('data/analysis/annual_profile_validated.csv').then(r => r.ok ? r.text() : '').then(csv => {
      if (!csv) return;
      const lines=csv.trim().split(/\r?\n/);const headers=lines[0].split(',');
      rainfallRows=lines.slice(1).map(line=>line.split(',')).filter(cells=>cells.length>=headers.length).map(cells=>Object.fromEntries(headers.map((header,index)=>[header,cells[index]])));
      renderRainfallChart();
    }).catch(()=>{});
  }

  function addChatMessage({text,who,sources=[],mode=''}) {
    const root=$('chatMessages'); const row=document.createElement('div'); row.className=`chat-message ${who==='user'?'user-message':'assistant-message'}`;
    const avatar=document.createElement('div'); avatar.className='message-avatar'; avatar.textContent=who==='user'?'Y':'R';
    const bubble=document.createElement('div'); bubble.className='message-bubble';
    const answer=String(text||'');
    const citedIds=[...new Set([...answer.matchAll(/\[S(\d+)\]/g)].map(match=>Number(match[1])))];
    const cleanAnswer=answer.replace(/\s*\[S\d+\]/g,'').replace(/\s{2,}/g,' ').trim();
    const paragraph=document.createElement('p'); paragraph.textContent=cleanAnswer; bubble.append(paragraph);
    const stamp=document.createElement('small'); stamp.textContent=who==='user'?'You':`READY72 · ${mode || 'Source-grounded answer'}`; bubble.append(stamp);
    const citedSources=citedIds.length?citedIds.map(id=>sources[id-1]).filter(Boolean):[];
    if (citedSources.length) {
      const list=document.createElement('details'); list.className='message-sources';
      const summary=document.createElement('summary'); summary.textContent=`Sources (${citedSources.length})`; list.append(summary);
      const links=document.createElement('div'); links.className='message-source-links';
      for (const source of citedSources) { const a=document.createElement('a'); a.href=source.url; a.target='_blank'; a.rel='noopener'; a.textContent=String(source.label||'Source').replace(/^\[S\d+\]\s*/,''); links.append(a); }
      list.append(links); bubble.append(list);
    }
    row.append(avatar,bubble); root.append(row); root.scrollTop=root.scrollHeight;
  }

  async function ask(question) {
    const cleaned=String(question||'').trim(); if (!cleaned) return;
    addChatMessage({text:cleaned,who:'user'});
    $('chatInput').value=''; $('chatInput').style.height='auto';
    const submit=$('chatForm').querySelector('button'); submit.disabled=true; submit.textContent='…';
    const pending=addPendingMessage();
    try {
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:cleaned,county:$('countySelect').value})});
      const result=await response.json(); pending.remove();
      if (!response.ok) throw new Error(result.error || 'The assistant is unavailable.');
      addChatMessage({text:result.answer,who:'assistant',sources:result.sources||[],mode:result.mode||'Source-grounded answer'});
      if (result.mode==='local-preview') $('aiMode').textContent='LOCAL PREVIEW';
      else if (result.mode==='ai-grounded') $('aiMode').textContent='AI · SOURCES CITED';
    } catch (error) { pending.remove(); addChatMessage({text:`I couldn’t complete that answer: ${error.message}. Try again or use the official source links on this page.`,who:'assistant',mode:'Connection notice'}); }
    finally { submit.disabled=false; submit.textContent='↑'; }
  }

  function addPendingMessage() {
    const row=document.createElement('div'); row.className='chat-message assistant-message'; row.innerHTML='<div class="message-avatar">R</div><div class="message-bubble"><p>Checking the available sources…</p><small>READY72</small></div>';
    $('chatMessages').append(row); $('chatMessages').scrollTop=$('chatMessages').scrollHeight; return row;
  }

  function updateAreaSelection(){
    const selected=$('countySelect').value;
    $('countyList').querySelectorAll('.county-option').forEach(button=>button.classList.toggle('selected',button.textContent===selected));
    $('countyMapPoints').querySelectorAll('.county-map-point').forEach(point=>point.classList.toggle('selected',point.dataset.county===selected));
  }
  function setCounty(county){$('countySelect').value=county;$('selectedAreaLabel').textContent=county==='all'?'All Ireland':county;$('locationDialog').close();$('locationFeedback').textContent=county==='all'?'Showing information across Ireland.':'Showing county-level information for '+county+'.';try{localStorage.setItem('ready72County',county)}catch{}updateAreaSelection();if(latestData)$('warningCount').textContent=renderWarnings(latestData.weather);refreshSources();}

  function buildCountyPicker(){
    const points=$('countyMapPoints'),list=$('countyList');
    try{const saved=localStorage.getItem('ready72County');if(saved==='all'||countyNames.includes(saved))$('countySelect').value=saved;}catch{}
    $('selectedAreaLabel').textContent=$('countySelect').value==='all'?'All Ireland':$('countySelect').value;
    countyNames.forEach(name=>{
      const [lat,lon]=countyLocations[name],x=92+(lon+10.6)*43,y=390-(lat-51.5)*80;
      const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.setAttribute('class','county-map-point');group.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);group.setAttribute('role','button');group.setAttribute('tabindex','0');group.setAttribute('aria-label',`Select County ${name}`);group.dataset.county=name;
      const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('r','6');const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=name;group.append(circle,title);group.addEventListener('click',()=>setCounty(name));group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setCounty(name);}});points.append(group);
      const button=document.createElement('button');button.type='button';button.className='county-option';button.textContent=name;button.addEventListener('click',()=>setCounty(name));list.append(button);
    });
  }

  function useDeviceLocation(){
    const feedback=$('locationFeedback'),button=$('useLocation');
    if(!('geolocation' in navigator)){feedback.textContent='Location access is not available in this browser. Choose a county from the map or list.';return;}
    button.disabled=true;feedback.textContent='Finding your county…';
    navigator.geolocation.getCurrentPosition(position=>{
      const here=[position.coords.latitude,position.coords.longitude];
      const nearest=countyNames.map(name=>({name,distance:distanceKm(here,countyLocations[name])})).sort((a,b)=>a.distance-b.distance)[0];
      button.disabled=false;
      if(nearest.distance>90){feedback.textContent='Your location appears to be outside the Republic of Ireland. Choose a county to continue.';return;}
      feedback.textContent=`Closest county estimate: ${nearest.name}. We use county-level alerts; precise coordinates stay on this device.`;setCounty(nearest.name);announce(`Area set to ${nearest.name}. Showing county-level alerts.`);
    },error=>{button.disabled=false;feedback.textContent=error.code===1?'Location permission was not granted. You can still choose an area from the map or list.':'Could not detect your location. Choose an area from the map or list.';},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  }

  $('refreshSources').addEventListener('click',refreshSources);
  document.querySelectorAll('.primary-nav .nav-link').forEach(link=>link.addEventListener('click',()=>{
    document.querySelectorAll('.primary-nav .nav-link').forEach(item=>item.classList.toggle('active',item===link));
  }));
  $('countySelect').addEventListener('change',()=>{if(latestData)$('warningCount').textContent=renderWarnings(latestData.weather);refreshSources();});
  $('openLocation').addEventListener('click',()=>{ $('locationDialog').showModal();updateAreaSelection(); });
  $('closeLocation').addEventListener('click',()=>$('locationDialog').close());
  $('locationDialog').addEventListener('click',event=>{if(event.target===$('locationDialog'))$('locationDialog').close();});
  $('allIreland').addEventListener('click',()=>setCounty('all'));
  $('useLocation').addEventListener('click',useDeviceLocation);
  document.querySelectorAll('.threshold-button').forEach(button=>button.addEventListener('click',()=>{rainfallThreshold=Number(button.dataset.threshold);renderRainfallChart();}));
  $('chatForm').addEventListener('submit',event=>{event.preventDefault();ask($('chatInput').value);});
  $('chatInput').addEventListener('input',event=>{event.target.style.height='auto';event.target.style.height=`${Math.min(event.target.scrollHeight,100)}px`;});
  $('chatInput').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();$('chatForm').requestSubmit();}});
  $('suggestedPrompts').addEventListener('click',event=>{const button=event.target.closest('.prompt-chip');if(button)ask(button.textContent);});
  $('printPlan')?.addEventListener('click',()=>window.print());
  $('resetPlan')?.addEventListener('click',()=>{if(!window.confirm('Clear saved checklist progress in this browser?'))return;localStorage.removeItem('ready72Plan');renderPlan();announce('Checklist progress cleared from this browser.');});
  buildCountyPicker();renderPlan();setupKitBuilder(); loadRainfallChart(); refreshSources(); checkAiConnection();
})();
