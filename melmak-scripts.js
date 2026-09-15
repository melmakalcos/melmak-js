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

/*ARBOL_CATEGORIAS_ESTRICTO_HIJOS*/
(function () {
    function construir() {
        var f = document.querySelector('.products-feed__filter');
        if (!f || f.querySelector('.cat-arbol')) return;

        var menuNav = document.querySelector('.header-menu__desktop-list__container-list');
        if (!menuNav) return;

        // 1. Ubicar el desplegable específico de Catálogo / Productos
        var todosLinks = menuNav.querySelectorAll('a');
        var linkCatalogo = null;

        for (var i = 0; i < todosLinks.length; i++) {
            var txt = todosLinks[i].textContent.trim().toUpperCase();
            if (txt === 'CATÁLOGO' || txt === 'CATALOGO' || txt === 'CATEGORIAS' || txt === 'CATEGORÍAS') {
                linkCatalogo = todosLinks[i];
                break;
            }
        }

        var ulRoot = null;
        if (linkCatalogo) {
            var parentLi = linkCatalogo.closest('li');
            if (parentLi) {
                ulRoot = parentLi.querySelector('ul');
            }
        }

        if (!ulRoot) {
            ulRoot = menuNav.querySelector('.desktop-list__menu');
        }

        if (!ulRoot) return;

        var cont = document.createElement('div');
        cont.className = 'cat-arbol';
        var mainUl = document.createElement('ul');
        cont.appendChild(mainUl);

        // Registro de URLs para prevenir duplicados globales (como MUSICA-PORTADAS)
        var urlsProcesadas = {};

        // 2. Extraer ÚNICAMENTE los hijos directos del Nivel 1 (sin buscar a profundidad)
        var children = ulRoot.children;
        var lisNivel1 = [];
        for (var c = 0; c < children.length; c++) {
            if (children[c].tagName === 'LI') {
                lisNivel1.push(children[c]);
            }
        }

        for (var i = 0; i < lisNivel1.length; i++) {
            var li1 = lisNivel1[i];
            
            // Obtener el enlace principal del Nivel 1
            var a1 = null;
            for (var k = 0; k < li1.childNodes.length; k++) {
                var node = li1.childNodes[k];
                if (node.tagName === 'A') { a1 = node; break; }
                if (node.tagName === 'DIV' || node.tagName === 'SPAN') {
                    var subA = node.querySelector('a');
                    if (subA) { a1 = subA; break; }
                }
            }
            if (!a1) a1 = li1.querySelector('a');
            if (!a1) continue;

            var href1 = a1.getAttribute('href');
            if (!href1 || urlsProcesadas[href1]) continue;

            // 3. Extraer subcategorías del Nivel 2 (hijos directos del sub-UL)
            var subUl = li1.querySelector('ul');
            var lisNivel2 = [];
            if (subUl) {
                var subChildren = subUl.children;
                for (var sc = 0; sc < subChildren.length; sc++) {
                    if (subChildren[sc].tagName === 'LI') {
                        lisNivel2.push(subChildren[sc]);
                    }
                }
            }

            var rama = document.createElement('li');
            rama.className = 'cat-rama';

            var cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';

            var linkTop = document.createElement('a');
            linkTop.href = a1.href;
            linkTop.textContent = a1.textContent.trim();
            cabeza.appendChild(linkTop);

            var subUlContainer = null;
            var tieneHijosValidos = false;

            if (lisNivel2.length > 0) {
                subUlContainer = document.createElement('ul');
                subUlContainer.className = 'cat-hijos';

                for (var j = 0; j < lisNivel2.length; j++) {
                    var li2 = lisNivel2[j];
                    var a2 = li2.querySelector('a');
                    if (!a2) continue;

                    var href2 = a2.getAttribute('href');
                    if (!href2 || href2 === href1 || urlsProcesadas[href2]) continue;

                    urlsProcesadas[href2] = true;

                    var subLi = document.createElement('li');
                    var subA = document.createElement('a');
                    subA.href = a2.href;
                    subA.textContent = a2.textContent.trim();
                    subLi.appendChild(subA);
                    subUlContainer.appendChild(subLi);

                    tieneHijosValidos = true;
                }
            }

            if (tieneHijosValidos) {
                rama.setAttribute('data-tiene-hijos', '1');
                var flechita = document.createElement('span');
                flechita.className = 'flechita';
                flechita.textContent = '\u25BC';
                cabeza.appendChild(flechita);

                rama.appendChild(cabeza);
                rama.appendChild(subUlContainer);
            } else {
                rama.appendChild(cabeza);
            }

            urlsProcesadas[href1] = true;
            mainUl.appendChild(rama);
        }

        f.insertBefore(cont, f.firstChild);

        // Control del desplegable lateral
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
