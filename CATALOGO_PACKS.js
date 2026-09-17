// ==========================================
// SECCION "MELSCHOOL" - TARJETAS DE ACTIVIDAD
// Se inserta DESPUES del banner principal (.block-carrousel--1339211)
// ==========================================
(function () {
    if (document.getElementById('melschool')) return;

    // 1. Estilos
    const style = document.createElement('style');
    style.textContent = `
    .melschool { max-width: 1100px; margin: 0 auto; padding: 40px 16px; }
    .melschool__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 28px; }
    .melschool__item { background: #fff; border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,.08); overflow: hidden; }
    .melschool__inner { padding: 20px; }
    .melschool__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid #eee; margin-bottom: 16px; }
    .melschool__vol { display: inline-flex; align-items: center; gap: 6px; font-size: .8rem; letter-spacing: 2px; color: #353535; text-transform: uppercase; }
    .melschool__num { background: #e53935; color: #fff; font-weight: 800; border-radius: 50%; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; }
    .melschool__date { font-size: 1.6rem; font-weight: 800; color: #353535; line-height: 1; }
    .melschool__date small { display: block; font-size: .7rem; font-weight: 400; color: #999; letter-spacing: 2px; }
    .melschool__target { margin-left: auto; font-size: .75rem; color: #e53935; border: 1px solid #e53935; border-radius: 999px; padding: 4px 10px; }
    .melschool__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .melschool__card { display: block; text-decoration: none; border-radius: 14px; overflow: hidden; background: #fafafa; transition: transform .3s ease, box-shadow .3s ease; }
    .melschool__card:hover { transform: translateY(-4px); box-shadow: 0 10px 26px rgba(0,0,0,.12); }
    .melschool__card_img { display: block; overflow: hidden; aspect-ratio: 1.6 / 1; }
    .melschool__card_img img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .melschool__card_body { padding: 12px 14px 16px; }
    .melschool__card_cat { font-size: .7rem; color: #e53935; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
    .melschool__card_title { display: block; font-weight: 800; color: #353535; margin: 6px 0; font-size: 1.05rem; }
    .melschool__card_text { display: block; color: #888; font-size: .85rem; line-height: 1.55; }
    .melschool__inner { opacity: 0; transform: translateY(40px) scale(.8); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.9,.3,1.2); }
    .melschool__inner.is-inview { opacity: 1; transform: none; }
    @media (max-width: 768px) {
      .melschool__cards { grid-template-columns: 1fr; }
      .melschool__date { font-size: 1.3rem; }
    }
  `;
    document.head.appendChild(style);

    // 2. HTML de la seccion (duplica el <li> para otro evento, el <a> para otra tarjeta)
    const seccion = document.createElement('div');
    seccion.className = 'melschool';
    seccion.id = 'melschool';
    seccion.innerHTML = `
    <ul class="melschool__list">
      <li class="melschool__item">
        <div class="melschool__inner">
          <div class="melschool__head">
            <span class="melschool__vol">Vol<span class="melschool__num">1</span></span>
            <span class="melschool__date">9.16<small>SEP</small></span>
            <span class="melschool__target">Cupo limitado</span>
          </div>
          <div class="melschool__cards">
            <a class="melschool__card" href="URL_LINK_AQUI">
              <span class="melschool__card_img"><img src="URL_IMAGEN_AQUI" alt=""></span>
              <span class="melschool__card_body">
                <span class="melschool__card_cat">Categoria 1</span>
                <span class="melschool__card_title">Titulo de la actividad 1</span>
                <span class="melschool__card_text">Descripcion corta de la actividad 1.</span>
              </span>
            </a>
            <a class="melschool__card" href="URL_LINK_AQUI">
              <span class="melschool__card_img"><img src="URL_IMAGEN_AQUI" alt=""></span>
              <span class="melschool__card_body">
                <span class="melschool__card_cat">Categoria 2</span>
                <span class="melschool__card_title">Titulo de la actividad 2</span>
                <span class="melschool__card_text">Descripcion corta de la actividad 2.</span>
              </span>
            </a>
          </div>
        </div>
      </li>
    </ul>
  `;

    // 3. Insertarla despues del banner principal
    function insertar() {
        if (seccion.parentNode) return;
        const ref = document.querySelector('.block-carrousel--1339211');
        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(seccion, ref.nextSibling);
        } else {
            document.body.appendChild(seccion);
        }
    }

    // 4. Rebote al hacer scroll
    function bounce() {
        const items = seccion.querySelectorAll('.melschool__inner');
        if (!('IntersectionObserver' in window)) {
            for (let i = 0; i < items.length; i++) items[i].classList.add('is-inview');
            return;
        }
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('is-inview');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        for (let i = 0; i < items.length; i++) obs.observe(items[i]);
    }

    // 5. Arranque
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