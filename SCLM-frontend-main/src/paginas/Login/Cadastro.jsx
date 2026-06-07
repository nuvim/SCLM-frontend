import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import toast from 'react-hot-toast';
import { auth } from '../../servicos/api';
import './Login.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navegar = useNavigate();

  const tratarSubmit = async (e) => {
    e.preventDefault();
    if (!nome) { toast('Nome obrigatório', { icon: '⚠️' }); return; }
    if (!email) { toast('Email obrigatório', { icon: '⚠️' }); return; }
    if (!email.includes('@')) { toast.error('Email inválido'); return; }
    if (!senha) { toast('Senha obrigatória', { icon: '⚠️' }); return; }
    if (senha !== confirmarSenha) { toast('As senhas não coincidem', { icon: '⚠️' }); return; }

    setCarregando(true);
    try {
      await auth.cadastro(nome, email, senha);
      toast.success('Cadastro realizado com sucesso!');
      navegar('/login');
    } catch (erro) {
      toast.error(erro.message || 'Erro ao cadastrar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <BotaoTema flutuante={true} />

      <div className="login-card login-card-invertido">
        <div className="login-decorativo">
          <h1>Bem-vindo de Volta!</h1>
          <p>Já tem uma conta?</p>
          <button className="btn-secundario" onClick={() => navegar('/login')}>Entrar na Conta</button>
        </div>

        <div className="login-form-container">
          <form className="login-form" onSubmit={tratarSubmit}>
            <h2>Registra-se</h2>

            <div className="form-grupo">
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="material-icons-outlined">account_circle</span>
            </div>

            <div className="form-grupo">
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <span className="material-icons">lock_outline</span>
            </div>

            <div className="form-grupo">
              <input
                type="password"
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
