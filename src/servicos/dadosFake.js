// dados fake de musicas
export const musicasFake = [
  {
    id: 1,
    nome: "Música Exemplo 1",
    artista: "Artista 1",
    genero: "Pop",
    url: "https://youtube.com/watch?v=123",
    dataCriacao: "2025-01-15"
  },
  {
    id: 2,
    nome: "Música Exemplo 2",
    artista: "Artista 2",
    genero: "Rock",
    url: "https://youtube.com/watch?v=456",
    dataCriacao: "2025-01-16"
  }
];

// dados fake de links
export const linksFake = [
  {
    id: 1,
    titulo: "Link de Referência 1",
    url: "https://exemplo.com/1",
    categoria: "Design",
    dataCriacao: "2025-02-20"
  },
  {
    id: 2,
    titulo: "Documentação",
    url: "https://exemplo.com/docs",
    categoria: "Estudo",
    dataCriacao: "2025-02-21"
  }
];

// dados fake do dashboard
export const estatisticasFake = {
  tempo: "12d:04h:30m:15s",
  total: 42,
  downloads: 15
};

// dados fake do usuario
export const usuarioFake = {
  id: 1,
  nome: "Gusttavo",
  email: "gusttavo@email.com"
};

// chamada de api para listar musicas
export function buscarMusicas() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...musicasFake]);
    }, 500); // simula delay de api
  });
}

// chamada de api para listar links
export function buscarLinks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...linksFake]);
    }, 500);
  });
}

// chamada de api para estatisticas
export function buscarEstatisticas() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(estatisticasFake);
    }, 500);
  });
}

// dados fake de graficos
export const dadosArtistaFake = [
  { label: 'Artista A', porcentagem: 75 },
  { label: 'Artista B', porcentagem: 25 }
];

export const dadosGeneroFake = [
  { label: 'Genero A', porcentagem: 25 },
  { label: 'Genero B', porcentagem: 50 },
  { label: 'Genero C', porcentagem: 25 }
];

// chamada de api para grafico de artistas
export function buscarDadosArtista() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...dadosArtistaFake]);
    }, 500);
  });
}

// chamada de api para grafico de generos
export function buscarDadosGenero() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...dadosGeneroFake]);
    }, 500);
  });
}
