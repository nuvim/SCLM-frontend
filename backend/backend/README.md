# Backend — Centralizador de Links e Músicas

Stack: **Node.js + Express + MySQL + Docker**

---

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.exemplo .env
# Edite o .env com suas senhas e configurações
```

### 3. Subir o MySQL com Docker
```bash
docker compose up -d
```
O banco já é criado automaticamente com todas as tabelas.

### 4. Iniciar o servidor
```bash
npm run dev   # desenvolvimento (com hot reload)
npm start     # produção
```

O servidor sobe em **http://localhost:3001**

---

## 📁 Estrutura

```
backend/
├── docker-compose.yml
├── .env.exemplo
├── package.json
├── api.js                  ← Copiar para src/servicos/ no frontend
└── src/
    ├── servidor.js         ← Entrada da aplicação
    ├── config/
    │   ├── banco.js        ← Conexão MySQL
    │   └── init.sql        ← Criação das tabelas
    ├── middlewares/
    │   └── autenticar.js   ← Verificação JWT
    ├── controladores/
    │   ├── authControlador.js
    │   ├── musicaControlador.js
    │   ├── linkControlador.js
    │   └── dashboardControlador.js
    └── rotas/
        ├── auth.js
        ├── musicas.js
        ├── links.js
        └── dashboard.js
```

---

## 🔌 Endpoints da API

### Auth (públicos)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/cadastro` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/auth/esqueceu-senha` | Solicitar reset de senha |
| POST | `/api/auth/resetar-senha` | Trocar senha com token |

### Músicas (requer token JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/musicas` | Listar músicas do usuário |
| POST | `/api/musicas` | Criar música |
| PUT | `/api/musicas/:id` | Editar música |
| DELETE | `/api/musicas/:id` | Deletar música |

### Links (requer token JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/links` | Listar links do usuário |
| POST | `/api/links` | Criar link |
| PUT | `/api/links/:id` | Editar link |
| DELETE | `/api/links/:id` | Deletar link |

### Dashboard (requer token JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/dashboard` | Estatísticas do usuário |

---

## 🔗 Conectando ao Frontend

1. Copie `api.js` para `frontend/src/servicos/api.js`
2. Crie um `.env` no frontend com:
```
VITE_API_URL=http://localhost:3001/api
```
3. Nos contextos (ContextoAutenticacao, etc.), substitua as chamadas do `dadosFake.js` pelas funções de `api.js`

**Exemplo no ContextoAutenticacao:**
```js
// >>> ANTES (dados fake) <<<
import { loginFake } from '../servicos/dadosFake';

// >>> DEPOIS (backend real) <<<
import { auth } from '../servicos/api';

// No login:
const { token, usuario } = await auth.login(email, senha);
localStorage.setItem('token', token);
```

---

## 📧 E-mail de reset de senha

Por enquanto o token aparece no console do servidor. Para envio real, instale `nodemailer` e substitua o comentário `// >>> BACKEND: trocar por <<<` em `authControlador.js`.
