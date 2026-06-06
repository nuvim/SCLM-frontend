import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BotaoTema from '../../componentes/BotaoTema/BotaoTema';
import '../Login/Login.css';

export default function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const navegar = useNavigate();

  const tratarSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast('Email obrigatório', { icon: '⚠️' }); return; }
    if (!novaSenha) { toast('Nova senha obrigatória', { icon: '⚠️' }); return; }
    if (novaSenha !== confirmarSenha) { toast('As senhas não coincidem', { icon: '⚠️' }); return; }
    setCarregando(true);

    // >>> BACKEND: trocar por POST /api/auth/esqueceu-senha <
    setTimeout(() => {
      setCarregando(false);
      toast.success('Senha alterada com sucesso');
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
              />
              <span className="material-icons-outlined">account_circle</span>
            </div>

            <div className="form-grupo">
              <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <span className="material-icons">lock_outline</span>
            </div>

            <div className="form-grupo">
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <span className="material-icons">lock_outline</span>
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