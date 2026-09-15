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
/* ARBOL_SIDEBAR FINAL v2 - Empretienda
   Agrupa por PROFUNDIDAD de URL (soporta 1, 2 y 3 niveles):
     /raiz               = RAIZ (Ej: HOLOGRÁFICOS)
     /raiz/hija          = HIJA (Ej: TORNASOL)
     /raiz/hija/subhija  = SUB-HIJA (Ej: ANIMADOS)
   Sólo desktop (móvil intacto) */
(function () {
  "use strict";
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var FORZADAS = { melmakeadas: "/melmakeadas" };

  function segs(h) {
    if (!h) return [];
    try {
      var path = new URL(h, window.location.origin).pathname;
      return path.split("/").filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  function limpio(a) {
    var c = a.cloneNode(true);
    var q = c.querySelectorAll("svg,path,i,span");
    for (var i = 0; i < q.length; i++) {
      if (q[i].parentNode) q[i].parentNode.removeChild(q[i]);
    }
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
      var a = enlaces[i];
      var s = segs(a.getAttribute("href") || a.href);
      if (!s[0] || s[0].toLowerCase() === "productos" || s[0].toLowerCase() === "buscar") continue;

      var r = s[0].toLowerCase();
      if (!arbol[r]) arbol[r] = { a: null, hijos: {} };

      if (s.length === 1) {
        if (!arbol[r].a) arbol[r].a = a;
      } else if (s.length === 2) {
        var h = s[1].toLowerCase();
        if (!arbol[r].hijos[h]) arbol[r].hijos[h] = { a: a, subhijos: {} };
        else if (!arbol[r].hijos[h].a) arbol[r].hijos[h].a = a;
      } else if (s.length >= 3) {
        var h2 = s[1].toLowerCase();
        var sub = s[2].toLowerCase();
        if (!arbol[r].hijos[h2]) arbol[r].hijos[h2] = { a: null, subhijos: {} };
        if (!arbol[r].hijos[h2].subhijos[sub]) arbol[r].hijos[h2].subhijos[sub] = a;
      }
    }

    for (var f in FORZADAS) {
      if (!arbol[f]) {
        var af = document.createElement("a");
        af.href = FORZADAS[f];
        arbol[f] = { a: af, hijos: {} };
      }
    }

    var ulN = document.createElement("ul");

    Object.keys(arbol).sort().forEach(function (raiz) {
      var n = arbol[raiz];
      if (!n.a && Object.keys(n.hijos).length === 0) return;

      var li = document.createElement("li");
      var aR = document.createElement("a");
      aR.href = n.a ? (n.a.getAttribute("href") || n.a.href) : "/" + raiz;
      aR.textContent = (n.a ? limpio(n.a) : raiz.replace(/-/g, " ")).toUpperCase();
      li.appendChild(aR);

      var hs = Object.keys(n.hijos).sort();
      if (hs.length) {
        var ulH = document.createElement("ul");
        hs.forEach(function (h) {
          var nodoHijo = n.hijos[h];
          var li2 = document.createElement("li");
          var a2 = document.createElement("a");
          
          a2.href = nodoHijo.a ? (nodoHijo.a.getAttribute("href") || nodoHijo.a.href) : "/" + raiz + "/" + h;
          a2.textContent = (nodoHijo.a ? limpio(nodoHijo.a) : h.replace(/-/g, " ")).toUpperCase();
          li2.appendChild(a2);

          var subs = Object.keys(nodoHijo.subhijos).sort();
          if (subs.length) {
            var ulSub = document.createElement("ul");
            subs.forEach(function (sb) {
              var a3 = nodoHijo.subhijos[sb];
              var li3 = document.createElement("li");
              var aSub = document.createElement("a");
              aSub.href = a3.getAttribute("href") || a3.href;
              aSub.textContent = (limpio(a3) || sb.replace(/-/g, " ")).toUpperCase();
              li3.appendChild(aSub);
              ulSub.appendChild(li3);
            });
            li2.appendChild(ulSub);
          }
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
      origen.style.display = "none";
    }
  });
})();
</script>
