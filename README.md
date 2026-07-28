# ⚡ Pokémon TCG — Central de Cartas & Batalha vs IA

App completo em **um único HTML** (`index.html`), sem build, sem dependências instaladas. Feito por Paulo Henrique + Claude (Claude Code).

## 🔗 Links do projeto

| O quê | Onde |
|---|---|
| **App no ar** (celular/PC) | https://paulocrestan-png.github.io/pokemon-tcg/ |
| **Loja online** (login + reserva) | https://paulocrestan-png.github.io/loja-pokemon/ |
| Repositório da loja | github.com/paulocrestan-png/loja-pokemon |
| Painel Supabase (dados da loja) | https://supabase.com/dashboard/project/iirvdizzaynnjhhzzhrv |

⚠️ **Senhas e acessos** (admin da loja, clientes, banco): arquivo `LOJA_ACESSOS.txt` — **NÃO está neste repositório** (é público!). Está no PC de casa em `C:\Users\paulo\POKEMON_TCG\` — levar por WhatsApp/Drive.

## 🧩 Funcionalidades

- **🔍 Busca de cartas** com fallback de API: tenta `api.pokemontcg.io` → cai pra **TCGdex** (`api.tcgdex.net/v2/pt` — nomes/textos em PORTUGUÊS, fallback `en`). Cotação TCGPlayer/Cardmarket → R$ via AwesomeAPI.
- **📷 Identificação por foto**: câmera/upload + OCR (Tesseract.js via CDN) lê nome + número da carta.
- **📚 Coleção** + **🎯 Checklist de coleções oficiais** (123 sets PT, ex. "Fogo Fantasmagórico" = `me02`): marcar tenho/não tenho, progresso, raridades, valor estimado (tenho/faltando/completa), cadeado, copiar listas.
- **🃏 Decks**: editor 60 cartas, 188 Theme Decks oficiais (repo `PokemonTCG/pokemon-tcg-data`) com pesquisa, + 3 Baralhos Batalha de Liga modernos EMBUTIDOS (Charizard ex, Gardevoir ex, Miraidon ex+2 Raikou V extra) com IDs TCGdex validados.
- **🏪 Minha Loja**: cartas à venda → `loja.html` estática OU **loja online ao vivo** (Supabase: tabelas `loja_items`/`loja_config`, RLS, RPCs `reservar_carta`/`cancelar_reserva`, realtime). Publicar = botão 🚀 no app. Setup: `SETUP_LOJA_ONLINE.md` + `supabase_setup.sql`.
- **⚔️ Batalha vs IA** — 2 modos:
  - **Físico**: IA joga com deck físico via instruções espelhadas na mesa.
  - **🎮 Treinamento digital** (tipo TCG Live): mesa visual dos 2 lados, mão clicável, regras automáticas (fraqueza ×2, resist −30, 1 energia/turno, 1 apoiador/turno, evolução por rodada, prêmios ex/V=2 VMAX=3, recuo, deck-out), zoom de carta em PT ao clicar.
- **🧠 Estratégia**: 📊 análise heurística de deck, 🧭 briefing de confronto automático, 💡 dicas do treinador por turno, e **🎓 Professor** (API Claude `claude-opus-5`, chave em localStorage, config na aba Ajuda) — coach profissional na batalha e análise de deck.
- **💾 Backup/Restaurar** (aba Ajuda) — dados são localStorage por aparelho.

## 🛠 Como desenvolver

1. Editar `index.html` (é o app inteiro — HTML+CSS+JS).
2. Testar abrindo no navegador (busca/preços precisam de internet).
3. Validar sintaxe: extrair o `<script>` e rodar `node --check`.
4. `git commit` + `git push` → GitHub Pages publica sozinho (~1 min).

## 🎓 Professor via Plano Max (FEITO ✅)

`PROFESSOR_MAX_SERVER.js` + `INICIAR_PROFESSOR_MAX.bat` — servidor local (porta **8092**, Node puro, zero deps) que roda o Claude Code em modo headless (`claude -p` via stdin), autenticado pela assinatura **Max** (paulocrestan@gmail.com) — sem chave de API, sem custo extra. O app tenta o servidor primeiro (URL configurável na aba Ajuda, padrão `http://localhost:8092`) e cai pra chave de API se indisponível.

**Setup no PC da empresa (24/7):**
1. Instalar Node e Claude Code (`npm i -g @anthropic-ai/claude-code`), rodar `claude` uma vez e logar com paulocrestan@gmail.com (plano Max).
2. `git clone` deste repositório → 2 cliques em `INICIAR_PROFESSOR_MAX.bat` (deixar aberto; pode agendar no Task Scheduler pra iniciar com o Windows).
3. No app (naquele PC): Ajuda → 🎓 Professor → URL `http://localhost:8092` → Testar conexão.
- Testado e funcionando em 26/07/2026 (resposta real de estratégia em ~segundos).
- Obs.: do celular não alcança o localhost do PC — no celular, usar a Opção B (chave de API) ou futuramente um túnel.

## 📌 Pendências / ideias

- [ ] Condições especiais na batalha (dormir/paralisar/queimar) automáticas.
- [ ] Habilidades (Abilities) dos Pokémon no modo treino.
- [ ] PWA offline completo (service worker + cache de imagens dos decks).
- [ ] Notificação ao Paulo quando cliente reserva carta (e-mail/WhatsApp via Supabase webhook).

## 🗂 Contexto extra

Histórico completo do desenvolvimento está na memória do Claude Code do PC de casa (`~/.claude/projects/.../memory/pokemon-tcg-app.md`). Decks salvos, coleção e checklist ficam no localStorage de cada aparelho — usar 💾 Backup pra migrar.
