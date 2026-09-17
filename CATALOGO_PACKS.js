// ==========================================
// SECCION "MELSCHOOL" - REPLICA FIEL OPEN SCHOOL (ohtake.ac.jp/openschool)
// Se inserta DESPUES del banner principal (.block-carrousel--1339211)
// EDITAR: MELSCHOOL_TITLE y MELSCHOOL_VOLS (un objeto por VOL)
// ==========================================
(function () {
    if (document.getElementById('melschool')) return;

    // =============== DATOS (EDITAR AQUI) ================
    var MELSCHOOL_TITLE = 'CATÁLOGO';

    var MELSCHOOL_VOLS = [
        {
            status: '',          // '' | 'is-coming-soon' | 'is-reception' | 'is-end'
            dateText: '',
            datetime: '',
            youbi: '',
            headHead: '',
            headBody: '',
            join: ['is-red'],
            notes: [
                {
                    id: 'food',
                    cat: 'Fotocards',
                    title: 'COMPRÁ POR UNIDAD',
                    text: 'Explorá toda nuestra colección. Elegí tus diseños favoritos de a uno y armá tu combinación perfecta.',
                    img: 'URL_IMAGEN_1'
                },
                {
                    id: 'beauty',
                    cat: 'Fotocards',
                    title: 'COMPRÁ POR PACK',
                    text: 'Stickers temáticos en un solo set. La forma más fácil y rápida de llevarte colecciones completas.',
                    img: 'URL_IMAGEN_2'
                }
            ],
            link: { href: 'URL_LINK_AQUI', text: 'Participar' }
        }
    ];
    // ====================================================

    var VOL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" fill="none" aria-hidden="true"><path fill="#000" d="m1.34503 14.4708 8.26815 2.6597L4.8878 9.85705l1.34503-1.75109 6.00947 9.92794-1.076 1.4009L0 16.2219l1.34503-1.7511Zm15.63847-.7213c-.5228.3858-1.0558.6447-1.6039.7766-.5482.132-1.0811.1472-1.5988.0609-.5177-.0863-.9999-.2791-1.4517-.5634-.4517-.2842-.8425-.6446-1.1673-1.0862-.335-.4466-.5685-.9288-.7157-1.4414-.1421-.5127-.1827-1.0304-.1218-1.55319.0609-.52279.2335-1.02528.5177-1.51254s.6852-.92377 1.2029-1.31459c.5228-.38575 1.0557-.64461 1.5988-.7715.5431-.12689 1.076-.14719 1.5938-.05583.5177.09136.9999.27916 1.4516.5634.4517.28423.8425.64968 1.1775 1.09633.3249.44159.5634.9187.7055 1.43134.1421.51264.1827 1.03038.1269 1.54808-.0558.5177-.2284 1.0202-.5075 1.5075-.2843.4872-.6852.9288-1.203 1.3145h-.005Zm-4.1366-2.0657c.2131.2842.4466.5126.7055.6801.2588.1675.5278.2842.8019.3401.2792.0609.5532.0609.8273 0 .2741-.0559.5279-.1726.7664-.3503.2335-.1776.4213-.3857.5533-.6293.1319-.2437.2132-.5076.2335-.7918.0253-.2843-.0102-.5736-.1016-.873-.0913-.29951-.2436-.5939-.4517-.87813-.2081-.27916-.4416-.50249-.7004-.67506-.2589-.17258-.5329-.28932-.807-.34515-.2792-.06091-.5533-.06091-.8274 0-.274.05583-.5278.17257-.7664.35022-.2385.17765-.4212.39083-.5481.63953-.132.24871-.2081.51772-.2335.79688-.0254.28421.0101.57351.1015.87301.0914.2995.2386.5888.4467.8629ZM16.7578.78673 18.6409 0l3.3092 7.89263c.1117.27408.2691.4568.4619.54817.1929.09643.4111.09136.6548-.01016.1116-.04568.2284-.11674.3502-.21317.1218-.09644.2284-.19288.3299-.30454l.8527 1.32474c-.203.22841-.4568.44666-.7664.64968-.3096.20815-.5989.36545-.873.48215-.5888.2487-1.1116.2843-1.5684.1016-.4568-.1777-.8019-.55837-1.0455-1.13699L16.7629.78165l-.0051.00508Zm9.1982 8.47113-.4872-2.13685 1.6343-.37052.4872 2.13684-1.6343.37053Z"/></svg>';

    // ---------------- ESTILOS ----------------
    var style = document.createElement('style');
    style.textContent = [
        '@import url(\'https://fonts.googleapis.com/css2?family=Raleway:wght@500;700;800&display=swap\');',
        '.melschool { padding: 80px 30px 130px; background-color: #fef9cc; }',
        '.melschool__wrap { max-width: 1150px; margin: 0 auto; }',
        '.melschool .pContent__headline { position: relative; z-index: 1; display: flex; justify-content: center; }',
        '.melschool .pContent__headline_text { display: flex; gap: 5px; align-items: center; font-size: 24px; font-weight: 500; line-height: 1; color: #fff; font-family: \'Raleway\', system-ui, sans-serif; }',
        '.melschool .pContent__headline .pContent__char { position: relative; display: flex; align-items: center; justify-content: center; padding-bottom: 2px; }',
        '.melschool .pContent__headline .pContent__char::before { position: absolute; z-index: -1; width: 42px; height: 42px; margin-top: 2px; content: ""; background-color: #000; border-radius: 50%; }',
        '.melschool .pContent__headline .pContent__char.is-space { width: 16px; }',
        '.melschool .pContent__headline_text, .melschool .pContent__item_head_youbi, .melschool .pContent__item_head_text { margin: 0; }',
        '.melschool .pContent__list { list-style: none; margin: 40px 0 0; padding: 0; display: flex; flex-direction: column; gap: 60px; }',
        '.melschool .pContent__item { width: 100%; }',
        '.melschool .pContent__item_inner { width: 100%; }',
        '.melschool .pContent__item_head { position: relative; padding: 11px 24px 18px; background-color: #000; border-radius: 26px 26px 0 0; }',
        '.melschool .pContent__item_head_vol { position: absolute; top: -21px; left: -12px; display: flex; gap: 2px; align-items: flex-start; justify-content: flex-start; }',
        '.melschool .pContent__item_head_vol_text { width: 28px; height: 20px; margin-top: 5px; display: block; }',
        '.melschool .pContent__item_head_vol_text svg { display: block; width: 100%; height: 100%; }',
        '.melschool .pContent__item_head_vol_number { font-family: \'Raleway\', system-ui, sans-serif; font-size: 15px; font-weight: 700; line-height: 1; letter-spacing: .02em; color: #000; }',
        '.melschool .pContent__item_head_date { display: flex; gap: 4px; align-items: baseline; justify-content: flex-start; color: #fff; }',
        '.melschool .pContent__item_head_time { font-family: \'Raleway\', system-ui, sans-serif; font-size: 28px; font-weight: 800; line-height: 1.3; letter-spacing: .02em; }',
        '.melschool .pContent__item_head_youbi { display: flex; gap: 2px; align-items: center; margin-top: 2px; font-size: 13px; font-weight: 500; line-height: 1.3; letter-spacing: .02em; }',
        '.melschool .pContent__item_head_text { display: flex; gap: 6px; align-items: baseline; margin-top: 4px; color: #fff; }',
        '.melschool .pContent__item_head_text_head { display: flex; flex-shrink: 0; gap: 5px; align-items: center; font-size: 15px; font-weight: 500; line-height: 1.3; letter-spacing: .02em; }',
        '.melschool .pContent__item_head_text_body { display: flex; flex-direction: column; gap: 3px; align-items: flex-start; font-size: 15px; font-weight: 500; line-height: 1.3; letter-spacing: .02em; }',
        '.melschool .pContent__item_head_join { position: absolute; top: 14px; right: 14px; display: flex; gap: 4px; align-items: center; justify-content: flex-start; }',
        '.melschool .pContent__item_head_join_circle { width: 16px; height: 16px; border-radius: 50%; }',
        '.melschool .pContent__item_head_join_circle.is-red { background-color: #fd3c26; }',
        '.melschool .pContent__item_head_join_circle.is-blue { background-color: #74d1f5; }',
        '.melschool .pContent__item_head_join_circle.is-yellow { background-color: #ffed49; }',
        '.melschool .pContent__item_body { overflow: hidden; }',
        '.melschool .pContent__item_note { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 44px 30px 30px; background-color: var(--background-color); }',
        '.melschool .pContent__item_note_background { position: absolute; top: calc(50% - 204px); left: 50%; margin-left: -205px; z-index: -1; width: 410px; height: 408px; animation: melschool-loop-rotate 60s linear infinite; }',
        '.melschool .pContent__item_note_background img { display: block; width: 100%; height: 100%; }',
        '@keyframes melschool-loop-rotate { 0% { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
        '.melschool .pContent__item_note_thumbnail { display: flex; flex-direction: column; align-items: center; }',
        '.melschool .pContent__item_note_thumbnail_title { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; width: 80px; height: 26px; font-size: 14px; font-weight: 500; line-height: 1.6; color: #fff; background-color: var(--title-background-color); border-radius: 50vh; }',
        '.melschool .pContent__item_note_thumbnail_image { width: 264px; height: 164px; margin-top: -12px; transform: rotate(var(--thumbnail-image-rotate)); overflow: hidden; }',
        '.melschool .pContent__item_note_thumbnail_image img { display: block; width: 100%; height: 100%; object-fit: cover; }',
        '.melschool .pContent__item_note_thumbnail_image .pContent__note_placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #fff; font-size: 14px; font-weight: 700; background: linear-gradient(135deg, var(--title-background-color), rgba(255,255,255,.35)); border-radius: 14px; }',
        '.melschool .pContent__item_note_title { width: 100%; margin-top: 18px; font-size: 20px; font-weight: 500; line-height: 1.6; color: #000; }',
        '.melschool .pContent__item_note_text { width: 100%; margin-top: 8px; font-size: 15px; font-weight: 500; line-height: 1.7; color: #000; }',
        '.melschool .pContent__item_note_food { --background-color: #c3f5f2; --title-background-color: #50ceff; --thumbnail-image-rotate: 2deg; }',
        '.melschool .pContent__item_note_beauty { --background-color: #ffa1a7; --title-background-color: #fd3c26; --thumbnail-image-rotate: -2deg; border-radius: 0 0 26px 26px; }',
        '.melschool .pContent__item_link { --background-color: #ff4566; width: 240px; height: 60px; margin: 30px auto 0; }',
        '.melschool .pContent__item_link a { display: flex; gap: 8px; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: var(--background-color); border: 2px solid rgba(0,0,0,.12); border-radius: 50vh; color: #fff; text-decoration: none; transition: transform .3s ease; }',
        '.melschool .pContent__item_link a:hover { transform: scale(1.04); }',
        '.melschool .pContent__item_link_attention { display: block; margin-top: 4px; font-size: 12px; font-weight: 500; line-height: 1.7; text-align: center; }',
        '.melschool .pContent__item_link .pContent__link_text { padding-bottom: 2px; font-size: 16px; font-weight: 700; color: #fff; }',
        '.melschool .pContent__item_link.is-coming-soon { --background-color: #9b9b9b; height: 45px; }',
        '.melschool .pContent__item_link.is-coming-soon .pContent__link_text { text-transform: uppercase; }',
        '.melschool .pContent__item.is-end .pContent__item_body { pointer-events: none; }',
        '.melschool .pContent__item.is-end .pContent__item_note { overflow: hidden; }',
        '.melschool .pContent__item.is-end .pContent__item_note::before { position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; content: ""; background-color: #000; opacity: .5; }',
        '.melschool .pContent__item.is-end .pContent__item_note::after { position: absolute; z-index: 2; display: flex; align-items: center; justify-content: center; width: 134px; height: 41px; font-size: 17px; font-weight: 700; line-height: 1.4; color: #fff; content: "Finalizado"; background-color: #000; border-radius: 8px; transform: rotate(-6deg); }',
        '.melschool .pContent__item.is-end .pContent__item_link { display: none; }',
        '.melschool .pContent__item.is-reception .pContent__item_body { pointer-events: none; }',
        '.melschool .pContent__item.is-reception .pContent__item_note { overflow: hidden; }',
        '.melschool .pContent__item.is-reception .pContent__item_note::before { position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; content: ""; background-color: #000; opacity: .2; }',
        '.melschool .pContent__item.is-reception .pContent__item_note::after { position: absolute; z-index: 2; display: flex; align-items: center; justify-content: center; width: 168px; height: 41px; font-size: 17px; font-weight: 700; line-height: 1.4; color: #000; content: "Recepción cerrada"; background-color: #fff; border-radius: 8px; transform: rotate(-6deg); }',
        '.melschool .pContent__item.is-reception .pContent__item_link { display: none; }',
        '.melschool .js-bounce-target { opacity: 0; transform: scale(.88) translateY(40px); transition: opacity .7s ease var(--bounce-delay, 0s), transform .7s cubic-bezier(.165,.84,.44,1) var(--bounce-delay, 0s); }',
        '.melschool .js-bounce-target.is-bounce-in { opacity: 1; transform: none; }',
        '@media (prefers-reduced-motion: reduce) { .melschool .js-bounce-target { opacity: 1; transform: none; transition: none; } }',
        '@media (min-width: 768px) {',
        '.melschool { padding: 152px 40px 233px; }',
        '.melschool .pContent__headline_text { gap: 6px; font-size: 38px; }',
        '.melschool .pContent__headline .pContent__char::before { width: 63px; height: 63px; margin-top: 3px; }',
        '.melschool .pContent__headline .pContent__char.is-space { width: 22px; }',
        '.melschool .pContent__list { gap: 120px; margin-top: 65px; }',
        '.melschool .pContent__item_head { display: flex; align-items: center; justify-content: flex-start; padding: 10px 30px 22px 40px; }',
        '.melschool .pContent__item_head_vol { top: -46px; left: -36px; gap: 4px; }',
        '.melschool .pContent__item_head_vol_text { width: 67px; height: 47px; margin-top: 12px; }',
        '.melschool .pContent__item_head_vol_number { font-size: 35px; }',
        '.melschool .pContent__item_head_date { gap: 6px; }',
        '.melschool .pContent__item_head_time { font-size: 64px; line-height: 1; }',
        '.melschool .pContent__item_head_youbi { gap: 4px; font-size: 18px; }',
        '.melschool .pContent__item_head_text { gap: 10px; align-items: baseline; margin-top: 10px; margin-left: auto; }',
        '.melschool .pContent__item_head_text_head { font-size: 17px; }',
        '.melschool .pContent__item_head_text_body { position: relative; font-size: 18px; }',
        '.melschool .pContent__item_head_join { position: relative; top: auto; right: auto; gap: 9px; margin-top: 12px; margin-left: 18px; }',
        '.melschool .pContent__item_head_join_circle { width: 20px; height: 20px; }',
        '.melschool .pContent__item_body { display: flex; align-items: stretch; justify-content: flex-start; border-radius: 0 0 42px 42px; }',
        '.melschool .pContent__item_note { width: 100%; padding: 88px 70px 70px; overflow: hidden; border-radius: 0; }',
        '.melschool .pContent__item_note_background { top: calc(50% - 294px); margin-left: -293px; width: 586px; height: 588px; }',
        '.melschool .pContent__item_note_thumbnail_title { width: 96px; height: 35px; font-size: 16px; }',
        '.melschool .pContent__item_note_thumbnail_image { width: 389px; height: 242px; }',
        '.melschool .pContent__item_note_title { margin-top: 19px; font-size: 28px; }',
        '.melschool .pContent__item_note_text { margin-top: 10px; margin-bottom: auto; font-size: 18px; }',
        '.melschool .pContent__item_note_thumbnail_image .pContent__note_placeholder { font-size: 16px; }',
        '.melschool .pContent__item_note_food { --thumbnail-image-rotate: 3deg; }',
        '.melschool .pContent__item_note_beauty { --thumbnail-image-rotate: -3deg; }',
        '.melschool .pContent__item_link { width: 510px; height: 100px; margin-top: 50px; }',
        '.melschool .pContent__item_link .pContent__link_text { padding-bottom: 4px; font-size: 22px; }',
        '.melschool .pContent__item_link.is-coming-soon { height: 70px; }',
        '.melschool .pContent__item.is-end .pContent__item_note::after { top: calc(50% - 30px); width: 176px; height: 60px; font-size: 24px; font-weight: 700; content: "Finalizado"; border-radius: 15px; }',
        '.melschool .pContent__item.is-reception .pContent__item_note::after { top: calc(50% - 30px); width: 224px; height: 60px; font-size: 24px; content: "Recepción cerrada"; border-radius: 15px; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    // ---------------- HELPERS ----------------
    function doodleSVG(color) {
        var rings = '';
        for (var r = 22; r <= 90; r += 11) {
            var d = 'M';
            var pts = [];
            for (var i = 0; i <= 48; i++) {
                var a = (i / 48) * Math.PI * 2;
                var rr = r + Math.sin(a * 3 + r) * 2.5;
                pts.push((100 + rr * Math.cos(a)).toFixed(1) + ' ' + (100 + rr * Math.sin(a)).toFixed(1));
            }
            rings += '<path d="' + d + pts.join(' L') + '"/>';
        }
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="' + color + '" stroke-width="3.2" stroke-linecap="round">' + rings + '</g></svg>'
        );
    }

    function headlineHTML(title) {
        var chars = '';
        for (var i = 0; i < title.length; i++) {
            var ch = title.charAt(i);
            if (ch === ' ') {
                chars += '<span class="pContent__char is-space"></span>';
            } else {
                chars += '<span class="pContent__char">' + ch + '</span>';
            }
        }
        return '<div class="pContent__headline"><p class="pContent__headline_text">' + chars + '</p></div>';
    }

    function noteHTML(n, idx) {
        var cls = n.id === 'beauty' ? 'pContent__item_note_beauty' : 'pContent__item_note_food';
        var doodleColor = n.id === 'beauty' ? '#f78a94' : '#7ed2cd';
        var thumb = (n.img && n.img.indexOf('URL_') !== 0)
            ? '<img src="' + n.img + '" alt="" loading="lazy">'
            : '<span class="pContent__note_placeholder">' + n.cat + '</span>';
        return '<div class="pContent__item_note ' + cls + '">'
            + '<div class="pContent__item_note_background"><img src="' + doodleSVG(doodleColor) + '" alt=""></div>'
            + '<div class="pContent__item_note_thumbnail">'
            + '<div class="pContent__item_note_thumbnail_title"><span>' + n.cat + '</span></div>'
            + '<div class="pContent__item_note_thumbnail_image">' + thumb + '</div>'
            + '</div>'
            + '<div class="pContent__item_note_title">' + n.title + '</div>'
            + '<div class="pContent__item_note_text">' + n.text + '</div>'
            + '</div>';
    }

    function headHTML(v) {
        var join = '';
        for (var i = 0; i < v.join.length; i++) {
            join += '<div class="pContent__item_head_join_circle ' + v.join[i] + '"></div>';
        }
        return '<div class="pContent__item_head">'
            + '<div class="pContent__item_head_vol">'
            + '<span class="pContent__item_head_vol_text">' + VOL_SVG + '</span>'
            + '<span class="pContent__item_head_vol_number">' + v.vol + '</span>'
            + '</div>'
            + '<div class="pContent__item_head_date">'
            + '<time class="pContent__item_head_time" datetime="' + v.datetime + '">' + v.dateText + '</time>'
            + '<p class="pContent__item_head_youbi"><span>(</span>' + v.youbi + '<span>)</span></p>'
            + '</div>'
            + '<p class="pContent__item_head_text">'
            + '<span class="pContent__item_head_text_head"><span>(</span>' + v.headHead + '<span>)</span></span>'
            + '<span class="pContent__item_head_text_body">' + v.headBody + '</span>'
            + '</p>'
            + '<div class="pContent__item_head_join">' + join + '</div>'
            + '</div>';
    }

    function linkHTML(v) {
        if (v.status === 'is-end' || v.status === 'is-reception' || !v.link) return '';
        var hasHref = v.link.href && v.link.href.indexOf('URL_') !== 0;
        var cls = v.status === 'is-coming-soon' ? ' is-coming-soon' : (hasHref ? '' : ' is-coming-soon');
        var href = hasHref ? v.link.href : '#';
        var text = hasHref ? v.link.text : 'Proximamente';
        return '<div class="pContent__item_link' + cls + '">'
            + '<a href="' + href + '"><span class="pContent__link_text">' + text + '</span></a>'
            + '</div>';
    }

    function volHTML(v, idx) {
        var notes = '';
        for (var i = 0; i < v.notes.length; i++) {
            notes += noteHTML(v.notes[i], i);
        }
        return '<li id="melschool-vol-' + v.vol + '" class="pContent__item ' + (v.status || '') + ' js-bounce-trigger">'
            + '<div class="pContent__item_inner js-bounce-target" data-bounce="0.7" style="--bounce-delay:' + (idx * 0.12).toFixed(2) + 's">'
            + headHTML(v)
            + '<div class="pContent__item_body">' + notes + '</div>'
            + linkHTML(v)
            + '</div></li>';
    }

    // ---------------- HTML DE LA SECCION ----------------
    var seccion = document.createElement('div');
    seccion.className = 'melschool';
    seccion.id = 'melschool';
    var list = '';
    for (var i = 0; i < MELSCHOOL_VOLS.length; i++) {
        list += volHTML(MELSCHOOL_VOLS[i], i);
    }
    seccion.innerHTML = '<div class="melschool__wrap">'
        + headlineHTML(MELSCHOOL_TITLE)
        + '<ul class="pContent__list">' + list + '</ul>'
        + '</div>';

    // ---------------- INSERTAR DESPUES DEL BANNER ----------------
    function insertar() {
        if (seccion.parentNode) return;
        var ref = document.querySelector('.block-carrousel--1339211');
        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(seccion, ref.nextSibling);
        } else {
            document.body.appendChild(seccion);
        }
    }

    // ---------------- ANIMACION DE ENTRADA (bounce) ----------------
    function bounce() {
        var targets = seccion.querySelectorAll('.js-bounce-target');
        if (!('IntersectionObserver' in window)) {
            for (var i = 0; i < targets.length; i++) targets[i].classList.add('is-bounce-in');
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-bounce-in');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        for (var i = 0; i < targets.length; i++) obs.observe(targets[i]);
    }

    // ---------------- ARRANQUE ----------------
    function start() {
        insertar();
        bounce();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();