import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ServicoDTO } from '../../services/api.service';

@Component({
  selector: 'app-busca-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-servicos.component.html',
  styleUrls: ['./busca-servicos.component.css']
})
export class BuscaServicosComponent implements OnInit {

  termoBusca: string = '';
  bairroBusca: string = '';
  prestadores: ServicoDTO[] = [];
  tituloSecao: string = 'Prestadores em Destaque';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    //carrega os prestadores iniciais assim que a pagina abre
    this.carregarPrestadoresIniciais();
  }

  //metodo que o HTML chama para gerar o link do botao
  gerarLinkWhatsApp(whatsapp: string | undefined, nome: string | undefined, categoria: string | undefined): string {
    if (!whatsapp) return '#';

    //remove qualquer caractere que nao seja numero
    const numeroLimpo = whatsapp.replace(/\D/g, '');

    //garante que tenha o DDI do Brasil (55) na frente se o usuario nap digitar
    const telefoneFinal = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;

    const texto = `Olá ${nome || ''}, vi seu anúncio de ${categoria || 'serviços'} no Catálogo de Serviços e gostaria de solicitar um orçamento!`;

    //retorna a URL codificada para o WhatsApp web/app
    return `https://api.whatsapp.com/send?phone=${telefoneFinal}&text=${encodeURIComponent(texto)}`;
  }

  carregarPrestadoresIniciais(): void {
    this.apiService.buscarServicos('', '').subscribe({
      next: (dados: ServicoDTO[]) => {
        //garante e forca o limite maximo de 6 elementos na home
        this.prestadores = dados.slice(0, 6);
        this.tituloSecao = 'Prestadores em Destaque';
      },
      error:(err: any) => {
        console.error('Erro ao carregar destaques iniciais:', err);
      }
    });
  }

  pesquisar(): void {
    (document.activeElement as HTMLElement)?.blur();

    const termoLimpo = this.termoBusca ? this.termoBusca.trim() : '';
    const bairroLimpo = this.bairroBusca ? this.bairroBusca.trim() : '';

    if (!termoLimpo && !bairroLimpo) {
      this.carregarPrestadoresIniciais();
      return;
    }

    this.apiService.buscarServicos(termoLimpo, bairroLimpo).subscribe({
      next: (dados: ServicoDTO[]) => {
        //quando o user fizer uma busca traz todos os resultados encontrados
        this.prestadores = dados;
        this.tituloSecao = 'Profissionais Encontrados';

        dados.forEach(servico => {
          if (servico.usuario) {
            console.log(`Prestador: ${servico.usuario.nome}`);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao conectar com o servidor backend:', err);
      }
    });
  }
}
