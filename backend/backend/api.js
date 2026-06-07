//  pra todas as chamadas ao backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


function getToken() {
  return localStorage.getItem('token');
}

async function requisicao(endpoint, opcoes = {}) {
  const token = getToken();

  const resposta = await fetch(`${BASE_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro na requisição.');
  }

  return dados;
}


export const auth = {
  login: (email, senha) =>
    requisicao('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  cadastro: (nome, email, senha) =>
    requisicao('/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    }),

  esqueceuSenha: (email) =>
    requisicao('/auth/esqueceu-senha', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetarSenha: (token, novaSenha) =>
    requisicao('/auth/resetar-senha', {
      method: 'POST',
      body: JSON.stringify({ token, novaSenha }),
    }),
};


export const dashboard = {
  obterEstatisticas: () => requisicao('/dashboard'),
};


export const musicas = {
  listar: () => requisicao('/musicas'),

  criar: (dados) =>
    requisicao('/musicas', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    requisicao(`/musicas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  deletar: (id) =>
    requisicao(`/musicas/${id}`, { method: 'DELETE' }),
};


export const links = {
  listar: () => requisicao('/links'),

  criar: (dados) =>
    requisicao('/links', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    requisicao(`/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  deletar: (id) =>
    requisicao(`/links/${id}`, { method: 'DELETE' }),
};
