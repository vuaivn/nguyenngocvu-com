// Batch: generate hero + inline Gemini images cho các bài còn lại, tối ưu webp, cập nhật markdown.
// Dùng: $env:GEMINI_API_KEY="..."; node scripts/batch-gemini.mjs
import { writeFileSync, readFileSync, existsSync, statSync } from 'node:fs';
import sharp from 'sharp';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('Thiếu GEMINI_API_KEY'); process.exit(1); }
const MODEL = 'gemini-2.5-flash-image';
const STYLE = 'minimalist flat vector illustration, warm earthy palette (terracotta #b8763e, beige, soft sage green), calm, no text, wide horizontal 16:9 composition';

// slug -> {hero svg name, inline svg name, heroPrompt, inlinePrompt}
const JOBS = [
  { slug:'ai-agent-la-gi', hero:'hero-ai-agent', inline:'in-loop',
    heroP:`an AI agent concept: a friendly robot assistant connected to tools and data nodes, ${STYLE}`,
    inlineP:`a feedback loop diagram of an AI agent: perceive, think, act, repeat, arrows in a circle, ${STYLE}` },
  { slug:'buong-bo-de-tu-do', hero:'hero-buong-bo', inline:'in-lotus',
    heroP:`letting go for freedom, open hands releasing a bird or leaves into the wind, serene, ${STYLE}`,
    inlineP:`a blooming lotus flower symbolizing letting go and inner peace in Buddhism, ${STYLE}` },
  { slug:'ky-luat-tao-tu-do', hero:'hero-ky-luat', inline:'in-habit',
    heroP:`discipline creates freedom, a person following a clear structured path toward an open horizon, ${STYLE}`,
    inlineP:`building good habits, a chain of small daily checkmarks forming a strong routine, ${STYLE}` },
  { slug:'phat-phap-giua-doi-thuong', hero:'hero-phat-phap-doi-thuong', inline:'in-balance',
    heroP:`applying Buddhist wisdom in busy daily life, calm person amid city bustle, ${STYLE}`,
    inlineP:`balance and equanimity, a balanced scale or a person balancing on stones calmly, ${STYLE}` },
  { slug:'prompt-engineering-co-ban', hero:'hero-prompt', inline:'in-steps4',
    heroP:`prompt engineering concept, a person crafting clear instructions to an AI, chat bubbles, ${STYLE}`,
    inlineP:`four steps process illustration, four numbered stages connected by arrows, ${STYLE}` },
  { slug:'quan-ly-thoi-gian-hieu-qua', hero:'hero-thoi-gian', inline:'in-matrix',
    heroP:`effective time management, a calm person organizing tasks and a clock, ${STYLE}`,
    inlineP:`Eisenhower matrix, a 2x2 quadrant grid of urgent vs important tasks, ${STYLE}` },
  { slug:'tu-duy-phat-trien', hero:'hero-tu-duy', inline:'in-yet',
    heroP:`growth mindset, a small plant growing into a strong tree, upward progress, brain sprouting, ${STYLE}`,
    inlineP:`the power of yet, a person climbing stairs toward a goal, progress not perfection, ${STYLE}` },
  { slug:'xay-website-ca-nhan-mien-phi', hero:'hero-xay-web', inline:'in-deploy',
    heroP:`building a personal website for free, a browser window with code and a rocket, ${STYLE}`,
    inlineP:`deploying a website to the cloud, uploading files to a cloud server, ${STYLE}` },
];

async function gen(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = { contents:[{parts:[{text:prompt}]}], generationConfig:{ responseModalities:['IMAGE'], imageConfig:{ aspectRatio:'16:9' } } };
  const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const part = (data?.candidates?.[0]?.content?.parts ?? []).find(p=>p.inlineData?.data);
  if (!part) throw new Error('no image: '+JSON.stringify(data).slice(0,200));
  return Buffer.from(part.inlineData.data, 'base64');
}

const dir = 'public/images/posts/';
for (const j of JOBS) {
  for (const [kind, name, prompt] of [['hero', j.hero, j.heroP], ['inline', j.inline, j.inlineP]]) {
    let ok=false;
    for (let a=0; a<3 && !ok; a++) {
      try {
        const buf = await gen(prompt);
        await sharp(buf).resize(1200).webp({quality:82}).toFile(dir+name+'.webp');
        const kb = (statSync(dir+name+'.webp').size/1024).toFixed(0);
        console.log(`✓ ${j.slug} ${kind} -> ${name}.webp (${kb}KB)`);
        ok=true;
      } catch(e){ console.log(`… retry ${name} (${a+1}): ${e.message}`); await new Promise(r=>setTimeout(r, 3000)); }
    }
    if(!ok) console.log(`✗ FAILED ${name}`);
  }
  // cập nhật markdown: .svg -> .webp cho hero + inline
  const mdPath = `src/content/blog/${j.slug}.md`;
  if (existsSync(mdPath)) {
    let c = readFileSync(mdPath, 'utf8');
    c = c.replaceAll(`${j.hero}.svg`, `${j.hero}.webp`).replaceAll(`${j.inline}.svg`, `${j.inline}.webp`);
    writeFileSync(mdPath, c);
    console.log(`  md updated: ${j.slug}.md`);
  }
}
console.log('DONE');
