
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
  if(!page.ok||!html.includes('READY72 — Prepared with evidence')) throw new Error('Home page failed');
  console.log('PASS dashboard HTML route');

  const data=await request('GET','/data/analysis/annual_profile_validated.csv');
  const csv=data.text();
  if(!data.ok||!csv.includes('pct_grid_point_days_ge_20mm')) throw new Error(`Validated analysis data route failed (${data.status}: ${csv.slice(0,80)})`);
  console.log('PASS validated analysis data route');

  const chat=await request('POST','/api/chat',JSON.stringify({question:'Why should a household make a plan?'}));
  const response=JSON.parse(chat.text());
  if(!chat.ok||response.mode!=='local-preview'||!response.sources?.length) throw new Error('Chat route did not return a source-linked preview');
  console.log('PASS source-linked local chat route');
  console.log(JSON.stringify({status:'pass',aiConfigured:healthJson.aiConfigured,mode:response.mode,checks:4}));
}catch(error){console.error(error);process.exitCode=1;}
