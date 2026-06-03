import twilio from 'twilio'

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendWhatsApp(to: string, body: string): Promise<void> {
  const from = process.env.TWILIO_WHATSAPP_NUMBER!

  // Ensure proper whatsapp: prefix
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

  await twilioClient.messages.create({ from, to: toFormatted, body })
}
