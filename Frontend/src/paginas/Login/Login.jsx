import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ContextoAutenticacao } from '../../contextos/ContextoAutenticacao';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { fazerLogin } = useContext(ContextoAutenticacao);
  const navegar = useNavigate();

  const tratarSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast('Email obrigatório', { icon: '⚠️' }); return; }
    if (!senha) { toast('Senha obrigatória', { icon: '⚠️' }); return; }

    setCarregando(true);
    try {
      await fazerLogin(email, senha);
      navegar('/musicas');
    } catch (erro) {
      toast.error(erro.message || 'Email ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <BotaoTema flutuante={true} />

      <div className="login-card">
        <div className="login-decorativo">
          <h1>Faça seu cadastro</h1>
          <p>Não tem conta?</p>
          <button className="btn-secundario" onClick={() => navegar('/cadastro')}>Cadastre-se</button>
        </div>

        <div className="login-form-container">
          <form className="login-form" onSubmit={tratarSubmit}>
            <h2>Login</h2>

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

            <div className="login-opcoes">
              <label className="checkbox-lembre">
                <input type="checkbox" />
                <span>Lembre de mim</span>
              </label>
              <a onClick={() => navegar('/esqueceu-senha')} className="link-esqueceu">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
