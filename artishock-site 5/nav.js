(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(!toggle) return;
  toggle.addEventListener('click', function(){
    links.classList.toggle('open');
  });
  // mark active link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a){
    if(a.getAttribute('href').split('#')[0] === path){ a.classList.add('active'); }
  });
})();
