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
document.addEventListener('DOMContentLoaded', function () {

    const arbol = document.querySelector('.cat-arbol');
    const categoriasPrincipales = document.querySelector('.products-feed__categories-list');

    if (!arbol || !categoriasPrincipales) return;

    /*
     * 1. Guardamos todos los nodos de categorías que Empretienda
     *    generó en .cat-arbol.
     */
    const nodos = new Map();

    arbol.querySelectorAll('a[href]').forEach(function (a) {

        const url = new URL(a.href, window.location.origin);
        const path = url.pathname.replace(/\/+$/, '');

        if (!path) return;

        /*
         * Nos quedamos con la primera aparición de cada URL.
         */
        if (!nodos.has(path)) {
            const liOriginal = a.closest('li');

            nodos.set(path, {
                path: path,
                href: a.href,
                nombre: a.textContent.trim(),
                li: liOriginal
            });
        }
    });

    /*
     * 2. Las categorías raíz NO las tomamos de .cat-arbol.
     *    Las tomamos de la lista oficial de categorías.
     */
    const raices = [];

    categoriasPrincipales.querySelectorAll('a[href]').forEach(function (a) {

        const url = new URL(a.href, window.location.origin);
        const path = url.pathname.replace(/\/+$/, '');

        raices.push({
            path: path,
            href: a.href,
            nombre: a.textContent.trim()
        });
    });

    /*
     * 3. Construimos un contenedor completamente nuevo.
     */
    const nuevoArbol = document.createElement('ul');

    /*
     * 4. Genera recursivamente una categoría y sus hijos.
     */
    function crearCategoria(categoria) {

        const li = document.createElement('li');
        li.className = 'cat-rama';

        const cabeza = document.createElement('div');
        cabeza.className = 'cat-cabeza';

        const enlace = document.createElement('a');
        enlace.href = categoria.href;
        enlace.textContent = categoria.nombre;

        cabeza.appendChild(enlace);
        li.appendChild(cabeza);

        /*
         * Buscar hijos DIRECTOS:
         *
         * /universo
         * /universo/dc
         * /universo/dc/batman
         *
         * DC es hijo de UNIVERSO.
         * Batman es hijo de DC.
         */
        const hijos = [];

        nodos.forEach(function (posibleHijo) {

            if (posibleHijo.path === categoria.path) return;

            const prefijo = categoria.path + '/';

            if (!posibleHijo.path.startsWith(prefijo)) return;

            const resto = posibleHijo.path.substring(prefijo.length);

            /*
             * Si contiene otro "/", no es hijo directo.
             */
            if (resto.includes('/')) return;

            hijos.push(posibleHijo);
        });

        /*
         * Orden alfabético.
         */
        hijos.sort(function (a, b) {
            return a.nombre.localeCompare(b.nombre, 'es', {
                sensitivity: 'base'
            });
        });

        /*
         * Crear hijos.
         */
        if (hijos.length) {

            const flecha = document.createElement('span');
            flecha.className = 'flechita';
            flecha.textContent = '▼';

            cabeza.appendChild(flecha);

            const ulHijos = document.createElement('ul');
            ulHijos.className = 'cat-hijos';

            hijos.forEach(function (hijo) {
                ulHijos.appendChild(crearCategoria(hijo));
            });

            li.appendChild(ulHijos);
        }

        return li;
    }

    /*
     * 5. Crear SOLO las categorías raíz de tu menú superior.
     */
    raices.forEach(function (raiz) {
        nuevoArbol.appendChild(crearCategoria(raiz));
    });

    /*
     * 6. Reemplazamos el árbol incorrecto.
     */
    arbol.innerHTML = '';
    arbol.appendChild(nuevoArbol);

});
</script>
