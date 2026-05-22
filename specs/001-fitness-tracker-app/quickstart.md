# Quickstart: Acompanhamento Fitness

Este guia descreve os passos necessários para configurar as novas dependências do projeto e executar a aplicação Peaktime Frontend localmente.

---

## 📦 1. Instalar Novas Dependências

Para habilitar a estilização otimizada com o **Tamagui** e o armazenamento seguro local com o **Expo SecureStore**, execute os seguintes comandos no diretório raiz do projeto:

```bash
# Instalar os pacotes essenciais do Tamagui
npm install tamagui @tamagui/config @tamagui/lucide-icons

# Instalar o SecureStore oficial do Expo (compatível com a versão instalada do SDK 56)
npx expo install expo-secure-store
```

---

## ⚙️ 2. Configurar o Tamagui

Crie o arquivo de configuração `src/tamagui.config.ts` importando os tokens definidos em `src/constants/theme.ts`.

---

## 🚀 3. Executar o Projeto em Desenvolvimento

Inicie o servidor de desenvolvimento do Expo:

```bash
# Executa o Metro Bundler interativo
npx expo start
```

### Comandos úteis:
-   **Abrir no Android**: Pressione `a` (requer emulador aberto ou dispositivo conectado).
-   **Abrir no iOS**: Pressione `i` (requer Mac com Xcode e simulador de iOS configurado).
-   **Abrir na Web**: Pressione `w` (inicia a compilação web e abre o navegador).

---

## 🏗️ 4. Build e Produção

### Versão Web (Estática)
Para empacotar a versão Web otimizada para deploy em CDNs (como Vercel, Netlify):

```bash
npx expo export --platform web
```
Os arquivos gerados serão salvos no diretório `dist/` e podem ser servidos de forma 100% estática.

### Aplicativos Nativos (Android / iOS)
Para compilar os pacotes binários nativos (`.apk`/`.aab` ou `.ipa`) usando o EAS Build:

```bash
# Build de desenvolvimento (para testar em emuladores/dispositivos com suporte a logs)
eas build --profile development

# Build de produção (pronto para envio às lojas de aplicativo)
eas build --profile production
```
*(Certifique-se de estar autenticado com a conta Expo através do comando `eas login` antes de rodar os builds nativos)*.
