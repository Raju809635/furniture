export function buildWhatsAppLink(phoneE164: string, message: string) {
  const cleaned = phoneE164.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

