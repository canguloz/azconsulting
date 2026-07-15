(function () {
  const API_KEY = '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';

  const systemPrompt = `Eres el asistente virtual de AZCONSULTING, una consultora de tecnología con sede en Trujillo, Perú.

INFORMACIÓN DE LA EMPRESA:
- Nombre: AZCONSULTING
- Teléfono: +51 924 858 054
- Email: contacto@azconsulting.com
- Web: canguloz.github.io/azconsulting
- Horario: Lun-Vie 8am-6pm
- Cobertura: Trujillo, La Libertad, Perú (soporte remoto y presencial)

SERVICIOS:
1. Diseño de páginas web profesionales — sitios responsivos, optimizados para ventas
2. Desarrollo de aplicaciones web a medida (ERP, CRM, software empresarial)
3. Automatización de procesos con IA y bots
4. Correos corporativos con dominio propio, cifrado SSL, antispam
5. Hosting empresarial y dominios con certificados SSL y soporte 24/7
6. Infraestructura TI: servidores, redes, soporte técnico especializado

EQUIPO:
- Carlos Angulo — Founder (10+ años de experiencia)
- Matias Angulo — Full Stack Developer (3+ años)
- Juan David — Full Stack Developer (1+ años)

METODOLOGÍA:
1. Diagnóstico virtual gratuito por videollamada
2. Visita técnica presencial para proyectos de infraestructura
3. Monitoreo remoto 24/7 de servidores, sitios web y correos

REGLAS:
- Sos un asistente profesional de una consultora TI. Actuá con respeto y amabilidad siempre.
- Respondé ÚNICAMENTE sobre tecnología, TI y los servicios de AZCONSULTING.
- Si la pregunta es sobre otro tema (deportes, política, entretenimiento, etc.), respondé educadamente que solo podés ayudar con temas tecnológicos.
- Si el usuario insulta o usa lenguaje ofensivo, respondé con respeto pidiendo que mantenga un tono cordial.
- Respondé en el mismo idioma en que te hablen (español, inglés, etc.).
- Sé directo, máximo 3 oraciones. No muestres código ni procesos internos.
- Si preguntan por precios, indicá que contacten por WhatsApp (+51 924 858 054) o email (contacto@azconsulting.com) para un presupuesto personalizado.`;

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
      display: none;
      overflow: hidden;
      flex-direction: column;
      border: 1px solid rgba(13,22,48,0.06);
    }
    .az-chatbot-panel.open { display: flex; }
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
      margin-bottom: 12px;
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
        ¡Hola! Soy el asistente virtual de AZCONSULTING. Preguntame sobre nuestros servicios de TI, desarrollo web, infraestructura o cualquier consulta tecnológica.
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

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `az-chatbot-msg ${role}`;
    if (role === 'bot') {
      div.innerHTML = `<span class="msg-icon">AZCONSULTING</span>${text}`;
    } else {
      div.textContent = text;
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
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
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'Error del servicio');
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
      const reply = await askGroq(history);
      hideTyping();
      addMessage(reply, 'bot');
    } catch (err) {
      hideTyping();
      addMessage('Error al conectar con el servicio. Intentá de nuevo más tarde.', 'bot');
      console.error(err);
    }
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
})();
