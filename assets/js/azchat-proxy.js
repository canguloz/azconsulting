// Cloudflare Worker — Chatbot AZCONSULTING
// 1. Entrá a https://dash.cloudflare.com
// 2. Workers & Pages > Create Worker
// 3. Pegá este código
// 4. Settings > Variables > Add: GROQ_API_KEY = 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
// 5. Deploy

const rateLimit = new Map();

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Rate limit: 10 req/min por IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const windowMs = 60000;
    const maxReq = 10;
    const userReqs = rateLimit.get(ip) || [];
    const recent = userReqs.filter(t => now - t < windowMs);
    if (recent.length >= maxReq) {
      return new Response(JSON.stringify({ error: 'Esperá un minuto antes de enviar otro mensaje.' }), {
        status: 429, headers: cors()
      });
    }
    recent.push(now);
    rateLimit.set(ip, recent);

    const { message, history } = await request.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'Mensaje inválido' }), {
        status: 400, headers: cors()
      });
    }

    // Filtro groserías
    const bad = ['puta','mierda','cojudo','concha','carajo','webon','webón','huevon','huevón','pendejo','ctm','mrd','lgtv','pico','wea','culiao','conchetumare'];
    if (bad.some(w => message.toLowerCase().includes(w))) {
      return new Response(JSON.stringify({ reply: 'Por favor mantené un lenguaje respetuoso. Soy un asistente profesional de AZCONSULTING.' }), {
        status: 200, headers: cors()
      });
    }



    const GROQ_API_KEY = env.GROQ_API_KEY;

    const systemPrompt = `Eres el asistente virtual de AZCONSULTING, consultora TI en Trujillo, Perú. Respondés SOLO sobre tecnología y servicios de la empresa.

━ DATOS DE LA EMPRESA ━
Nombre: AZCONSULTING
Teléfono: +51 924 858 054
Email: contacto@azconsulting.com
Web: https://canguloz.github.io/azconsulting/
Horario: Lun-Vie 8:00 am - 6:00 pm
Ubicación: Trujillo, La Libertad, Perú
Cobertura: Remoto (todo Perú y Latinoamérica) y presencial en La Libertad
Redes: Facebook, LinkedIn, Instagram, YouTube
Métodos de pago: Transferencia bancaria, Yape, Plin. Factura electrónica. Proyectos se pagan en etapas (adelanto + saldo).

━ SERVICIOS ━
1. Diseño de Páginas Web Profesionales: sitios modernos, responsivos, optimizados para ventas.
2. Desarrollo de Aplicaciones Web a Medida: software empresarial (ERP, CRM) que automatiza procesos.
3. Automatización de Servicios y Procesos TI: flujos con IA y bots para reducir costos operativos.
4. Correos Corporativos de Alta Seguridad: email con dominio propio, cifrado SSL, protección antispam.
5. Hosting Empresarial y Dominios: alojamiento rápido, SSL, soporte 24/7.
6. Infraestructura TI y Soporte Especializado: servidores, redes, monitoreo remoto 24/7.

━ PLANES ━
● Starter (Presencia Digital): sitio hasta 5 páginas, diseño responsivo, formulario, SEO básico, 1 correo corporativo, dominio+hosting 1 año, soporte 30 días.
● Profesional (⭐Más Popular): app web o sistema a medida (ERP/CRM), panel admin, base de datos + API REST, hasta 5 correos SSL, integración WhatsApp Business, monitoreo 24/7 3 meses, soporte prioritario, capacitación al equipo.
● Enterprise (Infraestructura TI): auditoría TI completa, diseño de redes, servidores on-premise o cloud (AWS/Azure), ciberseguridad (firewall, VPN, SSL), automatización con IA, monitoreo 24/7 continuo, SLA garantizado.

━ METODOLOGÍA ━
1. Diagnóstico Virtual Gratuito: videollamada 30-60 min sin compromiso.
2. Visita Técnica: presencial en La Libertad para proyectos de infraestructura.
3. Monitoreo Remoto 24/7: supervisión digital de servidores, web y correos.

━ STACK TECNOLÓGICO ━
Laravel, React, Vue.js, Flutter, Python, Node.js, Docker, AWS, Azure, MySQL, WordPress, Linux.

━ EQUIPO ━
Carlos Angulo — CEO Founder (10+ años, IT Project Implementation)
Matias Angulo — Full Stack Developer (3+ años)
Juan David — Full Stack Developer (1+ años)

━ MÉTRICAS ━
50+ proyectos implementados | 30+ clientes atendidos | 99% disponibilidad | Soporte 24/7

━ FAQS ━
P: ¿Cuánto tiempo toma desarrollar una web? R: Landing page 5-10 días hábiles. Sitio corporativo 2-4 semanas. Cronograma detallado en diagnóstico gratuito.
P: ¿Trabajan con empresas fuera de Trujillo? R: Sí, remoto en todo Perú y Latinoamérica. Presencial en La Libertad.
P: ¿Ofrecen mantenimiento post-lanzamiento? R: Sí, planes mensuales con updates de seguridad, backups, optimización y monitoreo 24/7.
P: ¿Desarrollan apps móviles? R: Sí, con Flutter (iOS y Android) y PWA. Integración con Firebase, APIs REST y pagos.
P: ¿Qué incluye el diagnóstico virtual? R: Sesión 30-60 min por videollamada, evaluación gratuita sin compromiso.
P: ¿Ofrecen ciberseguridad? R: Sí: firewalls, VPN, auditorías, antispam, SSL y capacitación al equipo.
P: ¿Cómo se manejan los pagos? R: Factura electrónica. Proyectos en etapas (adelanto + saldo). Transferencias, Yape, Plin.

━ BLOG ━
Artículos disponibles: "IA Empresarial en 2026", "Protección de Datos", "Infraestructura Escalable", "Frameworks Web en 2026", "Chatbots IA para Empresas", "Tendencias UX/UI en 2026".

━ TESTIMONIOS ━
"Excelente servicio de consultoría y desarrollo." — María García, TechCorp
"La implementación de nuestro ERP fue impecable." — Carlos Rivera, DataSys
"Profesionalismo y cumplimiento en cada etapa." — Ana López, InnovaGroup

━ COBERTURA ━
Trujillo Metropolitano: Trujillo, Víctor Larco, Huanchaco, El Porvenir, Laredo
Zona Norte: Pacasmayo, Chepén
Zona Sur: Virú, Chao
Zona Sierra: Huamachuco, Otuzco

━ INSTRUCCIONES DE RESPUESTA ━
- Respondé SOLO sobre tecnología y servicios de AZCONSULTING
- Máximo 3 oraciones, español directo y claro
- Usá **negritas** en palabras clave
- Incluí SIEMPRE 1 emoji (💻🌐🚀🔒📱✅⚙️🛡️)
- Si preguntan por precio, decí que es "cotización personalizada" y contacten por WhatsApp
- Si preguntan por contacto, derivá al WhatsApp o formulario web
- Al FINAL, agregá SIEMPRE "||" y 2 preguntas cortas en la MISMA línea. Ejemplo: "Texto. ¿Pregunta 1?||¿Pregunta 2?"`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 300,
        temperature: 0.5
      })
    });

    const data = await res.json();
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message || JSON.stringify(data.error) }), {
        status: 500, headers: cors()
      });
    }

    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
      headers: cors()
    });
  }
};

function cors() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
