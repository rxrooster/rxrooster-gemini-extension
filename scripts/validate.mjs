import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'gemini-extension.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const packageJson = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);

const expectedTools = [
  'explore_coverage_areas',
  'get_anesthesia_job',
  'prepare_anesthesia_job_draft',
  'prepare_anesthesia_service_draft',
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
  manifest.version === packageJson.version,
  'Manifest and package versions must match.',
);
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
  'The MCP server must allowlist exactly the five reviewed read-only tools.',
);

assert(
  manifest.contextFileName === 'GEMINI.md',
  'The extension must explicitly load GEMINI.md.',
);
const context = await readFile(
  path.join(root, manifest.contextFileName),
  'utf8',
);
const normalizedContext = context.replace(/\s+/g, ' ');
assert(
  context.includes('authoritative display order') &&
    context.includes("unchanged `detail_arguments` object"),
  'Gemini context must preserve ordered search IDs for ordinal follow-ups.',
);
assert(
  /Do not re-search,\s+reorder, sort, or select by title/.test(context),
  'Gemini context must forbid fuzzy or reordered ordinal job selection.',
);
assert(
  context.includes('Treat an empty coverage result as inconclusive') &&
    context.includes('does not establish provider') &&
    context.includes('fewer than any number'),
  'Gemini context must make empty coverage results non-quantitative.',
);
assert(
  context.includes('Present returned service cards in their exact order') &&
    context.includes('published service terms') &&
    context.includes('private rates'),
  'Gemini context must present public service-card terms without exposing private terms.',
);
assert(
  context.includes('first ask whether the user is an anesthesia provider') &&
    context.includes('employer/recruiter'),
  'Gemini context must disambiguate provider and employer audiences.',
);
assert(
  context.includes('`prepare_anesthesia_service_draft`') &&
    context.includes('`prepare_anesthesia_job_draft`') &&
    context.includes('read-only and non-persistent'),
  'Gemini context must document both non-persistent draft workflows.',
);
assert(
  normalizedContext.includes('does not publish immediately') &&
    normalizedContext.includes('select or verify an owned facility') &&
    normalizedContext.includes('Never ask for or pass a name, email, phone'),
  'Gemini context must preserve native review and privacy boundaries.',
);
assert(
  !/(?:at least|fewer than|less than)\s+\d+\s+(?:clinicians|crnas|providers)/i.test(
    context,
  ),
  'Gemini context must not disclose or infer a numeric publication threshold.',
);
await readFile(path.join(root, 'README.md'), 'utf8');

console.log(
  `Validated ${manifest.name} ${manifest.version}: ${server.httpUrl} with ${actualTools.length} allowlisted tools.`,
);
