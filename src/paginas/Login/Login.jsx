import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoAutenticacao } from '../../contextos/ContextoAutenticacao';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { fazerLogin } = useContext(ContextoAutenticacao);
  const navegar = useNavigate();

  // lida com o envio do formulario
  const tratarSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    // >>> BACKEND: trocar por POST /api/auth/login <<<
    const sucesso = await fazerLogin(email, senha);

    setCarregando(false);
    if (sucesso) { 
      navegar('/musicas');
    }
  };

  return (
    <div className="login-container">
      <BotaoTema flutuante={true} />

      <div className="login-card">
        {/* lado esquerdo decorativo */}
        <div className="login-decorativo">
          <h1>Faça seu cadastro</h1>
          <p>Não tem conta?</p>
          <button className="btn-secundario" onClick={() => navegar('/cadastro')}>Cadastre-se</button>
        </div>

        {/* lado direito com formulario */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={tratarSubmit}>
            <h2>Login</h2>

            <div className="form-grupo">
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="material-icons">account_circle</span>
            </div>

            <div className="form-grupo">
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
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
