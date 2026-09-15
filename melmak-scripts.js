/*TILT_MELMAK_DEEP_3D*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  var s = document.createElement('style');
  s.appendChild(document.createTextNode(
    '.products-feed__product-offer, .block-products-feed__product-offer, [class*="product-offer"] { z-index:50 !important; position:relative; }\n' +
    '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item {' +
    '  position: relative; overflow: visible !important; transform-style: preserve-3d; perspective: 800px;' +
    '}\n' +
    '.block-products-feed__product-media img, .products-feed__product-media img, .product-preview-carrousel__item img {' +
    '  transition: transform .1s ease-out; will-change: transform; transform-style: preserve-3d;' +
    '}'
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
        lu.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:10;' +
          'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.6),transparent 60%);' +
          'opacity:0;transition:opacity .2s;border-radius:inherit;transform: translateZ(30px);';
        c.appendChild(lu);

        c.addEventListener('mouseenter', function () {
          if (enBienv()) return;
          lu.style.opacity = '1';
        });

        c.addEventListener('mousemove', function (e) {
          if (enBienv()) return;
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height;

          var detalle = c.classList.contains('product-preview-carrousel__item');
          
          // Ángulos de rotación
          var ry = detalle ? 15 : 25; 
          var rx = detalle ? 12 : 20; 
          
          // Elevación en el eje Z (profundidad 3D)
          var translateZ = detalle ? 15 : 35; // Pixeles que sobresale la imagen
          var sc = detalle ? 1.02 : 1.05;

          var rotateX = (0.5 - y) * rx;
          var rotateY = (x - 0.5) * ry;

          // Rotación + Elevación 3D en el espacio
          img.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(' + translateZ + 'px) scale(' + sc + ')';

          lu.style.setProperty('--mx', (x * 100) + '%');
          lu.style.setProperty('--my', (y * 100) + '%');
        });

        c.addEventListener('mouseleave', function () {
          lu.style.opacity = '0';
          img.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        });
      })(cs[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', atar);
  } else {
    atar();
  }

  var observer = new MutationObserver(atar);
  observer.observe(document.body, { childList: true, subtree: true });
})();
