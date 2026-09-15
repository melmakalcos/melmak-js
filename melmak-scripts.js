/*TILT_MELMAK_FINAL_v4.1 - Fix Badge de Descuento*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      /* Le damos un espacio 3D al contenedor y empujamos el badge hacia adelante */
      '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item { transform-style: preserve-3d; }' +
      '[class*="product-offer"] { z-index: 9999 !important; transform: translateZ(30px) !important; position: absolute !important; }'
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
        var ry = detalle ? 16 : 80;
        var rx = detalle ? 12 : 80;
        var sc = detalle ? 1.04 : 1.14;
        var pe = detalle ? 800 : 220;

        img.style.transform = 'perspective(' + pe + 'px) rotateX(' +
          ((0.5 - y) * rx) + 'deg) rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
          'scale(' + sc + ')';
        img.style.transition = 'transform .05s ease-out';
        img.style.willChange = 'transform';
      });

      c.addEventListener('mouseleave', function () {
        // Limpiamos el transform y el willChange para evitar glitches de repintado
        img.style.transform = '';
        img.style.willChange = 'auto'; 
        img.style.transition = 'transform .3s ease-out'; // Opcional: hace que la vuelta a la normalidad sea suave
      });
    })(cs[i]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();
