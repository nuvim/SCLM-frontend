CREATE DATABASE IF NOT EXISTS musica_site;
USE musica_site;

CREATE TABLE usuario (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(150) NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_user)
);

CREATE TABLE link (
    id_link INT AUTO_INCREMENT PRIMARY KEY,
    titulo_link VARCHAR(150),
    url VARCHAR(255) NOT NULL,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    observacao VARCHAR(500)
);

CREATE TABLE usuario_link (
    id_usuario INT NOT NULL,
    id_link INT NOT NULL,
    PRIMARY KEY (id_usuario, id_link),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_user),
    FOREIGN KEY (id_link) REFERENCES link(id_link)
);

CREATE TABLE artista (
    id_artista INT AUTO_INCREMENT PRIMARY KEY,
    nome_artista VARCHAR(150) NOT NULL
);

CREATE TABLE genero (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nome_genero VARCHAR(150) NOT NULL
);

CREATE TABLE musica (
    id_musica INT AUTO_INCREMENT PRIMARY KEY,
    titulo_musica VARCHAR(150) NOT NULL,
    url VARCHAR(255),
    tempo_musica VARCHAR(10),
    id_genero INT,
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero),
    baixar BOOLEAN DEFAULT FALSE,
    observacao VARCHAR(500)
);

CREATE TABLE artista_musica (
    id_artista INT NOT NULL,
    id_musica INT NOT NULL,
    PRIMARY KEY (id_artista, id_musica),
    FOREIGN KEY (id_artista) REFERENCES artista(id_artista),
    FOREIGN KEY (id_musica) REFERENCES musica(id_musica)
);

CREATE TABLE usuario_musica (
    id_usuario INT NOT NULL,
    id_musica INT NOT NULL,
    PRIMARY KEY (id_usuario, id_musica),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_user),
    FOREIGN KEY (id_musica) REFERENCES musica(id_musica)
);
