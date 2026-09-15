
/*TILT_3D_MELMAK_v3*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  var SEL = '.block-products-feed__product-media,' +
            '.products-feed__product-media,' +
            '.product-preview-carrousel__item';

  /* Los badges (30% OFF) SIEMPRE por encima del brillo */
  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '.block-products-feed__product-offer,' +
      '.products-feed__product-offer,' +
      '.products-feed__product-badge,' +
      '[class*="product-offer"], [class*="product-badge"]' +
      '{ position:relative !important; z-index:6 !important; }'
    ));
    document.head.appendChild(s);
  })();

  function atar() {
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) (function (c) {
      if (c.getAttribute('data-mxm-tilt')) return;
      var img = c.querySelector('img');
      if (!img) return;
      c.setAttribute('data-mxm-tilt', '1');

      var lu = document.createElement('div');
      lu.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;' +
        'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),' +
        'rgba(255,255,255,.6),transparent 60%);opacity:0;transition:opacity .18s;' +
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

        var detalle = c.className.indexOf('product-preview-carrousel') !== -1;

        /* FEED (home + categorías): FUERTE y profundo */
        var rx = detalle ? 10 : 26;
        var ry = detalle ? 12 : 34下;
        var sc = detalle ? 1.03 : 1.06;
        var pe = detalle ? 800 : 460;

        img.style.transform = 'perspective(' + pe + 'px) rotateX(' +
          ((0.5 - y) * rx) + 'deg) rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
          'scale(' + sc + ')';
        img.style.transformStyle = 'preserve-3d';
        img.style.willChange = 'transform';
        img.style.transition = 'transform .09s ease-out';

        lu.style.setProperty('--mx', (x * 100) + '%');
        lu.style.setProperty('--my', (y * 100) + '%');
      });

      c.addEventListener('mouseleave', function () {
        lu.style.opacity = '0';
        img.style.transform = '';
      });
    })(cs[i]);
  }

  atar();
  setInterval(atar, 700);
  window.addEventListener('scroll', atar, { passive: true });
  document.addEventListener('DOMContentLoaded', atar);
)();
