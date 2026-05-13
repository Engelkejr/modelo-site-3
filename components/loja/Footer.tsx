import { Instagram, Facebook, MessageCircle, Store } from 'lucide-react'
import { Configuracao } from '@/lib/types'

interface FooterProps {
  config: Configuracao
}

export default function Footer({ config }: FooterProps) {
  const whatsappUrl = `https://wa.me/${config.whatsapp_contato.replace(/\D/g, '')}`

  return (
    <footer className="bg-gray-900 text-gray-300 mt-8">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                {config.nome_loja}
              </span>
            </div>
            {config.descricao_loja && (
              <p className="text-sm text-gray-400 max-w-xs">{config.descricao_loja}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-green-600 hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} className="text-white" />
            </a>

            {config.link_instagram && (
              <a
                href={config.link_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-600 hover:bg-pink-500 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-white" />
              </a>
            )}

            {config.link_facebook && (
              <a
                href={config.link_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-white" />
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {config.nome_loja}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
