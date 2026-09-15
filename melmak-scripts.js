/*TILT_MELMAK_FINAL_v13 - Anulación de sombra nativa y Tilt directo en VIP*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"] { z-index: 999 !important; pointer-events: none !important; }' +
      /* Matamos la sombra gris nativa de Empretienda en el producto VIP para que no ensucie el 3D */
      '.product-vip__carrousel-image { box-shadow: none !important; transition: transform .05s ease-out; will-change: transform; cursor: pointer; }'
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

    // 2. Selector directo para la imagen de la página de producto VIP
    var vips = document.querySelectorAll('.product-vip__carrousel-image');
    for (var j = 0; j < vips.length; j++) (function (img) {
      if (img.getAttribute('data-mxm-tilt')) return;
      img.setAttribute('data-mxm-tilt', '1');

      img.addEventListener('mousemove', function (e) {
        var r = img.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        
        img.style.transform = 'perspective(500px) rotateX(' + ((0.5 - y) * 20) + 'deg) rotateY(' + ((x - 0.5) * 20) + 'deg) scale(1.05)';
        img.style.transition = 'transform .05s ease-out';
      });

      img.addEventListener('mouseleave', function () {
        img.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
        img.style.transition = 'transform .3s ease-out';
      });
    })(vips[j]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();

/*ARBOL_CATEGORIAS_DEFINITIVO*/
(function () {
    function construir() {
        var f = document.querySelector('.products-feed__filter');
        if (!f || f.querySelector('.cat-arbol')) return;
        
        // Seleccionamos estrictamente los elementos de nivel superior del menú de escritorio
        var menuContainer = document.querySelector('.header-menu__desktop-list__container-list .desktop-list__menu');
        if (!menuContainer) return;
        
        var tops = menuContainer.querySelectorAll(':scope > li.text--primary');
        if (!tops.length) return;
        
        var cont = document.createElement('div');
        cont.className = 'cat-arbol';
        var lista = document.createElement('ul');
        cont.appendChild(lista);
        
        for (var i = 0; i < tops.length; i++) {
            var en = tops[i].querySelector(':scope > a');
            if (!en) continue;
            
            var rama = document.createElement('li');
            rama.className = 'cat-rama';
            var cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';
            
            var aTop = document.createElement('a');
            aTop.href = en.href;
            aTop.textContent = en.textContent;
            cabeza.appendChild(aTop);
            
            // Buscamos los subítems exclusivamente dentro de este elemento principal actual
            var subs = tops[i].querySelectorAll('.desktop-list__subitem a');
            var hijos = null;
            
            if (subs.length) {
                rama.setAttribute('data-tiene-hijos', '1');
                var fle = document.createElement('span');
                fle.className = 'flechita';
                fle.textContent = '\u25BC';
                cabeza.appendChild(fle);
                
                hijos = document.createElement('ul');
                hijos.className = 'cat-hijos';
                
                for (var j = 0; j < subs.length; j++) {
                    var item = document.createElement('li');
                    var aSub = document.createElement('a');
                    aSub.href = subs[j].href;
                    aSub.textContent = subs[j].textContent;
                    item.appendChild(aSub);
                    hijos.appendChild(item);
                }
            }
            
            rama.appendChild(cabeza);
            if (hijos) rama.appendChild(hijos);
            lista.appendChild(rama);
        }
        
        f.insertBefore(cont, f.firstChild);
        
        cont.addEventListener('click', function (ev) {
            var a = ev.target.closest ? ev.target.closest('a') : null;
            if (a) {
                if (a.parentNode && a.parentNode.className.indexOf('cat-cabeza') !== -1) {
                    ev.preventDefault();
                } else {
                    return;
                }
            }
            var q = ev.target;
            while (q && q !== cont && !(q.classList && q.classList.contains('cat-rama'))) {
                q = q.parentNode;
            }
            if (q && q !== cont && q.getAttribute('data-tiene-hijos') === '1') {
                if (!q.classList.contains('cat-abierta')) {
                    var ab = cont.querySelectorAll('.cat-abierta');
                    for (var m = 0; m < ab.length; m++) {
                        ab[m].classList.remove('cat-abierta');
                    }
                }
                q.classList.toggle('cat-abierta');
            }
        });
    }

    function esperar(k) {
        var f = document.querySelector('.products-feed__filter');
        var menu = document.querySelector('.header-menu__desktop-list__container-list .desktop-list__menu');
        if (f && menu) {
            construir();
            return;
        }
        if (k > 80) return;
        setTimeout(function () {
            esperar((k || 0) + 1);
        }, 200);
    }
    esperar();
})();
