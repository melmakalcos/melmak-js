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

/*ARBOL_CATEGORIAS_ESTRICTO*/
(function () {
    function construir() {
        var f = document.querySelector('.products-feed__filter');
        if (!f || f.querySelector('.cat-arbol')) return;
        
        var menuOriginal = document.querySelector('.header-menu__desktop-list__container-list .desktop-list__menu');
        if (!menuOriginal) return;
        
        var cont = document.createElement('div');
        cont.className = 'cat-arbol';
        var listaUl = document.createElement('ul');
        cont.appendChild(listaUl);
        
        // Seleccionamos ÚNICAMENTE los elementos <li> de primer nivel (hijos directos del menú superior)
        var tops = menuOriginal.querySelectorAll(':scope > li');
        if (!tops.length) return;
        
        for (var i = 0; i < tops.length; i++) {
            var topLi = tops[i];
            var aTop = topLi.querySelector(':scope > a');
            if (!aTop) continue;
            
            var rama = document.createElement('li');
            rama.className = 'cat-rama';
            
            var cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';
            
            var linkTop = document.createElement('a');
            linkTop.href = aTop.href;
            linkTop.textContent = aTop.textContent;
            cabeza.appendChild(linkTop);
            
            // Buscamos subcategorías exclusivamente dentro de este <li> principal (aislado)
            var subUl = topLi.querySelector('ul');
            var subs = subUl ? subUl.querySelectorAll('li a') : [];
            
            if (subs && subs.length > 0) {
                rama.setAttribute('data-tiene-hijos', '1');
                var fle = document.createElement('span');
                fle.className = 'flechita';
                fle.textContent = '\u25BC';
                cabeza.appendChild(fle);
                
                var hijosUl = document.createElement('ul');
                hijosUl.className = 'cat-hijos';
                
                var subProcesados = {};
                for (var j = 0; j < subs.length; j++) {
                    var subA = subs[j];
                    
                    // Evitamos duplicar el enlace principal si se repite en la sublista
                    if (subA.href === linkTop.href) continue;
                    
                    var subHref = subA.getAttribute('href');
                    if (subProcesados[subHref]) continue;
                    subProcesados[subHref] = true;
                    
                    var itemLi = document.createElement('li');
                    var itemA = document.createElement('a');
                    itemA.href = subA.href;
                    itemA.textContent = subA.textContent;
                    itemLi.appendChild(itemA);
                    hijosUl.appendChild(itemLi);
                }
                
                if (hijosUl.children.length > 0) {
                    rama.appendChild(cabeza);
                    rama.appendChild(hijosUl);
                } else {
                    rama.appendChild(cabeza);
                }
            } else {
                rama.appendChild(cabeza);
            }
            
            listaUl.appendChild(rama);
        }
        
        f.insertBefore(cont, f.firstChild);
        
        // Manejador del acordeón lateral
        cont.addEventListener('click', function (ev) {
            var a = ev.target.closest ? ev.target.closest('a') : null;
            if (a) {
                var ramaPadre = a.closest('.cat-rama');
                if (ramaPadre && ramaPadre.getAttribute('data-tiene-hijos') === '1' && a.parentNode && a.parentNode.classList.contains('cat-cabeza')) {
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
