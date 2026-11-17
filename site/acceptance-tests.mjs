import assert from 'node:assert/strict';

process.env.READY72_TEST_NO_LISTEN = '1';
const { fallbackAnswer } = await import('./server.mjs');
const noLiveSources = {
  weather:{status:'unavailable',data:[]},
  river:{status:'unavailable',data:{features:[]}},
  cyber:{status:'unavailable',data:[]},
  water:{status:'unavailable',data:[],area:'Cork'}
};

const cases = [
  {
    name:'Power cuts explain the experimental feed and its limits',
    question:'Why prepare for a power cut?',
    expected:['heating','PowerCheck','experimental view','does not confirm service at a particular address'],
    sources:2
  },
  {
    name:'Missing weather warnings are not described as safety',
    question:'Is there a storm warning for Cork?',
    county:'Cork',
    expected:['couldn’t verify an active warning','not evidence that there is no local risk'],
    sources:2
  },
  {
    name:'River measurements are not treated as flood warnings',
    question:'Is this river gauge reading a flood warning?',
    expected:['observation, not a flood warning','single reading also cannot tell us'],
    sources:2
  },
  {
    name:'Cyber advisories do not imply household compromise',
    question:'Does this cyber advisory mean my device was attacked?',
    expected:['does not mean your household has been attacked','product and its recommended action'],
    sources:2
  },
  {
    name:'The 72-hour baseline is not presented as an outage forecast',
    question:'Why is 72 hours recommended?',
    expected:['at least 72 hours','initial phase of a crisis can put response systems under pressure','does not mean an outage is expected to last three days'],
    sources:2
  },
  {
    name:'Water answers use county-filtered provider records and explain their limits',
    question:'Are there water service notices in Cork?',
    county:'Cork',
    live:{water:{status:'ok',checkedAt:'2026-11-16T18:00:00.000Z',area:'Cork',data:[{type:'Boil water notice',title:'Example notice',location:'Example area',county:'Cork'}]}},
    expected:['returned 1 open, approved Uisce Éireann map listing','Example notice','provider-listed notices','not confirmation of the status at a particular home'],
    sources:2
  }
];

for (const test of cases) {
  const result=fallbackAnswer(test.question,test.live||noLiveSources,test.county||'all');
  for (const phrase of test.expected) assert.ok(result.answer.toLowerCase().includes(phrase.toLowerCase()),`${test.name}: missing “${phrase}”`);
  assert.equal(result.mode,'local-preview',`${test.name}: preview mode should be explicit`);
  assert.equal(result.sources.length,test.sources,`${test.name}: source count`);
  assert.ok(result.sources.every(source=>source.url.startsWith('https://')),`${test.name}: all sources should be official HTTPS links`);
  console.log(`PASS ${test.name}`);
}

console.log(`\n${cases.length}/${cases.length} READY72 response-safety acceptance checks passed.`);
