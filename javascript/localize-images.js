(function(){
  function isExternalUrl(url){
    try {
      // absolute http(s)
      return /^https?:\/\//i.test(url);
    } catch { return false; }
  }
  function isNextImageProxy(url){
    return /\/assets\/image\?url=/i.test(url);
  }

  function pickLocalImage(index){
    const localImages = [
      'Images/game-home.jpg',
      'Images/game-history.jpg',
      'Images/ats-candidate.png',
      'Images/enos.png',
      'Images/ats-dashbord.png',
      'Images/candidate.png',
      'Images/my-pic.jpg'
    ];
    return localImages[index % localImages.length];
  }

  function localizeAllImgs(){
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach((img, i)=>{
      const src = img.getAttribute('src') || '';
      const srcset = img.getAttribute('srcset') || '';
      const needsReplace = isExternalUrl(src) || isNextImageProxy(src) || isExternalUrl(srcset) || isNextImageProxy(srcset);
      if (needsReplace){
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.setAttribute('loading', img.getAttribute('loading') || 'lazy');
        img.src = pickLocalImage(i);
        // Some Next.js images rely on style="color: transparent"; keep other styles intact
      }
    });
  }

  function removeImagePreloads(){
    const links = document.querySelectorAll('link[rel="preload"][as="image"]');
    links.forEach(l=>l.parentNode && l.parentNode.removeChild(l));
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      removeImagePreloads();
      localizeAllImgs();
    });
  } else {
    removeImagePreloads();
    localizeAllImgs();
  }
})();
