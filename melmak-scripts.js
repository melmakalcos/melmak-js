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

    const ROOT_ORDER = [
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

        if (!path) {
            return '/';
        }

        return path
            .split('?')[0]
            .split('#')[0]
            .replace(/\/+$/, '') || '/';
    }


    function getPath(link) {

        try {

            return normalize(
                new URL(
                    link.href,
                    window.location.origin
                ).pathname
            );

        } catch (e) {

            return null;

        }
    }


    /*
     * Busca el menú real de Empretienda.
     */
    function obtenerMenu() {

        return document.querySelector(
            'ul.header-menu__desktop-list'
        );

    }


    /*
     * Extrae TODOS los enlaces de categorías del menú.
     *
     * No utilizamos .cat-arbol.
     * No utilizamos la lista vieja.
     */
    function obtenerCategorias() {

        const menu = obtenerMenu();

        if (!menu) {

            console.warn(
                '[Categorias] No se encontró header-menu__desktop-list'
            );

            return [];

        }


        const enlaces = [
            ...menu.querySelectorAll('a[href]')
        ];


        const categorias = [];


        enlaces.forEach(function (link) {

            const path = getPath(link);

            if (!path || path === '/') {
                return;
            }


            const texto =
                link.textContent
                    .replace(/\s+/g, ' ')
                    .trim();


            if (!texto) {
                return;
            }


            /*
             * Evitamos duplicados.
             */
            if (
                categorias.some(
                    x => x.path === path
                )
            ) {
                return;
            }


            categorias.push({
                path: path,
                texto: texto,
                link: link
            });

        });


        return categorias;

    }


    /*
     * Construye un índice por URL.
     */
    function crearIndice(categorias) {

        const indice = {};

        categorias.forEach(function (categoria) {

            indice[categoria.path] =
                categoria;

        });

        return indice;

    }


    /*
     * Devuelve los segmentos de una URL.
     *
     * /universo/dc/batichica
     *
     * => ["universo", "dc", "batichica"]
     */
    function segmentos(path) {

        return path
            .replace(/^\/+/, '')
            .split('/')
            .filter(Boolean);

    }


    /*
     * Determina el padre REAL según la URL.
     *
     * /universo/dc/batichica
     *        ↓
     * /universo/dc
     *
     * /universo/dc
     *        ↓
     * /universo
     *
     * /universo
     *        ↓
     * raíz
     */
    function obtenerPadre(path, indice) {

        const partes = segmentos(path);


        if (partes.length <= 1) {
            return null;
        }


        partes.pop();


        const posiblePadre =
            '/' + partes.join('/');


        /*
         * Solo aceptamos el padre si realmente
         * existe en el menú.
         */
        if (indice[posiblePadre]) {
            return posiblePadre;
        }


        return null;

    }


    /*
     * Crea un nodo visual.
     */
    function crearNodo(categoria) {

        const li =
            document.createElement('li');

        li.className = 'cat-rama';


        const a =
            document.createElement('a');

        a.href =
            categoria.link.href;

        a.textContent =
            categoria.texto;


        li.appendChild(a);


        return li;

    }


    /*
     * Construye la jerarquía completa.
     */
    function construir() {

        const sidebar =
            document.querySelector('.cat-arbol');


        if (!sidebar) {

            return false;

        }


        const categorias =
            obtenerCategorias();


        if (!categorias.length) {

            return false;

        }


        const indice =
            crearIndice(categorias);


        console.log(
            '[Categorias] Categorías encontradas:',
            categorias.length
        );


        /*
         * Creamos un nodo para cada categoría.
         */
        const nodos = {};


        categorias.forEach(function (categoria) {

            nodos[categoria.path] =
                crearNodo(categoria);

        });


        /*
         * Listas de hijos.
         */
        const listas = {};


        /*
         * Primero construimos las relaciones
         * padre → hijo.
         */
        categorias.forEach(function (categoria) {

            const padre =
                obtenerPadre(
                    categoria.path,
                    indice
                );


            if (!padre) {
                return;
            }


            if (!listas[padre]) {

                listas[padre] =
                    document.createElement('ul');

                listas[padre].className =
                    'cat-hijos';

            }


            listas[padre].appendChild(
                nodos[categoria.path]
            );

        });


        /*
         * Agregamos las listas de hijos
         * a sus respectivos nodos.
         */
        Object.keys(listas).forEach(function (path) {

            if (!nodos[path]) {
                return;
            }


            nodos[path].appendChild(
                listas[path]
            );

        });


        /*
         * Creamos encabezados + flechas
         * para categorías que tienen hijos.
         */
        Object.keys(listas).forEach(function (path) {

            const li =
                nodos[path];


            if (!li) {
                return;
            }


            const enlace =
                li.querySelector(
                    ':scope > a'
                );


            if (!enlace) {
                return;
            }


            const cabeza =
                document.createElement('div');

            cabeza.className =
                'cat-cabeza';


            cabeza.appendChild(
                enlace
            );


            const flecha =
                document.createElement('span');

            flecha.className =
                'flechita';

            flecha.textContent =
                '▼';


            cabeza.appendChild(
                flecha
            );


            li.insertBefore(
                cabeza,
                li.querySelector(
                    ':scope > ul'
                )
            );

        });


        /*
         * Raíces reales.
         *
         * Solo las categorías de primer nivel.
         */
        const raices =
            categorias.filter(function (categoria) {

                return segmentos(
                    categoria.path
                ).length === 1;

            });


        /*
         * Ordenamos las raíces según tu orden.
         */
        raices.sort(function (a, b) {

            const ia =
                ROOT_ORDER.indexOf(a.path);

            const ib =
                ROOT_ORDER.indexOf(b.path);


            /*
             * Las que están en ROOT_ORDER
             * van primero y en ese orden.
             */
            if (ia !== -1 && ib !== -1) {
                return ia - ib;
            }


            if (ia !== -1) {
                return -1;
            }


            if (ib !== -1) {
                return 1;
            }


            /*
             * Las nuevas categorías que no están
             * en ROOT_ORDER quedan al final.
             */
            return a.texto.localeCompare(
                b.texto,
                'es'
            );

        });


        const nuevaLista =
            document.createElement('ul');

        nuevaLista.className =
            'cat-raices';


        /*
         * Insertamos las raíces.
         */
        raices.forEach(function (categoria) {

            nuevaLista.appendChild(
                nodos[categoria.path]
            );

        });


        /*
         * Reemplazamos el árbol anterior.
         */
        sidebar.innerHTML = '';

        sidebar.appendChild(
            nuevaLista
        );


        sidebar.dataset.clonadoDesdeMenu =
            '1';


        console.log(
            '[Categorias] Árbol reconstruido correctamente.'
        );


        /*
         * Comprobaciones útiles.
         */
        const comprobarDC =
            document.querySelector(
                '.cat-arbol a[href$="/universo/dc"]'
            );


        const comprobarMarvel =
            document.querySelector(
                '.cat-arbol a[href$="/universo/marvel"]'
            );


        const comprobarTornasol =
            document.querySelector(
                '.cat-arbol a[href$="/holograficos/tornasol"]'
            );


        const comprobarNiIdea =
            document.querySelector(
                '.cat-arbol a[href$="/ni-idea"]'
            );


        console.log(
            '[Categorias] DC:',
            !!comprobarDC
        );

        console.log(
            '[Categorias] MARVEL:',
            !!comprobarMarvel
        );

        console.log(
            '[Categorias] TORNASOL:',
            !!comprobarTornasol
        );

        console.log(
            '[Categorias] NI IDEA:',
            !!comprobarNiIdea
        );


        return true;

    }


    /*
     * Esperamos al menú de Empretienda.
     */
    let intentos = 0;


    const timer =
        setInterval(function () {

            intentos++;


            if (construir()) {

                clearInterval(timer);

                return;

            }


            if (intentos >= 80) {

                clearInterval(timer);

                console.warn(
                    '[Categorias] No se pudo construir el árbol.'
                );

                clearInterval(timer);

            }

        }, 250);


    /*
     * Primer intento inmediato.
     */
    construir();


})();
</script>
