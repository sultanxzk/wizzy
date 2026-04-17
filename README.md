# ✦ Quiz Helper (sem servidor)

Detecta questões em qualquer site de quiz e usa IA (Claude) para mostrar a resposta correta com explicação.

> **Não precisa de servidor local.** A chamada vai direto da API pelo seu navegador.  
> **Sua key fica apenas no seu navegador** (localStorage) — nunca é enviada a ninguém além da Anthropic.

---

## Arquivos

```
quiz-helper/
├── bookmarklet.js       ← Código-fonte (legível)
├── bookmarklet.min.txt  ← Bookmarklet pronto para instalar
└── README.md
```

---

## 1. Obter uma API Key

Acesse: https://console.anthropic.com/settings/keys  
Crie uma key (começa com `sk-ant-…`).

---

## 2. Instalar o bookmarklet

1. Abra `bookmarklet.min.txt` e copie **todo** o conteúdo
2. No Chrome/Edge: `Ctrl+Shift+B` para abrir a barra de favoritos
3. Clique com botão direito → **Adicionar página...**
4. Nome: `Quiz Helper`
5. URL: cole o conteúdo copiado
6. **Salvar**

---

## 3. Usar pela primeira vez

1. Acesse um site com questões (Quizizz, Khan Academy, Google Forms…)
2. Clique no favorito **Quiz Helper**
3. O painel pede sua API key — informe uma vez, fica salva no navegador
4. Clique em **✦ Analisar questão**

Para trocar a key depois: clique em **⚙ Configurar API key** no rodapé do painel.

---

## Compatibilidade

| Site | Suporte |
|------|---------|
| Quizizz | ✓ |
| Khan Academy | ✓ |
| Google Forms | ✓ |
| Kahoot | ✓ |
| Duolingo | ✓ |
| Coursera | ✓ |
| Qualquer site | ✓ fallback genérico |

---

## Segurança

- A key é salva em `localStorage` sob a chave `qh_anthropic_key`
- Ela é enviada **diretamente** ao endpoint `api.anthropic.com` — sem proxy, sem intermediários
- Nenhum servidor seu é necessário; qualquer pessoa pode usar com a própria key
