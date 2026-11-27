(function(){
  const keys = new Set(['a','s','d']);
  const pressed = new Set();
  let busy = false;
  const enabled = sessionStorage.getItem('freeDeathFlowFullscreen') === '1';
  if (enabled) document.body.classList.add('flow-pseudo-fullscreen');

  async function toggleMode(){
    if (busy) return;
    busy = true;
    const active = sessionStorage.getItem('freeDeathFlowFullscreen') === '1';
    if (active) {
      sessionStorage.removeItem('freeDeathFlowFullscreen');
      document.body.classList.remove('flow-pseudo-fullscreen');
      if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch (_) {}
      }
    } else {
      sessionStorage.setItem('freeDeathFlowFullscreen','1');
      document.body.classList.add('flow-pseudo-fullscreen');
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (_) {
        // The persistent CSS mode remains active if native fullscreen is unavailable.
      }
    }
    busy = false;
  }

  window.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (!keys.has(key) || event.repeat) return;
    pressed.add(key);
    if (pressed.size === 3) {
      event.preventDefault();
      toggleMode();
    }
  });
  window.addEventListener('keyup', event => pressed.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => pressed.clear());
})();