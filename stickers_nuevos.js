// =============================================
// STICKERS NUEVOS v3 — Carrusel
// =============================================
(function () {
    var ID_ROOT = 'msn-root';
    if (document.getElementById(ID_ROOT)) return;

    // =============== CONFIG (EDITAR AQUI) ================
    var CONFIG = {
        titulo: 'STICKERS NUEVOS',   // titulo de la seccion
        visiblesDesktop: 3,          // visibles en PC
        visiblesMovil: 2,            // visibles en movil
        separacion: 14,              // separacion entre cards (px)
        autoplayMs: 0,               // 0 = sin autoplay (solo swipe)
        mostrarVerTodos: true,       // boton "VER TODOS" abajo
        linkVerTodos: '/productos'
    };
    // Selector de la seccion nativa de Tiendanube.
    var SECCION = '.block-products-feed--1339226';
    // ====================================================

    // ---------------- ESTILOS ----------------
    var style = document.createElement('style');
    style.textContent = [
        '@font-face { font-family: \'Curda Gouda\'; src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@85a491307507245bd4b7ea4c7ec7127a02123174/Curda%20Gouda.ttf") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }',

        // Seguro global: font-vinyl cargada por el tema; aca la referencio por gusto.
        // Fondo amarillo full-bleed
        '.msn-carrusel { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; overflow: hidden; padding: 60px 0 62px; background-color: #ffee26; }',

        // Encabezado (contenido centrado, separado de los bordes)
        '.msn-carrusel__head { max-width: 1120px; margin: 0 auto; text-align: center; padding: 0 20px; margin-bottom: 26px; }',
        '.msn-carrusel__titulo { font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-weight: 400; text-transform: uppercase; letter-spacing: .02em; font-size: clamp(28px, 4.5vw, 42px); color: #353535; margin: 0; }',

        // Viewport AL FILO: sin gutters laterales ni flechas, swiping tipo galeria.
        // Overflow vertical visible => hover/sombras NO se cortan con franjas.
        '.msn-carrusel__viewport { position: relative; width: 100%; box-sizing: border-box; overflow-x: hidden; overflow-y: visible; padding: 22px 0 30px; --msn-per: 3; --msn-gap: 14px; -webkit-user-select: none; user-select: none; touch-action: pan-y; cursor: grab; }',
        '.msn-carrusel__viewport.msn-drag { cursor: grabbing; }',
        '.msn-carrusel__track { display: flex; gap: var(--msn-gap, 14px); will-change: transform; transition: transform .55s cubic-bezier(.22, .61, .36, 1); }',
        '.msn-carrusel__track.msn-no-trans { transition: none; }',
        '.msn-carrusel .block-products-feed__product { flex: 0 0 auto; display: flex; width: calc((100% - (var(--msn-per, 3) - 1) * var(--msn-gap, 14px)) / var(--msn-per, 3)); box-sizing: border-box; }',

        // Card (wrapper) - todas iguales
        '.msn-carrusel .block-products-feed__product-wrapper { height: 100%; display: flex; flex-direction: column; border: 3px solid #353535; border-radius: 12px; background: #fff; box-shadow: 0 2px 0 rgba(53,53,53,.14); overflow: hidden; }',

        // Media: caja cuadrada FIJA (el tamano de la caja NO depende de la imagen)
        '.msn-carrusel .block-products-feed__product-media { position: relative; overflow: hidden; aspect-ratio: 1 / 1 !important; width: 100% !important; height: auto !important; max-height: none !important; background: #f2f2f2; }',
        '.msn-carrusel .block-products-feed__product-media a { display: block; position: relative; width: 100%; height: 100%; }',
        '.msn-carrusel .block-products-feed__product-image { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; display: block; transition: transform .3s ease; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover .block-products-feed__product-image { transform: scale(1.06); }',
        '.msn-carrusel__slide[data-extra-img] .block-products-feed__product-image:not(:first-of-type) { display: none !important; }',

        // Badge OFF (pilula negra)
        '.msn-carrusel .block-products-feed__product-offer { position: absolute; top: 8px; left: 8px; z-index: 2; background-color: #353535 !important; color: #fff !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; border-radius: 100px; padding: 4px 9px; }',

        // Cuerpo de la card: info + boton SIEMPRE visibles, uniformes
        '.msn-carrusel .block-products-feed__product-info { display: flex !important; flex-direction: column; justify-content: center; flex: 1 1 auto; min-height: 96px; padding: 0 2px; box-sizing: border-box; }',
        '.msn-carrusel .block-products-feed__product-name { font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; line-height: 1.2; color: #353535; margin: 8px 0 3px; }',
        '.msn-carrusel .block-products-feed__product-name a { color: #353535; text-decoration: none; }',
        '.msn-carrusel .block-products-feed__product-price { font-size: 13px; color: #353535; margin: 1px 0; }',
        '.msn-carrusel .block-products-feed__product-price del { color: #999; margin-left: 4px; font-size: 11px; }',
        '.msn-carrusel .block-products-feed__product-buttons { display: flex !important; justify-content: center; margin-top: auto; padding-top: 8px; opacity: 1 !important; visibility: visible !important; transform: none !important; pointer-events: auto; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy { display: inline-block !important; opacity: 1 !important; visibility: visible !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff !important; background-color: #353535 !important; border: 2px solid #353535 !important; border-radius: 100px; padding: 8px 18px; transition: all .2s ease; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:hover { background-color: #fff !important; color: #353535 !important; }',

        // VER TODOS (pilula VINYL - garantizada con !important)
        '.msn-carrusel__mas { display: flex; justify-content: center; margin-top: 24px; }',
        '.msn-carrusel__mas a { display: inline-flex; align-items: center; gap: 10px; font-family: \'vinyl\' !important; font-size: 17px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff; background-color: #353535; border: 3px solid #353535; border-radius: 100px; padding: 12px 28px; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__mas a:hover { background-color: #fff; color: #353535; transform: scale(1.04); }',
        '.msn-carrusel__mas svg { width: 22px; height: 22px; }',

        // Movil
        '@media (max-width: 639px) {',
        '  .msn-carrusel { padding: 46px 0 50px; }',
        '  .msn-carrusel__body { min-height: 84px; }',
        '  .msn-carrusel .block-products-feed__product-name { font-size: 12px; }',
        '  .msn-carrusel .block-products-feed__product-buttons-buy { font-size: 12px; padding: 7px 14px; }',
        '  .msn-carrusel__mas a { font-size: 15px; padding: 10px 22px; }',
        '}',
        '@media (prefers-reduced-motion: reduce) {',
        '  .msn-carrusel__track { transition: none; }',
        '  .msn-carrusel__track.msn-no-trans { transition: none; }',
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

        // La seccion original queda desactivada
        if (caja) caja.style.display = 'none';
        sec.style.display = 'none';

        // Limpio clases de grilla, fuerzo imagenes y dejo UNA sola foto por card
        var conSrc = [];
        productos.forEach(function (p) {
            p.className = p.className.replace(/\buk-width[^\s]*/g, '').replace(/\s+/g, ' ').trim();
            p.classList.add('msn-carrusel__slide');

            var imgs = p.querySelectorAll('img');
            for (var i = 0; i < imgs.length; i++) {
                var ig = imgs[i];
                // Copio atributos lazy del tema (data-src / data-srcset / data-sizes)
                if (ig.hasAttribute('data-srcset') && !ig.hasAttribute('srcset')) {
                    ig.setAttribute('srcset', ig.getAttribute('data-srcset'));
                }
                if (ig.hasAttribute('data-sizes') && !ig.hasAttribute('sizes')) {
                    ig.setAttribute('sizes', ig.getAttribute('data-sizes'));
                }
                if (!ig.getAttribute('src') && ig.hasAttribute('data-src')) {
                    ig.setAttribute('src', ig.getAttribute('data-src'));
                }
                ig.removeAttribute('data-src');
                ig.removeAttribute('data-srcset');
                ig.removeAttribute('data-sizes');
                // Dejo SOLO la clase que usa el carrusel (saco clases lazy del tema)
                ig.setAttribute('class', 'block-products-feed__product-image');
                ig.setAttribute('loading', 'lazy');
                conSrc.push(ig);
            }
            // Si la primera quedo sin src (placeholder lazy), copio el src de la primera que tenga
            var primera = conSrc[0];
            if (primera && !primera.getAttribute('src') && !primera.getAttribute('srcset')) {
                for (var s = 0; s < conSrc.length; s++) {
                    if (conSrc[s].getAttribute('src') || conSrc[s].getAttribute('srcset')) {
                        primera.setAttribute('src', conSrc[s].getAttribute('src') || conSrc[s].getAttribute('srcset'));
                        break;
                    }
                }
            }
            if (conSrc.length > 1) p.setAttribute('data-extra-img', '1');

            // El envoltorio de info + boton pasa a ser el cuerpo de la card
            var info = p.querySelector('.block-products-feed__product-info');
            if (info && info.parentNode) info.parentNode.classList.add('msn-carrusel__body');
        });

        // ----- DOM -----
        var root = document.createElement('div');
        root.id = ID_ROOT;
        root.className = 'msn-carrusel';

        var head = document.createElement('div');
        head.className = 'msn-carrusel__head';
        head.style.maxWidth = '1120px';
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
        // Duplico las cards al final del track: al llegar al final, "saltar" a la
        // posicion inicial es imperceptible => el loop es continuo, sin barrido.
        var N0 = productos.length;
        for (var c = 0; c < N0; c++) {
            track.appendChild(productos[c].cloneNode(true));
        }

        // ----- Carrusel -----
        var perActual = null;
        var indice = 0;
        var paso = 0;

        function per() {
            return (window.innerWidth < 640) ? CONFIG.visiblesMovil : CONFIG.visiblesDesktop;
        }

        function maxIndice() {
            return N0;
        }

        function medir() {
            var p = per();
            if (perActual !== p) {
                perActual = p;
                viewport.style.setProperty('--msn-per', p);
                viewport.style.setProperty('--msn-gap', CONFIG.separacion + 'px');
            }
            if (productos[0]) paso = productos[0].getBoundingClientRect().width + CONFIG.separacion;
            indice = Math.max(0, Math.min(maxIndice(), indice));
            aplicar();
        }

        function aplicar(instant) {
            if (instant) track.style.transition = 'none';
            track.style.transform = 'translateX(-' + (indice * paso) + 'px)';
            if (instant) {
                void track.offsetWidth; // fuerza reflow
                track.style.transition = '';
            }
        }

        function ir(i, instant) {
            indice = Math.max(0, Math.min(maxIndice(), i));
            aplicar(instant);
        }

        function sig() {
            if (indice >= N0) ir(0, true);        // ya en el clon = volver al inicio sin barrido
            else ir(indice + 1);
        }

        function ant() {
            if (indice <= 0) ir(N0 - per(), true); // del primero, vamos al ultimo sin barrido
            else ir(indice - 1);
        }

        // ----- ARRASTRE / SWIPE (dedo en movil + click en PC) -----
        var arrastrando = false;
        var arrX = 0, arrBase = 0, arrDx = 0, arrDxPrev = 0, arrT = 0, vel = 0;
        var bloqueaClick = false;

        viewport.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            arrastrando = true;
            arrX = e.clientX;
            arrBase = -(indice * paso);
            arrDx = 0; arrDxPrev = 0; vel = 0; arrT = 0;
            track.classList.add('msn-no-trans');
            viewport.classList.add('msn-drag');
            try { viewport.setPointerCapture(e.pointerId); } catch (err) { }
            e.preventDefault();
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
            var flotante = -(arrBase + arrDx) / paso;
            var objetivo = Math.round(flotante);
            if (Math.abs(vel) > .35) objetivo += Math.round(vel * 250 / paso);
            objetivo = Math.max(0, Math.min(maxIndice(), objetivo));
            ir(objetivo);
            if (dist > 5) bloqueaClick = true;
        }
        viewport.addEventListener('pointerup', soltar);
        viewport.addEventListener('pointercancel', soltar);

        // Bloqueo el click fantasma tras un arrastre (para no abrir la card sin querer)
        viewport.addEventListener('click', function (e) {
            if (bloqueaClick) {
                e.preventDefault();
                e.stopPropagation();
                bloqueaClick = false;
            }
        }, true);

        // Autoplay (loop infinito)
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var timer = null;
        function play() {
            if (reduce || !CONFIG.autoplayMs || N0 <= per()) return;
            stop();
            timer = setInterval(sig, CONFIG.autoplayMs);
        }
        function stop() {
            if (timer) { clearInterval(timer); timer = null; }
        }
        function retomar() {
            if (reduce || !CONFIG.autoplayMs || N0 <= per()) return;
            stop();
            sig();
            timer = setInterval(sig, CONFIG.autoplayMs);
        }
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', retomar);
        window.addEventListener('touchstart', stop, { passive: true });

        medir();
        play();
        window.addEventListener('resize', function () { medir(); });
        // Recalculo cuando cargan las imagenes (el alto cambia)
        var imgs = root.querySelectorAll('img');
        for (var m = 0; m < imgs.length; m++) {
            if (imgs[m].complete) continue;
            imgs[m].addEventListener('load', medir);
        }
    }

    montar();
})();
