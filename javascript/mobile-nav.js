document.addEventListener('DOMContentLoaded',function(){
  var toggleBtn=document.querySelector('button[aria-label="Open/Close Menu"]');
  var nav=document.querySelector('header nav');
  if(!toggleBtn||!nav){return;}
  var isOpen=false;
  function setOpen(v){
    isOpen=!!v;
    toggleBtn.setAttribute('aria-expanded',String(isOpen));
    if(isOpen){
      nav.style.opacity='1';
      nav.style.visibility='visible';
      nav.style.maxHeight='100vh';
      document.body.style.overflow='hidden';
      var iconOpen=toggleBtn.children[0];
      var iconClose=toggleBtn.children[1];
      if(iconOpen){iconOpen.style.opacity='0';iconOpen.style.transform='rotate(-90deg)';}
      if(iconClose){iconClose.style.opacity='1';iconClose.style.transform='rotate(0deg)';}
    }else{
      nav.style.opacity='';
      nav.style.visibility='';
      nav.style.maxHeight='';
      document.body.style.overflow='';
      var iconOpen2=toggleBtn.children[0];
      var iconClose2=toggleBtn.children[1];
      if(iconOpen2){iconOpen2.style.opacity='';iconOpen2.style.transform='';}
      if(iconClose2){iconClose2.style.opacity='';iconClose2.style.transform='';}
    }
  }
  toggleBtn.addEventListener('click',function(){setOpen(!isOpen);});
  nav.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a'):null;
    if(a){setOpen(false);} 
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setOpen(false);}});
});
