import { gunzipSync } from 'node:zlib';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceDir = 'scripts/app-source';
const files = readdirSync(sourceDir)
  .filter((file) => /^part-\d+\.txt$/.test(file))
  .sort();

if (files.length === 0) {
  throw new Error('No source chunks found in scripts/app-source');
}

const encoded = files
  .map((file) => readFileSync(join(sourceDir, file), 'utf8').trim())
  .join('');

const source = gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');

mkdirSync('src', { recursive: true });
writeFileSync('src/App.jsx', source);
console.log(`Restored src/App.jsx from ${files.length} chunks (${source.length} chars)`);
