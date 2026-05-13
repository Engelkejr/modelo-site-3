import { ItemCarrinho } from './types'

export function formatarPreco(preco: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco)
}

export function gerarMensagemWhatsApp(
  itens: ItemCarrinho[],
  nomeLoja: string
): string {
  const linhas = itens.map((item) => {
    const subtotal = item.produto.preco * item.quantidade
    return `▪ ${item.produto.nome} x${item.quantidade} — ${formatarPreco(subtotal)}`
  })

  const total = itens.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  )

  const mensagem = [
    `🛒 *Pedido - ${nomeLoja}*`,
    '',
    ...linhas,
    '',
    `━━━━━━━━━━━━━━━━`,
    `*Total: ${formatarPreco(total)}*`,
    '',
    'Gostaria de finalizar este pedido. Pode confirmar a disponibilidade?',
  ].join('\n')

  return encodeURIComponent(mensagem)
}

export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
