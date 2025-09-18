(function(){
  function onReady(fn){ if(document.readyState!=='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn, {once:true}); } }

  onReady(function(){
    var faqRoot = document.getElementById('faq');
    if(!faqRoot) return;

    var panels = faqRoot.querySelectorAll('.transition-height');
    panels.forEach(function(panel, idx){
      var header = panel.previousElementSibling;
      if(!header) return;

      // Ensure unique ids and aria wiring
      var panelId = panel.id || ('faq-panel-' + idx);
      panel.id = panelId;
      header.setAttribute('role','button');
      header.setAttribute('tabindex','0');
      header.setAttribute('aria-controls', panelId);
      panel.setAttribute('role','region');
      panel.setAttribute('aria-labelledby', panelId + '-label');

      // Attach an id to label (h4) if available
      var label = header.querySelector('h4');
      if(label){
        var labelId = panelId + '-label';
        label.id = labelId;
      }

      // Determine initial open state by class (max-h-96 considered open)
      var initiallyOpen = /max-h-96\b/.test(panel.className) || (panel.style.maxHeight && panel.style.maxHeight !== '0px');
      setOpen(panel, header, initiallyOpen, true);

      function toggle(){ setOpen(panel, header, !isOpen(panel), false); }
      header.addEventListener('click', function(e){ e.preventDefault(); toggle(); });
      header.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
          e.preventDefault(); toggle();
        }
      });
    });

    function isOpen(panel){
      return panel.getAttribute('aria-hidden') === 'false';
    }

    function setOpen(panel, header, open, isInit){
      header.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      if(open){
        // Temporarily set to 'auto' height by measuring scrollHeight for smooth transition
        var target = panel.scrollHeight;
        panel.style.maxHeight = target + 'px';
      } else {
        panel.style.maxHeight = '0px';
      }

      // Toggle plus icon rotation if present
      var icon = header.querySelector('.rotate-45');
      if(icon){
        if(open){ icon.classList.remove('rotate-45'); }
        else { if(!icon.classList.contains('rotate-45')) icon.classList.add('rotate-45'); }
      }

      // Ensure transition class exists
      if(!/transition-height/.test(panel.className)){
        panel.className += ' transition-height';
      }

      // On init, if open and no inline style set, ensure height set so it doesn't collapse
      if(isInit && open && !panel.style.maxHeight){
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }
  });
})();
