#!/usr/bin/env node
'use strict';

const { accessSync, constants } = require('node:fs');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('AI Atlas: open the bundled dashboard in your default browser.\n\nUsage: ai-atlas [--no-open]\n  --no-open  Print the dashboard URL without opening a browser.');
  process.exit(0);
}
if (args.some(arg => arg !== '--no-open')) {
  console.error('Unknown option. Use --help for usage.');
  process.exit(1);
}

const file = resolve(__dirname, '..', 'index.html');
try {
  accessSync(file, constants.R_OK);
} catch {
  console.error('The bundled dashboard is missing or unreadable. Download the package again.');
  process.exit(1);
}
const url = pathToFileURL(file).href;
console.log(`AI Atlas\n${url}`);
if (args.includes('--no-open')) process.exit(0);

const commands = {
  darwin: ['open', [url]],
  win32: ['rundll32.exe', ['url.dll,FileProtocolHandler', url]],
  linux: ['xdg-open', [url]],
  freebsd: ['xdg-open', [url]]
};
const command = commands[process.platform];
if (!command) {
  console.error('Automatic browser opening is unavailable on this platform. Open the URL above manually.');
  process.exit(1);
}
console.log('Opening your default browser…');
const child = spawn(command[0], command[1], { shell: false, stdio: 'ignore' });
child.on('error', () => {
  console.error('Could not open a browser. Open the URL above manually.');
  process.exitCode = 1;
});
child.on('exit', code => {
  if (code !== 0) {
    console.error('The browser opener did not complete successfully. Open the URL above manually.');
    process.exitCode = 1;
  }
});
