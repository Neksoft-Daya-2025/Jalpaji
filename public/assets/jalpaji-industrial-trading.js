(() => {
  if (window.location.pathname.replace(/\/+$/, '') !== '/industrial-trading-2') return;

  const slides = [
    { title: 'Coal', subtitle: 'Steel & Cement Production', description: 'High-quality thermal and metallurgical coal, essential for power generation and steel production.', image: '/wp-content/uploads/2025/02/coal.png', origins: ['SOUTH AFRICA', 'TANZANIA'] },
    { title: 'Iron Ore', subtitle: 'The Backbone of Steel Manufacturing', description: 'Sourced from premium mines, ensuring strength and durability in industrial applications.', image: '/wp-content/uploads/2025/02/iron-orebg2.png' },
    { title: 'Manganese Ore', subtitle: 'Strengthening Steel & Chemical Industries', description: 'Essential for steel production and widely used in chemical industries, available in various grades.', image: '/wp-content/uploads/2025/02/maganese-ore.png' },
    { title: 'Ferrous & Non-Ferrous Scrap', subtitle: 'Sustainable & Recyclable Metals', description: 'High-quality recyclable metal scrap, including steel, aluminum, copper, and more, supporting sustainable manufacturing.', image: '/wp-content/uploads/2025/02/Ferrous-Non-Ferrous-Scrap.png' },
    { title: 'Copper Concentrate', subtitle: 'Powering Electrical & Metallurgical Excellence', description: 'Sourced from the rich copper belts of Zambia, DRC, and Tanzania—ensuring purity, performance, and reliability in every application.', image: '/wp-content/uploads/2025/06/COPPER-CONCENTRATE.jpg' },
    { title: 'Sulphur Granules', subtitle: 'Enriching Agriculture & Chemical Production', description: 'Sourced from premium mines across CIS countries and the Balkan region, ensuring strength and reliability in agricultural and industrial applications.', image: '/wp-content/uploads/2025/06/SULPHUR-GRANULES.jpg' },
    { title: 'Prilled Urea', subtitle: 'Driving Agricultural Success, One Granule at a Time', description: 'Sourced from leading manufacturers across CIS countries ensuring high nitrogen content and consistent quality for agricultural excellence.', image: '/wp-content/uploads/2025/06/Prilled-Urea.jpg' }
  ];

  const mount = () => {
  const host = document.querySelector('.legacy-page');
  if (!host || host.dataset.industrialCarousel) return false;
  host.dataset.industrialCarousel = 'true';

  const escapeHTML = (value) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const originLinks = { 'SOUTH AFRICA': '/south-africa/', TANZANIA: '/tanzania/' };
  const slideMarkup = slides.map((slide, index) => {
    const origins = slide.origins ? `<div class="industrial-trading-page__origins"><span class="industrial-trading-page__origin-label">We trade from:</span>${slide.origins.map((origin) => originLinks[origin] ? `<a class="industrial-trading-page__origin" href="${originLinks[origin]}">${escapeHTML(origin)}</a>` : `<span class="industrial-trading-page__origin">${escapeHTML(origin)}</span>`).join('')}</div>` : '';
    return `<article class="industrial-trading-page__slide${index === 0 ? ' is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${slides.length}: ${escapeHTML(slide.title)}" style="--slide-image:url('${slide.image}')"><div class="industrial-trading-page__content"><p class="industrial-trading-page__eyebrow">We trade in</p><h1>${escapeHTML(slide.title)}</h1><p class="industrial-trading-page__subtitle">${escapeHTML(slide.subtitle)}</p><p class="industrial-trading-page__description">${escapeHTML(slide.description)}</p>${origins}</div></article>`;
  }).join('');
  const dots = slides.map((slide, index) => `<button class="industrial-trading-page__dot" type="button" role="tab" aria-label="Show ${escapeHTML(slide.title)}" aria-selected="${index === 0}" data-slide="${index}"></button>`).join('');

  host.outerHTML = `<main class="industrial-trading-page" aria-label="Industrial Trading"><div class="industrial-trading-page__slides" aria-live="polite">${slideMarkup}</div><div class="industrial-trading-page__dots" role="tablist" aria-label="Industrial Trading products">${dots}</div><div class="industrial-trading-page__controls"><button class="industrial-trading-page__control" type="button" aria-label="Previous product" data-direction="-1">‹</button><button class="industrial-trading-page__control" type="button" aria-label="Next product" data-direction="1">›</button></div></main>`;

  const carousel = document.querySelector('.industrial-trading-page');
  const elements = [...carousel.querySelectorAll('.industrial-trading-page__slide')];
  const dotsElements = [...carousel.querySelectorAll('.industrial-trading-page__dot')];
  let current = 0;
  let timer;
  const show = (next) => {
    current = (next + slides.length) % slides.length;
    elements.forEach((slide, index) => slide.classList.toggle('is-active', index === current));
    dotsElements.forEach((dot, index) => dot.setAttribute('aria-selected', String(index === current)));
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => show(current + 1), 6500); };
  carousel.querySelectorAll('[data-slide]').forEach((dot) => dot.addEventListener('click', () => { show(Number(dot.dataset.slide)); restart(); }));
  carousel.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('click', () => { show(current + Number(button.dataset.direction)); restart(); }));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);
  restart();
  return true;
  };

  if (!mount()) {
    let attempts = 0;
    const waitingForReact = setInterval(() => {
      attempts += 1;
      if (mount() || attempts === 50) clearInterval(waitingForReact);
    }, 100);
  }
})();
