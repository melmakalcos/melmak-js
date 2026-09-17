(() => {
    'use strict';

    if (document.getElementById('melmak-cabecera-fija')) return;

    const style = document.createElement('style');
    style.id = 'melmak-cabecera-fija';
    style.textContent = `
    .header-menu__desktop > .header-logo,
    .header-menu__desktop > .header-menu__desktop-list,
    .header-menu__mobile > .header-logo,
    .header-menu__mobile > .mobile__actions {
      position: fixed;
      top: var(--melmak-fixed-top, 24px);
      z-index: 100;
    }

    .header-menu__desktop > .header-logo,
    .header-menu__mobile > .header-logo {
      left: var(--melmak-fixed-left, 24px);
    }

    .header-menu__desktop > .header-menu__desktop-list,
    .header-menu__mobile > .mobile__actions {
      right: var(--melmak-fixed-right, 24px);
      margin: 0;
    }

    @media (max-width: 959px) {
      .header-menu__mobile > .header-logo,
      .header-menu__mobile > .mobile__actions {
        top: var(--melmak-fixed-top-m, 16px);
      }

      .header-menu__mobile > .header-logo {
        left: var(--melmak-fixed-left-m, 16px);
      }

      .header-menu__mobile > .mobile__actions {
        right: var(--melmak-fixed-right-m, 16px);
      }
    }
  `;
    document.head.appendChild(style);
})();
