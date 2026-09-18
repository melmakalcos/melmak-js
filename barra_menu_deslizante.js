/* =========================================================
   MELMAK — HERO "curva arcoíris + MELMAK + personaje"  (V2 fix)
   =========================================================
   APARICIÓN DE MELMAK (como pediste):
   1) MELMAK arranca INVISIBLE, "afuera" por el borde IZQUIERDO
      (el arco es parte de un CÍRCULO COMPLETO que continúa fuera
      de la web) y se desliza por la curva hacia el centro.
   2) NO frena en el medio: pasa de largo y sale COMPLETO por el
      lado DERECHO de la pantalla (simulando que el círculo sigue
      girando y lo lleva fuera).
   3) Hace una breve pausa fuera (derecha).
   4) REINGRESA desde la derecha y frena en el centro con un
      pequeño resbale: se pasa un poquito de largo y luego se
      ubica en la corona.
   · Nunca se usa startOffset negativo: el path se EXTENDIÓ para
     seguir el mismo círculo fuera de la página por ambos lados, y
     el texto se desliza dentro de offsets ≥ 0 → Blink NO proyecta
     letras hacia atrás, así no se ve "AK" al arrancar ni se
     deforma nada.
   · Espera a que cargue la fuente "Curda Gouda" para medir bien.
   · Resto igual (arco amarillo con sombra plena, kerning M-E,
     personaje que cae, respirar, responsive, solo portada).
   ========================================================= */

(function () {
    'use strict';

    var SOLO_INICIO = true;

    function listo(fn) {
        if (document.readyState !== 'loading') { setTimeout(fn, 0); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    listo(function () {
        var esLocal = location.protocol === 'file:' ||
            location.hostname === 'localhost' ||
            location.hostname === '127.0.0.1';
        if (SOLO_INICIO && !esLocal) {
            var ruta = location.pathname.replace(/\/+$/, '');
            if (ruta !== '') return;   // solo portada
        }

        var ancla = document.querySelector('.header-menu');
        if (!ancla) ancla = { parentNode: document.body, nextSibling: document.body.firstChild };
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
            '}',
            '.melmak-curva-hero__texto path { fill: none; stroke: none; }',
            '.melmak-curva-hero__texto text {',
            '  font-family: "Curda Gouda", "Goudy Old Style", Georgia, serif;',
            '  font-weight: 700;',
            '  fill: #ffffff;',
            '  stroke: #353535;',
            '  paint-order: stroke fill;',
            '}',
            '.melmak-curva-hero__texto text.mel-secondary__sombra { fill: #353535; stroke: none; }',
            '.melmak-curva-hero__cara {',
            '  position: absolute;',
            '  left: 50%;',
            '  z-index: 4;',
            '  height: auto;',
            '  transform: translateX(-50%);',
            '  transform-origin: 50% 100%;',
            '  animation: melmak-cara-cae 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both;',
            '}',
            '.melmak-curva-hero__burst {',
            '  position: absolute;',
            '  left: 50%;',
            '  z-index: 2;',
            '  opacity: 0;',
            '  transform: translateX(-50%) scale(0);',
            '  transform-origin: 50% 50%;',
            '}',
            '.melmak-curva-hero__burst--visible {',
            '  animation: melmak-burst-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;',
            '}',
            '.melmak-curva-hero__burst__shape {',
            '  position: absolute;',
            '  top: 0;',
            '  left: 0;',
            '  width: 100%;',
            '  height: 100%;',
            '  background-color: ' + config.amarillo + ';',
            '  filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, 0.8));',
            '  animation: melmak-burst-spin 12s linear infinite;',
            '}',
            '@keyframes melmak-burst-in {',
            '  0% { opacity: 0; transform: translateX(-50%) scale(0.2) rotate(-12deg); }',
            '  60% { opacity: 1; transform: translateX(-50%) scale(1.08) rotate(3deg); }',
            '  100% { opacity: 1; transform: translateX(-50%) scale(1) rotate(0deg); }',
            '}',
            '@keyframes melmak-burst-spin {',
            '  from { transform: rotate(0deg); }',
            '  to { transform: rotate(360deg); }',
            '}',
            '@keyframes melmak-curva-in {',
            '  0%   { opacity: 0; transform: translateY(-8%) scale(1.02, 1.1); }',
            '  12%  { opacity: 1; }',
            '  78%  { transform: translateY(0.6%) scale(1.03, 0.96); }',
            '  100% { opacity: 1; transform: translateY(0) scale(1, 1); }',
            '}',
            '@keyframes melmak-respirar {',
            '  0%, 100% { transform: scale(1, 1); }',
            '  50% { transform: scale(1.025, 1.04); }',
            '}',
            '@keyframes melmak-cara-cae {',
            '  0%   { opacity: 0; transform: translateX(-50%) translateY(-120%) scale(0.9); }',
            '  25%  { opacity: 1; }',
            '  70%  { transform: translateX(-50%) translateY(4%) scale(1.02); }',
            '  100% { transform: translateX(-50%) translateY(0) scale(1); }',
            '}',
            '@media (prefers-reduced-motion: reduce) {',
            '  .melmak-curva-hero__anillo,',
            '  .melmak-curva-hero__texto {',
            '    animation: none; opacity: 1; transform: none;',
            '  }',
            '  .melmak-curva-hero__cara {',
            '    animation: none; opacity: 1; transform: translateX(-50%);',
            '  }',
            '  .melmak-curva-hero__burst {',
            '    animation: none; opacity: 1; transform: translateX(-50%) scale(1);',
            '  }',
            '  .melmak-curva-hero__burst__shape {',
            '    animation: none;',
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
        hero.appendChild(svg);

        var cara = new Image();
        cara.className = 'melmak-curva-hero__cara';
        cara.src = config.caraUrl;
        cara.alt = '';
        hero.appendChild(cara);

        function generarClipPath(picos, radioExt, radioInt) {
            var pts = [];
            var total = picos * 2;
            var paso = 360 / total;
            for (var i = 0; i < total; i++) {
                var ang = (i * paso - 90) * Math.PI / 180;
                var r = (i % 2 === 0) ? radioExt : radioInt;
                var x = 50 + r * Math.cos(ang);
                var y = 50 + r * Math.sin(ang);
                pts.push((Math.round(x * 100) / 100) + '% ' + (Math.round(y * 100) / 100) + '%');
            }
            return 'polygon(' + pts.join(', ') + ')';
        }

        var burst = document.createElement('div');
        burst.className = 'melmak-curva-hero__burst';
        var burstShape = document.createElement('div');
        burstShape.className = 'melmak-curva-hero__burst__shape';
        var clipPicos = generarClipPath(16, 50, 33);
        burstShape.style.clipPath = clipPicos;
        burstShape.style.webkitClipPath = clipPicos;
        burst.appendChild(burstShape);
        hero.insertBefore(burst, cara);

        /* Se coloca justo después del header (logo + menú). */
        ancla.parentNode.insertBefore(hero, ancla.nextSibling);

        function crearTextPath(txt, anchor) {
            var tp = document.createElementNS(ns, 'textPath');
            tp.setAttribute('href', '#melmak-texto-path');
            tp.setAttribute('xlink:href', '#melmak-texto-path');
            tp.setAttribute('text-anchor', anchor);
            tp.textContent = txt;
            return tp;
        }

        function crearLinea(txt, anchor) {
            var t = document.createElementNS(ns, 'text');
            t.appendChild(crearTextPath(txt, anchor));
            svg.appendChild(t);
            return t;
        }

        var sombraM = crearLinea('M', 'middle');
        var sombraR = crearLinea(config.texto.slice(1), 'start');
        sombraM.setAttribute('class', 'mel-secondary__sombra');
        sombraR.setAttribute('class', 'mel-secondary__sombra');
        var textoM = crearLinea('M', 'middle');
        var textoR = crearLinea(config.texto.slice(1), 'start');
        svg.style.position = 'absolute';

        function medirAncho(txt, fz) {
            var t = document.createElementNS(ns, 'text');
            t.setAttribute('font-size', fz);
            t.textContent = txt;
            svg.appendChild(t);
            var w = 0;
            try { w = t.getComputedTextLength() || 0; } catch (e) { w = 0; }
            svg.removeChild(t);
            return w;
        }

        var tpH = [textoM, textoR, sombraM, sombraR].map(function (t) {
            return t.querySelector('textPath');
        });

        var runAnim = 0;

        var burstMostrado = false;
        function mostrarBurst() {
            if (burstMostrado) return;
            burstMostrado = true;
            burst.classList.add('melmak-curva-hero__burst--visible');
        }

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

            /* -- Path EXTENDIDO: mismo círculo, sigue fuera de la página por
                  ambos lados. Recorre el semicírculo superior completo:
                  de (cx-rTxt, cy) a (cx+rTxt, cy) pasando por la corona. -- */
            var rTxt = R - T / 2;
            var cx = V / 2;
            var fz = Math.min(V * 0.13, 160);

            svg.setAttribute('viewBox', '0 0 ' + V + ' ' + H);
            svg.style.width = V + 'px';
            svg.style.height = H + 'px';

            var xL = cx - rTxt;
            var xR = cx + rTxt;
            path.setAttribute('d',
                'M ' + xL + ' ' + cy +
                ' A ' + rTxt + ' ' + rTxt + ' 0 0 1 ' + xR + ' ' + cy);

            [textoM, textoR].forEach(function (t) {
                t.setAttribute('font-size', fz);
                t.setAttribute('transform', 'translate(0,' + (0.42 * fz) + ')');
                t.setAttribute('stroke-width', Math.max(2, fz * 0.05));
            });
            [sombraM, sombraR].forEach(function (t) {
                t.setAttribute('font-size', fz);
                t.setAttribute('transform', 'translate(0,' + (0.42 * fz + 7) + ')');
            });

            var L = path.getTotalLength() || 1;
            var mAdv = medirAncho('M', fz);
            var rAdv = medirAncho(config.texto.slice(1), fz);
            var k = 0.025 * fz;                      // kerning M-E
            var S0 = (L - mAdv - rAdv) / 2;          // M empieza acá (centrado)
            var cm = S0 + mAdv / 2 + k / 2;          // centro del path donde va la M
            var sr = S0 + mAdv - k;                  // arranque de "ELMAK"
            var WcF = (cm + (sr + rAdv)) / 2;        // centro "real" de la palabra
            var wordWidth = mAdv + rAdv;

            /* Permanecemos dentro de offsets ≥ 0 y ≤ L. Buscamos dónde queda la
               palabra COMPLETA fuera de pantalla (izquierda y derecha). */
            var m = 2000;
            var WcL = 0, WcR = L;
            function px(s) { try { return path.getPointAtLength(s).x; } catch (e) { return -1e9; } }
            for (var i = 0; i <= m; i++) {
                var s = L * i / m;
                var x = px(s);
                if (x + wordWidth / 2 <= V * 0.02) WcL = s;
            }
            for (var j = 0; j <= m; j++) {
                var s2 = L * j / m;
                if (px(s2) - wordWidth / 2 >= V * (1 - 0.02)) { WcR = s2; break; }
            }
            if (WcR < WcL) WcR = L;

            function setPos(Wc) {
                var delta = Wc - WcF;
                var cmP = (cm + delta) / L * 100;
                var srP = (sr + delta) / L * 100;
                tpH[0].setAttribute('startOffset', cmP + '%');
                tpH[1].setAttribute('startOffset', srP + '%');
                tpH[2].setAttribute('startOffset', cmP + '%');
                tpH[3].setAttribute('startOffset', srP + '%');

                /* Compuerta: invisible hasta que el borde izquierdo entra. */
                var head = px(Wc) - wordWidth / 2;
                svg.style.opacity = head <= 0 ? '0' : String(Math.min(1, head / (V * 0.05)));
            }

            /* ---------- Animación de aparición (timeline con setTimeout) ---------- */
            var id = ++runAnim;
            var reduce = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduce) {
                setPos(WcF);
                svg.style.opacity = '1';
                mostrarBurst();
            } else {
                function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
                function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

                /* Fase A: entra por izquierda, pasa y sale COMPLETO por derecha */
                var easeA = easeInOut;
                /* Fase B: pausa fuera (derecha) */
                /* Fase C: vuelta con freno + resbale suave en el centro */
                var overPx = V * 0.04;
                var delayA = 350, durA = 1700, holdB = 420, durC = 1300;

                setPos(WcL);
                svg.style.opacity = '0';

                var t0 = null;
                function paso() {
                    if (id !== runAnim) return;
                    if (t0 === null) t0 = performance.now();
                    var d = performance.now() - t0;

                    if (d < delayA) { setTimeout(paso, 17); return; }

                    var uA = (d - delayA) / durA;
                    if (uA < 1) {
                        var wcA = WcL + (WcR - WcL) * easeA(uA);
                        setPos(wcA);
                        setTimeout(paso, 17);
                        return;
                    }

                    var d2 = d - delayA - durA;
                    if (d2 < holdB) {            // pausa fuera (derecha)
                        setPos(WcR);
                        svg.style.opacity = '1';
                        setTimeout(paso, 17);
                        return;
                    }

                    var uC = (d2 - holdB) / durC;
                    if (uC < 1) {
                        var wcC;
                        var principal = WcR + (WcF - WcR) * easeOutCubic(Math.min(uC / 0.85, 1));
                        var v = (uC - 0.85) / 0.15;
                        var resbale = 0;
                        if (v > 0) {
                            v = Math.min(v, 1);
                            resbale = -Math.max(0, overPx) * Math.sin(Math.PI * v) * 0.5;
                        }
                        wcC = principal + resbale;
                        wcC = Math.max(WcF - overPx, wcC);
                        setPos(wcC);
                        svg.style.opacity = '1';
                        setTimeout(paso, 17);
                        return;
                    }

                    setPos(WcF);                 // asentado en la corona
                    svg.style.opacity = '1';
                    mostrarBurst();
                }

                setTimeout(paso, 17);
            }
        }

        aplicar();
        window.addEventListener('resize', aplicar);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                if (hero.isConnected) aplicar();
            });
        }

        /* Personaje */
        function posicionarCara() {
            var V = hero.clientWidth;
            var esDesktop = V >= 768;
            var H = esDesktop ? 680 : 520;
            var R = V;
            var T = Math.round(2 * R * (esDesktop ? 0.07 : 0.10));
            var apexY = H * (esDesktop ? 0.30 : 0.29);
            var fz = Math.min(V * 0.13, 160);
            var bordeTopTexto = apexY + T / 2 + 0.42 * fz - 0.753 * fz;
            var bottomCara = bordeTopTexto - 3;
            var hCara = Math.min(V * (esDesktop ? 0.165 : 0.36), esDesktop ? 195 : 135);
            hCara = Math.min(hCara, bottomCara - 4);
            var topCara = bottomCara - hCara;
            cara.style.height = hCara + 'px';
            cara.style.width = 'auto';
            cara.style.top = topCara + 'px';
        }

        function posicionarBurst() {
            var hCara = parseFloat(cara.style.height) || 120;
            var topCara = parseFloat(cara.style.top) || 0;
            var bottomCara = topCara + hCara;
            var hBurst = Math.max(hCara * 1.85, 200);
            var top = topCara + hCara * 0.72 - hBurst * 0.5;
            var clipBottom = Math.max(0, (top + hBurst) - bottomCara);
            burst.style.width = hBurst + 'px';
            burst.style.height = hBurst + 'px';
            burst.style.top = top + 'px';
            burst.style.clipPath = clipBottom > 0 ? 'inset(0 0 ' + clipBottom + 'px 0)' : '';
            burst.style.webkitClipPath = burst.style.clipPath;
        }
        posicionarCara();
        posicionarBurst();
        window.addEventListener('resize', function () {
            posicionarCara();
            posicionarBurst();
        });
    });
})();
