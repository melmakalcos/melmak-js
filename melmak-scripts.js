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
/* ARBOL_SIDEBAR v11 - EMPRETIENDA - jerarquia por profundidad de URL */
(function () {
  "use strict";
  if (window.matchMedia("(pointer: coarse)").matches) return;

  var FORZADAS = { melmakeadas: "https://www.melmakalcos.com.ar/melmakeadas" };

  function segs(h) {
    var m = /melmakalcos\.com\.ar\/([^\/?#]+)?(?:\/([^\/?#]+))?/i.exec(h || "");
    return m ? [m[1] || "", m[2] || ""] : ["", ""];
  }

  function limpio(a) {
    var c = a.cloneNode(true);
    var malos = c.querySelectorAll("svg,path,i,span");
    for (var i = 0; i < malos.length; i++) if (malos[i].parentNode) malos[i].parentNode.removeChild(malos[i]);
    return (c.textContent || "").replace(/\s+/g, " ").trim();
  }

  var lista;
  var n = 0;
  (function esperar() {
    var caja = document.querySelector(".products-feed__filter");
    if (!caja) { if (n++ < 150) setTimeout(esperar, 200); return; }
    if (caja.getAttribute("data-arbol-v11")) return;
    caja.setAttribute("data-arbol-v11", "1");

    var origen = caja.querySelector("ul");
    if (!origen) return;
    var arbol = {};

    var enlaces = origen.querySelectorAll("a[href]");
    var i;
    for (i = 0; i < enlaces.length; i++) {
      var a = enlaces[i];
      var s = segs(a.getAttribute("href") || a.href);
      if (!s[0] || s[0] === "productos") continue;
      var r = s[0].toLowerCase();
      if (!arbol[r]) arbol[r] = { a: null, hijos: {} };
      if (s[1]) { if (!arbol[r].hijos[s[1]]) arbol[r].hijos[s[1]] = a; }
      else if (!arbol[r].a) arbol[r].a = a;
    }

    for (var f in FORZADAS) if (FORZADAS.hasOwnProperty(f) && !arbol[f]) {
      var aa = document.createElement("a"); aa.href = FORZADAS[f]; aa.textContent = f;
      arbol[f] = { a: aa, hijos: {} };
    }

    var ulN = document.createElement("ul");
    var raices = Object.keys(arbol).sort(), rr;
    for (rr = 0; rr < raices.length; rr++) {
      var nodo = arbol[raices[rr]], liR = document.createElement("li");
      var aR = document.createElement("a");
      aR.href = nodo.a.getAttribute("href") || nodo.a.href;
      aR.textContent = (limpio(nodo.a) || raices[rr].replace(/-/g, " ")).toUpperCase();
      liR.appendChild(aRError);
      var hs = Object.keys(nodo.hijos).sort();
      if (hs.length) {
        var ulH = document.createElement("ul");
        for (var hh = 0; hh < hs.length; hh++) {
          var liS = document.createElement("li"), aS = document.createElement("a");
          aS.href = nodo.hijos[hs[hh]].getAttribute("href") || nodo.hijos[hs[hh]].href;
          aS.textContent = (limpio(nodo.hijos[hs[hh]]) || hs[hh].replace(/-/g, " ")).toUpperCase();
          liS.appendChild(aS); ulH.appendChild(liS);
        }
        liR.appendChild(ulH);
      }
      ulN.appendChild(liR);
    }

    var cont = origen.parentNode;
    if (cont) { var wrap = document.createElement("div"); wrap.className = "arbol-v11"; wrap.appendChild(ulN); cont.insertBefore(wrap, origen); }
  })();
})();
</script>
