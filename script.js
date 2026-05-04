// --- FALLING STARS LOGIC (Optimized) ---
    const starsContainer = document.getElementById('stars-container');
    const starCount = 30; // Reduced for performance

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const tailLength = (Math.random() * 2 + 5).toFixed(2) + 'em';
      const topOffset = (Math.random() * 100).toFixed(2) + 'vh';
      const fallDuration = (Math.random() * 6 + 6).toFixed(3) + 's';
      const fallDelay = (Math.random() * 8).toFixed(3) + 's';

      star.style.setProperty('--star-tail-length', tailLength);
      star.style.setProperty('--top-offset', topOffset);
      star.style.setProperty('--fall-duration', fallDuration);
      star.style.setProperty('--fall-delay', fallDelay);

      fragment.appendChild(star);
    }
    starsContainer.appendChild(fragment);

    // --- MOBILE NAV TOGGLE ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navAnchors = navLinks.querySelectorAll('a');

    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.querySelector('i').classList.toggle('fa-bars');
      navToggle.querySelector('i').classList.toggle('fa-times');
    });

    navAnchors.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.querySelector('i').classList.add('fa-bars');
        navToggle.querySelector('i').classList.remove('fa-times');
      });
    });

    // --- SEQUENTIAL ANIMATION LOGIC ---
    window.addEventListener('load', () => {
      const loader = document.getElementById('loader-wrapper');
      const welcome = document.getElementById('welcome-overlay');
      const progress = document.getElementById('welcome-progress');

      const sleep = ms => new Promise(r => setTimeout(r, ms));

      async function runSequence() {
        // 1. Loader Shine Phase
        await sleep(1000);

        // 2. Transition Loader -> Welcome
        // We start welcome active while loader is fading for seamless flow
        loader.classList.add('hidden');
        welcome.classList.add('active');

        await sleep(100);
        welcome.classList.add('animating');
        progress.style.width = '100%';

        // 3. Welcome Presentation Phase
        // The bar takes 2.5s, we reveal content slightly before it ends for "liquid" feel
        await sleep(2400);

        // 4. Final Reveal
        welcome.style.opacity = '0';
        welcome.style.transform = 'scale(1.05)';
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        await sleep(1000);
        welcome.classList.remove('active');
        welcome.style.visibility = 'hidden';
      }

      runSequence();
    });

    // --- 3D TILT EFFECT (Removed for stability) ---
    /* Removed tilt to prevent shifting issues */

    // --- GLOW CURSOR ---
    const glowCursor = document.createElement('div');
    glowCursor.className = 'glow-cursor';
    document.body.appendChild(glowCursor);

    document.addEventListener('mousemove', (e) => {
      glowCursor.style.left = e.clientX + 'px';
      glowCursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .project-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => glowCursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => glowCursor.classList.remove('hovering'));
    });

    // Reveal Observer with Delay Stagger
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      let delay = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);
          delay += 150; // stagger 150ms for elements appearing at the same time
          observer.unobserve(entry.target); // Reveal only once for cleaner experience
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Loader Logic moved to Sequential Animation Logic

    // --- MAGNETIC BUTTONS ---
    const magneticEls = document.querySelectorAll('.magnetic');
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        if (el.children[0]) {
          // el.children[0].style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = `translate(0px, 0px)`;
      });
    });

    // --- SCROLL PROGRESS ---
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    });

    // Smooth Scroll Link Adjustment
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });

    // ─── CONTACT FORM TOGGLE ───
    (function () {
      const panel = document.getElementById('cf-panel');
      const trigger = document.getElementById('cf-trigger');
      if (!panel || !trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('cf-open');
        trigger.setAttribute('aria-expanded', isOpen);
      });

      // also allow keyboard Enter/Space
      trigger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });
    })();


    // ─── HERO TYPEWRITER — sequential top → bottom ───
    (function heroTypewriter() {
      const LINES = [
        { el: document.getElementById('hero-line-1'), text: 'Architecting' },
        { el: document.getElementById('hero-line-2'), text: 'Digital Excellence.' }
      ];

      const TYPE_SPEED = 68;   // ms per char — typing
      const ERASE_SPEED = 40;   // ms per char — erasing
      const GAP_LINES = 120;  // ms pause between finishing line 1 and starting line 2
      const HOLD = 2200; // ms hold when both lines fully typed
      const LOOP_PAUSE = 500;  // ms before next cycle

      const sleep = ms => new Promise(r => setTimeout(r, ms));

      /* set width in ch units */
      function setW(el, n) { el.style.width = n > 0 ? n + 'ch' : '0'; }

      /* type one line, character by character */
      async function type({ el, text }) {
        el.classList.add('typing');
        for (let i = 1; i <= text.length; i++) {
          setW(el, i);
          await sleep(TYPE_SPEED);
        }
      }

      /* erase one line, character by character */
      async function erase({ el, text }) {
        for (let i = text.length - 1; i >= 0; i--) {
          setW(el, i);
          await sleep(ERASE_SPEED);
        }
        el.classList.remove('typing');
      }

      async function loop() {
        // Init: hide all
        LINES.forEach(({ el }) => {
          el.style.width = '0';
          el.classList.remove('typing');
        });

        while (true) {
          // ─ Type line 1 ─
          await type(LINES[0]);
          LINES[0].el.classList.remove('typing'); // stop cursor blink on line 1

          // ─ Small gap, then type line 2 ─
          await sleep(GAP_LINES);
          await type(LINES[1]);

          // ─ Hold both fully visible ─
          await sleep(HOLD);

          // ─ Erase line 1 first, then line 2 ─
          await erase(LINES[0]);
          await sleep(GAP_LINES);
          await erase(LINES[1]);

          // ─ Pause before next cycle ─
          await sleep(LOOP_PAUSE);
        }
      }

      // Kick off after loader is done
      const obs = new MutationObserver(() => {
        if (document.body.classList.contains('loaded')) {
          obs.disconnect();
          loop();
        }
      });
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    })();
