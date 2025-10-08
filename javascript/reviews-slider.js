(function(){
  function onReady(fn){ if(document.readyState!=='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn, {once:true}); } }

  onReady(function(){
    var reviewsSection = document.getElementById('reviews');
    if(!reviewsSection) return;
    var list = reviewsSection.querySelector('ul.isolate');
    if(!list) return;

    var items = Array.prototype.slice.call(list.children).filter(function(n){ return n && n.tagName === 'LI'; });
    if(!items.length) return;

    var maxItems = 8;
    var selected = items.slice(0, maxItems);

    // Build slider wrapper
    var slider = document.createElement('div');
    slider.className = 'reviews-slider w-full relative';
    var track = document.createElement('div');
    track.className = 'reviews-track';
    track.id = 'reviews-track';
    slider.appendChild(track);

    // Move first 8 items into track, mark as slides
    selected.forEach(function(li){ li.classList.add('reviews-slide'); track.appendChild(li); });

    // Remove remaining items
    items.slice(maxItems).forEach(function(li){ li.parentNode && li.parentNode.removeChild(li); });

    // Replace original list with slider
    list.parentNode.insertBefore(slider, list);
    list.parentNode.removeChild(list);

    // Controls
    function makeBtn(dir){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-controls', 'reviews-track');
      btn.setAttribute('aria-label', dir==='prev' ? 'Previous testimonials' : 'Next testimonials');
      btn.className = (dir==='prev' ? 'reviews-prev left-4' : 'reviews-next right-4') + ' absolute top-1/2 -translate-y-1/2 z-[30] group p-px bg-white/[1%] border-[1.5px] border-white/[5%] rounded-full';
      btn.innerHTML = '<div class="relative z-10 bg-white/10 group-hover:bg-white/15 duration-300 rounded-full w-9 h-9 flex items-center justify-center text-white/90 border-[1.5px] border-white/10">' +
        (dir==='prev' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="m10 6 1.41 1.41L7.83 11H20v2H7.83l3.58 3.59L10 18l-6-6z"/></svg>') +
      '</div>';
      return btn;
    }

    var prevBtn = makeBtn('prev');
    var nextBtn = makeBtn('next');
    slider.appendChild(prevBtn);
    slider.appendChild(nextBtn);

    var slides = Array.prototype.slice.call(track.children);
    var index = 0;

    // Equalize heights so all slides match
    function equalizeHeights(){
      var maxH = 0;
      slides.forEach(function(li){
        li.style.height = '';
        var child = li.firstElementChild || li;
        var h = child ? child.getBoundingClientRect().height : li.getBoundingClientRect().height;
        if(h > maxH) maxH = h;
      });
      if(maxH > 0){
        slides.forEach(function(li){ li.style.height = maxH + 'px'; });
        track.style.height = maxH + 'px';
        slider.style.height = maxH + 'px';
      }
    }

    function perView(){
      var w = slider.clientWidth || window.innerWidth;
      if(w >= 1280) return 3; // xl
      if(w >= 768) return 2;  // md
      return 1;               // base
    }

    function clamp(val, min, max){ return Math.max(min, Math.min(max, val)); }

    function goTo(newIndex){
      var pv = perView();
      index = clamp(newIndex, 0, Math.max(0, slides.length - pv));
      var target = slides[index];
      if(!target){ return; }
      var baseLeft = target.offsetLeft;
      track.style.transform = 'translateX(' + (-baseLeft) + 'px)';
      updateButtons();
    }

    function updateButtons(){
      var pv = perView();
      var atStart = index <= 0;
      var atEnd = index >= Math.max(0, slides.length - pv);
      prevBtn.disabled = atStart; nextBtn.disabled = atEnd;
      prevBtn.style.opacity = atStart ? '0.4' : '';
      nextBtn.style.opacity = atEnd ? '0.4' : '';
      prevBtn.style.pointerEvents = atStart ? 'none' : '';
      nextBtn.style.pointerEvents = atEnd ? 'none' : '';
    }

    prevBtn.addEventListener('click', function(){ goTo(index - perView()); });
    nextBtn.addEventListener('click', function(){ goTo(index + perView()); });

    // Keyboard support
    slider.setAttribute('role','region');
    slider.setAttribute('aria-roledescription','carousel');
    slider.setAttribute('aria-label','User testimonials');
    slider.tabIndex = 0;
    slider.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){ e.preventDefault(); goTo(index - perView()); }
      if(e.key === 'ArrowRight'){ e.preventDefault(); goTo(index + perView()); }
    });

    // Resize handling
    var resizeTimer;
    window.addEventListener('resize', function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){ equalizeHeights(); goTo(index); }, 150);
    });

    // Autoplay
    var autoplayDelay = 3500;
    var autoplayTimer;
    function step(){
      var pv = perView();
      var atEnd = index >= Math.max(0, slides.length - pv);
      if(atEnd){ goTo(0); }
      else { goTo(index + pv); }
    }
    function start(){ stop(); autoplayTimer = setInterval(step, autoplayDelay); }
    function stop(){ if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    // Initialize
    equalizeHeights();
    // Re-equalize after images load
    if(document.readyState !== 'complete') window.addEventListener('load', function(){ setTimeout(function(){ equalizeHeights(); goTo(0); }, 50); });
    goTo(0);
    start();
  });
})();
