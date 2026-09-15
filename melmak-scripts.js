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

    function construirArbol() {

        const sidebar = document.querySelector('.cat-arbol');

        if (!sidebar) {
            return false;
        }

        /*
         * MENÚ REAL DE EMPRETIENDA
         */
        const menu = document.querySelector(
            'ul.header-menu__desktop-list'
        );

        if (!menu) {
            console.warn(
                '[Categorias] No encuentro el menú superior.'
            );
            return false;
        }

        /*
         * Tomamos solamente los LI que son hijos directos
         * del menú principal.
         *
         * Esto evita que DC, MARVEL, TORNASOL, etc.
         * sean tratados como categorías raíz.
         */
        const raices = [
            ...menu.querySelectorAll(':scope > li')
        ];

        if (!raices.length) {
            console.warn(
                '[Categorias] El menú existe pero no tiene raíces.'
            );
            return false;
        }

        console.log(
            '[Categorias] Raíces encontradas:',
            raices.length
        );

        /*
         * Creamos un árbol completamente nuevo.
         */
        const lista = document.createElement('ul');

        lista.className = 'cat-raices';

        /*
         * Clonamos cada categoría raíz completa.
         */
        raices.forEach(function (original) {

            const copia =
                original.cloneNode(true);

            prepararArbol(copia);

            lista.appendChild(copia);
        });

        /*
         * Reemplazamos el contenido viejo.
         */
        sidebar.innerHTML = '';

        sidebar.appendChild(lista);

        sidebar.dataset.clonadoDesdeMenu = '1';

        console.log(
            '[Categorias] NAVEGADOR AMARILLO ACTUALIZADO DESDE EL MENÚ REAL.'
        );

        return true;
    }


    function prepararArbol(elemento) {

        elemento.classList.add('cat-rama');

        /*
         * Las listas internas del menú superior
         * pasan a ser listas de hijos.
         */
        elemento.querySelectorAll('ul').forEach(function (ul) {

            ul.classList.add('cat-hijos');

        });


        /*
         * Para cada LI que tenga hijos:
         *
         * ENLACE + FLECHA
         */
        elemento.querySelectorAll('li').forEach(function (li) {

            const enlace =
                li.querySelector(':scope > a');

            const hijos =
                li.querySelector(':scope > ul');

            if (!enlace || !hijos) {
                return;
            }


            /*
             * Creamos el encabezado solamente una vez.
             */
            let cabeza =
                li.querySelector(
                    ':scope > .cat-cabeza'
                );

            if (!cabeza) {

                cabeza =
                    document.createElement('div');

                cabeza.className =
                    'cat-cabeza';

                enlace.parentNode.insertBefore(
                    cabeza,
                    enlace
                );

                cabeza.appendChild(enlace);
            }


            /*
             * Flecha
             */
            if (
                !cabeza.querySelector(
                    ':scope > .flechita'
                )
            ) {

                const flecha =
                    document.createElement('span');

                flecha.className =
                    'flechita';

                flecha.textContent = '▼';

                cabeza.appendChild(flecha);
            }

        });

    }


    /*
     * Esperamos porque Empretienda construye
     * el menú después de cargar parte del DOM.
     */
    let intentos = 0;

    const timer = setInterval(function () {

        intentos++;

        /*
         * Si ya lo construimos, terminamos.
         */
        const sidebar =
            document.querySelector('.cat-arbol');

        if (
            sidebar &&
            sidebar.dataset.clonadoDesdeMenu === '1'
        ) {
            clearInterval(timer);
            return;
        }


        if (construirArbol()) {

            clearInterval(timer);

            return;
        }


        if (intentos >= 80) {

            clearInterval(timer);

            console.warn(
                '[Categorias] No se pudo construir el árbol.'
            );
        }

    }, 250);


    /*
     * Intento inmediato.
     */
    construirArbol();

})();
</script>
