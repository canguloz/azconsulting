(function () {
  const API_KEY = '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';

  const systemPrompt = `Sos el asistente de **AZCONSULTING**, consultora TI en Trujillo, Perú.

DATOS CLAVE:
- 📞 +51 924 858 054 | ✉️ contacto@azconsulting.com
- 🕐 Lun-Vie 8am-6pm | Cobertura: Trujillo, La Libertad
- Diagnóstico virtual gratuito + visita técnica + monitoreo 24/7

SERVICIOS:
💻 Páginas web profesionales | 📱 Apps a medida (ERP, CRM)
🤖 Automatización con IA | 📧 Correos corporativos SSL
☁️ Hosting y dominios | 🛡️ Infraestructura TI y soporte

EQUIPO: Carlos Angulo (10+ años), Matias Angulo (3+), Juan David (1+)

REGLAS:
- Respondé SOLO sobre TI y servicios de AZCONSULTING. Si no es TI, decí educadamente que solo ayudás con tecnología.
- Respondé en el mismo idioma del usuario.
- Sé **muy breve**: 2 oraciones como máximo. Directo, formal, sin rodeos.
- Usá **negritas** para resaltar palabras clave.
- Usá emojis cuando aporten.
- Sin código, sin procesos internos.
- Si preguntan precios, derivá a WhatsApp o email.
- **FORMATO OBLIGATORIO**: tu respuesta DEBE terminar con una línea que contenga exactamente 2 preguntas cortas separadas por " || ". No importa el tema de la consulta, incluí SIEMPRE esa línea al final. Ejemplo: HTML es un lenguaje de marcado para crear páginas web. En AZCONSULTING creamos sitios profesionales con HTML, CSS y JS. ¿Querés ver nuestros planes web? || ¿Cuánto cuesta una página?`;

  const styles = document.createElement('style');
  styles.textContent = `
    .az-chatbot-btn {
      position: fixed;
      right: 20px;
      bottom: 130px;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: #0d1630;
      color: #fff;
      border: none;
      cursor: pointer;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      box-shadow: 0 4px 20px rgba(13,22,48,0.25);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .az-chatbot-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 30px rgba(13,22,48,0.35);
    }
    .az-chatbot-btn .close-icon { display: none; }
    .az-chatbot-btn.open .chat-icon { display: none; }
    .az-chatbot-btn.open .close-icon { display: inline; }
    .az-chatbot-panel {
      position: fixed;
      right: 20px;
      bottom: 195px;
      width: 360px;
      max-height: 500px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 10px 50px rgba(13,22,48,0.15);
      z-index: 9997;
      overflow: hidden;
      flex-direction: column;
      border: 1px solid rgba(13,22,48,0.06);
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px) scale(0.97);
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    }
    .az-chatbot-panel.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .az-chatbot-header {
      background: #0d1630;
      color: #fff;
      padding: 16px 20px;
      font-weight: 700;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .az-chatbot-header i { color: #FF7A00; font-size: 1.1rem; }
    .az-chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      max-height: 340px;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .az-chatbot-msg {
      margin-bottom: 4px;
      padding: 10px 14px;
      border-radius: 14px;
      max-width: 85%;
      animation: fadeUp 0.3s ease;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .az-chatbot-msg.user {
      background: #0d1630;
      color: #fff;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }
    .az-chatbot-msg.bot {
      background: #f1f5f9;
      color: #1e293b;
      margin-right: auto;
      border-bottom-left-radius: 4px;
    }
    .az-chatbot-msg.bot .msg-icon {
      font-weight: 700;
      color: #FF7A00;
      font-size: 0.75rem;
      display: block;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .az-chatbot-typing {
      display: flex;
      gap: 5px;
      padding: 10px 14px;
      background: #f1f5f9;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      margin-bottom: 12px;
      margin-right: auto;
      max-width: 70px;
    }
    .az-chatbot-typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
      animation: typingBounce 1.4s infinite;
    }
    .az-chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
    .az-chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    .az-chatbot-input {
      display: flex;
      border-top: 1px solid rgba(13,22,48,0.06);
      padding: 10px;
      background: #fafafa;
    }
    .az-chatbot-input input {
      flex: 1;
      border: 1px solid rgba(13,22,48,0.1);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 0.9rem;
      outline: none;
      font-family: inherit;
    }
    .az-chatbot-input input:focus {
      border-color: #FF7A00;
      box-shadow: 0 0 0 3px rgba(255,122,0,0.1);
    }
    .az-chatbot-input button {
      width: 42px;
      height: 42px;
      border: none;
      border-radius: 10px;
      background: #0d1630;
      color: #fff;
      margin-left: 8px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }
    .az-chatbot-input button:hover { background: #FF7A00; }
    .az-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 6px 0 12px 0;
      padding: 0 4px;
      animation: fadeUp 0.3s ease;
    }
    .az-suggestions button {
      background: #fff;
      border: 1px solid #0d1630;
      color: #0d1630;
      border-radius: 18px;
      padding: 6px 14px;
      font-size: 0.78rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .az-suggestions button:hover {
      background: #0d1630;
      color: #fff;
    }
    img.az-emoji {
      display: inline;
      width: 1.1em;
      height: 1.1em;
      vertical-align: -0.15em;
      margin: 0 0.04em;
    }
    @media (max-width: 480px) {
      .az-chatbot-panel { width: calc(100vw - 40px); right: 20px; }
    }
  `;
  document.head.appendChild(styles);

  const btn = document.createElement('button');
  btn.className = 'az-chatbot-btn';
  btn.innerHTML = '<span class="chat-icon"><i class="fas fa-robot"></i></span><span class="close-icon"><i class="fas fa-times"></i></span>';
  btn.setAttribute('aria-label', 'Abrir chat IA');
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'az-chatbot-panel';
  panel.innerHTML = `
    <div class="az-chatbot-header">
      <i class="fas fa-robot"></i> Asistente AZCONSULTING
    </div>
    <div class="az-chatbot-messages" id="azChatMessages">
      <div class="az-chatbot-msg bot">
        <span class="msg-icon">AZCONSULTING</span>
        ¡Hola! Soy el asistente de <strong>AZCONSULTING</strong> 💻 Preguntame sobre desarrollo web, apps, hosting, ciberseguridad o infraestructura TI.
      </div>
      <div class="az-suggestions">
        <button data-question="¿Qué servicios ofrecen?">¿Qué servicios ofrecen?</button>
        <button data-question="¿Cómo contrato?">¿Cómo contrato?</button>
      </div>
    </div>
    <div class="az-chatbot-input">
      <input type="text" id="azChatInput" placeholder="Escribe tu consulta..." autocomplete="off">
      <button id="azChatSend"><i class="fas fa-paper-plane"></i></button>
    </div>
  `;
  document.body.appendChild(panel);

  const messagesEl = document.getElementById('azChatMessages');
  const inputEl = document.getElementById('azChatInput');
  const sendBtn = document.getElementById('azChatSend');

  let lastMsgTime = 0;

  function loadTwemoji(callback) {
    if (typeof twemoji !== 'undefined') { callback(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = callback;
    document.head.appendChild(s);
  }

  function parseEmojis(el) {
    if (typeof twemoji !== 'undefined') twemoji.parse(el, { className: 'az-emoji' });
  }

  loadTwemoji(() => {
    document.querySelectorAll('.az-chatbot-msg.bot, .az-suggestions').forEach(parseEmojis);
  });

  messagesEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-question]');
    if (btn) {
      inputEl.value = btn.dataset.question;
      handleSend();
    }
  });

  function formatText(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `az-chatbot-msg ${role}`;
    if (role === 'bot') {
      div.innerHTML = `<span class="msg-icon">AZCONSULTING</span>${formatText(text)}`;
    } else {
      div.textContent = text;
    }
    messagesEl.appendChild(div);
    if (role === 'bot') parseEmojis(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addSuggestions(q1, q2) {
    const wrap = document.createElement('div');
    wrap.className = 'az-suggestions';
    wrap.innerHTML = `
      <button data-question="${q1.replace(/"/g, '&quot;')}">${q1}</button>
      <button data-question="${q2.replace(/"/g, '&quot;')}">${q2}</button>
    `;
    messagesEl.appendChild(wrap);
    parseEmojis(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function fallbackSuggestions(text) {
    const kw = text.toLowerCase();
    if (/html|css|javascript|js|frontend|front-end|maquetac|codigo/.test(kw))
      return ['¿Desarrollan páginas web?', '¿Cuánto cuesta una web?'];
    if (/app|aplicacion|movil|mobile|android|ios/.test(kw))
      return ['¿Hacen apps a medida?', '¿Qué tecnologías usan?'];
    if (/hosting|dominio|servidor|cloud|nube/.test(kw))
      return ['¿Ofrecen hosting?', '¿Cuánto cuesta el hosting?'];
    if (/precio|costo|cuanto|presupuesto|tarifa|valor/.test(kw))
      return ['¿Cómo contrato?', '¿Incluye soporte técnico?'];
    if (/email|correo|outlook|gmail|exchange/.test(kw))
      return ['¿Ofrecen correos corporativos?', '¿Incluye seguridad SSL?'];
    if (/seguridad|ciberseguridad|hacker|proteccion|vulnerabilidad/.test(kw))
      return ['¿Ofrecen ciberseguridad?', '¿Incluye monitoreo 24/7?'];
    if (/ia|inteligencia artificial|chatbot|automatizacion|bot/.test(kw))
      return ['¿Automatizan procesos con IA?', '¿Qué beneficios tiene?'];
    if (/seo|posicionamiento|google|busqueda/.test(kw))
      return ['¿Hacen SEO?', '¿Cuánto cuesta el servicio?'];
    if (/soporte|mantenimiento|tecnico|reparacion/.test(kw))
      return ['¿Ofrecen soporte técnico?', '¿Dónde están ubicados?'];
    if (/contrato|contratar|servicio|planes/.test(kw))
      return ['¿Qué métodos de pago aceptan?', '¿Incluye visita técnica?'];
    if (/web|sitio|pagina|ecommerce|tienda/.test(kw))
      return ['¿Hacen páginas web?', '¿Cuánto tiempo toma?'];
    return ['¿Qué servicios ofrecen?', '¿Cómo contrato?'];
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'az-chatbot-typing';
    div.id = 'azChatTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('azChatTyping');
    if (el) el.remove();
  }

  async function askGroq(messages) {
    let res;
    try {
      res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'groq/compound',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: 300,
          temperature: 0.5
        })
      });
    } catch {
      throw { type: 'network' };
    }
    const data = await res.json();
    if (res.status === 429) throw { type: 'rate_limit' };
    if (data.error) throw { type: 'api', detail: data.error.message };
    return data.choices[0].message.content;
  }

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) inputEl.focus();
  });

  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    const now = Date.now();
    if (now - lastMsgTime < 3000) {
      addMessage('Esperá unos segundos antes de enviar otro mensaje.', 'bot');
      return;
    }
    lastMsgTime = now;

    inputEl.value = '';
    addMessage(text, 'user');
    showTyping();

    await new Promise(r => setTimeout(r, 500));

    try {
      const history = [];
      const all = messagesEl.querySelectorAll('.az-chatbot-msg');
      all.forEach(m => {
        if (m.classList.contains('user')) history.push({ role: 'user', content: m.textContent });
        if (m.classList.contains('bot')) history.push({ role: 'assistant', content: m.textContent.replace(/^AZCONSULTING/, '').trim() });
      });
      history.push({ role: 'user', content: text });
      const raw = await askGroq(history);
      hideTyping();

      const parts = raw.split('||').map(s => s.trim());
      const reply = parts[0];
      const q1 = parts[1] || null;
      const q2 = parts[2] || null;

      addMessage(reply, 'bot');
      if (q1 && q2 && q1.length > 3 && q2.length > 3) {
        addSuggestions(q1, q2);
      } else {
        const [f1, f2] = fallbackSuggestions(text + ' ' + reply);
        addSuggestions(f1, f2);
      }
    } catch (err) {
      hideTyping();
      if (err.type === 'network') {
        addMessage('Error de conexión. Verificá tu internet y volvé a intentar.', 'bot');
      } else if (err.type === 'rate_limit') {
        addMessage('Demasiadas consultas por minuto. Esperá unos segundos.', 'bot');
      } else if (err.type === 'api') {
        addMessage('El servicio no procesó la consulta. Reformulá tu mensaje.', 'bot');
      } else {
        addMessage('Error inesperado. Intentá de nuevo.', 'bot');
      }
      console.error(err);
    }
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
})();
