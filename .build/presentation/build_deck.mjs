import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const artifactTool='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1111-570-0_26.1111.570.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const { Presentation, PresentationFile } = await import(pathToFileURL(artifactTool).href);

const root='C:/Users/aimee/Documents/Codex/2026-11-12/referenced-chatgpt-conversation-this-is-an/outputs/READY72';
const build=path.join(root,'.build/presentation');
const render=path.join(build,'rendered');
const output=path.join(root,'submission');
await fs.mkdir(render,{recursive:true});
await fs.mkdir(output,{recursive:true});
const p=Presentation.create({slideSize:{width:1280,height:720}});

const C={dark:'#092D36',dark2:'#0F4147',teal:'#1E8272',lime:'#C8DF66',coral:'#CF8058',paper:'#F5F7F2',white:'#FFFFFF',ink:'#14363A',muted:'#596E6B',line:'#D7E1DC',soft:'#EAF0EB',red:'#A84438'};
const FONT='Arial';
function tx(slide,name,text,x,y,w,h,style={}){
  const shape=slide.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{style:'solid',fill:'none',width:0}});
  shape.text=text;
  shape.text.style={fontSize:style.size||22,typeface:FONT,color:style.color||C.ink,bold:style.bold||false,alignment:style.align||'left',verticalAlignment:style.valign||'top',autoFit:'shrinkText',wrap:'square',insets:style.insets??0,lineSpacing:style.lineSpacing||1.08,italic:style.italic||false};
  return shape;
}
function rule(slide,x,y,w,color=C.line,width=2){
  slide.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},fill:'none',line:{style:'solid',fill:color,width}});
}
function base(title,kicker,num,{bg=C.paper,dark=false}={}){
  const s=p.slides.add(); s.background.fill=bg;
  const ink=dark?C.white:C.ink, secondary=dark?'#B7CCCA':C.muted;
  if(kicker) tx(s,'section-label',kicker.toUpperCase(),68,48,460,24,{size:14,bold:true,color:dark?C.lime:C.teal});
  if(title) tx(s,'slide-title',title,68,88,1144,96,{size:46,bold:true,color:ink});
  rule(s,68,650,1144,dark?'#31565B':C.line,1);
  tx(s,'slide-number',`READY72  ·  ${String(num).padStart(2,'0')}`,68,666,360,22,{size:13,bold:true,color:secondary});
  return s;
}
function notes(slide,text){slide.speakerNotes.text=text;}

// 1. Title
{
  const s=p.slides.add(); s.background.fill=C.dark;
  tx(s,'cover-eyebrow','DATASTORY CAPSTONE  ·  IRELAND',74,72,700,28,{size:16,bold:true,color:C.lime});
  tx(s,'cover-title','READY72',74,165,740,105,{size:82,bold:true,color:C.white});
  tx(s,'cover-subtitle','Prepared with evidence.',80,278,850,62,{size:42,bold:true,color:C.lime});
  tx(s,'cover-description','A household information platform for current disruption signals, clear explanations and practical planning.',80,382,760,92,{size:26,color:'#D3E2DE'});
  rule(s,80,542,1118,'#3B6265',2);
  tx(s,'cover-presenter','Aimee Morrissey  ·  November 2026',80,566,800,32,{size:18,color:'#B8CDCA'});
  notes(s,'Working title for the DataStory Capstone. Confirm the required title, student details and course rubric when the full assessment brief is available.');
}

// 2. Decision question
{
  const s=base('A household needs to know what the evidence means','The problem',2);
  tx(s,'problem-statement','Preparedness guidance can feel broad when people cannot see what a current signal means for everyday life.',70,222,520,118,{size:29,bold:true,color:C.dark});
  tx(s,'decision-question','How can READY72 combine trusted public data and cited AI explanations so households can understand current information and take useful steps without exaggerating future risk?',690,214,500,154,{size:27,bold:true,color:C.teal});
  rule(s,70,412,1120,C.line,1);
  const blocks=[
    ['01','Show the signal','Who issued it, where it applies and when it was checked.'],
    ['02','Explain the limit','Separate alerts, observations, historical evidence and advice.'],
    ['03','Make a plan','Turn official guidance into steps a household can use.']
  ];
  blocks.forEach((b,i)=>{const x=74+i*386;tx(s,`step-${i}-num`,b[0],x,452,70,45,{size:34,bold:true,color:i===1?C.coral:C.teal});tx(s,`step-${i}-title`,b[1],x,501,330,34,{size:24,bold:true,color:C.ink});tx(s,`step-${i}-copy`,b[2],x,544,330,72,{size:18,color:C.muted});});
  notes(s,'The product direction follows the user’s stated concern that “be prepared” messaging can be vague. The official Be Emergency Ready campaign frames advice around being aware, making a plan and staying connected. READY72 is intended to explain evidence and household implications, not to challenge official warnings. Source: https://www.gov.ie/en/office-of-emergency-planning/campaigns/be-emergency-ready/');
}

// 3. Product flow
{
  const s=base('One view from trusted signal to household action','The product',3);
  const cols=[
    {x:72,n:'01',head:'See what is current',copy:'Met Éireann weather warnings\nOPW river observations\nNCSC cyber advisories\nESB and Uisce Éireann links'},
    {x:468,n:'02',head:'Ask why it matters',copy:'A source-grounded chatbot explains practical knock-on effects, cites its evidence and says what the data cannot establish.'},
    {x:864,n:'03',head:'Make a household plan',copy:'A private, printable checklist supports supplies, health needs, documents, contacts, pets and a 72-hour plan.'}
  ];
  cols.forEach((c,i)=>{tx(s,`product-step-${i}`,c.n,c.x,228,66,44,{size:34,bold:true,color:i===1?C.coral:C.teal});tx(s,`product-heading-${i}`,c.head,c.x,280,340,42,{size:25,bold:true,color:C.dark});rule(s,c.x,332,322,i===1?C.coral:C.teal,3);tx(s,`product-copy-${i}`,c.copy,c.x,362,330,176,{size:21,color:C.muted,lineSpacing:1.15});});
  tx(s,'product-privacy','The checklist stays in this browser. No account is required, and household plan details are not sent to the chatbot.',72,574,1096,42,{size:17,bold:true,color:C.dark2});
  notes(s,'Product scope reflects the READY72 working plan and the official household preparedness booklet. Electricity and water remain official-provider link-outs until supported, reusable feeds are confirmed. Sources: Be Emergency Ready https://www.gov.ie/en/office-of-emergency-planning/campaigns/be-emergency-ready/ ; Met Éireann warnings https://www.met.ie/weather-warnings ; OPW API https://waterlevel.ie/page/api/ ; NCSC alerts https://www.ncsc.gov.ie/news/ ; ESB PowerCheck https://powercheck.esbnetworks.ie/ ; Uisce Éireann updates https://www.water.ie/water-service-updates');
}

// 4. Data and method
{
  const s=base('A 1 km daily grid gives a large but imperfect dataset','The analysis',4);
  const nums=[['70,091','grid points in each annual file'],['3,653','calendar days across 2016–2025'],['≈256m','possible grid-point days']];
  nums.forEach((d,i)=>{const x=78+i*392;tx(s,`dataset-number-${i}`,d[0],x,232,340,74,{size:56,bold:true,color:i===1?C.coral:C.teal});tx(s,`dataset-label-${i}`,d[1],x,318,338,55,{size:21,color:C.muted});});
  rule(s,78,408,1124,C.line,1);
  tx(s,'research-question-label','MEASURE',78,442,170,24,{size:14,bold:true,color:C.teal});
  tx(s,'research-question','Share of valid grid-point days with rainfall ≥20 mm',78,474,520,52,{size:24,bold:true,color:C.dark});
  tx(s,'method-label','USE',700,442,140,24,{size:14,bold:true,color:C.coral});
  tx(s,'method-copy','Describe historical distribution. Do not treat this threshold as an official warning or a forecast.',700,474,480,72,{size:22,color:C.muted});
  tx(s,'data-footnote','2016–2025 · Met Éireann daily rainfall · 1 km Irish Grid · millimetres after /10 conversion',78,594,1060,28,{size:15,color:C.muted});
  notes(s,'Met Éireann says daily grids are 1 × 1 km, cover Ireland and are estimated using interpolation from station observations. Grid values omit the decimal point: 123 means 12.3 mm. The station network varies over time. The 10-year calendar span includes 3,653 days and 70,091 grid points per year. Source and methods: https://clidata.met.ie/cli/grids_daily/');
}

// 5. Spatial distribution chart
{
  const s=base('The same rainfall cut-off appears unevenly across grid cells','What the data shows',5);
  tx(s,'spatial-chart-intro','Grid-cell days at ≥20 mm across the full ten-year period',76,190,760,36,{size:22,bold:true,color:C.dark});
  const bins=['0–49 days','50–99 days','100–149 days','150–199 days','200–249 days','250+ days'];
  const counts=[17694,31624,11889,5006,2424,1454];
  s.charts.add('bar',{
    position:{left:66,top:238,width:828,height:344},
    categories:bins,
    series:[{name:'1 km grid cells',values:counts,fill:C.teal}],
    barOptions:{direction:'bar',grouping:'clustered',gapWidth:68},
    hasLegend:false,
    chartFill:'none',chartLine:{style:'solid',fill:'none',width:0},plotAreaFill:'none',plotAreaLine:{style:'solid',fill:'none',width:0},
    xAxis:{min:0,max:35000,majorUnit:10000,numberFormatCode:'#,##0',textStyle:{typeface:FONT,fontSize:14,fill:C.muted},majorGridlines:{style:'solid',fill:C.line,width:1},line:{style:'solid',fill:'none',width:0}},
    yAxis:{textStyle:{typeface:FONT,fontSize:16,fill:C.ink},line:{style:'solid',fill:'none',width:0}},
    dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:FONT,fontSize:14,fill:C.dark,bold:true}}
  });
  tx(s,'spatial-median','72',944,235,220,72,{size:56,bold:true,color:C.teal});
  tx(s,'spatial-median-label','median grid-cell days\nacross 2016–2025',944,307,245,58,{size:19,color:C.muted});
  tx(s,'spatial-p90','164',944,395,220,64,{size:45,bold:true,color:C.coral});
  tx(s,'spatial-p90-label','90th percentile',944,450,245,30,{size:19,color:C.muted});
  tx(s,'spatial-caveat','Grid cells are not households or a flood-risk map.',944,514,238,66,{size:18,bold:true,color:C.dark});
  tx(s,'chart-footnote','70,091 grid cells · threshold is descriptive · interpolated estimates',76,600,840,24,{size:15,color:C.muted});
  notes(s,'The chart bins 70,091 grid cells by the total number of valid days in 2016–2025 at or above 20 mm. The cell-frequency median is 72 days; the 90th percentile is 164 and 99th percentile is 280. These are historical spatial estimates, not household exposure, flood probability or a trend. The 2016-10-03 grid date was excluded from the main profile because it conflicts with the published 2016 station record and monthly context. Dataset source: https://clidata.met.ie/cli/grids_daily/');
}

// 6. Quality challenge
{
  const s=base('One anomalous date changes how the analysis must be read','Data quality',6);
  tx(s,'qa-peak','286.7 mm',78,228,410,86,{size:60,bold:true,color:C.red});
  tx(s,'qa-peak-label','maximum raw 1 km grid value\non 3 October 2016',80,316,420,62,{size:21,color:C.muted});
  tx(s,'qa-station','167.1 mm',666,228,390,86,{size:60,bold:true,color:C.teal});
  tx(s,'qa-station-label','Met Éireann’s highest observed\ndaily total in 2016, on that date',668,316,448,62,{size:21,color:C.muted});
  rule(s,80,412,1085,C.line,1);
  tx(s,'qa-decision','Decision: exclude the 70,091 grid values for that date from the primary profile; retain the raw values and record the reason.',80,444,1080,68,{size:25,bold:true,color:C.dark});
  tx(s,'qa-secondary','A second check found 51 negative values in 2022. They are excluded as invalid rainfall, not changed to zero.',80,542,1060,52,{size:20,color:C.muted});
  notes(s,'The 2016 file contains a 286.7 mm gridded estimate on 3 October and 232 cells above 167.1 mm. Met Éireann lists 167.1 mm at Killarney as the highest daily rainfall in 2016 on 3 October; its October summary describes 2016 as mainly anticyclonic and predominantly dry. A grid estimate is not a station observation, so this flags a conflict for sensitivity review rather than proving the grid is wrong. The whole date is omitted from the primary comparison pending clarification. Sources: https://www.met.ie/index.php/climate/weather-extreme-records ; https://www.met.ie/climate-statement-for-october-2021 ; https://clidata.met.ie/cli/grids_daily/');
}

// 7. Product decision
{
  const s=base('Prioritise source quality and clarity over a single risk score','Product decision',7);
  const rows=[
    ['Connect now','Weather warnings · river observations · cyber advisories','Show source, timestamp, location and evidence type.'],
    ['Link to authority','Electricity outages · water service updates','Do not imply a live integration without documented access and reuse terms.'],
    ['Explain with care','Historical rainfall · official preparedness guidance','Show limits, cite source passages and keep history separate from live alerts.']
  ];
  rows.forEach((r,i)=>{const y=224+i*118;tx(s,`decision-label-${i}`,r[0].toUpperCase(),78,y,208,28,{size:15,bold:true,color:i===1?C.coral:C.teal});tx(s,`decision-title-${i}`,r[1],300,y-2,420,53,{size:23,bold:true,color:C.dark});tx(s,`decision-detail-${i}`,r[2],758,y-2,415,69,{size:19,color:C.muted});if(i<2)rule(s,78,y+83,1092,C.line,1);});
  tx(s,'business-direction','The shop can follow later. The submitted product still includes the website, cited chatbot, dashboard, analysis and household plan.',78,584,1090,44,{size:18,bold:true,color:C.dark2});
  notes(s,'This source prioritisation is a product decision based on the source register. ESB Networks PowerCheck provides public fault information, but no supported third-party API or reuse terms were confirmed. Uisce Éireann lists service updates and open data, but the public Water Supply Zones spreadsheet is not an incident feed. Until documented access is confirmed, keep these as direct provider links. Sources: https://powercheck.esbnetworks.ie/ ; https://www.water.ie/water-service-updates ; https://www.water.ie/open-data ; OPW API https://waterlevel.ie/page/api/ ; NCSC https://www.ncsc.gov.ie/news/');
}

// 8. Evaluation and next gate
{
  const s=base('Five response-safety checks pass; real AI still needs a key','Evaluation and next step',8);
  const checks=[
    ['PASS','Power cuts','Link-out is clear; no live outage feed is claimed.'],
    ['PASS','Weather','Missing warning is not described as proof of safety.'],
    ['PASS','Flooding','River measurement stays distinct from a flood warning.'],
    ['PASS','Cyber','An advisory does not imply a household was compromised.'],
    ['PASS','General advice','Preparedness is not framed as an imminent event.']
  ];
  checks.forEach((r,i)=>{const y=211+i*61;tx(s,`test-status-${i}`,r[0],82,y,110,28,{size:16,bold:true,color:C.teal});tx(s,`test-name-${i}`,r[1],212,y-1,210,32,{size:20,bold:true,color:C.dark});tx(s,`test-copy-${i}`,r[2],438,y-1,725,34,{size:18,color:C.muted});if(i<4)rule(s,82,y+42,1080,C.line,1);});
  rule(s,82,536,1080,C.line,2);
  tx(s,'ai-blocker','These checks exercise the deterministic local preview. A server-side OpenAI API key and a deployed server runtime are needed to verify model-generated answers; neither is configured here.',82,557,1080,65,{size:18,bold:true,color:C.dark2});
  notes(s,'The five acceptance scenarios were run using node site/acceptance-tests.mjs; all five passed. These are response-safety checks of deterministic preview logic, not a model accuracy benchmark or live browser test. JavaScript syntax checks passed. The local Node server is configured to use the OpenAI Responses API with store:false when OPENAI_API_KEY is set, but no key is present in the current environment. Do not put a key in frontend code or the repository. Full assessment rubric and external user testing remain outstanding.');
}

// Export slide renderings and a draft deck for finalization.
for (const [i,slide] of p.slides.items.entries()) {
  const png=await p.export({slide,format:'png',scale:1});
  await fs.writeFile(path.join(render,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
}
const pptx=await PresentationFile.exportPptx(p);
const draft=path.join(build,'READY72_DataStory_Draft.pptx');
await pptx.save(draft);
const inspection=await p.inspect({kind:'slide,textbox,shape,chart,notes',maxChars:16000});
await fs.writeFile(path.join(build,'inspection.ndjson'),inspection.ndjson||'', 'utf8');
console.log(JSON.stringify({draft,slides:p.slides.items.length,rendered:render}));
