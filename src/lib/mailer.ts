import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("⚠️ RESEND_API_KEY no configurada. Omitiendo envío de correo.");
    return;
  }

  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Rodero Music <onboarding@resend.dev>";
    await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
    });
    console.log(`✅ Email enviado exitosamente vía Resend a ${to}`);
  } catch (error) {
    console.error("❌ Error enviando email con Resend:", error);
  }
}

export async function sendVerificationCodeEmail(to: string, name: string, code: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 30px; border: 1px solid #1e293b; text-align: center;">
          <h2 style="color: #38bdf8; margin-top: 0;">RODERO MUSIC</h2>
          <p style="font-size: 16px; color: #f8fafc;">Hola <strong>${name}</strong>,</p>
          <p style="color: #94a3b8; font-size: 14px;">Tu código de verificación para completar el registro es:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #020617; background: #38bdf8; padding: 12px 24px; display: inline-block; border-radius: 12px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 12px;">Este código expirará en 15 minutos.</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to,
    subject: `🔑 Código de Verificación de Cuenta (${code}) - Rodero Music`,
    html: htmlContent,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, code: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 30px; border: 1px solid #1e293b; text-align: center;">
          <h2 style="color: #38bdf8; margin-top: 0;">RODERO MUSIC</h2>
          <p style="font-size: 16px; color: #f8fafc;">Hola <strong>${name}</strong>,</p>
          <p style="color: #94a3b8; font-size: 14px;">Has solicitado restablecer tu contraseña. Tu código de seguridad es:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #020617; background: #38bdf8; padding: 12px 24px; display: inline-block; border-radius: 12px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 12px;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to,
    subject: `🔐 Restablecer Contraseña (${code}) - Rodero Music`,
    html: htmlContent,
  });
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  totalAmount,
  orderCode,
}: any) {
  const itemsHtml = items
    .map(
      (item: any) => `
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

  await sendEmail({
    to,
    subject: `🎛️ Confirmación de Pedido Digital - Rodero Music (#${orderId.slice(-8)})`,
    html: htmlContent,
  });
}
