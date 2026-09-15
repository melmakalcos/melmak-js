
/*TILT_MELMAK_FINAL_v3*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"]{ z-index:60 !important; }'
    ));
    document.head.appendChild(s);
  })();

  var SEL = '.block-products-feed__product-media,' +
            '.products-feed__product-media,' +
            '.product-preview-carrousel__item';

  function atar() {
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) (function (c) {
      if (c.getAttribute('data-mxm-tilt')) return;
      var img = c.querySelector('img');
      if (!img) return;
      c.setAttribute('data-mxm-tilt', '1');

      var lu = document.createElement('div');
      lu.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;' +
        'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),' +
        'rgba(255,255,255,.5),transparent 55%);opacity:0;transition:opacity .15s;' +
        'border-radius:inherit;mix-blend-mode:screen;';
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

        var detalle = c.className.indexOf('product-preview-carrousel') !== -1;
        var ry = detalle ? 14 : 44;   /* hasta 44 grados en feeds */
        var rx = detalle ? 10 : 32;
        var sc = detalle ? 1.03 : 1.12;
        var pe = detalle ? 800 : 240;

        img.style.transform = 'perspective(' + pe + 'px) rotateX(' +
          ((0.5 - y) * rx) + 'deg) rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
          'scale(' + sc + ')';
        img.style.transition = 'transform .05s ease-out';
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

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
)();
