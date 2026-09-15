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

  /* ARBOL_CATEGORIAS_RECURSIVO */
  (function () {
    function textoLimpio(elemento) {
      return (elemento.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function claveDeUrl(href) {
      try {
        var url = new URL(href, window.location.origin);

        if (url.origin !== window.location.origin) {
          return null;
        }

        var ruta = url.pathname.replace(/\/+$/, '');

        if (!ruta || ruta === '/' || ruta === '/productos') {
          return null;
        }

        return ruta.toLowerCase();
      } catch (error) {
        return null;
      }
    }

    function crearArbol() {
      var filtro = document.querySelector('.products-feed__filter');

      if (!filtro) {
        return false;
      }

      var arbolViejo = filtro.querySelector('.cat-arbol');
      var listaOriginal = filtro.querySelector(
        '.products-feed__categories-list'
      );

      if (!arbolViejo || !listaOriginal) {
        return false;
      }

      if (arbolViejo.dataset.arbolRecursivo === '1') {
        return true;
      }

      var categorias = {};
      var orden = 0;
      var clavesPrincipales = [];

      function guardarEnlace(enlace, esPrincipal) {
        var nombre = textoLimpio(enlace);
        var clave = claveDeUrl(enlace.href);

        if (
          !clave ||
          !nombre ||
          /^ver todo/i.test(nombre)
        ) {
          return;
        }

        if (!categorias[clave]) {
          categorias[clave] = {
            clave: clave,
            href: enlace.href,
            nombre: nombre,
            orden: orden++,
            hijos: [],
            padre: null
          };
        }

        if (esPrincipal && clavesPrincipales.indexOf(clave) === -1) {
          clavesPrincipales.push(clave);
        }
      }

      /*
       * La lista original contiene las categorías principales.
       * El árbol viejo contiene también hijas, nietas y niveles posteriores.
       */
      Array.from(listaOriginal.querySelectorAll('a')).forEach(function (enlace) {
        guardarEnlace(enlace, true);
      });

      Array.from(arbolViejo.querySelectorAll('a')).forEach(function (enlace) {
        guardarEnlace(enlace, false);
      });

      Object.keys(categorias).forEach(function (clave) {
        var categoria = categorias[clave];
        var partes = clave.split('/').filter(Boolean);

        for (var nivel = partes.length - 1; nivel > 0; nivel--) {
          var clavePadre = '/' + partes.slice(0, nivel).join('/');

          if (categorias[clavePadre]) {
            categoria.padre = categorias[clavePadre];
            categoria.padre.hijos.push(categoria);
            break;
          }
        }
      });

      function primerOrden(categoria) {
        var ordenMenor = categoria.orden;

        categoria.hijos.forEach(function (hijo) {
          ordenMenor = Math.min(ordenMenor, primerOrden(hijo));
        });

        return ordenMenor;
      }

      function ordenarRama(categoria) {
        categoria.hijos.sort(function (a, b) {
          return primerOrden(a) - primerOrden(b);
        });

        categoria.hijos.forEach(ordenarRama);
      }

      Object.keys(categorias).forEach(function (clave) {
        ordenarRama(categorias[clave]);
      });

      var principales = clavesPrincipales
        .map(function (clave) {
          return categorias[clave];
        })
        .filter(Boolean);

      if (!principales.length) {
        return false;
      }

      var arbolNuevo = document.createElement('div');
      arbolNuevo.className = 'cat-arbol';
      arbolNuevo.dataset.arbolRecursivo = '1';

      function crearRama(categoriasDeNivel) {
        var ul = document.createElement('ul');

        categoriasDeNivel.forEach(function (categoria) {
          var li = document.createElement('li');
          var tieneHijos = categoria.hijos.length > 0;

          if (tieneHijos) {
            li.className = 'cat-rama';
            li.dataset.tieneHijos = '1';

            var cabeza = document.createElement('div');
            cabeza.className = 'cat-cabeza';

            var enlace = document.createElement('a');
            enlace.href = categoria.href;
            enlace.textContent = categoria.nombre;

            var flecha = document.createElement('span');
            flecha.className = 'flechita';
            flecha.textContent = '▼';

            cabeza.appendChild(enlace);
            cabeza.appendChild(flecha);

            var hijos = crearRama(categoria.hijos);
            hijos.className = 'cat-hijos';

            li.appendChild(cabeza);
            li.appendChild(hijos);
          } else {
            var enlaceSimple = document.createElement('a');
            enlaceSimple.href = categoria.href;
            enlaceSimple.textContent = categoria.nombre;

            li.appendChild(enlaceSimple);
          }

          ul.appendChild(li);
        });

        return ul;
      }

      arbolNuevo.appendChild(crearRama(principales));

      arbolNuevo.addEventListener('click', function (evento) {
        var cabeza = evento.target.closest('.cat-cabeza');

        if (!cabeza || !arbolNuevo.contains(cabeza)) {
          return;
        }

        /* El texto navega; la flecha abre/cierra. */
        if (evento.target.closest('a')) {
          return;
        }

        cabeza.parentElement.classList.toggle('cat-abierta');
      });

      arbolViejo.replaceWith(arbolNuevo);

      return true;
    }

    function iniciar() {
      var intentos = 0;
      var espera = window.setInterval(function () {
        intentos++;

        if (crearArbol() || intentos >= 80) {
          window.clearInterval(espera);
        }
      }, 500);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', iniciar);
    } else {
      iniciar();
    }
  })();



  /* ARBOL_CATEGORIAS_CSS */
  (function () {
    var c = [
      '.cat-arbol, .cat-arbol ul { list-style: none; margin: 0; padding: 0; }',

      '.cat-arbol { margin: 0 0 8px; }',

      '.cat-cabeza { display: flex; justify-content: space-between; align-items: center; gap: 8px; cursor: pointer; padding: 7px 0; border-bottom: 1px solid rgba(53, 53, 53, 0.25); }',

      '.cat-cabeza a { color: #353535 !important; font-weight: 700; text-transform: uppercase; flex: 1; }',

      '.cat-cabeza .flechita { font-size: .8rem; transition: transform .25s ease; }',

      '.cat-abierta > .cat-cabeza .flechita { transform: rotate(180deg); }',

      '.cat-hijos { margin: 0; padding: 0 0 0 4px; max-height: 0; overflow: hidden; transition: max-height .3s ease; }',

      '.cat-abierta > .cat-hijos { max-height: 4000px; }',

      '.cat-hijos a { display: block; margin: 2px 0; padding: 6px 10px; border-radius: 8px; background: #fff; color: #353535 !important; font-size: .82rem; }',

      '.cat-hijos a:hover { opacity: .85; }',

      '.products-feed__filter > .products-feed__filter-title, .products-feed__filter > hr, .products-feed__filter > .products-feed__categories-list { display: none !important; }'
    ].join('');

    var s = document.createElement('style');

    if (s.styleSheet) {
      s.styleSheet.cssText = c;
    } else {
      s.appendChild(document.createTextNode(c));
    }

    document.head.appendChild(s);
  })();

