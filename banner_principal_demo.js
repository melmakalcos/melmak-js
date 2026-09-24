/* =========================================================
   MELMAK — BANNER PRINCIPAL
   ========================================================= */
(function () {
    'use strict';

    /* ================= EDITAR AQUÍ ================= */
    var TEXTO = {
        kicker: 'DESDE 2019',
        titulo1: 'STICKERS A',
        titulo2: 'TODOOOOO',
        mascotaHero: 'https://d22fxaf9t8d39k.cloudfront.net/32a146df3262dead0f0c6a6aee6dcfae086f161190028d5dec69bf9c5dddef9d20700.gif',
        mascotaBadge: 'https://d22fxaf9t8d39k.cloudfront.net/5c67b581a148da49d456922995b062d64df5987af4977d6a41703d4a2b065cfd20700.gif'
    };
    var POSTS = [
        {
            nombre: '¿SON RESISTENTES?',
            pregunta: 'SÍ, NUESTROS STICKERS ESTÁN IMPRESOS CON TINTAS UV. SON RESISTENTES AL AGUA\nY SOL. (ALCOHOL, PRODUCTOS DE LIMPIEZA)'
        },
        {
            nombre: '¿DÓNDE PUEDO PEGARLOS?',
            pregunta: 'CELULARES, NOTEBOOKS, TERMOS, MOTOS, AUTOS, VIDRIO...\n¡DONDE QUIERAS!'
        },
        {
            nombre: '¿HACEN ENVÍOS?',
            pregunta: 'HACEMOS ENVÍOS A TODO EL PAÍS.\nPODÉS RETIRAR EN MORÓN (CENTRO)\nBUENOS AIRES'
        }
    ];
    /* Fotos del carrusel. Reemplazar "src" por las fotos reales y "sticker"
       por la URL del PNG superpuesto (opcional; dejar '' para no mostrar). */
    var FOTOS = [
        { src: 'https://d22fxaf9t8d39k.cloudfront.net/b2caa17a5655c9e1148c53a589e5e4131a2e31649329d59af688697e45a5c76f20700.png', alt: 'Trabajo MELMAK 1', sticker: '' },
        { src: 'https://d22fxaf9t8d39k.cloudfront.net/76fcbcd4c93bb52718e518ec5149e5c2da84c8a9414d91ea0bf589b325843b8320700.png', alt: 'Trabajo MELMAK 2', sticker: '' },
        { src: 'https://d22fxaf9t8d39k.cloudfront.net/c94296280a7cf92cdc354c16be1c15de80aede99e289905e99d5848c18cf983520700.png', alt: 'Trabajo MELMAK 3', sticker: '' },
        { src: 'https://d22fxaf9t8d39k.cloudfront.net/debcef30e89655b29276de0dd0387d1788594d58837bcd56e108e5cd3e6a95b320700.png', alt: 'Trabajo MELMAK 4', sticker: '' },
        { src: 'https://d22fxaf9t8d39k.cloudfront.net/348a1c033a7b4f9a7341a9c279721277827e972306ea6ce35b2750a3cdda402020700.png', alt: 'Trabajo MELMAK 5', sticker: '' }
    ];
    var COLOR_BG = '#ffee26';
    var COLOR_INK = '#353535';
    var CURDA_URL = 'https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@51a89bfb88809c8675480f42147afd66d90c6f19/Curda%20Gouda.ttf';
    /* ================================================ */

    var root = document.getElementById('melmak-bbs-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'melmak-bbs-root';
        document.body.appendChild(root);
    }
    if (root.dataset.melmakBbs) return;
    root.dataset.melmakBbs = '1';

    var style = document.createElement('style');
    style.textContent = [
        '@import url("https://use.typekit.net/tdt2nii.css");',
        '@font-face{font-family:"Curda Gouda";src:url("' + CURDA_URL + '") format("truetype");font-weight:400;font-style:normal;font-display:swap;}',
        '@font-face{font-family:"Curda Gouda";src:url("' + CURDA_URL + '") format("truetype");font-weight:700;font-style:normal;font-display:swap;}',
        '#melmak-bbs{--bg:' + COLOR_BG + ';--ink:' + COLOR_INK + ';',
        '  position:relative;z-index:1;color:var(--ink);',
        '  font-family:Rubik,Arial,sans-serif;',
        '  overflow-x:clip;overflow-y:visible;}',
        '#melmak-bbs,#melmak-bbs *{box-sizing:border-box;}',
        /* ---------- Panel principal ---------- */
        '.mbbs-panel{position:absolute;top:0;bottom:0;left:-40px;right:-40px;z-index:0;',
        '  pointer-events:none;overflow:hidden;',
        '  background-color:var(--bg);',
        '  border-radius:26px;}',
        '#melmak-bbs__inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;',
        '  padding:clamp(24px,3.5vw,54px) 20px clamp(30px,5vw,60px);}',
        '#melmak-bbs__scroll-block,#melmak-bbs__carrusel,#melmak-bbs__post,#melmak-bbs__head{will-change:opacity,transform;}',
        /* ---------- Carrusel (franja #353535) ---------- */
        '#melmak-bbs__carrusel{position:relative;z-index:3;width:100%;background:var(--ink);display:flex;align-items:center;padding:16px 0;white-space:nowrap;}',
        '.mbbs-carrusel-clip{width:100%;overflow:hidden;}',
        '#melmak-bbs__carrusel-inner{display:flex;width:max-content;align-items:center;animation:mbbs-marquee 22s linear infinite;will-change:transform;}',
        '#melmak-bbs__carrusel:before,#melmak-bbs__carrusel:after{content:"";position:absolute;left:0;right:0;z-index:1;}',
        '#melmak-bbs__carrusel:before{top:-10px;height:10px;',
        '  background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'10\' viewBox=\'0 0 100 10\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0 10H100V9C87.5 9 87.5 3 75 3C62.5 3 62.5 9 50 9C37.5 9 37.5 3 25 3C12.5 3 12.5 9 0 9Z\' fill=\'%23353535\'/%3E%3C/svg%3E");',
        '  background-size:180px 10px;background-repeat:repeat-x;',
        '  animation:mbbs-ola-top 6s linear infinite;}',
        '#melmak-bbs__carrusel:after{bottom:-10px;height:10px;',
        '  background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'10\' viewBox=\'0 0 100 10\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0 0H100V3C87.5 3 87.5 9 75 9C62.5 9 62.5 3 50 3C37.5 3 37.5 9 25 9C12.5 9 12.5 3 0 3Z\' fill=\'%23353535\'/%3E%3C/svg%3E");',
        '  background-size:180px 10px;background-repeat:repeat-x;',
        '  animation:mbbs-ola-top 6s linear infinite;animation-delay:-1.5s;}',
        '.mbbs-marquee-half{display:flex;align-items:center;flex:none;}',
        '.mbbs-marquee-item{display:inline-block;margin:0 26px;',
        '  font-family:"vinyl","Curda Gouda",Rubik,Arial,sans-serif;font-weight:400;',
        '  font-size:clamp(20px,3vw,34px);line-height:1.15;letter-spacing:.02em;text-transform:uppercase;}',
        '@keyframes mbbs-marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}',
        '@keyframes mbbs-ola-top{from{background-position-x:0;}to{background-position-x:180px;}}',
        /* ---------- Galeria de fotos (slider con enfasis central) ---------- */
        '#melmak-bbs__galeria{position:relative;z-index:2;width:100%;overflow-x:clip;overflow-y:visible;background:#fff;',
        '  padding:clamp(74px,9vw,124px) 0 clamp(60px,4.6vw,170px);}',
        '.mbbs-galeria-viewport{position:relative;width:100%;}',
        '#melmak-bbs__galeria.is-pop .mbbs-galeria-viewport{animation:mbbs-galeria-pop .75s cubic-bezier(.34,1.56,.64,1) both;}',
        '@keyframes mbbs-galeria-pop{from{opacity:0;transform:scale(.82);}to{opacity:1;transform:scale(1);}}',
        '.mbbs-galeria-track{display:flex;align-items:center;',
        '  transition:transform .6s cubic-bezier(.165,.84,.44,1);will-change:transform;}',
        '.mbbs-galeria-slide{position:relative;flex:none;width:clamp(150px,21vw,300px);',
        '  transition:transform .6s cubic-bezier(.165,.84,.44,1);will-change:transform;}',
        '.mbbs-galeria-card{position:relative;width:100%;}',
        '.mbbs-galeria-card__img{position:relative;display:block;width:100%;aspect-ratio:370/540;',
        '  overflow:hidden;background:#fff;border:2px solid var(--mbg-border,var(--ink));border-radius:20px;}',
        '.mbbs-galeria-card__img img{position:absolute;top:-1px;left:-1px;width:calc(100% + 2px);height:calc(100% + 2px);object-fit:cover;}',
        '.mbbs-galeria-sticker{position:absolute;z-index:4;display:block;width:clamp(66px,7.5vw,104px);',
        '  height:auto;object-fit:contain;pointer-events:none;}',
        '.mbbs-galeria-slide.is-c .mbbs-galeria-card__img,.mbbs-galeria-slide.is-r2 .mbbs-galeria-card__img,.mbbs-galeria-slide.is-l2 .mbbs-galeria-card__img{--mbg-border:var(--ink);}',
        '.mbbs-galeria-slide.is-r1 .mbbs-galeria-card__img,.mbbs-galeria-slide.is-l1 .mbbs-galeria-card__img{--mbg-border:var(--bg);}',
        '/* collage: la foto activa al centro crece; las vecinas se inclinan y suben */',
        '.mbbs-galeria-slide.is-c{transform:scale(1.22);z-index:3;}',
        '.mbbs-galeria-slide.is-r1{transform:translate(24px,8px) rotate(3deg);z-index:2;}',
        '.mbbs-galeria-slide.is-r2{transform:translate(24px,-56px) rotate(-3deg);z-index:2;}',
        '.mbbs-galeria-slide.is-l1{transform:translate(-24px,8px) rotate(-3deg);z-index:2;}',
        '.mbbs-galeria-slide.is-l2{transform:translate(-24px,-56px) rotate(3deg);z-index:2;}',
        '.mbbs-galeria-slide.is-c .mbbs-galeria-sticker{top:-40px;right:-34px;transform:rotate(-16deg);}',
        '.mbbs-galeria-slide.is-r1 .mbbs-galeria-sticker{bottom:-30px;left:30px;transform:rotate(-14deg);}',
        '.mbbs-galeria-slide.is-r2 .mbbs-galeria-sticker{top:-22px;left:34px;transform:rotate(16deg);}',
        '.mbbs-galeria-slide.is-l1 .mbbs-galeria-sticker{bottom:-30px;right:30px;transform:rotate(14deg);}',
        '.mbbs-galeria-slide.is-l2 .mbbs-galeria-sticker{top:-22px;right:34px;transform:rotate(-16deg);}',
        '.mbbs-galeria-track.is-moved .mbbs-galeria-sticker{animation:mbbs-sticker .45s cubic-bezier(.34,1.56,.64,1) both;}',
        '@keyframes mbbs-sticker{from{scale:0;}to{scale:1;}}',
        /* ---------- Hero ---------- */
        '#melmak-bbs__hero{position:relative;display:grid;grid-template-columns:1.2fr .8fr;gap:30px;align-items:center;',
        '  margin-top:clamp(28px,5vh,80px);margin-bottom:clamp(50px,10vh,150px);',
        '  transition:opacity .6s cubic-bezier(.34,1.56,.64,1),transform .6s cubic-bezier(.34,1.56,.64,1);}',
        '#melmak-bbs__kicker{display:inline-block;font-family:"Curda Gouda",Rubik,Arial,sans-serif;',
        '  font-size:clamp(13px,1.6vw,16px);font-weight:700;letter-spacing:.22em;',
        '  text-transform:uppercase;color:#fff;background:var(--ink);',
        '  padding:8px 16px;margin:0 0 20px;border-radius:999px;}',
        '#melmak-bbs__title{margin:0;line-height:.92;',
        '  font-family:"Curda Gouda",Rubik,Arial,sans-serif;font-weight:700;',
        '  font-size:clamp(52px,9vw,120px);letter-spacing:-.01em;}',
        '#melmak-bbs__title span{display:block;width:fit-content;font-family:"Curda Gouda",Rubik,Arial,sans-serif;}',
        '#melmak-bbs__title span.mbbs-line2{color:#fff;-webkit-text-stroke:3px var(--ink);',
        '  text-shadow:6px 6px 0 var(--ink);}',
        '#melmak-bbs__art{position:relative;text-align:center;}',
        '#melmak-bbs__mascot{display:inline-block;width:min(280px,60vw);height:auto;transform:translateX(-48px);}',
        /* ---------- Indicador de scroll (flecha) ---------- */
        '.mbbs-scroll-hint{position:absolute;left:50%;bottom:-140px;z-index:4;transform:translateX(-50%);',
        '  transition:opacity .3s ease;animation:mbbs-hint-bounce 1.7s ease-in-out infinite;}',
        '.mbbs-scroll-hint::after{content:"";display:block;width:16px;height:16px;',
        '  border-right:3px solid var(--ink);border-bottom:3px solid var(--ink);transform:rotate(45deg);margin:0 auto;}',
        '@keyframes mbbs-hint-bounce{0%,100%{transform:translate(-50%,0);}50%{transform:translate(-50%,10px);}}',
        '@keyframes mbbs-hero-plop{from{opacity:0;transform:scale(.5);}to{opacity:1;transform:scale(1);}}',
        /* ---------- Lista de posts ---------- */
        '#melmak-bbs__head{display:flex;align-items:center;gap:16px;margin:clamp(18px,3vw,34px) 0 clamp(22px,3vw,32px);}',
        '#melmak-bbs__head:after{content:"";flex:1;height:3px;background:var(--ink);border-radius:999px;margin-left:8px;}',
        '#melmak-bbs__head-title{font-family:"Curda Gouda",Rubik,Arial,sans-serif;',
        '  font-size:clamp(24px,4vw,40px);font-weight:700;letter-spacing:.04em;margin:0;}',
        '#melmak-bbs__posts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;list-style:none;margin:0;padding:0;}',
        '#melmak-bbs__post{position:relative;background:#fff;border:3px solid var(--ink);',
        '  border-radius:6px;box-shadow:5px 5px 0 var(--ink);padding:34px 30px 30px;',
        '  display:flex;flex-direction:column;gap:2px;min-width:0;}',
        '#melmak-bbs__post-about{display:flex;align-items:center;gap:10px;margin:0;padding-left:64px;}',
        '#melmak-bbs__post-avatar{position:absolute;top:-23px;left:50%;transform:translateX(-50%);z-index:3;flex:none;width:46px;height:46px;border-radius:50%;',
        '  background:var(--bg);border:3px solid var(--ink);',
        '  display:flex;align-items:center;justify-content:center;',
        '  font-family:"Curda Gouda",Rubik,Arial,sans-serif;font-weight:700;font-size:20px;color:var(--ink);}',
        '#melmak-bbs__post-name{font-family:"Curda Gouda",Rubik,Arial,sans-serif;',
        '  font-size:16px;font-weight:700;color:var(--ink);text-align:left;}',
        '#melmak-bbs__post-question{margin:0;font-size:15px;line-height:1.55;color:var(--ink);text-align:left;padding-left:64px;white-space:pre-line;',
        '  font-family:"vinyl","Curda Gouda",Rubik,Arial,sans-serif;}',
        /* ---------- Personaje gif en las 3 minicajas ---------- */
        '#melmak-bbs .mbbs-personaje-wrap{position:absolute;top:0;left:0;right:0;bottom:0;z-index:2;overflow:hidden;pointer-events:none;}',
        '#melmak-bbs .mbbs-personaje{position:absolute;top:50%;left:-8px;width:110px;height:110px;',
        '  object-fit:contain;transform:translateY(-50%);pointer-events:none;display:block;}',
        /* ---------- Responsive ---------- */
        '@media (max-width:900px){',
        '  #melmak-bbs__hero{grid-template-columns:1fr;}',
        '  #melmak-bbs__posts{grid-template-columns:repeat(3,1fr);gap:12px;}',
        '  #melmak-bbs__post{padding:30px 24px 24px;}',
        '  #melmak-bbs__post-question{font-size:14px;}',
        '  #melmak-bbs__post-about{padding-left:54px;}',
        '  #melmak-bbs__post-question{padding-left:54px;}',
        '  #melmak-bbs .mbbs-personaje{left:-6px;width:80px;height:80px;}',
        '}',
        '@media (max-width:600px){',
        '  #melmak-bbs__posts{grid-template-columns:1fr;justify-items:center;gap:44px;}',
        '  #melmak-bbs__post{width:min(374px,100%);padding:34px 30px 30px;}',
        '  #melmak-bbs__title span.mbbs-line2{transform:none;}',
        '  #melmak-bbs__hero{gap:18px;margin-top:clamp(32px,6vh,72px);}',
        '  #melmak-bbs__copy{text-align:center;}',
        '  #melmak-bbs__kicker{margin-right:auto;margin-left:auto;}',
        '  #melmak-bbs__title span{margin-left:auto;margin-right:auto;}',
        '  #melmak-bbs__mascot{width:min(180px,52vw);transform:none;}',
        '  #melmak-bbs__head{justify-content:center;margin-bottom:44px;}',
        '  #melmak-bbs__head:after{display:none;}',
        '  #melmak-bbs__head-title{text-align:center;}',
        '  #melmak-bbs__post-about{padding-left:64px;}',
        '  #melmak-bbs__post-question{padding-left:64px;}',
        '  #melmak-bbs .mbbs-personaje{left:-8px;width:112px;height:112px;}',
        '}',
        /* ---------- Bloque nuevo (caja blanca debajo de la franja) ---------- */
        '#melmak-bbs__merit{position:relative;width:100%;background:#fff;',
        '  padding:clamp(26px,3vw,44px) 20px clamp(30px,5vw,60px);}',
        '#melmak-bbs__merit *{box-sizing:border-box;margin:0;',
        '  font-family:"vinyl","matt-b","Curda Gouda",Rubik,Arial,sans-serif;}',
        '#melmak-bbs__merit .mbms-merit__caja{position:relative;max-width:min(1180px,95vw);margin:0 auto;background:#fff;border:3px solid var(--ink);border-radius:26px;',
        '  padding:clamp(30px,4vw,40px) clamp(24px,3vw,32px) clamp(30px,4vw,40px);',
        '  min-height:clamp(110px,15vw,160px);}',
        '.mbms-merit__pilula{position:absolute;z-index:2;top:-24px;left:-14px;transform:none;white-space:nowrap;',
        '  background:var(--ink);color:#fff;border-radius:14px;',
        '  padding:10px 22px;font-size:clamp(13px,1.6vw,17px);font-weight:400;',
        '  letter-spacing:.06em;text-transform:uppercase;line-height:1.25;}',
        '.mbms-merit__texto{white-space:pre-line;margin:0;padding-top:8px;',
        '  font-size:clamp(14px,1.8vw,18px);line-height:1.55;color:var(--ink);text-align:justify;text-transform:uppercase;}',
        /* ---------- Aviso (mensaje de advertencia sobre la caja blanca) ---------- */
        '.mbms-merit__aviso{position:absolute;z-index:2;bottom:-24px;right:-14px;background:var(--bg);',
        '  border:3px solid var(--ink);border-radius:14px;box-shadow:5px 5px 0 var(--ink);',
        '  padding:10px 22px;font-family:"vinyl","Curda Gouda",Rubik,Arial,sans-serif;',
        '  font-size:clamp(13px,1.6vw,17px);line-height:1.25;text-align:center;color:var(--ink);',
        '  width:max-content;max-width:calc(100% - 36px);white-space:normal;opacity:0;transform:rotate(var(--mbo-rot,-3deg));}',
        '.mbms-merit__aviso.is-in{animation:mbo-slam .6s cubic-bezier(.34,1.56,.64,1) both;}',
        '.mbms-merit__mascota{position:absolute;z-index:3;top:-96px;right:-38px;width:132px;height:132px;',
        '  object-fit:contain;transform:rotate(-6deg);pointer-events:none;',
        '  animation:mbmp-girar 1.6s steps(1,end) infinite;}',
        '@keyframes mbmp-girar{0%{transform:rotate(-6deg);}',
        '  50%{transform:rotate(14deg);}',
        '  100%{transform:rotate(-6deg);}}',
        '@keyframes mbo-slam{from{opacity:0;transform:translateY(60px) rotate(calc(var(--mbo-rot,0deg) + 25deg)) scale(.6);}',
        '  to{opacity:1;transform:translateY(0) rotate(var(--mbo-rot,0deg)) scale(1);}}',
        '@media (max-width:600px){',
        '  #melmak-bbs__merit{padding-top:clamp(96px,24vw,120px);padding-left:14px;padding-right:14px;padding-bottom:64px;}',
        '  #melmak-bbs__merit .mbms-merit__caja{width:min(360px,88vw);max-width:calc(100% - 24px);min-height:100px;padding:18px 18px 18px;}',
        '  .mbms-merit__pilula{white-space:nowrap;width:auto;max-width:100%;font-size:12px;padding:9px 14px;letter-spacing:0;top:-16px;left:50%;transform:translateX(-50%);}',
        '  .mbms-merit__texto{font-size:12.5px;line-height:1.55;}',
        '  .mbms-merit__aviso{right:0;left:0;bottom:-34px;width:auto;max-width:none;font-size:11.5px;',
        '    line-height:1.3;padding:9px 14px;transform:rotate(-2deg);box-shadow:none;}',
        '  .mbms-merit__mascota{width:88px;height:88px;top:-108px;left:calc(50% - 44px);right:auto;transform:rotate(-4deg);}',
        '  #melmak-bbs__galeria{padding:58px 0 40px;}',
        '  .mbbs-galeria-card__img{border-radius:14px;}',
        '  .mbbs-galeria-sticker{width:clamp(56px,13vw,80px);}',
        '  .mbbs-galeria-slide.is-c{transform:scale(1.12);}',
        '  .mbbs-galeria-slide.is-r1{transform:translate(14px,6px) rotate(3deg);}',
        '  .mbbs-galeria-slide.is-r2{transform:translate(14px,-34px) rotate(-3deg);}',
        '  .mbbs-galeria-slide.is-l1{transform:translate(-14px,6px) rotate(-3deg);}',
        '  .mbbs-galeria-slide.is-l2{transform:translate(-14px,-34px) rotate(3deg);}',
        '}',
        '@media (prefers-reduced-motion:reduce){',
        '  #melmak-bbs__carrusel-inner{animation:none;}',
        '  #melmak-bbs__carrusel:before,#melmak-bbs__carrusel:after{animation:none;}',
        '  #melmak-bbs__galeria.is-pop .mbbs-galeria-viewport{animation:none;}',
        '  .mbbs-galeria-track,.mbbs-galeria-slide{transition:none;}',
        '  .mbbs-galeria-track.is-moved .mbbs-galeria-sticker{animation:none;}',
        '  .mbms-merit__aviso{animation:none;opacity:1;}',
        '  .mbms-merit__mascota{animation:none;}',
        '  .mbbs-scroll-hint{animation:none;}',
        '  #melmak-bbs__hero{transition:none;}',
        '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);

    var CARRUSEL_TEXTOS = [
        { t: 'TIEMPO DE ELABORACIÓN', c: COLOR_BG },
        { t: '7 A 10 DÍAS HÁBILES', c: '#ffffff' }
    ];

    function crearSeccion() {
        var sec = document.createElement('section');
        sec.id = 'melmak-bbs';
        sec.setAttribute('aria-label', 'Consulta de la comunidad');

        var panel = document.createElement('div');
        panel.className = 'mbbs-panel';
        panel.setAttribute('aria-hidden', 'true');
        sec.appendChild(panel);

        var inner = document.createElement('div');
        inner.id = 'melmak-bbs__inner';

        /* ---------- Hero ---------- */
        var hero = document.createElement('div');
        hero.id = 'melmak-bbs__hero';
        hero.style.opacity = '0';
        hero.style.transform = 'scale(.5)';

        var copy = document.createElement('div');
        copy.id = 'melmak-bbs__copy';
        var kicker = document.createElement('span');
        kicker.id = 'melmak-bbs__kicker';
        kicker.textContent = TEXTO.kicker;
        copy.appendChild(kicker);

        var h2 = document.createElement('h2');
        h2.id = 'melmak-bbs__title';
        var l1 = document.createElement('span');
        l1.textContent = TEXTO.titulo1;
        var l2 = document.createElement('span');
        l2.className = 'mbbs-line2';
        l2.textContent = TEXTO.titulo2;
        h2.appendChild(l1);
        h2.appendChild(l2);
        copy.appendChild(h2);
        hero.appendChild(copy);

        var art = document.createElement('div');
        art.id = 'melmak-bbs__art';

        /* Espacio reservado para el personaje (se reemplazará luego). */
        var img = document.createElement('img');
        img.id = 'melmak-bbs__mascot';
        img.src = TEXTO.mascotaHero;
        img.alt = 'Personaje MELMAK';
        img.decoding = 'async';
        art.appendChild(img);
        hero.appendChild(art);

        var hint = document.createElement('div');
        hint.className = 'mbbs-scroll-hint';
        hint.setAttribute('aria-hidden', 'true');
        hero.appendChild(hint);

        inner.appendChild(hero);

        /* ---------- Posts (bloque con animación al scrollear en PC) ---------- */
        var scrollBlock = document.createElement('div');
        scrollBlock.id = 'melmak-bbs__scroll-block';
        var head = document.createElement('div');
        head.id = 'melmak-bbs__head';
        var headTitle = document.createElement('h3');
        headTitle.id = 'melmak-bbs__head-title';
        headTitle.textContent = 'LO QUE ESTÁS PREGUNTANDO';
        head.appendChild(headTitle);
        scrollBlock.appendChild(head);

        var ul = document.createElement('ul');
        ul.id = 'melmak-bbs__posts';

        for (var i = 0; i < POSTS.length; i++) {
            var p = POSTS[i];
            var li = document.createElement('li');
            li.id = 'melmak-bbs__post';

            /* Personaje gif en el lado izquierdo de cada minicaja. */
            var wrap = document.createElement('div');
            wrap.className = 'mbbs-personaje-wrap';
            var imgBadge = document.createElement('img');
            imgBadge.className = 'mbbs-personaje';
            imgBadge.src = TEXTO.mascotaBadge;
            imgBadge.alt = '';
            imgBadge.decoding = 'async';
            wrap.appendChild(imgBadge);
            li.appendChild(wrap);

            var about = document.createElement('div');
            about.id = 'melmak-bbs__post-about';

            var av = document.createElement('div');
            av.id = 'melmak-bbs__post-avatar';
            av.textContent = String(i + 1);
            about.appendChild(av);

            var name = document.createElement('span');
            name.id = 'melmak-bbs__post-name';
            name.textContent = p.nombre;
            about.appendChild(name);
            li.appendChild(about);

            var q = document.createElement('p');
            q.id = 'melmak-bbs__post-question';
            q.textContent = p.pregunta;
            li.appendChild(q);

            ul.appendChild(li);
        }
        scrollBlock.appendChild(ul);
        inner.appendChild(scrollBlock);

        /* ---------- Carrusel debajo de las minicajas ---------- */
        var carrusel = document.createElement('div');
        carrusel.id = 'melmak-bbs__carrusel';
        var barra = document.createElement('div');
        barra.id = 'melmak-bbs__carrusel-inner';
        var clip = document.createElement('div');
        clip.className = 'mbbs-carrusel-clip';
        clip.appendChild(barra);
        carrusel.appendChild(clip);

        function crearMitad() {
            var mitad = document.createElement('div');
            mitad.className = 'mbbs-marquee-half';
            for (var r = 0; r < 4; r++) {
                for (var w = 0; w < CARRUSEL_TEXTOS.length; w++) {
                    var it = document.createElement('span');
                    it.className = 'mbbs-marquee-item';
                    it.textContent = CARRUSEL_TEXTOS[w].t;
                    it.style.color = CARRUSEL_TEXTOS[w].c;
                    mitad.appendChild(it);
                }
            }
            return mitad;
        }
        barra.appendChild(crearMitad());
        barra.appendChild(crearMitad());

        sec.appendChild(inner);
        sec.appendChild(carrusel);
        sec.appendChild(crearGaleria());
        sec.appendChild(crearMerit());
        return sec;
    }

    /* ---------- Carrusel de fotos (slider autoplay, foco central) ----------
       Replica el comportamiento de referencia: loop, avance cada 4s, 4 fotos
       en desktop / 2 en movil, y la foto activa al centro se agranda mientras
       las vecinas se inclinan. Autoplay propio, sin librerias externas.       */
    function crearGaleria() {
        var CLONES = 4;
        var TOTAL = FOTOS.length;
        var PASO_MS = 4000;

        var g = document.createElement('div');
        g.id = 'melmak-bbs__galeria';
        g.setAttribute('aria-label', 'Galería de trabajos MELMAK');

        var viewport = document.createElement('div');
        viewport.className = 'mbbs-galeria-viewport';
        var track = document.createElement('div');
        track.className = 'mbbs-galeria-track';
        viewport.appendChild(track);
        g.appendChild(viewport);

        function crearSlide(f, oculto) {
            var slide = document.createElement('div');
            slide.className = 'mbbs-galeria-slide';
            if (oculto) { slide.setAttribute('aria-hidden', 'true'); }
            var card = document.createElement('div');
            card.className = 'mbbs-galeria-card';
            var marco = document.createElement('div');
            marco.className = 'mbbs-galeria-card__img';
            var im = document.createElement('img');
            im.src = f.src;
            im.alt = oculto ? '' : (f.alt || '');
            im.decoding = 'async';
            im.loading = 'lazy';
            marco.appendChild(im);
            card.appendChild(marco);
            if (f.sticker) {
                var tag = document.createElement('img');
                tag.className = 'mbbs-galeria-sticker';
                tag.src = f.sticker;
                tag.alt = '';
                tag.decoding = 'async';
                card.appendChild(tag);
            }
            slide.appendChild(card);
            return slide;
        }

        /* Clonamos 4 fotos al inicio y 4 al final para el loop continuo. */
        var orden = [];
        for (var c = 0; c < CLONES; c++) { orden.push(FOTOS[(TOTAL - CLONES + c + TOTAL) % TOTAL]); }
        for (var r = 0; r < TOTAL; r++) { orden.push(FOTOS[r]); }
        for (var t = 0; t < CLONES; t++) { orden.push(FOTOS[t % TOTAL]); }
        for (var s = 0; s < orden.length; s++) {
            track.appendChild(crearSlide(orden[s], s < CLONES || s >= CLONES + TOTAL));
        }
        var slides = track.children;

        var activo = CLONES;
        var perPage = window.innerWidth >= 768 ? 4 : 2;
        var temporizador = null;

        function pintar(animar) {
            var vw = viewport.clientWidth;
            var gap = window.innerWidth >= 768 ? 53 : 50;
            var ancho = (vw - (perPage - 1) * gap) / perPage;
            for (var i = 0; i < slides.length; i++) {
                var sl = slides[i];
                if (!animar) { sl.style.transition = 'none'; }
                sl.style.width = ancho + 'px';
                sl.style.marginRight = gap + 'px';
                sl.classList.remove('is-c', 'is-r1', 'is-r2', 'is-l1', 'is-l2');
                var rel = i - activo;
                if (rel === 0) { sl.classList.add('is-c'); }
                else if (rel === 1) { sl.classList.add('is-r1'); }
                else if (rel === 2) { sl.classList.add('is-r2'); }
                else if (rel === -1) { sl.classList.add('is-l1'); }
                else if (rel === -2) { sl.classList.add('is-l2'); }
            }
            var x = vw / 2 - ancho / 2 - activo * (ancho + gap);
            if (!animar) { track.style.transition = 'none'; }
            track.style.transform = 'translateX(' + x + 'px)';
            if (!animar) {
                void track.offsetWidth;
                track.style.transition = '';
                for (var k = 0; k < slides.length; k++) { slides[k].style.transition = ''; }
            }
        }

        function avanzar() {
            activo++;
            track.classList.add('is-moved');
            clearTimeout(track.__moved);
            track.__moved = setTimeout(function () { track.classList.remove('is-moved'); }, 2400);
            pintar(true);
            if (activo >= CLONES + TOTAL) {
                setTimeout(function () {
                    activo = CLONES;
                    track.classList.remove('is-moved');
                    clearTimeout(track.__moved);
                    pintar(false);
                }, 650);
            }
        }

        function reposicionar() {
            var pp = window.innerWidth >= 768 ? 4 : 2;
            if (pp !== perPage) {
                perPage = pp;
                if (activo >= CLONES + TOTAL) { activo = CLONES; }
            }
            pintar(false);
        }

        var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function arrancar() { if (!temporizador) { temporizador = setInterval(avanzar, PASO_MS); } }

        /* Efecto "pop" al entrar en pantalla. */
        function popEntrada() {
            var gal = document.getElementById('melmak-bbs__galeria');
            if (!gal || sinMovimiento) { return; }
            if (!('IntersectionObserver' in window)) { gal.classList.add('is-pop'); return; }
            var io = new IntersectionObserver(function (ent) {
                for (var i = 0; i < ent.length; i++) {
                    if (ent[i].isIntersecting) {
                        gal.classList.add('is-pop');
                        io.disconnect();
                        return;
                    }
                }
            }, { threshold: 0.25 });
            io.observe(gal);
        }

        function iniciar() {
            pintar(false);
            if (!sinMovimiento) { arrancar(); }
            popEntrada();
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(iniciar); }, { once: true });
        } else {
            requestAnimationFrame(iniciar);
        }
        window.addEventListener('resize', reposicionar, { passive: true });

        return g;
    }

    /* ---------- Bloque nuevo (debajo de la franja) ---------- */
    function crearMerit() {
        var m = document.createElement('div');
        m.id = 'melmak-bbs__merit';
        var caja = document.createElement('div');
        caja.className = 'mbms-merit__caja';
        var pilula = document.createElement('span');
        pilula.className = 'mbms-merit__pilula';
        pilula.textContent = 'STICKERS ACÁ, STICKERS ALLÁ, EN TODOS LADOS';
        var texto = document.createElement('p');
        texto.className = 'mbms-merit__texto';
        texto.textContent = [
            'Serigrafiados, solvente/ecosolvente, sublimados, láser... existen stickers de todo tipo de materiales e impresión. ',
            'En MELMAK, utilizamos la tecnología UV sobre vinilo, la cual ofrece una alta resistencia a la decoloración por luz solar, ',
            'la humedad, los roces y la intemperie, prolongando su vida útil en exteriores.'
        ].join('').toUpperCase();
        caja.appendChild(pilula);
        caja.appendChild(texto);
        var aviso = document.createElement('div');
        aviso.className = 'mbms-merit__aviso';
        aviso.textContent = 'NO NOS GUSTAN LAS IMPRESIONES PIXELADAS, BORROSAS NI DESCOLORIDAS';
        caja.appendChild(aviso);
        var mascota = document.createElement('img');
        mascota.className = 'mbms-merit__mascota';
        mascota.src = 'https://d22fxaf9t8d39k.cloudfront.net/a1f4a734c2b09ca6ff5f40dd4c066234397b2d26bb2283f8d28901b0fc55f21820700.png';
        mascota.alt = '';
        mascota.decoding = 'async';
        caja.appendChild(mascota);
        m.appendChild(caja);
        return m;
    }

    root.appendChild(crearSeccion());

    /* Plop del hero: al tocar ENTRAR (si hay bienvenida) o al cargar (si no). */
    var heroPlop = document.getElementById('melmak-bbs__hero');
    if (heroPlop) {
        function plopHero() {
            heroPlop.style.opacity = '1';
            heroPlop.style.transform = 'scale(1)';
        }
        if (window.__melmakBienvenida) {
            window.addEventListener('melmak-entrar', plopHero);
        } else {
            requestAnimationFrame(function () {
                requestAnimationFrame(plopHero);
            });
        }
    }

    /* ---------- Aparicion divertida del aviso ---------- */
    (function animarMbo() {
        var cards = document.querySelectorAll('#melmak-bbs__merit .mbms-merit__aviso');
        if (!cards.length) { return; }

        function activarSiVisible(c) {
            if (c.classList.contains('is-in')) { return; }
            var r = c.getBoundingClientRect();
            var vh = window.innerHeight || document.documentElement.clientHeight;
            if (r.top < vh && r.bottom > 0) { c.classList.add('is-in'); }
        }

        cards.forEach(activarSiVisible);

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (es) {
                es.forEach(function (e) {
                    if (e.isIntersecting) {
                        e.target.classList.add('is-in');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0 });
            cards.forEach(function (c) { io.observe(c); });
        } else {
            cards.forEach(function (c) { c.classList.add('is-in'); });
        }

        window.addEventListener('scroll', function () {
            cards.forEach(activarSiVisible);
        }, { passive: true });

        window.addEventListener('load', function () {
            cards.forEach(activarSiVisible);
            setTimeout(function () {
                cards.forEach(function (c) { c.classList.add('is-in'); });
            }, 1200);
        }, { passive: true });
        setTimeout(function () {
            cards.forEach(function (c) { c.classList.add('is-in'); });
        }, 2500);
    })();

    /* ---------- Aparecer/ocultar con el scroll ---------- */
    function aplicarScroll(el) {
        if (!el) { return; }
        var r = el.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var p = (vh * 0.65 - r.top) / (vh * 0.3);
        if (p < 0) { p = 0; }
        if (p > 1) { p = 1; }
        el.style.opacity = p.toFixed(3);
        el.style.transform = 'translateY(' + Math.round((1 - p) * 48) + 'px)';
    }
    /* Aparecer/ocultar con el scroll. */
    function animacionScroll() {
        var esMovil = window.innerWidth <= 600;
        if (esMovil) {
            /* Móvil: cada minicaja aparece individualmente. */
            var lis = document.querySelectorAll('#melmak-bbs__post');
            for (var i = 0; i < lis.length; i++) { aplicarScroll(lis[i]); }
            aplicarScroll(document.getElementById('melmak-bbs__head'));
            return;
        }
        /* PC: bloque de preguntas. */
        aplicarScroll(document.getElementById('melmak-bbs__scroll-block'));
    }
    window.addEventListener('scroll', animacionScroll, { passive: true });
    window.addEventListener('resize', animacionScroll, { passive: true });
    animacionScroll();

    /* ---------- Ocultar la flecha al scrollear ---------- */
    var hintEl = document.querySelector('.mbbs-scroll-hint');
    function ocultarHint() {
        if (hintEl) { hintEl.style.opacity = (window.scrollY > 60) ? '0' : '1'; }
    }
    window.addEventListener('scroll', ocultarHint, { passive: true });
    ocultarHint();
})();