import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import '../Login/Login.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const navegar = useNavigate();

  const tratarSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    
    // >>> BACKEND: trocar por POST /api/auth/cadastro <<<
    setTimeout(() => {
      setCarregando(false);
      navegar('/login');
    }, 1000);
  };

  return (
    <div className="login-container">
      <BotaoTema flutuante={true} />

      <div className="login-card">
        {/* lado esquerdo decorativo agora eh Login */}
        <div className="login-decorativo">
          <h1>Já tem uma conta?</h1>
          <p>Acesse a sua conta agora</p>
          <button className="btn-secundario" onClick={() => navegar('/login')}>Faça Login</button>
        </div>

        {/* lado direito com formulario */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={tratarSubmit}>
            <h2>Cadastre-se</h2>
            
            <div className="form-grupo">
              <input 
                type="text" 
                id="nome" 
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <span className="material-icons">badge</span>
            </div>

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

            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
