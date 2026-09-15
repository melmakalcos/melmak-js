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
/* ARBOL_CATEGORIAS_V3 */
(function () {

    function construir() {

        var filtro = document.querySelector('.products-feed__filter');

        var menu = document.querySelector(
            '.header-menu__desktop-list__container-list'
        );

        if (!filtro || !menu) return false;

        /* Eliminar árbol anterior */
        var anterior = filtro.querySelector('.cat-arbol');
        if (anterior) anterior.remove();

        /*
         * --------------------------------------------------------
         * CATEGORÍAS RAÍZ
         * --------------------------------------------------------
         *
         * Las obtenemos del listado nativo de Empretienda.
         * Esto mantiene exactamente el orden de las categorías
         * principales.
         */

        var raices = Array.from(
            filtro.querySelectorAll(
                '.products-feed__categories-list a[href]'
            )
        );

        if (!raices.length) return false;

        /*
         * --------------------------------------------------------
         * BUSCAR UN ENLACE EN EL MENÚ ORIGINAL
         * --------------------------------------------------------
         */

        function buscarEnMenu(href) {

            var buscado = new URL(
                href,
                location.origin
            ).pathname.replace(/\/+$/, '');

            var enlaces = menu.querySelectorAll('a[href]');

            for (var i = 0; i < enlaces.length; i++) {

                var actual = new URL(
                    enlaces[i].href,
                    location.origin
                ).pathname.replace(/\/+$/, '');

                if (actual === buscado) {
                    return enlaces[i];
                }
            }

            return null;
        }

        /*
         * --------------------------------------------------------
         * OBTENER EL SUBMENÚ DIRECTO DE UN LI
         * --------------------------------------------------------
         *
         * No usamos querySelectorAll() para todos los descendientes.
         * Buscamos únicamente el UL que pertenece a ESTE LI.
         */

        function obtenerSubmenu(li) {

            var hijos = li.children;

            for (var i = 0; i < hijos.length; i++) {

                var elemento = hijos[i];

                if (
                    elemento.tagName &&
                    elemento.tagName.toLowerCase() === 'ul'
                ) {
                    return elemento;
                }

                /*
                 * Empretienda suele envolver el UL dentro de
                 * div.desktop-list__menu.
                 */

                if (
                    elemento.classList &&
                    elemento.classList.contains('desktop-list__menu')
                ) {

                    var ul = elemento.querySelector(
                        ':scope > ul'
                    );

                    if (ul) return ul;

                    ul = elemento.querySelector('ul');

                    if (ul) return ul;
                }
            }

            return null;
        }

        /*
         * --------------------------------------------------------
         * CREAR UNA RAMA
         * --------------------------------------------------------
         */

        function crearRama(enlace, nivel) {

            var liOriginal = enlace.closest('li');

            if (!liOriginal) return null;

            /*
             * Buscamos solamente los hijos directos de este LI.
             */
            var submenu = obtenerSubmenu(liOriginal);

            var hijosReales = [];

            if (submenu) {

                var items = Array.from(
                    submenu.children
                );

                items.forEach(function (item) {

                    if (
                        !item.tagName ||
                        item.tagName.toLowerCase() !== 'li'
                    ) {
                        return;
                    }

                    /*
                     * Buscar el enlace directo de ESTA categoría.
                     */
                    var a = item.querySelector(
                        ':scope > a'
                    );

                    /*
                     * Si Empretienda tiene wrappers, buscamos
                     * solamente dentro del LI inmediato.
                     */
                    if (!a) {
                        a = item.querySelector(
                            ':scope > div > a'
                        );
                    }

                    if (!a) return;

                    /*
                     * No queremos "Ver todo en..."
                     */
                    var texto = (
                        a.textContent || ''
                    ).trim();

                    if (
                        texto.toLowerCase().indexOf(
                            'ver todo en'
                        ) === 0
                    ) {
                        return;
                    }

                    hijosReales.push(a);
                });
            }

            /*
             * ----------------------------------------------------
             * CREAR LI
             * ----------------------------------------------------
             */

            var li = document.createElement('li');

            if (hijosReales.length) {

                li.className = 'cat-rama';
                li.setAttribute(
                    'data-tiene-hijos',
                    '1'
                );

                var cabeza = document.createElement('div');
                cabeza.className = 'cat-cabeza';

                var aPrincipal = document.createElement('a');
                aPrincipal.href = enlace.href;
                aPrincipal.textContent = (
                    enlace.textContent || ''
                ).trim();

                var flecha = document.createElement('span');
                flecha.className = 'flechita';
                flecha.textContent = '▼';

                cabeza.appendChild(aPrincipal);
                cabeza.appendChild(flecha);

                li.appendChild(cabeza);

                var ul = document.createElement('ul');
                ul.className = 'cat-hijos';

                hijosReales.forEach(function (hijo) {

                    var rama = crearRama(
                        hijo,
                        nivel + 1
                    );

                    if (rama) {
                        ul.appendChild(rama);
                    }
                });

                li.appendChild(ul);

            } else {

                /*
                 * Categoría sin hijos:
                 * enlace blanco tipo botón.
                 */

                var aSimple = document.createElement('a');

                aSimple.href = enlace.href;
                aSimple.textContent = (
                    enlace.textContent || ''
                ).trim();

                li.appendChild(aSimple);
            }

            return li;
        }

        /*
         * --------------------------------------------------------
         * CREAR ÁRBOL
         * --------------------------------------------------------
         */

        var contenedor = document.createElement('div');
        contenedor.className = 'cat-arbol';

        var lista = document.createElement('ul');
        lista.className = 'cat-lista';

        raices.forEach(function (raiz) {

            var enlaceMenu = buscarEnMenu(
                raiz.href
            );

            if (!enlaceMenu) return;

            var rama = crearRama(
                enlaceMenu,
                0
            );

            if (rama) {
                lista.appendChild(rama);
            }
        });

        contenedor.appendChild(lista);

        /*
         * Insertamos antes del filtro nativo.
         */
        filtro.insertBefore(
            contenedor,
            filtro.firstChild
        );

        /*
         * --------------------------------------------------------
         * CLICK
         * --------------------------------------------------------
         */

        contenedor.addEventListener(
            'click',
            function (ev) {

                var cabeza = ev.target.closest
                    ? ev.target.closest('.cat-cabeza')
                    : null;

                if (!cabeza) return;

                var rama = cabeza.parentElement;

                if (!rama) return;

                /*
                 * Click sobre el título = abrir/cerrar.
                 */
                if (
                    ev.target.tagName &&
                    ev.target.tagName.toLowerCase() === 'a'
                ) {
                    ev.preventDefault();
                }

                var estabaAbierta =
                    rama.classList.contains(
                        'cat-abierta'
                    );

                /*
                 * Cerramos únicamente hermanos.
                 */
                var padre = rama.parentElement;

                if (padre) {

                    Array.from(
                        padre.children
                    ).forEach(function (hermano) {

                        if (
                            hermano !== rama &&
                            hermano.classList &&
                            hermano.classList.contains(
                                'cat-rama'
                            )
                        ) {
                            hermano.classList.remove(
                                'cat-abierta'
                            );
                        }
                    });
                }

                rama.classList.toggle(
                    'cat-abierta',
                    !estabaAbierta
                );
            }
        );

        /*
         * --------------------------------------------------------
         * OCULTAR EL LISTADO NATIVO
         * --------------------------------------------------------
         */

        var titulo = filtro.querySelector(
            '.products-feed__filter-title'
        );

        var hr = filtro.querySelector('hr');

        var categorias = filtro.querySelector(
            '.products-feed__categories-list'
        );

        if (titulo) titulo.style.display = 'none';
        if (hr) hr.style.display = 'none';
        if (categorias) categorias.style.display = 'none';

        console.log(
            '[ARBOL V3] Árbol construido.'
        );

        return true;
    }


    function esperar(n) {

        if (construir()) return;

        if (n >= 80) {

            console.warn(
                '[ARBOL V3] No se pudo construir el árbol.'
            );

            return;
        }

        setTimeout(
            function () {
                esperar(n + 1);
            },
            250
        );
    }

    esperar(0);

})();
</script>

<script>
/* ARBOL_CATEGORIAS_CSS_V4 */
(function () {

    var c = [

        /* =====================================================
           CONTENEDOR GENERAL
           ===================================================== */

        '.cat-arbol {',
        '  list-style:none !important;',
        '  margin:0 0 8px !important;',
        '  padding:0 !important;',
        '}',

        '.cat-arbol ul,',
        '.cat-arbol li {',
        '  list-style:none !important;',
        '  margin:0 !important;',
        '  padding:0;',
        '}',

        '.cat-lista {',
        '  margin:0 !important;',
        '  padding:0 !important;',
        '}',


        /* =====================================================
           CATEGORÍAS PRINCIPALES
           ===================================================== */

        '.cat-lista > .cat-rama > .cat-cabeza {',
        '  display:flex;',
        '  align-items:center;',
        '  justify-content:space-between;',
        '  gap:8px;',
        '  width:100%;',
        '  box-sizing:border-box;',
        '  cursor:pointer;',
        '  padding:8px 2px;',
        '  margin:0;',
        '  border-bottom:1px solid rgba(53,53,53,.25);',
        '  transition:all .22s ease;',
        '}',

        '.cat-lista > .cat-rama > .cat-cabeza:hover {',
        '  padding-left:6px;',
        '  padding-right:6px;',
        '}',

        '.cat-lista > .cat-rama > .cat-cabeza a {',
        '  display:block;',
        '  flex:1;',
        '  color:#353535 !important;',
        '  font-weight:700;',
        '  text-transform:uppercase;',
        '  text-decoration:none !important;',
        '  transition:all .22s ease;',
        '}',


        /* =====================================================
           FLECHA
           ===================================================== */

        '.cat-cabeza .flechita {',
        '  display:inline-block;',
        '  font-size:.72rem;',
        '  line-height:1;',
        '  color:#353535;',
        '  flex-shrink:0;',
        '  transition:transform .28s ease;',
        '}',

        '.cat-abierta > .cat-cabeza .flechita {',
        '  transform:rotate(180deg);',
        '}',


        /* =====================================================
           CONTENEDOR DE HIJOS
           ===================================================== */

        '.cat-hijos {',
        '  list-style:none !important;',
        '  margin:0 !important;',
        '  padding:0 0 0 5px !important;',
        '  max-height:0;',
        '  overflow:hidden;',
        '  opacity:0;',
        '  transform:translateY(-4px);',
        '  transition:',
        '    max-height .38s ease,',
        '    opacity .22s ease,',
        '    transform .28s ease;',
        '}',

        '.cat-abierta > .cat-hijos {',
        '  max-height:10000px;',
        '  opacity:1;',
        '  transform:translateY(0);',
        '}',


        /* =====================================================
           BOTONES DE CATEGORÍAS SIN HIJOS
           ===================================================== */

        '.cat-hijos > li:not(.cat-rama) > a {',
        '  display:block;',
        '  width:100%;',
        '  box-sizing:border-box;',
        '  margin:3px 0;',
        '  padding:7px 11px;',
        '  border-radius:8px;',
        '  background:#fff;',
        '  color:#353535 !important;',
        '  font-size:.82rem;',
        '  font-weight:500;',
        '  line-height:1.2;',
        '  text-decoration:none !important;',
        '  box-shadow:0 1px 3px rgba(0,0,0,.08);',
        '  transition:',
        '    transform .18s ease,',
        '    box-shadow .18s ease,',
        '    background .18s ease,',
        '    padding-left .18s ease;',
        '}',

        '.cat-hijos > li:not(.cat-rama) > a:hover {',
        '  transform:translateX(4px);',
        '  padding-left:15px;',
        '  box-shadow:0 3px 8px rgba(0,0,0,.14);',
        '  background:#fdfdfd;',
        '}',


        /* =====================================================
           BOTONES DE RAMAS INTERMEDIAS
           DC / MARVEL / TORNASOL /
           MUSICA-PORTADAS / COUNTER STRIKE / ETC.
           ===================================================== */

        '.cat-hijos > .cat-rama > .cat-cabeza {',
        '  display:flex;',
        '  align-items:center;',
        '  justify-content:space-between;',
        '  gap:7px;',
        '  width:100%;',
        '  box-sizing:border-box;',
        '  margin:3px 0;',
        '  padding:7px 11px;',
        '  border:0;',
        '  border-radius:8px;',
        '  background:#fff;',
        '  box-shadow:0 1px 3px rgba(0,0,0,.08);',
        '  cursor:pointer;',
        '  transition:',
        '    transform .18s ease,',
        '    box-shadow .18s ease,',
        '    background .18s ease;',
        '}',

        '.cat-hijos > .cat-rama > .cat-cabeza:hover {',
        '  transform:translateX(4px);',
        '  box-shadow:0 3px 8px rgba(0,0,0,.14);',
        '  background:#fdfdfd;',
        '}',

        '.cat-hijos > .cat-rama > .cat-cabeza a {',
        '  display:block;',
        '  flex:1;',
        '  color:#353535 !important;',
        '  font-size:.82rem;',
        '  font-weight:500;',
        '  line-height:1.2;',
        '  text-decoration:none !important;',
        '  text-transform:none;',
        '}',


        /* =====================================================
           FLECHA DE RAMAS INTERMEDIAS
           ===================================================== */

        '.cat-hijos > .cat-rama > .cat-cabeza .flechita {',
        '  font-size:.65rem;',
        '}',


        /* =====================================================
           NIVELES MÁS PROFUNDOS
           ===================================================== */

        '.cat-hijos .cat-hijos {',
        '  padding-left:7px !important;',
        '}',

        '.cat-hijos .cat-hijos > li:not(.cat-rama) > a {',
        '  font-size:.78rem;',
        '  padding:6px 10px;',
        '}',

        '.cat-hijos .cat-hijos > .cat-rama > .cat-cabeza {',
        '  padding:6px 10px;',
        '}',

        '.cat-hijos .cat-hijos > .cat-rama > .cat-cabeza a {',
        '  font-size:.78rem;',
        '}',


        /* =====================================================
           ANIMACIÓN AL ABRIR UNA RAMA
           ===================================================== */

        '.cat-rama {',
        '  position:relative;',
        '}',

        '.cat-rama.cat-abierta > .cat-cabeza {',
        '  box-shadow:0 3px 9px rgba(0,0,0,.12);',
        '}',


        /* =====================================================
           OCULTAR EL LISTADO NATIVO
           SOLO MIENTRAS EXISTE EL ÁRBOL
           ===================================================== */

        '.products-feed__filter > .products-feed__filter-title,',
        '.products-feed__filter > hr,',
        '.products-feed__filter > .products-feed__categories-list {',
        '  display:none !important;',
        '}'

    ].join('');

    var viejo = document.getElementById(
        'arbol-categorias-css-v3'
    );

    if (viejo) {
        viejo.remove();
    }

    var s = document.createElement('style');

    s.id = 'arbol-categorias-css-v4';
    s.type = 'text/css';

    if (s.styleSheet) {
        s.styleSheet.cssText = c;
    } else {
        s.appendChild(
            document.createTextNode(c)
        );
    }

    document.head.appendChild(s);

})();
</script>
