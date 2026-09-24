// =============================================
// STICKERS NUEVOS v5 — Carrusel MELMAK
//
// Convierte la seccion nativa de Tiendanube
// (.block-products-feed--1339226 "STICKERS
// NUEVOS") en un carrusel MELMAK.
//
//  - Fondo amarillo #ffee26 full-bleed, titulo
//    Curda Gouda.
//  - Cajas MAS CHICAS con un margen (gutter) a
//    los costados: no tocan los bordes.
//  - CAJAS UNIFORMES SIEMPRE: cuadradas e
//    iguales; la imagen se achica (object-fit).
//  - AUTOPLAY: avanza solo; se pausa al pasar el
//    mouse por encima y se reanuda al salir.
//  - DESLIZABLE: dedo en movil y click/arrastre
//    en PC. Sin flechas de navegacion grandes.
//  - FLECHITAS indicadoras de direccion.
//  - "VER TODOS" como PILULA VINYL garantizada.
//
// Los anchos se calculan en JS (px exactos).
// =============================================
(function () {
    var ID_ROOT = 'msn-root';
    if (document.getElementById(ID_ROOT)) return;

    // =============== CONFIG (EDITAR AQUI) ================
    var CONFIG = {
        titulo: 'STICKERS NUEVOS',     // titulo de la seccion
        visibleMovil: 2,               // minimo de cards visibles en movil
        visibleDesktop: 3,             // minimo de cards visibles en PC
        maxAnchoCardMovil: 220,        // ancho maximo de cada card en movil (px)
        maxAnchoCardDesktop: 320,      // ancho maximo de cada card en PC (px)
        separacion: 16,                // separacion entre cards (px)
        gutterMovil: 14,               // margen a los costados en movil (px)
        gutterDesktop: 28,             // margen a los costados en PC (px)
        autoplayMs: 3200,              // 0 = sin autoplay
        mostrarVerTodos: true,         // boton "VER TODOS" abajo
        linkVerTodos: '/productos'
    };
    // Selector de la seccion nativa de Tiendanube.
    var SECCION = '.block-products-feed--1339226';
    // ====================================================

    // ---------------- FUENTE VINYL (Typekit) ----------------
    if (!document.getElementById('msn-typekit-vinyl')) {
        var tkv = document.createElement('link');
        tkv.id = 'msn-typekit-vinyl';
        tkv.rel = 'stylesheet';
        tkv.href = 'https://use.typekit.net/tdt2nii.css';
        document.head.appendChild(tkv);
    }

    // ---------------- ESTILOS ----------------
    var style = document.createElement('style');
    style.textContent = [
        '@font-face { font-family: \'Curda Gouda\'; src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@85a491307507245bd4b7ea4c7ec7127a02123174/Curda%20Gouda.ttf") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }',

        // Fondo amarillo full-bleed. El top (18px) es transparente para que la
        // ONDA amarilla forme el borde superior ondulado (sin linea).
        '.msn-carrusel { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; overflow: hidden; padding: 60px 0 62px; background: linear-gradient(180deg, transparent 0 18px, #ffee26 18px); }',
        '.msn-carrusel__onda { position: absolute; top: 0; left: 0; right: 0; height: 18px; pointer-events: none; background-repeat: repeat-x; background-size: 26px 18px; background-position: 0 0; animation: msn-onda 1.5s linear infinite; background-image: url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2226%22 height=%2218%22><path d=%22M0 12 Q6.5 7 13 12 T26 12 L26 18 L0 18 Z%22 fill=%22%23ffee26%22/></svg>\'); }',
        '@keyframes msn-onda { to { background-position: 26px 0; } }',

        // Encabezado centrado
        '.msn-carrusel__head { max-width: 1120px; margin: 0 auto; text-align: center; padding: 0 20px; margin-bottom: 6px; }',
        '.msn-carrusel__titulo { font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-weight: 400; text-transform: uppercase; letter-spacing: .02em; font-size: clamp(28px, 4.5vw, 42px); color: #353535; margin: 0; }',

        // Viewport: ancho completo; el gutter se maneja por transform en JS.
        // overflow-y visible para que hover/sombra NO se corten.
        '.msn-carrusel__viewport { position: relative; width: 100%; box-sizing: border-box; overflow-x: hidden; overflow-y: visible; padding: 10px 0 30px; -webkit-user-select: none; user-select: none; touch-action: pan-y; cursor: grab; }',
        '.msn-carrusel__viewport.msn-drag { cursor: grabbing; }',
        '.msn-carrusel__track { display: flex; align-items: stretch; will-change: transform; transition: transform .55s cubic-bezier(.22, .61, .36, 1); }',
        '.msn-carrusel__track.msn-no-trans { transition: none; }',

        // Cada card: el ancho se fija por JS (px).
        '.msn-carrusel .block-products-feed__product { flex: 0 0 auto; display: flex; align-items: stretch; box-sizing: border-box; margin: 0 !important; }',

        // Card (wrapper) - todas iguales
        '.msn-carrusel .block-products-feed__product-wrapper { width: 100%; display: flex; flex-direction: column; background: #ffffff; border: 3px solid #353535; border-radius: 14px; padding: 8px; box-sizing: border-box; transition: transform .3s ease, box-shadow .3s ease; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover { transform: translateY(-5px); box-shadow: 0 14px 26px rgba(53, 53, 53, .22); }',

        // Media: caja CUADRADA garantizada (padding-bottom hack) - el tamano
        // NO depende de la imagen; es la imagen la que se achica.
        '.msn-carrusel .block-products-feed__product-media { position: relative; overflow: hidden; border-radius: 10px; width: 100% !important; height: 0 !important; padding-bottom: 100% !important; max-height: none !important; background: #f2f2f2; }',
        '.msn-carrusel .block-products-feed__product-media a { display: block; position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; }',
        '.msn-carrusel .block-products-feed__product-image { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; display: block; transition: transform .3s ease; -webkit-user-drag: none; user-select: none; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover .block-products-feed__product-image { transform: scale(1.06); }',
        '.msn-carrusel__slide[data-extra-img] .block-products-feed__product-image:not(:first-of-type) { display: none !important; }',

        // Badge OFF (pilula negra)
        '.msn-carrusel .block-products-feed__product-offer { position: absolute; top: 8px; left: 8px; z-index: 2; background-color: #353535 !important; color: #fff !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; border-radius: 100px; padding: 4px 9px; }',

        // Cuerpo: info + boton SIEMPRE visibles (altura fija por JS)
        '.msn-carrusel__body { display: flex !important; flex-direction: column; justify-content: center; overflow: hidden; margin: 0 !important; }',
        '.msn-carrusel .block-products-feed__product-info { display: flex !important; flex-direction: column; justify-content: center; padding: 0 2px; box-sizing: border-box; }',
        '.msn-carrusel .block-products-feed__product-name { font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; line-height: 1.2; color: #353535; margin: 8px 0 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }',
        '.msn-carrusel .block-products-feed__product-name a { color: #353535; text-decoration: none; }',
        '.msn-carrusel .block-products-feed__product-price { font-size: 13px; color: #353535; margin: 1px 0; }',
        '.msn-carrusel .block-products-feed__product-price del { color: #999; margin-left: 4px; font-size: 11px; }',
        '.msn-carrusel .block-products-feed__product-additional { font-size: 11px; color: #353535; margin: 3px 0 0; text-transform: uppercase; letter-spacing: .02em; }',
        '.msn-carrusel .block-products-feed__product-buttons { display: flex !important; justify-content: center; margin-top: auto; padding-top: 8px; opacity: 1 !important; visibility: visible !important; transform: none !important; pointer-events: auto; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy { display: inline-block !important; opacity: 1 !important; visibility: visible !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff !important; background-color: #353535 !important; border: 2px solid #353535 !important; border-radius: 100px; padding: 8px 18px; transition: all .2s ease; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:hover { background-color: #ffffff !important; color: #353535 !important; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:active { transform: scale(.95); }',

        // FLECHITAS indicadoras (pequenas)
        '.msn-carrusel__flecha { position: absolute; top: 50%; margin-top: -22px; z-index: 5; width: 44px; height: 44px; border-radius: 50%; border: 3px solid #353535; background-color: rgba(255,255,255,.92); color: #353535; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__flecha svg { width: 18px; height: 18px; }',
        '.msn-carrusel__flecha:hover { background-color: #353535; color: #fff; }',
        '.msn-carrusel__flecha:active { transform: scale(.92); }',
        '.msn-carrusel__flecha--prev { left: 6px; }',
        '.msn-carrusel__flecha--next { right: 6px; }',

        // VER TODOS (pilula VINYL garantizada)
        '.msn-carrusel__mas { display: flex; justify-content: center; margin-top: 18px; }',
        '.msn-carrusel__mas a { display: inline-flex !important; align-items: center; gap: 10px; font-family: \'vinyl\' !important; font-size: 17px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff !important; background-color: #353535 !important; border: 3px solid #353535 !important; border-radius: 100px; padding: 12px 28px; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__mas a, .msn-carrusel__mas a * { font-family: \'vinyl\' !important; color: #fff !important; }',
        '.msn-carrusel__mas a:hover { background-color: #fff !important; color: #353535 !important; transform: scale(1.04); }',
        '.msn-carrusel__mas a:hover * { color: #353535 !important; }',
        '.msn-carrusel__mas svg { width: 22px; height: 22px; }',

        // Movil
        '@media (max-width: 639px) {',
        '  .msn-carrusel { padding: 46px 0 50px; }',
        '  .msn-carrusel .block-products-feed__product-info { min-height: 84px; }',
        '  .msn-carrusel .block-products-feed__product-name { font-size: 12px; }',
        '  .msn-carrusel .block-products-feed__product-buttons-buy { font-size: 12px; padding: 7px 14px; }',
        '  .msn-carrusel__flecha { width: 36px; height: 36px; margin-top: -18px; border-width: 2px; }',
        '  .msn-carrusel__flecha svg { width: 15px; height: 15px; }',
        '  .msn-carrusel__flecha--prev { left: 4px; }',
        '  .msn-carrusel__flecha--next { right: 4px; }',
        '  .msn-carrusel__mas a { font-size: 15px; padding: 10px 22px; }',
        '}',
        '@media (prefers-reduced-motion: reduce) {',
        '  .msn-carrusel__track { transition: none; }',
        '  .msn-carrusel .block-products-feed__product-wrapper:hover { transform: none; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    // ---------------- LOGICA ----------------
    function montar() {
        var sec = document.querySelector(SECCION);
        if (!sec) { setTimeout(montar, 300); return; }
        if (sec.getAttribute('data-msn') === '1') return;
        if (document.getElementById(ID_ROOT)) return;
        sec.setAttribute('data-msn', '1');

        var caja = sec.querySelector('.block-products-feed__container');
        var grilla = sec.querySelector('.block-products-feed__products');
        var productos = grilla ? Array.prototype.slice.call(grilla.querySelectorAll('.block-products-feed__product')) : [];
        if (!productos.length) return;

        if (caja) caja.style.display = 'none';
        sec.style.display = 'none';

        // Limpio clases de grilla y dejo UNA sola imagen por card con estructura
        // simple (media > a > img). Asi los productos con varias fotos tambien
        // se ven y TODAS las cajas quedan iguales.
        productos.forEach(function (p) {
            p.className = p.className.replace(/\buk-width[^\s]*/g, '').replace(/\s+/g, ' ').trim();
            p.classList.add('msn-carrusel__slide');

            var media = p.querySelector('.block-products-feed__product-media');
            if (!media) return;

            var firstImg = media.querySelector('img');
            var firstA = media.querySelector('a');
            var href = firstA ? firstA.getAttribute('href') : null;
            var offer = media.querySelector('[class*="product-offer"]');

            if (firstImg) {
                if (firstImg.hasAttribute('data-srcset') && !firstImg.hasAttribute('srcset')) {
                    firstImg.setAttribute('srcset', firstImg.getAttribute('data-srcset'));
                }
                if (firstImg.hasAttribute('data-sizes') && !firstImg.hasAttribute('sizes')) {
                    firstImg.setAttribute('sizes', firstImg.getAttribute('data-sizes'));
                }
                if (!firstImg.getAttribute('src') && firstImg.hasAttribute('data-src')) {
                    firstImg.setAttribute('src', firstImg.getAttribute('data-src'));
                }
                firstImg.removeAttribute('data-src');
                firstImg.removeAttribute('data-srcset');
                firstImg.removeAttribute('data-sizes');
                firstImg.setAttribute('class', 'block-products-feed__product-image');
                firstImg.setAttribute('loading', 'lazy');
            }

            // Reconstruyo el media: una sola imagen dentro de un <a>
            media.innerHTML = '';
            var newA = document.createElement('a');
            newA.className = 'block-products-feed__product-link';
            if (href) newA.setAttribute('href', href);
            if (firstImg) newA.appendChild(firstImg);
            if (offer) newA.appendChild(offer);
            media.appendChild(newA);

            // Marco el cuerpo (info + boton) para poder fijarle la altura.
            var info = p.querySelector('.block-products-feed__product-info');
            if (info && info.parentNode) info.parentNode.classList.add('msn-carrusel__body');
        });

        // ----- DOM -----
        var root = document.createElement('div');
        root.id = ID_ROOT;
        root.className = 'msn-carrusel';

        var onda = document.createElement('div');
        onda.className = 'msn-carrusel__onda';
        root.appendChild(onda);

        var head = document.createElement('div');
        head.className = 'msn-carrusel__head';
        var h2 = document.createElement('h2');
        h2.className = 'msn-carrusel__titulo';
        h2.textContent = CONFIG.titulo;
        head.appendChild(h2);
        root.appendChild(head);

        var viewport = document.createElement('div');
        viewport.className = 'msn-carrusel__viewport';
        var track = document.createElement('div');
        track.className = 'msn-carrusel__track';
        for (var k = 0; k < productos.length; k++) track.appendChild(productos[k]);
        viewport.appendChild(track);

        // FLECHITAS
        function flecha(dir) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'msn-carrusel__flecha msn-carrusel__flecha--' + dir;
            b.setAttribute('aria-label', dir === 'prev' ? 'Anterior' : 'Siguiente');
            b.innerHTML = dir === 'prev'
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 5 8 12 15 19"></polyline></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 5 16 12 9 19"></polyline></svg>';
            return b;
        }
        var prev = flecha('prev');
        var next = flecha('next');
        viewport.appendChild(prev);
        viewport.appendChild(next);
        root.appendChild(viewport);

        if (CONFIG.mostrarVerTodos) {
            var mas = document.createElement('div');
            mas.className = 'msn-carrusel__mas';
            var a = document.createElement('a');
            a.href = CONFIG.linkVerTodos;
            a.innerHTML = '<span>VER TODOS</span>'
                + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="12" x2="20" y2="12"></line><polyline points="12 4 20 12 12 20"></polyline></svg>';
            mas.appendChild(a);
            root.appendChild(mas);
        }

        sec.parentNode.insertBefore(root, sec.nextSibling);

        // ----- Bucle INFINITO (clones) -----
        var N0 = productos.length;
        for (var c = 0; c < N0; c++) {
            track.appendChild(productos[c].cloneNode(true));
        }

        // ----- Carrusel -----
        var indice = 0;
        var paso = 0;
        var gutterActual = 0;
        var cardW = 0;

        function esMovil() { return window.innerWidth < 640; }
        function gutter() { return esMovil() ? CONFIG.gutterMovil : CONFIG.gutterDesktop; }
        function maxCard() { return esMovil() ? CONFIG.maxAnchoCardMovil : CONFIG.maxAnchoCardDesktop; }
        function minVis() { return esMovil() ? CONFIG.visibleMovil : CONFIG.visibleDesktop; }

        function calcularPer(contentW) {
            var gap = CONFIG.separacion;
            var p = Math.ceil((contentW + gap) / (maxCard() + gap));
            return Math.max(minVis(), p);
        }

        function maxIndice() {
            if (N0 <= minVis()) return 0;
            return N0;
        }

        function medir() {
            var vw = window.innerWidth;
            var g = gutter();
            var gap = CONFIG.separacion;
            var contentW = vw - 2 * g;
            var p = calcularPer(contentW);
            cardW = (contentW - (p - 1) * gap) / p;
            gutterActual = g;

            // Alturas DETERMINISTAS: imagen cuadrada (cardW - 22) + cuerpo fijo.
            // Asi todas las cajas miden exactamente lo mismo y quedan alineadas.
            var bodyH = esMovil() ? 112 : 120;
            var cardH = cardW + bodyH;

            track.style.gap = gap + 'px';
            var cards = track.children;
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.width = cardW + 'px';
                cards[i].style.height = cardH + 'px';
                var bodyEl = cards[i].querySelector('.msn-carrusel__body');
                if (bodyEl) bodyEl.style.height = bodyH + 'px';
            }

            paso = cardW + gap;
            indice = Math.max(0, Math.min(maxIndice(), indice));
            aplicar(true);
        }

        function aplicar(instant) {
            if (instant) track.style.transition = 'none';
            track.style.transform = 'translateX(' + (gutterActual - indice * paso) + 'px)';
            if (instant) {
                void track.offsetWidth;
                track.style.transition = '';
            }
        }

        function ir(i, instant) {
            indice = Math.max(0, Math.min(maxIndice(), i));
            aplicar(instant);
        }

        function sig() {
            if (maxIndice() === 0) return;
            if (indice >= N0) ir(0, true);   // N0 se ve igual que 0 => salto invisible
            else ir(indice + 1);
        }
        function ant() {
            if (maxIndice() === 0) return;
            if (indice <= 0) {
                ir(N0, true);                // salto invisible: N0 se ve igual que 0
                void track.offsetWidth;
                ir(N0 - 1);                  // anima hacia atras (entra la ultima card)
            } else {
                ir(indice - 1);
            }
        }

        prev.addEventListener('click', ant);
        next.addEventListener('click', sig);

        // ----- ARRASTRE / SWIPE -----
        var arrastrando = false;
        var arrX = 0, arrBase = 0, arrDx = 0, arrDxPrev = 0, arrT = 0, vel = 0;
        var bloqueaClick = false;

        viewport.addEventListener('pointerdown', function (e) {
            if (e.target.closest('.msn-carrusel__flecha')) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            arrastrando = true;
            arrX = e.clientX;
            arrBase = gutterActual - indice * paso;
            arrDx = 0; arrDxPrev = 0; vel = 0; arrT = 0;
            track.classList.add('msn-no-trans');
            viewport.classList.add('msn-drag');
            try { viewport.setPointerCapture(e.pointerId); } catch (err) { }
        });

        viewport.addEventListener('pointermove', function (e) {
            if (!arrastrando) return;
            var dx = e.clientX - arrX;
            var ahora = Date.now();
            if (arrT) {
                var dt = ahora - arrT;
                if (dt > 0) vel = (dx - arrDxPrev) / dt;
            }
            arrDxPrev = dx;
            arrT = ahora;
            arrDx = dx;
            track.style.transform = 'translateX(' + (arrBase + dx) + 'px)';
        });

        function soltar() {
            if (!arrastrando) return;
            arrastrando = false;
            track.classList.remove('msn-no-trans');
            viewport.classList.remove('msn-drag');

            var dist = Math.abs(arrDx);
            var flotante = (gutterActual - (arrBase + arrDx)) / paso;
            var objetivo = Math.round(flotante);
            if (Math.abs(vel) > .35) objetivo += Math.round(vel * 250 / paso);
            objetivo = Math.max(0, Math.min(maxIndice(), objetivo));
            ir(objetivo);
            if (dist > 5) bloqueaClick = true;
        }
        viewport.addEventListener('pointerup', soltar);
        viewport.addEventListener('pointercancel', soltar);

        viewport.addEventListener('click', function (e) {
            if (bloqueaClick) {
                e.preventDefault();
                e.stopPropagation();
                bloqueaClick = false;
            }
        }, true);

        // ----- AUTOPLAY (se pausa al hover / touch) -----
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var timer = null;
        function play() {
            if (reduce || !CONFIG.autoplayMs || maxIndice() === 0) return;
            stop();
            timer = setInterval(sig, CONFIG.autoplayMs);
        }
        function stop() {
            if (timer) { clearInterval(timer); timer = null; }
        }
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', play);
        window.addEventListener('touchstart', stop, { passive: true });
        window.addEventListener('touchend', play, { passive: true });

        medir();
        play();
        window.addEventListener('resize', function () { medir(); });

        var imgs = root.querySelectorAll('img');
        for (var m = 0; m < imgs.length; m++) {
            if (imgs[m].complete) continue;
            imgs[m].addEventListener('load', medir);
        }
    }

    montar();
})();
