(function(){
  var SINGLE_IMAGE_URL = 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D';

  function onReady(fn){ if(document.readyState!=='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn, {once:true}); } }

  function unifyAllImages(){
    // Replace <img> sources
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
    imgs.forEach(function(img){
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      if(!img.getAttribute('loading')) img.setAttribute('loading','lazy');
      img.src = SINGLE_IMAGE_URL;
    });

    // Replace <source> inside <picture>, if any
    var sources = Array.prototype.slice.call(document.querySelectorAll('picture source'));
    sources.forEach(function(s){ s.removeAttribute('srcset'); s.setAttribute('srcset', SINGLE_IMAGE_URL + ' 1x'); });

    // Update common social meta images
    var og = document.querySelector('meta[property="og:image"]');
    if(og) og.setAttribute('content', SINGLE_IMAGE_URL);
    var tw = document.querySelector('meta[name="twitter:image"]');
    if(tw) tw.setAttribute('content', SINGLE_IMAGE_URL);
  }

  function removeImagePreloads(){
    var links = document.querySelectorAll('link[rel="preload"][as="image"]');
    links.forEach(function(l){ if(l.parentNode) l.parentNode.removeChild(l); });
  }

  onReady(function(){
    removeImagePreloads();
    unifyAllImages();
  });
})();
