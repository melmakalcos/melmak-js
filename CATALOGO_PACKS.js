// =============================================
// CATALOGO - Seccion del catalogo de productos
//
// EDITAR: TITULO_CATALOGO y VOLUMENES
//         (un objeto por volumen, con sus cajas)
// CONFIG: ANCLA_INSERCION = selector del bloque
//         banner, despues del cual se inserta
//         la seccion.
// =============================================
(function () {
    if (document.getElementById('melk-catalogo')) return;
    var esPortada = location.pathname.replace(/\/+$/, '') === '';
    if (!esPortada && !document.getElementById('melk-catalogo-preview')) return;   // solo portada

    // =============== DATOS (EDITAR AQUI) ================
    var TITULO_CATALOGO = 'CATÁLOGO';

    var VOLUMENES = [
        {
            status: '',            // '' | 'is-reception' | 'is-end'
            mainText: 'HACÉ CLICK EN LA OPCIÓN QUE MÁS TE GUSTE',
            join: ['is-red'],
            notes: [
                {
                    id: 'melmak_unidad',
                    cat: 'Fotocards',
                    title: 'COMPRÁ POR UNIDAD',
                    text: 'Explorá toda nuestra colección. Elegí tus diseños favoritos de a uno y armá tu combinación perfecta.',
                    img: 'URL_IMAGEN_1',
                    link: { href: 'https://www.melmakalcos.com.ar/productos' }
                },
                {
                    id: 'melmak_pack',
                    cat: 'Fotocards',
                    title: 'COMPRÁ POR PACK',
                    text: 'Stickers temáticos en un solo set. La forma más fácil y rápida de llevarte colecciones completas.',
                    img: 'URL_IMAGEN_2',
                    link: { href: 'URL_LINK_2' }
                }
            ],
            link: { href: 'URL_LINK_AQUI', text: 'Participar' }
        }
    ];

    // Selector del bloque banner despues del cual se inserta la seccion.
    var ANCLA_INSERCION = '.header-menu';
    // ====================================================

    // ---------------- ESTILOS ----------------
    var style = document.createElement('style');
    style.textContent = [
        '@font-face { font-family: \'Curda Gouda\'; src: url("https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@85a491307507245bd4b7ea4c7ec7127a02123174/Curda%20Gouda.ttf") format("truetype"); font-weight: 400; font-style: normal; font-display: swap; }',
        '@keyframes mmOnda { to { background-position: 26px 0; } }',
        '.melk-catalogo { font-family: \'Rubik\', system-ui, sans-serif; color: #353535; }',
        '.melk-catalogo__fondo { position: relative; overflow: hidden; padding: 56px 16px 76px; background-color: #ffffff; --melk-cuadricula-tam: 50px;',
        '  background-image: linear-gradient(45deg, #ffee26 25%, transparent 25%, transparent 75%, #ffee26 75%, #ffee26), linear-gradient(45deg, #ffee26 25%, #ffffff 25%, #ffffff 75%, #ffee26 75%, #ffee26);',
        '  background-size: var(--melk-cuadricula-tam) var(--melk-cuadricula-tam);',
        '  background-position: 0 0, calc(var(--melk-cuadricula-tam) / 2) calc(var(--melk-cuadricula-tam) / 2);',
        '  animation: melk-cuadricula 24s linear infinite; }',
        '@keyframes melk-cuadricula { from { background-position: 0 0, calc(var(--melk-cuadricula-tam) / 2) calc(var(--melk-cuadricula-tam) / 2); } to { background-position: var(--melk-cuadricula-tam) var(--melk-cuadricula-tam), calc(var(--melk-cuadricula-tam) * 1.5) calc(var(--melk-cuadricula-tam) * 1.5); } }',
        '.melk-catalogo__mascota { display: none; position: absolute; left: -20%; top: 30%; width: 130px; height: auto; z-index: 0; pointer-events: none; will-change: left, top; }',
        '.melk-catalogo__wrap { position: relative; z-index: 1; max-width: 1150px; margin: 0 auto; }',
        '.melk-catalogo .melk-headline { position: relative; z-index: 1; display: flex; justify-content: center; margin: 18px 0 22px; }',
        '.melk-catalogo .melk-headline__text { display: flex; justify-content: center; margin: 0; font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif !important; font-size: 38px; font-weight: 400; line-height: 1; color: #353535; }',
        '.melk-catalogo .melk-list { list-style: none; margin: 20px 0 0; padding: 0; display: flex; flex-direction: column; gap: 40px; }',
        '.melk-catalogo .melk-item { width: 100%; }',
        '.melk-catalogo .melk-note:hover { background-color: #ffee26; background-image: none; filter: brightness(1.06); box-shadow: inset 0 0 60px rgba(53,53,53,.55), inset 0 0 120px rgba(53,53,53,.35); }',
        '.melk-catalogo .melk-item__inner { width: 100%; -webkit-box-sizing: border-box; box-sizing: border-box; background-color: #353535; padding: 3px; overflow: hidden; border-radius: 26px; }',
        '.melk-catalogo .melk-item__head { position: relative; display: flex; align-items: center; padding: 12px 14px 10px; background-color: #353535; border-radius: 26px 26px 0 0; }',
        '.melk-catalogo .melk-item__head-title { flex: 1; margin: 0; padding: 0; text-align: center; font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 14px; font-weight: 800; line-height: 1.25; letter-spacing: 0; text-transform: uppercase; color: #fff; }',
        '.melk-catalogo .melk-item__head-join { position: static; top: auto; right: auto; transform: none; margin-left: 10px; display: flex; gap: 4px; align-items: center; justify-content: flex-start; }',
        '.melk-catalogo .melk-item__head-join-circle { width: 16px; height: 16px; border-radius: 50%; animation: melk-blink 2.6s ease-in-out infinite; }',
        '@keyframes melk-blink { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }',
        '.melk-catalogo .melk-item__head-join-circle.is-red { background-color: #ffee26; }',
        '.melk-catalogo .melk-item__head-join-circle.is-blue { background-color: #74d1f5; }',
        '.melk-catalogo .melk-item__head-join-circle.is-yellow { background-color: #ffed49; }',
        '.melk-catalogo .melk-item__body { display: flex; flex-direction: column; align-items: stretch; background-color: #fff; border-radius: 0 0 23px 23px; }',
        '.melk-catalogo .melk-note { position: relative; display: flex; flex: 1 1 0; flex-direction: column; align-items: center; justify-content: center; padding: 26px 20px 24px; min-height: 244px; -webkit-box-sizing: border-box; box-sizing: border-box; background-color: transparent; border: 0; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, filter .35s ease; }',
        '.melk-catalogo .melk-note__thumbnail { display: none; }',
        '.melk-catalogo .melk-note__hoverimg { position: absolute; top: 0; left: 0; z-index: 1; width: 100%; height: 100%; background-size: cover; background-position: center; border-radius: 0 0 23px 23px; opacity: 0; transition: opacity .3s ease; pointer-events: none; }',
        '.melk-catalogo .melk-note:hover .melk-note__hoverimg { background-image: url("https://d22fxaf9t8d39k.cloudfront.net/7af298887867dd4b25884f39332503067e11a03f87b8aec48c60ebe3a42ca3a920700.png"); opacity: 1; }',
        '.melk-catalogo .melk-note__thumbnail-title { display: none; }',
        '.melk-catalogo .melk-note__thumbnail-image { width: 264px; height: 72px; overflow: hidden; }',
        '.melk-catalogo .melk-note__thumbnail-image img { display: block; width: 100%; height: 100%; object-fit: cover; }',
        '.melk-catalogo .melk-note__card { position: static; left: auto; top: auto; transform: none; z-index: 5; width: 80%; max-width: 360px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; flex: 1 1 0; transition: opacity .35s ease; }',
        '.melk-catalogo .melk-note__card::before { display: none; }',
        '.melk-catalogo .melk-note__card-inner { padding: 14px 18px 16px; -webkit-box-sizing: border-box; box-sizing: border-box; background-color: #ffee26; border: 3px solid #353535; border-radius: 14px; }',
        '.melk-catalogo .melk-note__card-title { font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 20px; font-weight: 800; line-height: 1.3; text-transform: uppercase; color: #353535; text-align: center; }',
        '.melk-catalogo .melk-note__card-text { margin: 6px auto 0; width: 86%; text-align: left; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 15px; font-weight: 400; line-height: 1.6; color: #353535; text-transform: uppercase; }',
        '.melk-catalogo .melk-note__arrow { display: none; position: absolute; left: 50%; bottom: 100%; z-index: 6; width: 42px; height: 29px; background: #ffee26; clip-path: polygon(14px 0px, 28px 0px, 28px 13px, 42px 13px, 21px 29px, 0px 13px, 14px 13px); animation: melk-arrow-bob .9s ease-in-out infinite; }',
        '@keyframes melk-arrow-bob { 0%, 100% { transform: translate(-50%, -10px); } 50% { transform: translate(-50%, -16px); } }',
        '.melk-catalogo .melk-note:hover .melk-note__arrow { opacity: 0; visibility: hidden; transition: opacity .25s ease; }',
        '.melk-catalogo .melk-note:hover .melk-note__card { opacity: 0; }',
        '.melk-catalogo .melk-item.is-end .melk-note__arrow, .melk-catalogo .melk-item.is-reception .melk-note__arrow { display: none; }',
        '.melk-catalogo .melk-note--melmak_unidad { --background-color: #fff; --title-background-color: #50ceff; border-radius: 0; }',
        '.melk-catalogo .melk-note--melmak_pack { --background-color: #fff; --title-background-color: #fd3c26; border-radius: 0 0 23px 23px; }',
        '.melk-catalogo .melk-note__capa { display: none; }',
        '.melk-catalogo .melk-note:hover .melk-note__capa { animation: melk-capa-plop .55s ease 1; }',
        '@keyframes melk-capa-plop { 0% { transform: translateX(-50%) scale(1); } 35% { transform: translateX(-50%) scale(1.18); } 55% { transform: translateX(-50%) scale(.96); } 75% { transform: translateX(-50%) scale(1.06); } 100% { transform: translateX(-50%) scale(1); } }',
        '.melk-catalogo .melk-note__linker { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; text-decoration: none; color: inherit; -webkit-tap-highlight-color: transparent; }',
        '.melk-catalogo .melk-link { --background-color: #ff4566; width: 240px; height: 54px; margin: 18px auto 0; }',
        '.melk-catalogo .melk-link a { display: flex; gap: 8px; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: var(--background-color); border: 2px solid rgba(0,0,0,.12); border-radius: 50vh; color: #fff; text-decoration: none; transition: transform .3s ease; }',
        '.melk-catalogo .melk-link a:hover { transform: scale(1.04); }',
        '.melk-catalogo .melk-link__attention { display: block; margin-top: 4px; font-size: 12px; font-weight: 700; line-height: 1.7; text-align: center; }',
        '.melk-catalogo .melk-link .melk-link__text { padding-bottom: 2px; font-size: 16px; font-weight: 700; color: #fff; }',
        '.melk-catalogo .melk-item.is-end .melk-item__body { pointer-events: none; }',
        '.melk-catalogo .melk-item.is-end .melk-note { overflow: hidden; }',
        '.melk-catalogo .melk-item.is-end .melk-note::before { position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; content: ""; background-color: #353535; opacity: .5; }',
        '.melk-catalogo .melk-item.is-end .melk-note::after { position: absolute; z-index: 2; display: flex; align-items: center; justify-content: center; width: 134px; height: 41px; font-size: 17px; font-weight: 700; line-height: 1.4; color: #fff; content: "Finalizado"; background-color: #353535; border-radius: 8px; transform: rotate(-6deg); }',
        '.melk-catalogo .melk-item.is-end .melk-link { display: none; }',
        '.melk-catalogo .melk-item.is-reception .melk-item__body { pointer-events: none; }',
        '.melk-catalogo .melk-item.is-reception .melk-note { overflow: hidden; }',
        '.melk-catalogo .melk-item.is-reception .melk-note::before { position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; content: ""; background-color: #353535; opacity: .2; }',
        '.melk-catalogo .melk-item.is-reception .melk-note::after { position: absolute; z-index: 2; display: flex; align-items: center; justify-content: center; width: 168px; height: 41px; font-size: 17px; font-weight: 700; line-height: 1.4; color: #353535; content: "Recepción cerrada"; background-color: #fff; border-radius: 8px; transform: rotate(-6deg); }',
        '.melk-catalogo .melk-item.is-reception .melk-link { display: none; }',
        '.melk-catalogo .melk-bounce-target { opacity: 0; transform: scale(.88) translateY(40px); transition: opacity .7s ease var(--bounce-delay, 0s), transform .7s cubic-bezier(.165,.84,.44,1) var(--bounce-delay, 0s); }',
        '.melk-catalogo .melk-bounce-target.melk-bounce-in { opacity: 1; transform: none; }',
        '@media (prefers-reduced-motion: reduce) { .melk-catalogo .melk-bounce-target { opacity: 1; transform: none; transition: none; } .melk-catalogo .melk-note__arrow { animation: none; transform: translate(-50%, -16px); } .melk-catalogo .melk-note:hover .melk-note__capa { animation: none; } }',
        '@media (min-width: 768px) {',
        '.melk-catalogo__fondo { --melk-cuadricula-tam: 100px; padding: 86px 40px 186px; }',
        '.melk-catalogo__mascota { display: block; width: 150px; }',
        '.melk-catalogo .melk-headline__text { font-size: 76px; }',
        '.melk-catalogo .melk-headline { margin: 8px 0 20px; }',
        '.melk-catalogo .melk-list { gap: 80px; margin-top: 14px; }',
        '.melk-catalogo .melk-item__inner { border-radius: 26px 26px 42px 42px; padding: 0; background-color: transparent; border: 0; overflow: visible; }',
        '.melk-catalogo .melk-item__head { display: flex; align-items: center; justify-content: flex-start; padding: 24px 40px 12px; }',
        '.melk-catalogo .melk-item__head-title { padding: 0; font-size: 32px; text-align: center; }',
        '.melk-catalogo .melk-item__head-join { position: absolute; top: 50%; right: 26px; transform: translateY(-50%); gap: 9px; margin-left: 0; }',
        '.melk-catalogo .melk-item__head-join-circle { width: 20px; height: 20px; }',
        '.melk-catalogo .melk-item__body { display: flex; flex-direction: row; align-items: stretch; justify-content: flex-start; background-color: transparent; background-image: none; animation: none; border-radius: 0; }',
        '.melk-catalogo .melk-note__hoverimg { border-radius: 0; }',
        '.melk-catalogo .melk-note { width: 100%; padding: 36px 48px 36px; min-height: 400px; border: 3px solid #353535; background-color: var(--background-color); }',
        '.melk-catalogo .melk-note--melmak_unidad { border-radius: 0 0 0 42px; }',
        '.melk-catalogo .melk-note--melmak_pack { border-radius: 0 0 42px 0; }',
        '.melk-catalogo .melk-note__thumbnail-image { height: 150px; }',
        '.melk-catalogo .melk-note__card { position: absolute; left: 50%; top: 100%; transform: translate(-50%, -50%); width: 80%; max-width: 340px; }',
        '.melk-catalogo .melk-note__card::before { display: block; content: ""; position: absolute; z-index: -1; inset: 0; background-color: #353535; border-radius: 14px; transform: translate(7px, 8px); }',
        '.melk-catalogo .melk-note__arrow { display: none; }',
        '.melk-catalogo .melk-note__capa { display: block; position: absolute; left: calc(50% + 8px); bottom: 100%; transform: translateX(-50%); transform-origin: 50% 100%; z-index: 0; width: 360px; max-width: 92%; height: 220px; object-fit: contain; pointer-events: none; }',
        '.melk-catalogo .melk-note:hover .melk-note__card { opacity: 1; }',
        '.melk-catalogo .melk-note__card-inner { position: relative; z-index: 1; padding: 20px 24px 22px; }',
        '.melk-catalogo .melk-note__card-title { font-size: 24px; }',
        '.melk-catalogo .melk-note__card-text { margin-top: 8px; font-size: 16px; }',
        '.melk-catalogo .melk-link { width: 460px; height: 84px; margin-top: 26px; }',
        '.melk-catalogo .melk-link .melk-link__text { padding-bottom: 4px; font-size: 22px; }',
        '.melk-catalogo .melk-item.is-end .melk-note::after { top: calc(50% - 30px); width: 176px; height: 60px; font-size: 24px; font-weight: 700; content: "Finalizado"; border-radius: 15px; }',
        '.melk-catalogo .melk-item.is-reception .melk-note::after { top: calc(50% - 30px); width: 224px; height: 60px; font-size: 24px; content: "Recepción cerrada"; border-radius: 15px; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    // ---------------- FUENTES (Typekit) ----------------
    if (!document.getElementById('melk-typekit-matt')) {
        var tkMatt = document.createElement('link');
        tkMatt.id = 'melk-typekit-matt';
        tkMatt.rel = 'stylesheet';
        tkMatt.href = 'https://use.typekit.net/pbf7oen.css';
        document.head.appendChild(tkMatt);
    }
    if (!document.getElementById('melk-typekit-vinyl')) {
        var tkVinyl = document.createElement('link');
        tkVinyl.id = 'melk-typekit-vinyl';
        tkVinyl.rel = 'stylesheet';
        tkVinyl.href = 'https://use.typekit.net/tdt2nii.css';
        document.head.appendChild(tkVinyl);
    }

    // ---------------- RENDER ----------------
    function renderTitulo(title) {
        return '<div class="melk-headline"><p class="melk-headline__text">' + title + '</p></div>';
    }

    function renderCaja(n) {
        var cls = n.id === 'melmak_pack' ? 'melk-note--melmak_pack' : 'melk-note--melmak_unidad';
        var capaImg = n.id === 'melmak_pack'
            ? 'https://d22fxaf9t8d39k.cloudfront.net/7c6585fe2b54cd48bf71279f8c72bd0d5fa27ce27e95a2bfb78b7c1f1e590f9f20700.png'
            : 'https://d22fxaf9t8d39k.cloudfront.net/95299cd4af7b8b0c5b5fa7094c6cec49d64b540c0741ee2ad749122a5688d86f20700.png';
        var href = n.link && n.link.href ? n.link.href : '';
        var linkA = (href && href.indexOf('URL_') !== 0)
            ? '<a class="melk-note__linker" href="' + href + '" aria-label="' + n.title + '"></a>' : '';
        var cuerpo = '<div class="melk-note ' + cls + '">'
            + '<div class="melk-note__hoverimg"></div>'
            + '<div class="melk-note__thumbnail">'
            + '<div class="melk-note__thumbnail-title"><span></span></div>'
            + '<div class="melk-note__thumbnail-image"></div>'
            + '</div>'
            + '<div class="melk-note__card">'
            + '<div class="melk-note__arrow"></div>'
            + '<img class="melk-note__capa" src="' + capaImg + '" alt="">'
            + '<div class="melk-note__card-inner">'
            + '<div class="melk-note__card-title">' + n.title + '</div>'
            + '<div class="melk-note__card-text">' + n.text + '</div>'
            + '</div>'
            + '</div>'
            + linkA
            + '</div>';
        return cuerpo;
    }

    function renderCabecera(v) {
        var join = '';
        for (var i = 0; i < v.join.length; i++) {
            join += '<div class="melk-item__head-join-circle ' + v.join[i] + '"></div>';
        }
        return '<div class="melk-item__head">'
            + '<p class="melk-item__head-title">' + v.mainText + '</p>'
            + '<div class="melk-item__head-join">' + join + '</div>'
            + '</div>';
    }

    function renderBoton(v) {
        if (v.status === 'is-end' || v.status === 'is-reception' || !v.link) return '';
        var hasHref = v.link.href && v.link.href.indexOf('URL_') !== 0;
        if (!hasHref) return '';
        return '<div class="melk-link">'
            + '<a href="' + v.link.href + '"><span class="melk-link__text">' + v.link.text + '</span></a>'
            + '</div>';
    }

    function renderVolumen(v, idx) {
        var notes = '';
        for (var i = 0; i < v.notes.length; i++) {
            notes += renderCaja(v.notes[i]);
        }
        return '<li id="melk-vol-' + (idx + 1) + '" class="melk-item ' + (v.status || '') + ' melk-bounce-trigger">'
            + '<div class="melk-item__inner melk-bounce-target" data-bounce="0.7" style="--bounce-delay:' + (idx * 0.12).toFixed(2) + 's">'
            + renderCabecera(v)
            + '<div class="melk-item__body">' + notes + '</div>'
            + renderBoton(v)
            + '</div></li>';
    }

    // ---------------- HTML DE LA SECCION ----------------
    var ONDA_TOP = '<div style="position:absolute;top:0;left:0;right:0;height:18px;pointer-events:none;background-repeat:repeat-x;background-size:26px 18px;background-position:0 0;animation:mmOnda 1.5s linear infinite;background-image:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2226%22 height=%2218%22><path d=%22M0 12 Q6.5 7 13 12 T26 12 L26 0 L0 0 Z%22 fill=%22%23ffffff%22/><path d=%22M0 12 Q6.5 7 13 12 T26 12%22 fill=%22none%22 stroke=%22%23353535%22 stroke-width=%223%22 stroke-linecap=%22round%22/></svg>\');"></div>';
    var ONDA_BOTTOM = '<div style="position:absolute;bottom:0;left:0;right:0;height:18px;pointer-events:none;background-repeat:repeat-x;background-size:26px 18px;background-position:0 0;animation:mmOnda 1.5s linear infinite;background-image:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2226%22 height=%2218%22><path d=%22M0 12 Q6.5 7 13 12 T26 12 L26 18 L0 18 Z%22 fill=%22%23ffffff%22/><path d=%22M0 12 Q6.5 7 13 12 T26 12%22 fill=%22none%22 stroke=%22%23353535%22 stroke-width=%223%22 stroke-linecap=%22round%22/></svg>\');"></div>';

    var seccion = document.createElement('div');
    seccion.className = 'melk-catalogo';
    seccion.id = 'melk-catalogo';
    var lista = '';
    for (var i = 0; i < VOLUMENES.length; i++) {
        lista += renderVolumen(VOLUMENES[i], i);
    }
    seccion.innerHTML = '<div class="melk-catalogo__fondo">'
        + ONDA_TOP
        + ONDA_BOTTOM
        + '<img class="melk-catalogo__mascota" src="https://d22fxaf9t8d39k.cloudfront.net/5747277f193e94fe14afb2e6fffa4fe60dca4bf5f37cdfb4073a0fdbd12e795920700.png" alt="">'
        + '<div class="melk-catalogo__wrap">'
        + '<ul class="melk-list">' + lista + '</ul>'
        + '</div>'
        + '</div>';

    // ---------------- INSERTAR DESPUES DEL BANNER ----------------
    function insertarSeccion() {
        if (seccion.parentNode) return;
        var ref = document.querySelector(ANCLA_INSERCION);
        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(seccion, ref.nextSibling);
        } else {
            document.body.appendChild(seccion);
        }
    }

    // ---------------- ANIMACION DE ENTRADA (bounce) ----------------
    function animarEntrada() {
        var targets = seccion.querySelectorAll('.melk-bounce-target');
        if (!('IntersectionObserver' in window)) {
            for (var i = 0; i < targets.length; i++) targets[i].classList.add('melk-bounce-in');
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('melk-bounce-in');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        for (var i = 0; i < targets.length; i++) obs.observe(targets[i]);
    }

    // ---------------- VIBRACION + ZOOM AL HOVER (segun tiempo) ----------------
    function efectoPaso() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var cajas = seccion.querySelectorAll('.melk-note');
        for (var i = 0; i < cajas.length; i++) {
            (function (caja) {
                var raf = 0;
                var start = 0;
                var img = caja.querySelector('.melk-note__hoverimg');
                function step(now) {
                    var t = Math.min((now - start) / 2000, 1);
                    var ease = t;
                    var ph = now / 1000;
                    var fx = (Math.sin(ph * 6.5) * 8 + Math.sin(ph * 23) * 3) * ease;
                    var fy = (Math.cos(ph * 4.2) * 6 + Math.cos(ph * 19) * 2.2) * ease;
                    var zoom = 106 + ease * 13 + Math.sin(ph * 1.9) * 1.6;
                    img.style.backgroundPosition = (50 + fx).toFixed(2) + '% ' + (50 + fy).toFixed(2) + '%';
                    img.style.backgroundSize = zoom.toFixed(2) + '%';
                    raf = requestAnimationFrame(step);
                }
                caja.addEventListener('mouseenter', function () {
                    start = performance.now();
                    cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(step);
                });
                caja.addEventListener('mouseleave', function () {
                    cancelAnimationFrame(raf);
                    img.style.backgroundPosition = '';
                    img.style.backgroundSize = '';
                });
            })(cajas[i]);
        }
    }

    // ---------------- RESET AL VOLVER ATRAS (bfcache) ----------------
    function reiniciarSeccion() {
        seccion.innerHTML = '<div class="melk-catalogo__fondo">'
            + ONDA_TOP
            + ONDA_BOTTOM
            + '<img class="melk-catalogo__mascota" src="https://d22fxaf9t8d39k.cloudfront.net/5747277f193e94fe14afb2e6fffa4fe60dca4bf5f37cdfb4073a0fdbd12e795920700.png" alt="">'
            + '<div class="melk-catalogo__wrap">'
            + '<ul class="melk-list">' + lista + '</ul>'
            + '</div>'
            + '</div>';
        animarEntrada();
        efectoPaso();
        animarMascota();
    }

    var primeraCarga = true;
    window.addEventListener('pageshow', function () {
        if (primeraCarga) { primeraCarga = false; return; }
        reiniciarSeccion();
    });

    // ---------------- MASCOTA VOLADORA (izq ↔ der, 1s de pausa al salir) ----------------
    var mascotaSesion = 0;
    function animarMascota() {
        var m = seccion.querySelector('.melk-catalogo__mascota');
        if (!m) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var token = ++mascotaSesion;
        var XMIN = -20, XMAX = 110;   // % posiciones fuera de pantalla
        var VEL = 26;                 // % por segundo de cruce
        var ESPERA = 1000;            // 1 s fuera antes de la siguiente entrada
        var dir = 1;
        var x = XMIN;
        var yBase = 30;
        var fuera = false;
        var tFuera = 0;
        var prev = performance.now();
        m.style.transform = 'scaleX(1)';
        function paso(now) {
            if (token !== mascotaSesion) return;
            var dt = Math.min(now - prev, 100);
            prev = now;
            if (!fuera) {
                x += VEL * dir * (dt / 1000);
                if ((dir === 1 && x >= XMAX) || (dir === -1 && x <= XMIN)) {
                    fuera = true;
                    tFuera = now;
                    m.style.opacity = '0';
                } else {
                    m.style.left = x + '%';
                    m.style.top = (yBase + Math.sin(now / 850) * 6) + '%';
                }
            } else if (now - tFuera >= ESPERA) {
                dir = -dir;
                x = dir === 1 ? XMIN : XMAX;
                yBase = 16 + Math.random() * 28;
                m.style.transform = dir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
                m.style.opacity = '1';
                m.style.left = x + '%';
                m.style.top = (yBase + Math.sin(now / 850) * 6) + '%';
                fuera = false;
            }
            requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
    }

    // ---------------- ARRANQUE ----------------
    function iniciar() {
        insertarSeccion();
        animarEntrada();
        efectoPaso();
        animarMascota();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
