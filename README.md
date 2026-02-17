# 🚀 Example App — Template Base Laravel + React + Vite

<div align="center">
    
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Laravel](https://img.shields.io/badge/Laravel-12.x-ff2d20.svg)

</div>

Este é um **projeto base** para inicializar rapidamente novas aplicações **full stack** usando **Laravel 11 + React + Vite**.  
Inclui autenticação via **Laravel Breeze**, configuração otimizada do Vite e estrutura de pastas limpa para desenvolvimento moderno.

---

## 🧩 Tecnologias principais

- **Laravel 12**
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Laravel Breeze (auth + scaffolding)**

---

## 🛠️ Estrutura do projeto
example-app/
├── backend/ (Laravel)
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── …
├── frontend/ (React + Vite)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── …
└── package.json

---

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/example-app.git
cd example-app
```

### 2. Instale as dependências do Laravel

```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 3. Configure o banco de dados no .env

Atualize as credenciais conforme seu ambiente local.

### 4. Rode as migrations

```bash
php artisan migrate
```

### 5. Instale as dependências do front-end

```bash
npm install
npm run dev
```

### 6. Inicie o servidor Laravel

```bash
php artisan serve
```

🔐 Autenticação pronta (Breeze)

O projeto vem com Laravel Breeze (React) configurado, com rotas de login, registro e recuperação de senha totalmente funcionais.

🌐 Build de produção

Para gerar os arquivos otimizados:

```bash
npm run build
php artisan serve
```

Os assets serão compilados pelo Vite e servidos automaticamente.

⸻

🧠 Personalização

Este template foi feito para ser o ponto de partida de novos projetos.
Sinta-se livre para:
	•	Adicionar componentes e hooks reutilizáveis;
	•	Integrar API REST ou WebSockets;
	•	Configurar Docker, Sail ou CI/CD conforme necessidade.

📄 Licença

Este projeto é distribuído sob a licença MIT — uso livre para fins pessoais e comerciais.

💡 Criado por Vinicius Chagas como template de inicialização para novos projetos Laravel + React.
# SystemStock2.0
