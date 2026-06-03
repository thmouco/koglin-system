import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendTicketNotificationEmail({
  to,
  guideName,
  passengerName,
  ticketId,
  category,
  description,
  appUrl,
}: {
  to: string
  guideName: string
  passengerName: string
  ticketId: string
  category: string
  description: string
  appUrl: string
}) {
  const categoryLabels: Record<string, string> = {
    hotel: 'Hotel', ship: 'Navio', flight: 'Voo', transfer: 'Translado', other: 'Outro'
  }

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Ticket — Koglin Viagens</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:#00204a;padding:24px 32px;border-bottom:4px solid #fcb900;">
              <table width="100%">
                <tr>
                  <td>
                    <div style="color:#ffffff;font-size:20px;font-weight:bold;">Koglin Viagens</div>
                    <div style="color:rgba(255,255,255,0.6);font-size:12px;">Lufthansa City Center</div>
                  </td>
                  <td align="right">
                    <div style="background:#fcb900;color:#00204a;padding:6px 12px;font-size:12px;font-weight:bold;">
                      🔔 NOVO TICKET
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="color:#00204a;font-size:16px;margin:0 0 16px;">Olá, <strong>${guideName}</strong>!</p>
              <p style="color:#555;font-size:14px;margin:0 0 24px;">
                Um novo ticket foi aberto pelo passageiro <strong>${passengerName}</strong>.
              </p>

              <!-- Ticket card -->
              <table width="100%" style="background:#f8f9fa;border:1px solid #e0e0e0;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;">
                    <table width="100%">
                      <tr>
                        <td width="50%" style="padding-bottom:12px;">
                          <div style="color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;">Ticket</div>
                          <div style="color:#00204a;font-weight:bold;font-family:monospace;">#${ticketId.slice(0, 8)}</div>
                        </td>
                        <td width="50%" style="padding-bottom:12px;">
                          <div style="color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;">Categoria</div>
                          <div style="color:#00204a;font-weight:bold;">${categoryLabels[category] ?? category}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div style="color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;">Descrição</div>
                          <div style="color:#333;font-size:14px;line-height:1.5;">${description}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${appUrl}/guide/tickets"
                   style="background:#00204a;color:#ffffff;padding:12px 28px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">
                  Acessar Painel do Guia →
                </a>
              </div>

              <p style="color:#888;font-size:12px;text-align:center;margin:0;">
                Por favor, atenda ao passageiro o mais breve possível.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;padding:16px 32px;border-top:1px solid #e0e0e0;">
              <p style="color:#aaa;font-size:11px;margin:0;text-align:center;">
                Koglin Viagens · Sistema de Gerenciamento de Grupos<br>
                Esta mensagem foi gerada automaticamente pelo sistema Kogi.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Koglin Viagens <noreply@koglinviagens.com.br>',
    to,
    subject: `🔔 Novo Ticket #${ticketId.slice(0, 8)} — ${categoryLabels[category]} | ${passengerName}`,
    html,
  })
}
