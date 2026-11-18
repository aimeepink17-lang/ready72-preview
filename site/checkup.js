(() => {
  const questions=[
    {id:'water',title:'Could your household access enough drinking water for the first three days?',help:'The Irish Be Emergency Ready booklet recommends 2–3 litres per person per day. Adapt for your household and essential needs.',tip:'Use the household size calculator in Build a kit to estimate a starting amount of drinking water.',link:'kit.html#kits',linkText:'Open the water calculator'},
    {id:'food',title:'Do you have familiar, non-perishable food for about three days?',help:'Think about food that suits your household and can be prepared if power or water is disrupted.',tip:'Choose a few foods you already eat, check expiry dates, and rotate them as part of normal shopping.',link:'kit.html#kits',linkText:'Review the kit checklist'},
    {id:'light',title:'Could you manage basic light, warmth and phone charging if power was interrupted?',help:'Consider a torch, spare batteries, warm layers and a charged power bank. Use heating equipment safely.',tip:'Put a torch and charged power bank somewhere easy to find; check batteries and charging cables.',link:'kit.html#kits',linkText:'Review light and power items'},
    {id:'information',title:'Could you get important information if mobile data or broadband was unavailable?',help:'A battery or wind-up radio, written contacts and knowing which official channels to listen to can help.',tip:'Write down trusted contacts and identify a radio or another way to hear official updates.',link:'index.html#signals',linkText:'See READY72 source links'},
    {id:'health',title:'Do you have essential medicines, first aid and basic hygiene supplies to hand?',help:'Think about what members of your household need regularly and what could be difficult to replace at short notice.',tip:'Check prescriptions, first-aid basics and personal hygiene supplies; ask a pharmacist or clinician about medical needs.',link:'kit.html#kits',linkText:'Review health and hygiene items'},
    {id:'specific',title:'Have you considered needs specific to your household?',help:'This might include infants, disability or mobility needs, dietary requirements, older people or pets.',tip:'Add the items and support arrangements that matter to the people and animals in your home.',link:'kit.html#kits',linkText:'Personalise your kit checklist'},
    {id:'plan',title:'Do you have a simple plan and key contacts available if phones or internet fail?',help:'Include your Eircode, how household members will check in, important contacts and any evacuation needs.',tip:'Write down your Eircode and contacts, and agree how you will check in with each other.',link:'checkup.html#householdPlan',linkText:'Open the household plan'},
    {id:'cash',title:'Could you cover an essential small purchase if electronic payments were temporarily unavailable?',help:'A modest cash reserve may help. Choose an amount that is affordable and store it safely; no particular amount is required.',tip:'Consider keeping a small, affordable amount of cash securely, and check official guidance on offline payment options where available.',link:'kit.html#kits',linkText:'Add cash to your kit checklist'}
  ];
  const answers=Object.create(null);
  let current=0;
  const $=id=>document.getElementById(id);
  const questionRoot=$('quizQuestion');
  function answeredCount(){return Object.keys(answers).length;}
  function renderQuestion(){
    const q=questions[current];
    $('questionNumber').textContent=`QUESTION ${current+1} OF ${questions.length}`;
    $('questionProgressText').textContent=`${answeredCount()} of ${questions.length} answered`;
    $('questionProgressBar').style.width=`${current/questions.length*100}%`;
    $('previousQuestion').disabled=current===0;
    $('nextQuestion').innerHTML=current===questions.length-1?'See my results <span aria-hidden="true">→</span>':'Next question <span aria-hidden="true">→</span>';
    $('quizError').hidden=true;
    const selected=answers[q.id];
    questionRoot.innerHTML=`<fieldset class="quiz-fieldset"><legend tabindex="-1">${q.title}</legend><p class="quiz-help">${q.help}</p><div class="quiz-options"><label class="quiz-option"><input type="radio" name="${q.id}" value="2" ${selected==='2'?'checked':''}><span><b>Yes, ready</b><small>We have this covered.</small></span></label><label class="quiz-option"><input type="radio" name="${q.id}" value="1" ${selected==='1'?'checked':''}><span><b>Partly</b><small>We have started, with a few gaps.</small></span></label><label class="quiz-option"><input type="radio" name="${q.id}" value="0" ${selected==='0'?'checked':''}><span><b>Not yet / not sure</b><small>I could use a practical next step.</small></span></label></div></fieldset>`;
    questionRoot.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{answers[q.id]=input.value;$('questionProgressText').textContent=`${answeredCount()} of ${questions.length} answered`;$('quizError').hidden=true;}));
  }
  function showResults(){
    const uncovered=questions.filter(q=>answers[q.id]==='0').length;
    const partlyCovered=questions.some(q=>answers[q.id]==='1');
    const resultTitle=uncovered>3?'A useful place to start.':uncovered>0||partlyCovered?'You’re building your household baseline.':'Many useful basics are in place.';
    $('resultsTitle').textContent=resultTitle;
    const gaps=questions.filter(q=>Number(answers[q.id]||0)<2).sort((a,b)=>Number(answers[a.id]||0)-Number(answers[b.id]||0)).slice(0,3);
    $('resultSummary').textContent=gaps.length?'Your answers highlight a few areas you could strengthen at your own pace. These suggestions are a starting point, not a measure of risk.':'You marked each area as covered. Review supplies occasionally and adapt your plan when household needs change.';
    const covered=$('coveredList');covered.replaceChildren();
    const coveredItems=questions.filter(q=>answers[q.id]==='2');
    if(!coveredItems.length){const note=document.createElement('p');note.className='covered-empty';note.textContent='You have not marked any area as fully covered yet. That is okay—choose one practical step to begin.';covered.append(note);}
    else coveredItems.forEach(q=>{const item=document.createElement('span');item.className='covered-item';item.textContent=q.title.replace(/^Could your household |^Do you have |^Could you |^Have you |^Have you considered |^Do you /,'').replace(/\?$/,'');covered.append(item);});
    const list=$('recommendationList');list.replaceChildren();
    if(!gaps.length){const message=document.createElement('p');message.className='recommendation-all-set';message.textContent='Your answers suggest you have the basics covered. Use the full checklist below to review details and tailor the plan.';list.append(message);}
    else gaps.forEach(q=>{
      const card=document.createElement('article');card.className='recommendation-card';
      const label=document.createElement('span');label.className='recommendation-status';label.textContent=answers[q.id]==='1'?'PARTLY COVERED':'A NEXT STEP';
      const heading=document.createElement('h4');heading.textContent=q.title;
      const text=document.createElement('p');text.textContent=q.tip;
      const link=document.createElement('a');link.href=q.link;link.textContent=q.linkText;link.setAttribute('aria-label',`${q.linkText}: ${q.title}`);
      card.append(label,heading,text,link);list.append(card);
    });
    $('readinessQuiz').hidden=true;$('readinessResults').hidden=false;$('resultsTitle').focus();
  }
  $('nextQuestion').addEventListener('click',()=>{
    const q=questions[current];
    if(!Object.hasOwn(answers,q.id)){$('quizError').hidden=false;return;}
    if(current<questions.length-1){current++;renderQuestion();questionRoot.querySelector('legend').focus();}
    else showResults();
  });
  $('previousQuestion').addEventListener('click',()=>{if(current>0){current--;renderQuestion();questionRoot.querySelector('legend').focus();}});
  $('retakeCheck').addEventListener('click',()=>{$('readinessResults').hidden=true;$('readinessQuiz').hidden=false;current=0;renderQuestion();window.scrollTo({top:0,behavior:'smooth'});});
  renderQuestion();
})();
