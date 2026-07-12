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

    /* ─── Security helpers ─── */
    const lastSubmit = {};
    const isBot = (form) => form && form.querySelector('input[name="_website"]')?.value?.trim() !== '';
    const isRateLimited = (key) => {
        const now = Date.now();
        if (lastSubmit[key] && now - lastSubmit[key] < 15000) return true;
        lastSubmit[key] = now;
        return false;
    };

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
            btnTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const menuCollapse = document.getElementById('menu');
    const menuCloseBtn = document.querySelector('.menu-close-btn');
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (menuCollapse && menuCloseBtn && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menuCollapse, { toggle: false });

        // Rotar hamburguesa al abrir/cerrar menú
        menuCollapse.addEventListener('show.bs.collapse', () => {
            if (navbarToggler) navbarToggler.classList.add('rotated');
        });
        menuCollapse.addEventListener('hide.bs.collapse', () => {
            if (navbarToggler) navbarToggler.classList.remove('rotated');
            if (menuCollapse) menuCollapse.classList.add('menu-exit');
        });
        menuCollapse.addEventListener('hidden.bs.collapse', () => {
            if (menuCollapse) menuCollapse.classList.remove('menu-exit');
        });

        menuCloseBtn.addEventListener('click', () => bsCollapse.hide());

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) bsCollapse.hide();
            });
        });
    }

    if (typeof gsap !== 'undefined') {
        gsap.from('.hero h1', { y: 60, duration: 1.2 });
        gsap.from('.hero p', { y: 60, opacity: 0, duration: 1.8, ease: 'power3.out' });
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
        const EMAILJS_CONFIG = {
            serviceId: 'service_zh3z3u7',
            templateIdCliente: 'template_x2zzcqt',
            templateIdEmpresa: 'template_aojal2d',
            publicKey: 'noAekUL_Bc5sR3aKJ'
        };

        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (isBot(contactForm)) return;

            if (isRateLimited('contact')) {
                if (formFeedback) { formFeedback.textContent = 'Por favor espera unos segundos antes de enviar.'; formFeedback.style.color = '#dc2626'; }
                setTimeout(() => { if (formFeedback) { formFeedback.textContent = ''; formFeedback.style.color = ''; } }, 3000);
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

            if (typeof emailjs === 'undefined') {
                if (submitButton) { submitButton.textContent = 'Enviar Solicitud'; submitButton.disabled = false; }
                if (formFeedback) { formFeedback.textContent = 'Servicio de correo no disponible. Contacta al administrador.'; }
                return;
            }

            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            const paramsCliente = {
                to_email: data.email,
                to_name: data.nombre,
                from_name: 'AZCONSULTING',
                message: data.mensaje,
                telefono: data.telefono,
                empresa: data.empresa || 'No especificada',
                fecha: fecha
            };

            const paramsEmpresa = {
                to_email: 'carlosangulozegarra@gmail.com',
                to_name: 'Equipo AZCONSULTING',
                from_name: data.nombre,
                from_email: data.email,
                message: data.mensaje,
                telefono: data.telefono,
                empresa: data.empresa || 'No especificada',
                fecha: fecha
            };

            Promise.all([
                emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateIdCliente, paramsCliente),
                emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateIdEmpresa, paramsEmpresa)
            ])
            .then(() => {
                submitButton.textContent = 'Solicitud enviada';
                if (formFeedback) {
                    formFeedback.textContent = 'Revisa tu correo, te enviamos una copia. Nos contactaremos pronto.';
                    formFeedback.style.color = '#16a34a';
                }
                const msg = encodeURIComponent(`Hola, soy *${data.nombre || ''}* de *${data.empresa || 'mi empresa'}*.\n\nAcabo de enviar una solicitud a través de su formulario web y me gustaría darle seguimiento.\n\n*Servicio solicitado:* ${data.mensaje || ''}\n*Teléfono:* ${data.telefono || ''}\n*Correo:* ${data.email || ''}\n\nQuedo atento a su pronta comunicación.`);
                setTimeout(() => window.open(`https://wa.me/51924858054?text=${msg}`, '_blank'), 1000);
                setTimeout(() => {
                    submitButton.textContent = 'Enviar Solicitud';
                    submitButton.disabled = false;
                    form.reset();
                    if (formFeedback) {
                        formFeedback.textContent = '';
                        formFeedback.style.color = '';
                    }
                }, 6000);
            })
            .catch((err) => {
                submitButton.textContent = 'Enviar Solicitud';
                submitButton.disabled = false;
                console.error('EmailJS error:', err);
                if (formFeedback) {
                    formFeedback.textContent = 'Error: ' + (err?.text || err?.message || JSON.stringify(err));
                    formFeedback.style.color = '#dc2626';
                }
                const msg = encodeURIComponent(`Hola, soy *${data.nombre || ''}* de *${data.empresa || 'mi empresa'}*.\n\nIntenté enviar una solicitud desde su página web pero tuve un inconveniente técnico. ¿Podrían ayudarme?\n\n*Teléfono:* ${data.telefono || ''}\n*Correo:* ${data.email || ''}\n*Mensaje:* ${data.mensaje || ''}\n\nGracias.`);
                setTimeout(() => window.open(`https://wa.me/51924858054?text=${msg}`, '_blank'), 1500);
            });
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').catch(() => {
            // Se ignora si el registro falla en entornos locales sin HTTPS
        });
    }

    /* ─── Toggle forms with exit animation ─── */
    window.toggleForm = (btn) => {
        const form = btn.nextElementSibling;
        const isOpen = form.classList.contains('open');
        if (isOpen) {
            form.classList.remove('open');
            form.classList.add('closing');
            btn.classList.remove('active');
            form.addEventListener('animationend', () => {
                form.classList.remove('closing');
            }, { once: true });
        } else {
            form.classList.add('open');
            btn.classList.add('active');
        }
    };

    /* ─── Testimonial star rating ─── */
    const ratingContainer = document.getElementById('ratingStars');
    const ratingInput = document.getElementById('ratingInput');
    if (ratingContainer && ratingInput) {
        const stars = ratingContainer.querySelectorAll('i');
        stars.forEach((star) => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.dataset.value);
                stars.forEach((s) => {
                    s.classList.toggle('hover', parseInt(s.dataset.value) <= val);
                });
            });
            ratingContainer.addEventListener('mouseleave', () => {
                stars.forEach((s) => s.classList.remove('hover'));
            });
            star.addEventListener('click', () => {
                const val = parseInt(star.dataset.value);
                ratingInput.value = val;
                stars.forEach((s) => {
                    s.classList.toggle('active', parseInt(s.dataset.value) <= val);
                    s.className = parseInt(s.dataset.value) <= val ? 'fas fa-star active' : 'far fa-star';
                });
            });
        });
    }

    /* ─── Testimonial form submit ─── */
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isBot(testimonialForm)) return;
            if (isRateLimited('testimonial')) {
                const fb = document.getElementById('tform-feedback');
                if (fb) { fb.textContent = 'Por favor espera unos segundos.'; fb.style.color = '#dc2626'; }
                setTimeout(() => { if (fb) { fb.textContent = ''; fb.style.color = ''; } }, 3000);
                return;
            }
            const fb = document.getElementById('tform-feedback');
            const btn = testimonialForm.querySelector('.tform-submit');
            const rating = parseInt(document.getElementById('ratingInput')?.value || '0');

            if (rating === 0) {
                if (fb) { fb.textContent = 'Por favor selecciona un nivel de satisfacción.'; fb.style.color = '#dc2626'; }
                return;
            }

            const data = {
                nombre: testimonialForm.querySelector('[name="t-nombre"]').value,
                email: testimonialForm.querySelector('[name="t-email"]').value,
                rol: testimonialForm.querySelector('[name="t-rol"]').value,
                empresa: testimonialForm.querySelector('[name="t-empresa"]').value,
                mensaje: testimonialForm.querySelector('[name="t-mensaje"]').value,
                rating: rating
            };

            if (typeof emailjs !== 'undefined') {
                btn.textContent = 'Enviando...';
                btn.disabled = true;

                const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

                emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateIdEmpresa, {
                    to_email: 'carlosangulozegarra@gmail.com',
                    to_name: 'Equipo AZCONSULTING',
                    from_name: data.nombre,
                    from_email: data.email,
                    message: `Valoración: ${data.rating}/5 estrellas\nCargo: ${data.rol || 'No especificado'}\nEmpresa: ${data.empresa || 'No especificada'}\n\n${data.mensaje}`,
                    telefono: '',
                    empresa: data.empresa || 'No especificada',
                    fecha: fecha
                })
                .then(() => {
                    if (fb) { fb.textContent = '¡Gracias por tu opinión! La revisaremos y publicaremos pronto.'; fb.style.color = '#16a34a'; }
                    btn.textContent = 'Enviar opinión';
                    btn.disabled = false;
                    testimonialForm.reset();
                    ratingInput.value = '0';
                    const allStars = ratingContainer.querySelectorAll('i');
                    allStars.forEach(s => { s.className = 'far fa-star'; s.classList.remove('active'); });
                    setTimeout(() => { if (fb) { fb.textContent = ''; fb.style.color = ''; } }, 5000);
                })
                .catch((err) => {
                    if (fb) { fb.textContent = 'Error al enviar. Intenta de nuevo.'; fb.style.color = '#dc2626'; }
                    btn.textContent = 'Enviar opinión';
                    btn.disabled = false;
                });
            } else {
                if (fb) { fb.textContent = 'Servicio no disponible. Intenta más tarde.'; fb.style.color = '#dc2626'; }
            }
        });
    }

    /* ─── Blog trend form ─── */
    const trendForm = document.getElementById('trendForm');
    if (trendForm) {
        trendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isBot(trendForm)) return;
            if (isRateLimited('trend')) {
                const fb = document.getElementById('trend-feedback');
                if (fb) { fb.textContent = 'Por favor espera unos segundos.'; fb.style.color = '#dc2626'; }
                setTimeout(() => { if (fb) { fb.textContent = ''; fb.style.color = ''; } }, 3000);
                return;
            }
            const fb = document.getElementById('trend-feedback');
            const btn = trendForm.querySelector('.tform-submit');
                nombre: trendForm.querySelector('[name="trend-nombre"]').value,
                email: trendForm.querySelector('[name="trend-email"]').value,
                titulo: trendForm.querySelector('[name="trend-titulo"]').value,
                categoria: trendForm.querySelector('[name="trend-categoria"]').value,
                descripcion: trendForm.querySelector('[name="trend-descripcion"]').value,
            };

            if (typeof emailjs !== 'undefined') {
                btn.textContent = 'Enviando...';
                btn.disabled = true;

                const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

                emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateIdEmpresa, {
                    to_email: 'carlosangulozegarra@gmail.com',
                    to_name: 'Equipo AZCONSULTING',
                    from_name: data.nombre,
                    from_email: data.email,
                    message: `Nueva tendencia registrada\n\nTítulo: ${data.titulo}\nCategoría: ${data.categoria}\n\n${data.descripcion}`,
                    telefono: '',
                    empresa: data.categoria,
                    fecha: fecha
                })
                .then(() => {
                    if (fb) { fb.textContent = '¡Gracias! Revisaremos tu tendencia y la publicaremos pronto.'; fb.style.color = '#16a34a'; }
                    btn.textContent = 'Enviar tendencia';
                    btn.disabled = false;
                    trendForm.reset();
                    setTimeout(() => { if (fb) { fb.textContent = ''; fb.style.color = ''; } }, 5000);
                })
                .catch(() => {
                    if (fb) { fb.textContent = 'Error al enviar. Intenta de nuevo.'; fb.style.color = '#dc2626'; }
                    btn.textContent = 'Enviar tendencia';
                    btn.disabled = false;
                });
            } else {
                if (fb) { fb.textContent = 'Servicio no disponible. Intenta más tarde.'; fb.style.color = '#dc2626'; }
            }
        });
    }
});