
process.env.READY72_TEST_NO_LISTEN='1';
const {server}=await import('./server.mjs');
const handler=server.listeners('request')[0];

async function request(method,url,body){
  const requestObject={
    method,url,
    async *[Symbol.asyncIterator](){if(body) yield Buffer.from(body);}
  };
  return new Promise((resolve,reject)=>{
    const responseObject={
      statusCode:0,headers:{},
      writeHead(status,headers={}){this.statusCode=status;this.headers=headers;},
      end(value=''){resolve({ok:this.statusCode>=200&&this.statusCode<300,status:this.statusCode,headers:this.headers,text:()=>Buffer.isBuffer(value)?value.toString('utf8'):String(value)});}
    };
    Promise.resolve(handler(requestObject,responseObject)).catch(reject);
  });
}

try{
  const health=await request('GET','/api/health');
  const healthJson=JSON.parse(health.text());
  if(!health.ok||!healthJson.ok) throw new Error('Health endpoint failed');
  console.log('PASS local server health route');

  const page=await request('GET','/');
  const html=page.text();
  if(!page.ok||!html.includes('READY72 — Ireland’s guide to household emergency preparedness')) throw new Error('Home page failed');
  console.log('PASS dashboard HTML route');

  for(const [url,marker,label] of [
    ['/ask.html','Ask READY72','dedicated assistant page'],
    ['/checkup.html','A reflection tool, not a rating','Get Prepared page'],
    ['/evidence.html','Does heavy rain connect to recorded flooding?','Evidence & Insights page'],
    ['/kit.html','Build a Kit','Preparedness Kits page'],
    ['/about.html','Where the information comes from','About & Sources page']
  ]){
    const pageResult=await request('GET',url);
    if(!pageResult.ok||!pageResult.text().includes(marker))throw new Error(`${label} failed (${pageResult.status})`);
    console.log(`PASS ${label} route`);
  }
  const prepared=await request('GET','/checkup.html');
  if(!prepared.ok||prepared.text().includes('resultScore'))throw new Error('The readiness page should not expose a numerical score');
  console.log('PASS non-numerical readiness result structure');

  const evidence=await request('GET','/evidence.html');
  if(!evidence.ok||!evidence.text().includes('Storm Éowyn: What It Taught Us')||!evidence.text().includes('768,000')||!evidence.text().includes('184 km/h'))throw new Error('Verified real-event case study failed');
  console.log('PASS sourced Storm Éowyn case study and limitations');

  const kits=await request('GET','/kit.html');
  for(const category of ['Emergency radios','Torches &amp; lighting','Power banks','First-aid supplies','Waterproof document storage','Complete emergency kits'])if(!kits.text().includes(category))throw new Error(`Future kit category missing: ${category}`);
  if(kits.text().includes('Proceed to checkout'))throw new Error('Future shop must not imply a working checkout');
  console.log('PASS future shop category structure without fabricated products');

  const about=await request('GET','/about.html');
  if(!about.ok||!about.text().includes('does not send push alerts')||!about.text().includes('For official warnings'))throw new Error('Update and source-limit information failed');
  console.log('PASS source freshness and official-alert distinction');

  const nav=await request('GET','/nav.js');
  if(!nav.ok||!nav.text().includes('Evidence & Insights')||!nav.text().includes('Preparedness Kits'))throw new Error('Primary navigation failed');
  console.log('PASS seven-section navigation asset');

  const panel=await request('GET','/intel-panel.js');
  if(!panel.ok||!panel.text().includes('ArrowRight')||!panel.text().includes('showModal'))throw new Error('Intelligence detail controls failed');
  console.log('PASS accessible intelligence detail asset');

  const data=await request('GET','/data/analysis/annual_profile_validated.csv');
  const csv=data.text();
  if(!data.ok||!csv.includes('pct_grid_point_days_ge_20mm')) throw new Error(`Validated analysis data route failed (${data.status}: ${csv.slice(0,80)})`);
  console.log('PASS validated analysis data route');

  const chat=await request('POST','/api/chat',JSON.stringify({question:'Why should a household make a plan?'}));
  const response=JSON.parse(chat.text());
  if(!chat.ok||response.mode!=='local-preview'||!response.sources?.length) throw new Error('Chat route did not return a source-linked preview');
  console.log('PASS source-linked local chat route');
  console.log(JSON.stringify({status:'pass',aiConfigured:healthJson.aiConfigured,mode:response.mode,checks:15}));
}catch(error){console.error(error);process.exitCode=1;}
