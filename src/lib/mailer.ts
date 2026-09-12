import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendOrderEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number; isDigital: boolean }>;
  totalAmount: number;
  orderCode?: string;
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  totalAmount,
  orderCode,
}: SendOrderEmailParams) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 12px 0; color: #f8fafc;">
          ${item.name} 
          <span style="background: #06b6d4; color: #020617; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">Digital / Servicio</span>
        </td>
        <td style="padding: 12px 0; text-align: center; color: #94a3b8;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; color: #f8fafc;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const orderCodeHtml = orderCode
    ? `
    <div style="margin-top: 24px; padding: 20px; background-color: #0f172a; border: 2px dashed #06b6d4; border-radius: 12px; text-align: center;">
      <h3 style="margin-top: 0; color: #06b6d4; font-size: 18px;">🔑 Código de Referencia / Entrega - Rodero Music</h3>
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 16px;">Facilita este código por Chat o WhatsApp si tu pedido incluye producción personalizada:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #020617; background: #06b6d4; padding: 12px 20px; display: inline-block; border-radius: 8px;">
        ${orderCode}
      </div>
    </div>
  `
    : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Rodero Music - Confirmación de Pedido Digital</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #020617; margin: 0; padding: 20px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
          <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 35px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px;">RODERO MUSIC</h1>
            <p style="margin-top: 6px; font-size: 14px; font-weight: 600; opacity: 0.9;">¡Confirmación de Pedido Digital!</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #f8fafc;">Hola <strong>${customerName || "Cliente"}</strong>,</p>
            <p style="font-size: 14px; color: #94a3b8;">Tu pedido <strong>#${orderId.slice(-8)}</strong> ha sido procesado con éxito. A continuación encuentras los detalles de tus productos/servicios:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 2px solid #334155; text-align: left; color: #cbd5e1;">
                  <th style="padding-bottom: 8px;">Producto / Servicio</th>
                  <th style="padding-bottom: 8px; text-align: center;">Cant.</th>
                  <th style="padding-bottom: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; text-align: right; font-size: 20px; font-weight: bold; color: #06b6d4;">
              Total Pagado: $${totalAmount.toFixed(2)}
            </div>

            ${orderCodeHtml}

            <p style="margin-top: 35px; font-size: 12px; color: #64748b; text-align: center;">
              Rodero Music Official Store &copy; 2026. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Rodero Music Store" <noreply@roderomusic.com>',
    to,
    subject: `🎛️ Confirmación de Pedido Digital - Rodero Music (#${orderId.slice(-8)})`,
    html: htmlContent,
  });
}
