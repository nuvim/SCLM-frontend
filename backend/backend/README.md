- Node.js 18+
- Docker Desktop instalado e funcionando

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.exemplo .env
```

### 3. Subir o MySQL com Docker
```bash
docker compose up -d
```

### 4. Iniciar o servidor
```bash
npm run dev
```
