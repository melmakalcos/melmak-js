<script>
(function(){
  if (window.matchMedia('(pointer:coarse)').matches) return;
  var cajas = document.querySelectorAll('.block-products-feed__product-media, .products-feed__product-media');
  if (!cajas.length) return;
  cajas.forEach(function(c){
    var luz  = document.createElement('div');
    var somb = document.createElement('div');
    luz.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;'+
      'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),'+
      'rgba(255,255,255,.55),transparent 55%);opacity:0;transition:opacity .2s;'+
      'border-radius:inherit;';
    somb.style.cssText = 'position:absolute;left:6%;right:6%;bottom:-16px;height:22px;'+
      'background:radial-gradient(ellipse at center,rgba(53,53,53,.35),transparent 70%);'+
      'border-radius:50%;opacity:0;transition:opacity .2s;z-index:0;';
    c.appendChild(luz); c.appendChild(somb);
    var enBienvenida = function(){ return !!document.getElementById('mzm-wm'); };
    var hija = null;
    var img = c.querySelector('img');

    function ponerSombraRelativa(){
      if (!hija) return;
      var bs = hija.getBoundingClientRect();
      var bf = c.parentNode ? c.parentNode.getBoundingClientRect() : bs;
      somb.style.left  = ((bs.left - bf.left)/bf.width*100 - 4) + '%';
      somb.style.width = ((bs.width/bf.width)*100) + '%';
    }

    c.addEventListener('mouseenter', function(){
      if (enBienvenida()) return;
      hija = c; luz.style.opacity = '1'; somb.style.opacity = '1';
      ponerSombraRelativa();
    });
    c.addEventListener('mousemove', function(e){
      if (!hija || enBienvenida()) return;
      var r = c.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      var rx = (0.5 - y) * 26;   /* más inclinación vertical */
      var ry = (x - 0.5) * 32;   /* más inclinación horizontal */
      c.style.transform = 'perspective(480px) rotateX(' + rx + 'deg) rotateY(' +
        ry + 'deg) translateZ(46px) scale(1.04)';
      c.style.transformStyle = 'preserve-3d';
      c.style.transition = 'transform .1s ease-out';
      c.style.willChange = 'transform';
      luz.style.setProperty('--mx', (x*100)+'%');
      luz.style.setProperty('--my', (y*100)+'%');
      /* antialias en los bordes */
      if (c.style.transform) return;
    });
    c.addEventListener('mouseleave', function(){
      hija = null; luz.style.opacity = '0'; somb.style.opacity = '0';
      c.style.transform = '';
    });
  });
})();
</script>
  setInterval(atar, 700);
  window.addEventListener('scroll', atar, { passive: true });
  document.addEventListener('DOMContentLoaded', atar);
)();
