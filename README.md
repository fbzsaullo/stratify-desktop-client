# stratify-desktop-client

Aplicativo desktop do Stratify — Cross-platform (Ubuntu Linux + Windows).
Construído com **Tauri (Rust)** + **React/TypeScript**.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 18 + TypeScript |
| Desktop Shell | Tauri 2 (Rust) |
| State | Zustand |
| Charts | Recharts |
| API Client | TanStack Query + axios |
| Styling | Tailwind CSS |

## Funcionalidades

- **Player Dashboard**: Skill Radar, histórico de partidas, feedbacks
- **Demo Analyzer**: Drag & drop de arquivo `.dem` → análise automática
- **Live Overlay HUD**: HUD semitransparente durante partidas ativas
- **AI Voice Coach**: Motor de voz integrado para coaching por áudio em tempo real
- **Session Review**: Review de rounds com feedbacks anotados por tick

## 🚀 Guia de Início Rápido (Setup)

Siga estes passos para configurar o ambiente de desenvolvimento no **Ubuntu (Linux)**.

### 1. Dependências do Sistema
O Tauri exige bibliotecas de sistema para renderizar a interface e gerenciar a segurança.
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev libssl-dev curl build-essential
```

### 2. Instalar o Rust (Obrigatório para o Desktop)
O "corpo" do aplicativo é escrito em Rust. Sem ele, você não conseguirá rodar como app de janela.
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Após a instalação, ative o ambiente:
source $HOME/.cargo/env
```

### 3. Configurar o Node.js
Se você estiver usando a instalação local que configuramos no projeto:
```bash
# Adicione o Node local ao seu PATH temporário
export PATH="$PWD/.node/bin:$PATH"
```

### 4. Instalar Dependências do Projeto
```bash
npm install
```

### 5. Como Rodar

#### A. Apenas Interface (Navegador - Rápido)
Ideal para prototipar a UI sem precisar compilar o código Rust.
```bash
npm run dev
```
Acesse em: [http://localhost:1420](http://localhost:1420)

#### B. Aplicativo Desktop (Tauri)
Roda como um aplicativo nativo no seu sistema.
```bash
npm run tauri dev
```

### 📦 Como Gerar a Build (Produção)
Quando você terminar o desenvolvimento e quiser gerar o instalador para o usuário final:

#### 1. Gerar para Ubuntu (Linux)
Este comando criará pacotes `.deb` e `.AppImage`.
```bash
export PATH="$PWD/.node/bin:$PATH"
npm run tauri build
```
O instalador aparecerá em:
`stratify-desktop-client/src-tauri/target/release/bundle/`

#### 2. Gerar para Windows
Para gerar o `.msi` ou `.exe`, você deve rodar o comando em uma máquina Windows ou via CI (GitHub Actions).
```bash
npm run tauri build
```

---

## 🛠️ Solução de Problemas (FAQ)

**Erro: "Couldn't recognize the current folder as a Tauri project"**
> Isso acontece se os arquivos de configuração forem perdidos. Eu já corrigi isso, mas se voltar a acontecer, rode:
> `npx tauri init --force`

**Erro: "Port 1420 is already in use"**
> Significa que o processo do Vite ainda está rodando. Você pode matar o processo ou rodar em outra porta:
> `npm run dev -- --port 1421`

**Erro: "cargo: comando não encontrado"**
> O Rust não foi instalado ou o seu terminal não carregou as variáveis de ambiente. Rode `source $HOME/.cargo/env`.

## Estrutura

```
stratify-desktop-client/
├── src/                     # React frontend
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── MatchHistory/
│   │   ├── FeedbackCard/
│   │   └── Overlay/
│   ├── pages/
│   ├── stores/              # Zustand stores
│   └── api/                 # Core Backend API client
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands/        # Tauri commands expostos ao frontend
│   │   │   ├── demo_parser.rs
│   │   │   └── gsi_listener.rs
│   │   └── event_publisher.rs  # Publica eventos no Redis
│   └── tauri.conf.json
└── package.json
```

## Comunicação com o Core Backend

O cliente se comunica com o `stratify-core-backend` via REST API.
Em modo real-time, usa WebSocket (ActionCable) para receber feedbacks ao vivo.

```typescript
// src/api/feedbacks.ts
const feedbacks = await api.get(`/api/v1/players/${playerId}/feedbacks`);
```

## Overlay HUD

O overlay usa a flag `alwaysOnTop` do Tauri com uma janela transparente.
É ativado automaticamente quando o CS2 está em foco.

```rust
// src-tauri/src/commands/overlay.rs
#[tauri::command]
fn toggle_overlay(window: tauri::Window, visible: bool) {
    window.set_always_on_top(visible).unwrap();
    window.set_visible_on_all_workspaces(visible).unwrap();
}
```

## AI Voice Engine

O cliente utiliza uma camada de áudio para fornecer feedback por voz (TTS).
- **Configuração**: O jogador pode escolher entre vozes calmas ou agressivas (Roast Mode).
- **Latência**: Processamento assíncrono para garantir que o áudio não atrase a performance do jogo.
