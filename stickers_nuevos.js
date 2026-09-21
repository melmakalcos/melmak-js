// =============================================
// STICKERS NUEVOS - Carrusel de productos
// =============================================
(function () {
    var ID_ROOT = 'msn-root';
    if (document.getElementById(ID_ROOT)) return;

    // =============== CONFIG (EDITAR AQUI) ================
    var CONFIG = {
        titulo: 'STICKERS NUEVOS',        // titulo de la seccion
        visiblesDesktop: 3,               // stickers visibles en PC
        visiblesMovil: 2,                 // stickers visibles en movil
        separacion: 16,                   // separacion entre cards (px)
        autoplayMs: 4000,                 // 0 = sin autoplay
        mostrarVerTodos: true,            // boton "VER TODOS" abajo
        linkVerTodos: '/productos'
    };

    // Selector de la seccion nativa de Tiendanube.
    var SECCION = '.block-products-feed--1339226';
    // ====================================================

    // ---------------- ESTILOS ----------------
    var style = document.createElement('style');
    style.textContent = [
        // Fondo zig-zag amarillo full-bleed
        '.msn-carrusel { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; overflow: hidden; padding: 64px 0 66px; background-color: #fff9d9;',
        '  background-image: linear-gradient(135deg, #ffee26 25%, transparent 25%), linear-gradient(225deg, #ffee26 25%, transparent 25%), linear-gradient(45deg, #ffee26 25%, transparent 25%), linear-gradient(315deg, #ffee26 25%, #fff9d9 25%);',
        '  background-position: 10px 0, 10px 0, 0 0, 0 0; background-size: 20px 20px; background-repeat: repeat; }',

        // Encabezado
        '.msn-carrusel__head { text-align: center; padding: 0 20px; margin-bottom: 30px; }',
        '.msn-carrusel__titulo { font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; text-transform: uppercase; letter-spacing: .05em; font-size: clamp(26px, 4.5vw, 40px); color: #353535; margin: 0; }',

        // Carrusel
        '.msn-carrusel__viewport { overflow: hidden; padding: 6px 2px 16px; --msn-per: 3; }',
        '.msn-carrusel__track { display: flex; gap: 16px; will-change: transform; transition: transform .55s cubic-bezier(.22, .61, .36, 1); }',
        '.msn-carrusel .block-products-feed__product { flex: 0 0 auto; width: calc((100% - (var(--msn-per) - 1) * 16px) / var(--msn-per)); box-sizing: border-box; }',

        // Card (wrapper)
        '.msn-carrusel .block-products-feed__product-wrapper { display: flex; flex-direction: column; height: 100%; background: #ffffff; border: 3px solid #353535; border-radius: 18px; padding: 10px; box-sizing: border-box; transition: transform .3s ease, box-shadow .3s ease; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover { transform: translateY(-5px); box-shadow: 0 14px 26px rgba(53, 53, 53, .22); }',
        '.msn-carrusel .block-products-feed__product-wrapper, .msn-carrusel .block-products-feed__product-wrapper:hover { box-shadow: 0 14px 26px rgba(53, 53, 53, .22); }',

        // Imagen (solo la primera, hover zoom)
        '.msn-carrusel .block-products-feed__product-media { position: relative; overflow: hidden; border-radius: 12px; aspect-ratio: 1 / 1; background: #f2f2f2; }',
        '.msn-carrusel .block-products-feed__product-media a { display: block; position: relative; width: 100%; height: 100%; }',
        '.msn-carrusel .block-products-feed__product-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }',
        '.msn-carrusel .block-products-feed__product-image:not(:first-of-type) { display: none; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover .block-products-feed__product-image { transform: scale(1.06); }',

        // Badge OFF (pilula negra)
        '.msn-carrusel .block-products-feed__product-offer { position: absolute; top: 8px; left: 8px; z-index: 2; background-color: #353535 !important; color: #fff !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; border-radius: 100px; padding: 4px 9px; }',

        // Nombre (vinyl)
        '.msn-carrusel .block-products-feed__product-name { font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; text-transform: uppercase; letter-spacing: .03em; font-size: 14px; line-height: 1.2; color: #353535; margin: 8px 0 4px; }',
        '.msn-carrusel .block-products-feed__product-name a { color: #353535; text-decoration: none; }',
        '.msn-carrusel .block-products-feed__product-info { padding: 0 2px; }',

        // Precio
        '.msn-carrusel .block-products-feed__product-price { font-size: 14px; color: #353535; margin: 2px 0; }',
        '.msn-carrusel .block-products-feed__product-price del { color: #999; margin-left: 5px; font-size: 12px; }',
        '.msn-carrusel .block-products-feed__product-additional { font-size: 12px; color: #353535; margin: 4px 0 0; text-transform: uppercase; letter-spacing: .03em; }',

        // Boton COMPRAR (pilula negra)
        '.msn-carrusel .block-products-feed__product-buttons { display: flex; justify-content: center; margin-top: 8px; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy { display: inline-block; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff !important; background-color: #353535 !important; border: 2px solid #353535 !important; border-radius: 100px; padding: 9px 22px; transition: all .2s ease; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:hover { background-color: #ffffff !important; color: #353535 !important; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:active { transform: scale(.95); }',

        // Flechas
        '.msn-carrusel__flecha { position: absolute; top: 50%; margin-top: -30px; z-index: 5; width: 52px; height: 52px; border-radius: 50%; border: 3px solid #353535; background-color: #ffee26; color: #353535; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__flecha svg { width: 22px; height: 22px; }',
        '.msn-carrusel__flecha:hover { background-color: #353535; color: #fff; }',
        '.msn-carrusel__flecha--prev { left: 10px; }',
        '.msn-carrusel__flecha--next { right: 10px; }',

        // VER TODOS
        '.msn-carrusel__mas { display: flex; justify-content: center; margin-top: 18px; }',
        '.msn-carrusel__mas a { display: inline-block; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff; background-color: #353535; border: 3px solid #353535; border-radius: 100px; padding: 11px 34px; transition: all .2s ease; }',
        '.msn-carrusel__mas a:hover { background-color: #fff; color: #353535; }',

        // Movil
        '@media (max-width: 639px) {',
        '  .msn-carrusel { padding: 50px 0 54px; }',
        '  .msn-carrusel__flecha { width: 40px; height: 40px; margin-top: -24px; }',
        '  .msn-carrusel__flecha svg { width: 18px; height: 18px; }',
        '  .msn-carrusel__flecha--prev { left: 4px; }',
        '  .msn-carrusel__flecha--next { right: 4px; }',
        '  .msn-carrusel .block-products-feed__product-name { font-size: 12px; }',
        '  .msn-carrusel .block-products-feed__product-buttons-buy { font-size: 12px; padding: 8px 16px; }',
        '}',
        '@media (prefers-reduced-motion: reduce) { .msn-carrusel__track { transition: none; } .msn-carrusel .block-products-feed__product-wrapper:hover { transform: none; } }'
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

        // Limpio clases de grilla y fuerzo imagenes lazy
        productos.forEach(function (p) {
            p.className = p.className.replace(/\buk-width[^\s]*/g, '').replace(/\s+/g, ' ').trim();
            var imgs = p.querySelectorAll('img[data-src]');
            for (var i = 0; i < imgs.length; i++) {
                var ig = imgs[i];
                if (!ig.getAttribute('src') && ig.getAttribute('data-src')) {
                    ig.setAttribute('src', ig.getAttribute('data-src'));
                }
                ig.removeAttribute('data-src');
                ig.setAttribute('loading', 'lazy');
            }
            p.classList.add('msn-carrusel__slide');
        });

        // ----- DOM -----
        var root = document.createElement('div');
        root.id = ID_ROOT;
        root.className = 'msn-carrusel';

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
        root.appendChild(viewport);

        var FLECHA = function (dir) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'msn-carrusel__flecha msn-carrusel__flecha--' + dir;
            b.setAttribute('aria-label', dir === 'prev' ? 'Anterior' : 'Siguiente');
            b.innerHTML = dir === 'prev'
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="12" x2="2" y2="12"></line><polyline points="12 4 2 12 12 20"></polyline></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="12" x2="22" y2="12"></line><polyline points="12 4 22 12 12 20"></polyline></svg>';
            return b;
        };
        var prev = FLECHA('prev');
        var next = FLECHA('next');
        root.appendChild(prev);
        root.appendChild(next);

        if (CONFIG.mostrarVerTodos) {
            var mas = document.createElement('div');
            mas.className = 'msn-carrusel__mas';
            var a = document.createElement('a');
            a.href = CONFIG.linkVerTodos;
            a.textContent = 'VER TODOS';
            mas.appendChild(a);
            root.appendChild(mas);
        }

        sec.parentNode.insertBefore(root, sec.nextSibling);

        // ----- Carrusel -----
        var perActual = null;
        var indice = 0;
        var paso = 0;
        var N = productos.length;

        function per() {
            return (viewport.clientWidth && viewport.clientWidth < 640) ? CONFIG.visiblesMovil : CONFIG.visiblesDesktop;
        }

        function maxIndice() {
            var p = per();
            return Math.max(0, N - p);
        }

        function medir() {
            var p = per();
            if (perActual !== p) {
                perActual = p;
                viewport.style.setProperty('--msn-per', p);
            }
            if (productos[0]) paso = productos[0].getBoundingClientRect().width + CONFIG.separacion;
            if (indice > maxIndice()) indice = maxIndice();
            aplicar();
        }

        function aplicar() {
            track.style.transform = 'translateX(-' + (indice * paso) + 'px)';
        }

        function ir(i) {
            indice = Math.max(0, Math.min(maxIndice(), i));
            aplicar();
        }

        function sig() {
            ir(indice >= maxIndice() ? 0 : indice + 1);
        }

        function ant() {
            ir(indice <= 0 ? maxIndice() : indice - 1);
        }

        prev.addEventListener('click', ant);
        next.addEventListener('click', sig);

        // Autoplay
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var timer = null;
        function play() {
            if (reduce || !CONFIG.autoplayMs || N <= per()) return;
            stop();
            timer = setInterval(sig, CONFIG.autoplayMs);
        }
        function stop() {
            if (timer) { clearInterval(timer); timer = null; }
        }
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', play);
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