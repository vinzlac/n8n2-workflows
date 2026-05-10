#!/usr/bin/env node
// Minimal stdio↔HTTP bridge for n8n MCP (no SSE — n8n uses response-mode only)
import { createInterface } from 'readline';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Load .env
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const URL = 'https://n8n.code-advisors.site/mcp-server/http';
const TOKEN = process.env.N8N_MCP_KEY;

if (!TOKEN) {
  process.stderr.write('N8N_MCP_KEY not set in .env\n');
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try { msg = JSON.parse(trimmed); } catch { return; }

  // Notifications have no id and need no response
  if (msg.id === undefined || msg.id === null && msg.method?.startsWith('notifications/')) return;

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
      },
      body: JSON.stringify(msg),
    });

    const text = await res.text();

    // n8n wraps response in SSE format: "event: message\ndata: {...}\n\n"
    for (const chunk of text.split('\n')) {
      if (chunk.startsWith('data: ')) {
        process.stdout.write(chunk.slice(6) + '\n');
      }
    }
  } catch (err) {
    const errResp = { jsonrpc: '2.0', id: msg.id ?? null, error: { code: -32603, message: String(err) } };
    process.stdout.write(JSON.stringify(errResp) + '\n');
  }
});

rl.on('close', () => process.exit(0));
