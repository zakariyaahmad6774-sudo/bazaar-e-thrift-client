export function buildWhatsAppLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(product) {
  return `Hi! I'm interested in ${product.name} (₹${product.price}, Size ${product.size}). Is it still available?`;
}
