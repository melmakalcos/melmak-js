/*TILT_MELMAK_FINAL_v13 - Anulación de sombra nativa y Tilt directo en VIP*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  (function () {
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(
      '[class*="product-offer"] { z-index: 999 !important; pointer-events: none !important; }' +
      /* Matamos la sombra gris nativa de Empretienda en el producto VIP para que no ensucie el 3D */
      '.product-vip__carrousel-image { box-shadow: none !important; transition: transform .05s ease-out; will-change: transform; cursor: pointer; }'
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

      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        c.style.transform = 'perspective(400px) rotateX(' + ((0.5 - y) * 25) + 'deg) rotateY(' + ((x - 0.5) * 30) + 'deg) scale(1.10)';
        c.style.transition = 'transform .05s ease-out';
        c.style.zIndex = '50';
      });

      c.addEventListener('mouseleave', function () {
        c.style.transform = 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)';
        c.style.transition = 'transform .3s ease-out';
        c.style.zIndex = '1';
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
        img.style.transition = 'transform .05s ease-out';
      });

      img.addEventListener('mouseleave', function () {
        img.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)';
        img.style.transition = 'transform .3s ease-out';
      });
    })(vips[j]);
  }

  atar();
  setInterval(atar, 700);
  document.addEventListener('DOMContentLoaded', atar);
})();

/*SIDEBAR_MAPA_COMPLETO_v2 - barra lateral = categorias raiz del catalogo*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  /* Categorias raiz exactas de MELMAKALCOS (orden del menu CATALOGO) */
  var RAICES = [
    ['ANIMADOS',      '/animados'],
    ['ANIMANGA',      '/animanga'],
    ['CINE Y TV',     '/cine-y-tv'],
    ['COLOR',         '/color'],
    ['DRAGON BALL',   '/dragon-ball'],
    ['HARRY POTTER',  '/harry-potter'],
    ['MELMAKEADAS',   '/melmakeadas'],
    ['MUSICA',        '/musica'],
    ['MUSICA-PORTADAS','/musica-portadas'],
    ['POKEMON',       '/pokemon-todos'],
    ['SIMPSONS',      '/simpsons'],
    ['STAR WARS',     '/star-wars'],
    ['UNIVERSO',      '/universo'],
    ['HOLOGRÁFICOS',  '/holograficos'],
    ['STICKERS-PORTADAS','/stickers-portadas'],
    ['MAYORISTA',     '/mayorista'],
    ['PERSONALIZADOS','/personalizados'],
    ['PACKS',         '/packs']
  ];
  /* sacá/agregá las que quieras; este carrito es: ES LA LISTA = "Ver todo en..." */

  function raizActual() {
    var p = location.pathname.toLowerCase();
    for (var i = 0; i < RAICES.length; i++) {
      if (p === RAICES[i][1] || p.indexOf(RAICES[i][1] + '/') === 0) return RAICES[i][1];
    }
    return '';
  }

  function pintar() {
    /* contenedor real de la lista lateral */
    var caja = document.querySelector('.products-feed__categories-list,' +
      '[class*="categories-list"], [class*="block-products-feed__product-media"] .products-feed__categories');

    /* busco el ul que contiene los links actuales */
    var ul = document.querySelector('.products-feed__categories-list ul,' +
      '[class*="categories-list"] ul');
    if (!caja && !ul) return;
    var cont = ul || document.createElement('ul');

    if (cont.getAttribute('data-mxm-map')) { marcarActivo(); return; }
    cont.setAttribute('data-mxm-map', '1');
    cont.innerHTML = '';

    for (var i = 0; i < RAICES.length; i++) {
      var a = document.createElement('a');
      a.setAttribute('data-mxm-dir', RAICES[i][1]);
      a.href = 'https://www.melmakalcos.com.ar' + RAICES[i][1];
      a.className = 'products-feed__categories-list-link text--primary text--primary-hover';
      a.textContent = RAICES[i][0];
      a.style.cssText = 'display:flex;align-items:center;gap:.5rem;padding:.45rem .75rem;' +
        'color:#5a2d82;text-transform:uppercase;font-weight:600;font-size:.82rem;' +
        'letter-spacing:.03em;border-left:3px solid transparent;transition:.15s;';

      var li = document.createElement('li');
      li.appendChild(a);
      cont.appendChild(li);
    }

    /* meto la lista en la caja si no habia ul */
    if (!ul && caja) {
      caja.innerHTML = '';
      caja.appendChild(cont);
    }
    cont.style.cssText = 'list-style:none;margin:0;padding:.5rem .25rem;';
    marcarActivo();
  }

  function marcarActivo() {
    var raiz = raizActual();
    var links = document.querySelectorAll('[data-mxm-dir]');
    for (var i = 0; i < links.length; i++) {
      var es = links[i].getAttribute('data-mxm-dir').toLowerCase() === raiz.toLowerCase();
      links[i].style.backgroundColor = es ? '#f7ef10' : 'transparent';
      links[i].style.borderLeftColor = es ? '#f7ef10' : 'transparent';
      links[i].style.fontWeight = es ? '800' : '600';
      links[i].style.color = es ? '#14120f' : '#5a2d82';
    }
  }

  pintar();
  setInterval(pintar, 700);                 /* cubre navegación SPA si el tema la usa */
  window.addEventListener('scroll', pintar, { passive: true });
  document.addEventListener('DOMContentLoaded', pintar);
})();
