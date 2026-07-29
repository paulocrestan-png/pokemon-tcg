// ============================================================
// 🎓 PROFESSOR (Plano Max) — servidor local pro app Pokémon TCG
// Usa o Claude Code em modo headless (`claude -p`), autenticado
// pela SUA assinatura Max (paulocrestan@gmail.com) — sem chave de API.
// Requisitos: Node + Claude Code instalado e logado nesta máquina.
// Iniciar: INICIAR_PROFESSOR_MAX.bat  (ou: node PROFESSOR_MAX_SERVER.js)
// ============================================================
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8092;

// Segurança: se existir PROFESSOR_TOKEN.txt ao lado deste arquivo, toda
// consulta precisa mandar o token (necessário ao expor via túnel/internet).
let TOKEN = '';
try { TOKEN = fs.readFileSync(path.join(__dirname, 'PROFESSOR_TOKEN.txt'), 'utf8').trim(); } catch (e) {}
const rate = {}; // por IP: {hits:[], fails:[], blockedUntil}

// Sandbox: o claude roda numa pasta VAZIA, sem ferramentas e sem MCP —
// mesmo com o token vazado, ninguém lê arquivos do PC através do Professor.
const SANDBOX = path.join(__dirname, '_sandbox');
try { fs.mkdirSync(SANDBOX, { recursive: true }); } catch (e) {}
const CLAUDE_ARGS = ['-p', '--output-format', 'text', '--strict-mcp-config',
  '--disallowedTools', 'Bash,Read,Glob,Grep,Write,Edit,MultiEdit,NotebookEdit,WebFetch,WebSearch,Task,TodoWrite'];

function perguntarAoClaude(prompt, cb) {
  // Limpa marcadores de sessão do Claude Code — sem isso, se o servidor for
  // iniciado de dentro de uma sessão do Claude, o `claude -p` recusa (nested)
  const env = { ...process.env };
  delete env.CLAUDECODE;
  delete env.CLAUDE_CODE_ENTRYPOINT;
  delete env.CLAUDE_CODE_SSE_PORT;
  const p = spawn('claude', CLAUDE_ARGS, {
    shell: process.platform === 'win32',
    windowsHide: true,
    env,
    cwd: SANDBOX,
  });
  let out = '', err = '';
  const timer = setTimeout(() => { p.kill(); }, 180000); // 3 min máx
  p.stdout.on('data', d => out += d);
  p.stderr.on('data', d => err += d);
  p.on('close', code => {
    clearTimeout(timer);
    if (code === 0 && out.trim()) cb(null, out.trim());
    else cb(new Error((err || 'Claude Code retornou vazio (está logado? rode: claude)').slice(0, 300)));
  });
  p.on('error', e => { clearTimeout(timer); cb(new Error('Claude Code não encontrado no PATH: ' + e.message)); });
  p.stdin.write(prompt, 'utf8');
  p.stdin.end();
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-professor-token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, professor: 'online (Plano Max via Claude Code)', protegido: !!TOKEN }));
    return;
  }

  // Limite anti-abuso: 10 consultas/min por IP; 5 tokens errados → bloqueio 10 min
  const ip = (req.headers['cf-connecting-ip'] || req.socket.remoteAddress || '?');
  const now = Date.now();
  const r = (rate[ip] = rate[ip] || { hits: [], fails: [], blockedUntil: 0 });
  if (now < r.blockedUntil) {
    res.writeHead(429, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Muitas tentativas — aguarde alguns minutos' }));
    return;
  }
  r.hits = r.hits.filter(t => now - t < 60000); r.fails = r.fails.filter(t => now - t < 60000);
  if (r.hits.length >= 10) {
    res.writeHead(429, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Calma, campeão — máximo 10 consultas por minuto' }));
    return;
  }
  if (TOKEN && (req.headers['x-professor-token'] || '') !== TOKEN) {
    r.fails.push(now);
    if (r.fails.length >= 5) { r.blockedUntil = now + 600000; console.log('⛔ IP bloqueado 10 min por tokens errados: ' + ip); }
    res.writeHead(401, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Token do Professor inválido — configure na aba Ajuda do app' }));
    return;
  }
  r.hits.push(now);

  let body = '';
  req.on('data', d => { body += d; if (body.length > 200000) req.destroy(); });
  req.on('end', () => {
    let j = {};
    try { j = JSON.parse(body); } catch (e) {}
    const prompt = (j.system ? j.system + '\n\n---\n\n' : '') + (j.prompt || '');
    if (!prompt.trim()) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'prompt vazio' }));
      return;
    }
    const t0 = Date.now();
    console.log(new Date().toLocaleTimeString() + ' 🎓 consulta recebida (' + prompt.length + ' chars)...');
    perguntarAoClaude(prompt, (err, text) => {
      res.writeHead(err ? 500 : 200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(err ? { error: err.message } : { text }));
      console.log('   → ' + (err ? 'ERRO: ' + err.message : 'respondido em ' + ((Date.now() - t0) / 1000).toFixed(1) + 's'));
    });
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('===========================================');
  console.log('🎓 PROFESSOR (Plano Max) no ar!');
  console.log('   http://localhost:' + PORT);
  console.log('   No app: Ajuda > Professor > URL do servidor');
  console.log('   Deixe esta janela aberta enquanto joga.');
  console.log('===========================================');
});
