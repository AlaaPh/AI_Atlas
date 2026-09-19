'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { browserCommands, openBrowser, startServer, parseArgs } = require('../bin/ai-atlas.cjs');
const url = 'http://127.0.0.1:4318/';

test('selects macOS, Windows, Linux, and WSL browser handlers', () => {
  assert.equal(browserCommands(url, 'darwin', {}, '')[0][0], '/usr/bin/open');
  assert.equal(browserCommands(url, 'win32', {}, '')[0][0], 'powershell.exe');
  assert.equal(browserCommands(url, 'linux', {}, 'Linux')[0][0], 'xdg-open');
  assert.equal(browserCommands(url, 'linux', { WSL_DISTRO_NAME: 'Ubuntu' }, 'Linux')[0][0], 'powershell.exe');
  assert.equal(browserCommands(url, 'linux', {}, 'microsoft-standard-WSL2')[0][0], 'powershell.exe');
  assert.throws(() => browserCommands("http://example.com/'; bad"));
});

test('falls back after an opener fails and returns diagnostics if all fail', async () => {
  let calls = 0;
  const fakeSpawn = (cmd, args, options) => {
    assert.equal(options.shell, false);
    const child = new EventEmitter(); child.stderr = new EventEmitter();
    process.nextTick(() => { if (++calls === 1) child.emit('error', new Error('not installed')); else child.emit('exit', 0); });
    return child;
  };
  const result = await openBrowser(url, [['first', []], ['second', []]], fakeSpawn);
  assert.equal(result.ok, true); assert.equal(result.command, 'second'); assert.equal(calls, 2);
  const failed = await openBrowser(url, [['missing', []]], () => { throw new Error('no browser'); });
  assert.equal(failed.ok, false); assert.match(failed.error, /no browser/);
});

test('validates CLI ports and options', () => {
  assert.deepEqual(parseArgs(['--no-open', '--port', '0']), { port: 0, fallback: false, noOpen: true });
  for (const args of [['--port'], ['--port', '-1'], ['--port', '65536'], ['--port', '12x'], ['--unknown']]) assert.throws(() => parseArgs(args));
});

test('serves real dashboard over loopback and does not expose project files', async t => {
  const { server, url } = await startServer({ port: 0 });
  t.after(() => { server.closeAllConnections(); server.close(); });
  assert.equal(server.address().address, '127.0.0.1');
  const page = await fetch(url); assert.equal(page.status, 200); assert.match(page.headers.get('content-type'), /text\/html/);
  const html = await page.text(); assert.match(html, /Build your research toolkit/); assert.match(html, /"name": "Scholarcy"/);
  assert.equal((await fetch(url + 'package.json')).status, 404);
  assert.equal((await fetch(url, { method: 'POST' })).status, 405);
  assert.equal(await (await fetch(url, { method: 'HEAD' })).text(), '');
  assert.equal((await fetch(url + 'index.html')).status, 200);
  assert.equal((await fetch(url + 'favicon.ico')).status, 204);
});

test('uses another available port on collision, unless a port was explicitly selected', async t => {
  const first = await startServer({ port: 0 });
  const port = first.server.address().port;
  t.after(() => first.server.close());
  const next = await startServer({ port });
  t.after(() => next.server.close());
  assert.notEqual(next.server.address().port, port);
  await assert.rejects(startServer({ port, fallback: false }), { code: 'EADDRINUSE' });
});
