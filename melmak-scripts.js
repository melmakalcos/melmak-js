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
        return path
            .split('?')[0]
            .split('#')[0]
            .replace(/\/+$/, '') || '/';
    }

    function getPath(anchor) {
        try {
            return normalize(
                new URL(anchor.href, window.location.origin).pathname
            );
        } catch (e) {
            return '';
        }
    }

    /*
     * Busca el <li> RAÍZ real dentro del menú superior.
     *
     * No usamos closest() para subir arbitrariamente.
     * Buscamos el enlace exacto y después subimos hasta
     * encontrar el <li> que pertenece directamente al
     * primer <ul> del menú.
     */
    function findRootLI(path) {

        const menu = document.querySelector('.desktop-list__menu');

        if (!menu) {
            return null;
        }

        const anchors = menu.querySelectorAll('a[href]');

        for (const anchor of anchors) {

            if (getPath(anchor) !== path) {
                continue;
            }

            let li = anchor.closest('li');

            if (!li) {
                continue;
            }

            /*
             * Subimos hasta que el UL padre sea el UL
             * principal del menú.
             */
            while (li.parentElement) {

                const parent = li.parentElement;

                if (
                    parent.matches('ul') &&
                    parent.closest('.desktop-list__menu') === menu
                ) {
                    return li;
                }

                const parentLI = parent.closest('li');

                if (!parentLI) {
                    break;
                }

                li = parentLI;
            }
        }

        return null;
    }


    /*
     * Convierte el elemento clonado del menú superior
     * en un elemento del árbol lateral.
     */
    function prepareTree(rootLI) {

        rootLI.classList.add('cat-rama');

        /*
         * Todas las listas descendientes pasan a ser
         * listas de hijos del árbol.
         */
        rootLI.querySelectorAll('ul').forEach(function (ul) {
            ul.classList.add('cat-hijos');
        });


        /*
         * Creamos el encabezado con la flecha solamente
         * para elementos que realmente tienen hijos DIRECTOS.
         */
        rootLI.querySelectorAll('li').forEach(function (li) {

            const directLink = li.querySelector(':scope > a[href]');
            const directUL = li.querySelector(':scope > ul');

            if (!directLink || !directUL) {
                return;
            }

            let header = li.querySelector(':scope > .cat-cabeza');

            if (!header) {

                header = document.createElement('div');
                header.className = 'cat-cabeza';

                directLink.parentNode.insertBefore(
                    header,
                    directLink
                );

                header.appendChild(directLink);
            }

            /*
             * No duplicar flechas.
             */
            if (!header.querySelector(':scope > .flechita')) {

                const arrow = document.createElement('span');

                arrow.className = 'flechita';
                arrow.textContent = '▼';

                header.appendChild(arrow);
            }
        });


        /*
         * IMPORTANTE:
         * Eliminamos la segunda MUSICA-PORTADAS que está
         * dentro de MAS CATEGORIAS.
         *
         * La raíz /musica-portadas queda intacta.
         */
        rootLI.querySelectorAll('a[href]').forEach(function (a) {

            const path = getPath(a);

            if (
                path === '/mas-categorias-actualizando/musica-portadas'
            ) {
                const li = a.closest('li');

                if (li) {
                    li.remove();
                }
            }
        });
    }


    function buildSidebar() {

        const sidebar = document.querySelector('.cat-arbol');
        const menu = document.querySelector('.desktop-list__menu');

        if (!sidebar || !menu) {
            return false;
        }


        /*
         * Si ya construimos el árbol, no volver a hacerlo.
         */
        if (sidebar.dataset.menuTreeReady === '1') {
            return true;
        }


        const newList = document.createElement('ul');

        newList.className = 'cat-raices';


        let found = 0;


        ROOTS.forEach(function (path) {

            const original = findRootLI(path);

            if (!original) {

                console.warn(
                    '[Categorias] No se encontró raíz:',
                    path
                );

                return;
            }


            /*
             * Clonamos únicamente el <li> raíz correcto.
             * Todo su árbol interno viene con él.
             */
            const clone = original.cloneNode(true);

            prepareTree(clone);

            newList.appendChild(clone);

            found++;
        });


        /*
         * No destruir el sidebar si Empretienda todavía
         * no terminó de cargar el menú.
         */
        if (found !== ROOTS.length) {

            console.warn(
                '[Categorias] Árbol incompleto:',
                found + '/' + ROOTS.length
            );

            return false;
        }


        /*
         * Reemplazamos el contenido anterior.
         */
        sidebar.innerHTML = '';

        sidebar.appendChild(newList);

        sidebar.dataset.menuTreeReady = '1';


        console.log(
            '[Categorias] Árbol lateral reconstruido:',
            found + ' raíces'
        );


        return true;
    }


    /*
     * Empretienda puede cargar el menú después.
     */
    let attempts = 0;

    const timer = setInterval(function () {

        attempts++;

        if (buildSidebar()) {
            clearInterval(timer);
            return;
        }

        if (attempts >= 80) {
            clearInterval(timer);

            console.warn(
                '[Categorias] Se agotaron los intentos de carga.'
            );
        }

    }, 250);


    /*
     * Intento inmediato.
     */
    buildSidebar();

})();
</script>
