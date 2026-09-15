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
/* ARBOL_CATEGORIAS */
(function () {

    function normalizar(path) {
        return (path || '')
            .split('?')[0]
            .split('#')[0]
            .replace(/\/+$/, '') || '/';
    }

    function obtenerPath(a) {
        try {
            return normalizar(
                new URL(
                    a.href,
                    window.location.origin
                ).pathname
            );
        } catch (e) {
            return null;
        }
    }

    function crearArbol() {

        var filtro =
            document.querySelector('.products-feed__filter');

        if (!filtro) {
            return false;
        }

        /*
         * Si ya existe, lo eliminamos para poder
         * reconstruirlo con la estructura correcta.
         */
        var viejo =
            filtro.querySelector('.cat-arbol');

        if (viejo) {
            viejo.remove();
        }

        /*
         * MENÚ SUPERIOR REAL
         */
        var menu =
            document.querySelector(
                'ul.header-menu__desktop-list'
            );

        if (!menu) {
            console.warn(
                '[ARBOL] No se encontró el menú superior.'
            );
            return false;
        }

        /*
         * Obtenemos TODOS los enlaces de categorías.
         */
        var enlaces = [
            ...menu.querySelectorAll('a[href]')
        ];

        var categorias = [];

        enlaces.forEach(function (a) {

            var path = obtenerPath(a);

            if (!path || path === '/') {
                return;
            }

            var texto =
                a.textContent
                    .replace(/\s+/g, ' ')
                    .trim();

            if (!texto) {
                return;
            }

            /*
             * Evitar duplicados por URL.
             */
            if (
                categorias.some(function (x) {
                    return x.path === path;
                })
            ) {
                return;
            }

            categorias.push({
                path: path,
                texto: texto,
                href: a.href
            });

        });

        if (!categorias.length) {
            return false;
        }

        console.log(
            '[ARBOL] Categorías encontradas:',
            categorias.length
        );


        /*
         * Índice URL -> categoría
         */
        var indice = {};

        categorias.forEach(function (cat) {
            indice[cat.path] = cat;
        });


        /*
         * Devuelve el padre según la URL.
         *
         * /universo/dc/batichica
         *        ↓
         * /universo/dc
         */
        function obtenerPadre(path) {

            var partes =
                path
                    .replace(/^\/+/, '')
                    .split('/')
                    .filter(Boolean);

            if (partes.length <= 1) {
                return null;
            }

            partes.pop();

            var padre =
                '/' + partes.join('/');

            /*
             * Solo usamos como padre una categoría
             * que realmente exista en el menú.
             */
            if (indice[padre]) {
                return padre;
            }

            return null;
        }


        /*
         * Nodos HTML.
         */
        var nodos = {};

        categorias.forEach(function (cat) {

            var li =
                document.createElement('li');

            li.className =
                'cat-rama';

            li.setAttribute(
                'data-path',
                cat.path
            );

            var cabeza =
                document.createElement('div');

            cabeza.className =
                'cat-cabeza';

            var a =
                document.createElement('a');

            a.href =
                cat.href;

            a.textContent =
                cat.texto;

            cabeza.appendChild(a);

            li.appendChild(cabeza);

            nodos[cat.path] = li;

        });


        /*
         * Crear listas de hijos.
         */
        categorias.forEach(function (cat) {

            var padre =
                obtenerPadre(cat.path);

            if (!padre) {
                return;
            }

            var padreLi =
                nodos[padre];

            if (!padreLi) {
                return;
            }

            var hijos =
                padreLi.querySelector(
                    ':scope > .cat-hijos'
                );

            if (!hijos) {

                hijos =
                    document.createElement('ul');

                hijos.className =
                    'cat-hijos';

                padreLi.appendChild(hijos);

                /*
                 * Como ahora tiene hijos,
                 * le agregamos la flecha.
                 */
                var flecha =
                    document.createElement('span');

                flecha.className =
                    'flechita';

                flecha.textContent =
                    '▼';

                cabezaDelPadre =
                    padreLi.querySelector(
                        ':scope > .cat-cabeza'
                    );

                cabezaDelPadre.appendChild(
                    flecha
                );

                padreLi.setAttribute(
                    'data-tiene-hijos',
                    '1'
                );
            }

            hijos.appendChild(
                nodos[cat.path]
            );

        });


        /*
         * Lista de raíces.
         */
        var lista =
            document.createElement('ul');


        /*
         * Orden deseado de las raíces.
         */
        var orden = [
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


        /*
         * Categorías que no tienen padre.
         */
        var raices =
            categorias.filter(function (cat) {
                return !obtenerPadre(cat.path);
            });


        raices.sort(function (a, b) {

            var ia =
                orden.indexOf(a.path);

            var ib =
                orden.indexOf(b.path);

            /*
             * Las categorías conocidas conservan
             * tu orden original.
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
             * Categorías nuevas:
             * quedan al final.
             */
            return a.texto.localeCompare(
                b.texto,
                'es'
            );

        });


        /*
         * Agregar raíces.
         */
        raices.forEach(function (cat) {

            lista.appendChild(
                nodos[cat.path]
            );

        });


        /*
         * Contenedor amarillo.
         */
        var cont =
            document.createElement('div');

        cont.className =
            'cat-arbol';

        cont.appendChild(lista);


        /*
         * Insertar arriba del filtro.
         */
        filtro.insertBefore(
            cont,
            filtro.firstChild
        );


        /*
         * Click para abrir/cerrar.
         */
        cont.addEventListener(
            'click',
            function (ev) {

                var cabeza =
                    ev.target.closest
                        ? ev.target.closest('.cat-cabeza')
                        : null;

                if (!cabeza) {
                    return;
                }

                var rama =
                    cabeza.parentNode;

                if (
                    !rama ||
                    rama.getAttribute(
                        'data-tiene-hijos'
                    ) !== '1'
                ) {
                    return;
                }

                /*
                 * El enlace de la categoría principal
                 * no navega: abre/cierra.
                 */
                if (
                    ev.target.tagName &&
                    ev.target.tagName.toLowerCase() === 'a'
                ) {
                    ev.preventDefault();
                }


                /*
                 * Cerramos otras ramas abiertas.
                 */
                var abiertas =
                    cont.querySelectorAll(
                        '.cat-abierta'
                    );

                for (
                    var i = 0;
                    i < abiertas.length;
                    i++
                ) {

                    if (abiertas[i] !== rama) {
                        abiertas[i]
                            .classList
                            .remove(
                                'cat-abierta'
                            );
                    }

                }


                rama.classList.toggle(
                    'cat-abierta'
                );

            }
        );


        /*
         * Comprobaciones.
         */
        console.log(
            '[ARBOL] DC:',
            !!cont.querySelector(
                'a[href$="/universo/dc"]'
            )
        );

        console.log(
            '[ARBOL] MARVEL:',
            !!cont.querySelector(
                'a[href$="/universo/marvel"]'
            )
        );

        console.log(
            '[ARBOL] TORNASOL:',
            !!cont.querySelector(
                'a[href$="/holograficos/tornasol"]'
            )
        );

        console.log(
            '[ARBOL] NI IDEA:',
            !!cont.querySelector(
                'a[href$="/ni-idea"]'
            )
        );


        return true;
    }


    /*
     * Esperar a que Empretienda cargue el menú.
     */
    function esperar(intentos) {

        intentos =
            intentos || 0;

        var menu =
            document.querySelector(
                'ul.header-menu__desktop-list'
            );

        var filtro =
            document.querySelector(
                '.products-feed__filter'
            );

        if (menu && filtro) {

            crearArbol();

            return;
        }

        if (intentos >= 100) {

            console.warn(
                '[ARBOL] Tiempo de espera agotado.'
            );

            return;
        }

        setTimeout(
            function () {
                esperar(intentos + 1);
            },
            200
        );
    }


    esperar();

})();
</script>
