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

<!-- ARBOL_SIDEBAR v8.1 - Jerarquía por rutas relativas/absolutas -->
<script>
(function () {
  "use strict";

  if (window.matchMedia("(pointer: coarse)").matches) return;

  var FORZADAS = {
    melmakeadas: "https://www.melmakalcos.com.ar/melmakeadas"
  };

  // Parsea cualquier URL (relativa o absoluta) sin depender del dominio
  function segs(href) {
    if (!href) return [];
    try {
      var path = new URL(href, window.location.origin).pathname;
      return path.split("/").filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  function nombre(a) {
    var c = a.cloneNode(true);
    var malos = c.querySelectorAll("svg,path,i");
    for (var i = 0; i < malos.length; i++) {
      if (malos[i].parentNode) malos[i].parentNode.removeChild(malos[i]);
    }
    return (c.textContent || "").replace(/\s+/g, " ").trim();
  }

  function run() {
    var caja = document.querySelector(".products-feed__filter");
    if (!caja || caja.getAttribute("data-arbol-v8")) return false;

    var origen = caja.querySelector("ul");
    if (!origen) return false;

    var enlaces = origen.querySelectorAll("a[href]");
    if (!enlaces.length) return false; // Espera a que existan enlaces cargados

    var arbol = {};
    for (var s = 0; s < enlaces.length; s++) {
      var en = enlaces[s];
      var seg = segs(en.getAttribute("href") || en.href);
      if (!seg[0] || seg.length > 2) continue;

      var r = seg[0].toLowerCase();
      if (r === "productos" || r === "buscar") continue;

      if (!arbol[r]) arbol[r] = { top: null, hijos: {} };

      if (seg.length === 1) {
        if (!arbol[r].top) arbol[r].top = en;
      } else {
        var h = seg[1].toLowerCase();
        if (!arbol[r].hijos[h]) arbol[r].hijos[h] = en;
      }
    }

    for (var f in FORZADAS) {
      if (FORZADAS.hasOwnProperty(f) && !arbol[f]) {
        var af = document.createElement("a");
        af.href = FORZADAS[f];
        af.textContent = f;
        arbol[f] = { top: af, hijos: {} };
      }
    }

    var raices = Object.keys(arbol).sort();
    if (!raices.length) return false;

    var ulN = document.createElement("ul");
    for (var rr = 0; rr < raices.length; rr++) {
      var r2 = raices[rr], nd = arbol[r2];
      if (!nd.top) continue;

      var liR = document.createElement("li");
      var aR = document.createElement("a");
      aR.href = nd.top.getAttribute("href") || nd.top.href;
      aR.textContent = (nombre(nd.top) || r2.replace(/-/g, " ")).toUpperCase();
      liR.appendChild(aR);

      var hs = Object.keys(nd.hijos).sort();
      if (hs.length > 0) {
        var ulH = document.createElement("ul");
        for (var hh = 0; hh < hs.length; hh++) {
          var ah = nd.hijos[hs[hh]];
          var liS = document.createElement("li");
          var aS = document.createElement("a");
          aS.href = ah.getAttribute("href") || ah.href;
          aS.textContent = (nombre(ah) || hs[hh].replace(/-/g, " ")).toUpperCase();
          liS.appendChild(aS);
          ulH.appendChild(liS);
        }
        liR.appendChild(ulH);
      }
      ulN.appendChild(liR);
    }

    var cont = origen.parentNode;
    if (cont) {
      var viejo = cont.querySelector(".arbol-v8-wrap");
      var w = document.createElement("div");
      w.className = "arbol-v8-wrap";
      w.appendChild(ulN);

      if (viejo) cont.replaceChild(w, viejo);
      else cont.insertBefore(w, origen);

      origen.style.display = "none"; // Oculta la lista original no estructurada
      caja.setAttribute("data-arbol-v8", "1");
      return true;
    }
    return false;
  }

  var n = 0;
  (function t() {
    if (run()) return;
    if (n++ > 150) return;
    setTimeout(t, 200);
  })();
})();
</script>
