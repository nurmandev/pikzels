(function(){
  function onReady(cb){ if(document.readyState!=='loading'){ cb(); } else { document.addEventListener('DOMContentLoaded', cb, {once:true}); } }

  function hasVisClass(el){ return /(opacity-|visible|invisible|blur-)/.test(el.className||''); }
  function findVisBlock(el){ var cur=el; while(cur && cur !== document.body){ if(cur instanceof HTMLElement && hasVisClass(cur)) return cur; cur = cur.parentElement; } return el; }
  function show(el){ el.classList.remove('opacity-0','invisible','blur-lg'); el.classList.add('opacity-100','visible','blur-0'); }
  function hide(el){ el.classList.remove('opacity-100','visible','blur-0'); el.classList.add('opacity-0','invisible','blur-lg'); }

  onReady(function(){
    var features = document.getElementById('features');
    if(!features) return;

    var tabStrip = features.querySelector('[class*="rounded-full"][class*="shadow-inner-white-sm/10"]');
    if(!tabStrip) return;
    tabStrip.setAttribute('role','tablist');

    var buttons = Array.prototype.slice.call(tabStrip.querySelectorAll('button[aria-label]'));
    if(!buttons.length) return;

    var activeAdd = ['border','border-primary-green/25','bg-primary-green/15','text-primary-green','opacity-100','shadow-inner-green-sm/10','drop-shadow-[0_0px_10px_rgba(43,251,205,0.35)]'];
    var activeRem = ['border-transparent','opacity-70'];
    var inactiveAdd = ['border','border-transparent','opacity-70'];
    var inactiveRem = ['border-primary-green/25','bg-primary-green/15','text-primary-green','shadow-inner-green-sm/10','drop-shadow-[0_0px_10px_rgba(43,251,205,0.35)]'];

    // Map tab names to target content by alt attributes
    var contentMap = {
      Persona: Array.prototype.slice.call(features.querySelectorAll('img[alt*="Persona"]')).map(findVisBlock),
      Style: Array.prototype.slice.call(features.querySelectorAll('img[alt^="Style"]')).map(findVisBlock),
      Prompt: Array.prototype.slice.call(features.querySelectorAll('img[alt^="prompt" i]')).map(findVisBlock),
      Link: Array.prototype.slice.call(features.querySelectorAll('img[alt^="link" i]')).map(findVisBlock),
      Sketch: Array.prototype.slice.call(features.querySelectorAll('img[alt^="sketch" i], img[alt^="sketches" i]')).map(findVisBlock)
    };

    // Also include the text prompt pill div near the prompt image if present
    var promptText = features.querySelector('span.ml-1') && features.querySelector('span.ml-1').closest('[class*="opacity-"]');
    if(promptText){ (contentMap.Prompt = contentMap.Prompt || []).push(promptText); }

    // Collect all unique blocks to hide/show
    var allBlocks = [];
    Object.keys(contentMap).forEach(function(k){ (contentMap[k]||[]).forEach(function(el){ if(el && allBlocks.indexOf(el)===-1) allBlocks.push(el); }); });

    function setActive(name){
      // Tabs UI
      buttons.forEach(function(btn){
        var isActive = (btn.getAttribute('aria-label')===name);
        btn.setAttribute('role','tab');
        btn.setAttribute('aria-selected', String(isActive));
        inactiveAdd.forEach(function(c){ if(!btn.classList.contains(c)) btn.classList.add(c); });
        inactiveRem.forEach(function(c){ btn.classList.remove(c); });
        if(isActive){
          activeRem.forEach(function(c){ btn.classList.remove(c); });
          activeAdd.forEach(function(c){ if(!btn.classList.contains(c)) btn.classList.add(c); });
        }
      });

      // Content visibility
      allBlocks.forEach(hide);
      (contentMap[name]||[]).forEach(show);
    }

    // Wire clicks and keyboard navigation
    buttons.forEach(function(btn){
      var name = btn.getAttribute('aria-label');
      btn.addEventListener('click', function(e){ e.preventDefault(); setActive(name); });
      btn.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){ e.preventDefault(); setActive(name); }});
    });

    // Initialize to the button that already has active styling else default to first
    var initial = buttons.find(function(b){ return /text-primary-green\b/.test(b.className); }) || buttons[0];
    if(initial){ setActive(initial.getAttribute('aria-label')); }
  });
})();
