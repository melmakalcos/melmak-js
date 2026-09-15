/*TILT_MELMAK_FINAL_v6 - Fix definitivo para imágenes con fondo blanco*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      /* Evitamos que el badge interfiera con el mouse y cause parpadeos */
      '[class*="product-offer"] { ' +
      '  z-index: 999 !important; ' +
      '  pointer-events: none !important; ' + 
      '}' +
      /* Nos aseguramos de que el contenedor no corte la sombra o el efecto */
      '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item { ' +
      '  position: relative; ' +
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
        
        // NOTA: Bajé los ángulos un poco (30 y 25). 
        // Como ahora rota TODO el contenedor, si lo giras 48 grados se va a deformar demasiado la estructura de tu tienda.
        var ry = detalle ? 16 : 30;
        var rx = detalle ? 12 : 25;
        var sc = detalle ? 1.04 : 1.10;
        var pe = detalle ? 800 : 400;

        /* LA MAGIA ESTÁ AQUÍ: Le aplicamos el transform a 'c' (el contenedor completo), NO a 'img' */
        c.style.transform = 'perspective(' + pe + 'px) rotateX(' +
          ((0.5 - y) * rx) + 'deg) rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
          'scale(' + sc + ')';
        c.style.transition = 'transform .05s ease-out';
        c.style.willChange = 'transform';
        
        /* Aseguramos que la tarjeta que tocas se ponga por encima de los demás productos */
        c.style.zIndex = '50';
      });

      c.addEventListener('mouseleave', function () {
        /* Devolvemos todo el contenedor a la normalidad */
        c.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
        c.style.transition = 'transform .3s ease-out';
        c.style.zIndex = '1';
      });
    })(cs[i]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();
