#!/usr/bin/env node
'use strict';

const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { createServer } = require('node:http');
const { spawn } = require('node:child_process');
const { release } = require('node:os');

function browserCommands(url, platform = process.platform, env = process.env, kernel = release()) {
  // Only our generated loopback URL is interpolated into PowerShell code.
  if (!/^http:\/\/127\.0\.0\.1:\d+\/$/.test(url)) throw new Error('Invalid dashboard URL');
  const windows = ['powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Start-Process '${url}'`]];
  if (platform === 'darwin') return [['/usr/bin/open', [url]]];
  if (platform === 'win32') return [windows, ['rundll32.exe', ['url.dll,FileProtocolHandler', url]]];
  if (platform === 'linux' && (env.WSL_DISTRO_NAME || /microsoft/i.test(kernel))) {
    return [windows, ['wslview', [url]], ['xdg-open', [url]]];
  }
  return [['xdg-open', [url]], ['gio', ['open', url]]];
}

function runOpener(command, spawnFn = spawn) {
  return new Promise(resolveResult => {
    let settled = false;
    const finish = result => { if (!settled) { settled = true; clearTimeout(timer); resolveResult(result); } };
    let child, timer;
    try {
      child = spawnFn(command[0], command[1], { shell: false, stdio: ['ignore', 'ignore', 'pipe'] });
    } catch (error) { finish({ ok: false, error: error.message }); return; }
    let details = '';
    child.stderr?.on('data', chunk => { details = (details + chunk).slice(-1000); });
    child.once('error', error => finish({ ok: false, error: error.message }));
    child.once('exit', code => finish({ ok: code === 0, error: details.trim() || `exit ${code}` }));
    timer = setTimeout(() => {
      // Some Linux browser wrappers remain attached to a running browser.
      // Do not kill that browser or launch another one. Keep the manual URL available.
      child.unref(); child.stderr?.destroy();
      finish({ ok: true, pending: true });
    }, 5000);
  });
}

async function openBrowser(url, commands = browserCommands(url), spawnFn = spawn) {
  const failures = [];
  for (const command of commands) {
    const result = await runOpener(command, spawnFn);
    if (result.ok) return { ...result, command: command[0] };
    failures.push(`${command[0]}: ${result.error}`);
  }
  return { ok: false, error: failures.join('\n') };
}

async function startServer({ port = 4318, fallback = true, html = readFileSync(resolve(__dirname, '..', 'index.html')) } = {}) {
  const server = createServer((req, res) => {
    const path = (req.url || '/').split('?')[0];
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    if (path === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    if (path !== '/' && path !== '/index.html') { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': html.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : html);
  });
  const listen = value => new Promise((yes, no) => {
    const onError = error => { server.off('listening', onListen); no(error); };
    const onListen = () => { server.off('error', onError); yes(); };
    server.once('error', onError); server.once('listening', onListen);
    server.listen(value, '127.0.0.1');
  });
  try { await listen(port); }
  catch (error) { if (error.code === 'EADDRINUSE' && fallback && port !== 0) await listen(0); else throw error; }
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

function parseArgs(args) {
  let port = 4318, fallback = true, noOpen = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--no-open') noOpen = true;
    else if (args[i] === '--port') {
      const value = args[++i];
      if (!/^\d+$/.test(value || '') || Number(value) > 65535) throw new Error('--port needs a number from 0 to 65535');
      port = Number(value); fallback = false;
    } else throw new Error(`Unknown option: ${args[i]}. Use --help.`);
  }
  return { port, fallback, noOpen };
}

async function main(args = process.argv.slice(2)) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log('AI Atlas: start the dashboard and open your browser.\n\nUsage: ai-atlas [--no-open] [--port NUMBER]\n  --no-open  Start the server without opening a browser.\n  --port     Use a specific port; 0 chooses an available port.\nKeep this terminal open. Press Ctrl+C to stop.'); return;
  }
  const options = parseArgs(args);
  const { server, url } = await startServer(options);
  console.log(`\nAI Atlas is running:\n\n  ${url}\n\nKeep this terminal open. Press Ctrl+C to stop.\n`);
  const stop = () => { server.close(); server.closeAllConnections(); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  if (!options.noOpen) {
    const result = await openBrowser(url);
    if (!result.ok) console.error(`Automatic browser opening failed:\n${result.error}`);
    else console.log('Browser launch requested.');
    console.log(`If no tab appears, click or paste this address into your browser:\n${url}`);
  }
  return { server, url };
}

module.exports = { browserCommands, runOpener, openBrowser, startServer, parseArgs, main };
if (require.main === module) main().catch(error => { console.error(`AI Atlas could not start: ${error.message}`); process.exitCode = 1; });
