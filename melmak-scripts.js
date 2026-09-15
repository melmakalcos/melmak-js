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

/*ARBOL_CATEGORIAS_EMPRETIENDA_FLAT*/
(function () {
    function construir() {
        var filterContainer = document.querySelector('.products-feed__filter');
        if (!filterContainer || filterContainer.querySelector('.cat-arbol')) return;

        // 1. Obtener la navegación principal
        var menuContainer = document.querySelector('.header-menu__desktop-list__container-list .desktop-list__menu') 
            || document.querySelector('.desktop-list__menu')
            || document.querySelector('.header-menu__desktop-list__container-list');
        
        if (!menuContainer) return;

        // Si existe desplegable "Catálogo" / "Categorías", enfocar ese contenedor
        var catalogoLink = Array.from(menuContainer.querySelectorAll('a')).find(function(a) {
            var t = a.textContent.trim().toUpperCase();
            return t === 'CATÁLOGO' || t === 'CATALOGO' || t === 'CATEGORÍAS' || t === 'CATEGORIAS';
        });

        var targetUl = menuContainer;
        if (catalogoLink) {
            var parentLi = catalogoLink.closest('li');
            if (parentLi) {
                var subUl = parentLi.querySelector('ul');
                if (subUl) targetUl = subUl;
            }
        }

        var allLis = Array.from(targetUl.children).filter(function(el) { return el.tagName === 'LI'; });
        if (!allLis.length) {
            allLis = Array.from(targetUl.querySelectorAll('li'));
        }

        var tree = [];
        var currentParent = null;
        var seenUrls = {};

        // 2. Procesar la estructura plana de Empretienda (.desktop-list__subitem)
        allLis.forEach(function (li) {
            var a = li.querySelector('a');
            if (!a) return;

            var href = a.getAttribute('href') || a.href;
            var text = a.textContent.trim();
            if (!text || !href || href === '#' || href === 'javascript:void(0)') return;

            var isSubitem = li.classList.contains('desktop-list__subitem') || 
                            li.classList.contains('subitem') ||
                            li.parentElement.closest('li') !== null;

            if (isSubitem && currentParent) {
                // Agregar como hija de la categoría principal activa
                if (!seenUrls[href] && href !== currentParent.href) {
                    seenUrls[href] = true;
                    currentParent.children.push({ title: text, href: a.href });
                }
            } else {
                // Registrar nueva categoría raíz (Nivel 1)
                if (!seenUrls[href]) {
                    seenUrls[href] = true;
                    currentParent = { title: text, href: a.href, children: [] };
                    tree.push(currentParent);
                }
            }

            // Fallback para temas con anidación HTML real
            var nestedUl = li.querySelector('ul');
            if (nestedUl && currentParent) {
                var nestedAs = nestedUl.querySelectorAll('a');
                nestedAs.forEach(function (subA) {
                    var subHref = subA.getAttribute('href') || subA.href;
                    var subText = subA.textContent.trim();
                    if (subText && subHref && !seenUrls[subHref] && subHref !== currentParent.href) {
                        seenUrls[subHref] = true;
                        currentParent.children.push({ title: subText, href: subA.href });
                    }
                });
            }
        });

        if (!tree.length) return;

        // 3. Renderizar el menú lateral (.cat-arbol)
        var cont = document.createElement('div');
        cont.className = 'cat-arbol';
        var mainUl = document.createElement('ul');

        tree.forEach(function (item) {
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

                item.children.forEach(function (child) {
                    var subLi = document.createElement('li');
                    var subA = document.createElement('a');
                    subA.href = child.href;
                    subA.textContent = child.title;
                    subLi.appendChild(subA);
                    subUlElem.appendChild(subLi);
                });

                rama.appendChild(cabeza);
                rama.appendChild(subUlElem);
            } else {
                rama.appendChild(cabeza);
            }

            mainUl.appendChild(rama);
        });

        cont.appendChild(mainUl);
        filterContainer.insertBefore(cont, filterContainer.firstChild);

        // 4. Lógica de acordeón desplegable
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
