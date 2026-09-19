(function () {
    'use strict';
    var esPortada = location.pathname.replace(/\/+$/, '') === '';
    function colocar() {
        var banner = document.getElementById('melmak-bbs-root');
        if (!banner || !banner.parentNode) return false;
        var catalogo = document.getElementById('melk-catalogo');
        var ref = (catalogo && catalogo.parentNode) ? catalogo : null;
        if (!ref) {
            var menu = document.querySelector('.header-menu');
            ref = menu && menu.parentNode ? menu.nextSibling : null;
        }
        if (!ref || !ref.parentNode) return false;
        ref.parentNode.insertBefore(banner, ref);
        try { window.dispatchEvent(new Event('scroll')); } catch (e) { }
        return true;
    }
    function ocultar() {
        var banner = document.getElementById('melmak-bbs-root');
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        return !!banner;
    }
    function iniciar() {
        var intentos = 0;
        var timer = setInterval(function () {
            var listo = esPortada ? colocar() : ocultar();
            if (listo || ++intentos >= 100) clearInterval(timer);
        }, 100);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
