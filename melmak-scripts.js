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

    function reconstruirArbolCategorias() {

        const arbol = document.querySelector('.cat-arbol');
        const listaRaices = document.querySelector('.products-feed__categories-list');

        if (!arbol || !listaRaices) {
            return false;
        }

        /*
         * Evita ejecutar el proceso dos veces.
         */
        if (arbol.dataset.arbolCorregido === '1') {
            return true;
        }

        /*
         * ---------------------------------------------------------
         * 1. Obtener las categorías RAÍZ.
         *
         * Estas son exactamente las que Empretienda muestra
         * en "Categorías".
         * ---------------------------------------------------------
         */

        const raices = [];

        listaRaices.querySelectorAll(':scope > li > a').forEach(function (a) {

            const url = new URL(a.href, window.location.origin);
            const path = normalizar(url.pathname);

            raices.push({
                path: path,
                href: a.href,
                nombre: a.textContent.trim()
            });

        });


        /*
         * ---------------------------------------------------------
         * 2. Obtener TODAS las categorías del árbol original.
         * ---------------------------------------------------------
         */

        const categorias = new Map();

        arbol.querySelectorAll('a[href]').forEach(function (a) {

            const url = new URL(a.href, window.location.origin);
            const path = normalizar(url.pathname);

            if (!path) {
                return;
            }

            /*
             * No guardar dos veces la misma URL.
             */
            if (!categorias.has(path)) {

                categorias.set(path, {
                    path: path,
                    href: a.href,
                    nombre: a.textContent.trim()
                });

            }

        });


        /*
         * ---------------------------------------------------------
         * 3. Construir un árbol jerárquico REAL a partir de las URLs.
         *
         * Ejemplo:
         *
         * /universo
         * /universo/dc
         * /universo/dc/batman-joker
         *
         * se convierte en:
         *
         * UNIVERSO
         *    DC
         *       BATMAN-JOKER
         * ---------------------------------------------------------
         */

        function obtenerHijos(pathPadre) {

            const hijos = [];

            categorias.forEach(function (categoria) {

                if (categoria.path === pathPadre) {
                    return;
                }

                const prefijo = pathPadre + '/';

                if (!categoria.path.startsWith(prefijo)) {
                    return;
                }

                const resto = categoria.path.substring(prefijo.length);

                /*
                 * Solamente queremos hijos DIRECTOS.
                 *
                 * /universo/dc       -> hijo de /universo
                 * /universo/dc/batman -> NO es hijo directo
                 */
                if (resto.indexOf('/') !== -1) {
                    return;
                }

                hijos.push(categoria);

            });

            /*
             * Orden alfabético.
             */
            hijos.sort(function (a, b) {
                return a.nombre.localeCompare(
                    b.nombre,
                    'es',
                    { sensitivity: 'base' }
                );
            });

            return hijos;
        }


        /*
         * ---------------------------------------------------------
         * 4. Crear visualmente cada categoría.
         * ---------------------------------------------------------
         */

        function crearNodo(categoria) {

            const li = document.createElement('li');
            li.className = 'cat-rama';

            const cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';

            const enlace = document.createElement('a');

            enlace.href = categoria.href;
            enlace.textContent = categoria.nombre;

            cabeza.appendChild(enlace);

            const hijos = obtenerHijos(categoria.path);

            /*
             * Si tiene hijos, ponemos la flecha.
             */
            if (hijos.length > 0) {

                const flecha = document.createElement('span');

                flecha.className = 'flechita';
                flecha.textContent = '▼';

                cabeza.appendChild(flecha);

            }

            li.appendChild(cabeza);


            /*
             * Crear subcategorías.
             */
            if (hijos.length > 0) {

                const ul = document.createElement('ul');

                ul.className = 'cat-hijos';

                hijos.forEach(function (hijo) {
                    ul.appendChild(crearNodo(hijo));
                });

                li.appendChild(ul);

            }

            return li;
        }


        /*
         * ---------------------------------------------------------
         * 5. Crear el nuevo árbol.
         * ---------------------------------------------------------
         */

        const nuevoArbol = document.createElement('ul');


        raices.forEach(function (raiz) {

            /*
             * Protección contra duplicados.
             */
            if (
                nuevoArbol.querySelector(
                    'a[href="' + CSS.escape(raiz.href) + '"]'
                )
            ) {
                return;
            }

            nuevoArbol.appendChild(
                crearNodo(raiz)
            );

        });


        /*
         * ---------------------------------------------------------
         * 6. Sustituir el árbol que genera Empretienda.
         * ---------------------------------------------------------
         */

        arbol.innerHTML = '';
        arbol.appendChild(nuevoArbol);

        arbol.dataset.arbolCorregido = '1';

        return true;
    }


    /*
     * Normaliza URLs.
     */
    function normalizar(path) {

        path = path.replace(/\/+$/, '');

        if (path === '') {
            path = '/';
        }

        return path;
    }


    /*
     * Empretienda puede terminar de insertar el árbol
     * después del primer momento de carga.
     */

    let intentos = 0;

    const intervalo = setInterval(function () {

        intentos++;

        if (reconstruirArbolCategorias()) {
            clearInterval(intervalo);
        }

        if (intentos >= 30) {
            clearInterval(intervalo);
        }

    }, 300);


    /*
     * También intentamos inmediatamente.
     */
    reconstruirArbolCategorias();

})();
</script>
