/*TILT_MELMAK_FINAL_v12 - Fix definitivo UIkit Slider en página de producto*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"] { z-index: 999 !important; pointer-events: none !important; }' +
      '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item { position: relative !important; transform-style: preserve-3d !important; }' +
      /* Aseguramos el espacio 3D en los items del slider VIP sin interferir con el desplazamiento */
      '.product-vip__carrousel .uk-slider-items > li { transform-style: preserve-3d !important; will-change: transform; }'
    ));
    document.head.appendChild(s);
  })();

  function atar() {
    // 1. Selector para el Catálogo (Grid general)
    var catalogos = document.querySelectorAll('.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item');
    for (var i = 0; i < catalogos.length; i++) (function (c) {
      if (c.getAttribute('data-mxm-tilt')) return;
      var img = c.querySelector('img');
      if (!img) return;
      c.setAttribute('data-mxm-tilt', '1');

      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        c.style.transform = 'perspective(400px) rotateX(' + ((0.5 - y) * 25) + 'deg) rotateY(' + ((x - 0.5) * 30) + 'deg) scale(1.10)';
        c.style.transition = 'transform .05s ease-out';
        c.style.zIndex = '50';
      });

      c.addEventListener('mouseleave', function () {
        c.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
        c.style.transition = 'transform .3s ease-out';
        c.style.zIndex = '1';
      });
    })(catalogos[i]);

    // 2. Selector para la Página de Producto VIP (Aplica al <li> contenedor del slider para no romper UIkit)
    var vips = document.querySelectorAll('.product-vip__carrousel .uk-slider-items > li');
    for (var j = 0; j < vips.length; j++) (function (li) {
      if (li.getAttribute('data-mxm-tilt')) return;
      li.setAttribute('data-mxm-tilt', '1');

      li.addEventListener('mousemove', function (e) {
        var r = li.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        
        li.style.transform = 'perspective(500px) rotateX(' + ((0.5 - y) * 20) + 'deg) rotateY(' + ((x - 0.5) * 20) + 'deg) scale(1.05)';
        li.style.transition = 'transform .05s ease-out';
        li.style.zIndex = '50';
      });

      li.addEventListener('mouseleave', function () {
        li.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
        li.style.transition = 'transform .3s ease-out';
        li.style.zIndex = '1';
      });
    })(vips[j]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();
