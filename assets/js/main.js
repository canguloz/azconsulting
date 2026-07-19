document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        AOS.init({
            duration: 700,      // Reducido de 1200ms → 700ms para animaciones más ágiles
            once: true,         // Solo anima una vez (mejor rendimiento)
            offset: 60,         // Dispara antes para que no se vea el salto
            easing: 'ease-out-cubic'
        });
    }

    // Refresca AOS al redimensionar y mantiene la posición relativa
    let resizeTimer;
    let scrollPercent;
    window.addEventListener('resize', () => {
        if (!scrollPercent) {
            scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        }
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.AOS) AOS.refresh();
            if (scrollPercent > 0) {
                const newScroll = scrollPercent * (document.documentElement.scrollHeight - window.innerHeight);
                window.scrollTo({ top: newScroll, behavior: 'auto' });
            }
            scrollPercent = null;
        }, 300);
    });

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
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
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

    // Cerrar menú hamburguesa y scroll suave al hacer clic en nav-link
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;
            e.preventDefault();

            const target = document.querySelector(targetId);
            if (!target) return;

            const menu = document.getElementById('menu');
            if (menu && menu.classList.contains('show') && window.bootstrap) {
                const collapse = bootstrap.Collapse.getInstance(menu);
                if (collapse) collapse.hide();
            }

            const offset = window.innerWidth < 992 ? 85 : 70;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Función que anima un contador individual
    function animateCounter(counter) {
        const target = Number(counter.getAttribute('data-target') || 0);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1400; // ms totales de la animación
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const tick = () => {
            step++;
            // Easing: ease-out cuadrático para ralentizar al final
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(eased * target);
            counter.textContent = `${current}${suffix}`;
            if (step < steps) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = `${target}${suffix}`;
            }
        };
        requestAnimationFrame(tick);
    }

    // Observar cada contador: animar solo cuando entra en viewport
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target); // solo una vez
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        // Fallback para navegadores muy antiguos
        counters.forEach(animateCounter);
    }

    if (preloader) {
        // Spinner animado con JS (requestAnimationFrame) para que gire SIEMPRE,
        // sin que el SO/navegador (prefers-reduced-motion) lo bloquee.
        const rings = preloader.querySelectorAll('.ring');
        let angle = 0;
        let lastTs = performance.now();
        let rafId = requestAnimationFrame(function spin(ts) {
            const dt = ts - lastTs;
            lastTs = ts;
            angle = (angle + dt * 0.3) % 360;
            rings.forEach((r, i) => { r.style.transform = `rotate(${angle + i * 40}deg)`; });
            rafId = requestAnimationFrame(spin);
        });

        window.addEventListener('load', () => {
            setTimeout(() => {
                cancelAnimationFrame(rafId);
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 400);
            }, 800);
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
        gsap.from('.hero h1', { y: 60, duration: 1.0, ease: 'power3.out' });
        gsap.from('.hero p', { y: 40, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });
    }

    // tsParticles: carga dinámica post window.load para no bloquear el hilo principal
    // Se carga el bundle completo solo una vez que la página está completamente lista
    const initParticles = () => {
        if (document.getElementById('particles-js')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tsparticles@3/tsparticles.bundle.min.js';
            script.onload = () => {
                if (typeof tsParticles === 'undefined') return;
                tsParticles.load('particles-js', {
                    background: { color: 'transparent' },
                    fpsLimit: 40,                          // Limitar FPS para reducir lag en móvil
                    particles: {
                        number: {
                            value: 40,                     // Reducido de 80 → 40 (menos carga de CPU)
                            density: { enable: true, area: 800 }
                        },
                        color: { value: '#00c3ff' },
                        links: {
                            enable: true,
                            distance: 130,
                            opacity: 0.35,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 0.8,                    // Reducido de 1 → 0.8 para suavidad
                            outModes: { default: 'bounce' }
                        },
                        size: { value: { min: 1, max: 2.5 } },
                        opacity: { value: { min: 0.3, max: 0.7 } }
                    },
                    detectRetina: true
                });
            };
            document.head.appendChild(script);
        }
    };

    if (document.readyState === 'complete') {
        // Si DOMContentLoaded tardó mucho y ya cargó todo
        setTimeout(initParticles, 200);
    } else {
        window.addEventListener('load', () => setTimeout(initParticles, 200), { once: true });
    }

    const EMAILJS_CONFIG = {
        serviceId: 'service_zh3z3u7',
        templateIdCliente: 'template_x2zzcqt',
        templateIdEmpresa: 'template_aojal2d',
        templateIdTestimonio: 'template_aojal2d',
        templateIdTendencia: 'template_aojal2d',
        publicKey: 'noAekUL_Bc5sR3aKJ'
    };

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

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
                    contactForm.reset();
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
                const starsHtml = Array(5).fill(0).map((_, i) =>
                    `<i class="${i < data.rating ? 'fas' : 'far'} fa-star"></i>`
                ).join('');

                const paramsEmpresa = {
                    to_email: 'carlosangulozegarra@gmail.com',
                    to_name: 'Equipo AZCONSULTING',
                    from_name: data.nombre,
                    from_email: data.email,
                    message: `Valoración: ${data.rating}/5 estrellas\nCargo: ${data.rol || 'No especificado'}\nEmpresa: ${data.empresa || 'No especificada'}\n\n${data.mensaje}`,
                    telefono: '—',
                    empresa: data.empresa || 'No especificada',
                    fecha: fecha
                };

                const paramsTest = {
                    ...paramsEmpresa,
                    to_email: 'juandavidriverahuancas0@gmail.com',
                };

                const safeSend = (params) => {
                    const emailPromise = emailjs.send(
                        EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateIdTestimonio, params
                    ).catch(() => {});
                    return Promise.race([
                        emailPromise,
                        new Promise(r => setTimeout(r, 8000))
                    ]);
                };

                Promise.allSettled([
                    safeSend(paramsEmpresa),
                    safeSend(paramsTest)
                ])
                .then(() => {
                    const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
                    const initials = data.nombre.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                    const col = document.createElement('div');
                    col.className = 'col-lg-4';
                    col.setAttribute('data-aos', 'fade-up');
                    col.innerHTML = `
                        <div class="testimonial-card">
                            <div class="testimonial-card-inner">
                                <div class="testimonial-quote-icon">
                                    <i class="fas fa-quote-right"></i>
                                </div>
                                <p class="testimonial-text">"${esc(data.mensaje)}"</p>
                                <div class="testimonial-stars" data-rating="${data.rating}">
                                    ${starsHtml}
                                </div>
                                <div class="testimonial-author">
                                    <div class="testimonial-avatar">
                                        <span>${esc(initials)}</span>
                                    </div>
                                    <div class="testimonial-info">
                                        <h5>${esc(data.nombre)}</h5>
                                        <span>${data.rol ? esc(data.rol) : ''}${data.rol && data.empresa ? ' — ' : ''}${data.empresa ? esc(data.empresa) : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    const grid = document.querySelector('.testimonial-section .row');
                    if (grid) grid.appendChild(col);
                    if (window.AOS) AOS.refresh();

                    if (fb) { fb.textContent = '¡Gracias por tu opinión! Tu testimonio ya se publicó.'; fb.style.color = '#16a34a'; }
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
            const fb = document.getElementById('trend-feedback');
            const btn = trendForm.querySelector('.tform-submit');

            const data = {
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
                const msg = `Nueva tendencia registrada\n\nTítulo: ${data.titulo}\nCategoría: ${data.categoria}\n\n${data.descripcion}`;

                const paramsEmpresa = {
                    to_email: 'carlosangulozegarra@gmail.com',
                    to_name: 'Equipo AZCONSULTING',
                    from_name: data.nombre,
                    from_email: data.email,
                    message: msg,
                    telefono: '—',
                    empresa: data.categoria,
                    fecha: fecha
                };

                const paramsTest = {
                    ...paramsEmpresa,
                    to_email: 'juandavidriverahuancas0@gmail.com',
                };

                const safeSend = (params) => {
                    const emailPromise = emailjs.send(
                        EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateIdTendencia, params
                    ).catch(() => {});
                    return Promise.race([
                        emailPromise,
                        new Promise(r => setTimeout(r, 8000))
                    ]);
                };

                Promise.allSettled([
                    safeSend(paramsEmpresa),
                    safeSend(paramsTest)
                ])
                .then(() => {
                    if (fb) { fb.textContent = '¡Gracias! Revisaremos tu tendencia y la publicaremos pronto.'; fb.style.color = '#16a34a'; }
                    btn.textContent = 'Enviar tendencia';
                    btn.disabled = false;
                    trendForm.reset();
                    setTimeout(() => { if (fb) { fb.textContent = ''; fb.style.color = ''; } }, 5000);
                });
            } else {
                if (fb) { fb.textContent = 'Servicio no disponible. Intenta más tarde.'; fb.style.color = '#dc2626'; }
            }
        });
    }
});