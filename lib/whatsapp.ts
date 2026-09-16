export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "")
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

export function buildOrderMessage(orderNumber: string, items: { name: string; quantity: number; price: number }[], total: number, customerName: string): string {
  const roundPrice = (p: number) => Math.round(p)
  const lines = [
    `*New Order — ${orderNumber}*`,
    `Customer: ${customerName}`,
    "",
    "*Items:*",
    ...items.map((i) => `  ${i.quantity}x ${i.name} — €${roundPrice(i.price * i.quantity).toLocaleString()}`),
    "",
    `*Total: €${roundPrice(total).toLocaleString()}*`,
    "",
    "Please confirm this order and arrange payment.",
  ]
  return lines.join("\n")
}
