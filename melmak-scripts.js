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


<script>
/* ARBOL_SIDEBAR FINAL - Empretienda
   Agrupa por PROFUNDIDAD de URL:
     /raiz        = RAIZ
     /raiz/hija   = HIJA anidada
   -> DC y MARVEL quedan DENTRO de UNIVERSO
   -> TORNA SOL queda DENTRO de HOLOGRÁFICOS
   -> MELMAKEADAS forzada como raíz
   Sólo desktop (móvil intacto) */
(function () {
  "use strict";
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var FORZADAS = { melmakeadas: "/melmakeadas" };

  function segs(h) {
    var m = /melmakalcos\.com\.ar\/([^\/?#]+)(?:\/([^\/?#]+))?/i.exec(h || "");
    return m ? [m[1] || "", m[2] || ""] : ["", ""];
  }
  function limpio(a) {
    var c = a.cloneNode(true);
    var q = c.querySelectorAll("svg,path,i,span");
    for (var i = 0; i < q.length; i++)
      if (q[i].parentNode) q[i].parentNode.removeChild(q[i]);
    return (c.textContent || "").replace(/\s+/g, " ").trim();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var caja = document.querySelector(".products-feed__filter");
    if (!caja) return;
    var origen = caja.querySelector("ul");
    if (!origen) return;
    var arbol = {};

    var enlaces = origen.querySelectorAll("a[href]");
    for (var i = 0; i < enlaces.length; i++) {
      var a = enlaces[i], s = segs(a.getAttribute("href") || a.href);
      if (!s[0] || s[0] === "productos") continue;
      var raiz = s[0].toLowerCase();
      if (!arbol[raiz]) arbol[raiz] = { a: null, hijos: {} };
      if (s[1]) {
        var hijo = s[1].toLowerCase();
        if (!arbol[raiz].hijos[hijo]) arbol[raiz].hijos[hijo] = a;
      } else if (!arbol[raiz].a) {
        arbol[raiz].a = a;
      }
    }

    for (var f in FORZADAS) if (!arbol[f]) {
      var af = document.createElement("a");
      af.href = FORZADAS[f];
      arbol[f] = { a: af, hijos: {} };
    }

    var ulN = document.createElement("ul");
    Object.keys(arbol).sort().forEach(function (raiz) {
      var n = arbol[raiz];
      if (!n.a) return;
      var li = document.createElement("li");
      var aR = document.createElement("a");
      aR.href = n.a.getAttribute("href") || n.a.href;
      aR.textContent = (limpio(n.a) || raiz.replace(/-/g, " ")).toUpperCase();
      li.appendChild(aR);
      var hs = Object.keys(n.hijos).sort();
      if (hs.length) {
        var ulH = document.createElement("ul");
        hs.forEach(function (h) {
          var a2 = n.hijos[h], li2 = document.createElement("li"), a3 = document.createElement("a");
          a3.href = a2.getAttribute("href") || a2.href;
          a3.textContent = (limpio(a2) || h.replace(/-/g, " ")).toUpperCase();
          li2.appendChild(a3);
          ulH.appendChild(li2);
        });
        li.appendChild(ulH);
      }
      ulN.appendChild(li);
    });

    var padre = origen.parentNode;
    if (padre) {
      var viejo = padre.querySelector(".arbol-final-wrap");
      var w = document.createElement("div");
      w.className = "arbol-final-wrap";
      w.appendChild(ulN);
      if (viejo) padre.replaceChild(w, viejo);
      else padre.insertBefore(w, origen);
    }
  });
})();
script>
