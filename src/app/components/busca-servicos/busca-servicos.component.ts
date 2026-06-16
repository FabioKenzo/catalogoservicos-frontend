import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-busca-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-servicos.component.html',
  styleUrl: './busca-servicos.component.css'
})
export class BuscaServicosComponent {

  termoBusca: string = '';
  bairroBusca: string = '';

  prestadores: any[] = [];
  pesquisaFeita: boolean = false;

  constructor(private apiService: ApiService) {}

  pesquisar(): void {
    // Fecha o teclado virtual do celular imediatamente
    (document.activeElement as HTMLElement)?.blur();

    // Limpa os espaços invisíveis das pontas que o iOS gera
    const termoLimpo = this.termoBusca ? this.termoBusca.trim() : '';
    const bairroLimpo = this.bairroBusca ? this.bairroBusca.trim() : '';

    // Dispara a requisição limpa para o Back-end
    this.apiService.buscarServicos(termoLimpo, bairroLimpo).subscribe({
      next: (dados: any[]) => { 
        this.prestadores = dados;
        this.pesquisaFeita = true;
        console.log('Resultados encontrados no Java:', dados);
      },
      error: (err: any) => {
        console.error('Erro ao conectar com o servidor backend:', err);
      }
    });
  }
}
