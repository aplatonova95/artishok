(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('[data-reveal]');
  if(!items.length) return;

  if(reduceMotion || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.16, rootMargin:'0px 0px -8% 0px' });

  items.forEach(function(el, idx){
    el.style.transitionDelay = (idx % 3) * 70 + 'ms';
    io.observe(el);
  });
})();
