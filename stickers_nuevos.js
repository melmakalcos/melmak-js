// =============================================
// STICKERS NUEVOS - Carrusel de productos
//
// Convierte la seccion nativa de Tiendanube
// (.block-products-feed--1339226 "STICKERS
// NUEVOS") en un carrusel con la estetica
// MELMAK: fondo amarillo, titulo Curda Gouda,
// botones comprar como pilula negra.
//
// Tiendanube regenera el HTML de la seccion en
// cada visita, asi que el carrusel se arma solo
// con los stickers nuevos que subas.
// =============================================
(function () {
    var ID_ROOT = 'msn-root';
    if (document.getElementById(ID_ROOT)) return;

    // =============== CONFIG (EDITAR AQUI) ================
    var CONFIG = {
        titulo: 'STICKERS NUEVOS',        // titulo de la seccion
        visiblesDesktop: 3,               // stickers visibles en PC
        visiblesMovil: 2,                 // stickers visibles en movil
        separacion: 14,                   // separacion entre cards (px)
        autoplayMs: 4000,                 // 0 = sin autoplay
        anchoMaximo: 1120,                // ancho maximo del contenido (no toca bordes)
        mostrarVerTodos: true,            // boton "VER TODOS" abajo
        linkVerTodos: '/productos'
    };

    // Selector de la seccion nativa de Tiendanube.
    var SECCION = '.block-products-feed--1339226';
    // ====================================================

    // ---------------- ESTILOS ----------------
    var style = document.createElement('style');
    style.textContent = [
        '@font-face { font-family: \'Curda Gouda\'; src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@85a491307507245bd4b7ea4c7ec7127a02123174/Curda%20Gouda.ttf") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }',

        // Fondo amarillo full-bleed
        '.msn-carrusel { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; overflow: hidden; padding: 60px 0 62px; background-color: #ffee26; }',

        // Encabezado
        '.msn-carrusel__head { max-width: 1120px; margin: 0 auto; text-align: center; padding: 0 20px; margin-bottom: 26px; }',
        '.msn-carrusel__titulo { font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; text-transform: uppercase; letter-spacing: .02em; font-size: clamp(28px, 4.5vw, 42px); font-weight: 400; color: #353535; margin: 0; }',

        // Carrusel (contenido centrado, separado de los bordes)
        // OJO: overflow soloco x horizontal; el vertical queda visible para que el
        // hover/sombra de las cajas NO se corte con franjas.
        '.msn-carrusel__viewport { position: relative; max-width: 1120px; margin: 0 auto; overflow-x: hidden; overflow-y: visible; padding: 22px 52px 30px; --msn-per: 3; --msn-gap: 14px; }',
        '.msn-carrusel__track { display: flex; gap: var(--msn-gap, 14px); will-change: transform; transition: transform .55s cubic-bezier(.22, .61, .36, 1); }',
        '.msn-carrusel .block-products-feed__product { flex: 0 0 auto; display: flex; align-items: stretch; width: calc((100% - (var(--msn-per) - 1) * var(--msn-gap, 14px)) / var(--msn-per)); box-sizing: border-box; }',

        // Card (wrapper) - todas iguales
        '.msn-carrusel .block-products-feed__product-wrapper { flex: 1 1 auto; width: 100%; min-width: 0; display: flex; flex-direction: column; height: 100%; background: #ffffff; border: 3px solid #353535; border-radius: 14px; padding: 8px; box-sizing: border-box; transition: transform .3s ease, box-shadow .3s ease; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover { transform: translateY(-5px); box-shadow: 0 14px 26px rgba(53, 53, 53, .22); }',

        // Imagen (solo la primera, hover zoom)
        '.msn-carrusel .block-products-feed__product-media { position: relative; overflow: hidden; border-radius: 10px; aspect-ratio: 1 / 1; background: #f2f2f2; }',
        '.msn-carrusel .block-products-feed__product-media a { display: block; position: relative; width: 100%; height: 100%; }',
        '.msn-carrusel .block-products-feed__product-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s ease; }',
        '.msn-carrusel__slide[data-extra-img] .block-products-feed__product-image:not(:first-of-type) { display: none !important; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover .block-products-feed__product-image { transform: scale(1.06); }',

        // Badge OFF (pilula negra)
        '.msn-carrusel .block-products-feed__product-offer { position: absolute; top: 8px; left: 8px; z-index: 2; background-color: #353535 !important; color: #fff !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; border-radius: 100px; padding: 4px 9px; }',

        // Cuerpo de la card: info + boton a la vista SIEMPRE
        '.msn-carrusel__body { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; min-height: 96px; padding: 0 2px; box-sizing: border-box; }',
        '.msn-carrusel .block-products-feed__product-name { font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; text-transform: uppercase; letter-spacing: .03em; font-size: 13px; line-height: 1.2; color: #353535; margin: 8px 0 3px; }',
        '.msn-carrusel .block-products-feed__product-name a { color: #353535; text-decoration: none; }',
        '.msn-carrusel .block-products-feed__product-info { padding: 0 2px; }',
        '.msn-carrusel .block-products-feed__product-price { font-size: 13px; color: #353535; margin: 1px 0; }',
        '.msn-carrusel .block-products-feed__product-price del { color: #999; margin-left: 4px; font-size: 11px; }',
        '.msn-carrusel .block-products-feed__product-additional { font-size: 11px; color: #353535; margin: 3px 0 0; text-transform: uppercase; letter-spacing: .02em; }',

        // Boton COMPRAR (pilula negra) - el tema lo oculta hasta el hover, lo forzamos siempre visible
        '.msn-carrusel .block-products-feed__product-buttons { display: flex !important; justify-content: center; margin-top: auto; padding-top: 8px; opacity: 1 !important; visibility: visible !important; transform: none !important; pointer-events: auto; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy { display: inline-block !important; opacity: 1 !important; visibility: visible !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff !important; background-color: #353535 !important; border: 2px solid #353535 !important; border-radius: 100px; padding: 8px 18px; transition: all .2s ease; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:hover { background-color: #ffffff !important; color: #353535 !important; }',
        '.msn-carrusel .block-products-feed__product-buttons-buy:active { transform: scale(.95); }',

        // Flechas (pegadas al CONTENIDO, no a la pantalla)
        '.msn-carrusel__flecha { position: absolute; top: 50%; margin-top: -40px; z-index: 5; width: 48px; height: 48px; border-radius: 50%; border: 3px solid #353535; background-color: #ffffff; color: #353535; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__flecha svg { width: 20px; height: 20px; }',
        '.msn-carrusel__flecha:hover { background-color: #353535; color: #fff; }',
        '.msn-carrusel__flecha--prev { left: 2px; }',
        '.msn-carrusel__flecha--next { right: 2px; }',

        // VER TODOS (pilula negra con animacion que invita a interactuar)
        '.msn-carrusel__mas { display: flex; justify-content: center; margin-top: 24px; animation: msn-mas-llamada 4.2s ease-in-out infinite; }',
        '.msn-carrusel__mas a { display: inline-flex; align-items: center; gap: 10px; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff; background-color: #353535; border: 3px solid #353535; border-radius: 100px; padding: 11px 26px 11px 32px; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__mas a svg { width: 22px; height: 22px; transition: transform .3s ease; animation: msn-mas-flecha 4.2s ease-in-out infinite; }',
        '.msn-carrusel__mas a:hover { background-color: #fff; color: #353535; transform: scale(1.04); }',
        '.msn-carrusel__mas a:hover svg { animation: none; transform: translateX(6px); }',
        '@keyframes msn-mas-llamada { 0%, 70%, 100% { transform: translateY(0); } 75% { transform: translateY(-5px); } 79% { transform: translateY(0) rotate(-2deg); } 83% { transform: translateY(0) rotate(2deg); } 87% { transform: translateY(-2px); } 91% { transform: translateY(0); } }',
        '@keyframes msn-mas-flecha { 0%, 70%, 100% { transform: translateX(0); } 76% { transform: translateX(7px); } 82% { transform: translateX(0); } 86% { transform: translateX(3px); } }',

        // Movil
        '@media (max-width: 639px) {',
        '  .msn-carrusel { padding: 46px 0 50px; }',
        '  .msn-carrusel__viewport { padding: 18px 46px 24px; }',
        '  .msn-carrusel__flecha { width: 38px; height: 38px; margin-top: -31px; border-width: 2px; }',
        '  .msn-carrusel__flecha svg { width: 17px; height: 17px; }',
        '  .msn-carrusel__flecha--prev { left: 4px; }',
        '  .msn-carrusel__flecha--next { right: 4px; }',
        '  .msn-carrusel .block-products-feed__product-name { font-size: 12px; }',
        '  .msn-carrusel .block-products-feed__product-buttons-buy { font-size: 12px; padding: 7px 14px; }',
        '  .msn-carrusel__body { min-height: 84px; }',
        '  .msn-carrusel__mas a { font-size: 15px; padding: 10px 22px 10px 28px; }',
        '}',
        '@media (prefers-reduced-motion: reduce) {',
        '  .msn-carrusel__track { transition: none; }',
        '  .msn-carrusel .block-products-feed__product-wrapper:hover { transform: none; }',
        '  .msn-carrusel__mas, .msn-carrusel__mas a svg { animation: none; }',
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

        // Limpio clases de grilla, fuerzo imagenes y dejo clara una sola foto por card
        productos.forEach(function (p) {
            p.className = p.className.replace(/\buk-width[^\s]*/g, '').replace(/\s+/g, ' ').trim();
            p.classList.add('msn-carrusel__slide');

            var imgs = p.querySelectorAll('img');
            var conSrc = [];
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
                // Dejo SOLO la clase que usa el carrusel (saco clases lazy/retina del tema)
                ig.setAttribute('class', 'block-products-feed__product-image');
                ig.setAttribute('loading', 'lazy');
                conSrc.push(ig);
            }
            // Si la primera foto quedo sin src (placeholder lazy), le doy el src de la primera que tenga
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
        head.style.maxWidth = CONFIG.anchoMaximo + 'px';
        var h2 = document.createElement('h2');
        h2.className = 'msn-carrusel__titulo';
        h2.textContent = CONFIG.titulo;
        head.appendChild(h2);
        root.appendChild(head);

        var viewport = document.createElement('div');
        viewport.className = 'msn-carrusel__viewport';
        viewport.style.maxWidth = CONFIG.anchoMaximo + 'px';
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
        // Las flechas viven DENTRO del viewport (contenido centrado) => no tocan los bordes de pantalla
        viewport.appendChild(prev);
        viewport.appendChild(next);

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
        // Duplico todas las cards al final del track: al llegar al final, "saltar" a la
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

        // posicion maxima: N0 (ahi ya se ven los CLONES, identicos a la posicion 0)
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
            indice = Math.max(0, Math.min(N0, indice));
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
            indice = Math.max(0, Math.min(N0, i));
            aplicar(instant);
        }

        function sig() {
            if (indice >= N0) ir(0, true);        // ya está en el clon = volver al inicio invisible
            else ir(indice + 1);
        }

        function ant() {
            if (indice <= 0) ir(N0 - per(), true); // del primero, vamos al último sin barrido
            else ir(indice - 1);
        }

        prev.addEventListener('click', ant);
        next.addEventListener('click', sig);

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
        // Al salir del carrusel: avanza YA (no espera el intervalo completo) y retoma el loop
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