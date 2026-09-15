/*TILT_MELMAK*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  var SEL = '.block-products-feed__product-media,' +
            '.products-feed__product-media,' +
            '.product-preview-carrousel__item';
  function atar() {
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) {
      (function (c) {
        if (c.getAttribute('data-mxm-tilt')) return;
        var img = c.querySelector('img');
        if (!img) return;
        c.setAttribute('data-mxm-tilt', '1');
        var lu = document.createElement('div');
        lu.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;' +
          'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),' +
          'rgba(255,255,255,.5),transparent 55%);opacity:0;transition:opacity .2s;' +
          'border-radius:inherit;';
        c.appendChild(lu);
        function bienv() { return !!document.getElementById('mzm-wm'); }
        c.addEventListener('mouseenter', function () {
          if (bienv()) return;
          lu.style.opacity = '1';
        });
        c.addEventListener('mousemove', function (e) {
          if (bienv()) return;
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height;
          var g = c.className.indexOf('product-preview-carrousel') !== -1 ? 9 : 18;
          img.style.transform = 'perspective(560px) rotateX(' + ((0.5 - y) * (g * 0.8)) +
            'deg) rotateY(' + ((x - 0.5) * g) + 'deg) scale(1.05)';
          img.style.transformStyle = 'preserve-3d';
          img.style.willChange = 'transform';
          lu.style.setProperty('--mx', (x * 100) + '%');
          lu.style.setProperty('--my', (y * 100) + '%');
        });
        c.addEventListener('mouseleave', function () {
          lu.style.opacity = '0';
          img.style.transform = '';
        });
      })(cs[i]);
    }
  }
  atar();
  setInterval(atar, 700);
  window.addEventListener('scroll', atar, { passive: true });
  document.addEventListener('DOMContentLoaded', atar);
})();
