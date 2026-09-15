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

<!-- MENU_MANUAL_MELMAK -->
<script>
(function () {
  "use strict";

  // 1. EDITA TU MENÚ AQUÍ (Agrega, quita o cambia nombres y links a gusto)
  var MI_MENU = [
    {
      nombre: "MÚSICA",
      url: "/musica",
      subcategorias: [
        { nombre: "PORTADAS", url: "/musica/portadas" },
        { nombre: "DC", url: "/musica/dc" },
        { nombre: "TORNASOL", url: "/musica/tornasol" }
      ]
    },
    {
      nombre: "MELMAKEADAS",
      url: "/melmakeadas",
      subcategorias: []
    },
    {
      nombre: "ANIME",
      url: "/anime",
      subcategorias: [
        { nombre: "EVANGELION", url: "/anime/evangelion" }
      ]
    }
  ];

  function renderizarMenu() {
    var caja = document.querySelector(".products-feed__filter");
    if (!caja || caja.getAttribute("data-menu-manual")) return false;

    // Crear contenedor principal
    var wrap = document.createElement("div");
    wrap.className = "menu-manual-wrap";

    var ulPrincipal = document.createElement("ul");
    ulPrincipal.style.listStyle = "none";
    ulPrincipal.style.padding = "0";
    ulPrincipal.style.margin = "0";

    for (var i = 0; i < MI_MENU.length; i++) {
      var cat = MI_MENU[i];
      var liR = document.createElement("li");
      liR.style.marginBottom = "10px";

      var divCabeza = document.createElement("div");
      divCabeza.style.display = "flex";
      divCabeza.style.justifyContent = "space-between";
      divCabeza.style.alignItems = "center";

      var aR = document.createElement("a");
      aR.href = cat.url;
      aR.textContent = cat.nombre.toUpperCase();
      aR.style.fontWeight = "bold";
      aR.style.textDecoration = "none";
      aR.style.color = "inherit";

      divCabeza.appendChild(aR);

      // Si tiene subcategorías, agregar botón desplegable
      if (cat.subcategorias && cat.subcategorias.length > 0) {
        var btn = document.createElement("span");
        btn.innerHTML = "&#9660;";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "12px";
        btn.style.padding = "0 5px";
        divCabeza.appendChild(btn);

        var ulSub = document.createElement("ul");
        ulSub.className = "sub-lista";
        ulSub.style.listStyle = "none";
        ulSub.style.paddingLeft = "15px";
        ulSub.style.marginTop = "5px";
        ulSub.style.display = "none"; // Oculto por defecto

        for (var j = 0; j < cat.subcategorias.length; j++) {
          var sub = cat.subcategorias[j];
          var liS = document.createElement("li");
          liS.style.margin = "5px 0";

          var aS = document.createElement("a");
          aS.href = sub.url;
          aS.textContent = sub.nombre.toUpperCase();
          aS.style.textDecoration = "none";
          aS.style.color = "#555";

          liS.appendChild(aS);
          ulSub.appendChild(liS);
        }

        // Evento desplegable
        (function(subUlElement, icono) {
          icono.addEventListener("click", function(e) {
            e.preventDefault();
            var estaOculto = subUlElement.style.display === "none";
            subUlElement.style.display = estaOculto ? "block" : "none";
            icono.innerHTML = estaOculto ? "&#9650;" : "&#9660;";
          });
        })(ulSub, btn);

        liR.appendChild(divCabeza);
        liR.appendChild(ulSub);
      } else {
        liR.appendChild(divCabeza);
      }

      ulPrincipal.appendChild(liR);
    }

    wrap.appendChild(ulPrincipal);

    // Ocultar el contenido original del filtro y poner nuestro menú
    caja.innerHTML = "";
    caja.appendChild(wrap);
    caja.setAttribute("data-menu-manual", "1");
    return true;
  }

  // Ejecución continua hasta encontrar el contenedor
  var n = 0;
  var timer = setInterval(function() {
    if (renderizarMenu() || n++ > 100) {
      clearInterval(timer);
    }
  }, 150);
})();
</script>
