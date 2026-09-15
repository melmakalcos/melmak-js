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

/*ARBOL_CATEGORIAS_CLON_DIRECTO*/
(function () {
    function construir() {
        var f = document.querySelector('.products-feed__filter');
        if (!f || f.querySelector('.cat-arbol')) return;
        
        // Buscamos el contenedor del menú superior de escritorio
        var menuOriginal = document.querySelector('.header-menu__desktop-list__container-list .desktop-list__menu');
        if (!menuOriginal) return;
        
        // Creamos nuestro contenedor principal para la barra lateral
        var cont = document.createElement('div');
        cont.className = 'cat-arbol';
        
        // Clonamos la estructura HTML pura del menú superior
        var clonMenu = menuOriginal.cloneNode(true);
        
        // Transformamos los elementos clonados para que adopten la estructura de árbol y acordeón
        var itemsPrincipales = clonMenu.querySelectorAll(':scope > li');
        
        for (var i = 0; i < itemsPrincipales.length; i++) {
            var liTop = itemsPrincipales[i];
            liTop.className = 'cat-rama';
            
            var aTop = liTop.querySelector(':scope > a');
            if (!aTop) continue;
            
            // Creamos la cabecera clickeable
            var cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';
            
            // Movemos el enlace principal a la cabecera
            cabeza.appendChild(aTop);
            
            // Buscamos si tiene sublistas (hijos)
            var subMenu = liTop.querySelector('ul, .desktop-list__subitem');
            
            if (subMenu) {
                liTop.setAttribute('data-tiene-hijos', '1');
                
                // Agregamos la flechita indicadora
                var fle = document.createElement('span');
                fle.className = 'flechita';
                fle.textContent = '\u25BC';
                cabeza.appendChild(fle);
                
                // Re-estilizamos el contenedor de los hijos
                subMenu.className = 'cat-hijos';
                
                var subLinks = subMenu.querySelectorAll('a');
                for (var j = 0; j < subLinks.length; j++) {
                    // Aseguramos que los links hijos tengan su formato limpio
                    var subLi = subLinks[j].parentElement;
                    if (subLi && subLi.tagName === 'LI') {
                        subLi.className = '';
                    }
                }
            }
            
            // Insertamos la cabecera al inicio del item principal
            liTop.insertBefore(cabeza, liTop.firstChild);
        }
        
        cont.appendChild(clonMenu);
        f.insertBefore(cont, f.firstChild);
        
        // Manejador de eventos para abrir/cerrar los desplegables al hacer clic
        cont.addEventListener('click', function (ev) {
            var a = ev.target.closest ? ev.target.closest('a') : null;
            if (a) {
                // Si hacen clic en el texto del padre y tiene hijos, evitamos que navegue para que actúe como acordeón
                var ramaPadre = a.closest('.cat-rama');
                if (ramaPadre && ramaPadre.getAttribute('data-tiene-hijos') === '1' && a.parentElement.className.indexOf('cat-cabeza') !== -1) {
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
