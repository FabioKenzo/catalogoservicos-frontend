import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  //controla se o menu mobile está aberto
  menuAberto: boolean = false;

  //funcão que abre/fecha o menu mobile
  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  //verifica se tem usuário na sessao
  estaLogado(): boolean {
    return localStorage.getItem('usuarioLogado') !== null;
  }

  //retorna o primeiro nome real do user sem quebrar com o e-mail
  getNomeUsuario(): string {
    const usuarioJson = localStorage.getItem('usuarioLogado');
    if (usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);

        //se o nome vier preenchido do java pega o primeiro nome
        if (usuario && usuario.nome) {
          return usuario.nome.split(' ')[0];
        }

        if (usuario && usuario.email) {
          return usuario.email.split('@')[0];
        }
      } catch (e) {
        console.error('Erro ao ler o nome do usuário no localStorage:', e);
      }
    }
    return 'Usuário';
  }

  //limpa o user e tambem o token JWT na hora de sair
  logout(): void {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token'); // 🔒 Remove o token para segurança do JWT
    window.location.href = '/';
  }

  //valida de forma segura o tipo de perfil que veio do java
  isPrestador(): boolean {
  const usuarioJson = localStorage.getItem('usuarioLogado');
  if (usuarioJson) {
    try {
      const usuario = JSON.parse(usuarioJson);
      //retorna true APENAS se o tipoPerfil for 'PRESTADOR'
      return usuario && usuario.tipoPerfil === 'PRESTADOR';
    } catch (e) {
      return false;
    }
  }
  return false;
}
}