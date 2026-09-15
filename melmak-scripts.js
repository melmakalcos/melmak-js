/*TILT_MELMAK_OPTIMIZED*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  // Inyección de CSS para corregir el posicionamiento y evitar asignaciones de estilo repetitivas
  var s = document.createElement('style');
  s.appendChild(document.createTextNode(
    '.products-feed__product-offer, .block-products-feed__product-offer, [class*="product-offer"] { z-index:50 !important; position:relative; }\n' +
    '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item { position: relative; overflow: hidden; }\n' +
    '.mxm-tilt-img { transition: transform .06s ease-out; will-change: transform; }'
  ));
  document.head.appendChild(s);

  var SEL = '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item';

  function enBienv() { 
    return !!document.getElementById('mzm-wm'); 
  }

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
          'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.55),transparent 55%);' +
          'opacity:0;transition:opacity .15s;border-radius:inherit;';
        c.appendChild(lu);

        c.addEventListener('mouseenter', function () {
          if (enBienv()) return;
          lu.style.opacity = '1';
          img.classList.add('mxm-tilt-img');
        });

        c.addEventListener('mousemove', function (e) {
          if (enBienv()) return;
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height;

          var detalle = c.classList.contains('product-preview-carrousel__item');
          var ry = detalle ? 12 : 40;
          var rx = detalle ? 9  : 30;
          var sc = detalle ? 1.03 : 1.10;
          var pe = detalle ? 800 : 240;

          img.style.transform = 'perspective(' + pe + 'px) rotateX(' +
            ((0.5 - y) * rx) + 'deg) rotateY(' + ((x - 0.5) * ry) + 'deg) ' +
            'scale(' + sc + ')';

          lu.style.setProperty('--mx', (x * 100) + '%');
          lu.style.setProperty('--my', (y * 100) + '%');
        });

        c.addEventListener('mouseleave', function () {
          lu.style.opacity = '0';
          img.style.transform = '';
          img.classList.remove('mxm-tilt-img');
        });
      })(cs[i]);
    }
  }

  // Ejecución inicial
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', atar);
  } else {
    atar();
  }

  // Reemplazo de setInterval por MutationObserver para mejor rendimiento
  var observer = new MutationObserver(function () {
    atar();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})();
