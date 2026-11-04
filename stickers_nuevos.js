(function () {
    var ID_ROOT = 'msn-root';
    if (document.getElementById(ID_ROOT)) return;

    var CONFIG = {
        titulo: 'PRODUCTOS NUEVOS',
        visibleMovil: 2,
        visibleDesktop: 3,
        maxAnchoCardMovil: 220,
        maxAnchoCardDesktop: 320,
        separacion: 16,
        gutterMovil: 14,
        gutterDesktop: 28,
        autoplayMs: 3200,
        mostrarVerTodos: true,
        linkVerTodos: '/productos',
        masVendidos: {
            titulo: 'EL MÁS VENDIDO DE LA SEMANA',
            imagen: 'https://d22fxaf9t8d39k.cloudfront.net/7b9f5d0ebb5a5fb09c9cde5d696358a33ce2dca68f2fd4df8acf16080208757c20700.png',            // PEGÁ ACÁ el link del PNG del póster
            link: 'https://www.melmakalcos.com.ar/prints/musica/poster-bts-6',              // PEGÁ ACÁ el link del producto
            alt: 'MÁS VENDIDO',
            alturaDesktop: 500,    // alto del póster en px (compu)
            alturaMovil: 250,      // alto del póster en px (celular)
            textoBoton: 'LO QUIERO' // texto del botón que aparece al pasar el mouse
        }
    };

    var SECCION = '.block-products-feed--1339226';

    if (!document.getElementById('msn-typekit-vinyl')) {
        var tkv = document.createElement('link');
        tkv.id = 'msn-typekit-vinyl';
        tkv.rel = 'stylesheet';
        tkv.href = 'https://use.typekit.net/tdt2nii.css';
        document.head.appendChild(tkv);
    }

    var style = document.createElement('style');
    style.textContent = [
        '@font-face { font-family: \'Curda Gouda\'; src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@85a491307507245bd4b7ea4c7ec7127a02123174/Curda%20Gouda.ttf") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }',

        '.msn-carrusel { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; overflow: hidden; padding: 60px 0 28px; background: linear-gradient(180deg, transparent 0 14px, #ffee26 14px); }',
        '.msn-carrusel__onda { position: absolute; top: 0; left: 0; right: 0; height: 18px; pointer-events: none; background-repeat: repeat-x; background-size: 26px 18px; background-position: 0 0; animation: msn-onda 1.5s linear infinite; background-image: url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2226%22 height=%2218%22><path d=%22M0 12 Q6.5 7 13 12 T26 12 L26 18 L0 18 Z%22 fill=%22%23ffee26%22/></svg>\'); }',
        '@keyframes msn-onda { to { background-position: 26px 0; } }',

        '.msn-carrusel__head { max-width: 1120px; margin: 0 auto; text-align: center; padding: 0 20px; margin-bottom: 6px; }',
        '.msn-carrusel__titulo { font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-weight: 400; text-transform: uppercase; letter-spacing: .02em; font-size: clamp(28px, 4.5vw, 42px); color: #353535; margin: 0; text-shadow: 4px 4px 0 #fff; }',

        '.msn-carrusel__viewport { position: relative; width: 100%; box-sizing: border-box; overflow-x: hidden; overflow-y: visible; padding: 10px 0 30px; -webkit-user-select: none; user-select: none; touch-action: pan-y; cursor: grab; }',
        '.msn-carrusel__viewport.msn-drag { cursor: grabbing; }',
        '.msn-carrusel__viewport a, .msn-carrusel__viewport button { cursor: pointer; }',
        '.msn-carrusel__track { display: flex; align-items: stretch; will-change: transform; transition: transform .55s cubic-bezier(.22, .61, .36, 1); }',
        '.msn-carrusel__track.msn-no-trans { transition: none; }',

        '.msn-carrusel .block-products-feed__product { flex: 0 0 auto; display: flex; align-items: stretch; box-sizing: border-box; margin: 0 !important; }',

        '.msn-carrusel .block-products-feed__product-wrapper { width: 100%; display: flex; flex-direction: column; background: #ffffff; border: 3px solid #353535; border-radius: 14px; padding: 8px; box-sizing: border-box; transition: transform .3s ease, box-shadow .3s ease; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover { transform: translateY(-5px); box-shadow: 0 14px 26px rgba(53, 53, 53, .22); }',

        '.msn-carrusel .block-products-feed__product-media { position: relative; overflow: hidden; border-radius: 10px; width: 100% !important; height: 0 !important; padding-bottom: 100% !important; max-height: none !important; background: #f2f2f2; }',
        '.msn-carrusel .block-products-feed__product-media a { display: block; position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; }',
        '.msn-carrusel .block-products-feed__product-image { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; display: block; transition: transform .3s ease; -webkit-user-drag: none; user-select: none; }',
        '.msn-carrusel .block-products-feed__product-wrapper:hover .block-products-feed__product-image { transform: scale(1.06); }',
        '.msn-carrusel__slide[data-extra-img] .block-products-feed__product-image:not(:first-of-type) { display: none !important; }',

        '.msn-carrusel .block-products-feed__product-offer { position: absolute; top: 8px; left: 8px; z-index: 2; background-color: #353535 !important; color: #fff !important; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; border-radius: 100px; padding: 4px 9px; }',

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

        '.msn-carrusel__flecha { position: absolute; top: 50%; margin-top: -22px; z-index: 5; width: 44px; height: 44px; border-radius: 50%; border: 3px solid #353535; background-color: rgba(255,255,255,.92); color: #353535; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__flecha svg { width: 18px; height: 18px; }',
        '.msn-carrusel__flecha:hover { background-color: #353535; color: #fff; }',
        '.msn-carrusel__flecha:active { transform: scale(.92); }',
        '.msn-carrusel__flecha--prev { left: 6px; }',
        '.msn-carrusel__flecha--next { right: 6px; }',

        '.msn-carrusel__mas { display: flex; justify-content: center; margin-top: 18px; }',
        '.msn-carrusel__mas a { display: inline-flex !important; align-items: center; gap: 10px; font-family: \'vinyl\' !important; font-size: 17px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; color: #fff !important; background-color: #353535 !important; border: 3px solid #353535 !important; border-radius: 100px; padding: 12px 28px; transition: background-color .2s ease, color .2s ease, transform .2s ease; }',
        '.msn-carrusel__mas a, .msn-carrusel__mas a * { font-family: \'vinyl\' !important; color: #fff !important; }',
        '.msn-carrusel__mas a:hover { background-color: #fff !important; color: #353535 !important; transform: scale(1.04); }',
        '.msn-carrusel__mas a:hover * { color: #353535 !important; }',
        '.msn-carrusel__mas svg { width: 22px; height: 22px; }',

        '/* trama de puntos: de la barra amarilla hasta el final de melmak-ig */',
        '#msn-root { background-color: #ffee26; background-image: linear-gradient(#fff 0 14px, rgba(255, 255, 255, 0) 14px), radial-gradient(rgba(53, 53, 53, .13) 1.6px, rgba(53, 53, 53, 0) 1.7px); background-size: 100% 100%, 16px 16px; background-repeat: no-repeat, repeat; animation: msn-trama 2.8s linear infinite; }',
        '@keyframes msn-trama { from { background-position: 0 0, 0 0; } to { background-position: 0 0, 16px 16px; } }',
        '#melmak-ig { background-image: radial-gradient(rgba(53, 53, 53, .13) 1.6px, rgba(53, 53, 53, 0) 1.7px) !important; background-size: 16px 16px !important; animation: msn-trama-ig 2.8s linear infinite; }',
        '@keyframes msn-trama-ig { from { background-position: 0 0; } to { background-position: 16px 16px; } }',

        '.msn-vendidos { position: relative; text-align: center; padding: 26px 20px 8px; margin-bottom: 0; background: transparent; }',
        '.msn-vendidos .msn-carrusel__titulo { text-shadow: 4px 4px 0 #fff; }',
        '.msn-vendidos__link { position: relative; display: inline-block; margin-top: 26px; perspective: 900px; text-decoration: none; z-index: 2; }',
        '.msn-vendidos__link::before { content: ""; position: absolute; left: 50%; top: 50%; width: min(74vw, 500px); aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle at 50% 46%, #fff 0 58%, rgba(255, 255, 255, .92) 65%, rgba(255, 255, 255, .38) 72%, rgba(255, 255, 255, 0) 79%); pointer-events: none; z-index: 0; }',
        '.msn-vendidos__giro { position: relative; display: block; height: ' + CONFIG.masVendidos.alturaDesktop + 'px; z-index: 1; animation: none; transform: perspective(1600px) rotateY(-12deg) rotate(-1.2deg); }',
        '.msn-vendidos__img { display: block; height: 100%; width: auto; filter: drop-shadow(0 6px 8px rgba(53, 53, 53, .25)); -webkit-user-drag: none; user-select: none; }',
        '.msn-vendidos__img--dorso { display: none; }',
        '.msn-vendidos__sombra { position: absolute; left: 16%; right: 16%; bottom: -8px; height: 26px; border-radius: 50%; background: rgba(53, 53, 53, .28); filter: blur(11px); pointer-events: none; z-index: 0; }',

        '.msn-vendidos__badge { position: absolute; z-index: 6; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; border-radius: 100px; padding: 13px 24px; font-size: 17px; line-height: 1; box-shadow: none; pointer-events: none; }',
        '.msn-vendidos__badge--top { left: -6%; top: -3%; background: #353535; color: #fff; transform: rotate(-8deg); }',
        '.msn-vendidos__badge--pedido { right: -14%; bottom: 30%; background: #fff; color: #353535; border: 2px solid #353535; transform: rotate(7deg); }',

        '.msn-vendidos__confeti { position: absolute; inset: 0; z-index: 1; pointer-events: none; }',
        '.msn-vendidos__star { position: absolute; pointer-events: none; transform: translate(-50%, -50%) rotate(var(--r, 0deg)); }',
        '.msn-vendidos__star svg { width: 100%; height: 100%; display: block; overflow: visible; }',

        '/* reflejo intermitente que cruza el poster */',
        '.msn-vendidos__reflejo { position: absolute; inset: 0; z-index: 3; overflow: hidden; border-radius: 3px; pointer-events: none; }',
        '.msn-vendidos__reflejo i { position: absolute; top: -30%; bottom: -30%; left: 0; width: 62%; display: block; background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .04) 16%, rgba(255, 255, 255, .14) 34%, rgba(255, 255, 255, .36) 50%, rgba(255, 255, 255, .14) 66%, rgba(255, 255, 255, .04) 84%, rgba(255, 255, 255, 0) 100%); transform: translateX(-150%) skewX(-16deg); filter: blur(8px); animation: msn-reflejo 7.5s linear infinite; }',
        '@keyframes msn-reflejo { 0%, 30% { transform: translateX(-150%) skewX(-16deg); } 80%, 100% { transform: translateX(300%) skewX(-16deg); } }',
        '.msn-vendidos__link:hover .msn-vendidos__reflejo i { animation-duration: 5.5s; }',

        '/* CTA: en compu aparece con el hover, en celular queda siempre visible */',
        '.msn-vendidos__boton { display: none; }',
        '@media (hover: hover) and (pointer: fine) {',
        '  .msn-vendidos__boton { display: inline-block; position: absolute; left: 50%; bottom: 8%; z-index: 5; opacity: 0; transform: translate(-50%, 14px) scale(.7); pointer-events: none; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 21px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; color: #353535; background-color: #fff; border: 2px solid #353535; border-radius: 100px; padding: 12px 30px; transition: opacity .25s ease, transform .35s cubic-bezier(.34, 1.56, .64, 1), background-color .2s ease, color .2s ease; }',
        '  .msn-vendidos__link:hover .msn-vendidos__boton { opacity: 1; transform: translate(-50%, 0) scale(1); pointer-events: auto; }',
        '  .msn-vendidos__boton:hover { background-color: #353535; color: #fff; }',
        '}',
        '@media (hover: none) {',
        '  .msn-vendidos__boton { display: inline-block; position: absolute; left: 50%; bottom: 6%; z-index: 5; opacity: 1; transform: translate(-50%, 0); font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 21px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; color: #353535; background-color: #fff; border: 2px solid #353535; border-radius: 100px; padding: 10px 24px; animation: msn-boton-pop .5s .8s cubic-bezier(.34, 1.56, .64, 1) both; }',
        '}',
        '@keyframes msn-boton-pop { 0% { opacity: 0; transform: translate(-50%, 12px) scale(.6); } 60% { opacity: 1; transform: translate(-50%, -2px) scale(1.06); } 100% { opacity: 1; transform: translate(-50%, 0) scale(1); } }',

        '@media (min-width: 640px) {',
        '  .msn-vendidos__link { margin: 44px 0 60px; perspective: 2400px; }',
        '}',

        '@media (max-width: 639px) {',
        '  .msn-carrusel { padding: 46px 0 22px; }',
        '  .msn-vendidos { padding: 22px 16px 6px; }',
        '  .msn-vendidos__link { margin-top: 22px; }',
        '  .msn-vendidos__giro { height: ' + CONFIG.masVendidos.alturaMovil + 'px; }',
        '  .msn-vendidos__badge { font-size: 12px; padding: 8px 14px; }',
        '  .msn-vendidos__badge--top { left: -3%; top: -4%; }',
        '  .msn-vendidos__badge--pedido { right: -6%; bottom: 27%; }',
        '  .msn-vendidos__sombra { left: 12%; right: 12%; height: 18px; bottom: -6px; }',
        '  .msn-carrusel .block-products-feed__product-info { min-height: 84px; }',
        '  .msn-carrusel .block-products-feed__product-name { font-size: 12px; }',
        '  .msn-carrusel .block-products-feed__product-buttons-buy { font-size: 12px; padding: 7px 14px; }',
        '  .msn-carrusel__flecha { width: 36px; height: 36px; margin-top: -18px; border-width: 2px; }',
        '  .msn-carrusel__flecha svg { width: 15px; height: 15px; }',
        '  .msn-carrusel__flecha--prev { left: 4px; }',
        '  .msn-carrusel__flecha--next { right: 4px; }',
        '  .msn-carrusel__mas a { font-size: 15px; padding: 10px 22px; }',
        '}',

        '/* entradas al hacer scroll */',
        '@keyframes msn-titulo-entra { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
        '@keyframes msn-poster-pop { from { opacity: 0; transform: translateY(34px) scale(.92); } to { opacity: 1; transform: translateY(0) scale(1); } }',
        '@keyframes msn-flotar { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }',
        '@keyframes msn-star-pop { from { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scale(.2); } to { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scale(1); } }',
        '.msn-anim .msn-vendidos .msn-carrusel__titulo, .msn-anim .msn-carrusel__head .msn-carrusel__titulo { opacity: 0; transform: translateY(20px); }',
        '.msn-anim .msn-vendidos.is-in .msn-carrusel__titulo, .msn-anim .msn-carrusel__head.is-in .msn-carrusel__titulo { animation: msn-titulo-entra .7s cubic-bezier(.22, 1, .36, 1) both; }',
        '.msn-anim .msn-vendidos__link { opacity: 0; }',
        '.msn-anim .msn-vendidos.is-in .msn-vendidos__link { animation: msn-poster-pop .8s cubic-bezier(.22, 1, .36, 1) .1s both, msn-flotar 6s ease-in-out 1.1s infinite; }',
        '.msn-anim .msn-vendidos__star { opacity: 0; }',
        '.msn-anim .msn-vendidos.is-in .msn-vendidos__star { animation: msn-star-pop .55s cubic-bezier(.34, 1.56, .64, 1) both; }',

        '@media (prefers-reduced-motion: reduce) {',
        '  .msn-carrusel__track { transition: none; }',
        '  .msn-carrusel .block-products-feed__product-wrapper:hover { transform: none; }',
        '  .msn-vendidos__giro { animation: none; }',
        '  .msn-vendidos__link, .msn-vendidos__star, .msn-vendidos .msn-carrusel__titulo, .msn-carrusel__head .msn-carrusel__titulo { animation: none !important; opacity: 1 !important; transform: none !important; }',
        '  .msn-vendidos__star { transform: translate(-50%, -50%) rotate(var(--r, 0deg)) !important; }',
        '  .msn-vendidos__reflejo i, #msn-root, #melmak-ig { animation: none !important; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

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

            media.innerHTML = '';
            var newA = document.createElement('a');
            newA.className = 'block-products-feed__product-link';
            if (href) newA.setAttribute('href', href);
            if (firstImg) newA.appendChild(firstImg);
            if (offer) newA.appendChild(offer);
            media.appendChild(newA);

            var info = p.querySelector('.block-products-feed__product-info');
            if (info && info.parentNode) info.parentNode.classList.add('msn-carrusel__body');
        });

        var root = document.createElement('div');
        root.id = ID_ROOT;
        root.className = 'msn-carrusel msn-anim';

        var onda = document.createElement('div');
        onda.className = 'msn-carrusel__onda';
        root.appendChild(onda);

        var mv = CONFIG.masVendidos;
        if (mv && mv.imagen && mv.link) {
            var bloqueMv = document.createElement('div');
            bloqueMv.className = 'msn-vendidos';
            var tituloMv = document.createElement('h2');
            tituloMv.className = 'msn-carrusel__titulo';
            tituloMv.textContent = mv.titulo;
            var linkMv = document.createElement('a');
            linkMv.className = 'msn-vendidos__link';
            linkMv.href = mv.link;
            linkMv.setAttribute('aria-label', mv.titulo);

            var sombraMv = document.createElement('span');
            sombraMv.className = 'msn-vendidos__sombra';
            sombraMv.setAttribute('aria-hidden', 'true');

            var giroMv = document.createElement('span');
            giroMv.className = 'msn-vendidos__giro';
            var frenteMv = document.createElement('img');
            frenteMv.className = 'msn-vendidos__img';
            frenteMv.src = mv.imagen;
            frenteMv.alt = mv.alt || '';
            frenteMv.decoding = 'async';
            giroMv.appendChild(frenteMv);

            var reflejoMv = document.createElement('span');
            reflejoMv.className = 'msn-vendidos__reflejo';
            reflejoMv.setAttribute('aria-hidden', 'true');
            reflejoMv.innerHTML = '<i></i>';

            var badgeTop = document.createElement('span');
            badgeTop.className = 'msn-vendidos__badge msn-vendidos__badge--top';
            badgeTop.textContent = 'TOP #1';
            var badgePedido = document.createElement('span');
            badgePedido.className = 'msn-vendidos__badge msn-vendidos__badge--pedido';
            badgePedido.textContent = 'EL MÁS PEDIDO';

            var confetiMv = document.createElement('span');
            confetiMv.className = 'msn-vendidos__confeti';
            confetiMv.setAttribute('aria-hidden', 'true');
            var ESTRELLAS = [
                [-7, 8, 22, -16, 1],
                [5, -7, 20, 18, 0],
                [26, -10, 26, -10, 1],
                [50, -9, 15, 24, 0],
                [75, -8, 22, -20, 1],
                [95, -3, 16, 12, 0],
                [105, 16, 26, -8, 1],
                [108, 45, 17, 20, 0],
                [103, 74, 24, -14, 1],
                [94, 99, 16, 10, 0],
                [72, 107, 22, -22, 1],
                [44, 108, 14, 16, 0],
                [20, 105, 24, -6, 1],
                [-5, 97, 17, 12, 0],
                [-10, 70, 22, -18, 1],
                [-9, 36, 15, 8, 0]
            ];
            for (var e = 0; e < ESTRELLAS.length; e++) {
                var dat = ESTRELLAS[e];
                var starMv = document.createElement('span');
                starMv.className = 'msn-vendidos__star';
                starMv.style.left = dat[0] + '%';
                starMv.style.top = dat[1] + '%';
                starMv.style.width = dat[2] + 'px';
                starMv.style.height = dat[2] + 'px';
                starMv.style.setProperty('--r', dat[3] + 'deg');
                starMv.style.animationDelay = (0.35 + e * 0.06).toFixed(2) + 's';
                starMv.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l2.95 6.2 6.75.83-4.98 4.6 1.32 6.67L12 17.5l-6.04 3.2 1.32-6.67-4.98-4.6 6.75-.83z" fill="' + (dat[4] ? '#fff' : 'none') + '" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
                confetiMv.appendChild(starMv);
            }

            var botonMv = document.createElement('span');
            botonMv.className = 'msn-vendidos__boton';
            botonMv.textContent = mv.textoBoton || 'LO QUIERO';
            botonMv.setAttribute('aria-hidden', 'true');

            linkMv.appendChild(sombraMv);
            linkMv.appendChild(giroMv);
            linkMv.appendChild(reflejoMv);
            linkMv.appendChild(badgeTop);
            linkMv.appendChild(badgePedido);
            linkMv.appendChild(confetiMv);
            linkMv.appendChild(botonMv);
            bloqueMv.appendChild(tituloMv);
            bloqueMv.appendChild(linkMv);
            root.appendChild(bloqueMv);
        }

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

        // animaciones de entrada: se disparan al entrar en pantalla
        if (bloqueMv) {
            if ('IntersectionObserver' in window) {
                var io = new IntersectionObserver(function (entradas) {
                    for (var ie = 0; ie < entradas.length; ie++) {
                        if (!entradas[ie].isIntersecting) continue;
                        entradas[ie].target.classList.add('is-in');
                        io.unobserve(entradas[ie].target);
                    }
                }, { threshold: 0.25 });
                io.observe(bloqueMv);
                io.observe(head);
            } else {
                bloqueMv.classList.add('is-in');
                head.classList.add('is-in');
            }
        }

        var N0 = productos.length;
        for (var c = 0; c < N0; c++) {
            track.appendChild(productos[c].cloneNode(true));
        }

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
            if (indice >= N0) ir(0, true);
            else ir(indice + 1);
        }
        function ant() {
            if (maxIndice() === 0) return;
            if (indice <= 0) {
                ir(N0, true);
                void track.offsetWidth;
                ir(N0 - 1);
            } else {
                ir(indice - 1);
            }
        }

        prev.addEventListener('click', ant);
        next.addEventListener('click', sig);

        var siguiendo = false;
        var arrastrando = false;
        var UMBRAL = 6;
        var arrX = 0, arrBase = 0, arrDx = 0, arrDxPrev = 0, arrT = 0, vel = 0;
        var bloqueaClick = false;

        viewport.addEventListener('pointerdown', function (e) {
            if (e.target.closest('.msn-carrusel__flecha')) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            siguiendo = true;
            arrastrando = false;
            arrX = e.clientX;
            arrBase = gutterActual - indice * paso;
            arrDx = 0; arrDxPrev = 0; vel = 0; arrT = 0;
        });

        viewport.addEventListener('pointermove', function (e) {
            if (!siguiendo) return;
            var dx = e.clientX - arrX;

            if (!arrastrando) {
                if (Math.abs(dx) < UMBRAL) return;
                arrastrando = true;
                track.classList.add('msn-no-trans');
                viewport.classList.add('msn-drag');
                try { viewport.setPointerCapture(e.pointerId); } catch (err) { }
            }

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
            if (!siguiendo) return;
            var estabaArrastrando = arrastrando;
            siguiendo = false;
            arrastrando = false;
            if (!estabaArrastrando) return;

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