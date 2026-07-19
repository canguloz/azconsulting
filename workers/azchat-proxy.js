// Cloudflare Worker — Chatbot AZCONSULTING con RAG
// 1. Entrá a https://dash.cloudflare.com
// 2. Workers & Pages > Create Worker
// 3. Pegá este código
// 4. Settings > Variables > Add: GROQ_API_KEY = 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
// 5. Deploy

const rateLimit = new Map();

const CHUNKS = [
  {id:"hero",t:"hero",c:"Consultoría TI en Trujillo: Transformación Digital y Soluciones para Empresas en La Libertad. En AZ Consulting diseñamos páginas web profesionales, desarrollamos aplicaciones a medida y optimizamos tu infraestructura tecnológica para acelerar el crecimiento de tu negocio. Equipo: Carlos Angulo (CEO Founder, 10+ años), Matias Angulo (Full Stack Developer), Juan David (Full Stack Developer)."},
  {id:"nosotros",t:"nosotros",c:"En AZCONSULTING ayudamos a empresas y profesionales a optimizar sus procesos mediante soluciones tecnológicas seguras, escalables y orientadas a resultados. Misión: Brindar soluciones tecnológicas innovadoras que impulsen la productividad. Visión: Ser una consultora tecnológica reconocida por su excelencia e innovación. Valores: Compromiso, innovación, confianza, calidad y orientación al cliente."},
  {id:"servicios",t:"servicios",c:"Servicios de AZCONSULTING: 1. Diseño de Páginas Web Profesionales: sitios modernos, responsivos y optimizados para ventas. 2. Desarrollo de Aplicaciones Web a Medida: ERP, CRM que automatizan procesos. 3. Automatización de Servicios y Procesos TI: flujos con IA y bots para reducir costos. 4. Correos Corporativos de Alta Seguridad: email con dominio propio, cifrado SSL, antispam. 5. Hosting Empresarial y Dominios: alojamiento rápido con SSL y soporte 24/7. 6. Infraestructura TI y Soporte Especializado: servidores, redes, monitoreo 24/7."},
  {id:"stack",t:"stack tecnologico",c:"Stack tecnológico que dominamos: Laravel, React, Vue.js, Flutter, Python, Node.js, Docker, AWS, Azure, MySQL, WordPress, Linux."},
  {id:"metricas",t:"metricas",c:"Métricas de AZCONSULTING: 50+ proyectos implementados, 30+ clientes atendidos, 99% disponibilidad de servicios, soporte 24/7."},
  {id:"cobertura",t:"cobertura",c:"Cobertura regional: Atendemos en toda La Libertad, Perú. Trujillo Metropolitano: Trujillo, Víctor Larco, Huanchaco, El Porvenir, Laredo. Zona Norte: Pacasmayo, Chepén. Zona Sur: Virú, Chao. Zona Sierra: Huamachuco, Otuzco. También trabajamos remoto con empresas de todo Perú y Latinoamérica."},
  {id:"precios-starter",t:"plan starter precios",c:"Plan Starter - Presencia Digital: Ideal para emprendedores. Incluye sitio web hasta 5 páginas, diseño responsivo mobile-first, formulario de contacto, SEO básico, 1 correo corporativo, dominio + hosting 1 año, soporte post-lanzamiento 30 días. Cotización personalizada."},
  {id:"precios-profesional",t:"plan profesional precios",c:"Plan Profesional - Más Popular: Para empresas en crecimiento. Incluye app web o sistema a medida (ERP/CRM), panel admin, base de datos + API REST, hasta 5 correos SSL, integración WhatsApp Business, monitoreo 24/7 3 meses, soporte prioritario, capacitación al equipo. Cotización personalizada."},
  {id:"precios-enterprise",t:"plan enterprise precios",c:"Plan Enterprise - Infraestructura TI: Para medianas y grandes empresas. Incluye auditoría TI completa, diseño de redes, servidores on-premise o cloud (AWS/Azure), ciberseguridad (firewall, VPN, SSL), automatización con IA, monitoreo 24/7 continuo, SLA garantizado. Diagnóstico virtual gratuito."},
  {id:"metodologia",t:"metodologia",c:"Metodología de atención: 1. Diagnóstico Virtual Gratuito: videollamada 30-60 min sin compromiso. 2. Visita Técnica: presencial en La Libertad para proyectos de infraestructura. 3. Monitoreo Remoto 24/7: supervisión digital constante de servidores, web y correos corporativos."},
  {id:"portafolio",t:"portafolio proyectos",c:"Portafolio: Sistema Integral de Gestión (ERP) con Laravel, MySQL, AWS. Automatización Comercial (CRM) con PHP, Power BI, API REST. Plataforma Multiservicios (App Móvil) con Flutter, Firebase, Node.js."},
  {id:"resultados",t:"resultados metricas",c:"Resultados comprobados: 35% reducción de costos operativos mediante automatización, 80% de procesos digitalizados, 45% incremento de productividad."},
  {id:"testimonios",t:"testimonios",c:"Testimonios: 'Excelente servicio de consultoría' - María García, TechCorp. 'Implementación de ERP impecable' - Carlos Rivera, DataSys. 'Profesionalismo y cumplimiento' - Ana López, InnovaGroup."},
  {id:"contacto",t:"contacto",c:"Contacto: Teléfono +51 924 858 054, Email contacto@azconsulting.com, WhatsApp +51 924 858 054, Ubicación Trujillo - Perú. Horario Lun-Vie 8am-6pm. Respondemos en máximo 24 horas."},
  {id:"faq-tiempo",t:"faq tiempo desarrollo web",c:"FAQ: ¿Cuánto tiempo toma desarrollar una web? Landing page: 5-10 días hábiles. Sitio corporativo: 2-4 semanas. Cronograma detallado en diagnóstico gratuito."},
  {id:"faq-fuera",t:"faq fuera trujillo",c:"FAQ: ¿Trabajan con empresas fuera de Trujillo? Sí, remoto en todo Perú y Latinoamérica. Presencial en La Libertad. Diagnóstico virtual gratuito."},
  {id:"faq-mantenimiento",t:"faq mantenimiento post-lanzamiento",c:"FAQ: ¿Ofrecen mantenimiento post-lanzamiento? Sí, planes mensuales con actualizaciones de seguridad, backups automáticos, optimización de rendimiento y monitoreo 24/7."},
  {id:"faq-apps",t:"faq aplicaciones moviles",c:"FAQ: ¿Desarrollan apps móviles? Sí, con Flutter (iOS y Android) y PWA. Integración con Firebase, APIs REST y sistemas de pago."},
  {id:"faq-diagnostico",t:"faq diagnostico virtual",c:"FAQ: ¿Qué incluye el diagnóstico virtual gratuito? Sesión de 30-60 min por videollamada, evaluación sin compromiso, plan de acción personalizado."},
  {id:"faq-ciberseguridad",t:"faq ciberseguridad",c:"FAQ: ¿Ofrecen ciberseguridad? Sí: firewalls, VPN, auditorías de vulnerabilidades, antispam en correos, certificados SSL, capacitación al equipo."},
  {id:"faq-pagos",t:"faq pagos facturacion",c:"FAQ: ¿Cómo se manejan los pagos? Factura electrónica. Proyectos en etapas (adelanto + saldo). Aceptamos transferencias bancarias, Yape y Plin."},
  {id:"blog-ia",t:"blog ia inteligencia artificial",c:"Artículo: IA Empresarial en 2026. La IA ya no es futuro, es realidad operativa. Automatización inteligente con chatbots y análisis predictivo. Reducción de costos y mejora en toma de decisiones."},
  {id:"blog-ciberseguridad",t:"blog ciberseguridad proteccion datos",c:"Artículo: Protección de Datos en la Era Digital. Estrategias Zero Trust, firewalls de próxima generación, copias de seguridad automatizadas, prevención de intrusiones."},
  {id:"blog-nube",t:"blog cloud nube infraestructura",c:"Artículo: Infraestructura Escalable Multi-Cloud. Migración a AWS, Google Cloud y Azure. Arquitecturas híbridas, disponibilidad 99.9%, trabajo remoto."},
  {id:"blog-desarrollo",t:"blog desarrollo frameworks web",c:"Artículo: Frameworks Web en 2026. React, Vue y Astro. Islands Architecture, rendimiento perfecto, contenido estático conJavaScript bajo demanda."},
  {id:"blog-chatbots",t:"blog chatbots ia atencion cliente",c:"Artículo: Chatbots IA para Empresas. Asistentes virtuales 24/7, atención al cliente automatizada, reducción de carga operativa, agendar citas y cotizaciones."},
  {id:"blog-uxui",t:"blog ux ui diseno tendencias",c:"Artículo: Tendencias UX/UI en 2026. Interfaces inteligentes y adaptativas, microinteracciones, modo oscuro dinámico, incremento de tasa de conversión."},
  {id:"socios",t:"socios alianzas",c:"Socios estratégicos: Amazon For the Enterprise, Microsoft, AWS, Google, Oracle, Cisco, Dell."},
  {id:"cta",t:"diagnostico gratuito cta",c:"Diagnóstico gratuito sin compromiso. Agenda una videollamada gratuita. Plan de acción personalizado en menos de 24 horas."}
];

function findRelevantChunks(query, maxChunks = 4) {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const terms = q.split(/\s+/).filter(t => t.length > 2);
  const stopWords = ["que","para","con","las","los","una","por","del","como","mas","pero","sus","entre","esta","este","esto","tiene","puede","todo","tipo","muy","cada","sido","hace","sobre","parte","tiene","debe","ser","son","era","han","sin","ello"];
  
  const scores = CHUNKS.map(chunk => {
    const tc = (chunk.t + " " + chunk.c).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let score = 0;
    const matched = [];
    for (const term of terms) {
      if (stopWords.includes(term)) continue;
      if (tc.includes(term)) {
        score += term.length;
        matched.push(term);
      }
    }
    return { ...chunk, score, matched };
  });
  
  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

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

    const bad = ['puta','mierda','cojudo','concha','carajo','webon','webón','huevon','huevón','pendejo','ctm','mrd','lgtv','pico','wea','culiao','conchetumare'];
    if (bad.some(w => message.toLowerCase().includes(w))) {
      return new Response(JSON.stringify({ reply: 'Por favor mantené un lenguaje respetuoso. Soy un asistente profesional de AZCONSULTING.' }), {
        status: 200, headers: cors()
      });
    }

    const relevant = findRelevantChunks(message);
    const context = relevant.length > 0
      ? relevant.map(r => `[${r.t}]: ${r.c}`).join('\n\n')
      : '';

    const GROQ_API_KEY = env.GROQ_API_KEY;

    const systemPrompt = `Eres el asistente virtual de AZCONSULTING, consultora TI en Trujillo, Perú.

DATOS DE LA EMPRESA:
Tel: +51 924 858 054 | Email: contacto@azconsulting.com | Web: canguloz.github.io/azconsulting
Horario: Lun-Vie 8am-6pm | Ubicación: Trujillo, La Libertad, Perú
Pagos: Transferencia, Yape, Plin. Factura electrónica. Proyectos en etapas.

${context ? `INFORMACIÓN RELEVANTE PARA RESPONDER:\n${context}\n` : ''}

INSTRUCCIONES:
- Respondé SOLO sobre tecnología y servicios de AZCONSULTING
- Usá la información de arriba para responder con precisión
- Máximo 3 oraciones, español directo y claro
- Usá **negritas** en palabras clave
- Incluí SIEMPRE 1 emoji (💻🌐🚀🔒📱✅⚙️🛡️)
- Si preguntan por precio, decí que es cotización personalizada y contacten por WhatsApp
- Si preguntan por contacto, derivá al WhatsApp o formulario web
- Si NO hay información relevante arriba, usá tu conocimiento general sobre la empresa
- Al FINAL, agregá SIEMPRE "||" y 2 preguntas cortas en la MISMA línea`;

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
        max_tokens: 350,
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
