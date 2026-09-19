/* =========================================================
   MELMAK — PANTALLA DE BIENVENIDA  (bienvenida.js)
   =========================================================
   · Fullscreen, SIN barra de desplazamiento, responsive.
   · Fondo amarillo + franjas laterales #353535 (MELMAK rotado).
   · Personaje que cae desde arriba y vibra (parece caer infinito).
   · Partículas negras subiendo (efecto "en el aire").
   · Caja central (blanca, sin borde) + botón ENTRAR.
   · Al tocar ENTRAR se desvanece y se elimina.
   · Se muestra 1 vez por sesión (sessionStorage).
   · FUENTES PRECARGADAS: el overlay se muestra recién cuando
     "Curda Gouda" y "vinyl" ya están cargadas, para que el texto
     no cambie de tamaño/tipo a mitad de pantalla.
   ========================================================= */
(function () {
    'use strict';

    if (sessionStorage.getItem('melmak-bienvenida-visto') === '1') return;
    sessionStorage.setItem('melmak-bienvenida-visto', '1');

    /* =============== TEXTO / IMAGEN (EDITAR AQUÍ) =============== */
    var TEXTO = {
        etiqueta: 'BIENVENID@S',
        texto: 'SI, SON STICKERS UV Y RESISTENTES A TODO.\nNO, NO NOS NECESITAS PARA DESTACAR,\nSOLO ESTAMOS PARA DARLE + COLOR A TU VIDA.'
    };
    var BOTON = 'ENTRAR';
    var LINK_ENTRAR = 'https://www.melmakalcos.com.ar';
    var BANDA_TEXTO = 'MELMAK';
    var CHAR_URL = 'https://d22fxaf9t8d39k.cloudfront.net/8bc37ffe9fdd82d49e3913270e289f2ec8ea2654cd2c633514cb9ede3f28077d20700.png';
    var CURDA_URL = 'https://cdn.jsdelivr.net/gh/melmakalcos/melmak-js@51a89bfb88809c8675480f42147afd66d90c6f19/Curda%20Gouda.ttf';
    /* ============================================================ */

    var style = document.createElement('style');
    style.textContent = [
        '@font-face{font-family:"Curda Gouda";src:url("' + CURDA_URL + '") format("truetype");font-weight:400;font-style:normal;font-display:block;}',
        '@font-face{font-family:"Curda Gouda";src:url("' + CURDA_URL + '") format("truetype");font-weight:700;font-style:normal;font-display:block;}',
        '#melmak-bienvenida{position:fixed;inset:0;z-index:2147483600;',
        '  background:#ffee26;overflow:hidden;',
        '  display:flex;flex-direction:column;align-items:center;justify-content:center;',
        '  text-align:center;',
        '  padding-left:var(--banda);padding-right:var(--banda);',
        '  animation:mw-in .5s ease both;}',
        '#melmak-bienvenida.is-saliendo{animation:mw-out .55s cubic-bezier(.7,0,.2,1) forwards;}',
        '#melmak-bienvenida,#melmak-bienvenida *{font-family:inherit;box-sizing:border-box;}',
        '#melmak-bienvenida .mw-banda{position:absolute;top:0;bottom:0;width:var(--banda);',
        '  background:#353535;overflow:hidden;z-index:0;',
        '  display:flex;justify-content:center;align-items:flex-start;}',
        '#melmak-bienvenida .mw-banda--izq{left:0;}',
        '#melmak-bienvenida .mw-banda--der{right:0;}',
        '#melmak-bienvenida .mw-banda__track{display:flex;flex-direction:column;align-items:center;',
        '  animation:mwb-scroll 14s linear infinite;will-change:transform;}',
        '#melmak-bienvenida .mw-banda__palabra{writing-mode:vertical-rl;',
        '  font-family:"Curda Gouda",Rubik,Arial,sans-serif;font-weight:700;',
        '  white-space:nowrap;line-height:1.1;text-align:center;padding:8px 0;}',
        '#melmak-bienvenida .mw-banda__palabra span{font-family:"Curda Gouda",Rubik,Arial,sans-serif;color:#ffffff;}',
        '#melmak-bienvenida .mw-banda__palabra span.c-amarillo{font-family:"Curda Gouda",Rubik,Arial,sans-serif;color:#ffee26;}',
        '#melmak-bienvenida .mw-caja__tipeado{font-family:\'vinyl\',\'matt-b\',Rubik,Arial,sans-serif;}',
        '#melmak-bienvenida .mw-particula{position:absolute;bottom:-12px;z-index:1;',
        '  pointer-events:none;animation:mw-sube linear infinite;}',
        '#melmak-bienvenida .mw-particula i{display:block;width:100%;height:100%;',
        '  background:#353535;border-radius:50%;',
        '  animation:mw-onda ease-in-out infinite;}',
        '#melmak-bienvenida .mw-char{position:relative;z-index:3;margin-bottom:-8px;',
        '  animation:mw-char-cae .9s cubic-bezier(.22,1,.36,1) .1s both;}',
        '#melmak-bienvenida .mw-char__inner{position:relative;display:inline-block;',
        '  animation:mw-char-vibra .9s ease-in-out infinite;}',
        '#melmak-bienvenida .mw-char__glitch{position:relative;display:inline-block;}',
        '#melmak-bienvenida .mw-char__glitch img{display:block;width:clamp(90px,14vw,150px);height:auto;}',
        '#melmak-bienvenida .mw-char__glitch::before,',
        '#melmak-bienvenida .mw-char__glitch::after{content:"";position:absolute;inset:0;',
        '  background:url("' + CHAR_URL + '") center/100% 100% no-repeat;',
        '  filter:grayscale(1) contrast(1.2);opacity:.85;pointer-events:none;}',
        '#melmak-bienvenida .mw-char__glitch::before{left:3px;animation:mw-glitch-a 2.4s steps(1,end) infinite;}',
        '#melmak-bienvenida .mw-char__glitch::after{left:-3px;animation:mw-glitch-b 2.4s steps(1,end) infinite;}',
        '#melmak-bienvenida .mw-caja{position:relative;z-index:2;',
        '  width:100%;max-width:440px;box-sizing:border-box;',
        '  background:#ffffff;color:#353535;border-radius:clamp(18px,3vw,28px);',
        '  padding:clamp(14px,4vw,38px);overflow:hidden;',
        '  animation:mw-caja-in .7s cubic-bezier(.2,.8,.2,1) .2s both;}',
        '#melmak-bienvenida .mw-caja__label{',
        '  font-family:"Curda Gouda",Rubik,Arial,sans-serif;',
        '  font-size:clamp(18px,2.6vw,22px);font-weight:400;letter-spacing:.25em;',
        '  text-transform:uppercase;color:#353535;margin:0 0 14px;}',
        '#melmak-bienvenida .mw-caja__text{',
        '  font-family:\'vinyl\',\'matt-b\',Rubik,Arial,sans-serif;',
        '  font-size:clamp(11.5px,3.2vw,18px);font-weight:400;line-height:1.6;',
        '  color:#353535;opacity:.95;margin:0 auto;text-align:left;',
        '  white-space:pre;min-height:4.8em;',
        '  width:fit-content;max-width:100%;}',
        '#melmak-bienvenida .mw-cursor{display:inline-block;width:2px;height:1.05em;',
        '  background:#353535;vertical-align:-0.15em;margin-left:2px;',
        '  animation:mw-cursor-blink 1s steps(1) infinite;}',
        '#melmak-bienvenida .mw-btn{position:relative;z-index:2;',
        '  font-family:"Curda Gouda",Rubik,Arial,sans-serif;',
        '  font-size:clamp(18px,3vw,24px);font-weight:700;letter-spacing:.06em;',
        '  text-transform:uppercase;color:#ffffff;',
        '  background:#353535;border:3px solid #353535;cursor:pointer;',
        '  padding:15px 52px;border-radius:999px;margin-top:clamp(20px,4vh,40px);',
        '  transition:transform .25s ease;',
        '  animation:mw-btn-in .6s ease .4s both;}',
        '#melmak-bienvenida .mw-btn:hover{background:#ffffff;color:#353535;transform:scale(1.06);}',
        '@keyframes mw-in{from{opacity:0;}to{opacity:1;}}',
        '@keyframes mw-out{0%{opacity:1;}100%{opacity:0;}}',
        '@keyframes mw-caja-in{from{opacity:0;transform:translateY(16px) scale(.97);}to{opacity:1;transform:none;}}',
        '@keyframes mw-btn-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}',
        '@keyframes mwb-scroll{from{transform:translateY(0);}to{transform:translateY(-50%);}}',
        '@keyframes mw-char-cae{0%{transform:translateY(-220vh);}100%{transform:translateY(0);}}',
        '@keyframes mw-char-vibra{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}',
        '@keyframes mw-glitch-a{0%,80%,100%{clip-path:inset(0 0 100% 0);}',
        '  82%{clip-path:inset(8% 0 64% 0);}84%{clip-path:inset(46% 0 32% 0);}',
        '  86%{clip-path:inset(24% 0 56% 0);}88%{clip-path:inset(68% 0 10% 0);}',
        '  90%{clip-path:inset(0 0 100% 0);}}',
        '@keyframes mw-glitch-b{0%,78%,100%{clip-path:inset(0 0 100% 0);}',
        '  81%{clip-path:inset(58% 0 18% 0);}84%{clip-path:inset(18% 0 66% 0);}',
        '  87%{clip-path:inset(50% 0 26% 0);}90%{clip-path:inset(6% 0 76% 0);}',
        '  93%{clip-path:inset(0 0 100% 0);}}',
        '@keyframes mw-cursor-blink{0%,49%{opacity:1;}50%,100%{opacity:0;}}',
        '@keyframes mw-sube{0%{transform:translateY(0);opacity:0;}8%{opacity:1;}55%{opacity:1;}82%{transform:translateY(-88vh);opacity:0;}100%{transform:translateY(-108vh);opacity:0;}}',
        '@keyframes mw-onda{0%,100%{transform:translateX(0);}50%{transform:translateX(var(--amp,10px));}}',
        '@media (max-width:767px){',
        '  #melmak-bienvenida .mw-caja{max-width:96%;}',
        '}',
        '@media (prefers-reduced-motion:reduce){',
        '  #melmak-bienvenida,#melmak-bienvenida .mw-caja,#melmak-bienvenida .mw-btn,',
        '  #melmak-bienvenida .mw-banda__track,#melmak-bienvenida .mw-char,#melmak-bienvenida .mw-char__inner,',
        '  #melmak-bienvenida .mw-particula,#melmak-bienvenida .mw-particula i{animation:none;}',
        '  #melmak-bienvenida .mw-char__glitch::before,#melmak-bienvenida .mw-char__glitch::after{display:none;}',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    /* ============ PRECARGA DE FUENTES ============ */
    function precargarCurda() {
        return Promise.all([
            new Promise(function (res) {
                try {
                    document.fonts.load('400 20px "Curda Gouda"').then(res, res);
                } catch (e) { res(); }
            }),
            new Promise(function (res) {
                try {
                    document.fonts.load('700 20px "Curda Gouda"').then(res, res);
                } catch (e) { res(); }
            })
        ]);
    }

    function cargarVinyl() {
        return new Promise(function (res) {
            var tk = document.getElementById('melk-typekit-vinyl');
            function listo() {
                var vin = [document.fonts.load('16px vinyl'), document.fonts.load('400 16px "matt-b"')];
                Promise.all(vin).then(res, res);
            }
            if (tk) {
                if (tk.sheet && tk.sheet.cssRules.length) listo();
                else { tk.addEventListener('load', listo); tk.addEventListener('error', res); }
            } else {
                tk = document.createElement('link');
                tk.id = 'melk-typekit-vinyl';
                tk.rel = 'stylesheet';
                tk.href = 'https://use.typekit.net/tdt2nii.css';
                tk.onload = listo;
                tk.onerror = res;
                document.head.appendChild(tk);
            }
        });
    }

    function construir() {
        var overlay = document.createElement('div');
        overlay.id = 'melmak-bienvenida';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Bienvenida');

        /* ---------- Franjas laterales ---------- */
        var fs = Math.max(18, Math.min(Math.round(window.innerWidth * 0.035), 34));
        var banda = fs + 16;
        overlay.style.setProperty('--banda', banda + 'px');

        function crearPalabra() {
            var w = document.createElement('div');
            w.className = 'mw-banda__palabra';
            w.style.fontSize = fs + 'px';
            var letras = BANDA_TEXTO.split('');
            for (var i = 0; i < letras.length; i++) {
                var s = document.createElement('span');
                s.textContent = letras[i];
                if (i % 2 === 1) s.className = 'c-amarillo';
                w.appendChild(s);
            }
            return w;
        }

        function construirBanda(lado) {
            var bandaEl = document.createElement('div');
            bandaEl.className = 'mw-banda mw-banda--' + lado;
            var track = document.createElement('div');
            track.className = 'mw-banda__track';

            var lh = Math.round(fs * 1.1);
            var palabraH = BANDA_TEXTO.length * lh + 16;
            var half = Math.max(2, Math.ceil(window.innerHeight / palabraH) + 2);

            for (var i = 0; i < half; i++) track.appendChild(crearPalabra());
            for (var j = 0; j < half; j++) track.appendChild(crearPalabra());

            bandaEl.appendChild(track);
            return bandaEl;
        }

        overlay.appendChild(construirBanda('izq'));
        overlay.appendChild(construirBanda('der'));

        /* ---------- Partículas negras subiendo ---------- */
        var N_PARTICULAS = 50;
        for (var p = 0; p < N_PARTICULAS; p++) {
            var part = document.createElement('div');
            part.className = 'mw-particula';
            var size = 2 + Math.random() * 5;
            var dur = 2.5 + Math.random() * 2.5;
            var amp = 6 + Math.random() * 16;
            var ondaDur = 1.2 + Math.random() * 1.8;
            part.style.width = size + 'px';
            part.style.height = size + 'px';
            part.style.left = (Math.random() * 100) + '%';
            part.style.animationDuration = dur + 's';
            part.style.animationDelay = (-Math.random() * dur) + 's';
            var core = document.createElement('i');
            core.style.setProperty('--amp', amp + 'px');
            core.style.animationDuration = ondaDur + 's';
            part.appendChild(core);
            overlay.appendChild(part);
        }

        /* ---------- Personaje que cae y vibra ---------- */
        var charWrap = document.createElement('div');
        charWrap.className = 'mw-char';
        var charInner = document.createElement('div');
        charInner.className = 'mw-char__inner';
        var charGlitch = document.createElement('div');
        charGlitch.className = 'mw-char__glitch';

        var charImg = document.createElement('img');
        charImg.src = CHAR_URL;
        charImg.alt = '';
        charGlitch.appendChild(charImg);
        charInner.appendChild(charGlitch);

        charWrap.appendChild(charInner);
        overlay.appendChild(charWrap);

        /* ---------- Caja central ---------- */
        var caja = document.createElement('div');
        caja.className = 'mw-caja';

        var label = document.createElement('p');
        label.className = 'mw-caja__label';
        label.textContent = TEXTO.etiqueta;
        caja.appendChild(label);

        var texto = document.createElement('p');
        texto.className = 'mw-caja__text';
        var tipeado = document.createElement('span');
        tipeado.className = 'mw-caja__tipeado';
        texto.appendChild(tipeado);
        var cursor = document.createElement('span');
        cursor.className = 'mw-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        texto.appendChild(cursor);
        caja.appendChild(texto);

        overlay.appendChild(caja);

        /* ---------- Efecto máquina de escribir ---------- */
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function iniciarTipeo() {
            if (reduceMotion) {
                tipeado.textContent = TEXTO.texto;
                return;
            }

            var txtCompleto = TEXTO.texto;

            var iTxt = 0;
            function tipear() {
                if (iTxt < txtCompleto.length) {
                    iTxt++;
                    tipeado.textContent = txtCompleto.slice(0, iTxt);
                    var demora = (txtCompleto.charAt(iTxt - 1) === '\n') ? 450 : 30;
                    setTimeout(tipear, demora);
                }
            }
            setTimeout(tipear, 700);
        }

        /* ---------- Botón ---------- */
        var btn = document.createElement('button');
        btn.className = 'mw-btn';
        btn.type = 'button';
        btn.textContent = BOTON;
        btn.addEventListener('click', function () {
            overlay.classList.add('is-saliendo');
            document.documentElement.style.overflow = '';
            if (document.body) document.body.style.overflow = '';
            setTimeout(function () {
                overlay.remove();
            }, 580);
        });
        overlay.appendChild(btn);

        function mostrar() {
            if (overlay.parentNode) return;
            document.documentElement.style.overflow = 'hidden';
            if (document.body) document.body.style.overflow = 'hidden';
            document.documentElement.appendChild(overlay);
        }

        mostrar();
        document.addEventListener('DOMContentLoaded', function () {
            if (document.body) document.body.style.overflow = 'hidden';
        });

        iniciarTipeo();
    }

    /* Cobertura inmediata para evitar el pantallazo del home;
       el overlay completo se arma cuando las fuentes están listas. */
    var cargando = document.createElement('div');
    cargando.id = 'melmak-bienvenida-cargando';
    cargando.setAttribute('aria-hidden', 'true');
    cargando.style.cssText = 'position:fixed;inset:0;background:#ffee26;z-index:2147483600;';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.appendChild(cargando);

    function construirYLimpiar() {
        construir();
        if (cargando.parentNode) cargando.parentNode.removeChild(cargando);
    }

    var plazoMax = setTimeout(construirYLimpiar, 2500);
    Promise.all([precargarCurda(), cargarVinyl()]).then(function () {
        clearTimeout(plazoMax);
        construirYLimpiar();
    });
})();