document.body.classList.add('loading');
const intro = document.getElementById('cinematicIntro');
const skipIntro = document.getElementById('skipIntro');
let introFinished = false;

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  intro.classList.add('intro--done');
  document.body.classList.remove('loading');
  document.body.classList.add('intro-complete');
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) {
  finishIntro();
} else {
  setTimeout(finishIntro, 5200);
}
skipIntro.addEventListener('click', finishIntro);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const box = item.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * .16;
    const y = (event.clientY - box.top - box.height / 2) * .16;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });
  item.addEventListener('pointerleave', () => { item.style.transform = ''; });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const heroPortrait = document.getElementById('heroPortrait');
let scrollTicking = false;

function updatePortraitTransition() {
  if (!reducedMotion && heroPortrait) {
    const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * .72)));
    const baseOpacity = window.matchMedia('(max-width: 800px)').matches ? .58 : 1;
    heroPortrait.style.opacity = String(baseOpacity * (1 - progress));
    heroPortrait.style.transform = `translate3d(0, ${progress * -54}px, 0) scale(${1 + progress * .045})`;
  }
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updatePortraitTransition);
    scrollTicking = true;
  }
}, { passive: true });

updatePortraitTransition();

const siteCarousel = document.getElementById('siteCarousel');
const siteRange = document.getElementById('siteRange');
if (siteCarousel && siteRange) {
  const syncSiteRange = () => {
    const remaining = siteCarousel.scrollWidth - siteCarousel.clientWidth;
    const value = remaining > 0 ? Math.round(siteCarousel.scrollLeft / remaining * 100) : 0;
    siteRange.value = String(Math.min(100, Math.max(0, value)));
    siteRange.style.setProperty('--site-progress', siteRange.value + '%');
  };
  siteRange.addEventListener('input', () => {
    const remaining = siteCarousel.scrollWidth - siteCarousel.clientWidth;
    siteCarousel.scrollLeft = remaining * Number(siteRange.value) / 100;
    siteRange.style.setProperty('--site-progress', siteRange.value + '%');
  });
  siteCarousel.addEventListener('scroll', syncSiteRange, { passive: true });
  window.addEventListener('resize', syncSiteRange);
  syncSiteRange();
}
