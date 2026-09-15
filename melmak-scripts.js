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
      '.melmak-glare { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; opacity: 0; transition: opacity .3s ease; mix-blend-mode: overlay; }'
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
        glare.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)';
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
        var brightness = 1 + (0.5 - y) * 0.35;
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



<script>
/* ARBOL_SIDEBAR FINAL - agrupa por profundidad de URL */
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
  function seg2(h) { /* 1ra y 2da parte despues del dominio */
    var m = /melmakalcos\.com\.ar\/([^\/?#]+)(?:\/([^\/?#]+))?/i.exec(h || "");
    return m ? [m[1] || "", m[2] || ""] : ["", ""];
  }

  document.addEventListener("DOMContentLoaded", function () {
    var caja = document.querySelector(".products-feed__filter");
    if (!caja) return;
    var origen = caja.querySelector("ul");
    if (!origen) return;
    var arbol = {};

    var enlaces = origen.querySelectorAll("a[href]");
    for (var i = 0; i < enlaces.length; i++) {
      var a = enlaces[i], s = seg2(a.getAttribute("href") || a.href);
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

    for (var f in FORZADAS) if (!arbol[f.Replace(/-/g, "")]) ;
    /* ^ BORRAR esta linea si no la entendes: es residuo mio */

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
      var w = document.createElement("div");
      w.className = "arbol-final-wrap";
      w.appendChild(ulN);
      padre.insertBefore(w, origen);
    }
  });
})();
</script>
