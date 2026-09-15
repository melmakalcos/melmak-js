/*TILT_MELMAK v2 — más profundo + badge siempre visible*/
(function () {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  var SEL = '.block-products-feed__product-media,' +
            '.products-feed__product-media,' +
            '.product-preview-carrousel__item';

  /* El badge de oferta NUNCA se tapa: queda arriba del brillo */
  var cssT = document.createElement('style');
  cssT.appendChild(document.createTextNode(
    '.block-products-feed__product-media .block-products-feed__product-offer,' +
    '.products-feed__product-media .products-feed__product-offer,' +
    '.block-products-feed__product-media .block-products-feed__product-link' +
    '.products-feed__product-media .products-feed__product-link' +
    '{ position:relative; z-index:4 !important; }'
  ));
  document.head.appendChild(cssT);

  function atar() {
    var cs = document.querySelectorAll(SEL);
    for (var i = 0; i < cs.length; i++) {
      (function (c) {
        if (c.getAttribute('data-mxm-tilt')) return;
        var img = c.querySelector('img');
        if (!img) return;
        c.setAttribute('data-mxm-tilt', '1');

        var lu = document.createElement('div');
        lu.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2;' +
          'background:radial-gradient(circle at var(--mx,50%) var(--my,50%),' +
          'rgba(255,255,255,.5),transparent 55%);opacity:0;transition:opacity .2s;' +
          'border-radius:inherit;';
        c.appendChild(lu);

        function bienv() { return !!document.getElementById('mzm-wm'); }

        c.addEventListener('mouseenter', function () {
          if (bienv()) return;
          lu.style.opacity = '1';
        });

        c.addEventListener('mousemove', function (e) {
          if (bienv()) return;
          var r = c.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height###;
          var detalle = c.className.indexOf('product-preview-carrousel') !== -1;
          if (detalle) {
            /* galería del producto: suave */
            img.style.transform = 'perspective(700px) rotateX(' + ((0.5-y)*10) +
              'deg) rotateY(' + ((x-0.5)*12) + 'deg)';
          } else {
            /* feeds (home + categorías): FUERTE */
            img.style.transform = 'perspective(520px) rotateX(' + ((0.5-y)*24
