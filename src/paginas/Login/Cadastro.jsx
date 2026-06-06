import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import toast from 'react-hot-toast';
import { ContextoAutenticacao } from '../../contextos/ContextoAutenticacao';
import './Login.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const navegar = useNavigate();
  const { fazerLogin } = useContext(ContextoAutenticacao);
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const tratarSubmit = async (e) => {
    e.preventDefault();
    if (!nome) { toast('Nome obrigatório', { icon: '⚠️' }); return; }
    if (!email.includes('@gmail.com')) { toast.error('Email inválido'); return; }
    if (!email) { toast('Email obrigatório', { icon: '⚠️' }); return; }
    if (!senha) { toast('Senha obrigatório', { icon: '⚠️' }); return; }
    if (senha !== confirmarSenha) { toast('As senhas não coincidem', { icon: '⚠️' }); return; }
    setCarregando(true);
  // >>> BACKEND: trocar por POST /api/auth/cadastro <
  await fazerLogin();
  toast.success('Cadastro realizado com sucesso');
  setCarregando(false);
  navegar('/dashboard');
};

  return (
    <div className="login-container">
      <BotaoTema flutuante={true} />

      <div className="login-card login-card-invertido">
        {/* lado esquerdo decorativo agora eh Login */}
        <div className="login-decorativo">
          <h1>Bem-vindo de Volta!</h1>
          <p>Já tem uma conta?</p>
          <button className="btn-secundario" onClick={() => navegar('/login')}>Entrar na Conta</button>
        </div>

        {/* lado direito com formulario */}
       <div className="login-form-container">
          <form className="login-form" onSubmit={tratarSubmit}>
            <h2>Registra-se</h2>
            
            <div className="form-grupo">
              <input 
                type="text" 
                id="nome" 
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <input 
                type="text" 
                id="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="material-icons-outlined">account_circle</span>
            </div>

            <div className="form-grupo">
              <input 
                type="password" 
                id="senha" 
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <span className="material-icons">lock_outline</span>
            </div>

            <div className="form-grupo">
              <input 
                type="password" 
                id="confirmarSenha" 
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <span className="material-icons">lock_outline</span>
            </div>

            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
