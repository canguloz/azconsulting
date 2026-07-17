/**
 * AZCONSULTING Enhancements
 * Handles Dark Mode, FAQ Accordion, Blog Filters, and Premium Chatbot Widget
 */

document.addEventListener('DOMContentLoaded', () => {

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

            blogCols.forEach(col => {
                const category = col.getAttribute('data-category');
                const card = col.querySelector('.blog-card');

                if (filterValue === 'all' || category === filterValue) {
                    col.classList.remove('d-none-filter');
                    card.classList.remove('hidden');
                    card.style.opacity = '';
                    card.style.transform = '';
                } else {
                    card.classList.add('hidden');
                    col.classList.add('d-none-filter');
                }
            });

            if (window.AOS) {
                setTimeout(() => AOS.refresh(), 100);
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
    const suggestions = document.querySelectorAll('.az-chat-suggestion');
    
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

    // Suggestions click
    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent;
            chatInput.value = text;
            sendMessage();
        });
    });

    // Send Message Event
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `az-chat-msg ${sender}`;
        
        if (sender === 'bot') {
            let cleanText = text;
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            if (text.includes('||')) {
                const parts = text.split('||');
                text = parts[0].trim().replace(/\n/g, '<br>');
                const suggestionText = parts.slice(1).join('||');
                if (suggestionText.trim()) {
                    updateSuggestions(suggestionText);
                }
                cleanText = parts[0].trim();
            } else {
                text = text.replace(/\n/g, '<br>');
            }
            
            // Store clean version (without ||) in history
            msgDiv.dataset.clean = cleanText;
        }
        
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }
    
    function updateSuggestions(rawString) {
        const questions = rawString.split('||').map(q => q.trim()).filter(q => q);
        const suggContainer = document.getElementById('azChatSuggestions');
        if(!suggContainer || questions.length === 0) return;
        
        suggContainer.innerHTML = '';
        questions.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'az-chat-suggestion';
            btn.textContent = q;
            btn.addEventListener('click', () => {
                chatInput.value = q;
                sendMessage();
            });
            suggContainer.appendChild(btn);
        });
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
