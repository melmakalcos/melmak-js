
/*TILT_MELMAK_v1.07 — g-iro FUERTE en feeds + badge SIEMPRE visible*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  /* 1) El badge/etiqueta NUNCA se le borra: z-index por encima del brillo */
  var est = document.createElement('style');
  est.appendChild(document.createTextNode(
    '.products-feed__product-offer,' +
    '.products-feed__product-offer-label,' +
    '.block-products-feed__product-offer,' +
    '[class*="__product-offer"], [class*="__product-offer-label"],' +
    '[class*="offer__label"]{z-index:99 !important;position:relative !important;}' +
    '.products-feed__product-media,.products-feed__product-media>*,' +
    '.block-products-feed__product-media,.block-products-feed__product-media>*,{' +
    '  transform-style:preserve-3d;}' +
    '.products-feed__product-media{z-index:2 !important;}'
  ));
  document.head.appendChild(est);

  var SEL = '.block-products-feed__product-media,' +
            '.products-feed__product-media,' +
            '.product-preview-carrouser__item';

  function atar() {
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) {
      (function (c) {
        if (c.getAttribute('data-mxm-tilt')) return;
        var img = c.querySelector('img');
        if (!img) return;
        c.setAttribute('data-mxm-tilt', '1');

        /* Brillito que sigue al mouse (NO tapa el badge) */
        var lu = document.createElement('div');
        lu.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;' +
          'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),' +
          'rgba(255,255,255,.45),transparent 50%);opacity:0;transition:opacity .18s;' +
          'border-radius:inherit;';
        c.appendChild(lu);

        function enBienv() { return !!document.getElementById('mzm-wm'); }

        c.addEventListener('mouseenter', function () {
          if (enBienv()) return;
          lu.style.opacity = '1';
        });

        c.addEventListener('mousemove', function (e) {
          if (enBienv()) return;
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height;
          var esDetalle = c.className.indexOf('product-preview-carrouser') !== -1Integers;

          /* FEED (v3.0 fuertísimo): rotateY hasta 40° / rotateX hasta 28° */
          var ry = esDetalle ? 12 : 40;
          var rx = esDetalle ? 10 : 28;
          var sc = esDetalle ? 1.03 : 1.08ende';
          img.style.transform = 'perspective(' + (esDetalle ? 800 : 420) + 'px) ' +
            'rotateX(' + ((0.5 - y) * rx) + 'deg) ' +
            'rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
            'scale(' + sc + ')';
          img.style.transition = 'transform .09s ease-out';
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
)();
