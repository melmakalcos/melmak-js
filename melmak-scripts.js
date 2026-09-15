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

    /*
     * Busca una categoría directamente en el menú superior.
     *
     * NO usamos .desktop-list__menu porque comprobamos
     * que el menú real contiene:
     *
     * .desktop-list-link__text
     * .desktop-list__subitem
     */
    function findRootItem(path) {

        const links = document.querySelectorAll(
            'a.desktop-list-link__text[href]'
        );

        for (const link of links) {

            let url;

            try {
                url = new URL(
                    link.href,
                    window.location.origin
                );
            } catch (e) {
                continue;
            }

            if (normalize(url.pathname) !== path) {
                continue;
            }

            const li = link.closest('li');

            if (!li) {
                continue;
            }

            return li;
        }

        return null;
    }

    /*
     * Convierte la estructura original del menú
     * en la estructura que utiliza nuestro árbol amarillo.
     */
    function adaptarClases(root) {

        root.classList.add('cat-rama');

        /*
         * Todas las listas UL que vienen dentro
         * del elemento original pasan a ser hijos.
         */
        root.querySelectorAll('ul').forEach(function (ul) {
            ul.classList.add('cat-hijos');
        });

        /*
         * A cada LI que tenga un UL hijo le ponemos
         * su encabezado + flecha.
         */
        root.querySelectorAll('li').forEach(function (li) {

            const link = li.querySelector(':scope > a');

            if (!link) {
                return;
            }

            const hijos = li.querySelector(':scope > ul');

            if (!hijos) {
                return;
            }

            let cabeza =
                li.querySelector(':scope > .cat-cabeza');

            if (!cabeza) {

                cabeza =
                    document.createElement('div');

                cabeza.className = 'cat-cabeza';

                link.parentNode.insertBefore(
                    cabeza,
                    link
                );

                cabeza.appendChild(link);
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

    function construirSidebar() {

        const sidebar =
            document.querySelector('.cat-arbol');

        if (!sidebar) {
            return false;
        }

        /*
         * Si ya fue construido, no lo volvemos a hacer.
         */
        if (
            sidebar.dataset.clonadoDesdeMenu === '1'
        ) {
            return true;
        }

        const nuevaLista =
            document.createElement('ul');

        nuevaLista.className =
            'cat-raices';

        let encontrados = 0;

        ROOTS.forEach(function (path) {

            const original =
                findRootItem(path);

            if (!original) {

                console.warn(
                    '[Categorias] No encontrada:',
                    path
                );

                return;
            }

            /*
             * CLONAMOS EL LI COMPLETO.
             *
             * Esto es fundamental:
             *
             * UNIVERSO
             *   └─ DC
             *      ├─ BATICHICA
             *      ├─ BATMAN-JOKER
             *      └─ ...
             *
             * se conserva exactamente como está
             * en el menú superior.
             */
            const copia =
                original.cloneNode(true);

            adaptarClases(copia);

            nuevaLista.appendChild(copia);

            encontrados++;
        });

        /*
         * No reemplazamos el árbol si no encontramos
         * las 20 categorías. Así evitamos dejarlo vacío
         * por un problema momentáneo de carga.
         */
        if (encontrados !== ROOTS.length) {

            console.warn(
                '[Categorias] Encontradas',
                encontrados,
                'de',
                ROOTS.length,
                'categorías raíz.'
            );

            return false;
        }

        sidebar.innerHTML = '';

        sidebar.appendChild(nuevaLista);

        sidebar.dataset.clonadoDesdeMenu = '1';

        console.log(
            '[Categorias] Árbol amarillo reconstruido desde el menú superior.'
        );

        return true;
    }

    /*
     * Empretienda carga parte del menú después de
     * cargar la página, por eso esperamos.
     */
    let intentos = 0;

    const timer =
        setInterval(function () {

            intentos++;

            if (construirSidebar()) {

                clearInterval(timer);

                return;
            }

            if (intentos >= 80) {

                clearInterval(timer);

                console.warn(
                    '[Categorias] Se agotaron los intentos de carga.'
                );
            }

        }, 250);

    /*
     * También probamos inmediatamente.
     */
    construirSidebar();

})();
</script>
