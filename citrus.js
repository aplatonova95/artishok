(function(){
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  var brush = document.getElementById('brush');
  var lastX = null, lastY = null;

  if(brush && !isTouch){
    window.addEventListener('mousemove', function(e){
      brush.style.transform = 'translate(' + (e.clientX-17) + 'px,' + (e.clientY-17) + 'px)';
      if(lastX !== null){
        var dx = e.clientX-lastX, dy = e.clientY-lastY;
        if(Math.abs(dx)+Math.abs(dy) > 1.5){
          var angle = Math.atan2(dy,dx)*180/Math.PI + 90;
          brush.querySelector('g').setAttribute('transform','translate(17,17) rotate('+angle+')');
        }
      }
      lastX = e.clientX; lastY = e.clientY;
    });
    document.querySelectorAll('.fruit-canvas').forEach(function(cv){
      cv.addEventListener('mouseenter', function(){ brush.classList.add('visible'); });
      cv.addEventListener('mouseleave', function(){ brush.classList.remove('visible'); });
    });
  } else if(brush){
    brush.style.display = 'none';
  }

  function setupFruit(id, opts){
    opts = opts || {};
    var canvas = document.getElementById(id);
    if(!canvas) return;
    var holder = canvas.parentElement;
    var fill = document.getElementById(id+'-fill');
    var caption = document.getElementById(id+'-caption');
    var locked = opts.locked;
    var sketchSrc = canvas.getAttribute('data-sketch');
    var sketchImg = null;

    function draw(){
      var ctx = canvas.getContext('2d');
      var rect = holder.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,rect.width,rect.height);
      if(sketchImg){
        ctx.drawImage(sketchImg, 0, 0, rect.width, rect.height);
      } else {
        ctx.fillStyle = '#e7ddc7';
        ctx.fillRect(0,0,rect.width,rect.height);
      }
      if(locked){
        ctx.fillStyle = 'rgba(231,221,199,0.6)';
        ctx.fillRect(0,0,rect.width,rect.height);
      }
    }

    if(sketchSrc){
      sketchImg = new Image();
      sketchImg.crossOrigin = 'anonymous';
      sketchImg.onload = draw;
      sketchImg.src = sketchSrc;
    } else {
      draw();
    }
    window.addEventListener('resize', draw);

    if(locked){
      return;
    }

    var painting = false;
    function getPos(e){
      var rect = canvas.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX-rect.left, y: clientY-rect.top };
    }
    function erase(x,y){
      var ctx = canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x,y,26,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
    function start(e){ painting = true; var p=getPos(e); erase(p.x,p.y); updateProgress(); e.preventDefault(); }
    function move(e){ if(!painting) return; var p=getPos(e); erase(p.x,p.y); updateProgress(); e.preventDefault(); }
    function end(){ painting = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, {passive:false});
    canvas.addEventListener('touchmove', move, {passive:false});
    canvas.addEventListener('touchend', end);

    var lastCheck = 0;
    function updateProgress(){
      var now = Date.now();
      if(now - lastCheck < 150) return;
      lastCheck = now;
      var small = document.createElement('canvas');
      small.width = 40; small.height = 40;
      var sctx = small.getContext('2d');
      sctx.drawImage(canvas, 0, 0, 40, 40);
      var data = sctx.getImageData(0,0,40,40).data;
      var transparent = 0, total = 0;
      for(var i=3;i<data.length;i+=4){
        total++;
        if(data[i] < 40) transparent++;
      }
      var pct = Math.min(100, Math.round((transparent/total)*100 * 1.15));
      if(fill) fill.style.width = pct + '%';
      if(caption){
        if(pct < 15){ caption.textContent = 'not painted yet'; }
        else if(pct < 60){ caption.textContent = pct + '% painted'; }
        else { caption.textContent = pct + '% — almost there'; }
      }
    }
  }

  setupFruit('lemon');
  setupFruit('orange');
  setupFruit('grapefruit', {locked:true});
})();
