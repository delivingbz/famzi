// Sends approved WhatsApp utility templates for opted-in order status updates.
type OrderStatusUpdate = {
  phone: string;
  customerName: string;
  orderId: string;
  status: string;
  optedIn: boolean;
};

function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

export async function sendOrderStatusWhatsAppUpdate(update: OrderStatusUpdate) {
  if (!update.optedIn) {
    return { status: "not_opted_in", message: "Customer did not opt in to WhatsApp updates." };
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_ORDER_STATUS_TEMPLATE;
  const apiVersion = process.env.WHATSAPP_API_VERSION;
  if (!accessToken || !phoneNumberId || !templateName || !apiVersion) {
    return { status: "not_configured", message: "WhatsApp API credentials and an approved update template are not configured yet." };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toWhatsAppNumber(update.phone),
        type: "template",
        template: {
          name: templateName,
          language: { code: process.env.WHATSAPP_ORDER_STATUS_LANGUAGE || "en" },
          components: [{
            type: "body",
            parameters: [
              { type: "text", text: update.customerName },
              { type: "text", text: update.orderId },
              { type: "text", text: update.status },
            ],
          }],
        },
      }),
    });

    if (!response.ok) {
      const providerError = await response.json().catch(() => null);
      console.error("WhatsApp status update rejected:", providerError);
      return { status: "failed", message: "WhatsApp could not send this update. Check the API credentials and approved template." };
    }

    return { status: "sent", message: "WhatsApp update sent." };
  } catch (error) {
    console.error("WhatsApp status update failed:", error);
    return { status: "failed", message: "WhatsApp could not send this update. Check the server connection and try again." };
  }
}
