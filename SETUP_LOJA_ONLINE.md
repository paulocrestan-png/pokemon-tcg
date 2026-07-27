# 🌐 Loja Online AO VIVO — Passo a Passo (faz 1 vez só)

A loja viva usa: **Supabase** (banco de dados + login, grátis) + **GitHub Pages** (a página, grátis — igual o álbum da Copa).

## Passo 1 — Criar o projeto no Supabase (~5 min)

1. Acesse **https://supabase.com** → *Start your project* → entre com sua conta Google.
2. *New project* → nome: `loja-pokemon` → crie uma senha forte do banco (guarde) → região: *South America (São Paulo)* → *Create*.
3. Espere ~2 min o projeto ficar pronto.

## Passo 2 — Rodar o script do banco

1. No menu lateral: **SQL Editor** → *New query*.
2. Abra o arquivo **`supabase_setup.sql`** (está nesta mesma pasta), copie TUDO e cole lá.
3. Clique **Run**. Deve aparecer "Success".
   - ⚠️ O script já usa `paulocrestan@gmail.com` como admin. Se quiser outro e-mail de admin, troque nas 4 linhas antes de rodar.

## Passo 3 — Criar os usuários (você + quem vai receber)

1. Menu lateral: **Authentication → Users → Add user → Create new user**.
2. Primeiro crie **VOCÊ** (o admin): e-mail `paulocrestan@gmail.com` + uma senha → marque **Auto Confirm User** ✅ → *Create*.
3. Repita pra cada pessoa que vai acessar a loja: pode ser o e-mail real dela (ex.: `amigo@gmail.com`) + a senha que você definir. Sempre marque **Auto Confirm User** ✅.
4. Você entrega pra cada um: o link da loja + o e-mail/senha dele.
5. (Recomendado) Em **Authentication → Sign In / Up**: desligue *Allow new users to sign up* — assim só entra quem VOCÊ criar.

## Passo 4 — Pegar as chaves

1. Menu lateral: **Project Settings (engrenagem) → API Keys**.
2. Copie:
   - **Project URL** (algo como `https://abcdefgh.supabase.co`)
   - **anon / public key** (um código longo — essa chave é pública mesmo, pode ir na página)

## Passo 5 — Conectar o app

1. Abra o app (`index.html`) → aba **🏪 Minha Loja** → seção **🌐 Loja Online**.
2. Cole a URL e a anon key, preencha seu e-mail admin e a senha que criou no Passo 3.
3. Clique **🚀 Publicar / Atualizar loja online** → deve aparecer "✅ Loja online atualizada".

## Passo 6 — Publicar a página no GitHub Pages

1. No app, clique **⬇️ Gerar loja.html (online c/ login)** — baixa o arquivo `loja.html`.
2. No GitHub (github.com, conta paulocrestan-png): crie um repositório novo, ex. `loja-pokemon` (público) → *Add file → Upload files* → suba o `loja.html` → *Commit*.
3. No repositório: **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → *Save*.
4. Em ~2 min a loja está no ar em:
   `https://paulocrestan-png.github.io/loja-pokemon/loja.html`

## Dia a dia (depois do setup)

- Mudou preço, colocou ou tirou carta? Só clicar **🚀 Publicar** no app. **Não precisa mexer no GitHub nunca mais** — a página busca os dados ao vivo e até atualiza sozinha na tela de quem estiver com ela aberta.
- Quer saber quem reservou o quê? Botão **📋 Ver reservas** no app (ou entre na loja com seu login de admin — você vê o e-mail de quem reservou e pode cancelar).
- Novo cliente? Só criar mais um usuário no Supabase (Passo 3).
