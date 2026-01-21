# Release Notes

## v0.1.0 - Initial Release

**Release Date**: January 20, 2025

### 🎉 Features

- **Multi-Provider AI Chat**
  - Ollama (local, private AI)
  - OpenRouter (100+ models)
  - OpenAI (GPT-4, GPT-4o)
  - Anthropic (Claude)
  - Google Gemini

- **Split View Mode**
  - Chat with two AI models side-by-side
  - Drag and drop to rearrange chats
  - Maximize/minimize individual panes

- **Ollama Integration**
  - Automatic detection of Ollama installation
  - One-click model download (deepseek-r1:1.5b)
  - Model list fetched via `ollama list` command

- **Modern UI**
  - Dark/Light theme with system preference detection
  - Markdown rendering with syntax highlighting
  - Smooth animations and transitions
  - Responsive resizable panels

- **Settings & Customization**
  - Easy provider switching
  - API key management
  - Reset settings with confirmation dialog

### 📦 Downloads

| Platform | Architecture             | Download                      |
| -------- | ------------------------ | ----------------------------- |
| macOS    | Apple Silicon (M1/M2/M3) | `MOSP Chat_0.1.0_aarch64.dmg` |

### ⚠️ macOS Installation Note

Since this app is not notarized by Apple, you'll see a security warning on first launch. To open the app:

**Method 1: Right-click to Open**

1. Right-click (or Control-click) on MOSP Chat.app
2. Select "Open" from the context menu
3. Click "Open" in the security dialog

**Method 2: Terminal Command**

To bypass the security warning for the application:

```bash
xattr -cr /Applications/MOSP\ Chat.app
```

To bypass the security warning for the installer (DMG):

```bash
sudo xattr -cr 'MOSP Chat_0.1.0_aarch64.dmg'
```

**Method 3: System Settings**

1. Try to open the app (it will be blocked)
2. Open System Settings → Privacy & Security
3. Click "Open Anyway" next to the MOSP Chat message

### 🔧 Requirements

- **macOS**: 11.0 (Big Sur) or later
- **Ollama** (optional): For local AI - [Download here](https://ollama.com/download)

### 🐛 Known Issues

- Large model downloads may cause temporary UI freeze (progress not shown during Ollama pull)
- Windows and Linux builds not yet available

### 📝 What's Next

- Windows and Linux support
- Chat export (Markdown, PDF)
- Custom system prompts
- Conversation search
- Model parameter tuning (temperature, top_p, etc.)

---

**Full Changelog**: Initial release

**Source Code**: [GitHub](https://github.com/your-username/mosp-chat)
