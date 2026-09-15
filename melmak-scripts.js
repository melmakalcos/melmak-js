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
/* ARBOL_CATEGORIAS_V2 */
(function () {

    function normalizarRuta(href) {
        try {
            var u = new URL(href, location.origin);
            var p = u.pathname.replace(/\/+$/, '');
            return p || '/';
        } catch (e) {
            return '';
        }
    }

    function construir() {

        var filtro = document.querySelector('.products-feed__filter');
        if (!filtro) return false;

        var menu = document.querySelector(
            '.header-menu__desktop-list__container-list'
        );
        if (!menu) return false;

        /* Si ya existe, no lo duplicamos */
        var viejo = filtro.querySelector('.cat-arbol');
        if (viejo) viejo.remove();

        /*
         * ---------------------------------------------------------
         * 1. OBTENER LAS CATEGORÍAS PRINCIPALES
         * ---------------------------------------------------------
         *
         * Usamos el listado nativo de Empretienda para saber
         * cuáles son las categorías raíz.
         *
         * Esto permite que NI IDEA, o cualquier categoría nueva,
         * entre automáticamente si Empretienda la agrega allí.
         */

        var enlacesRaiz = Array.from(
            filtro.querySelectorAll(
                '.products-feed__categories-list a[href]'
            )
        );

        /*
         * También buscamos categorías raíz dentro del menú.
         * Esto sirve para categorías nuevas que todavía no estén
         * reflejadas en el bloque lateral nativo.
         */
        var candidatosMenu = Array.from(
            menu.querySelectorAll('a[href]')
        );

        var raices = {};
        var ordenRaices = [];

        function agregarRaiz(a) {

            var href = normalizarRuta(a.href);
            if (!href || href === '/') return;

            var partes = href.split('/').filter(Boolean);
            if (partes.length !== 1) return;

            var clave = '/' + partes[0];

            if (!raices[clave]) {
                raices[clave] = {
                    href: href,
                    texto: (a.textContent || '').trim()
                };

                ordenRaices.push(clave);
            }
        }

        enlacesRaiz.forEach(agregarRaiz);

        /*
         * ---------------------------------------------------------
         * 2. LEER TODOS LOS ENLACES DEL MENÚ REAL
         * ---------------------------------------------------------
         *
         * Acá NO usamos:
         *
         * querySelectorAll('li.desktop-list__subitem > a')
         *
         * porque ese selector fue justamente el responsable
         * de aplanar DC, MARVEL, TORNASOL, etc.
         *
         * En cambio usamos las URL para reconstruir cada nivel.
         */

        var enlaces = [];

        candidatosMenu.forEach(function (a) {

            var href = normalizarRuta(a.href);
            if (!href || href === '/') return;

            var partes = href.split('/').filter(Boolean);
            if (!partes.length) return;

            var texto = (a.textContent || '').trim();
            if (!texto) return;

            /*
             * Ignoramos enlaces de navegación que no sean categorías.
             */
            if (
                href === '/productos' ||
                href === '/contacto' ||
                href === '/login' ||
                href === '/registro'
            ) {
                return;
            }

            enlaces.push({
                href: href,
                texto: texto,
                partes: partes
            });

            /*
             * Si es una ruta de primer nivel, también puede ser
             * una categoría raíz nueva.
             */
            if (partes.length === 1) {
                var clave = '/' + partes[0];

                if (!raices[clave]) {
                    raices[clave] = {
                        href: href,
                        texto: texto
                    };

                    ordenRaices.push(clave);
                }
            }
        });

        /*
         * ---------------------------------------------------------
         * 3. ELIMINAR DUPLICADOS
         * ---------------------------------------------------------
         */

        var mapa = {};

        enlaces.forEach(function (item) {

            /*
             * "Ver todo en..." apunta a la misma categoría.
             * Si existe otro enlace con el mismo href, preferimos
             * el nombre normal de la categoría.
             */
            var clave = item.href;

            if (!mapa[clave]) {
                mapa[clave] = item;
            }

        });

        enlaces = Object.keys(mapa).map(function (k) {
            return mapa[k];
        });

        /*
         * ---------------------------------------------------------
         * 4. ÁRBOL INTERNO
         * ---------------------------------------------------------
         */

        var raiz = {
            hijos: {}
        };

        function obtenerNodo(partes) {

            var nodo = raiz;

            for (var i = 0; i < partes.length; i++) {

                var segmento = partes[i];
                var ruta = '/' + partes.slice(0, i + 1).join('/');

                if (!nodo.hijos[segmento]) {

                    nodo.hijos[segmento] = {
                        href: ruta,
                        texto: '',
                        hijos: {},
                        orden: []
                    };

                    nodo.orden = nodo.orden || [];

                    nodo.orden.push(segmento);
                }

                nodo = nodo.hijos[segmento];
            }

            return nodo;
        }

        /*
         * Insertamos las categorías utilizando la URL.
         *
         * /universo/dc
         * /universo/dc/batichica
         *
         * produce:
         *
         * UNIVERSO
         *   DC
         *     BATICHICA
         */

        enlaces.forEach(function (item) {

            var nodo = obtenerNodo(item.partes);

            /*
             * Evitamos que "Ver todo en..." reemplace el nombre
             * correcto de la categoría.
             */
            if (!nodo.texto || nodo.texto.toLowerCase().indexOf('ver todo') === -1) {
                nodo.texto = item.texto;
            }

            nodo.href = item.href;
        });

        /*
         * ---------------------------------------------------------
         * 5. CREAR HTML RECURSIVAMENTE
         * ---------------------------------------------------------
         */

        function crearRama(nodo, nivel) {

            var li = document.createElement('li');

            var tieneHijos =
                nodo.orden &&
                nodo.orden.length > 0;

            if (tieneHijos) {

                li.className = 'cat-rama';
                li.setAttribute('data-tiene-hijos', '1');
                li.setAttribute('data-nivel', nivel);

                var cabeza = document.createElement('div');
                cabeza.className = 'cat-cabeza';

                var a = document.createElement('a');
                a.href = nodo.href;
                a.textContent = nodo.texto;

                var flecha = document.createElement('span');
                flecha.className = 'flechita';
                flecha.textContent = '▼';

                cabeza.appendChild(a);
                cabeza.appendChild(flecha);

                li.appendChild(cabeza);

                var hijos = document.createElement('ul');
                hijos.className = 'cat-hijos';

                nodo.orden.forEach(function (segmento) {

                    var hijo = nodo.hijos[segmento];

                    /*
                     * Si este nodo no tiene hijos, se crea como
                     * enlace simple.
                     */
                    if (
                        !hijo.orden ||
                        hijo.orden.length === 0
                    ) {

                        var liSimple = document.createElement('li');

                        var aSimple = document.createElement('a');
                        aSimple.href = hijo.href;
                        aSimple.textContent = hijo.texto;

                        liSimple.appendChild(aSimple);
                        hijos.appendChild(liSimple);

                    } else {

                        hijos.appendChild(
                            crearRama(hijo, nivel + 1)
                        );
                    }

                });

                li.appendChild(hijos);

            } else {

                var aFinal = document.createElement('a');
                aFinal.href = nodo.href;
                aFinal.textContent = nodo.texto;

                li.appendChild(aFinal);
            }

            return li;
        }

        /*
         * ---------------------------------------------------------
         * 6. CREAR CONTENEDOR
         * ---------------------------------------------------------
         */

        var contenedor = document.createElement('div');
        contenedor.className = 'cat-arbol';

        var lista = document.createElement('ul');
        lista.className = 'cat-lista';

        /*
         * Orden:
         * primero las categorías nativas de Empretienda.
         * Luego cualquier categoría raíz nueva que aparezca.
         */

        var usadas = {};

        ordenRaices.forEach(function (ruta) {

            var partes = ruta.split('/').filter(Boolean);
            if (!partes.length) return;

            var nodo = raiz.hijos[partes[0]];

            if (!nodo) return;

            usadas[partes[0]] = true;

            lista.appendChild(
                crearRama(nodo, 0)
            );
        });

        /*
         * Por seguridad, cualquier raíz encontrada en el menú
         * que no haya sido agregada todavía también entra.
         */

        if (raiz.orden) {

            raiz.orden.forEach(function (segmento) {

                if (usadas[segmento]) return;

                var nodo = raiz.hijos[segmento];

                if (!nodo) return;

                lista.appendChild(
                    crearRama(nodo, 0)
                );
            });
        }

        contenedor.appendChild(lista);

        /*
         * ---------------------------------------------------------
         * 7. INSERTAR
         * ---------------------------------------------------------
         */

        filtro.insertBefore(
            contenedor,
            filtro.firstChild
        );

        /*
         * ---------------------------------------------------------
         * 8. CLICK / APERTURA / CIERRE
         * ---------------------------------------------------------
         */

        contenedor.addEventListener('click', function (ev) {

            var cabeza = ev.target.closest
                ? ev.target.closest('.cat-cabeza')
                : null;

            if (!cabeza || !contenedor.contains(cabeza)) {
                return;
            }

            var rama = cabeza.parentElement;

            if (!rama || !rama.classList.contains('cat-rama')) {
                return;
            }

            /*
             * El link de la categoría no navega al hacer click
             * en la CABEZA: primero abre/cierra.
             */
            if (
                ev.target.tagName &&
                ev.target.tagName.toLowerCase() === 'a'
            ) {
                ev.preventDefault();
            }

            var abierta =
                rama.classList.contains('cat-abierta');

            /*
             * Cerramos solamente hermanos del mismo nivel.
             *
             * NO cerramos UNIVERSO al abrir DC.
             */
            var padre = rama.parentElement;

            if (padre) {

                Array.from(
                    padre.children
                ).forEach(function (hermano) {

                    if (
                        hermano !== rama &&
                        hermano.classList &&
                        hermano.classList.contains('cat-rama')
                    ) {
                        hermano.classList.remove('cat-abierta');
                    }

                });
            }

            rama.classList.toggle(
                'cat-abierta',
                !abierta
            );

        });

        /*
         * ---------------------------------------------------------
         * 9. OCULTAR CATEGORÍAS NATIVAS
         * ---------------------------------------------------------
         *
         * Solo ahora que el árbol fue construido.
         */

        var titulo = filtro.querySelector(
            '.products-feed__filter-title'
        );

        var hr = filtro.querySelector('hr');

        var categoriasNativas = filtro.querySelector(
            '.products-feed__categories-list'
        );

        if (titulo) titulo.style.display = 'none';
        if (hr) hr.style.display = 'none';
        if (categoriasNativas) categoriasNativas.style.display = 'none';

        console.log(
            '[ARBOL_CATEGORIAS_V2] Árbol construido correctamente.'
        );

        return true;
    }


    function esperar(intentos) {

        if (construir()) {
            return;
        }

        if (intentos >= 80) {
            console.warn(
                '[ARBOL_CATEGORIAS_V2] No se encontró la estructura de categorías.'
            );
            return;
        }

        setTimeout(function () {
            esperar(intentos + 1);
        }, 250);
    }

    esperar(0);

})();
</script>
