# EmailJS - Configuración

## 1. Crea cuenta gratis en https://www.emailjs.com/
## 2. Conecta un servicio (Gmail, Outlook, etc.)
## 3. Crea 2 templates con estos diseños:

---

### Plantilla: `template_cliente` (correo para el solicitante)

**Template ID:** `template_cliente`
**Asunto:** `Gracias por contactarnos, {{to_name}}`

```html
<div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',sans-serif;background:#f8fafc;padding:40px 20px">
  <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
    <div style="background:#0d1630;padding:30px;text-align:center">
      <h1 style="color:#FF7A00;margin:0;font-size:24px;font-weight:800">AZCONSULTING</h1>
      <p style="color:#fff;margin:5px 0 0;font-size:14px">Consultoría TI e Infraestructura Tecnológica</p>
    </div>
    <div style="padding:35px">
      <h2 style="color:#0d1630;font-size:20px;margin:0 0 5px">Hola, {{to_name}}</h2>
      <p style="color:#64748b;font-size:15px;line-height:1.6">Hemos recibido tu solicitud y nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.</p>
      <div style="background:#f8fafc;border-left:4px solid #FF7A00;padding:20px;margin:20px 0;border-radius:0 12px 12px 0">
        <p style="margin:0 0 8px;color:#0d1630;font-weight:700">Resumen de tu solicitud:</p>
        <p style="margin:3px 0;color:#64748b;font-size:14px"><strong>Teléfono:</strong> {{telefono}}</p>
        <p style="margin:3px 0;color:#64748b;font-size:14px"><strong>Empresa:</strong> {{empresa}}</p>
        <p style="margin:3px 0;color:#64748b;font-size:14px"><strong>Mensaje:</strong> {{message}}</p>
        <p style="margin:3px 0;color:#64748b;font-size:14px"><strong>Fecha:</strong> {{fecha}}</p>
      </div>
      <p style="color:#64748b;font-size:14px">Si tienes alguna consulta adicional, responde a este correo o escríbenos al <a href="https://wa.me/51924858054" style="color:#FF7A00;font-weight:600">WhatsApp</a>.</p>
    </div>
    <div style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#94a3b8">
      © 2026 AZCONSULTING PERÚ — Trujillo, Perú
    </div>
  </div>
</div>
```

---

### Plantilla: `template_empresa` (notificación interna)

**Template ID:** `template_empresa`
**Asunto:** `Nuevo contacto: {{from_name}}`

```html
<div style="max-width:600px;margin:0 auto;font-family:'Segoe UI',sans-serif;background:#f8fafc;padding:40px 20px">
  <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
    <div style="background:#0d1630;padding:25px;text-align:center">
      <h1 style="color:#FF7A00;margin:0;font-size:22px;font-weight:800">AZCONSULTING</h1>
      <p style="color:#fff;margin:5px 0 0;font-size:13px">Nueva solicitud de contacto</p>
    </div>
    <div style="padding:30px">
      <div style="background:#fff4e6;border:1px solid #FF7A00;border-radius:12px;padding:20px;margin-bottom:20px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#64748b;width:100px"><strong>Nombre</strong></td><td style="padding:8px 0;color:#0d1630;font-weight:600">{{from_name}}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b"><strong>Email</strong></td><td style="padding:8px 0;color:#0d1630">{{from_email}}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b"><strong>Teléfono</strong></td><td style="padding:8px 0;color:#0d1630">{{telefono}}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b"><strong>Empresa</strong></td><td style="padding:8px 0;color:#0d1630">{{empresa}}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b"><strong>Fecha</strong></td><td style="padding:8px 0;color:#0d1630">{{fecha}}</td></tr>
        </table>
      </div>
      <div style="background:#f8fafc;border-radius:12px;padding:20px">
        <p style="margin:0 0 8px;color:#0d1630;font-weight:700">Mensaje:</p>
        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6">{{message}}</p>
      </div>
    </div>
  </div>
</div>
```

---

## 4. Reemplaza los valores en `assets/js/main.js`:

```js
const EMAILJS_CONFIG = {
    serviceId: 'service_tu_id',
    templateIdCliente: 'template_cliente',
    templateIdEmpresa: 'template_empresa',
    publicKey: 'tu_public_key'
};
```

Los encuentras en EmailJS → Account → API Keys y Email Services.
