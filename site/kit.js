(() => {
  const root=document.getElementById('kitChecklist');
  if(!root)return;
  const boxes=[...root.querySelectorAll('[data-kit-item]')];
  let saved={};
  try{saved=JSON.parse(localStorage.getItem('ready72Kit')||'{}')||{};}catch{saved={};}
  boxes.forEach(box=>box.checked=Boolean(saved[box.dataset.kitItem]));
  const updateProgress=()=>{
    const done=boxes.filter(box=>box.checked).length;
    document.getElementById('kitProgressText').textContent=`${done} of ${boxes.length} essentials checked`;
    document.getElementById('kitProgressBar').style.width=`${boxes.length?done/boxes.length*100:0}%`;
  };
  const updateWater=()=>{
    const field=document.getElementById('kitHouseholdSize');
    const count=Math.max(1,Math.min(20,Number.parseInt(field.value,10)||1));
    document.getElementById('kitWaterMin').textContent=String(count*6);
    document.getElementById('kitWaterMax').textContent=String(count*9);
  };
  boxes.forEach(box=>box.addEventListener('change',()=>{
    const state=Object.fromEntries(boxes.map(item=>[item.dataset.kitItem,item.checked]));
    try{localStorage.setItem('ready72Kit',JSON.stringify(state));}catch{}
    updateProgress();
  }));
  const size=document.getElementById('kitHouseholdSize');
  size.addEventListener('input',updateWater);
  size.addEventListener('change',()=>{size.value=String(Math.max(1,Math.min(20,Number.parseInt(size.value,10)||1)));updateWater();});
  document.getElementById('printKit').addEventListener('click',()=>window.print());
  updateWater();updateProgress();
})();
