/*TILT_MELMAK_FINAL_v14 - Anulación de sombra nativa, Tilt directo y Brillo/Reflejo (Glare)*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"] { z-index: 999 !important; pointer-events: none !important; }' +
      '.product-vip__carrousel-image { box-shadow: none !important; transition: transform .05s ease-out, filter .05s ease-out; will-change: transform; cursor: pointer; }' +
      /* Estilos para la capa de brillo en el catálogo */
      '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item { position: relative; overflow: hidden; }' +
      '.melmak-glare { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99; opacity: 0; transition: opacity .3s ease; mix-blend-mode: color-dodge; }'
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

      // Crear o recuperar la capa de brillo transparente
      var glare = c.querySelector('.melmak-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'melmak-glare';
        c.appendChild(glare);
      }

      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;

        c.style.transform = 'perspective(400px) rotateX(' + ((0.5 - y) * 25) + 'deg) rotateY(' + ((x - 0.5) * 30) + 'deg) scale(1.10)';
        c.style.transition = 'transform .05s ease-out';
        c.style.zIndex = '50';

        // Actualizar la posición del destello según el cursor
        glare.style.opacity = '1';
        glare.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 55%)';
      });

      c.addEventListener('mouseleave', function () {
        c.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
        c.style.transition = 'transform .3s ease-out';
        c.style.zIndex = '1';

        // Apagar el brillo
        glare.style.opacity = '0';
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
        
        // Brillo reactivo a la inclinación vertical (rango 0.85 a 1.20)
        var brightness = 1 + (0.5 - y) * 0.60;
        img.style.filter = 'brightness(' + brightness + ')';
        img.style.transition = 'transform .05s ease-out, filter .05s ease-out';
      });

      img.addEventListener('mouseleave', function () {
        img.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
        img.style.filter = 'brightness(1)';
        img.style.transition = 'transform .3s ease-out, filter .3s ease-out';
      });
    })(vips[j]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();


<script>
(function () {

    const ROOTS = [
        '/animados',
        '/animanga',
        '/cine-y-tv',
        '/color',
        '/dragon-ball',
        '/harry-potter',
        '/melmakeadas',
        '/musica',
        '/musica-portadas',
        '/pokemon-todos',
        '/star-wars',
        '/simpsons',
        '/universo',
        '/zapas-todas',
        '/mas-categorias-actualizando',
        '/stickers-portadas',
        '/holograficos',
        '/mayorista',
        '/personalizados',
        '/packs'
    ];

    function normalize(path) {
        return path.replace(/\/+$/, '') || '/';
    }

    function findMenuRootItem(path) {

        const anchors = document.querySelectorAll(
            '.desktop-list__menu a[href]'
        );

        for (const a of anchors) {

            const url = new URL(
                a.href,
                window.location.origin
            );

            if (normalize(url.pathname) !== path) {
                continue;
            }

            /*
             * Subimos hasta encontrar el <li> que representa
             * la categoría completa del menú.
             */
            let li = a.closest('li');

            if (!li) continue;

            /*
             * Para una categoría raíz queremos el <li>
             * cuyo enlace es el encabezado de esa categoría.
             */
            while (
                li.parentElement &&
                li.parentElement.closest('.desktop-list__menu')
            ) {

                const parentLi = li.parentElement.closest('li');

                if (!parentLi) break;

                const parentAnchor =
                    parentLi.querySelector(':scope > a[href]');

                /*
                 * Si el enlace directo del li padre tiene
                 * otra URL, ya llegamos al nodo correcto.
                 */
                if (!parentAnchor) break;

                const parentUrl = new URL(
                    parentAnchor.href,
                    window.location.origin
                );

                const parentPath =
                    normalize(parentUrl.pathname);

                /*
                 * Si el padre no tiene una de nuestras raíces,
                 * dejamos de subir.
                 */
                if (ROOTS.includes(parentPath)) {
                    li = parentLi;
                } else {
                    break;
                }
            }

            return li;
        }

        return null;
    }

    function buildSidebar() {

        const sidebar = document.querySelector('.cat-arbol');

        if (!sidebar) return false;

        const menu = document.querySelector('.desktop-list__menu');

        if (!menu) return false;

        /*
         * Evitar doble ejecución.
         */
        if (sidebar.dataset.clonadoDesdeMenu === '1') {
            return true;
        }

        const newList = document.createElement('ul');

        /*
         * Mismo formato que usa tu árbol lateral.
         */
        newList.className = 'cat-raices';

        let encontrados = 0;

        ROOTS.forEach(function (path) {

            const original = findMenuRootItem(path);

            if (!original) {
                console.warn(
                    '[Categorias] No encontrada:',
                    path
                );
                return;
            }

            /*
             * Clonamos TODO el árbol de esa categoría:
             *
             * categoría
             * ├─ subcategoría
             * ├─ subcategoría
             * └─ subcategoría
             *
             * incluyendo niveles posteriores.
             */
            const clone = original.cloneNode(true);

            /*
             * Adaptamos las clases al árbol lateral.
             */
            adaptarClases(clone);

            newList.appendChild(clone);

            encontrados++;
        });

        /*
         * Sólo reemplazar si conseguimos las categorías.
         */
        if (encontrados !== ROOTS.length) {
            console.warn(
                '[Categorias] Sólo se encontraron',
                encontrados,
                'de',
                ROOTS.length
            );

            return false;
        }

        sidebar.innerHTML = '';
        sidebar.appendChild(newList);

        sidebar.dataset.clonadoDesdeMenu = '1';

        console.log(
            '[Categorias] Sidebar reconstruido correctamente'
        );

        return true;
    }

    function adaptarClases(elemento) {

        /*
         * Convertimos las clases del menú superior
         * en las clases que usa tu árbol lateral.
         */

        elemento.classList.add('cat-rama');

        const nestedLists =
            elemento.querySelectorAll('ul');

        nestedLists.forEach(function (ul) {
            ul.classList.add('cat-hijos');
        });

        /*
         * Agregar flechas a categorías que tienen hijos.
         */
        elemento.querySelectorAll('li').forEach(function (li) {

            const enlace = li.querySelector(':scope > a');

            if (!enlace) return;

            const tieneHijos =
                li.querySelector(':scope > ul');

            if (!tieneHijos) return;

            /*
             * El menú superior no necesita nuestra flechita,
             * pero el sidebar sí.
             */
            let cabeza =
                li.querySelector(':scope > .cat-cabeza');

            if (!cabeza) {

                cabeza =
                    document.createElement('div');

                cabeza.className = 'cat-cabeza';

                enlace.parentNode.insertBefore(
                    cabeza,
                    enlace
                );

                cabeza.appendChild(enlace);
            }

            if (
                !cabeza.querySelector(
                    ':scope > .flechita'
                )
            ) {

                const flecha =
                    document.createElement('span');

                flecha.className = 'flechita';
                flecha.textContent = '▼';

                cabeza.appendChild(flecha);
            }
        });
    }

    /*
     * Empretienda puede insertar el menú después del
     * primer evento de carga.
     */
    let attempts = 0;

    const timer = setInterval(function () {

        attempts++;

        if (buildSidebar()) {
            clearInterval(timer);
        }

        if (attempts >= 40) {
            clearInterval(timer);
        }

    }, 250);

    buildSidebar();

})();
</script>
