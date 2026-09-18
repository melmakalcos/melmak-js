/* =========================================================
   MELMAK — HERO "curva arcoíris + MELMAK + personaje"  (PRODUCCIÓN)
   =========================================================
   · Se inserta SOLO después del header (logo + menú Inicio/Catálogo/Contacto).
   · No tapa la sección de stickers: ocupa su propio alto (680 desktop /
     520 móvil, overflow oculto) y empuja el contenido hacia abajo.
   · Incluye TODO (CSS + HTML + animaciones) en un solo archivo:
     pegá este JS en VisualBasic o súbelo a tu repo y referencialo
     por jsDelivr.
   · SOLO_INICIO = true  → se muestra únicamente en la portada
     (/productos, categorías, etc. quedan intactas).
     Cambialo a false si querés que aparezca en todas las páginas.
   ========================================================= */

(function () {
    'use strict';

    var SOLO_INICIO = true;

    function listo(fn) {
        if (document.readyState !== 'loading') { setTimeout(fn, 0); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    listo(function () {
        if (SOLO_INICIO) {
            var ruta = location.pathname.replace(/\/+$/, '');
            if (ruta !== '') return;   // solo portada
        }

        var ancla = document.querySelector('.header-menu');   // después del header/nav
        if (!ancla) return;
        if (document.getElementById('melmak-curva-hero')) return;

        var config = {
            amarillo: '#ffee26',
            oscuro: '#353535',
            texto: 'MELMAK',
            caraUrl: 'https://d22fxaf9t8d39k.cloudfront.net/4815ee03a7b7fb2d71f4fbcf9decc0828c75df0289c7e0154574a956f1564eed20700.png',
        };

        var style = document.createElement('style');
        style.id = 'melmak-curva-hero';
        style.textContent = [
            '@font-face {',
            '  font-family: "Curda Gouda";',
            '  src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@51a89bfb88809c8675480f42147afd66d90c6f19/Curda%20Gouda.ttf") format("truetype");',
            '  font-weight: normal;',
            '  font-style: normal;',
            '}',
            '.melmak-curva-hero {',
            '  position: relative;',
            '  width: 100%;',
            '  overflow: hidden;',
            '  background: transparent;',
            '}',
            '.melmak-curva-hero__anillo {',
            '  position: absolute;',
            '  left: 50%;',
            '  z-index: 2;',
            '  border-style: solid;',
            '  border-color: ' + config.amarillo + ';',
            '  border-radius: 100%;',
            '  box-sizing: border-box;',
            '  transform-origin: 50% 100%;',
            '  animation: melmak-curva-in 1.2s cubic-bezier(0.33, 1, 0.68, 1) 0.3s both, melmak-respirar 5s ease-in-out 2s infinite;',
            '}',
            '.melmak-curva-hero__texto {',
            '  position: absolute;',
            '  top: 0;',
            '  left: 0;',
            '  z-index: 3;',
            '  pointer-events: none;',
            '  animation: melmak-texto-in 1s cubic-bezier(0.33, 1, 0.68, 1) 0.6s both;',
            '}',
            '.melmak-curva-hero__texto path { fill: none; stroke: none; }',
            '.melmak-curva-hero__texto text {',
            '  font-family: "Curda Gouda", "Goudy Old Style", Georgia, serif;',
            '  font-weight: 700;',
            '  fill: #ffffff;',
            '  stroke: #353535;',
            '  paint-order: stroke fill;',
            '}',
            '.melmak-curva-hero__cara {',
            '  position: absolute;',
            '  left: 50%;',
            '  z-index: 4;',
            '  height: auto;',
            '  transform: translateX(-50%);',
            '  transform-origin: 50% 100%;',
            '  animation: melmak-cara-cae 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both;',
            '}',
            '@keyframes melmak-curva-in {',
            '  0%   { opacity: 0; transform: translateY(-8%) scale(1.02, 1.1); }',
            '  12%  { opacity: 1; }',
            '  78%  { transform: translateY(0.6%) scale(1.03, 0.96); }',
            '  100% { opacity: 1; transform: translateY(0) scale(1, 1); }',
            '}',
            '@keyframes melmak-texto-in {',
            '  0%   { opacity: 0; transform: translateY(-4%); }',
            '  12%  { opacity: 1; }',
            '  78%  { transform: translateY(0.4%); }',
            '  100% { opacity: 1; transform: translateY(0); }',
            '}',
            '@keyframes melmak-cara-cae {',
            '  0%   { opacity: 0; transform: translateX(-50%) translateY(-120%) scale(0.9); }',
            '  25%  { opacity: 1; }',
            '  70%  { transform: translateX(-50%) translateY(4%) scale(1.02); }',
            '  100% { transform: translateX(-50%) translateY(0) scale(1); }',
            '}',
            '@keyframes melmak-respirar {',
            '  0%, 100% { transform: scale(1, 1); }',
            '  50% { transform: scale(1.01, 1.015); }',
            '}',
            '@media (prefers-reduced-motion: reduce) {',
            '  .melmak-curva-hero__anillo,',
            '  .melmak-curva-hero__texto {',
            '    animation: none; opacity: 1; transform: none;',
            '  }',
            '  .melmak-curva-hero__cara {',
            '    animation: none; opacity: 1; transform: translateX(-50%);',
            '  }',
            '}',
        ].join('\n');
        document.head.appendChild(style);

        var hero = document.createElement('section');
        hero.className = 'melmak-curva-hero';
        hero.setAttribute('aria-label', 'Bienvenida MELMAK');

        var anillo = document.createElement('div');
        anillo.className = 'melmak-curva-hero__anillo';
        hero.appendChild(anillo);

        var ns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', 'melmak-curva-hero__texto');
        svg.setAttribute('overflow', 'visible');
        var path = document.createElementNS(ns, 'path');
        path.setAttribute('id', 'melmak-texto-path');
        svg.appendChild(path);
        var texto = document.createElementNS(ns, 'text');
        var textPath = document.createElementNS(ns, 'textPath');
        textPath.setAttribute('href', '#melmak-texto-path');
        textPath.setAttribute('xlink:href', '#melmak-texto-path');
        textPath.setAttribute('startOffset', '50%');
        textPath.setAttribute('text-anchor', 'middle');
        textPath.textContent = config.texto;
        texto.appendChild(textPath);
        svg.appendChild(texto);
        hero.appendChild(svg);

        var cara = new Image();
        cara.className = 'melmak-curva-hero__cara';
        cara.src = config.caraUrl;
        cara.alt = '';
        hero.appendChild(cara);

        /* Se coloca justo después del header (logo + menú) — antes del carrusel. */
        ancla.parentNode.insertBefore(hero, ancla.nextSibling);

        function aplicar() {
            var V = hero.clientWidth;
            var esDesktop = V >= 768;

            var H = esDesktop ? 680 : 520;
            hero.style.height = H + 'px';

            var R = V;
            var T = Math.round(2 * R * (esDesktop ? 0.07 : 0.10));
            var apexY = H * (esDesktop ? 0.30 : 0.29);
            var cy = apexY + R;

            var diametro = 2 * R;
            anillo.style.width = diametro + 'px';
            anillo.style.height = diametro + 'px';
            anillo.style.marginLeft = (-R) + 'px';
            anillo.style.top = (cy - R) + 'px';
            anillo.style.borderWidth = T + 'px';
            anillo.style.transformOrigin = '50% ' + apexY + 'px';

            var rTxt = R - T / 2;
            var spanTxt = V * (esDesktop ? 0.30 : 0.28);
            var cx = V / 2;
            var y1 = cy - Math.sqrt(Math.max(rTxt * rTxt - spanTxt * spanTxt, 0));
            var fz = Math.min(V * 0.13, 160);

            svg.setAttribute('viewBox', '0 0 ' + V + ' ' + H);
            svg.style.width = V + 'px';
            svg.style.height = H + 'px';
            path.setAttribute('d',
                'M ' + (cx - spanTxt) + ' ' + y1 +
                ' A ' + rTxt + ' ' + rTxt + ' 0 0 1 ' + (cx + spanTxt) + ' ' + y1);
            texto.setAttribute('font-size', fz);
            texto.setAttribute('transform', 'translate(0,' + (0.42 * fz) + ')');
            texto.setAttribute('stroke-width', Math.max(2, fz * 0.05));

            var hCara = Math.min(V * (esDesktop ? 0.165 : 0.36), esDesktop ? 195 : 135);
            var bordeTopTexto = apexY + T / 2 + 0.42 * fz - 0.753 * fz;
            var bottomCara = bordeTopTexto - 3;
            hCara = Math.min(hCara, bottomCara - 4);
            var topCara = bottomCara - hCara;
            cara.style.height = hCara + 'px';
            cara.style.width = 'auto';
            cara.style.top = topCara + 'px';
        }

        aplicar();
        window.addEventListener('resize', aplicar);
    });
})();