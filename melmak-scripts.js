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

    function normalizar(url) {
        try {
            return new URL(url, location.origin)
                .pathname
                .replace(/\/+$/, '')
                .toLowerCase();
        } catch (e) {
            return '';
        }
    }


    function construir() {

        var filtro = document.querySelector(
            '.products-feed__filter'
        );

        var menu = document.querySelector(
            '.header-menu__desktop-list__container-list'
        );

        if (!filtro || !menu) return false;


        /* =====================================================
           BORRAR ÁRBOL ANTERIOR
           ===================================================== */

        var anterior = filtro.querySelector('.cat-arbol');

        if (anterior) {
            anterior.remove();
        }


        /* =====================================================
           OBTENER LAS CATEGORÍAS RAÍZ
           DESDE EL LISTADO NATIVO
           ===================================================== */

        var raices = Array.from(
            filtro.querySelectorAll(
                '.products-feed__categories-list > li > a[href]'
            )
        );

        /*
         * En algunas versiones de Empretienda el enlace puede
         * estar directamente dentro de la lista.
         */

        if (!raices.length) {

            raices = Array.from(
                filtro.querySelectorAll(
                    '.products-feed__categories-list a[href]'
                )
            );
        }

        if (!raices.length) return false;


        /* =====================================================
           BUSCAR ENLACE EN EL MENÚ SUPERIOR
           ===================================================== */

        function buscarEnMenu(href) {

            var buscado = normalizar(href);

            var enlaces = Array.from(
                menu.querySelectorAll('a[href]')
            );

            for (var i = 0; i < enlaces.length; i++) {

                if (
                    normalizar(enlaces[i].href) === buscado
                ) {
                    return enlaces[i];
                }
            }

            return null;
        }


        /* =====================================================
           OBTENER LOS UL QUE PERTENECEN DIRECTAMENTE AL LI
           
           IMPORTANTE:
           Empretienda genera UN UL POR CADA SUBCATEGORÍA.
           
           NO debemos devolver solamente el primero.
           ===================================================== */

        function obtenerULDirectos(li) {

            var resultado = [];

            /*
             * Caso 1:
             * UL directamente dentro del LI.
             */

            Array.from(li.children).forEach(function (elemento) {

                if (
                    elemento.tagName &&
                    elemento.tagName.toLowerCase() === 'ul'
                ) {
                    resultado.push(elemento);
                }

            });


            /*
             * Caso 2:
             * Empretienda puede poner el menú dentro de
             * .desktop-list__menu.
             */

            Array.from(li.children).forEach(function (elemento) {

                if (
                    elemento.classList &&
                    elemento.classList.contains(
                        'desktop-list__menu'
                    )
                ) {

                    Array.from(elemento.children).forEach(
                        function (hijo) {

                            if (
                                hijo.tagName &&
                                hijo.tagName.toLowerCase() === 'ul'
                            ) {
                                resultado.push(hijo);
                            }

                        }
                    );

                }

            });


            /*
             * Eliminar duplicados.
             */

            return resultado.filter(function (item, index) {

                return resultado.indexOf(item) === index;

            });
        }


        /* =====================================================
           OBTENER EL ENLACE DIRECTO DE UN LI
           ===================================================== */

        function obtenerEnlaceDirecto(li) {

            /*
             * Primero buscamos un <a> directamente dentro
             * del LI.
             */

            for (
                var i = 0;
                i < li.children.length;
                i++
            ) {

                var elemento = li.children[i];

                if (
                    elemento.tagName &&
                    elemento.tagName.toLowerCase() === 'a'
                ) {
                    return elemento;
                }
            }


            /*
             * Algunos wrappers pueden poner el enlace
             * dentro de un DIV.
             */

            for (
                var j = 0;
                j < li.children.length;
                j++
            ) {

                var hijo = li.children[j];

                if (
                    hijo.children &&
                    hijo.children.length
                ) {

                    for (
                        var k = 0;
                        k < hijo.children.length;
                        k++
                    ) {

                        var nieto = hijo.children[k];

                        if (
                            nieto.tagName &&
                            nieto.tagName.toLowerCase() === 'a'
                        ) {
                            return nieto;
                        }
                    }
                }
            }

            return null;
        }


        /* =====================================================
           OBTENER HIJOS REALES
           ===================================================== */

        function obtenerHijos(liOriginal) {

            var resultado = [];

            var uls = obtenerULDirectos(liOriginal);

            uls.forEach(function (ul) {

                Array.from(ul.children).forEach(
                    function (item) {

                        if (
                            !item.tagName ||
                            item.tagName.toLowerCase() !== 'li'
                        ) {
                            return;
                        }

                        var enlace = obtenerEnlaceDirecto(item);

                        if (!enlace) return;


                        var texto = (
                            enlace.textContent || ''
                        ).trim();


                        /*
                         * No mostrar "Ver todo en..."
                         */

                        if (
                            texto
                                .toLowerCase()
                                .indexOf('ver todo en') === 0
                        ) {
                            return;
                        }


                        resultado.push(enlace);

                    }
                );

            });


            return resultado;
        }


        /* =====================================================
           CREAR RAMA
           ===================================================== */

        function crearRama(enlace, nivel) {

            if (!enlace) return null;

            var liOriginal = enlace.closest('li');

            if (!liOriginal) return null;


            var hijos = obtenerHijos(liOriginal);


            var li = document.createElement('li');


            /* =================================================
               RAMA CON HIJOS
               ================================================= */

            if (hijos.length) {

                li.className = 'cat-rama';

                li.setAttribute(
                    'data-tiene-hijos',
                    '1'
                );


                var cabeza = document.createElement('div');

                cabeza.className = 'cat-cabeza';


                var a = document.createElement('a');

                a.href = enlace.href;

                a.textContent = (
                    enlace.textContent || ''
                ).trim();


                var flecha = document.createElement('span');

                flecha.className = 'flechita';

                flecha.innerHTML = '▼';


                cabeza.appendChild(a);

                cabeza.appendChild(flecha);

                li.appendChild(cabeza);


                var ul = document.createElement('ul');

                ul.className = 'cat-hijos';


                hijos.forEach(function (hijo) {

                    var rama = crearRama(
                        hijo,
                        nivel + 1
                    );

                    if (rama) {
                        ul.appendChild(rama);
                    }

                });


                li.appendChild(ul);

            }


            /* =================================================
               CATEGORÍA SIN HIJOS
               ================================================= */

            else {

                var simple = document.createElement('a');

                simple.href = enlace.href;

                simple.textContent = (
                    enlace.textContent || ''
                ).trim();

                li.appendChild(simple);

            }


            return li;
        }


        /* =====================================================
           CREAR CONTENEDOR
           ===================================================== */

        var contenedor = document.createElement('div');

        contenedor.className = 'cat-arbol';


        var lista = document.createElement('ul');

        lista.className = 'cat-lista';


        /* =====================================================
           CONSTRUIR LAS RAÍCES
           ===================================================== */

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


        filtro.insertBefore(
            contenedor,
            filtro.firstChild
        );


        /* =====================================================
           INTERACCIÓN
           ===================================================== */

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
                 * Evitar navegación cuando se pulsa
                 * el nombre de una categoría que tiene hijos.
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
                 * Solo cerramos los hermanos del mismo nivel.
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


        /* =====================================================
           OCULTAR NATIVO
           ===================================================== */

        var titulo = filtro.querySelector(
            '.products-feed__filter-title'
        );

        var hr = filtro.querySelector('hr');

        var categorias = filtro.querySelector(
            '.products-feed__categories-list'
        );


        if (titulo) {
            titulo.style.display = 'none';
        }

        if (hr) {
            hr.style.display = 'none';
        }

        if (categorias) {
            categorias.style.display = 'none';
        }


        console.log(
            '[ARBOL FINAL] Árbol construido correctamente.',
            lista.children.length,
            'categorías raíz.'
        );


        return true;
    }


    /* =======================================================
       ESPERAR A QUE EMPRETIENDA TERMINE DE CARGAR EL MENÚ
       ======================================================= */

    function esperar(n) {

        if (construir()) return;


        if (n >= 80) {

            console.warn(
                '[ARBOL FINAL] No se pudo construir.'
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
/* ARBOL_CATEGORIAS_CSS_FINAL */
(function () {

    var anterior = document.getElementById(
        'arbol-categorias-css-final'
    );

    if (anterior) {
        anterior.remove();
    }


    var css = `

/* ==========================================================
   ÁRBOL
   ========================================================== */

.cat-arbol {
    list-style:none !important;
    margin:0 0 8px !important;
    padding:0 !important;
}

.cat-arbol ul,
.cat-arbol li {
    list-style:none !important;
    margin:0 !important;
}

.cat-lista {
    margin:0 !important;
    padding:0 !important;
}


/* ==========================================================
   CATEGORÍAS PRINCIPALES
   ========================================================== */

.cat-lista > .cat-rama > .cat-cabeza {

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:8px;

    width:100%;

    box-sizing:border-box;

    padding:7px 0;

    border-bottom:
        1px solid rgba(53,53,53,.25);

    cursor:pointer;

    transition:
        padding .20s ease,
        background .20s ease;

}

.cat-lista > .cat-rama > .cat-cabeza:hover {

    padding-left:5px;
    padding-right:5px;

}


/* Título raíz */

.cat-lista > .cat-rama > .cat-cabeza a {

    flex:1;

    color:#353535 !important;

    font-weight:700;

    text-transform:uppercase;

    text-decoration:none !important;

}


/* ==========================================================
   FLECHA
   ========================================================== */

.cat-cabeza .flechita {

    display:inline-block;

    color:#353535;

    font-size:.72rem;

    line-height:1;

    flex-shrink:0;

    transition:
        transform .30s ease;

}

.cat-abierta > .cat-cabeza .flechita {

    transform:rotate(180deg);

}


/* ==========================================================
   HIJOS
   ========================================================== */

.cat-hijos {

    list-style:none !important;

    margin:0 !important;

    padding:
        0 0 0 5px !important;

    max-height:0;

    overflow:hidden;

    opacity:0;

    transition:
        max-height .35s ease,
        opacity .25s ease;

}

.cat-abierta > .cat-hijos {

    max-height:12000px;

    opacity:1;

}


/* ==========================================================
   BOTONES — CATEGORÍAS FINALES
   ========================================================== */

.cat-hijos > li:not(.cat-rama) > a {

    display:block;

    box-sizing:border-box;

    width:100%;

    margin:3px 0;

    padding:6px 10px;

    border-radius:8px;

    background:#fff;

    color:#353535 !important;

    font-size:.82rem;

    line-height:1.2;

    text-decoration:none !important;

    box-shadow:
        0 1px 3px rgba(0,0,0,.10);

    transition:
        transform .20s ease,
        box-shadow .20s ease,
        padding-left .20s ease,
        opacity .20s ease;

}


/* Hover animado */

.cat-hijos > li:not(.cat-rama) > a:hover {

    transform:translateX(4px);

    padding-left:14px;

    box-shadow:
        0 4px 10px rgba(0,0,0,.15);

}


/* ==========================================================
   RAMAS INTERMEDIAS
   DC / MARVEL / TORNASOL / ETC.
   ========================================================== */

.cat-hijos > .cat-rama > .cat-cabeza {

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:7px;

    box-sizing:border-box;

    width:100%;

    margin:3px 0;

    padding:6px 10px;

    border:0;

    border-radius:8px;

    background:#fff;

    box-shadow:
        0 1px 3px rgba(0,0,0,.10);

    cursor:pointer;

    transition:
        transform .20s ease,
        box-shadow .20s ease,
        background .20s ease;

}


/* Hover de botón */

.cat-hijos > .cat-rama > .cat-cabeza:hover {

    transform:translateX(4px);

    box-shadow:
        0 4px 10px rgba(0,0,0,.15);

}


/* Texto de botón */

.cat-hijos > .cat-rama > .cat-cabeza a {

    flex:1;

    color:#353535 !important;

    font-size:.82rem;

    font-weight:500;

    line-height:1.2;

    text-decoration:none !important;

    text-transform:none;

}


/* ==========================================================
   FLECHA DE SUB-RAMA
   ========================================================== */

.cat-hijos > .cat-rama > .cat-cabeza .flechita {

    font-size:.62rem;

}


/* ==========================================================
   NIVEL 3
   ========================================================== */

.cat-hijos .cat-hijos {

    padding-left:7px !important;

}


.cat-hijos .cat-hijos > li:not(.cat-rama) > a {

    font-size:.77rem;

    padding:
        6px 9px;

}


.cat-hijos .cat-hijos > .cat-rama > .cat-cabeza {

    padding:
        6px 9px;

}


.cat-hijos .cat-hijos > .cat-rama > .cat-cabeza a {

    font-size:.77rem;

}


/* ==========================================================
   RAMA ABIERTA
   ========================================================== */

.cat-rama.cat-abierta >
.cat-cabeza {

    box-shadow:
        0 3px 8px rgba(0,0,0,.12);

}


/* ==========================================================
   OCULTAR NATIVO
   ========================================================== */

.products-feed__filter >
.products-feed__filter-title,

.products-feed__filter > hr,

.products-feed__filter >
.products-feed__categories-list {

    display:none !important;

}

`;


    var style = document.createElement('style');

    style.id =
        'arbol-categorias-css-final';

    style.type =
        'text/css';

    style.appendChild(
        document.createTextNode(css)
    );

    document.head.appendChild(style);

})();
</script>
