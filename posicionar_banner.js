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

        // Medir altura real del banner ANTES de moverlo
        var alturaBanner = Math.max(
            banner.offsetHeight || 0,
            banner.getBoundingClientRect().height || 0,
            600 // estimación mínima por si mide 0
        );

        // Crear placeholder con esa altura para reservar el espacio
        var placeholder = document.getElementById('melmak-banner-placeholder');
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.id = 'melmak-banner-placeholder';
            placeholder.style.cssText = 'height:' + alturaBanner + 'px;width:100%;pointer-events:none;display:block;';
            ref.parentNode.insertBefore(placeholder, ref);
        }

        // Mover el banner después del placeholder
        placeholder.parentNode.insertBefore(banner, placeholder.nextSibling);

        // Quitar el placeholder en el siguiente frame
        // (el banner ya está renderizado en su lugar definitivo)
        requestAnimationFrame(function () {
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
        });

        try { window.dispatchEvent(new Event('scroll')); } catch (e) { }
        return true;
    }
    function ocultar() {
        var banner = document.getElementById('melmak-bbs-root');
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        return !!banner;
    }
    function iniciar() {
        if (esPortada ? colocar() : ocultar()) return;
        var intentos = 0;
        var timer = setInterval(function () {
            if ((esPortada ? colocar() : ocultar()) || ++intentos >= 100) clearInterval(timer);
        }, 100);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
