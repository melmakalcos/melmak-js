(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"] { z-index: 999 !important; pointer-events: none !important; }' +
      '.product-vip__carrousel-image { box-shadow: none !important; transition: transform .05s ease-out, filter .05s ease-out; will-change: transform; cursor: pointer; }' +
      '.products-feed__product-wrapper, .products-feed__product-wrapper:hover, .block-products-feed__product-wrapper, .block-products-feed__product-wrapper:hover, .block-products-set__product-wrapper, .block-products-set__product-wrapper:hover { box-shadow: none !important; }' +

      '.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item { position: relative; overflow: hidden; }' +
      '.melmak-glare { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99; opacity: 0; transition: opacity .3s ease; mix-blend-mode: color-dodge; }'
    ));
    document.head.appendChild(s);
  })();

  function atar() {

    var catalogos = document.querySelectorAll('.block-products-feed__product-media, .products-feed__product-media, .product-preview-carrousel__item');
    for (var i = 0; i < catalogos.length; i++) (function (c) {
      if (c.getAttribute('data-mxm-tilt')) return;
      var img = c.querySelector('img');
      if (!img) return;
      c.setAttribute('data-mxm-tilt', '1');

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

        glare.style.opacity = '1';
        glare.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 55%)';
      });

      c.addEventListener('mouseleave', function () {
        c.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
        c.style.transition = 'transform .3s ease-out';
        c.style.zIndex = '1';

        glare.style.opacity = '0';
      });
    })(catalogos[i]);

    var vips = document.querySelectorAll('.product-vip__carrousel-image');
    for (var j = 0; j < vips.length; j++) (function (img) {
      if (img.getAttribute('data-mxm-tilt')) return;
      img.setAttribute('data-mxm-tilt', '1');

      img.addEventListener('mousemove', function (e) {
        var r = img.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;

        img.style.transform = 'perspective(500px) rotateX(' + ((0.5 - y) * 20) + 'deg) rotateY(' + ((x - 0.5) * 20) + 'deg) scale(1.05)';

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

(function () {
  function limpiarTexto(elemento) {
    return (elemento.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function obtenerClave(href) {
    try {
      var url = new URL(href, window.location.origin);
      var ruta = url.pathname.replace(/\/+$/, '');

      if (
        url.origin !== window.location.origin ||
        !ruta ||
        ruta === '/' ||
        ruta === '/productos'
      ) {
        return null;
      }

      return ruta.toLowerCase();
    } catch (error) {
      return null;
    }
  }

  function crearArbol() {
    var listaOriginal = document.querySelector(
      '.products-feed__categories-list'
    );

    var enlacesMenuSuperior = document.querySelectorAll(
      '.header-menu__desktop-list__container-list a.desktop-list-link__text'
    );

    if (!enlacesMenuSuperior.length) {
      return false;
    }

    var filtros = document.querySelectorAll('.products-feed__filter');

    if (!filtros.length && document.querySelector('.cat-arbol[data-recursivo="ok"]')) {
      return true;
    }

    var categorias = {};
    var principales = [];
    var orden = 0;

    function guardarCategoria(enlace, esPrincipal) {
      var nombre = limpiarTexto(enlace);
      var clave = obtenerClave(enlace.href);

      if (!clave || !nombre || /^ver todo/i.test(nombre)) {
        return;
      }

      if (!categorias[clave]) {
        categorias[clave] = {
          clave: clave,
          href: enlace.href,
          nombre: nombre,
          orden: orden++,
          hijos: []
        };
      }

      if (
        esPrincipal &&
        principales.indexOf(clave) === -1
      ) {
        principales.push(clave);
      }
    }

    if (listaOriginal) {
      Array.from(listaOriginal.querySelectorAll('a')).forEach(function (enlace) {
        guardarCategoria(enlace, true);
      });
    }

    Array.from(enlacesMenuSuperior).forEach(function (enlace) {
      var esBold = enlace.classList.contains('desktop-list-link__text--bold');
      guardarCategoria(enlace, !listaOriginal && esBold);
    });

    Object.keys(categorias).forEach(function (clave) {
      var categoria = categorias[clave];
      var partes = clave.split('/').filter(Boolean);

      for (var nivel = partes.length - 1; nivel > 0; nivel--) {
        var clavePadre = '/' + partes.slice(0, nivel).join('/');

        if (categorias[clavePadre]) {
          categorias[clavePadre].hijos.push(categoria);
          break;
        }
      }
    });

    function primerOrden(categoria) {
      var resultado = categoria.orden;

      categoria.hijos.forEach(function (hijo) {
        resultado = Math.min(resultado, primerOrden(hijo));
      });

      return resultado;
    }

    function ordenarHijos(categoria) {
      categoria.hijos.sort(function (a, b) {
        return primerOrden(a) - primerOrden(b);
      });

      categoria.hijos.forEach(ordenarHijos);
    }

    Object.keys(categorias).forEach(function (clave) {
      ordenarHijos(categorias[clave]);
    });

    var categoriasPrincipales = principales
      .map(function (clave) {
        return categorias[clave];
      })
      .filter(Boolean);

    if (!categoriasPrincipales.length) {
      return false;
    }

    var arbolAnterior = filtros.length
      ? filtros[0].querySelector('.cat-arbol')
      : document.querySelector('.cat-arbol');

    if (arbolAnterior) {
      arbolAnterior.remove();
    }

    var arbol = document.createElement('div');
    arbol.className = 'cat-arbol';
    arbol.dataset.recursivo = 'ok';

    function crearNivel(categoriasDelNivel) {
      var ul = document.createElement('ul');

      categoriasDelNivel.forEach(function (categoria) {
        var li = document.createElement('li');
        var enlace = document.createElement('a');

        enlace.href = categoria.href;
        enlace.textContent = categoria.nombre;

        if (categoria.hijos.length) {
          li.className = 'cat-rama';

          var cabeza = document.createElement('div');
          cabeza.className = 'cat-cabeza';

          var flecha = document.createElement('span');
          flecha.className = 'flechita';
          flecha.textContent = '▼';

          cabeza.appendChild(enlace);
          cabeza.appendChild(flecha);

          var hijos = crearNivel(categoria.hijos);
          hijos.className = 'cat-hijos';

          li.appendChild(cabeza);
          li.appendChild(hijos);
        } else {
          li.appendChild(enlace);
        }

        ul.appendChild(li);
      });

      return ul;
    }

    arbol.appendChild(crearNivel(categoriasPrincipales));

    function engancharClic(arbolito) {
      arbolito.addEventListener('click', function (evento) {
        var cabeza = evento.target.closest('.cat-cabeza');

        if (!cabeza || !arbolito.contains(cabeza)) {
          return;
        }

        if (evento.target.closest('a')) {
          return;
        }

        cabeza.parentElement.classList.toggle('cat-abierta');
      });
    }
    engancharClic(arbol);

    var AVISO_TEXTO = 'HACÉ CLICK EN LA CATEGORÍA PARA VERLA COMPLETA Y EN LAS FLECHAS PARA VER LAS SUBCATEGORÍAS';

    function armarAviso() {
      var aviso = document.createElement('p');
      aviso.className = 'cat-aviso';
      aviso.textContent = AVISO_TEXTO;
      return aviso;
    }

    if (filtros.length) {
      for (var fi = 0; fi < filtros.length; fi++) {
        var listaDeEsteFiltro = filtros[fi].querySelector(
          '.products-feed__categories-list'
        );

        if (!listaDeEsteFiltro) {
          continue;
        }

        var anterior = listaDeEsteFiltro.previousElementSibling;
        if (anterior && anterior.classList.contains('cat-arbol')) {
          continue;
        }

        var arbolEste = (fi === 0) ? arbol : arbol.cloneNode(true);

        if (arbolEste !== arbol) {
          engancharClic(arbolEste);
        }

        listaDeEsteFiltro.insertAdjacentElement('beforebegin', armarAviso());
        listaDeEsteFiltro.insertAdjacentElement('beforebegin', arbolEste);
      }
    } else {

      var filtroNuevo = document.createElement('div');
      filtroNuevo.className = 'products-feed__filter';
      filtroNuevo.setAttribute('data-mx-cat', '1');
      filtroNuevo.appendChild(armarAviso());
      filtroNuevo.appendChild(arbol);

      var sidebar = document.createElement('div');
      sidebar.className = 'uk-visible@m uk-width-1-5';
      sidebar.appendChild(filtroNuevo);

      var contenedor = document.querySelector(
        '.category-feed_content.products-feed__content, .products-feed__content'
      );

      if (contenedor) {
        var grid = contenedor.querySelector('[uk-grid]');

        var colProductos = null;
        if (grid) {
          var hijos = grid.children;
          for (var ci = 0; ci < hijos.length; ci++) {
            if (hijos[ci].querySelector('.products-feed__products')) {
              colProductos = hijos[ci];
              break;
            }
          }
        }

        if (grid && colProductos) {
          colProductos.classList.add('uk-width-4-5@m');
          grid.insertBefore(sidebar, grid.firstChild);
        } else {
          contenedor.insertBefore(sidebar, contenedor.firstChild);
        }
      }
    }

    return true;
  }

  function iniciar() {
    var intentos = 0;

    var espera = window.setInterval(function () {
      intentos++;

      if (crearArbol()) {
        window.clearInterval(espera);
        return;
      }

      if (intentos >= 120) {
        var listaOriginal = document.querySelector(
          '.products-feed__categories-list'
        );

        if (listaOriginal) {
          listaOriginal.style.setProperty(
            'display',
            'block',
            'important'
          );
        }

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

(function () {
  var css = [
    '.cat-arbol, .cat-arbol ul { list-style: none; margin: 0; padding: 0; }',

    '.cat-arbol { margin: 0 0 8px; }',

    '.cat-arbol > ul > li > a { display: block; padding: 7px 0; border-bottom: 1px solid rgba(53,53,53,.25); color: #353535 !important; font-weight: 700; text-transform: uppercase; }',

    '.cat-cabeza { display: flex; justify-content: space-between; align-items: center; gap: 8px; cursor: pointer; padding: 7px 0; border-bottom: 1px solid rgba(53,53,53,.25); }',

    '.cat-cabeza a { color: #353535 !important; font-weight: 700; text-transform: uppercase; flex: 1; }',

    '.flechita { font-size: .8rem; padding: 10px 12px; margin-right: -8px; transition: transform .25s ease; }',

    '.cat-abierta > .cat-cabeza .flechita { transform: rotate(180deg); }',

    '.cat-hijos { padding: 0 0 0 4px; max-height: 0; overflow: hidden; transition: max-height .3s ease; }',

    '.cat-abierta > .cat-hijos { max-height: 6000px; }',

    '.cat-hijos a { display: block; margin: 2px 0; padding: 6px 10px; border-radius: 8px; background: #fff; color: #353535 !important; font-size: .82rem; }',

    '.cat-hijos a:hover { opacity: .85; }',

    '.cat-aviso { margin: 0 0 12px; font-size: .72rem; line-height: 1.5; color: #353535; text-transform: uppercase; letter-spacing: .03em; }',

    '.products-feed__filter > .products-feed__filter-title, .products-feed__filter > hr, .products-feed__filter > .products-feed__categories-list { display: none !important; }',
    '@media (max-width: 959px) { .products-feed__products { grid-template-columns: repeat(2, 1fr) !important; } .products-feed__content > .uk-grid > [class*="uk-width-4-5"] { width: 100% !important; } }',
    '.products-feed__product-wrapper, .products-feed__product-wrapper:hover, .block-products-feed__product-wrapper, .block-products-feed__product-wrapper:hover, .block-products-set__product-wrapper, .block-products-set__product-wrapper:hover, .product-vip__carrousel-image { box-shadow: none !important; }'
  ].join('');

  var estilo = document.createElement('style');
  estilo.appendChild(document.createTextNode(css));
  document.head.appendChild(estilo);
})();

(function () {

  const pathname = window.location.pathname;
  const isHomePage = pathname === '/' || pathname === '' || pathname === '/index.html';

  if (!isHomePage) return;

  const style = document.createElement('style');
  style.textContent = `
    #floating-mascot {
      position: fixed;
      bottom: 0px;
      left: 20px;
      z-index: 9998;
      pointer-events: none;
    }
    #floating-mascot img {
      width: 150px;
      height: auto;
      display: block;
    }
      @media (max-width: 150px) {
      #floating-mascot img {
      width: 60px;
  }
}
  `;
  document.head.appendChild(style);

  function createMascot() {
    if (document.getElementById('floating-mascot')) return;

    const container = document.createElement('div');
    container.id = 'floating-mascot';

    const img = document.createElement('img');
    img.src = 'https://d22fxaf9t8d39k.cloudfront.net/af2b89bf5852a5149c6662f2b9b31bad160f48187062804c370b0093f7dbc50120700.gif';
    img.alt = 'Melmak Mascot';

    container.appendChild(img);
    document.body.appendChild(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMascot);
  } else {
    createMascot();
  }
})();

(function () {

  const existingStyle = document.getElementById('melmak-rgb-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  const styleRGB = document.createElement('style');
  styleRGB.id = 'melmak-rgb-style';
  styleRGB.textContent = `

    .desktop-list__text,
    .desktop-list__text:hover,
    .desktop-list__text:focus,
    .desktop-list__text:active,
    .desktop-list__item:hover .desktop-list__text,
    .desktop-list__link:hover .desktop-list__text,
    a:hover .desktop-list__text {
      position: relative !important;
      z-index: 1 !important;
      display: inline-block !important;
      padding: 6px 14px !important;
      background: transparent !important;
      background-color: transparent !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      text-decoration: none !important;
    }


    .desktop-list__text,
    .desktop-list__text *,
    .desktop-list__item:hover .desktop-list__text {
      color: #333333 !important;
      position: relative !important;
      z-index: 2 !important;
    }


    .desktop-list__text::before {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      width: 300px !important;
      height: 300px !important;
      margin-top: -150px !important;
      margin-left: -150px !important;
      background: conic-gradient(
        #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
      ) !important;
      animation: rotateRGB_Melmak 3s linear infinite !important;
      z-index: -2 !important;
    }


    .desktop-list__text::after,
    .desktop-list__text:hover::after,
    .desktop-list__item:hover .desktop-list__text::after,
    .desktop-list__link:hover .desktop-list__text::after {
      content: '' !important;
      position: absolute !important;
      top: 3px !important;
      bottom: 3px !important;
      left: 3px !important;
      right: 3px !important;
      background-color: #ffffff !important;
      background: #ffffff !important;
      border-radius: 5px !important;
      z-index: -1 !important;
      border: none !important;
      box-shadow: none !important;
    }


    @keyframes rotateRGB_Melmak {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  document.head.appendChild(styleRGB);
})();

(function () {
  function esCatalogo() {
    var ruta = window.location.pathname.replace(/\/+$/, '');
    return ruta === '/productos';
  }

  function agregarProductos() {
    var breadcrumb = document.querySelector('.category-feed__breadcrumb');
    if (!breadcrumb) return;

    if (esCatalogo()) return;

    if (breadcrumb.getAttribute('data-mx-productos')) return;
    breadcrumb.setAttribute('data-mx-productos', '1');

    var items = breadcrumb.querySelectorAll('.breadcrumb__item');
    if (!items.length) return;

    for (var i = 0; i < items.length; i++) {
      var texto = (items[i].textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      if (texto === 'PRODUCTOS') return;
    }

    var primero = items[0];

    var li = document.createElement('li');
    li.className = 'breadcrumb__item';

    var a = document.createElement('a');
    a.href = 'https://www.melmakalcos.com.ar/productos';
    a.className = 'breadcrumb__link text--primary text--primary-hover';
    a.textContent = 'PRODUCTOS';

    li.appendChild(a);
    primero.insertAdjacentElement('afterend', li);
  }

  function iniciar() {
    agregarProductos();
    window.setInterval(agregarProductos, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
