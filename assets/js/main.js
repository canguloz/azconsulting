document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        AOS.init({ duration: 1200, once: true });
    }

    const navbar = document.querySelector('.custom-navbar');
    const preloader = document.getElementById('preloader');
    const btnTop = document.getElementById('btnTop');
    const counters = document.querySelectorAll('.counter');
    const contactForm = document.querySelector('.contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
    const sections = Array.from(document.querySelectorAll('section[id]'));

    const updateNavbar = () => {
        if (!navbar) return;

        navbar.style.boxShadow = window.scrollY > 50
            ? '0 4px 15px rgba(0,0,0,.08)'
            : 'none';
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        const isActive = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active', isActive);
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0.2
        });

        sections.forEach((section) => observer.observe(section));
    }

    counters.forEach((counter) => {
        const target = Number(counter.getAttribute('data-target') || 0);
        const suffix = counter.getAttribute('data-suffix') || '';
        const increment = target / 100;

        const updateCounter = () => {
            const current = Number(String(counter.textContent).replace(/[^0-9.]/g, '') || 0);

            if (current < target) {
                counter.textContent = `${Math.ceil(current + increment)}${suffix}`;
                window.setTimeout(updateCounter, 20);
            } else {
                counter.textContent = `${target}${suffix}`;
            }
        };

        updateCounter();
    });

    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    if (btnTop) {
        window.addEventListener('scroll', () => {
            btnTop.style.display = window.scrollY > 500 ? 'block' : 'none';
        }, { passive: true });

        btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const menuCollapse = document.getElementById('menu');
    const menuCloseBtn = document.querySelector('.menu-close-btn');

    if (menuCollapse && menuCloseBtn && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menuCollapse, { toggle: false });

        menuCloseBtn.addEventListener('click', () => bsCollapse.hide());

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) bsCollapse.hide();
            });
        });
    }

    if (typeof gsap !== 'undefined') {
        gsap.from('.hero h1', { y: 80, opacity: 0, duration: 1.5 });
        gsap.from('.hero p', { y: 40, opacity: 0, duration: 2 });
    }

    if (document.getElementById('particles-js') && typeof tsParticles !== 'undefined') {
        tsParticles.load('particles-js', {
            background: { color: 'transparent' },
            particles: {
                number: { value: 80 },
                color: { value: '#00c3ff' },
                links: { enable: true, distance: 120 },
                move: { enable: true, speed: 1 }
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.textContent = 'Solicitud enviada';
                submitButton.disabled = true;
            }

            if (formFeedback) {
                formFeedback.textContent = 'Gracias. Tu mensaje fue recibido y nos pondremos en contacto pronto.';
            }
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(() => {
            // Se ignora si el registro falla en entornos locales sin HTTPS
        });
    }
});