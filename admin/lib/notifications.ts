type InquiryNotice = {
  orderNumber?: unknown;
  customer?: unknown;
  email?: unknown;
  phone?: unknown;
  shippingAddress?: unknown;
  inquiry?: unknown;
  inquiryType?: unknown;
  source?: unknown;
  landingPageTitle?: unknown;
};

export async function notifyNewInquiry<T extends object>(record: T) {
  const inquiry = record as InquiryNotice;
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) return false;

  const text = [
    `New Hide n Hype enquiry: ${String(inquiry.orderNumber ?? "")}`,
    `Name: ${String(inquiry.customer ?? "")}`,
    `Email: ${String(inquiry.email ?? "")}`,
    `Phone: ${String(inquiry.phone ?? "")}`,
    `Address: ${String(inquiry.shippingAddress ?? "")}`,
    `Type: ${String(inquiry.inquiryType ?? "Product enquiry")}`,
    `Source: ${String(inquiry.source ?? "website")}`,
    inquiry.landingPageTitle ? `Landing page: ${String(inquiry.landingPageTitle)}` : "",
    `Message: ${String(inquiry.inquiry ?? "")}`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: sender, to: [recipient], subject: `New enquiry ${String(inquiry.orderNumber ?? "")}`, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error("Could not send enquiry notification:", response.status);
    return response.ok;
  } catch (error) {
    console.error("Could not send enquiry notification:", error instanceof Error ? error.message : "unknown error");
    return false;
  }
}
