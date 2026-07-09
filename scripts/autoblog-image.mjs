// Tạo 1 ảnh Gemini webp 16:9, đọc key từ .env-autoblog (ngoài repo).
// Dùng: node scripts/autoblog-image.mjs "<prompt>" public/images/posts/<ten>.webp
import { statSync, readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';

// Nạp .env-autoblog (2 cấp trên: workspace-builtwebsite/.env-autoblog)
const envPath = new URL('../../.env-autoblog', import.meta.url);
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const KEY = process.env.GEMINI_API_KEY;
const prompt = process.argv[2];
const outPath = process.argv[3];
if (!KEY) { console.error('Thiếu GEMINI_API_KEY trong .env-autoblog'); process.exit(1); }
if (!prompt || !outPath) { console.error('Dùng: node autoblog-image.mjs "<prompt>" <out.webp>'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
async function gen(p) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = { contents: [{ parts: [{ text: p }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } } };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 150)}`);
  const data = await res.json();
  const part = (data?.candidates?.[0]?.content?.parts ?? []).find((x) => x.inlineData?.data);
  if (!part) throw new Error('no image');
  return Buffer.from(part.inlineData.data, 'base64');
}
let ok = false;
for (let a = 0; a < 3 && !ok; a++) {
  try {
    const buf = await gen(prompt);
    await sharp(buf).resize(1200).webp({ quality: 82 }).toFile(outPath);
    console.log(`✓ ${outPath} (${(statSync(outPath).size / 1024).toFixed(0)}KB)`);
    ok = true;
  } catch (e) { console.log(`… retry ${a + 1}: ${e.message}`); await new Promise((r) => setTimeout(r, 3000)); }
}
if (!ok) { console.error('FAILED: ' + outPath); process.exit(1); }
