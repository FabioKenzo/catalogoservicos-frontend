import { Router, Routes } from '@angular/router';
import { BuscaServicosComponent } from './components/busca-servicos/busca-servicos.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { LoginComponent } from './components/login/login.component';
import { PainelPrestadorComponent } from './components/painel-prestador/painel-prestador.component';
import { inject } from '@angular/core';

export const routes: Routes = [
  { path: '', component: BuscaServicosComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'meu-servico',
    component: PainelPrestadorComponent,
    canActivate: [
      () => {
        const router = inject(Router);
        const usuarioJson = localStorage.getItem('usuarioLogado');

        if (usuarioJson) {
          const usuario = JSON.parse(usuarioJson);
          //se for PRESTADOR da passagem livre
          if (usuario && usuario.tipoPerfil === 'PRESTADOR') {
            return true;
          }
        }

        //se for CONSUMIDOR ou deslogado toma o bloqueio na hora!
        alert('Acesso negado! Apenas contas do tipo PRESTADOR podem gerenciar ou cadastrar serviços.');
        router.navigate(['/']); //joga de volta para a home
        return false;
      }
    ]
  }
];


