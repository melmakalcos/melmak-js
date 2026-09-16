/*TILT_MELMAK_FINAL_v14 - Anulación de sombra nativa, Tilt directo y Brillo/Reflejo (Glare)*/(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;


  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"] { z-index: 999 !important; pointer-events: none !important; }' +
      '.product-vip__carrousel-image { box-shadow: none !important; transition: transform .05s ease-out, filter .05s ease-out; will-change: transform; cursor: pointer; }' +
      '.products-feed__product-wrapper, .products-feed__product-wrapper:hover, .block-products-feed__product-wrapper, .block-products-feed__product-wrapper:hover, .block-products-set__product-wrapper, .block-products-set__product-wrapper:hover { box-shadow: none !important; }' +
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


/* ARBOL DE CATEGORIAS RECURSIVO */
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
    var filtro = document.querySelector('.products-feed__filter');
    var listaOriginal = document.querySelector(
      '.products-feed__categories-list'
    );


    /*
     * El menú superior tiene todas las categorías y subcategorías.
     * La lista original define cuáles son las categorías principales.
     */
    var enlacesMenuSuperior = document.querySelectorAll(
      '.header-menu__desktop-list__container-list a.desktop-list-link__text'
    );


    if (!filtro || !listaOriginal || !enlacesMenuSuperior.length) {
      return false;
    }


    if (filtro.querySelector('.cat-arbol[data-recursivo="ok"]')) {
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


    Array.from(listaOriginal.querySelectorAll('a')).forEach(function (enlace) {
      guardarCategoria(enlace, true);
    });


    Array.from(enlacesMenuSuperior).forEach(function (enlace) {
      guardarCategoria(enlace, false);
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


    var arbolAnterior = filtro.querySelector('.cat-arbol');


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


    arbol.addEventListener('click', function (evento) {
      var cabeza = evento.target.closest('.cat-cabeza');


      if (!cabeza || !arbol.contains(cabeza)) {
        return;
      }


      if (evento.target.closest('a')) {
        return;
      }


      cabeza.parentElement.classList.toggle('cat-abierta');
    });


    listaOriginal.insertAdjacentElement('beforebegin', arbol);


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


      /*
       * Evita que quede el panel vacío si el tema cambia su estructura.
       */
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


/* ESTILOS DEL ARBOL */
(function () {
  var css = [
    '.cat-arbol, .cat-arbol ul { list-style: none; margin: 0; padding: 0; }',


    '.cat-arbol { margin: 0 0 8px; }',


    '.cat-arbol > ul > li > a { display: block; padding: 7px 0; border-bottom: 1px solid rgba(53,53,53,.25); color: #353535 !important; font-weight: 700; text-transform: uppercase; }',


    '.cat-cabeza { display: flex; justify-content: space-between; align-items: center; gap: 8px; cursor: pointer; padding: 7px 0; border-bottom: 1px solid rgba(53,53,53,.25); }',


    '.cat-cabeza a { color: #353535 !important; font-weight: 700; text-transform: uppercase; flex: 1; }',


    '.flechita { font-size: .8rem; transition: transform .25s ease; }',


    '.cat-abierta > .cat-cabeza .flechita { transform: rotate(180deg); }',


    '.cat-hijos { padding: 0 0 0 4px; max-height: 0; overflow: hidden; transition: max-height .3s ease; }',


    '.cat-abierta > .cat-hijos { max-height: 6000px; }',


    '.cat-hijos a { display: block; margin: 2px 0; padding: 6px 10px; border-radius: 8px; background: #fff; color: #353535 !important; font-size: .82rem; }',


    '.cat-hijos a:hover { opacity: .85; }',


    '.products-feed__filter > .products-feed__filter-title, .products-feed__filter > hr, .products-feed__filter > .products-feed__categories-list { display: none !important; }',
    '.products-feed__product-wrapper, .products-feed__product-wrapper:hover, .block-products-feed__product-wrapper, .block-products-feed__product-wrapper:hover, .block-products-set__product-wrapper, .block-products-set__product-wrapper:hover, .product-vip__carrousel-image { box-shadow: none !important; }'
  ].join('');


  var estilo = document.createElement('style');
  estilo.appendChild(document.createTextNode(css));
  document.head.appendChild(estilo);
})();

(function() {
  // 1. Verificar si el usuario está en el Home
  const pathname = window.location.pathname;
  const isHomePage = pathname === '/' || pathname === '' || pathname === '/index.html';

  // Si NO estamos en el home, cortamos la ejecución del script aquí
  if (!isHomePage) return;

  // 2. Estilos CSS para el personaje
  const style = document.createElement('style');
  style.textContent = `
    #floating-mascot {
      position: fixed;
      bottom: 0px; /* Cambiá a -180px si preferís la versión animada que asoma */
      left: 20px;
      z-index: 9998;
      pointer-events: none;
    }
    #floating-mascot img {
      width: 150px; /* Ajustá el tamaño del personaje */
      height: auto;
      display: block;
    }
  `;
  document.head.appendChild(style);

  // 3. Crear e inyectar la mascota solo en el Home
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

// ==========================================
// EFECTO RGB - ARO GIRATORIO SOBRE EL BOTÓN CATÁLOGO
// ==========================================
(function () {
  const css = `
    .header-menu__desktop-list li.desktop-list__item:has(> a.desktop-list__link .desktop-list__down-icon) > a.desktop-list__link {
      position: relative;
      border-radius: 999px !important;
    }
    .header-menu__desktop-list li.desktop-list__item:has(> a.desktop-list__link .desktop-list__down-icon) > a.desktop-list__link::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 5px;
      border-radius: 999px;
      background: conic-gradient(from 0deg,
        #ff0000, #ff7f00, #ffff00, #00ff00, #00ffff, #0000ff, #8b00ff, #ff0000);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              mask-composite: exclude;
      animation: melmakAroRGB 1.6s linear infinite;
      z-index: 2;
      pointer-events: none;
    }
    @keyframes melmakAroRGB {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .header-menu__desktop-list li.desktop-list__item:has(> a.desktop-list__link .desktop-list__down-icon) > a.desktop-list__link::before { animation: none; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();