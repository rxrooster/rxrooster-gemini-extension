import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'gemini-extension.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const expectedTools = [
  'explore_coverage_areas',
  'get_anesthesia_job',
  'search_anesthesia_jobs',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  manifest.name === path.basename(root),
  'Manifest name must match the extension directory name.',
);
assert(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name),
  'Manifest name must use lowercase letters, numbers, and single dashes.',
);
assert(/^\d+\.\d+\.\d+$/.test(manifest.version), 'Version must be SemVer.');
assert(
  typeof manifest.description === 'string' && manifest.description.length > 0,
  'A gallery description is required.',
);

const serverEntries = Object.entries(manifest.mcpServers ?? {});
assert(serverEntries.length === 1, 'Exactly one MCP server must be configured.');
const [serverName, server] = serverEntries[0];
assert(serverName === 'rxrooster', 'The MCP server alias must be rxrooster.');
assert(
  server.httpUrl === 'https://api.rxrooster.com/mcp',
  'The MCP server must use the production Streamable HTTP endpoint.',
);
assert(server.headers === undefined, 'The public server must not inject headers.');
assert(server.trust === undefined, 'The extension must not bypass tool approvals.');

const actualTools = [...(server.includeTools ?? [])].sort();
assert(
  JSON.stringify(actualTools) === JSON.stringify(expectedTools),
  'The MCP server must allowlist exactly the three reviewed read-only tools.',
);

assert(
  manifest.contextFileName === 'GEMINI.md',
  'The extension must explicitly load GEMINI.md.',
);
await readFile(path.join(root, manifest.contextFileName), 'utf8');
await readFile(path.join(root, 'README.md'), 'utf8');

console.log(
  `Validated ${manifest.name} ${manifest.version}: ${server.httpUrl} with ${actualTools.length} allowlisted tools.`,
);
