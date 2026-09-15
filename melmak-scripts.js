/*TILT_MELMAK_FINAL_v4.2 - Solución definitiva al cartel de descuento*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      /* 1. Obligamos al cartel a procesarse en la GPU y estar siempre arriba */
      '[class*="product-offer"] { ' +
      '  z-index: 99999 !important; ' +
      '  position: absolute !important; ' +
      '  transform: translate3d(0,0,1px) !important; ' +
      '  backface-visibility: hidden; ' +
      '}' +
      /* 2. Mantenemos la imagen un nivel por debajo del cartel */
      '.block-products-feed__product-media img, .products-feed__product-media img, .product-preview-carrousel__item img { ' +
      '  position: relative; ' +
      '  z-index: 1 !important; ' +
      '}'
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

      function enBienv() { return !!document.getElementById('mzm-wm'); }

      c.addEventListener('mousemove', function (e) {
        if (enBienv()) return;
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;

        var detalle = c.className.indexOf('product-preview-carrousel') !== -1;
        var ry = detalle ? 16 : 48;
        var rx = detalle ? 12 : 38;
        var sc = detalle ? 1.04 : 1.14;
        var pe = detalle ? 800 : 220;

        img.style.transform = 'perspective(' + pe + 'px) rotateX(' +
          ((0.5 - y) * rx) + 'deg) rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
          'scale(' + sc + ')';
        img.style.transition = 'transform .05s ease-out';
        img.style.willChange = 'transform';
      });

      c.addEventListener('mouseleave', function () {
        /* EL FIX PRINCIPAL: En vez de dejarlo vacío, lo volvemos a un estado 3D neutro (escala 1, rotación 0).
           Esto evita el glitch del navegador al salir de la animación. */
        img.style.transform = 'perspective(220px) rotateX(0deg) rotateY(0deg) scale(1)';
        img.style.transition = 'transform .3s ease-out'; // Una transición suave al volver
      });
    })(cs[i]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();
