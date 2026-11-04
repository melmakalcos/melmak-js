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
        var objetivo = img.closest && img.closest('.melkh-holo-wrap') ? img.closest('.melkh-holo-wrap') : img;

        objetivo.style.transform = 'perspective(500px) rotateX(' + ((0.5 - y) * 20) + 'deg) rotateY(' + ((x - 0.5) * 20) + 'deg) scale(1.05)';
        objetivo.style.transition = 'transform .05s ease-out';

        var brightness = 1 + (0.5 - y) * 0.60;
        img.style.filter = 'brightness(' + brightness + ')';
        img.style.transition = 'transform .05s ease-out, filter .05s ease-out';
      });

      img.addEventListener('mouseleave', function () {
        var objetivo = img.closest && img.closest('.melkh-holo-wrap') ? img.closest('.melkh-holo-wrap') : img;
        objetivo.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
        objetivo.style.transition = 'transform .3s ease-out';
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
    '.products-feed__product-wrapper, .products-feed__product-wrapper:hover, .block-products-feed__product-wrapper, .block-products-feed__product-wrapper:hover, .block-products-set__product-wrapper, .block-products-set__product-wrapper:hover, .product-vip__carrousel-image { box-shadow: none !important; }',

    '.product-vip__carrousel::after { display: none !important; opacity: 0 !important; }'
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

function melkRelacionados() {
  var ficha = document.querySelector('section.product-vip, .product-vip');
  if (!ficha || document.getElementById('melk-rel')) return;

  var GENERICAS = {};
  'POSTER POSTERS PACK PACKS STICKER STICKERS PRINT PRINTS LAMINA LAMINAS CUADRO CUADROS VINILO DECO SET COMBO NUEVO NUEVA OFERTA EDICION LIMITADA TAMANO TAMANOS CHICO CHICA GRANDE MEDIANO MINI DE DEL LA EL LOS LAS Y CON PARA X A4 A3 A5'.split(' ').forEach(function (p) { GENERICAS[p] = 1; });

  function limpiar(t) {
    return (t || '').toUpperCase().replace(/[^A-Z0-9ÁÉÍÓÚÑÜ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function palabras(t) {
    return limpiar(t).split(' ').filter(function (p) {
      return p.length > 1 && !/\d/.test(p) && !GENERICAS[p];
    });
  }

  var ruta = location.pathname.replace(/\/+$/, '');
  var h1 = document.querySelector('.product-vip h1, h1');
  if (!h1) return;

  function rutaDe(href) {
    try {
      return new URL(href, location.origin).pathname.replace(/\/+$/, '');
    } catch (e) {
      return '';
    }
  }

  var tema = palabras(h1.textContent).join(' ');
  var categoriaNom = '';
  var categoriaUrl = '';
  var migas = [].slice.call(document.querySelectorAll('.breadcrumb__item a'));
  for (var i = migas.length - 1; i >= 0; i--) {
    var destino = migas[i].getAttribute('href') || '';
    if (!destino) continue;
    var camino = rutaDe(destino);
    if (!camino || camino === '/' || camino === ruta) continue;
    categoriaUrl = camino;
    categoriaNom = limpiar(migas[i].textContent);
    break;
  }
  if (!tema && !categoriaUrl) return;

  function bajar(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('http');
      return r.text();
    });
  }

  function extraer(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var nodos = doc.querySelectorAll('.products-feed__product');
    var salida = [];
    var vistos = {};
    for (var k = 0; k < nodos.length; k++) {
      var c = nodos[k];
      var a = c.querySelector('.products-feed__product-link');
      var img = c.querySelector('.products-feed__product-image');
      var nom = c.querySelector('.products-feed__product-name');
      var pre = c.querySelector('.products-feed__product-price');
      if (!a || !img || !nom) continue;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('http') !== 0) continue;
      if (rutaDe(href) === ruta) continue;
      if (vistos[href]) continue;
      var texto = c.textContent.toUpperCase();
      if (texto.indexOf('SIN STOCK') >= 0 || texto.indexOf('AGOTADO') >= 0) continue;
      var boton = c.querySelector('[class*="product-buttons-buy"]');
      if (boton && boton.className.indexOf('disabled') >= 0) continue;
      vistos[href] = 1;
      salida.push({
        url: href,
        img: img.getAttribute('src') || '',
        nom: nom.textContent.trim(),
        pre: pre ? pre.textContent.trim() : '',
        busca: limpiar(nom.textContent)
      });
    }
    return salida;
  }

  function porTema() {
    if (!tema) return Promise.resolve(null);
    return bajar('/search?q=' + encodeURIComponent(tema)).then(function (html) {
      var tokens = tema.split(' ');
      var buenos = extraer(html).filter(function (p) {
        for (var k = 0; k < tokens.length; k++) {
          if (p.busca.indexOf(tokens[k]) < 0) return false;
        }
        return true;
      });
      if (buenos.length < 4) return null;
      return { titulo: 'MÁS DE ' + tema, items: buenos };
    }).catch(function () { return null; });
  }

  function porCategoria() {
    if (!categoriaUrl) return Promise.resolve(null);
    return bajar(categoriaUrl).then(function (html) {
      var todos = extraer(html);
      if (todos.length < 4) return null;
      return { titulo: 'MÁS EN ' + categoriaNom, items: todos };
    }).catch(function () { return null; });
  }

  function asegurarEstilo() {
    if (document.getElementById('melk-rel-style')) return;
    var s = document.createElement('style');
    s.id = 'melk-rel-style';
    s.textContent = [
      '@font-face { font-family: \'Curda Gouda\'; src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@85a491307507245bd4b7ea4c7ec7127a02123174/Curda%20Gouda.ttf") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }',
      '.melk-rel { padding: 56px 16px 64px; background: #ffffff; font-family: \'Rubik\', system-ui, sans-serif; color: #353535; }',
      '.melk-rel__caja { max-width: 1150px; margin: 0 auto; }',
      '.melk-rel__titulo { margin: 0 0 28px; font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 40px; font-weight: 400; line-height: 1; text-align: center; text-transform: uppercase; color: #353535; }',
      '.melk-rel__grilla { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px 18px; }',
      '.melk-rel__card { display: block; text-decoration: none; color: inherit; }',
      '.melk-rel__foto { position: relative; overflow: hidden; background: #f3f3f3; aspect-ratio: 1 / 1; }',
      '.melk-rel__foto img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }',
      '.melk-rel__card:hover .melk-rel__foto img { transform: scale(1.05); }',
      '.melk-rel__nombre { margin-top: 10px; font-size: 13px; font-weight: 500; line-height: 1.3; text-align: center; text-transform: uppercase; letter-spacing: .02em; }',
      '.melk-rel__precio { margin-top: 3px; font-size: 13px; font-weight: 700; text-align: center; }',
      '@media (max-width: 959px) { .melk-rel { padding: 40px 14px 48px; } .melk-rel__titulo { font-size: 28px; margin-bottom: 20px; } .melk-rel__grilla { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 12px; } }'
    ].join('');
    document.head.appendChild(s);
  }

  function pintar(datos) {
    if (document.getElementById('melk-rel')) return;
    asegurarEstilo();

    var seccion = document.createElement('section');
    seccion.className = 'melk-rel';
    seccion.id = 'melk-rel';

    var caja = document.createElement('div');
    caja.className = 'melk-rel__caja';

    var titulo = document.createElement('h2');
    titulo.className = 'melk-rel__titulo';
    titulo.textContent = datos.titulo;
    caja.appendChild(titulo);

    var grilla = document.createElement('div');
    grilla.className = 'melk-rel__grilla';

    for (var k = 0; k < datos.items.length; k++) {
      var p = datos.items[k];
      var card = document.createElement('a');
      card.className = 'melk-rel__card';
      card.href = p.url;

      var foto = document.createElement('div');
      foto.className = 'melk-rel__foto';
      var im = document.createElement('img');
      im.src = p.img;
      im.alt = p.nom;
      im.loading = 'lazy';
      foto.appendChild(im);
      card.appendChild(foto);

      var nom = document.createElement('div');
      nom.className = 'melk-rel__nombre';
      nom.textContent = p.nom;
      card.appendChild(nom);

      if (p.pre) {
        var pre = document.createElement('div');
        pre.className = 'melk-rel__precio';
        pre.textContent = p.pre;
        card.appendChild(pre);
      }

      grilla.appendChild(card);
    }

    caja.appendChild(grilla);
    seccion.appendChild(caja);
    ficha.insertAdjacentElement('afterend', seccion);
  }

  var guardado = null;
  try { guardado = sessionStorage.getItem('melkrel1:' + ruta); } catch (e) { }
  if (guardado) {
    try {
      var dato = JSON.parse(guardado);
      if (dato && dato.items && dato.items.length) { pintar(dato); return; }
    } catch (e) { }
  }

  porTema().then(function (r) {
    return r || porCategoria();
  }).then(function (r) {
    if (!r) return;
    r.items = r.items.slice(0, 8);
    pintar(r);
    try { sessionStorage.setItem('melkrel1:' + ruta, JSON.stringify(r)); } catch (e) { }
  }).catch(function () { });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', melkRelacionados);
} else {
  melkRelacionados();
}

/* ---------- EFECTO HOLOGRÁFICO + INFO ESTÁTICA (ficha de producto) ---------- */
(function () {
function melkHolo() {
  if (document.getElementById('melkh-caja')) return;
  var img = document.querySelector('.product-vip__carrousel-image');
  if (!img) return;

  var items = [].slice.call(document.querySelectorAll('.product-vip__attribute-item'));
  if (!items.length) return;

  var hayHolo = items.some(function (a) {
    return (a.getAttribute('data-value') || '').toUpperCase().indexOf('HOLO') >= 0;
  });
  if (!hayHolo) return;

  var svgNS = 'http://www.w3.org/2000/svg';
  var xlinkNS = 'http://www.w3.org/1999/xlink';

  if (!document.getElementById('melkh-estilo')) {
    var estilo = document.createElement('style');
    estilo.id = 'melkh-estilo';
    estilo.textContent = [
      '.melkh-holo-wrap { position: relative; display: block; width: 100%; line-height: 0; }',
      '.melkh-holo-wrap > img { display: block; width: 100%; height: auto; }',

      '.melkh { position: absolute; left: 0; top: 0; pointer-events: none; opacity: 0; transition: opacity .3s ease; }',
      '.melkh.activo { opacity: 1; }',
      '.melkh__capa { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden; -webkit-mask-image: url(#melkh-mascara); mask-image: url(#melkh-mascara); mix-blend-mode: multiply; opacity: .9; }',
      '.melkh__capa::before { content: ""; position: absolute; left: -60%; top: -60%; width: 220%; height: 220%; background-image: repeating-linear-gradient(115deg, #ffc9f2 0%, #bff6ff 5%, #f6ffbf 10%, #bfffe0 15%, #cfc9ff 20%, #ffe3c9 25%, #ffc9f2 30%); filter: saturate(1.0); transition: filter .3s ease; animation: melkh-mover 3.5s ease-in-out infinite alternate; animation-play-state: paused; will-change: transform; }',
      '.melkh--moviendo .melkh__capa::before { animation-play-state: running; filter: saturate(1.8); }',
      '@keyframes melkh-mover { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-12%, 0, 0); } }',

      '.melkh-badge { position: absolute; left: 0; top: 0; width: 112px; height: 112px; box-sizing: border-box; padding: 10px; border-radius: 50%; border: 2px solid #111; background: #ffe600; color: #111; box-shadow: 3px 3px 0 #111; display: none; align-items: center; justify-content: center; text-align: center; font-family: Rubik, system-ui, sans-serif; font-size: 10px; font-weight: 800; line-height: 1.2; letter-spacing: .03em; text-transform: uppercase; transform: rotate(-8deg); pointer-events: none; z-index: 5; transition: opacity .25s ease, transform .25s ease; }',
      '@media (hover: hover) and (pointer: fine) { .melkh-badge--visible { display: flex; } }',
      '.melkh-badge--oculto { opacity: 0; transform: rotate(-8deg) scale(.8); }',
      '@media (hover: none) { .melkh.activo .melkh__capa::before { animation: melkh-mover 6s ease-in-out infinite alternate; animation-play-state: running; filter: saturate(1.8); } }',      '.melkh-info { margin: 4px 0 20px; width: 100%; max-width: 100%; box-sizing: border-box; font-family: \'Rubik\', system-ui, sans-serif; color: #353535; }',
      '.melkh-info__tag { display: inline-block; max-width: 100%; box-sizing: border-box; margin-bottom: 8px; padding: 7px 14px; border: 2px solid #353535; border-radius: 999px; background: #ffe600; font-size: 10.5px; font-weight: 700; line-height: 1.25; letter-spacing: .04em; text-transform: uppercase; text-align: center; }',
      '.melkh-info__caja { box-sizing: border-box; padding: 12px 14px; border: 2px solid #353535; border-radius: 12px; background: #ffffff; font-size: 12.5px; font-weight: 400; line-height: 1.5; }',
      '.melkh-info__aviso { display: block; margin-top: 8px; font-size: 11px; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; }'
    ].join('');
    document.head.appendChild(estilo);
  }

  if (!document.getElementById('melkh-svg')) {
    var svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'melkh-svg';
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';

    var defs = document.createElementNS(svgNS, 'defs');

    var filtroBlanco = document.createElementNS(svgNS, 'filter');
    filtroBlanco.id = 'melkh-blanco';
    filtroBlanco.setAttribute('color-interpolation-filters', 'sRGB');
    var matrizBlanco = document.createElementNS(svgNS, 'feColorMatrix');
    matrizBlanco.setAttribute('type', 'matrix');
    matrizBlanco.setAttribute('values', '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0');
    filtroBlanco.appendChild(matrizBlanco);

    var mascara = document.createElementNS(svgNS, 'mask');
    mascara.id = 'melkh-mascara';
    mascara.setAttribute('maskUnits', 'objectBoundingBox');
    mascara.setAttribute('maskContentUnits', 'objectBoundingBox');
    mascara.setAttribute('style', 'mask-type:alpha');

    var mascaraImg = document.createElementNS(svgNS, 'image');
    mascaraImg.id = 'melkh-mascara-img';
    mascaraImg.setAttribute('x', '0');
    mascaraImg.setAttribute('y', '0');
    mascaraImg.setAttribute('width', '1');
    mascaraImg.setAttribute('height', '1');
    mascaraImg.setAttribute('preserveAspectRatio', 'none');
    mascaraImg.setAttribute('filter', 'url(#melkh-blanco)');
    mascara.appendChild(mascaraImg);

    defs.appendChild(filtroBlanco);
    defs.appendChild(mascara);
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }

  var wrap = document.createElement('div');
  wrap.className = 'melkh-holo-wrap';
  var padre = img.parentNode;
  padre.insertBefore(wrap, img);
  wrap.appendChild(img);

  if (img.style.transform || img.style.filter) {
    wrap.style.transform = img.style.transform;
    wrap.style.filter = img.style.filter;
    wrap.style.transition = img.style.transition;
    img.style.transform = '';
    img.style.filter = '';
  }

  var caja = document.createElement('span');
  caja.className = 'melkh';
  caja.id = 'melkh-caja';
  caja.setAttribute('aria-hidden', 'true');

  var capa = document.createElement('span');
  capa.className = 'melkh__capa';
  caja.appendChild(capa);
  var badge = document.createElement('span');
  badge.className = 'melkh-badge';
  badge.innerHTML = 'PASÁ EL MOUSE<br>PARA VER<br>LOS COLORES';
  var contenedorBadge = document.querySelector('.product-vip__left-container') || (caja.parentNode && caja.parentNode.parentNode) || document.body;
  if (getComputedStyle(contenedorBadge).position === 'static') contenedorBadge.style.position = 'relative';
  contenedorBadge.appendChild(badge);

  wrap.appendChild(caja);

  var actualizarMascara = function () {
    var src = img.currentSrc || img.src || '';
    if (!src) return;
    var mascaraImg = document.getElementById('melkh-mascara-img');
    if (!mascaraImg) return;
    mascaraImg.setAttribute('href', src);
    mascaraImg.setAttributeNS(xlinkNS, 'xlink:href', src);
  };

  var ubicar = function () {
    var w = img.offsetWidth || img.getBoundingClientRect().width;
    var h = img.offsetHeight || img.getBoundingClientRect().height;
    if (!w || !h) return;
    caja.style.left = '0px';
    caja.style.top = '0px';
    caja.style.width = w + 'px';
    caja.style.height = h + 'px';

    if (badge && badge.parentNode) {
      var rb = img.getBoundingClientRect();
      var pb = badge.parentNode.getBoundingClientRect();
      badge.style.left = (rb.right - pb.left - 74) + 'px';
      badge.style.top = (rb.top - pb.top - 14) + 'px';
    }
  };

  actualizarMascara();
  ubicar();
  img.addEventListener('load', function () { ubicar(); actualizarMascara(); });
  window.addEventListener('resize', ubicar);
  if (window.ResizeObserver) new ResizeObserver(ubicar).observe(img);
  new MutationObserver(function () { actualizarMascara(); ubicar(); }).observe(img, { attributes: true, attributeFilter: ['src', 'srcset'] });

  var puedeHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (puedeHover) {
    img.addEventListener('mouseenter', function () {
      caja.classList.add('melkh--moviendo');
      badge.classList.add('melkh-badge--oculto');
    });
    img.addEventListener('mouseleave', function () {
      caja.classList.remove('melkh--moviendo');
      badge.classList.remove('melkh-badge--oculto');
    });
  }

  var info = document.createElement('div');
  info.className = 'melkh-info';
  info.id = 'melkh-info';

  var tag = document.createElement('span');
  tag.className = 'melkh-info__tag';
  tag.textContent = 'INFORMACIÓN IMPORTANTE SOBRE STICKERS HOLOGRÁFICOS';

  var cajaInfo = document.createElement('div');
  cajaInfo.className = 'melkh-info__caja';
  var texto = document.createElement('span');
  texto.textContent = 'Material que cambia de color según la luz y el ángulo. El corte se hace sobre el holo. Si el diseño tiene borde de color, se agrega un margen de 1 a 2 mm.';
  var aviso = document.createElement('b');
  aviso.className = 'melkh-info__aviso';
  aviso.textContent = 'No incluye tinta blanca. Imagen ilustrativa.';
  cajaInfo.appendChild(texto);
  cajaInfo.appendChild(aviso);

  info.appendChild(tag);
  info.appendChild(cajaInfo);

  var cantidad = document.querySelector('.product-vip__quantity');
  var filaCantidad = cantidad && cantidad.closest ? cantidad.closest('.uk-grid') : null;
  var contenedorAtributos = document.getElementById('product-vip__attributes');

  if (filaCantidad && filaCantidad.parentNode) {
    filaCantidad.parentNode.insertBefore(info, filaCantidad);
  } else if (contenedorAtributos && contenedorAtributos.parentNode) {
    contenedorAtributos.parentNode.insertBefore(info, contenedorAtributos.nextSibling);
  } else if (cantidad && cantidad.parentNode) {
    cantidad.parentNode.insertBefore(info, cantidad);
  }

  function actualizar() {
    var sel = items.filter(function (a) { return a.className.indexOf('--selected') >= 0; })[0];
    var activo = !!sel && (sel.getAttribute('data-value') || '').toUpperCase().indexOf('HOLO') >= 0;
    caja.classList.toggle('activo', activo);
    if (badge) badge.classList.toggle('melkh-badge--visible', activo);
    if (activo && puedeHover) {
      try {
        if (img.matches(':hover')) caja.classList.add('melkh--moviendo');
      } catch (e) { }
    }
  }

  for (var k = 0; k < items.length; k++) {
    (function (a) {
      a.addEventListener('click', function () { window.setTimeout(actualizar, 40); });
      new MutationObserver(actualizar).observe(a, { attributes: true, attributeFilter: ['class'] });
    })(items[k]);
  }

  actualizar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', melkHolo);
} else {
  melkHolo();
}

var melkHoloVueltas = 0;
var melkHoloTimer = window.setInterval(function () {
  melkHoloVueltas++;
  if (document.getElementById('melkh-caja') || melkHoloVueltas > 40) {
    window.clearInterval(melkHoloTimer);
    return;
  }
  melkHolo();
}, 250);
})();


(function () {
  var estilo = document.createElement('style');
  estilo.id = 'melk-menu-fix';
  estilo.textContent = [
    '.desktop-list__menu > ul > li > a.desktop-list-link__text--bold:hover,',
    '.desktop-list__menu > ul > li > a.desktop-list-link__text--bold:focus {',
    '  animation: melk-levitar 2.6s ease-in-out infinite !important;',
    '  transform-origin: 50% 60% !important;',
    '  transition: transform .3s ease !important;',
    '  will-change: transform;',
    '}',
    '@keyframes melk-levitar {',
    '  0%, 100% { transform: translateY(0) scale(1.04); }',
    '  50% { transform: translateY(-4px) scale(1.05); }',
    '}',
    '.desktop-list__menu ul ul a.desktop-list-link__text:hover,',
    '.desktop-list__menu ul ul a.desktop-list-link__text:focus {',
    '  animation: none !important;',
    '  transform: none !important;',
    '}',
    '.desktop-list__menu > ul > li > a.desktop-list-link__text--bold:hover,',
    '.desktop-list__menu > ul > li > a.desktop-list-link__text--bold:focus { background: transparent !important; background-color: transparent !important; box-shadow: none !important; color: #353535 !important; -webkit-text-fill-color: #353535 !important; text-shadow: none !important; }',
    '.melk-ver-todo-wrap { display: block !important; text-align: right; margin: 18px 4px 2px; }',
    '#melk-ver-todo-btn { display: inline-flex !important; align-items: center !important; justify-content: center !important; padding: 10px 18px !important; border: 0 !important; border-radius: 8px !important; background: #353535 !important; background-color: #353535 !important; color: #ffee26 !important; font-family: Rubik, system-ui, sans-serif !important; font-size: 11px !important; font-weight: 800 !important; line-height: 1 !important; letter-spacing: .06em !important; text-transform: uppercase !important; text-decoration: none !important; box-shadow: none !important; transition: background .2s ease, transform .2s ease !important; }',
    '#melk-ver-todo-btn:hover, #melk-ver-todo-btn:focus { background: #000 !important; background-color: #000 !important; color: #ffee26 !important; transform: translateY(-2px); }'
  ].join('\n');
  document.head.appendChild(estilo);

  function arreglarMenu() {
    var dropdown = document.querySelector('.header-menu__desktop-list__container-list');
    if (!dropdown) return;

    var barra = null;
    for (var i = 0; i < dropdown.children.length; i++) {
      var el = dropdown.children[i];
      if (el.tagName === 'A' && el.className.indexOf('desktop-list__hover') >= 0) {
        barra = el;
        break;
      }
    }
    if (barra) {
      var siguiente = barra.nextElementSibling;
      dropdown.removeChild(barra);
      if (siguiente && siguiente.tagName === 'HR') dropdown.removeChild(siguiente);
    }

    var menu = dropdown.querySelector('.desktop-list__menu');
    if (menu && !dropdown.querySelector('.melk-ver-todo')) {
      var wrap = document.createElement('div');
      wrap.className = 'melk-ver-todo-wrap';
      var a = document.createElement('a');
      a.className = 'melk-ver-todo';
      a.id = 'melk-ver-todo-btn';
      a.href = '/productos';
      a.textContent = 'VER TODO';
      wrap.appendChild(a);
      menu.parentNode.insertBefore(wrap, menu.nextSibling);
    }
  }

  function iniciar() {
    arreglarMenu();
    var n = 0;
    var timer = window.setInterval(function () {
      n++;
      arreglarMenu();
      if (n >= 30) window.clearInterval(timer);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();


(function () {
  var estilo = document.createElement('style');
  estilo.id = 'melk-prodinfo-style';
  estilo.textContent = [
    '.melk-prodinfo { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; font-family: Rubik, system-ui, sans-serif !important; color: #353535 !important; }',
    '.melk-prodinfo .melk-prodinfo__tag { display: inline-block !important; max-width: 100% !important; box-sizing: border-box !important; margin: 0 0 8px !important; padding: 7px 14px !important; border: 2px solid #353535 !important; border-radius: 999px !important; background: #ffe600 !important; color: #353535 !important; font-family: Rubik, system-ui, sans-serif !important; font-size: 10.5px !important; font-weight: 700 !important; line-height: 1.25 !important; letter-spacing: .04em !important; text-transform: uppercase !important; text-align: center !important; }',
    '.melk-prodinfo .melk-prodinfo__caja { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; padding: 12px 14px !important; border: 2px solid #353535 !important; border-radius: 12px !important; background: #fff !important; color: #353535 !important; font-family: Rubik, system-ui, sans-serif !important; font-size: 12.5px !important; font-weight: 400 !important; line-height: 1.5 !important; overflow-wrap: break-word !important; }',
    '.melk-prodinfo .melk-prodinfo__caja p { margin: 0 0 8px !important; }',
    '.melk-prodinfo .melk-prodinfo__caja p:last-child { margin-bottom: 0 !important; }',
    '.melk-prodinfo .melk-prodinfo__caja strong, .melk-prodinfo .melk-prodinfo__caja b { font-weight: 700 !important; }',
    '.melk-prodinfo .melk-prodinfo__caja em, .melk-prodinfo .melk-prodinfo__caja i { font-style: italic !important; }',
    '.melk-prodinfo .melk-prodinfo__caja ul, .melk-prodinfo .melk-prodinfo__caja ol { margin: 0 0 8px 18px !important; padding: 0 !important; }',
    '.melk-alerta { display: flex !important; align-items: flex-start !important; gap: 10px !important; margin: 0 !important; padding: 12px 14px !important; border: 0 !important; border-radius: 12px !important; background: #353535 !important; color: #fff !important; font-family: Rubik, system-ui, sans-serif !important; font-size: 13px !important; font-weight: 400 !important; line-height: 1.5 !important; }',
    '.melk-alerta .uk-icon { flex: 0 0 22px !important; width: 22px !important; height: 22px !important; border-radius: 50% !important; background: #ffe600 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; color: #111 !important; }',
    '.melk-alerta .uk-icon svg { width: 15px !important; height: 15px !important; }',
    '.melk-alerta .uk-icon svg circle { stroke: #111 !important; }',
    '.melk-alerta .uk-icon svg path { fill: #111 !important; }',
    '.melk-alerta__texto { flex: 1 1 auto !important; min-width: 0 !important; display: flex !important; flex-direction: column !important; gap: 2px !important; }',
    '.melk-alerta__linea { display: block !important; }',
    '.melk-alerta-padre { background: transparent !important; padding: 0 !important; }',
    '.product-vip__attribute-item { border-radius: 8px !important; }'
  ].join('\n');
  document.head.appendChild(estilo);

  function envolver() {
    var descs = document.querySelectorAll('.product-vip__description');
    for (var i = 0; i < descs.length; i++) {
      var d = descs[i];
      if (d.getAttribute('data-melk-prodinfo')) continue;
      d.setAttribute('data-melk-prodinfo', '1');
      d.classList.add('melk-prodinfo');
      var tag = document.createElement('span');
      tag.className = 'melk-prodinfo__tag';
      tag.textContent = 'INFORMACIÓN DEL PRODUCTO';
      var caja = document.createElement('div');
      caja.className = 'melk-prodinfo__caja';
      while (d.firstChild) caja.appendChild(d.firstChild);
      d.appendChild(tag);
      d.appendChild(caja);
    }
  }

  function respaldo() {
    if (document.querySelector('.melk-prodinfo')) return;
    var cantidad = document.querySelector('.product-vip__quantity');
    if (!cantidad) return;
    var fila = cantidad.closest ? cantidad.closest('.uk-grid') : null;
    var info = document.createElement('div');
    info.className = 'melk-prodinfo';
    var tag = document.createElement('span');
    tag.className = 'melk-prodinfo__tag';
    tag.textContent = 'INFORMACIÓN DEL PRODUCTO';
    var caja = document.createElement('div');
    caja.className = 'melk-prodinfo__caja';
    info.appendChild(tag);
    info.appendChild(caja);
    if (fila && fila.parentNode) fila.parentNode.insertBefore(info, fila);
    else if (cantidad.parentNode) cantidad.parentNode.insertBefore(info, cantidad);
  }

  function alerta() {
    var a = document.querySelector('.product-vip__alert-text');
    if (!a) return;
    a.classList.add('melk-alerta');
    if (a.parentElement) a.parentElement.classList.add('melk-alerta-padre');

    /* Prints: el alerta del tema es global (lo comparten stickers), así que el
       texto propio de posters se aplica solo en las páginas /prints/... */
    if (!/^\/prints\//.test(location.pathname) || a.getAttribute('data-melk-alerta-prints')) return;

    a.setAttribute('data-melk-alerta-prints', '1');
    var icono = a.querySelector('.uk-icon');
    var texto = document.createElement('div');
    texto.className = 'melk-alerta__texto';
    var linea1 = document.createElement('span');
    linea1.className = 'melk-alerta__linea';
    linea1.textContent = 'TIEMPO DE ELABORACIÓN - 2 DÍAS HÁBILES (MÁS TIEMPO DE ENVÍO)';
    var linea2 = document.createElement('span');
    linea2.className = 'melk-alerta__linea';
    linea2.textContent = 'EN CASO DE COMBINAR POSTERS + STICKERS, EL TIEMPO DE ELABORACIÓN ES DE 7 A 10 DÍAS HÁBILES.';
    texto.appendChild(linea1);
    texto.appendChild(linea2);

    a.textContent = '';
    if (icono) a.appendChild(icono);
    a.appendChild(texto);
  }

  function iniciar() {
    envolver();
    respaldo();
    alerta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  var n = 0;
  var t = window.setInterval(function () {
    n++;
    envolver();
    respaldo();
    alerta();
    if (n >= 20) window.clearInterval(t);
  }, 500);
})();
/* ==========================================================
   FIXES GLOBALES DE HEADER (MELMAK) - V2
   ========================================================== */
(function arreglarHeaderYMarquee() {
  var styleHeader = document.createElement('style');
  styleHeader.textContent = [
    /* 1. LOGO: Anular la animación extraña del tema y forzar un hover limpio */
    /* Al quitar el transform en hover, evitamos que se "levante" de un solo lado */
    '.header-logo, .header-logo__image, a.header-logo {',
    '  transform: none !important;',
    '  transition: opacity 0.3s ease !important;',
    '}',
    '.header-logo:hover, .header-logo__image:hover, a.header-logo:hover {',
    '  transform: scale(1.05) !important;', /* Un escalado suave y simétrico */
    '  transform-origin: center center !important;',
    '}',

    /* 2. RESPONSIVO: Evitar que el logo se meta debajo de la franja negra */
    /* Hacemos que la franja negra empuje el contenido hacia abajo en lugar de superponerse */
    '@media (max-width: 768px) {',
    '  .header-announcement {',
    '    position: relative !important;',
    '    z-index: 10 !important;',
    '  }',
    '  .header, header {',
    '    padding-top: 10px !important;',
    '    margin-top: 0 !important;',
    '  }',
    '  /* Si el logo está posicionado de forma absoluta, lo forzamos a estar estático */',
    '  .header-logo, .header__left {',
    '    position: relative !important;',
    '    top: 0 !important;',
    '    margin-top: 15px !important; /* Agrega el espacio blanco extra */',
    '  }',
    '}'
  ].join('\n');
  document.head.appendChild(styleHeader);

  /* 3. MARQUEE AMARILLO: Forzar el inicio de CUALQUIER animación de marquesina */
  function forzarTodasLasAnimaciones() {
    // Busca cualquier elemento que tenga una animación en su CSS computado
    var todos = document.querySelectorAll('*');
    for (var i = 0; i < todos.length; i++) {
      var el = todos[i];
      var estilo = window.getComputedStyle(el);

      // Si el elemento tiene una animación activa (marquee, slide, scroll, etc.)
      if (estilo.animationName !== 'none' && estilo.animationName.indexOf('marquee') !== -1 || estilo.animationName.indexOf('slide') !== -1) {
        el.style.animation = 'none';
        void el.offsetWidth; // Fuerza el repintado (reflow)
        el.style.animation = ''; // Vuelve a aplicar la animación
      }
    }
  }

  // Ejecutar en varios momentos clave de la carga de la página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forzarTodasLasAnimaciones);
  } else {
    forzarTodasLasAnimaciones();
  }

  window.addEventListener('load', forzarTodasLasAnimaciones);

  // Si el tema usa fuentes de Typekit, al cargar mueven el layout y traban el marquee
  if (document.fonts) {
    document.fonts.ready.then(forzarTodasLasAnimaciones);
  }

  // Refuerzos con setTimeout
  setTimeout(forzarTodasLasAnimaciones, 300);
  setTimeout(forzarTodasLasAnimaciones, 1000);
})();