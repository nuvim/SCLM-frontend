import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import '../Login/Login.css';

export default function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navegar = useNavigate();

  const tratarSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    // >>> BACKEND: trocar por POST /api/auth/esqueceu-senha <
    setTimeout(() => {
      setCarregando(false);
      navegar('/login');
    }, 1000);
  };

  return (
    <div className="login-container">
      <BotaoTema flutuante={true} />

      <div className="login-card">
        {/* lado esquerdo decorativo */}
        <div className="login-decorativo">
        </div>

        {/* lado direito com formulario */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={tratarSubmit}>
            <h2>
              <span className="material-icons" onClick={() => navegar('/login')} style={{ cursor: 'pointer', verticalAlign: 'middle', marginRight: '8px' }}>arrow_back</span>
              Trocar de senha
            </h2>

            <div className="form-grupo">
              <input
                type="text"
                id="email"
                placeholder="Email ou Usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="material-icons-outlined">account_circle</span>
            </div>

            <button type="submit" className="btn-primario" disabled={carregando}>
              {carregando ? 'Alterando...' : 'Alterar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}