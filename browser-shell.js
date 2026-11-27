(() => {
  const frame=document.getElementById('pageFrame');
  const address=document.getElementById('fakeAddress');
  const title=document.querySelector('.browser-tab .tab-title');
  const root='https://shop.freedeath.jp/';
  const routeMap={
    'store.html':'https://shop.freedeath.jp/',
    'product.html':'https://shop.freedeath.jp/dp/B0KIZUNA01',
    'email-check.html':'https://shop.freedeath.jp/ap/signin',
    'account-choice.html':'https://shop.freedeath.jp/ap/register',
    'register-demo.html':'https://shop.freedeath.jp/ap/register',
    'verify-code.html':'https://shop.freedeath.jp/ap/verify',
    'checkout-demo.html':'https://shop.freedeath.jp/checkout'
  };
  function sync(){
    try{
      const path=frame.contentWindow.location.pathname.split('/').pop()||'store.html';
      address.value=routeMap[path]||('https://shop.freedeath.jp/'+path);
      title.textContent=frame.contentDocument.title||'FREE DEATH';
    }catch(_){}
  }
  frame.addEventListener('load',sync);
  document.getElementById('browserBack').addEventListener('click',()=>frame.contentWindow.history.back());
  document.getElementById('browserForward').addEventListener('click',()=>frame.contentWindow.history.forward());
  document.getElementById('browserReload').addEventListener('click',()=>frame.contentWindow.location.reload());
  document.getElementById('browserHome').addEventListener('click',()=>{frame.src='store.html';});
  address.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();address.blur();}});
  const keys=new Set(['a','s','d']);
  let pressed=new Set(),busy=false;
  async function toggleFullscreen(){
    if(busy)return;busy=true;
    try{
      if(document.fullscreenElement)await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    }catch(_){}
    busy=false;
  }
  function keydown(e){
    const k=e.key.toLowerCase();
    if(!keys.has(k)||e.repeat)return;
    const active=e.target;
    if(active&&(active.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(active.tagName)))return;
    pressed.add(k);
    if(pressed.size===3){e.preventDefault();toggleFullscreen();}
  }
  function keyup(e){pressed.delete(e.key.toLowerCase());}
  window.addEventListener('keydown',keydown);
  window.addEventListener('keyup',keyup);
  window.addEventListener('blur',()=>pressed.clear());
  frame.addEventListener('load',()=>{
    try{
      frame.contentWindow.addEventListener('keydown',keydown);
      frame.contentWindow.addEventListener('keyup',keyup);
      frame.contentWindow.addEventListener('blur',()=>pressed.clear());
    }catch(_){}
  });
})();