// FAMZI FILE GUIDE: Server-only Resend configuration and transactional email delivery.
import "server-only";

export function getAdminEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ADMIN_EMAIL_FROM || process.env.ADMIN_RESET_EMAIL_FROM;
  const appUrl = process.env.APP_URL;
  if (!apiKey || !from || !appUrl) return undefined;
  let origin: URL;
  try { origin = new URL(appUrl); } catch { return undefined; }
  if (origin.protocol !== "https:" && origin.protocol !== "http:") return undefined;
  return { apiKey, from, origin };
}

export async function sendAdminEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const config = getAdminEmailConfig();
  if (!config) return { ok: false, error: "Email settings are missing or invalid." };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: config.from, to: [to], subject, html }),
    });
    if (response.ok) return { ok: true };
    let providerMessage = "Resend rejected the email request.";
    try {
      const body: unknown = await response.json();
      if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
        providerMessage = body.message.replace(/[\r\n\t]/g, " ").slice(0, 240);
      }
    } catch { /* Keep the generic provider error when the response is not JSON. */ }
    console.error(`Resend email request failed with HTTP ${response.status}: ${providerMessage}`);
    return { ok: false, error: `Resend returned HTTP ${response.status}: ${providerMessage}` };
  } catch {
    console.error("Could not connect to the Resend email API.");
    return { ok: false, error: "The app could not connect to Resend. Check network access and try again." };
  }
}
