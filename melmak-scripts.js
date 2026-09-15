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

/*ARBOL_CATEGORIAS_ARQUITECTURA_TREE*/
(function () {
    function construir() {
        var filterContainer = document.querySelector('.products-feed__filter');
        if (!filterContainer || filterContainer.querySelector('.cat-arbol')) return;

        // 1. Aislar estrictamente el menú de navegación Desktop
        var desktopNav = document.querySelector('.header-menu__desktop-list__container-list');
        if (!desktopNav) return;

        // 2. Localizar el desplegable de "CATÁLOGO" / "CATEGORÍAS"
        var rootMenuUl = null;
        var allNavLinks = desktopNav.querySelectorAll('a');
        
        for (var i = 0; i < allNavLinks.length; i++) {
            var txt = allNavLinks[i].textContent.trim().toUpperCase();
            if (txt === 'CATÁLOGO' || txt === 'CATALOGO' || txt === 'CATEGORÍAS' || txt === 'CATEGORIAS') {
                var parentLi = allNavLinks[i].closest('li');
                if (parentLi) {
                    rootMenuUl = parentLi.querySelector('ul');
                }
                break;
            }
        }

        if (!rootMenuUl) {
            rootMenuUl = desktopNav.querySelector('.desktop-list__menu');
        }
        if (!rootMenuUl) return;

        // 3. Extraer elementos de Nivel 1 (Categorías Raíz)
        var level1Lis = [];
        for (var c = 0; c < rootMenuUl.children.length; c++) {
            if (rootMenuUl.children[c].tagName === 'LI') {
                level1Lis.push(rootMenuUl.children[c]);
            }
        }
        if (!level1Lis.length) return;

        var tree = [];
        var seenUrls = {};

        // FASE 1: CONSTRUCCIÓN DEL ÁRBOL LÓGICO Y REGISTRO DE MEMORIA
        for (var i = 0; i < level1Lis.length; i++) {
            var li1 = level1Lis[i];
            
            var a1 = null;
            for (var n = 0; n < li1.childNodes.length; n++) {
                if (li1.childNodes[n].tagName === 'A') {
                    a1 = li1.childNodes[n];
                    break;
                }
            }
            if (!a1) a1 = li1.querySelector('a');
            if (!a1) continue;

            var href1 = a1.getAttribute('href') || a1.href;
            var text1 = a1.textContent.trim();
            
            // Bloqueo de duplicados en raíz (ej: MUSICA-PORTADAS)
            if (!text1 || seenUrls[href1]) continue;
            seenUrls[href1] = true;

            var node1 = {
                title: text1,
                href: a1.href,
                children: []
            };

            // Extracción estricta de subcategorías (Nivel 2) dentro de este li1
            var subUl = li1.querySelector('ul');
            if (subUl && subUl !== rootMenuUl) {
                var level2Lis = [];
                for (var sc = 0; sc < subUl.children.length; sc++) {
                    if (subUl.children[sc].tagName === 'LI') {
                        level2Lis.push(subUl.children[sc]);
                    }
                }

                for (var j = 0; j < level2Lis.length; j++) {
                    var li2 = level2Lis[j];
                    var a2 = li2.querySelector('a');
                    if (!a2) continue;

                    var href2 = a2.getAttribute('href') || a2.href;
                    var text2 = a2.textContent.trim();

                    if (!text2 || href2 === href1 || seenUrls[href2]) continue;

                    // REGISTRO CLAVE: Al marcar la subcategoría en seenUrls, 
                    // se bloquea totalmente la posibilidad de que aparezca como raíz.
                    seenUrls[href2] = true;

                    node1.children.push({
                        title: text2,
                        href: a2.href
                    });
                }
            }

            tree.push(node1);
        }

        if (!tree.length) return;

        // FASE 2: RENDERIZADO DEL DOM LATERAL
        var cont = document.createElement('div');
        cont.className = 'cat-arbol';
        var mainUl = document.createElement('ul');

        for (var k = 0; k < tree.length; k++) {
            var item = tree[k];
            var rama = document.createElement('li');
            rama.className = 'cat-rama';

            var cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';

            var linkTop = document.createElement('a');
            linkTop.href = item.href;
            linkTop.textContent = item.title;
            cabeza.appendChild(linkTop);

            if (item.children.length > 0) {
                rama.setAttribute('data-tiene-hijos', '1');
                var flechita = document.createElement('span');
                flechita.className = 'flechita';
                flechita.textContent = '\u25BC';
                cabeza.appendChild(flechita);

                var subUlElem = document.createElement('ul');
                subUlElem.className = 'cat-hijos';

                for (var ch = 0; ch < item.children.length; ch++) {
                    var childItem = item.children[ch];
                    var subLi = document.createElement('li');
                    var subA = document.createElement('a');
                    subA.href = childItem.href;
                    subA.textContent = childItem.title;
                    subLi.appendChild(subA);
                    subUlElem.appendChild(subLi);
                }

                rama.appendChild(cabeza);
                rama.appendChild(subUlElem);
            } else {
                rama.appendChild(cabeza);
            }

            mainUl.appendChild(rama);
        }

        cont.appendChild(mainUl);
        filterContainer.insertBefore(cont, filterContainer.firstChild);

        // Control de Apertura/Cierre del Acordeón
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
        var menu = document.querySelector('.header-menu__desktop-list__container-list');
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
