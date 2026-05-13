CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.configuracoes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_loja           TEXT NOT NULL DEFAULT 'Minha Loja',
  whatsapp_contato    TEXT NOT NULL DEFAULT '5511999999999',
  link_instagram      TEXT DEFAULT '',
  link_facebook       TEXT DEFAULT '',
  descricao_loja      TEXT DEFAULT '',
  cor_primaria        TEXT DEFAULT '#16a34a',
  logo_url            TEXT DEFAULT '',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.configuracoes (nome_loja, whatsapp_contato, link_instagram, descricao_loja)
VALUES (
  'Minha Loja',
  '5511999999999',
  'https://instagram.com/minhaloja',
  'Os melhores produtos com os melhores preços!'
)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.categorias (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  ordem       INT DEFAULT 0,
  ativo       BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.categorias (nome, slug, ordem) VALUES
  ('Destaques',    'destaques',    1),
  ('Promoções',    'promocoes',    2),
  ('Novidades',    'novidades',    3)
ON CONFLICT (slug) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.produtos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          TEXT NOT NULL,
  descricao     TEXT DEFAULT '',
  preco         NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  preco_antigo  NUMERIC(10, 2) DEFAULT NULL,
  imagem_url    TEXT DEFAULT '',
  categoria_id  UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  disponivel    BOOLEAN DEFAULT TRUE,
  destaque      BOOLEAN DEFAULT FALSE,
  estoque       INT DEFAULT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.produtos (nome, descricao, preco, preco_antigo, imagem_url, categoria_id, disponivel, destaque)
SELECT
  'Produto Exemplo 1',
  'Descrição detalhada do produto. Qualidade garantida.',
  49.90,
  69.90,
  'https://placehold.co/400x400/e2e8f0/64748b?text=Produto+1',
  id,
  TRUE,
  TRUE
FROM public.categorias WHERE slug = 'destaques' LIMIT 1;

INSERT INTO public.produtos (nome, descricao, preco, imagem_url, categoria_id, disponivel, destaque)
SELECT
  'Produto Exemplo 2',
  'Outro produto incrível disponível na nossa loja.',
  29.90,
  'https://placehold.co/400x400/e2e8f0/64748b?text=Produto+2',
  id,
  TRUE,
  FALSE
FROM public.categorias WHERE slug = 'promocoes' LIMIT 1;

INSERT INTO public.produtos (nome, descricao, preco, imagem_url, categoria_id, disponivel, destaque)
SELECT
  'Produto Exemplo 3',
  'Acabou de chegar! Aproveite enquanto tem estoque.',
  89.90,
  'https://placehold.co/400x400/e2e8f0/64748b?text=Produto+3',
  id,
  TRUE,
  TRUE
FROM public.categorias WHERE slug = 'novidades' LIMIT 1;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_configuracoes_updated
  BEFORE UPDATE ON public.configuracoes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_categorias_updated
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_produtos_updated
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_configuracoes"
  ON public.configuracoes FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "leitura_publica_categorias"
  ON public.categorias FOR SELECT
  TO anon, authenticated
  USING (ativo = TRUE);

CREATE POLICY "leitura_publica_produtos"
  ON public.produtos FOR SELECT
  TO anon, authenticated
  USING (disponivel = TRUE);

CREATE POLICY "admin_full_configuracoes"
  ON public.configuracoes FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "admin_full_categorias"
  ON public.categorias FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "admin_full_produtos"
  ON public.produtos FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', TRUE)
ON CONFLICT DO NOTHING;

CREATE POLICY "imagens_publicas"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'produtos');

CREATE POLICY "admin_upload_imagens"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'produtos');

CREATE POLICY "admin_update_imagens"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'produtos');

CREATE POLICY "admin_delete_imagens"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'produtos');

CREATE OR REPLACE VIEW public.produtos_com_categoria AS
  SELECT
    p.*,
    c.nome AS categoria_nome,
    c.slug AS categoria_slug
  FROM public.produtos p
  LEFT JOIN public.categorias c ON p.categoria_id = c.id;

