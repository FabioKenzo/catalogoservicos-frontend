import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, UsuarioDTO } from '../../services/api.service'; 
import { Router } from '@angular/router';

//interface para cadastro
interface UsuarioCadastro {
  nome: string;
  email: string;
  senha: string;
  tipoPerfil: string;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  //controla a exibicao do overlay de loading na tela
  carregando: boolean = false;

  usuario: UsuarioCadastro = {
    nome: '',
    email: '',
    senha: '',
    tipoPerfil: ''
  };

  constructor(private apiService: ApiService, private router: Router) {}

  cadastrar(): void {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha || !this.usuario.tipoPerfil) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    //liga o loading para travar a tela enquanto o java responde
    this.carregando = true;
    console.log('Tentando cadastrar usuário...');

    //envia UsuarioCadastro e recebe UsuarioDTO
    this.apiService.cadastrarUsuario(this.usuario).subscribe({
      next: (resposta: UsuarioDTO) => {
        this.carregando = false;
        console.log('Usuário cadastrado com sucesso no banco!', resposta);
        
        //alerta informando o sucesso
        alert('Conta criada com sucesso! Por favor, faça o seu login para acessar o sistema.');

        //limpa sessoes antigas por seguranca e joga para o login
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.carregando = false;
        console.error('Erro ao cadastrar no Java:', err);
        alert('Erro ao cadastrar: ' + (err.error || 'Verifique se os dados estão corretos ou se o e-mail já está cadastrado.'));
      }
    });
  }
}
