(function(){
  function onReady(cb){ if(document.readyState!=='loading'){ cb(); } else { document.addEventListener('DOMContentLoaded', cb, {once:true}); } }
  function hasVisClass(el){ return /(opacity-|visible|invisible|blur-)/.test(el.className||''); }
  function findVisBlock(el){ var cur=el; while(cur && cur !== document.body){ if(cur instanceof HTMLElement && hasVisClass(cur)) return cur; cur = cur.parentElement; } return el; }
  function show(el){ el.classList.remove('opacity-0','invisible','blur-lg'); el.classList.add('opacity-100','visible','blur-0'); }
  function hide(el){ el.classList.remove('opacity-100','visible','blur-0'); el.classList.add('opacity-0','invisible','blur-lg'); }
  function closestWrapper(el){ var cur=el; while(cur && cur!==document.body){ if(cur.querySelector('[class*="min-w-[512px]"]') || cur.querySelector('[class*="relative"][class*="overflow-hidden"]')) return cur; cur = cur.parentElement; } return el.parentElement || el; }

  onReady(function(){
    var tabStrips = Array.prototype.slice.call(document.querySelectorAll('[class*="rounded-full"][class*="shadow-inner-white-sm/10"]'));
    tabStrips = tabStrips.filter(function(strip){ return strip.querySelectorAll('button[aria-label]').length > 1; });
    if(!tabStrips.length) return;

    tabStrips.forEach(function(tabStrip){
      var buttons = Array.prototype.slice.call(tabStrip.querySelectorAll('button[aria-label]'));
      if(buttons.length < 2) return;
      tabStrip.setAttribute('role','tablist');

      var names = buttons.map(function(b){ return (b.getAttribute('aria-label') || b.textContent || '').trim(); });
      var wrapper = closestWrapper(tabStrip);

      // Build mapping per tab group
      var map = {};
      function pushMap(name, nodes){ map[name] = (map[name]||[]).concat(nodes.filter(Boolean).map(findVisBlock)); }

      if(names.indexOf('Persona') !== -1){
        pushMap('Persona', Array.prototype.slice.call(wrapper.querySelectorAll('img[alt*="Persona"]')));
        pushMap('Style', Array.prototype.slice.call(wrapper.querySelectorAll('img[alt^="Style"]')));
        // Prompt pill and prompt image
        var promptText = wrapper.querySelector('span.ml-1');
        if(promptText){ pushMap('Prompt', [promptText.closest('[class*="opacity-"]')]); }
        pushMap('Prompt', Array.prototype.slice.call(wrapper.querySelectorAll('img[alt^="prompt" i]')));
        pushMap('Link', Array.prototype.slice.call(wrapper.querySelectorAll('img[alt^="Link" i]')));
        pushMap('Sketch', Array.prototype.slice.call(wrapper.querySelectorAll('img[alt^="sketch" i], img[alt^="sketches" i]')));
      }

      if(names.indexOf('FaceSwap') !== -1){
        pushMap('FaceSwap', Array.prototype.slice.call(wrapper.querySelectorAll('img[src*="faceswap"]')));
        pushMap('Add Image', Array.prototype.slice.call(wrapper.querySelectorAll('img[src*="addimage"]')));
        pushMap('Add Text', Array.prototype.slice.call(wrapper.querySelectorAll('img[src*="addtext"]')));
        pushMap('Enhancer', Array.prototype.slice.call(wrapper.querySelectorAll('img[src*="enhancer"]')));
        // "Edit" seems to refer to background edit in assets name
        pushMap('Edit', Array.prototype.slice.call(wrapper.querySelectorAll('img[src*="bgedit"]')));
      }

      if(names.indexOf('Topic') !== -1){
        // Topic panel is the visible text input pill near top with span.ml-1
        var topic = wrapper.querySelector('span.ml-1');
        if(topic){ pushMap('Topic', [topic.closest('[class*="opacity-"]')]); }
        // Thumbnail panel image
        pushMap('Thumbnail', Array.prototype.slice.call(wrapper.querySelectorAll('img[src*="generate.webp"]')));
      }

      // If nothing mapped, fallback: use panels by order in wrapper
      var allBlocks = [];
      Object.keys(map).forEach(function(k){ (map[k]||[]).forEach(function(el){ if(el && allBlocks.indexOf(el)===-1) allBlocks.push(el); }); });
      if(!allBlocks.length){
        // Fallback: collect unique blocks with visibility classes in wrapper
        allBlocks = Array.prototype.slice.call(wrapper.querySelectorAll('[class*="opacity-0"], [class*="opacity-100"], [class*="invisible"], [class*="visible"]'))
          .map(findVisBlock)
          .filter(function(el, idx, arr){ return el && arr.indexOf(el)===idx; });
        // Map sequentially to buttons
        buttons.forEach(function(btn, i){ map[(btn.getAttribute('aria-label')||btn.textContent||'').trim()] = [allBlocks[i]].filter(Boolean); });
      }

      // Active/inactive styles
      var activeAdd = ['border','border-primary-green/25','bg-primary-green/15','text-primary-green','opacity-100','shadow-inner-green-sm/10','drop-shadow-[0_0px_10px_rgba(43,251,205,0.35)]'];
      var activeRem = ['border-transparent','opacity-70'];
      var inactiveAdd = ['border','border-transparent','opacity-70'];
      var inactiveRem = ['border-primary-green/25','bg-primary-green/15','text-primary-green','shadow-inner-green-sm/10','drop-shadow-[0_0px_10px_rgba(43,251,205,0.35)]'];

      // Prepare blocks set
      var uniqueBlocks = [];
      Object.keys(map).forEach(function(k){ (map[k]||[]).forEach(function(el){ if(el && uniqueBlocks.indexOf(el)===-1) uniqueBlocks.push(el); }); });

      function setActive(name){
        // Tabs UI
        buttons.forEach(function(btn){
          var isActive = ((btn.getAttribute('aria-label')||btn.textContent||'').trim()===name);
          btn.setAttribute('role','tab');
          btn.setAttribute('aria-selected', String(isActive));
          inactiveAdd.forEach(function(c){ if(!btn.classList.contains(c)) btn.classList.add(c); });
          inactiveRem.forEach(function(c){ btn.classList.remove(c); });
          if(isActive){ activeRem.forEach(function(c){ btn.classList.remove(c); }); activeAdd.forEach(function(c){ if(!btn.classList.contains(c)) btn.classList.add(c); }); }
        });
        // Content visibility
        if(uniqueBlocks.length){ uniqueBlocks.forEach(hide); (map[name]||[]).forEach(show); }
        // Special: pricing toggle data attr for external styling if needed
        if(names.indexOf('Monthly')!==-1 && names.indexOf('Yearly')!==-1){ document.body.setAttribute('data-billing', name.toLowerCase()); }
      }

      // Wire events
      buttons.forEach(function(btn){
        var name = (btn.getAttribute('aria-label')||btn.textContent||'').trim();
        btn.addEventListener('click', function(e){ e.preventDefault(); setActive(name); });
        btn.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){ e.preventDefault(); setActive(name); }});
      });

      // Initialize
      var initial = buttons.find(function(b){ return /text-primary-green\b/.test(b.className); }) || buttons[0];
      if(initial){ setActive((initial.getAttribute('aria-label')||initial.textContent||'').trim()); }
    });
  });
})();
