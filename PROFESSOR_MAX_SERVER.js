// ============================================================
// 🎓 PROFESSOR (Plano Max) — servidor local pro app Pokémon TCG
// Usa o Claude Code em modo headless (`claude -p`), autenticado
// pela SUA assinatura Max (paulocrestan@gmail.com) — sem chave de API.
// Requisitos: Node + Claude Code instalado e logado nesta máquina.
// Iniciar: INICIAR_PROFESSOR_MAX.bat  (ou: node PROFESSOR_MAX_SERVER.js)
// ============================================================
const http = require('http');
const { spawn } = require('child_process');

const PORT = 8092;

function perguntarAoClaude(prompt, cb) {
  const p = spawn('claude', ['-p', '--output-format', 'text'], {
    shell: process.platform === 'win32',
    windowsHide: true,
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
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, professor: 'online (Plano Max via Claude Code)' }));
    return;
  }

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
}).listen(PORT, () => {
  console.log('===========================================');
  console.log('🎓 PROFESSOR (Plano Max) no ar!');
  console.log('   http://localhost:' + PORT);
  console.log('   No app: Ajuda > Professor > URL do servidor');
  console.log('   Deixe esta janela aberta enquanto joga.');
  console.log('===========================================');
});
