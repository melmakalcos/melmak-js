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

    function textoEnlace(a) {
        return (a.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /*
     * Convierte:
     *
     * /universo/dc/batichica
     *
     * en:
     *
     * ["universo", "dc", "batichica"]
     */
    function segmentos(path) {

        return normalize(path)
            .split('/')
            .filter(Boolean);

    }

    /*
     * Convierte un slug en un nombre legible
     * solamente cuando necesitamos crear una categoría
     * intermedia que no tenga su propio enlace.
     */
    function nombreDesdeSlug(slug) {

        return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, function (l) {
                return l.toUpperCase();
            });

    }

    /*
     * Crea un nodo de categoría.
     */
    function crearNodo(path, nombre, href) {

        const li = document.createElement('li');

        li.className = 'cat-rama';

        li.dataset.path = path;

        const cabeza = document.createElement('div');

        cabeza.className = 'cat-cabeza';

        const a = document.createElement('a');

        a.href = href || path;

        a.textContent = nombre;

        cabeza.appendChild(a);

        const flecha = document.createElement('span');

        flecha.className = 'flechita';

        flecha.textContent = '▼';

        cabeza.appendChild(flecha);

        li.appendChild(cabeza);

        return li;
    }

    /*
     * Obtiene el UL de hijos de una categoría.
     * Se crea solamente cuando realmente tiene hijos.
     */
    function obtenerHijos(li) {

        let ul = li.querySelector(
            ':scope > .cat-hijos'
        );

        if (!ul) {

            ul = document.createElement('ul');

            ul.className = 'cat-hijos';

            li.appendChild(ul);

        }

        return ul;
    }

    /*
     * Busca un hijo directo por su URL.
     */
    function buscarHijo(ul, path) {

        const hijos = ul.querySelectorAll(
            ':scope > li'
        );

        for (const li of hijos) {

            if (
                normalize(li.dataset.path || '') ===
                normalize(path)
            ) {
                return li;
            }

        }

        return null;
    }

    /*
     * Inserta una categoría respetando
     * TODOS los niveles de su URL.
     */
    function insertarRuta(tree, partes, datos) {

        let nivel = tree;

        let acumulado = '';

        for (let i = 0; i < partes.length; i++) {

            acumulado += '/' + partes[i];

            const path = normalize(acumulado);

            let li = buscarHijo(nivel, path);

            /*
             * Si ya existe, reutilizamos ese nodo.
             */
            if (!li) {

                let nombre = '';

                let href = path;

                /*
                 * Si este nivel corresponde a la categoría
                 * original encontrada, usamos su nombre real.
                 */
                if (i === partes.length - 1) {

                    nombre = datos.nombre;
                    href = datos.href;

                } else {

                    /*
                     * Para categorías intermedias,
                     * buscamos su nombre entre los enlaces
                     * originales.
                     */
                    const info = datos.mapa[path];

                    if (info) {

                        nombre = info.nombre;
                        href = info.href;

                    } else {

                        nombre =
                            nombreDesdeSlug(partes[i]);

                    }

                }

                li = crearNodo(
                    path,
                    nombre,
                    href
                );

                nivel.appendChild(li);

            }

            /*
             * Si todavía quedan niveles,
             * descendemos al UL correspondiente.
             */
            if (i < partes.length - 1) {

                nivel = obtenerHijos(li);

            }

        }

    }

    /*
     * Agrega el comportamiento de abrir/cerrar.
     */
    function activarRama(li) {

        const cabeza = li.querySelector(
            ':scope > .cat-cabeza'
        );

        const hijos = li.querySelector(
            ':scope > .cat-hijos'
        );

        if (!cabeza || !hijos) {
            return;
        }

        /*
         * No agregamos dos veces el evento.
         */
        if (cabeza.dataset.eventoActivo === '1') {
            return;
        }

        cabeza.dataset.eventoActivo = '1';

        cabeza.addEventListener(
            'click',
            function (event) {

                /*
                 * La flecha abre/cierra.
                 * El enlace sigue navegando normalmente.
                 */
                if (
                    event.target.closest('a')
                ) {
                    return;
                }

                li.classList.toggle(
                    'cat-abierta'
                );

            }
        );

        hijos.querySelectorAll(
            ':scope > li'
        ).forEach(function (hijo) {

            activarRama(hijo);

        });

    }

    /*
     * Reconstruye el árbol.
     */
    function construirArbol() {

        const sidebar =
            document.querySelector('.cat-arbol');

        if (!sidebar) {
            return false;
        }

        /*
         * Evita que nuestra propia reconstrucción
         * vuelva a disparar el proceso.
         */
        if (
            sidebar.dataset.reconstruyendo === '1'
        ) {
            return false;
        }

        sidebar.dataset.reconstruyendo = '1';

        /*
         * ------------------------------------------------
         * 1. RECOPILAR TODAS LAS CATEGORÍAS ACTUALES
         * ------------------------------------------------
         */

        const enlaces =
            Array.from(
                sidebar.querySelectorAll('a[href]')
            );

        const mapa = {};

        enlaces.forEach(function (a) {

            try {

                const url = new URL(
                    a.href,
                    window.location.origin
                );

                const path =
                    normalize(url.pathname);

                if (!mapa[path]) {

                    mapa[path] = {
                        nombre: textoEnlace(a),
                        href: a.href
                    };

                }

            } catch (e) {}

        });

        /*
         * ------------------------------------------------
         * 2. CREAR LAS 20 RAÍCES
         * ------------------------------------------------
         */

        const nuevaLista =
            document.createElement('ul');

        nuevaLista.className =
            'cat-raices';

        ROOTS.forEach(function (root) {

            const info = mapa[normalize(root)];

            if (!info) {

                console.warn(
                    '[Categorias] No encontrada:',
                    root
                );

                return;

            }

            const li =
                crearNodo(
                    root,
                    info.nombre,
                    info.href
                );

            nuevaLista.appendChild(li);

        });

        /*
         * ------------------------------------------------
         * 3. INSERTAR CADA CATEGORÍA SEGÚN SU URL
         * ------------------------------------------------
         */

        Object.keys(mapa).forEach(function (path) {

            /*
             * Ignorar las propias raíces.
             */
            if (
                ROOTS.some(function (root) {
                    return normalize(root) === path;
                })
            ) {
                return;
            }

            /*
             * Determinar a qué raíz pertenece.
             */
            let rootEncontrada = null;

            ROOTS.forEach(function (root) {

                root = normalize(root);

                if (
                    path.indexOf(root + '/') === 0
                ) {
                    /*
                     * Elegimos la raíz más larga,
                     * por seguridad.
                     */
                    if (
                        !rootEncontrada ||
                        root.length >
                        rootEncontrada.length
                    ) {
                        rootEncontrada = root;
                    }
                }

            });

            if (!rootEncontrada) {
                return;
            }

            /*
             * Buscar la raíz dentro del árbol nuevo.
             */
            const raiz =
                nuevaLista.querySelector(
                    ':scope > li[data-path="' +
                    rootEncontrada +
                    '"]'
                );

            if (!raiz) {
                return;
            }

            /*
             * Obtener el camino relativo.
             */
            const partes =
                segmentos(path);

            const partesRoot =
                segmentos(rootEncontrada);

            /*
             * Si el path no tiene más niveles,
             * no hay nada que insertar.
             */
            if (
                partes.length <=
                partesRoot.length
            ) {
                return;
            }

            insertarRuta(
                obtenerHijos(raiz),
                partes,
                {
                    nombre: mapa[path].nombre,
                    href: mapa[path].href,
                    mapa: mapa
                }
            );

        });

        /*
         * ------------------------------------------------
         * 4. REEMPLAZAR EL ÁRBOL ACTUAL
         * ------------------------------------------------
         */

        sidebar.innerHTML = '';

        sidebar.appendChild(nuevaLista);

        /*
         * ------------------------------------------------
         * 5. ACTIVAR TODAS LAS RAMAS
         * ------------------------------------------------
         */

        nuevaLista.querySelectorAll(
            ':scope > .cat-rama'
        ).forEach(function (rama) {

            activarRama(rama);

        });

        sidebar.dataset.arbolConstruido = '1';

        sidebar.dataset.reconstruyendo = '0';

        console.log(
            '[Categorias] Árbol jerárquico reconstruido por URL.'
        );

        return true;

    }

    /*
     * Esperar a que Empretienda genere el árbol original.
     */
    let intentos = 0;

    const timer = setInterval(function () {

        intentos++;

        const sidebar =
            document.querySelector('.cat-arbol');

        if (
            sidebar &&
            sidebar.querySelectorAll('a[href]').length > 20
        ) {

            clearInterval(timer);

            construirArbol();

        }

        if (intentos >= 80) {

            clearInterval(timer);

            console.warn(
                '[Categorias] Tiempo de espera agotado.'
            );

        }

    }, 250);

})();
</script>
