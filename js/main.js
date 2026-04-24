/* ── Page navigation with clean URL routing ── */
const pageMeta = {
  home:      { title: 'Georgetown Oaks | Wedding & Event Venue · Canonsburg, PA',      desc: 'Pittsburgh\'s premier wedding and event venue in Canonsburg, PA. Stunning ballroom, outdoor sunset deck, speakeasy, and full-service bar.' },
  weddings:  { title: 'Weddings | Georgetown Oaks · Canonsburg, PA',                   desc: 'Plan your dream wedding at Georgetown Oaks. A stunning 4,000 sq ft ballroom and outdoor sunset deck just outside Pittsburgh in Canonsburg, PA.' },
  private:   { title: 'Private Events | Georgetown Oaks · Canonsburg, PA',             desc: 'Host milestone birthdays, anniversaries, baby showers and more at Georgetown Oaks — Pittsburgh\'s premier private event venue.' },
  corporate: { title: 'Corporate Events | Georgetown Oaks · Canonsburg, PA',           desc: 'Modern event space for corporate gatherings, team meetings, product launches and holiday parties near Pittsburgh in Canonsburg, PA.' },
  venue:     { title: 'Venue Details | Georgetown Oaks · Canonsburg, PA',              desc: 'Explore Georgetown Oaks — 4,000 sq ft ballroom, 1,280 sq ft sunset deck, bridal suite, speakeasy, crystal chandeliers and more.' },
  contact:   { title: 'Schedule a Tour | Georgetown Oaks · Canonsburg, PA',            desc: 'Contact Georgetown Oaks to schedule a private tour. Reach Morgan at (412) 914-8298 or Morgan@georgetownoaks.com.' }
};

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(checkReveal, 50);
    // Animate hero content in
    setTimeout(function() {
      const hero = target.querySelector('.hero');
      if (hero) hero.classList.add('hero-ready');
    }, 50);
  }
  const footer = document.getElementById('site-footer');
  if (target) {
    target.after(footer);
    target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }
  setActiveNav(id);

  // Update URL and page meta
  const path = id === 'home' ? '/' : '/' + id;
  history.pushState({ page: id }, '', path);
  const meta = pageMeta[id] || pageMeta.home;
  document.title = meta.title;
  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) descTag.setAttribute('content', meta.desc);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', meta.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', meta.desc);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://www.georgetownoaks.com' + path);
}

// Handle back/forward browser buttons
window.addEventListener('popstate', (e) => {
  const id = e.state?.page || 'home';
  showPage(id);
});

// Load correct page on initial visit to a /weddings style URL
// Also handles ?page=contact redirect from 404.html
(function() {
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page');
  if (pageParam && document.getElementById('page-' + pageParam)) {
    history.replaceState(null, '', '/' + pageParam);
    showPage(pageParam);
    return;
  }
  const path = window.location.pathname.replace('/', '').trim();
  if (path && document.getElementById('page-' + path)) {
    showPage(path);
  }
})();

/* ── iOS video fix ── */
// ── Hero animate-in ──
setTimeout(function() {
  const hero = document.querySelector('#page-home .hero');
  if (hero) hero.classList.add('hero-ready');
}, 100);

// ── iOS video fix ──
(function() {
  const video = document.getElementById('heroVideo');
  const fallback = document.getElementById('heroImageFallback');
  if (!video || !fallback) return;

  const isIphone = /iPhone/i.test(navigator.userAgent);

  if (isIphone) {
    video.style.display = 'none';
    fallback.style.display = 'block';
    return;
  }

  function tryPlay() {
    video.play().then(() => {
      video.style.opacity = '1';
    }).catch(() => {
      video.style.display = 'none';
      fallback.style.display = 'block';
    });
  }

  if (video.readyState >= 3) {
    tryPlay();
  } else {
    video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('loadeddata', tryPlay, { once: true });
  }

  document.addEventListener('touchstart', function() {
    if (video.paused) tryPlay();
  }, { once: true });
})();

const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
nav.classList.toggle('scrolled', window.scrollY > 40);


/* ── Scroll reveal ── */
function checkReveal() {
  const reveals = document.querySelectorAll('.page.active .reveal:not(.visible)');
  const trigger = window.innerHeight * 0.92;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add('visible');
  });
}
window.addEventListener('scroll', checkReveal, {passive:true});
document.querySelectorAll('.page.active .reveal').forEach(el=>el.classList.add('visible'));
document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('nav-active'));
// Active nav on page switch
function setActiveNav(id) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
  const lnk = document.querySelector('.nav-links a[onclick*="'+id+'"]');
  if(lnk) lnk.classList.add('nav-active');
}
  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      const result = document.getElementById('form-result');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      const formData = new FormData(contactForm);
      try {
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          result.style.display = 'block';
          result.style.color = 'var(--gold)';
          result.textContent = '✓ Message sent! We\'ll be in touch shortly.';
          contactForm.reset();
          btn.textContent = 'Send Message →';
          btn.disabled = false;
        } else {
          throw new Error(data.message);
        }
      } catch(err) {
        result.style.display = 'block';
        result.style.color = '#c0392b';
        result.textContent = 'Something went wrong. Please call us at (412) 914-8298.';
        btn.textContent = 'Send Message →';
        btn.disabled = false;
      }
    });
  }
