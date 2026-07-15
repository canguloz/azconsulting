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

    // Solo preguntas TI y contacto
    const tiKw = ['web','sitio','página','app','aplicación','software','sistema','desarrollo','código','programación','servidor','hosting','dominio','correo','email','infraestructura','red','firewall','vpn','cloud','nube','aws','azure','google cloud','ciberseguridad','seguridad','hacker','malware','ransomware','phishing','automatización','bot','ia','inteligencia artificial','machine learning','chatbot','frontend','backend','full stack','database','sql','api','docker','kubernetes','devops','linux','windows','wordpress','laravel','react','vue','python','javascript','php','html','css','seo','transformación digital','ti','tecnología','computadora','laptop','pc','soporte','backup','erp','crm','ecommerce','ssl','certificado','cpanel','dns','trujillo','la libertad','perú','consultoría','presupuesto','precio','servicio','proyecto','informática','datos','office','excel','redes','internet','lan','wan','móvil','movil','negocio','empresa','empresarial','solución','soluciones','cloud','whatsapp','contacto','teléfono','dirección','ubicación','horario','atención','presupuesto','contratar','taller','capacitación','auditoría','auditoria','consulta'];
    if (!tiKw.some(k => message.toLowerCase().includes(k))) {
      return new Response(JSON.stringify({ reply: 'Solo respondo preguntas sobre tecnología y servicios TI de AZCONSULTING. Preguntame sobre desarrollo web, infraestructura, ciberseguridad, hosting o transformación digital.' }), {
        status: 200, headers: cors()
      });
    }

    const GROQ_API_KEY = env.GROQ_API_KEY;

    const systemPrompt = `Eres el asistente virtual de AZCONSULTING, consultora TI en Trujillo, Perú.

EMPRESA:
- Nombre: AZCONSULTING
- Tel: +51 924 858 054
- Email: contacto@azconsulting.com
- Web: canguloz.github.io/azconsulting
- Horario: Lun-Vie 8am-6pm
- Cobertura: Trujillo, La Libertad (soporte remoto y presencial)

SERVICIOS:
1. Diseño de páginas web profesionales - responsivas, optimizadas para ventas
2. Desarrollo de aplicaciones web a medida (ERP, CRM, software empresarial)
3. Automatización de procesos con IA y bots
4. Correos corporativos con dominio propio, SSL, antispam
5. Hosting empresarial y dominios con soporte 24/7
6. Infraestructura TI: servidores, redes, soporte técnico especializado

EQUIPO:
- Carlos Angulo - Founder (10+ años)
- Matias Angulo - Full Stack Developer (3+ años)
- Juan David - Full Stack Developer (1+ años)

METODOLOGÍA:
1. Diagnóstico virtual gratuito
2. Visita técnica presencial
3. Monitoreo remoto 24/7

INSTRUCCIONES:
- Respondé SOLO sobre TI, tecnología y servicios de AZCONSULTING
- Respondé en español, directo, máximo 3 oraciones
- No muestres código ni herramientas internas
- Si preguntan precios, decí que contacten por WhatsApp o email
- Si no es tema TI, decí "No puedo responder eso"`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []),
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.5
      })
    });

    const data = await res.json();
    if (data.error) {
      return new Response(JSON.stringify({ error: 'Error del servicio. Intentá de nuevo.' }), {
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
