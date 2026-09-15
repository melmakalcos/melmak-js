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
/* ARBOL_CATEGORIAS_FINAL */
(function () {

    function iniciarArbol() {

        var filtro = document.querySelector('.products-feed__filter');
        if (!filtro) return false;

        var lista = filtro.querySelector('.products-feed__categories-list');
        var menu = document.querySelector(
            '.header-menu__desktop-list__container-list .desktop-list__menu'
        );

        if (!lista || !menu) return false;

        /*
         * ELIMINAMOS EL ÁRBOL PERSONALIZADO ANTERIOR
         */
        filtro.querySelectorAll('.cat-arbol').forEach(function (el) {
            el.remove();
        });

        /*
         * RESTAURAMOS EL LISTADO NATIVO.
         * No lo ocultamos: ahora lo vamos a reutilizar.
         */
        lista.style.removeProperty('display');
        lista.classList.add('cat-arbol-lista');

        /*
         * Buscamos las categorías PRINCIPALES del menú superior.
         *
         * La estructura real de Empretienda es:
         *
         * .desktop-list__menu
         *   └── ul
         *       └── li
         *           ├── a = categoría principal
         *           ├── ul
         *           │   └── li
         *           │       └── a = subcategoría
         *           ├── ul
         *           │   └── li
         *           │       └── a = otra subcategoría
         *           ...
         */
        var menuRaices = Array.from(
            menu.querySelectorAll(':scope > ul > li')
        );

        /*
         * Mapa por URL para encontrar rápidamente
         * cada categoría principal.
         */
        var mapaRaices = {};

        menuRaices.forEach(function (li) {

            var a = li.querySelector(':scope > a');

            if (!a) return;

            var url = normalizarURL(a.getAttribute('href'));

            if (url) {
                mapaRaices[url] = li;
            }
        });


        /*
         * Obtiene los hijos DIRECTOS de un LI.
         *
         * IMPORTANTE:
         * Cada subcategoría de Empretienda está dentro
         * de un UL separado, por eso recorremos los UL
         * hijos directos del LI.
         */
        function obtenerHijos(li) {

            var resultado = [];

            Array.from(li.children).forEach(function (elemento) {

                if (elemento.tagName !== 'UL') return;

                Array.from(elemento.children).forEach(function (hijoLI) {

                    if (hijoLI.tagName !== 'LI') return;

                    var a = hijoLI.querySelector(':scope > a');

                    if (!a) return;

                    var texto = limpiarTexto(a.textContent);

                    if (!texto) return;

                    /*
                     * No queremos enlaces auxiliares
                     * como "Ver todo en..."
                     */
                    if (/^ver todo en/i.test(texto)) return;

                    resultado.push({
                        li: hijoLI,
                        a: a
                    });

                });

            });

            return resultado;
        }


        /*
         * Construcción RECURSIVA.
         *
         * Esto es lo que permite:
         *
         * UNIVERSO
         *   DC
         *     BATMAN
         *
         * y no:
         *
         * UNIVERSO
         *   DC
         *   BATMAN
         */
        function construirNivel(liOrigen, nivel) {

            var ul = document.createElement('ul');
            ul.className = nivel === 0
                ? 'cat-hijos nivel-1'
                : 'cat-hijos nivel-' + (nivel + 1);

            var hijos = obtenerHijos(liOrigen);

            hijos.forEach(function (item) {

                var li = document.createElement('li');
                var aOrigen = item.a;

                var hijosDeEste = obtenerHijos(item.li);

                if (hijosDeEste.length > 0) {

                    /*
                     * CATEGORÍA CON HIJOS
                     */
                    li.className = 'cat-rama';
                    li.setAttribute('data-tiene-hijos', '1');

                    var cabeza = document.createElement('div');
                    cabeza.className = 'cat-cabeza cat-subcabeza';

                    var a = document.createElement('a');

                    a.href = aOrigen.href;
                    a.textContent = limpiarTexto(aOrigen.textContent);

                    cabeza.appendChild(a);

                    var flecha = document.createElement('span');
                    flecha.className = 'flechita';
                    flecha.textContent = '▼';

                    cabeza.appendChild(flecha);

                    li.appendChild(cabeza);

                    /*
                     * RECURSIVIDAD
                     */
                    var subnivel = construirNivel(item.li, nivel + 1);

                    li.appendChild(subnivel);

                } else {

                    /*
                     * CATEGORÍA FINAL / HOJA
                     */
                    li.className = 'cat-hoja';

                    var enlace = document.createElement('a');

                    enlace.href = aOrigen.href;
                    enlace.textContent = limpiarTexto(aOrigen.textContent);

                    li.appendChild(enlace);
                }

                ul.appendChild(li);
            });

            return ul;
        }


        /*
         * Guardamos las 20 categorías principales
         * del listado nativo.
         *
         * Así respetamos EXACTAMENTE el orden
         * que tiene tu catálogo lateral.
         */
        var categoriasPrincipales = Array.from(
            lista.querySelectorAll(':scope > li')
        );

        /*
         * Si Empretienda tiene otra estructura interna,
         * hacemos una segunda búsqueda segura.
         */
        if (!categoriasPrincipales.length) {
            categoriasPrincipales = Array.from(
                lista.children
            ).filter(function (el) {
                return el.tagName === 'LI';
            });
        }


        /*
         * VACIAMOS SOLAMENTE EL LISTADO NATIVO
         * de la barra izquierda.
         */
        lista.innerHTML = '';


        /*
         * RECONSTRUIMOS EL ÁRBOL
         */
        categoriasPrincipales.forEach(function (liOriginal) {

            var enlaceOriginal = liOriginal.querySelector('a');

            if (!enlaceOriginal) return;

            var texto = limpiarTexto(enlaceOriginal.textContent);
            var url = normalizarURL(enlaceOriginal.getAttribute('href'));

            if (!texto || !url) return;

            var liNuevo = document.createElement('li');
            liNuevo.className = 'cat-rama cat-raiz';

            /*
             * Buscamos la categoría correspondiente
             * en el menú superior.
             */
            var liMenu = mapaRaices[url];

            var hijos = liMenu
                ? obtenerHijos(liMenu)
                : [];

            if (hijos.length > 0) {

                liNuevo.setAttribute('data-tiene-hijos', '1');

                var cabeza = document.createElement('div');
                cabeza.className = 'cat-cabeza';

                var a = document.createElement('a');

                a.href = enlaceOriginal.href;
                a.textContent = texto;

                cabeza.appendChild(a);

                var flecha = document.createElement('span');
                flecha.className = 'flechita';
                flecha.textContent = '▼';

                cabeza.appendChild(flecha);

                liNuevo.appendChild(cabeza);

                /*
                 * Construimos TODO el árbol inferior.
                 */
                var subarbol = construirNivel(liMenu, 0);

                liNuevo.appendChild(subarbol);

            } else {

                /*
                 * Categoría sin hijos:
                 * MELMAKEADAS, SIMPSONS, MAYORISTA,
                 * PERSONALIZADOS, PACKS, etc.
                 */
                liNuevo.className = 'cat-rama cat-raiz cat-sin-hijos';

                var cabezaSimple = document.createElement('div');
                cabezaSimple.className = 'cat-cabeza';

                var enlaceSimple = document.createElement('a');

                enlaceSimple.href = enlaceOriginal.href;
                enlaceSimple.textContent = texto;

                cabezaSimple.appendChild(enlaceSimple);

                liNuevo.appendChild(cabezaSimple);
            }

            lista.appendChild(liNuevo);
        });


        /*
         * Marca de control para evitar que el script
         * vuelva a reconstruir el árbol.
         */
        lista.setAttribute('data-arbol-final', '1');


        /*
         * EVENTOS DE APERTURA / CIERRE
         */
        if (!lista.dataset.eventosArbol) {

            lista.addEventListener('click', function (evento) {

                var cabeza = evento.target.closest('.cat-cabeza');

                if (!cabeza) return;

                var rama = cabeza.parentElement;

                if (!rama || !rama.classList.contains('cat-rama')) {
                    return;
                }

                /*
                 * Si es una categoría con hijos,
                 * el primer click abre/cierra.
                 */
                if (rama.getAttribute('data-tiene-hijos') === '1') {

                    evento.preventDefault();

                    /*
                     * Cerramos ramas abiertas del mismo nivel.
                     */
                    var nivel = rama.parentElement;

                    if (nivel) {

                        Array.from(
                            nivel.children
                        ).forEach(function (otraRama) {

                            if (
                                otraRama !== rama &&
                                otraRama.classList.contains('cat-abierta')
                            ) {
                                otraRama.classList.remove('cat-abierta');
                            }

                        });
                    }

                    rama.classList.toggle('cat-abierta');
                }

            });

            lista.dataset.eventosArbol = '1';
        }

        return true;
    }


    function limpiarTexto(texto) {
        return (texto || '')
            .replace(/\s+/g, ' ')
            .trim();
    }


    function normalizarURL(url) {

        if (!url) return '';

        try {

            var u = new URL(
                url,
                window.location.origin
            );

            return u.pathname
                .replace(/\/+$/, '')
                .toLowerCase();

        } catch (e) {

            return url
                .split('?')[0]
                .split('#')[0]
                .replace(/\/+$/, '')
                .toLowerCase();
        }
    }


    /*
     * Esperamos a que Empretienda termine de construir
     * el menú.
     */
    var intentos = 0;

    function esperar() {

        if (iniciarArbol()) return;

        intentos++;

        if (intentos < 100) {
            setTimeout(esperar, 200);
        }
    }

    esperar();

})();
</script>

<style id="arbol-categorias-css-final">
/* =========================================================
   ARBOL CATEGORIAS FINAL
   ========================================================= */

/* El listado nativo ahora es nuestro árbol */
.products-feed__filter > .products-feed__categories-list.cat-arbol-lista {
    display: block !important;
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Ocultamos solamente el título y separadores
   originales del filtro */
.products-feed__filter > .products-feed__filter-title,
.products-feed__filter > hr {
    display: none !important;
}


/* =========================================================
   CATEGORIAS PRINCIPALES
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista > .cat-rama {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
}


/* Encabezado */
.products-feed__categories-list.cat-arbol-lista .cat-cabeza {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    min-height: 38px;

    margin: 0;
    padding: 7px 3px;

    border-bottom: 1px solid rgba(53,53,53,.25);

    cursor: pointer;

    transition:
        background .20s ease,
        padding-left .20s ease,
        border-color .20s ease;
}


/* Texto categoría */
.products-feed__categories-list.cat-arbol-lista .cat-cabeza > a {
    flex: 1;

    color: #353535 !important;

    font-weight: 700;
    font-size: .86rem;

    line-height: 1.2;

    text-transform: uppercase;
    text-decoration: none !important;

    transition:
        transform .20s ease,
        opacity .20s ease;
}


/* Hover categoría */
.products-feed__categories-list.cat-arbol-lista .cat-cabeza:hover {
    padding-left: 7px;
    border-color: rgba(53,53,53,.5);
}

.products-feed__categories-list.cat-arbol-lista .cat-cabeza:hover > a {
    transform: translateX(2px);
    opacity: .78;
}


/* =========================================================
   FLECHAS
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista .flechita {
    flex: 0 0 auto;

    font-size: .68rem;

    line-height: 1;

    transition:
        transform .28s ease,
        opacity .20s ease;
}

.products-feed__categories-list.cat-arbol-lista
.cat-abierta > .cat-cabeza .flechita {
    transform: rotate(180deg);
}


/* =========================================================
   SUBCATEGORIAS
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista .cat-hijos {
    list-style: none !important;

    margin: 0 !important;
    padding: 0 0 0 5px !important;

    max-height: 0;

    overflow: hidden;

    opacity: 0;

    transition:
        max-height .35s ease,
        opacity .25s ease;
}


/* Rama abierta */
.products-feed__categories-list.cat-arbol-lista
.cat-rama.cat-abierta > .cat-hijos {
    max-height: 10000px;
    opacity: 1;
}


/* =========================================================
   BOTONES / HOJAS
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista
.cat-hoja {
    list-style: none !important;

    margin: 3px 0 !important;
    padding: 0 !important;
}


.products-feed__categories-list.cat-arbol-lista
.cat-hoja > a {

    display: block;

    margin: 3px 0;
    padding: 7px 10px;

    border-radius: 8px;

    background: #fff;

    color: #353535 !important;

    font-size: .79rem;
    line-height: 1.25;

    text-decoration: none !important;

    box-shadow:
        0 1px 2px rgba(0,0,0,.08);

    transform: translateX(0);

    transition:
        transform .20s ease,
        box-shadow .20s ease,
        background .20s ease,
        padding-left .20s ease;
}


/* Hover de botones */
.products-feed__categories-list.cat-arbol-lista
.cat-hoja > a:hover {

    transform: translateX(4px);

    padding-left: 14px;

    box-shadow:
        0 3px 8px rgba(0,0,0,.13);

    background: #fff;

    opacity: .88;
}


/* =========================================================
   SUBCATEGORIAS QUE TAMBIEN TIENEN HIJOS
   Ejemplo:
   UNIVERSO
      DC
         BATMAN
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista
.cat-subcabeza {

    margin-top: 2px;

    padding-left: 8px;

    min-height: 34px;

    border-bottom: 0;

    border-radius: 7px;

    transition:
        background .20s ease,
        padding-left .20s ease;
}


.products-feed__categories-list.cat-arbol-lista
.cat-subcabeza > a {

    font-size: .78rem;
}


.products-feed__categories-list.cat-arbol-lista
.cat-subcabeza:hover {

    padding-left: 12px;

    background: rgba(255,255,255,.55);
}


/* =========================================================
   NIVELES PROFUNDOS
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista
.nivel-2 {
    padding-left: 8px !important;
}

.products-feed__categories-list.cat-arbol-lista
.nivel-3 {
    padding-left: 8px !important;
}

.products-feed__categories-list.cat-arbol-lista
.nivel-4 {
    padding-left: 8px !important;
}


/* =========================================================
   CATEGORIAS SIN HIJOS
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista
.cat-sin-hijos > .cat-cabeza {

    cursor: pointer;
}


/* =========================================================
   ANIMACION SUAVE DE APERTURA
   ========================================================= */

.products-feed__categories-list.cat-arbol-lista
.cat-rama > .cat-hijos {
    will-change: max-height, opacity;
}


/* =========================================================
   EVITAR QUE EL LISTADO NATIVO DEL FOOTER SE ALTERE
   ========================================================= */

/*
   No tocamos:
   .products-feed__categories-list
   que esté fuera de .products-feed__filter
*/
</style>
