// =============================================
// CATALOGO - Seccion del catalogo de productos
// =============================================
(function () {
    if (document.getElementById('melk-catalogo')) return;
    var esPortada = location.pathname.replace(/\/+$/, '') === '';
    if (!esPortada && !document.getElementById('melk-catalogo-preview')) return;   // solo portada

    // =============== DATOS (EDITAR AQUI) ================
    var TITULO_CATALOGO = '¡COMPRÁ YA!';

    // ---------------- BLOQUE MONITOR (categorias) ----------------
    // Titulo de la seccion del monitor (misma animacion que el titulo del catalogo).
    var TITULO_MONITOR = 'CATÁLOGO';
    // Texto fijo de la barra navegadora del monitor (se muestra en amarillo sobre la barra negra).
    var MONITOR_BARRA_TEXTO = '¡ESTAMOS ACTUALIZANDO ESTA FUNCIÓN! GRACIAS POR TU PACIENCIA :)';
    // Una entrada por categoria: "nombre" = texto del boton; "img" = imagen del contenido.
    // "zoom" (opcional, por defecto 1) = recorte para tapar el margen transparente del PNG.
    // "link" (opcional, por defecto /productos) = destino del boton INGRESAR.
    // Completar "img" y "link" de las categorias que quedan vacias:
    var MONITOR_CATEGORIAS = [
        { nombre: 'ANIMADOS', img: 'https://d22fxaf9t8d39k.cloudfront.net/3920f45c63ecc8fa017e4b61e7deafea563ba38e4339c2b7832aaed94145f64720700.png', zoom: 1.25 },
        { nombre: 'ANIMANGA', img: 'https://d22fxaf9t8d39k.cloudfront.net/748c6fe1f0679a043cc46c8bd803bb19b704a6ab7b755b6f7d77ce5e45b5e80120700.png', zoom: 1 },
        { nombre: 'CINE Y TV', img: '', link: '' },
        { nombre: 'COLOR', img: '', link: '' },
        { nombre: 'COUNTER STRIKE', img: '', link: '' },
        { nombre: 'DEPORTES', img: '', link: '' },
        { nombre: 'DRAGON BALL', img: '', link: '' },
        { nombre: 'HARRY POTTER', img: '', link: '' },
        { nombre: 'K-POP', img: '', link: '' },
        { nombre: 'LOGOS', img: '', link: '' },
        { nombre: 'MEMAZOS', img: '', link: '' },
        { nombre: 'MÚSICA', img: '', link: '' },
        { nombre: 'PATRIA / NOSTALGIA', img: '', link: '' },
        { nombre: 'POKEMON', img: '', link: '' },
        { nombre: 'PORTADAS JUEGOS', img: '', link: '' },
        { nombre: 'PORTADAS MÚSICA', img: '', link: '' },
        { nombre: 'SIMPSONS', img: '', link: '' },
        { nombre: 'STAR WARS', img: '', link: '' },
        { nombre: 'STREAM', img: '', link: '' },
        { nombre: 'UNIVERSO', img: '', link: '' },
        { nombre: 'VALORANT', img: '', link: '' },
        { nombre: 'VICIO', img: '', link: '' },
        { nombre: 'WEED', img: '', link: '' }
    ];
    // ============================================================

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
        '.melk-catalogo__fondo { position: relative; overflow: hidden; padding: 72px 16px 72px; background-color: #ffffff; --melk-cuadricula-tam: 50px;',
        '  background-image: linear-gradient(45deg, #ffee26 25%, transparent 25%, transparent 75%, #ffee26 75%, #ffee26), linear-gradient(45deg, #ffee26 25%, #ffffff 25%, #ffffff 75%, #ffee26 75%, #ffee26);',
        '  background-size: var(--melk-cuadricula-tam) var(--melk-cuadricula-tam);',
        '  background-position: 0 0, calc(var(--melk-cuadricula-tam) / 2) calc(var(--melk-cuadricula-tam) / 2);',
        '  animation: melk-cuadricula 24s linear infinite; }',
        '@keyframes melk-cuadricula { from { background-position: 0 0, calc(var(--melk-cuadricula-tam) / 2) calc(var(--melk-cuadricula-tam) / 2); } to { background-position: var(--melk-cuadricula-tam) var(--melk-cuadricula-tam), calc(var(--melk-cuadricula-tam) * 1.5) calc(var(--melk-cuadricula-tam) * 1.5); } }',
        '.melk-catalogo__mascota { display: none; position: absolute; left: -20%; top: 30%; width: 130px; height: auto; z-index: 0; pointer-events: none; will-change: left, top; }',
        '.melk-catalogo__wrap { position: relative; z-index: 1; max-width: 1150px; margin: 0 auto; }',
        '.melk-catalogo .melk-headline { position: relative; z-index: 1; display: flex; justify-content: center; margin: 18px 0 22px; }',
        '.melk-catalogo .melk-headline__text { display: flex; justify-content: center; margin: 0; font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif !important; font-size: 46px; font-weight: 400; line-height: 1; color: #353535; animation: melk-titulo-loop 3s ease-in-out infinite; }',
        '@keyframes melk-titulo-loop { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.03); } }',
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
        '@media (prefers-reduced-motion: reduce) { .melk-catalogo .melk-bounce-target { opacity: 1; transform: none; transition: none; } .melk-catalogo .melk-headline__text { animation: none; } .melk-catalogo .melk-note__arrow { animation: none; transform: translate(-50%, -16px); } .melk-catalogo .melk-note:hover .melk-note__capa { animation: none; } }',
        '@media (prefers-reduced-motion: reduce) { .melk-dual__target { transform: none !important; } }',
        '@media (prefers-reduced-motion: reduce) { .melk-dual__bono { transform: translate(-50%, -50%) rotate(12deg); animation: none; } .melk-dual__bono--der { transform: translate(-50%, -50%) rotate(-12deg); } }',
        '.melk-dual { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; background-color: #ffffff; padding: 70px 0 20px; overflow: hidden; }',
        '.melk-dual__row { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 34px 0; flex-direction: column; gap: 30px; }',
        '.melk-dual__row + .melk-dual__row { margin-top: 20px; }',
        '.melk-dual__img { position: relative; flex: 0 0 auto; width: 68%; max-width: 340px; align-self: center; }',
        '.melk-dual__img--izq { margin-left: 0; }',
        '.melk-dual__img--der { margin-right: 0; order: 1; }',
        '.melk-dual__png { display: block; width: 100%; height: auto; }',
        '.melk-dual__espacio { width: 100%; }',
        '.melk-dual__texto { width: 100%; margin: 0; padding: 0 24px; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; color: #353535; text-align: center; }',
        '.melk-dual__texto--mayorista { order: 2; }',
        '.melk-dual__texto-inner { width: 100%; }',
        '.melk-dual__texto p { margin: 0; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; }',
        '.melk-dual__texto .melk-dual__texto-t1 { margin: 0; font-size: clamp(14px, 4.2vw, 18px); line-height: 1.15; white-space: nowrap; }',
        '.melk-dual__texto .melk-dual__texto-t2 { margin-top: 8px; font-size: 16px; line-height: 1.5; }',
        '.melk-dual__texto .melk-dual__texto-t3 { margin-top: 8px; font-size: 16px; line-height: 1.5; }',
        '.melk-dual__texto .melk-dual__texto-t4 { margin-top: 10px; font-size: 16px; line-height: 1.35; }',
        '.melk-dual__btn { display: flex; align-items: center; justify-content: center; margin: 10px auto 0; width: fit-content; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 19px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #fff !important; background-color: #353535 !important; border: 3px solid #353535 !important; border-radius: 100px; padding: 10px 26px 10px 40px; cursor: pointer; text-decoration: none; transition: all .2s; }',
        '.melk-dual__btn .melk-dual__btn-texto { color: #fff !important; }',
        '.melk-dual__btn:hover { background-color: #ffffff !important; color: #353535 !important; }',
        '.melk-dual__btn:hover .melk-dual__btn-texto { color: #353535 !important; }',
        '.melk-dual__btn:active { transform: scale(.95); }',
        '.melk-dual__btn svg { width: 30px; height: 30px; margin-left: 12px; transition: transform .3s ease-in-out; }',
        '.melk-dual__btn:hover svg { transform: translateX(6px); }',
        '.melk-dual__bono { position: absolute; top: 50%; left: 50%; right: auto; z-index: 2; width: auto; height: 62px; max-width: 100%; transform: translate(-50%, -50%) scale(0) rotate(12deg); transform-origin: center; pointer-events: none; }',
        '.melk-dual__bono.melk-dual__bono-in { animation: melk-dual-plop-movil 3.5s ease 1 forwards; }',
        '@keyframes melk-dual-plop-movil { 0% { transform: translate(-50%, -50%) scale(0) rotate(12deg); } 30% { transform: translate(-50%, -50%) scale(1.18) rotate(12deg); } 50% { transform: translate(-50%, -50%) scale(.96) rotate(12deg); } 70% { transform: translate(-50%, -50%) scale(1.06) rotate(12deg); } 100% { transform: translate(-50%, -50%) scale(1) rotate(12deg); } }',
        '.melk-dual__bono--der { top: 50%; left: 50%; right: auto; transform: translate(-50%, -50%) scale(0) rotate(-12deg); }',
        '.melk-dual__bono--der.melk-dual__bono-in { animation: melk-dual-plop-movil-der 3.5s ease 1 forwards; }',
        '@keyframes melk-dual-plop-movil-der { 0% { transform: translate(-50%, -50%) scale(0) rotate(-12deg); } 30% { transform: translate(-50%, -50%) scale(1.18) rotate(-12deg); } 50% { transform: translate(-50%, -50%) scale(.96) rotate(-12deg); } 70% { transform: translate(-50%, -50%) scale(1.06) rotate(-12deg); } 100% { transform: translate(-50%, -50%) scale(1) rotate(-12deg); } }',
        '.melk-dual__target { will-change: transform; }',
        '.melk-holo { position: relative; left: 50%; margin-left: -50vw; width: 100vw; box-sizing: border-box; background-color: #ffffff; overflow: hidden; font-family: \'Rubik\', system-ui, sans-serif; color: #353535; }',
        '.melk-holo__fondo { position: relative; height: 500px; }',
        '.melk-holo__mover { position: absolute; top: 45%; left: 0; width: 240px; max-width: 60vw; transform: translate(-60vw, -50%); will-change: transform; pointer-events: none; display: flex; flex-direction: column; align-items: center; }',
        '.melk-holo__personaje { position: relative; z-index: 1; width: 100%; transform: rotate(0deg); transform-origin: 50% 50%; will-change: transform; }',
        '.melk-holo__holo { position: absolute; inset: 0; z-index: 0; border-radius: 50%; background: linear-gradient(90deg, #00F0FF, #FF00F7, #FFDD00, #00FFAA, #0055FF, #FF0055, #00F0FF); background-size: 200% 100%; opacity: .35; animation: melk-holo-shimmer 12s linear infinite; }',
        '.melk-holo__png { position: relative; z-index: 1; display: block; width: 100%; height: auto; }',
        '.melk-holo__texto { position: absolute; right: 100%; top: 50%; z-index: 0; margin: 0 24px 0 0; transform: translateY(calc(-50% + .1em)); pointer-events: auto; text-decoration: none; font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: clamp(48px, 10vw, 200px); line-height: .8; letter-spacing: -.06em; color: #353535; white-space: nowrap; }',
        '.melk-holo__palabra { display: inline-block; white-space: nowrap; transition: opacity .25s ease; font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif !important; }',
        '.melk-holo__palabra--hover { position: absolute; right: 0; top: 0; opacity: 0; }',
        '.melk-holo__texto:hover .melk-holo__palabra--base { opacity: 0; }',
        '.melk-holo__texto:hover .melk-holo__palabra--hover { opacity: 1; }',
        '.melk-holo__btn { display: none; }',
        '.melk-holo__letra { display: inline-block; transform: translateY(0); transition: transform .42s cubic-bezier(.34, 1.56, .64, 1) var(--d, 0s); font-family: \'Curda Gouda\', \'matt-b\', \'Rubik\', system-ui, sans-serif !important; }',
        '.melk-holo__texto:hover .melk-holo__letra { transform: translateY(-.16em); }',
        '@keyframes melk-holo-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }',
        '.melk-holo__hint { position: absolute; left: 50%; z-index: 3; transform: translateX(-50%); pointer-events: none; animation: melk-holo-hint 1.7s ease-in-out infinite; transition: opacity .4s ease; }',
        '.melk-holo__hint::after { content: ""; display: block; width: 16px; height: 16px; border-right: 3px solid #353535; border-bottom: 3px solid #353535; transform: rotate(45deg); margin: 0 auto; }',
        '@keyframes melk-holo-hint { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 10px); } }',
        '.melk-holo__hint--top { bottom: 26px; }',
        '.melk-holo__hint--oculto { opacity: 0; }',
        '@media (max-width: 767px) { .melk-holo__hint { display: none; } }',
        '.melk-monitor-grupo { margin: 72px 0 0; }',
        '.melk-monitor { position: relative; container-type: inline-size; width: 88%; max-width: 940px; margin: 0 auto; }',
        '.melk-monitor, .melk-monitor * { font-family: \'Press Start 2P\', monospace !important; }',
        '.melk-monitor__carcasa { position: relative; box-sizing: border-box; width: 100%; background-color: #fff; border: 0.32cqw solid #353535; border-radius: 2.55cqw; padding: 1.9cqw 1.9cqw 0.85cqw; box-shadow: 0 1.5cqw 3.2cqw rgba(0,0,0,.28); }',
        '.melk-monitor__pantalla { position: relative; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; border: 0.32cqw solid #353535; border-radius: 1.5cqw; background-color: #fff; }',
        '.melk-monitor__ventana { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; background-color: #fff; overflow: hidden; }',
        '.melk-monitor__barra { position: relative; flex: 0 0 auto; display: block; padding: 1cqw 2.5cqw; background-color: #353535; }',
        '.melk-monitor__titulo { display: block; text-align: center; font-family: \'Press Start 2P\', monospace; font-size: 1.2cqw; line-height: 1.5; letter-spacing: .02em; text-transform: uppercase; color: #ffee26; white-space: nowrap; }',
        '.melk-monitor__cuerpo { position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden; background-color: #fff; }',
        '.melk-monitor__contenido { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; display: block; object-fit: cover; transform: scale(1); filter: saturate(1.4) contrast(1.08) brightness(1.34); }',
        '.melk-monitor__cambio { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0; }',
        '.melk-monitor__cambio--on { animation: melk-canal .5s steps(1) 1; }',
        '@keyframes melk-canal { 0% { opacity: 1; background: repeating-linear-gradient(0deg, #fff 0 2px, #000 2px 4px); } 20% { opacity: 1; background: repeating-linear-gradient(0deg, #000 0 3px, #fff 3px 6px); transform: translateY(4px); } 40% { opacity: 1; background: repeating-linear-gradient(90deg, #fff 0 3px, #000 3px 6px); transform: translate(-3px, -4px); } 60% { opacity: 1; background: repeating-linear-gradient(0deg, #fff 0 2px, #000 2px 5px); transform: translate(2px, 3px); } 80% { opacity: .5; background: repeating-linear-gradient(0deg, #000 0 2px, #fff 2px 4px); } 100% { opacity: 0; } }',
        '.melk-monitor__titulo-png { position: relative; text-align: center; pointer-events: none; }',
        '.melk-monitor__titulo-txt { display: inline-block; font-family: \'Press Start 2P\', monospace; font-weight: 700; font-style: italic; font-size: 8cqw; line-height: 1.15; letter-spacing: 0; color: #ffee26; text-shadow: -0.13cqw -0.13cqw 0 #ffee26, 0.13cqw -0.13cqw 0 #ffee26, -0.13cqw 0.13cqw 0 #ffee26, 0.13cqw 0.13cqw 0 #ffee26, -0.4cqw -0.4cqw 0 #353535, 0.4cqw -0.4cqw 0 #353535, -0.4cqw 0.4cqw 0 #353535, 0.4cqw 0.4cqw 0 #353535, -0.4cqw 0 0 #353535, 0.4cqw 0 0 #353535, 0 -0.4cqw 0 #353535, 0 0.4cqw 0 #353535, -0.27cqw -0.27cqw 0 #353535, 0.27cqw -0.27cqw 0 #353535, -0.27cqw 0.27cqw 0 #353535, 0.27cqw 0.27cqw 0 #353535, -0.27cqw 0 0 #353535, 0.27cqw 0 0 #353535, 0 -0.27cqw 0 #353535, 0 0.27cqw 0 #353535, 0.85cqw 0.85cqw 0 #1b1b1b; animation: melk-titulo-bob 2.2s ease-in-out infinite; }',
        '@keyframes melk-titulo-bob { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-0.43cqw) scale(1.03); } }',
        '.melk-monitor__spark { position: absolute; width: 1.8cqw; height: 1.8cqw; background: #fff; clip-path: polygon(50% 0, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0 50%, 42% 42%); filter: drop-shadow(0 0 0.2cqw #353535); pointer-events: none; will-change: transform, opacity; animation: melk-twinkle 1.5s ease-in-out infinite; }',
        '@keyframes melk-twinkle { 0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; } 50% { transform: scale(1) rotate(45deg); opacity: 1; } }',
        '.melk-monitor__hud { position: absolute; inset: 0; z-index: 4; pointer-events: none; font-family: \'Press Start 2P\', monospace; }',
        '.melk-hud { position: absolute; display: flex; align-items: center; gap: 0.85cqw; padding: 0.7cqw 1.1cqw; background-color: #353535; border: 0.27cqw solid #fff; }',
        '.melk-hud--hp { top: 1.7cqw; left: 1.7cqw; }',
        '.melk-hud--coins { top: 1.7cqw; right: 1.7cqw; }',
        '.melk-hud-wrap--score { position: absolute; bottom: 1.7cqw; left: 1.7cqw; display: inline-grid; grid-template-columns: max-content; gap: 1.1cqw; }',
        '.melk-hud-wrap--score .melk-hud { position: static; }',
        '.melk-hud__gif { display: block; width: 0; min-width: 100%; height: auto; image-rendering: pixelated; }',
        '.melk-hud__label { font-size: 1cqw; line-height: 1; letter-spacing: .05em; color: #ffee26; }',
        '.melk-hud__val { font-size: 1.4cqw; line-height: 1; letter-spacing: .1em; color: #fff; }',
        '.melk-hud__col { display: flex; flex-direction: column; gap: 0.58cqw; }',
        '.melk-hud__coin { width: 2cqw; height: 2cqw; border: 0.27cqw solid #000; border-radius: 50%; background: radial-gradient(circle, #ffee26 60%, #c9b800 61%); box-shadow: inset -0.15cqw -0.15cqw 0 #8a7d00; animation: melk-hud-coin 1.2s ease-in-out infinite; }',
        '@keyframes melk-hud-coin { 0% { transform: scaleX(1); } 50% { transform: scaleX(.1); filter: brightness(1.4); } 100% { transform: scaleX(1); } }',
        '.melk-hud__hearts { display: flex; gap: 0.43cqw; }',
        '.melk-hud__heart { width: 1.85cqw; height: 1.7cqw; background-color: #5b5b5b; clip-path: polygon(50% 15%, 65% 0%, 100% 25%, 100% 60%, 50% 100%, 0% 60%, 0% 25%, 35% 0%); transition: background-color .15s ease; }',
        '.melk-hud__heart--on { background-color: #ffee26; }',
        '.melk-monitor__glitch { position: absolute; inset: 0; z-index: 5; pointer-events: none; background-image: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,.13) 50%), linear-gradient(90deg, rgba(255,0,0,.05), rgba(0,255,0,.02), rgba(0,0,255,.05)); background-size: 100% 4px, 8px 100%; animation: melk-crt-flicker .12s infinite; }',
        '.melk-monitor__glitch::after { content: ""; position: absolute; inset: 0; box-shadow: inset 0 0 46px rgba(0,0,0,.32); }',
        '@keyframes melk-crt-flicker { 0% { opacity: .9; } 50% { opacity: 1; } 100% { opacity: .95; } }',
        '.melk-monitor__scanbar { position: absolute; left: 0; right: 0; top: 0; height: 24%; z-index: 5; pointer-events: none; background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,.18) 50%, rgba(255,255,255,0) 100%); animation: melk-crt-scanbar 8s linear infinite; }',
        '@keyframes melk-crt-scanbar { from { top: -28%; } to { top: 100%; } }',
        '.melk-monitor__controles { position: absolute; left: 50%; top: 60%; z-index: 3; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 1.9cqw; }',
        '.melk-monitor__selector { display: inline-flex; align-items: center; gap: 1.7cqw; padding: 1.28cqw 2.13cqw; background-color: #ffee26; border: 0.43cqw solid #353535; box-shadow: 0.64cqw 0.64cqw 0 #353535; font-family: \'Press Start 2P\', monospace; }',
        '.melk-monitor__cat { font-size: 2.34cqw; line-height: 1.2; color: #353535; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }',
        '.melk-monitor__flecha { display: inline-flex; align-items: center; background: none; border: 0; padding: 0; cursor: pointer; color: #353535; }',
        '.melk-monitor__flecha svg { display: block; width: 2.3cqw; height: 2.3cqw; }',
        '.melk-monitor__flecha:hover { color: #ff4566; }',
        '.melk-monitor__flecha--prev { animation: melk-game-bob-izq .85s ease-in-out infinite; }',
        '.melk-monitor__flecha--next { animation: melk-game-bob-der .85s ease-in-out infinite; }',
        '@keyframes melk-game-bob-izq { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-0.74cqw); } }',
        '@keyframes melk-game-bob-der { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(0.74cqw); } }',
        '.melk-monitor__ingresar { display: inline-block; padding: 1.28cqw 2.98cqw; background-color: #353535; border: 0.43cqw solid #ffee26; box-shadow: 0.43cqw 0.43cqw 0 #ffee26; color: #ffee26 !important; font-family: \'Press Start 2P\', monospace; font-size: 1.7cqw; letter-spacing: .06em; text-transform: uppercase; text-decoration: none !important; }',
        '.melk-monitor__ingresar:hover, .melk-monitor__ingresar:focus { background-color: #ffee26; color: #353535 !important; }',
        '.melk-monitor__ingresar:active { transform: translate(0.43cqw, 0.43cqw); box-shadow: 0 0 0 #ffee26; }',
        '.melk-monitor__panel { display: flex; align-items: center; justify-content: space-between; gap: 1.28cqw; padding: 1.5cqw 1.06cqw 0.64cqw; }',
        '.melk-monitor__ranura { display: block; width: 8.3cqw; height: 0.85cqw; border: 0.32cqw solid #353535; border-radius: 0.64cqw; background-color: #fff; }',
        '.melk-monitor__botones { display: flex; align-items: center; gap: 1.06cqw; }',
        '.melk-monitor__knob { display: block; width: 1.7cqw; height: 1.7cqw; border: 0.32cqw solid #353535; border-radius: 50%; background-color: #fff; }',
        '.melk-monitor__knob--led { background-color: #ff4566; animation: melk-monitor-led 1.6s ease-in-out infinite; }',
        '@keyframes melk-monitor-led { 0%, 100% { background-color: #ff4566; } 50% { background-color: rgba(255,69,102,0); } }',
        '@media (max-width: 639px) { .melk-monitor { width: 100%; } }',
        '@media (prefers-reduced-motion: reduce) { .melk-monitor__glitch, .melk-monitor__scanbar, .melk-monitor__cambio, .melk-monitor__flecha--prev, .melk-monitor__flecha--next, .melk-monitor__knob--led, .melk-hud__coin, .melk-monitor__titulo-txt, .melk-monitor__spark { animation: none; } }',
        '@media (prefers-reduced-motion: reduce) { .melk-holo__holo { animation: none; } .melk-holo__hint { animation: none; } .melk-holo__palabra--hover { animation: none; } }',
        '@media (min-width: 768px) {',
        '.melk-catalogo__fondo { --melk-cuadricula-tam: 100px; padding: 100px 40px 90px; }',
        '.melk-monitor-grupo { margin-top: 90px; }',
        '.melk-catalogo__mascota { display: block; width: 150px; }',
        '.melk-catalogo .melk-headline__text { font-size: 92px; }',
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
        '.melk-dual { padding: 100px 0; }',
        '.melk-dual__row { flex-direction: row; gap: 0; max-width: 1200px; margin-left: auto; margin-right: auto; }',
        '.melk-dual__row + .melk-dual__row { margin-top: 40px; }',
        '.melk-dual__img { flex: 0 0 40%; max-width: 540px; }',
        '.melk-dual__img--izq { margin-left: 9%; }',
        '.melk-dual__img--der { margin-right: 9%; order: 0; }',
        '.melk-dual__espacio { width: auto; }',
        '.melk-dual__texto { flex: 0 1 46%; max-width: 46%; margin-left: auto; margin-right: 9%; padding: 0; padding-left: 6%; transform: translateY(-10px); }',
        '.melk-dual__texto--mayorista { margin-left: 9%; margin-right: auto; padding-left: 0; padding-right: 6%; order: 0; }',
        '.melk-dual__texto-inner { width: fit-content; max-width: 100%; margin: 0 auto; }',
        '.melk-dual__texto .melk-dual__texto-t1 { font-size: clamp(19px, 2.1vw, 28px); }',
        '.melk-dual__texto .melk-dual__texto-t2 { font-size: 19px; }',
        '.melk-dual__texto .melk-dual__texto-t3 { font-size: 19px; }',
        '.melk-dual__texto .melk-dual__texto-t4 { font-size: 19px; }',
        '.melk-dual__btn { font-size: 21px; padding: 12px 30px 12px 46px; margin-top: 20px; }',
        '.melk-dual__bono { top: -3.5%; right: -6%; left: auto; transform: scale(0) rotate(12deg); }',
        '.melk-dual__bono.melk-dual__bono-in { animation: melk-dual-plop 1s ease 1 forwards; }',
        '.melk-dual__bono--der { top: -3.5%; left: -6%; right: auto; transform: scale(0) rotate(-12deg); }',
        '.melk-dual__bono--der.melk-dual__bono-in { animation: melk-dual-plop-der 1s ease 1 forwards; }',
        '@keyframes melk-dual-plop { 0% { transform: scale(0) rotate(12deg); } 35% { transform: scale(1.18) rotate(12deg); } 55% { transform: scale(.96) rotate(12deg); } 75% { transform: scale(1.06) rotate(12deg); } 100% { transform: scale(1) rotate(12deg); } }',
        '@keyframes melk-dual-plop-der { 0% { transform: scale(0) rotate(-12deg); } 35% { transform: scale(1.18) rotate(-12deg); } 55% { transform: scale(.96) rotate(-12deg); } 75% { transform: scale(1.06) rotate(-12deg); } 100% { transform: scale(1) rotate(-12deg); } }',
        '@media (prefers-reduced-motion: reduce) { .melk-dual__bono { transform: rotate(12deg); } .melk-dual__bono--der { transform: rotate(-12deg); } }',
        '.melk-holo__fondo { height: 640px; }',
        '}',
        '@media (max-width: 767px) {',
        '.melk-holo__fondo { height: auto; padding: 34px 0 70px; }',
        '.melk-holo__mover { position: relative; top: auto; left: 50%; transform: translateX(-50%); gap: 30px; }',
        '.melk-holo__personaje { order: 1; }',
        '.melk-holo__texto { position: static; order: 2; margin: 0; right: auto; top: auto; transform: none; text-align: center; font-size: clamp(36px, 12vw, 56px); display: flex; flex-direction: column; align-items: center; gap: 18px; }',
        '.melk-holo__palabra--base { position: static; opacity: 1; }',
        '.melk-holo__palabra--hover { display: none; }',
        '.melk-holo__letra { transition: none !important; transform: none !important; }',
        '.melk-holo__texto:hover .melk-holo__letra { transform: none !important; }',
        '.melk-holo__texto:hover .melk-holo__palabra--base { opacity: 1 !important; }',
        '.melk-holo__btn { display: flex; align-items: center; justify-content: center; width: fit-content; font-family: \'vinyl\', \'matt-b\', \'Rubik\', system-ui, sans-serif; font-size: 19px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #fff !important; background-color: #353535 !important; border: 3px solid #353535 !important; border-radius: 100px; padding: 12px 28px 12px 42px; cursor: pointer; text-decoration: none; transition: all .2s; }',
        '.melk-holo__btn .melk-holo__btn-texto { color: #fff !important; }',
        '.melk-holo__btn:hover { background-color: #ffffff !important; color: #353535 !important; }',
        '.melk-holo__btn:hover .melk-holo__btn-texto { color: #353535 !important; }',
        '.melk-holo__btn:active { transform: scale(.95); }',
        '.melk-holo__btn svg { width: 30px; height: 30px; margin-left: 12px; transition: transform .3s ease-in-out; }',
        '.melk-holo__btn:hover svg { transform: translateX(6px); }',
        '}',
        '@keyframes melk-holo-cta { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }'
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
    if (!document.getElementById('melk-font-8bit')) {
        var f8bit = document.createElement('link');
        f8bit.id = 'melk-font-8bit';
        f8bit.rel = 'stylesheet';
        f8bit.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        document.head.appendChild(f8bit);
    }
    if (!document.getElementById('melk-pixel-svg')) {
        var pixelSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pixelSvg.id = 'melk-pixel-svg';
        pixelSvg.setAttribute('width', '0');
        pixelSvg.setAttribute('height', '0');
        pixelSvg.setAttribute('aria-hidden', 'true');
        pixelSvg.style.position = 'absolute';
        pixelSvg.style.width = '0';
        pixelSvg.style.height = '0';
        pixelSvg.innerHTML = '<filter id="melk-pixel" x="0" y="0">'
            + '<feFlood x="2" y="2" width="1" height="1" />'
            + '<feComposite width="4" height="4" />'
            + '<feTile result="melk-grid" />'
            + '<feComposite in="SourceGraphic" in2="melk-grid" operator="in" />'
            + '<feMorphology operator="dilate" radius="1.5" />'
            + '</filter>';
        (document.body || document.documentElement).appendChild(pixelSvg);
    }

    // ---------------- RENDER ----------------
    function renderTitulo(title) {
        return '<div class="melk-headline melk-bounce-target"><p class="melk-headline__text">' + title + '</p></div>';
    }

    function renderMonitor() {
        var c = MONITOR_CATEGORIAS[0] || { nombre: '', img: '' };
        return '<div class="melk-monitor melk-bounce-target" data-bounce="0.7">'
            + '<div class="melk-monitor__carcasa">'
            + '<div class="melk-monitor__pantalla">'
            + '<div class="melk-monitor__ventana">'
            + '<div class="melk-monitor__barra">'
            + '<span class="melk-monitor__titulo">' + MONITOR_BARRA_TEXTO + '</span>'
            + '</div>'
            + '<div class="melk-monitor__cuerpo">'
            + '<img class="melk-monitor__contenido" src="' + c.img + '" alt="">'
            + '<div class="melk-monitor__cambio"></div>'
            + '<div class="melk-monitor__hud">'
            + '<div class="melk-hud melk-hud--hp"><span class="melk-hud__label">HP:</span><span class="melk-hud__hearts"><span class="melk-hud__heart"></span><span class="melk-hud__heart"></span><span class="melk-hud__heart"></span><span class="melk-hud__heart"></span><span class="melk-hud__heart"></span></span></div>'
            + '<div class="melk-hud melk-hud--coins"><span class="melk-hud__coin"></span><span class="melk-hud__col"><span class="melk-hud__label">COINS</span><span class="melk-hud__val">99</span></span></div>'
            + '<div class="melk-hud-wrap melk-hud-wrap--score"><img class="melk-hud__gif" src="https://d22fxaf9t8d39k.cloudfront.net/13219b62c3a4bdf4f71927c8dbcdd50a06a4a3b7a499ec57fcdefb86861e303020700.gif" alt=""><div class="melk-hud melk-hud--score"><span class="melk-hud__label">PUNTAJE</span><span class="melk-hud__val" data-hud="score">000000</span></div></div>'
            + '</div>'
            + '<div class="melk-monitor__controles">'
            + '<div class="melk-monitor__titulo-png"><span class="melk-monitor__titulo-txt">' + TITULO_MONITOR + '</span></div>'
            + '<div class="melk-monitor__selector">'
            + '<button type="button" class="melk-monitor__flecha melk-monitor__flecha--prev" aria-label="Categoría anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 5 8 12 15 19"></polyline></svg></button>'
            + '<span class="melk-monitor__cat">' + c.nombre + '</span>'
            + '<button type="button" class="melk-monitor__flecha melk-monitor__flecha--next" aria-label="Categoría siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 5 16 12 9 19"></polyline></svg></button>'
            + '</div>'
            + '<a class="melk-monitor__ingresar" href="' + (c.link || '/productos') + '">Ingresar</a>'
            + '</div>'
            + '</div>'
            + '<div class="melk-monitor__glitch"></div>'
            + '<div class="melk-monitor__scanbar"></div>'
            + '</div>'
            + '</div>'
            + '<div class="melk-monitor__panel">'
            + '<span class="melk-monitor__ranura"></span>'
            + '<div class="melk-monitor__botones">'
            + '<span class="melk-monitor__knob"></span>'
            + '<span class="melk-monitor__knob"></span>'
            + '<span class="melk-monitor__knob melk-monitor__knob--led"></span>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }

    function renderGrupoMonitor() {
        return '<div class="melk-monitor-grupo">'
            + renderMonitor()
            + '</div>';
    }

    function generarDestellos(cont) {
        if (!cont) return;
        for (var s = 0; s < 9; s++) {
            var sp = document.createElement('span');
            sp.className = 'melk-monitor__spark';
            (function (el) {
                function ubicar() {
                    el.style.left = (4 + Math.random() * 92) + '%';
                    el.style.top = (-30 + Math.random() * 120) + '%';
                    el.style.animationDelay = (-Math.random() * 1.6) + 's';
                    el.style.animationDuration = (1 + Math.random() * 1.2) + 's';
                    var w = 1.1 + Math.random() * 1.5;
                    el.style.width = w + 'cqw';
                    el.style.height = w + 'cqw';
                }
                el.addEventListener('animationiteration', ubicar);
                ubicar();
            })(sp);
            cont.appendChild(sp);
        }
    }

    function initMonitor() {
        var mon = seccion.querySelector('.melk-monitor');
        if (!mon || !MONITOR_CATEGORIAS.length) return;
        var img = mon.querySelector('.melk-monitor__contenido');
        var cat = mon.querySelector('.melk-monitor__cat');
        var ingresar = mon.querySelector('.melk-monitor__ingresar');
        var prev = mon.querySelector('.melk-monitor__flecha--prev');
        var next = mon.querySelector('.melk-monitor__flecha--next');
        var cambio = mon.querySelector('.melk-monitor__cambio');
        generarDestellos(mon.querySelector('.melk-monitor__titulo-png'));
        var hearts = mon.querySelectorAll('.melk-hud__heart');
        var scoreEl = mon.querySelector('[data-hud="score"]');
        var i = 0;
        var hp = 2;
        var score = 0;
        function pad(n, len) { var s = String(n); while (s.length < len) { s = '0' + s; } return s; }
        function pintarHud() {
            for (var k = 0; k < hearts.length; k++) {
                if (k < hp) { hearts[k].classList.add('melk-hud__heart--on'); }
                else { hearts[k].classList.remove('melk-hud__heart--on'); }
            }
            if (scoreEl) scoreEl.textContent = pad(score, 6);
        }
        function pintar() {
            var c = MONITOR_CATEGORIAS[i];
            if (img) { if (c.img) img.src = c.img; img.style.transform = 'scale(' + (c.zoom || 1) + ')'; }
            if (cat) cat.textContent = c.nombre;
            if (ingresar) ingresar.setAttribute('href', c.link || '/productos');
        }
        function mover(d) {
            i = (i + d + MONITOR_CATEGORIAS.length) % MONITOR_CATEGORIAS.length;
            score += 250;
            if (hp < hearts.length) hp++;
            pintarHud();
            if (cambio) {
                cambio.classList.remove('melk-monitor__cambio--on');
                void cambio.offsetWidth;
                cambio.classList.add('melk-monitor__cambio--on');
                setTimeout(pintar, 130);
            } else {
                pintar();
            }
        }
        if (prev) prev.addEventListener('click', function () { mover(-1); });
        if (next) next.addEventListener('click', function () { mover(1); });
        pintar();
        pintarHud();
    }

    // Posicion vertical de un elemento relativa a un ancestro posicionado (ignora transforms).
    function offsetRelativo(el, raiz) {
        var y = 0;
        var n = el;
        while (n && n !== raiz) {
            y += n.offsetTop;
            n = n.offsetParent;
        }
        return y;
    }

    // Iguala la separacion "onda superior -> COMPRA YA" con "CATALOGO -> ultima caja".
    function ajustarGrupoMonitor() {
        var grupo = seccion.querySelector('.melk-monitor-grupo');
        var lista = seccion.querySelector('.melk-list');
        var wrap = seccion.querySelector('.melk-catalogo__wrap');
        if (!grupo || !lista || !wrap) return;
        var base = (window.matchMedia && window.matchMedia('(min-width: 768px)').matches) ? 90 : 72;
        var listaB = offsetRelativo(lista, wrap) + lista.offsetHeight;
        var maxB = listaB;
        var cards = lista.querySelectorAll('.melk-note__card');
        for (var k = 0; k < cards.length; k++) {
            var b = offsetRelativo(cards[k], wrap) + cards[k].offsetHeight;
            if (b > maxB) maxB = b;
        }
        grupo.style.marginTop = Math.round(base + (maxB - listaB)) + 'px';
    }

    // Iguala el espacio "onda superior -> titulo" con "titulo -> primera caja".
    function ajustarHeadline() {
        var fondo = seccion.querySelector('.melk-catalogo__fondo');
        var onda = seccion.querySelector('.melk-onda--top');
        var head = seccion.querySelector('.melk-headline');
        var card = seccion.querySelector('.melk-note__card-inner');
        if (!fondo || !onda || !head || !card) return;
        if (head.dataset.mmBase === undefined) {
            head.dataset.mmBase = parseFloat(window.getComputedStyle(head).marginTop) || 0;
        }
        var base = parseFloat(head.dataset.mmBase) || 0;
        var ondaB = offsetRelativo(onda, fondo) + onda.offsetHeight;
        var headT = offsetRelativo(head, fondo);
        var arriba = headT - ondaB;
        var abajo = offsetRelativo(card, fondo) - (headT + head.offsetHeight);
        head.style.marginTop = Math.round(Math.max(0, base + (abajo - arriba))) + 'px';
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
    var ONDA_TOP = '<div class="melk-onda melk-onda--top" style="position:absolute;top:0;left:0;right:0;height:18px;pointer-events:none;background-repeat:repeat-x;background-size:26px 18px;background-position:0 0;animation:mmOnda 1.5s linear infinite;background-image:url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2226%22 height=%2218%22><path d=%22M0 12 Q6.5 7 13 12 T26 12 L26 0 L0 0 Z%22 fill=%22%23ffffff%22/><path d=%22M0 12 Q6.5 7 13 12 T26 12%22 fill=%22none%22 stroke=%22%23353535%22 stroke-width=%223%22 stroke-linecap=%22round%22/></svg>\');"></div>';
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
        + renderTitulo(TITULO_CATALOGO)
        + '<ul class="melk-list">' + lista + '</ul>'
        + renderGrupoMonitor()
        + '</div>'
        + '</div>';

    // ---------------- BLOQUE AGREGADO (PERSONALIZADOS / MAYORISTA) ----------------
    var PNG_PERSONALIZADOS = 'https://d22fxaf9t8d39k.cloudfront.net/57608062870301647f3403c21081f04df6de9e96628d6d1b2a805b1f49d0f59920700.png';
    var PNG_MAYORISTA = 'https://d22fxaf9t8d39k.cloudfront.net/93620b539094d29f9e440936b202fec6029413adf9de377258c87dba28fabc9120700.png';
    var PNG_BONO = 'https://d22fxaf9t8d39k.cloudfront.net/195c8b64bf4c0b8ca087f7458890a2f8fab6a0e96ac49e8b2415e80f1a68d52720700.png';
    var PNG_BONO_MAYORISTA = 'https://d22fxaf9t8d39k.cloudfront.net/82ae0816b6c737f82ff7e5e412359fc41e6dcf829c5a24a904d1945e85ad2d5520700.png';
    // BOTON ¡QUIERO! - pegá aca el link (ej: 'https://www.melmakalcos.com.ar/...'). Mientras empiece con URL_ el boton no navega.
    var LINK_QUIERO = 'URL_REEMPLAZAR_LINK_QUIERO';

    var dual = document.createElement('div');
    dual.className = 'melk-dual';
    dual.id = 'melk-dual';
    dual.innerHTML =
        '<div class="melk-dual__row">'
        + '<div class="melk-dual__img melk-dual__img--izq melk-dual__target melk-dual__target--izq">'
        + '<img class="melk-dual__png" src="' + PNG_PERSONALIZADOS + '" alt="Personalizados">'
        + '<img class="melk-dual__bono" src="' + PNG_BONO + '" alt="">'
        + '</div>'
        + '<div class="melk-dual__espacio melk-dual__texto">'
        + '<div class="melk-dual__texto-inner">'
        + '<p class="melk-dual__texto-t1">CONVERTIMOS TUS IMÁGENES EN STICKERS</p>'
        + '<p class="melk-dual__texto-t2">FOTOS FAMILIARES, DE TUS MASCOTAS. ¡LO QUE QUIERAS!</p>'
        + '<p class="melk-dual__texto-t3">¿TENÉS UN EMPRENDIMIENTO Y QUERÉS STICKERS CON TU LOGO?</p>'
        + '<p class="melk-dual__texto-t4">¡IMPRIMIMOS TUS DISEÑOS DESDE 1 UNIDAD!</p>'
        + '<a class="melk-dual__btn" href="https://www.melmakalcos.com.ar/personalizados">'
        + '<span class="melk-dual__btn-texto">¡QUIERO!</span>'
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="12" x2="20" y2="12"></line><polyline points="12 4 20 12 12 20"></polyline></svg>'
        + '</a>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="melk-dual__row">'
        + '<div class="melk-dual__espacio melk-dual__texto melk-dual__texto--mayorista">'
        + '<div class="melk-dual__texto-inner">'
        + '<p class="melk-dual__texto-t1">MULTIPLICÁ TU PLATA</p>'
        + '<p class="melk-dual__texto-t2">AHORRÁ TIEMPO Y TRABAJÁ CON NUESTRO CATÁLOGO.</p>'
        + '<p class="melk-dual__texto-t3">IDEAL SI TENÉS UN LOCAL O ESTÁS PARTICIPANDO EN FERIAS/EVENTOS.</p>'
        + '<a class="melk-dual__btn" href="https://www.melmakalcos.com.ar/mayorista">'
        + '<span class="melk-dual__btn-texto">¡QUIERO!</span>'
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="12" x2="20" y2="12"></line><polyline points="12 4 20 12 12 20"></polyline></svg>'
        + '</a>'
        + '</div>'
        + '</div>'
        + '<div class="melk-dual__img melk-dual__img--der melk-dual__target melk-dual__target--der">'
        + '<img class="melk-dual__png" src="' + PNG_MAYORISTA + '" alt="Mayorista">'
        + '<img class="melk-dual__bono melk-dual__bono--der" src="' + PNG_BONO_MAYORISTA + '" alt="">'
        + '</div>'
        + '</div>'
        + '<div class="melk-holo__hint melk-holo__hint--top"></div>'
        + '</div>';

    // ---------------- BLOQUE HOLO (debajo de todo) ----------------
    // Fondo blanco con la mascota que aparece girando al hacer scroll.
    var PNG_HOLO = 'https://d22fxaf9t8d39k.cloudfront.net/4fbeab78973904aded3e9a7b1112ed4dd2874bf4d2ac72fc47e56dc145ea04ff20700.png';
    var TEXTO_HOLO = 'HOLOGRÁFICOS';
    var TEXTO_HOLO_HOVER = '>>>>>>CATÁLOGO';
    function generarLetrasHolo(txt) {
        var out = '';
        for (var li = 0; li < txt.length; li++) {
            var c = txt.charAt(li);
            if (c === ' ') c = '&nbsp;';
            out += '<span class="melk-holo__letra" style="--d:' + (li * 0.04).toFixed(2) + 's">' + c + '</span>';
        }
        return out;
    }
    var letrasHolo = generarLetrasHolo(TEXTO_HOLO);
    var letrasHoloHover = generarLetrasHolo(TEXTO_HOLO_HOVER);
    // LINK del texto HOLO - pegar aca el link (ej: 'https://...'). Mientras empiece con URL_ no navega.
    var LINK_HOLO = 'URL_LINK_HOLO';
    var holo = document.createElement('div');
    holo.className = 'melk-holo';
    holo.id = 'melk-holo';
    holo.innerHTML =
        '<div class="melk-holo__fondo">'
        + '<div class="melk-holo__mover">'
        + '<a class="melk-holo__texto" href="https://www.melmakalcos.com.ar/holograficos">'
        + '<span class="melk-holo__palabra melk-holo__palabra--base">' + letrasHolo + '</span>'
        + '<span class="melk-holo__palabra melk-holo__palabra--hover">' + letrasHoloHover + '</span>'
        + '<span class="melk-holo__btn"><span class="melk-holo__btn-texto">CATÁLOGO</span>'
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="12" x2="20" y2="12"></line><polyline points="12 4 20 12 12 20"></polyline></svg>'
        + '</span>'
        + '</a>'
        + '<div class="melk-holo__personaje">'
        + '<div class="melk-holo__holo"></div>'
        + '<img class="melk-holo__png" src="' + PNG_HOLO + '" alt="Mascota">'
        + '</div>'
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
        seccion.parentNode.insertBefore(dual, seccion.nextSibling);
        seccion.parentNode.insertBefore(holo, dual.nextSibling);

        // Si el link de los botones ¡QUIERO! es todavia placeholder, no navegan
        var botonesQuiero = dual.querySelectorAll('.melk-dual__btn');
        for (var q = 0; q < botonesQuiero.length; q++) {
            if ((botonesQuiero[q].getAttribute('href') || '').indexOf('URL_') === 0) {
                botonesQuiero[q].addEventListener('click', function (e) { e.preventDefault(); });
                botonesQuiero[q].removeAttribute('href');
            }
        }

        // Si el link del texto HOLO es todavia placeholder, no navega
        var enlaceHolo = holo.querySelector('.melk-holo__texto');
        if (enlaceHolo && (enlaceHolo.getAttribute('href') || '').indexOf('URL_') === 0) {
            enlaceHolo.addEventListener('click', function (e) { e.preventDefault(); });
            enlaceHolo.removeAttribute('href');
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

    // ---------------- ANIMACION DEL BLOQUE AGREGADO (atada al scroll, suave y reversible) ----------------
    // La posicion objetivo se calcula por scroll, pero el PNG va "persiguiendo"
    // esa posicion con un amortiguador (lerp), asi el movimiento es fluido y
    // no violento. Al bajar entra deslizandose desde el borde real de la pantalla;
    // al subir vuelve a salir. Sin difuminado ni opacidad, con leve inclinacion.
    var dualFilas = [];
    var dualVinculado = false;
    var dualCorriendo = false;
    function aplicarDual() {
        var vh = window.innerHeight || 1;
        var llegada = vh * 0.35; // punto del viewport donde el PNG termina de entrar
        var activo = false;
        for (var f = 0; f < dualFilas.length; f++) {
            var fl = dualFilas[f];
            if (!fl || !fl.target) continue;
            var rect = fl.fila.getBoundingClientRect();
            var tp = Math.max(0, Math.min(1, (vh - rect.top) / (vh - llegada)));
            fl.cur += (tp - fl.cur) * 0.10; // amortiguador: ~10% por frame
            if (fl.cur < 0.003 && tp === 0) fl.cur = 0;
            if (Math.abs(tp - fl.cur) > 0.004) activo = true;
            var off = 130 * (1 - fl.cur);
            var dir = fl.target.classList.contains('melk-dual__target--izq') ? -1 : 1;
            fl.target.style.transform = 'translateX(' + dir * off + '%) rotate(' + (dir === -1 ? -4 : 4) + 'deg)';
            if (fl.bono && !fl.bonoDone && tp >= 0.98) {
                fl.bonoDone = true;
                fl.bono.classList.add('melk-dual__bono-in');
            }
        }
        if (activo) {
            requestAnimationFrame(aplicarDual);
        } else {
            dualCorriendo = false;
        }
    }
    function pedirDual() {
        if (!dualFilas.length) {
            var filas = dual.querySelectorAll('.melk-dual__row');
            for (var i = 0; i < filas.length; i++) {
                var t = filas[i].querySelector('.melk-dual__target');
                var b = filas[i].querySelector('.melk-dual__bono');
                dualFilas.push({ fila: filas[i], target: t, cur: 0, bono: b, bonoDone: false });
            }
        }
        if (!dualCorriendo) {
            dualCorriendo = true;
            requestAnimationFrame(aplicarDual);
        }
    }
    function animarDual() {
        if (!dual.parentNode) return;
        var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var todos = dual.querySelectorAll('.melk-dual__target');
        if (reducido || !('requestAnimationFrame' in window)) {
            for (var i = 0; i < todos.length; i++) {
                todos[i].style.transform = '';
                var bono = todos[i].querySelector('.melk-dual__bono');
                if (bono) bono.classList.add('melk-dual__bono-in');
            }
            return;
        }
        if (dualVinculado) { pedirDual(); return; }
        dualVinculado = true;
        window.addEventListener('scroll', pedirDual, { passive: true });
        window.addEventListener('resize', pedirDual);
        pedirDual();
    }

    // ---------------- ANIMACION DEL PERSONAJE HOLO (misma sensibilidad que el dual) ----------------
    // La mascota entra girando desde fuera de pantalla (izquierda) hacia un
    // margen a la derecha, atada al scroll con el mismo lerp/damping del dual.
    var holoMover = null;
    var holoPersonaje = null;
    var holoTexto = null;
    var holoCur = 0;
    var holoVinculado = false;
    var holoCorriendo = false;
    var HOLO_INICIO = -60;  // vw, fuera de pantalla (izquierda)
    var HOLO_FIN = 76;      // vw, posicion final (se recalcula para centrar)
    function esMovilHolo() {
        return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    }
    // Centra horizontalmente el grupo (texto + circulo). El texto cuelga a la
    // izquierda del circulo, asi que corregimos la posicion final segun el
    // ancho real del texto: mover.left = 0.5*vw - 108 + textW/2.
    function medirHolo() {
        if (!holoTexto) return;
        var vw = window.innerWidth || 1;
        var textW = holoTexto.getBoundingClientRect().width;
        HOLO_FIN = 50 + (textW / 2 - 108) / vw * 100;
    }
    function aplicarHolo() {
        if (esMovilHolo()) {
            holoMover.style.transform = 'translateX(-50%)';
            holoPersonaje.style.transform = 'rotate(0deg)';
            holoCorriendo = false;
            return;
        }
        var vh = window.innerHeight || 1;
        var llegada = vh * 0.35;
        var rect = holo.getBoundingClientRect();
        var tp = Math.max(0, Math.min(1, (vh - rect.top) / (vh - llegada)));
        holoCur += (tp - holoCur) * 0.10;
        if (holoCur < 0.003 && tp === 0) holoCur = 0;
        var activo = Math.abs(tp - holoCur) > 0.004;
        var x = HOLO_INICIO + (HOLO_FIN - HOLO_INICIO) * holoCur;
        var rot = -360 * holoCur;
        holoMover.style.transform = 'translate(' + x + 'vw, -50%)';
        holoPersonaje.style.transform = 'rotate(' + rot + 'deg)';
        if (activo) {
            requestAnimationFrame(aplicarHolo);
        } else {
            holoCorriendo = false;
        }
    }
    function pedirHolo() {
        if (!holoCorriendo) {
            holoCorriendo = true;
            requestAnimationFrame(aplicarHolo);
        }
    }
    function animarHolo() {
        if (!holo.parentNode) return;
        holoMover = holo.querySelector('.melk-holo__mover');
        holoPersonaje = holo.querySelector('.melk-holo__personaje');
        holoTexto = holo.querySelector('.melk-holo__texto');
        if (!holoMover || !holoPersonaje) return;
        var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (esMovilHolo()) {
            holoMover.style.transform = 'translateX(-50%)';
            holoPersonaje.style.transform = 'rotate(0deg)';
            return;
        }
        medirHolo();
        if (reducido || !('requestAnimationFrame' in window)) {
            holoMover.style.transform = 'translate(' + HOLO_FIN + 'vw, -50%)';
            holoPersonaje.style.transform = 'rotate(0deg)';
            return;
        }
        if (holoVinculado) { pedirHolo(); return; }
        holoVinculado = true;
        function alRedimensionar() { medirHolo(); pedirHolo(); }
        window.addEventListener('scroll', pedirHolo, { passive: true });
        window.addEventListener('resize', alRedimensionar);
        // Recalculo cuando carga la tipografia (cambia el ancho del texto).
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { medirHolo(); pedirHolo(); });
        }
        pedirHolo();
    }

    // ---------------- FLECHAS GUIA (se ocultan al escrollear) ----------------
    var hintHoloVinculado = false;
    function aplicarHintHolo() {
        var vh = window.innerHeight || 1;
        var hints = document.querySelectorAll('.melk-holo__hint');
        for (var i = 0; i < hints.length; i++) {
            var r = hints[i].getBoundingClientRect();
            var ocultar = r.top < vh * 0.35;
            if (ocultar) hints[i].classList.add('melk-holo__hint--oculto');
            else hints[i].classList.remove('melk-holo__hint--oculto');
        }
    }
    function animarHintHolo() {
        if (hintHoloVinculado) { aplicarHintHolo(); return; }
        hintHoloVinculado = true;
        window.addEventListener('scroll', aplicarHintHolo, { passive: true });
        window.addEventListener('resize', aplicarHintHolo);
        aplicarHintHolo();
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
            + renderTitulo(TITULO_CATALOGO)
            + '<ul class="melk-list">' + lista + '</ul>'
            + renderGrupoMonitor()
            + '</div>'
            + '</div>';
        animarEntrada();
        efectoPaso();
        animarMascota();
        animarDual();
        animarHolo();
        initMonitor();
        ajustarGrupoMonitor();
        ajustarHeadline();
    }

    var primeraCarga = true;
    window.addEventListener('pageshow', function (e) {
        if (primeraCarga) { primeraCarga = false; return; }
        if (e.persisted) { location.reload(); return; }
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
        var YMIN = 6, YMAX = 80;      // recorre todo el alto de la seccion
        var dir = 1;
        var x = XMIN;
        var yIni = 30, yFin = 30;
        var fuera = false;
        var tFuera = 0;
        var prev = performance.now();
        m.style.transform = 'scaleX(1)';
        var fondoEl = seccion.querySelector('.melk-catalogo__fondo');
        function zonaVisible() {
            var el = fondoEl || seccion;
            var r = el.getBoundingClientRect();
            var vh = window.innerHeight || document.documentElement.clientHeight;
            if (!r.height) return [YMIN, YMAX];
            var a = (0 - r.top) / r.height * 100;
            var b = (vh - r.top) / r.height * 100;
            a = Math.max(YMIN, Math.min(YMAX, a));
            b = Math.max(YMIN, Math.min(YMAX, b));
            if (b - a < 12) { var m = (a + b) / 2; a = Math.max(YMIN, m - 6); b = Math.min(YMAX, m + 6); }
            return [a, b];
        }
        function nuevaAltura() {
            var z = zonaVisible();
            yIni = z[0] + Math.random() * (z[1] - z[0]);
            yFin = z[0] + Math.random() * (z[1] - z[0]);
        }
        nuevaAltura();
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
                    var t = (x - XMIN) / (XMAX - XMIN);
                    if (dir === -1) t = 1 - t;
                    m.style.left = x + '%';
                    m.style.top = (yIni + (yFin - yIni) * t + Math.sin(now / 850) * 4) + '%';
                }
            } else if (now - tFuera >= ESPERA) {
                dir = -dir;
                x = dir === 1 ? XMIN : XMAX;
                nuevaAltura();
                m.style.transform = dir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
                m.style.opacity = '1';
                m.style.left = x + '%';
                m.style.top = yIni + '%';
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
        animarDual();
        animarHolo();
        animarHintHolo();
        initMonitor();
        ajustarGrupoMonitor();
        ajustarHeadline();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
    window.addEventListener('load', function () { ajustarGrupoMonitor(); ajustarHeadline(); });
    window.addEventListener('resize', function () { ajustarGrupoMonitor(); ajustarHeadline(); });
})();
