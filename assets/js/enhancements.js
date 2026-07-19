/**
 * AZCONSULTING Enhancements
 * Handles Dark Mode, FAQ Accordion, Blog Filters, and Premium Chatbot Widget
 */

function injectChatbot() {
    if (document.getElementById('azChatFab')) return;

    const fab = document.createElement('button');
    fab.className = 'az-chat-fab';
    fab.id = 'azChatFab';
    fab.title = 'Asistente virtual AZCONSULTING';
    fab.setAttribute('aria-label', 'Abrir chat');
    fab.innerHTML = '<i class="fas fa-comment-dots"></i><span class="chat-fab-badge"></span>';

    const panel = document.createElement('div');
    panel.className = 'az-chat-panel';
    panel.id = 'azChatPanel';
    panel.innerHTML = `
        <div class="az-chat-header">
            <div class="az-chat-header-avatar"><i class="fas fa-robot"></i></div>
            <div class="az-chat-header-info">
                <h5>Asistente AZCONSULTING</h5>
                <span>En línea</span>
            </div>
            <button class="az-chat-close" id="azChatClose" aria-label="Cerrar chat"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="az-chat-messages" id="azChatMessages">
            <div class="az-chat-msg bot">👋 ¡Hola! Soy el asistente virtual de <strong>AZCONSULTING</strong>. ¿En qué puedo ayudarte hoy?
                <div class="az-chat-msg-suggestions">
                    <button class="az-chat-msg-suggestion">¿Qué servicios ofrecen?</button>
                    <button class="az-chat-msg-suggestion">¿Cuánto cuesta una web?</button>
                    <button class="az-chat-msg-suggestion">Quiero una cotización</button>
                </div>
            </div>
        </div>
        <div class="az-chat-suggestions" id="azChatSuggestions"></div>
        <div class="az-chat-footer">
            <input type="text" class="az-chat-input" id="azChatInput" placeholder="Escribe tu mensaje..." autocomplete="off">
            <button class="az-chat-send" id="azChatSend" aria-label="Enviar mensaje"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
}

document.addEventListener('DOMContentLoaded', () => {

    injectChatbot();

    /* ==========================================
       1. DARK MODE
       ========================================== */
    const darkModeBtn = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeBtn ? darkModeBtn.querySelector('i') : null;

    // Check LocalStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (darkModeBtn) {
        let transitionTimer;

        const setTheme = (isDark) => {
            if (isDark) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        };

        darkModeBtn.addEventListener('click', () => {
            const isDark = !body.classList.contains('dark-mode');

            // View Transitions: crossfade de TODA la página a la vez (suave y simultáneo).
            if (document.startViewTransition) {
                document.startViewTransition(() => setTheme(isDark));
            } else {
                // Fallback para navegadores sin soporte.
                body.classList.add('theme-transitioning');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setTheme(isDark));
                });
                clearTimeout(transitionTimer);
                transitionTimer = setTimeout(() => body.classList.remove('theme-transitioning'), 500);
            }
        });
    }

    /* ==========================================
       2. FAQ ACCORDION
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other items (optional, but good UX)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                    }
                });
                
                // Toggle current
                item.classList.toggle('open');
            });
        }
    });

    /* ==========================================
       3. BLOG FILTERS
       ========================================== */
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    const blogCols = document.querySelectorAll('.blog-col');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const blogRow = document.querySelector('.blog-row');
            let visibleCount = 0;

            let delay = 0;
            blogCols.forEach(col => {
                const category = col.getAttribute('data-category');
                const card = col.querySelector('.blog-card');

                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    col.classList.remove('d-none-filter');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    col.classList.add('d-none-filter');
                }
            });

            blogRow.classList.toggle('blog-row-center', filterValue !== 'all' && visibleCount > 0 && visibleCount < 3);

            requestAnimationFrame(() => {
                blogCols.forEach(col => {
                    const category = col.getAttribute('data-category');
                    const card = col.querySelector('.blog-card');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        card.style.transition = 'none';
                    }
                });

                requestAnimationFrame(() => {
                    blogCols.forEach(col => {
                        const category = col.getAttribute('data-category');
                        const card = col.querySelector('.blog-card');
                        if (filterValue === 'all' || category === filterValue) {
                            card.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
                            card.style.transitionDelay = `${delay}s`;
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            delay += 0.08;
                        }
                    });

                    setTimeout(() => {
                        blogCols.forEach(col => {
                            const card = col.querySelector('.blog-card');
                            if (!card.classList.contains('hidden')) {
                                card.style.transition = '';
                                card.style.transitionDelay = '';
                                card.style.opacity = '';
                                card.style.transform = '';
                            }
                        });
                    }, 600);
                });
            });

            if (window.AOS) {
                setTimeout(() => AOS.refresh(), 800);
            }
        });
    });

    /* ==========================================
        4. PREMIUM CHATBOT WIDGET
        ========================================== */
    const chatFab = document.getElementById('azChatFab');
    const chatPanel = document.getElementById('azChatPanel');
    const chatClose = document.getElementById('azChatClose');
    const chatMessages = document.getElementById('azChatMessages');
    const chatInput = document.getElementById('azChatInput');
    const chatSend = document.getElementById('azChatSend');
    
    const WORKER_URL = 'https://divine-mouse-ebab.juandavidriverahuancas0.workers.dev';
    let isTyping = false;
    let chatHistory = [];
    let botMsgCount = 0;
    const MAX_BOT_MSGS = 10;

    function disableChatInput(disabled) {
        chatInput.disabled = disabled;
        chatSend.disabled = disabled;
        if (disabled) {
            chatInput.placeholder = 'Conversación finalizada';
            chatSend.style.opacity = '0.4';
            chatSend.style.pointerEvents = 'none';
        } else {
            chatInput.placeholder = 'Escribí tu mensaje...';
            chatSend.style.opacity = '';
            chatSend.style.pointerEvents = '';
        }
    }

    function addNewChatBtn() {
        const container = document.getElementById('azChatSuggestions');
        if (!container) return;
        container.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'az-chat-suggestion';
        btn.textContent = '🔄 Nueva conversación';
        btn.addEventListener('click', resetChat);
        container.appendChild(btn);
    }

    function resetChat() {
        chatHistory = [];
        botMsgCount = 0;
        chatMessages.innerHTML = '';
        disableChatInput(false);
        const container = document.getElementById('azChatSuggestions');
        if (container) container.innerHTML = '';
    }

    // Toggle Panel
    if (chatFab && chatPanel && chatClose) {
        chatFab.addEventListener('click', () => {
            chatPanel.classList.add('open');
            chatFab.style.display = 'none';
            setTimeout(() => { if (!chatInput.disabled) chatInput.focus(); }, 300);
        });

        chatClose.addEventListener('click', () => {
            chatPanel.classList.remove('open');
            chatFab.style.display = 'flex';
        });
    }

    // Delegación: clicks en sugerencias
    chatMessages.addEventListener('click', (e) => {
        const btn = e.target.closest('.az-chat-msg-suggestion');
        if (btn && !btn.classList.contains('used')) {
            chatInput.value = btn.dataset.q || btn.textContent;
            sendMessage();
        }
    });

    // Send Message Event
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function linkify(text) {
        return text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    function escHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function grayOutPreviousSuggestions() {
        const botMsgs = chatMessages.querySelectorAll('.az-chat-msg.bot');
        for (let i = 0; i < botMsgs.length - 1; i++) {
            const btns = botMsgs[i].querySelectorAll('.az-chat-msg-suggestion');
            btns.forEach(b => b.classList.add('used'));
        }
    }

    function stripHtml(s) {
        return s.replace(/<[^>]*>/g, '');
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `az-chat-msg ${sender}`;
        
        if (sender === 'bot') {
            const rawText = text;
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            text = linkify(text);
            
            if (text.includes('||')) {
                const parts = text.split('||');
                const mainText = parts[0].trim().replace(/\n/g, '<br>');
                const questions = parts.slice(1).map(q => q.trim()).filter(q => q);
                
                let html = mainText;
                if (questions.length > 0) {
                    html += '<div class="az-chat-msg-suggestions">';
                    questions.forEach(q => {
                        html += `<button class="az-chat-msg-suggestion" data-q="${escHtml(q)}">${escHtml(q)}</button>`;
                    });
                    html += '</div>';
                }
                msgDiv.innerHTML = html;
                msgDiv.dataset.clean = stripHtml(parts[0].trim());
            } else {
                msgDiv.innerHTML = text.replace(/\n/g, '<br>');
                msgDiv.dataset.clean = stripHtml(text);
            }
        } else {
            msgDiv.innerHTML = text;
        }
        
        chatMessages.appendChild(msgDiv);
        grayOutPreviousSuggestions();
        scrollToBottom();
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'az-chat-typing';
        typingDiv.id = 'chatTypingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTyping() {
        const indicator = document.getElementById('chatTypingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || isTyping) return;

        // Check limit
        if (botMsgCount >= MAX_BOT_MSGS) return;

        // User message
        appendMessage('user', text);
        chatInput.value = '';
        chatHistory.push({ role: 'user', content: text });
        
        // Hide previous suggestions while typing
        const suggContainer = document.getElementById('azChatSuggestions');
        if(suggContainer) suggContainer.innerHTML = '';

        isTyping = true;
        showTyping();

        try {
            // Send only last 3 exchanges to save tokens
            const trimmedHistory = chatHistory.slice(-6);

            const payload = {
                message: text,
                history: trimmedHistory.slice(0, -1)
            };

            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            hideTyping();
            
            // Extract bot response
            let botReply = "No pude procesar tu solicitud. ¿Puedes intentar de nuevo?";
            
            if (data.reply) {
                botReply = data.reply;
            } else if (data.response) {
                botReply = data.response;
            } else if (data.content) {
                botReply = data.content;
            }

            appendMessage('bot', botReply);
            const lastMsg = chatMessages.lastElementChild;
            const cleanReply = lastMsg ? (lastMsg.dataset.clean || botReply) : botReply;
            chatHistory.push({ role: 'assistant', content: cleanReply });
            botMsgCount++;

            // Check limit after this response
            if (botMsgCount >= MAX_BOT_MSGS) {
                disableChatInput(true);
                addNewChatBtn();
            }

        } catch (error) {
            console.error('Chat error:', error);
            hideTyping();
            appendMessage('bot', 'Ups, tuvimos un problema: ' + error.message + '. Intentá de nuevo o escribinos a WhatsApp.');
        } finally {
            isTyping = false;
        }
    }

    /* ==========================================
        6. MENÚ MOBILE — BACKDROP
        ========================================== */
    const menuEl = document.getElementById('menu');
    let menuHideTimer = null;
    if (menuEl) {
        menuEl.addEventListener('show.bs.collapse', () => {
            if (menuHideTimer) {
                clearTimeout(menuHideTimer);
                menuHideTimer = null;
            }
            menuEl.classList.remove('menu-exit');
            document.body.classList.add('menu-open');
        });
        menuEl.addEventListener('hide.bs.collapse', () => {
            menuEl.classList.add('menu-exit');
            menuHideTimer = setTimeout(() => {
                document.body.classList.remove('menu-open');
            }, 500);
        });
        menuEl.addEventListener('hidden.bs.collapse', () => {
            if (menuHideTimer) {
                clearTimeout(menuHideTimer);
                menuHideTimer = null;
            }
            menuEl.classList.remove('menu-exit');
            document.body.classList.remove('menu-open');
        });
    }

    /* Clic fuera del menú lo cierra */
    document.addEventListener('click', (e) => {
        if (!document.body.classList.contains('menu-open')) return;
        const nav = document.querySelector('.custom-navbar');
        if (nav && !nav.contains(e.target)) {
            const toggler = document.querySelector('.navbar-toggler');
            if (toggler) toggler.click();
        }
    });

    /* Cerrar menú al tocar un nav-link (mobile) */
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('menu');
            if (menu && menu.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        });
    });

    /* Cerrar menú al redimensionar a >991px (Bootstrap lg breakpoint) */
    let resizeMenuTimer = null;
    window.addEventListener('resize', () => {
        if (resizeMenuTimer) clearTimeout(resizeMenuTimer);
        resizeMenuTimer = setTimeout(() => {
            if (window.innerWidth >= 992) {
                const menu = document.getElementById('menu');
                if (menu) {
                    menu.classList.remove('show', 'menu-exit');
                }
                document.body.classList.remove('menu-open');
            }
        }, 100);
    });

    /* ==========================================
        7. FAQ TEXT LIFT ON HOVER
        ========================================== */
    
});
