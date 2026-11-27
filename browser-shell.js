(() => {
  const tabsEl=document.querySelector('.browser-tabs');
  const addButton=document.getElementById('newTabButton');
  const address=document.getElementById('fakeAddress');
  const titleEl=document.querySelector('.browser-tab .tab-title');
  const initialFrame=document.getElementById('pageFrame');
  const routeMap={
    'store.html':'https://shop.freedeath.jp/',
    'product.html':'https://shop.freedeath.jp/dp/B0KIZUNA01',
    'email-check.html':'https://shop.freedeath.jp/ap/signin',
    'account-choice.html':'https://shop.freedeath.jp/ap/register',
    'register-demo.html':'https://shop.freedeath.jp/ap/register',
    'verify-code.html':'https://shop.freedeath.jp/ap/verify',
    'checkout-demo.html':'https://shop.freedeath.jp/checkout',
    'newtab.html':''
  };
  let nextId=2;
  const tabs=[{id:1,frame:initialFrame,el:document.querySelector('.browser-tab'),url:'store.html'}];
  let active=tabs[0];
  function getPath(tab){
    try{return tab.frame.contentWindow.location.pathname.split('/').pop()||'store.html';}
    catch(_){return tab.url;}
  }
  function sync(){
    if(!active)return;
    const path=getPath(active);
    address.value=routeMap[path]!==undefined?routeMap[path]:'https://shop.freedeath.jp/'+path;
    const docTitle=(()=>{try{return active.frame.contentDocument.title;}catch(_){return 'FREE DEATH';}})();
    active.el.querySelector('.tab-title').textContent=docTitle||'新しいタブ';
    active.el.querySelector('.tab-favicon').textContent=path==='newtab.html'?'G':'FD';
  }
  function activate(tab){
    active=tab;
    tabs.forEach(t=>{
      t.el.classList.toggle('active',t===tab);
      t.frame.style.display=t===tab?'block':'none';
    });
    sync();
  }
  function makeTab(url='newtab.html'){
    const id=nextId++;
    const el=document.createElement('div');
    el.className='browser-tab';
    el.dataset.tabId=String(id);
    el.innerHTML='<span class="tab-favicon">G</span><span class="tab-title">新しいタブ</span><button class="tab-close" type="button" aria-label="タブを閉じる">×</button>';
    const frame=document.createElement('iframe');
    frame.className='page-frame extra-page-frame';
    frame.title='新しいタブ';
    frame.src=url;
    frame.style.display='none';
    document.body.insertBefore(frame,document.querySelector('script'));
    const tab={id,el,frame,url};
    tabsEl.insertBefore(el,addButton);
    tabs.push(tab);
    frame.addEventListener('load',()=>{if(active===tab)sync();});
    el.addEventListener('click',e=>{
      if(e.target.closest('.tab-close')){closeTab(tab);return;}
      activate(tab);
    });
    activate(tab);
    return tab;
  }
  function closeTab(tab){
    if(tabs.length===1){tab.frame.src='store.html';tab.url='store.html';sync();return;}
    const idx=tabs.indexOf(tab);
    const next=tabs[idx-1]||tabs[idx+1];
    tab.frame.remove();tab.el.remove();tabs.splice(idx,1);
    if(active===tab)activate(next);
  }
  document.querySelector('.browser-tab').addEventListener('click',e=>{
    if(e.target.closest('.tab-close'))closeTab(tabs[0]);
    else activate(tabs[0]);
  });
  addButton.addEventListener('click',()=>makeTab('newtab.html'));
  initialFrame.addEventListener('load',()=>{if(active===tabs[0])sync();});
  document.getElementById('browserBack').addEventListener('click',()=>{try{active.frame.contentWindow.history.back();}catch(_){}});
  document.getElementById('browserForward').addEventListener('click',()=>{try{active.frame.contentWindow.history.forward();}catch(_){}});
  document.getElementById('browserReload').addEventListener('click',()=>{try{const w=active.frame.contentWindow;const current=w.location.href;w.location.replace(current);}catch(_){active.frame.src=active.frame.src;}});
  document.getElementById('browserHome').addEventListener('click',()=>{active.frame.src='store.html';active.url='store.html';});
  address.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();address.blur();}});
  const keys=new Set(['a','s','d']);let pressed=new Set(),busy=false;
  async function toggleFullscreen(){
    if(busy)return;busy=true;
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(_){}
    busy=false;
  }
  function keydown(e){
    const k=e.key.toLowerCase();if(!keys.has(k)||e.repeat)return;
    const target=e.target;if(target&&(target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(target.tagName)))return;
    pressed.add(k);if(pressed.size===3){e.preventDefault();toggleFullscreen();}
  }
  function keyup(e){pressed.delete(e.key.toLowerCase());}
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',()=>pressed.clear());
  function bindFrame(frame){
    try{frame.contentWindow.addEventListener('keydown',keydown);frame.contentWindow.addEventListener('keyup',keyup);frame.contentWindow.addEventListener('blur',()=>pressed.clear());}catch(_){}
  }
  tabs.forEach(t=>{t.frame.addEventListener('load',()=>bindFrame(t.frame));});
})();