export interface Configuracao {
  id: string
  nome_loja: string
  whatsapp_contato: string
  link_instagram: string
  link_facebook: string
  descricao_loja: string
  cor_primaria: string
  logo_url: string
  created_at: string
  updated_at: string
}

export interface Categoria {
  id: string
  nome: string
  slug: string
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  preco_antigo: number | null
  imagem_url: string
  categoria_id: string | null
  disponivel: boolean
  destaque: boolean
  estoque: number | null
  created_at: string
  updated_at: string
  categoria_nome?: string
  categoria_slug?: string
}

export interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

export interface CarrinhoState {
  itens: ItemCarrinho[]
  total: number
  quantidade: number
}
