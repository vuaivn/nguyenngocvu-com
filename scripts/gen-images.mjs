// Generator SVG minh họa cho blog — phong cách nhất quán, mỗi bài một motif.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'images', 'posts');
mkdirSync(OUT, { recursive: true });

// Palette theo site
const C = {
  cream: '#faf7f2',
  soft: '#f2ece2',
  sky1: '#f7ecd9',
  sky2: '#e9d3ad',
  accent: '#b8763e',
  accentSoft: '#d99a48',
  deep: '#7a4a22',
  mid: '#c98a52',
};

function wrap(inner, grad = `${C.sky1}`, grad2 = `${C.sky2}`, w = 1200, h = 630, label = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${grad}"/><stop offset="1" stop-color="${grad2}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
${inner}
</svg>`;
}
// small illustration (inline) 800x450
function wrapS(inner, label = '') {
  return wrap(inner, C.soft, '#eaddc6', 800, 450, label);
}

const S = {};

// ---------- HERO (1200x630) ----------
// Chánh niệm — hơi thở, vòng tròn thiền + sóng thở
S['hero-chanh-niem'] = wrap(`
  <circle cx="600" cy="315" r="180" fill="none" stroke="${C.accentSoft}" stroke-width="3" opacity="0.6"/>
  <circle cx="600" cy="315" r="120" fill="none" stroke="${C.accent}" stroke-width="3" opacity="0.5"/>
  <circle cx="600" cy="315" r="60" fill="${C.accent}" opacity="0.85"/>
  <circle cx="600" cy="315" r="24" fill="${C.cream}"/>
  <path d="M180 470 Q300 420 420 470 T660 470 T900 470 T1140 470" fill="none" stroke="${C.mid}" stroke-width="4" opacity="0.5"/>
  <path d="M180 150 Q360 110 540 150 T900 150 T1140 150" fill="none" stroke="${C.mid}" stroke-width="4" opacity="0.4"/>`,
  C.sky1, C.sky2, 'Minh hoa chanh niem — hoi tho va vong tron thien');

// Buông bỏ — bàn tay mở thả cánh chim/lá
S['hero-buong-bo'] = wrap(`
  <path d="M470 470 q-40 -30 -30 -90 q30 20 60 10 q-10 40 20 70 q-30 20 -50 10 Z" fill="${C.deep}" opacity="0.85"/>
  <path d="M430 380 q60 -20 130 10" fill="none" stroke="${C.deep}" stroke-width="10" stroke-linecap="round" opacity="0.85"/>
  <g fill="${C.accent}" opacity="0.9">
    <path d="M700 250 q40 -30 90 -20 q-30 30 -90 20 Z"/>
    <path d="M760 320 q50 -20 100 0 q-40 30 -100 0 Z"/>
    <path d="M820 200 q35 -25 80 -15 q-28 28 -80 15 Z"/>
  </g>
  <circle cx="640" cy="330" r="10" fill="${C.mid}"/>
  <circle cx="700" cy="290" r="7" fill="${C.mid}" opacity="0.8"/>`,
  C.sky1, C.sky2, 'Minh hoa buong bo — ban tay mo tha canh chim');

// Phật pháp đời thường — mái chùa + nhịp sống
S['hero-phat-phap-doi-thuong'] = wrap(`
  <path d="M600 180 L760 280 L440 280 Z" fill="${C.accent}" opacity="0.9"/>
  <rect x="480" y="280" width="240" height="150" fill="${C.mid}" opacity="0.85"/>
  <rect x="560" y="340" width="80" height="90" fill="${C.deep}"/>
  <circle cx="600" cy="150" r="18" fill="${C.accentSoft}"/>
  <g stroke="${C.deep}" stroke-width="4" opacity="0.4">
    <line x1="200" y1="470" x2="1000" y2="470"/>
  </g>
  <circle cx="300" cy="450" r="14" fill="${C.accent}" opacity="0.6"/>
  <circle cx="900" cy="450" r="14" fill="${C.accent}" opacity="0.6"/>`,
  C.sky1, C.sky2, 'Minh hoa tu tap giua doi thuong — mai chua');

// AI Agent — mạng nơ-ron + robot node
S['hero-ai-agent'] = wrap(`
  <g stroke="${C.mid}" stroke-width="2" opacity="0.5">
    <line x1="360" y1="200" x2="600" y2="315"/><line x1="360" y1="430" x2="600" y2="315"/>
    <line x1="600" y1="315" x2="840" y2="220"/><line x1="600" y1="315" x2="840" y2="410"/>
  </g>
  <g fill="${C.accent}"><circle cx="360" cy="200" r="24"/><circle cx="360" cy="430" r="24"/><circle cx="840" cy="220" r="24"/><circle cx="840" cy="410" r="24"/></g>
  <rect x="545" y="255" width="110" height="120" rx="18" fill="${C.deep}"/>
  <circle cx="578" cy="300" r="12" fill="${C.cream}"/><circle cx="622" cy="300" r="12" fill="${C.cream}"/>
  <rect x="575" y="335" width="50" height="8" rx="4" fill="${C.cream}"/>
  <line x1="600" y1="230" x2="600" y2="255" stroke="${C.deep}" stroke-width="4"/><circle cx="600" cy="224" r="8" fill="${C.accentSoft}"/>`,
  C.soft, '#e6d7bf', 'Minh hoa AI Agent — mang no-ron va robot');

// Prompt engineering — khung chat + con trỏ
S['hero-prompt'] = wrap(`
  <rect x="360" y="200" width="480" height="230" rx="20" fill="${C.cream}" stroke="${C.accent}" stroke-width="4"/>
  <rect x="400" y="250" width="300" height="18" rx="9" fill="${C.mid}" opacity="0.7"/>
  <rect x="400" y="290" width="380" height="18" rx="9" fill="${C.accentSoft}" opacity="0.6"/>
  <rect x="400" y="330" width="220" height="18" rx="9" fill="${C.mid}" opacity="0.5"/>
  <rect x="400" y="372" width="26" height="26" rx="6" fill="${C.accent}"/>
  <path d="M760 300 l40 20 l-40 20 Z" fill="${C.accent}"/>
  <text x="600" y="180" text-anchor="middle" font-family="sans-serif" font-size="40" fill="${C.deep}">&gt;_</text>`,
  C.sky1, C.sky2, 'Minh hoa prompt engineering — khung chat voi AI');

// Xây web — cửa sổ trình duyệt + gạch xếp
S['hero-xay-web'] = wrap(`
  <rect x="360" y="180" width="480" height="290" rx="16" fill="${C.cream}" stroke="${C.deep}" stroke-width="4"/>
  <rect x="360" y="180" width="480" height="46" rx="16" fill="${C.accent}"/>
  <circle cx="392" cy="203" r="8" fill="${C.cream}"/><circle cx="420" cy="203" r="8" fill="${C.cream}"/><circle cx="448" cy="203" r="8" fill="${C.cream}"/>
  <rect x="400" y="260" width="180" height="120" rx="8" fill="${C.accentSoft}" opacity="0.6"/>
  <rect x="600" y="260" width="200" height="24" rx="6" fill="${C.mid}" opacity="0.7"/>
  <rect x="600" y="300" width="200" height="16" rx="6" fill="${C.mid}" opacity="0.5"/>
  <rect x="600" y="330" width="140" height="16" rx="6" fill="${C.mid}" opacity="0.5"/>
  <rect x="600" y="360" width="90" height="26" rx="13" fill="${C.accent}"/>`,
  C.soft, '#e6d7bf', 'Minh hoa xay website — cua so trinh duyet');

// Kỷ luật — bậc thang + mũi tên lên
S['hero-ky-luat'] = wrap(`
  <g fill="${C.accent}" opacity="0.9">
    <rect x="330" y="430" width="90" height="60" rx="8"/>
    <rect x="450" y="380" width="90" height="110" rx="8"/>
    <rect x="570" y="330" width="90" height="160" rx="8"/>
    <rect x="690" y="270" width="90" height="220" rx="8"/>
    <rect x="810" y="210" width="90" height="280" rx="8"/>
  </g>
  <path d="M330 400 L860 170" stroke="${C.deep}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M815 165 L875 158 L852 210 Z" fill="${C.deep}" opacity="0.7"/>`,
  C.sky1, C.sky2, 'Minh hoa ky luat — bac thang va mui ten len');

// Quản lý thời gian — đồng hồ + ma trận
S['hero-thoi-gian'] = wrap(`
  <circle cx="470" cy="315" r="140" fill="${C.cream}" stroke="${C.accent}" stroke-width="6"/>
  <line x1="470" y1="315" x2="470" y2="220" stroke="${C.deep}" stroke-width="8" stroke-linecap="round"/>
  <line x1="470" y1="315" x2="545" y2="345" stroke="${C.accent}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="470" cy="315" r="12" fill="${C.deep}"/>
  <g fill="${C.accentSoft}" opacity="0.85">
    <rect x="700" y="215" width="90" height="90" rx="10"/><rect x="800" y="215" width="90" height="90" rx="10" opacity="0.6"/>
    <rect x="700" y="315" width="90" height="90" rx="10" opacity="0.6"/><rect x="800" y="315" width="90" height="90" rx="10" opacity="0.4"/>
  </g>`,
  C.sky1, C.sky2, 'Minh hoa quan ly thoi gian — dong ho va ma tran uu tien');

// Tư duy phát triển — hạt mầm vươn lên + não
S['hero-tu-duy'] = wrap(`
  <path d="M600 460 L600 300" stroke="${C.deep}" stroke-width="10" stroke-linecap="round"/>
  <path d="M600 330 q-70 -10 -100 -80 q80 -10 100 60 Z" fill="${C.accent}" opacity="0.9"/>
  <path d="M600 300 q70 -20 110 -95 q-85 0 -110 75 Z" fill="${C.mid}" opacity="0.9"/>
  <path d="M600 250 q-50 -20 -70 -85 q60 5 70 70 Z" fill="${C.accentSoft}" opacity="0.9"/>
  <ellipse cx="600" cy="470" rx="150" ry="26" fill="${C.deep}" opacity="0.2"/>`,
  C.sky1, C.sky2, 'Minh hoa tu duy phat trien — hat mam vuon len');

// ---------- INLINE (800x450) ----------
S['in-hoi-tho'] = wrapS(`
  <circle cx="400" cy="225" r="110" fill="none" stroke="${C.accent}" stroke-width="4" opacity="0.7"/>
  <circle cx="400" cy="225" r="60" fill="${C.accentSoft}" opacity="0.5"/>
  <path d="M150 320 Q250 285 350 320 T550 320 T650 320" fill="none" stroke="${C.mid}" stroke-width="4" opacity="0.6"/>
  <text x="400" y="235" text-anchor="middle" font-family="sans-serif" font-size="30" fill="${C.deep}">an</text>`,
  'So do hoi tho vao ra trong thuc hanh chanh niem');

S['in-lotus'] = wrapS(`
  <g fill="${C.mid}"><path d="M400 340 C350 300 350 260 400 250 C450 260 450 300 400 340 Z"/>
  <path d="M320 345 C300 305 320 275 360 285 C378 305 360 335 320 345 Z"/>
  <path d="M480 345 C500 305 480 275 440 285 C422 305 440 335 480 345 Z"/></g>
  <ellipse cx="400" cy="350" rx="150" ry="24" fill="${C.accent}" opacity="0.25"/>`,
  'Hoa sen — bieu tuong cua su buong bo va thanh tinh');

S['in-balance'] = wrapS(`
  <line x1="400" y1="120" x2="400" y2="180" stroke="${C.deep}" stroke-width="6"/>
  <line x1="250" y1="180" x2="550" y2="180" stroke="${C.deep}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="250" cy="260" r="55" fill="${C.accent}" opacity="0.8"/>
  <circle cx="550" cy="260" r="55" fill="${C.mid}" opacity="0.8"/>
  <line x1="250" y1="180" x2="250" y2="210" stroke="${C.deep}" stroke-width="3"/>
  <line x1="550" y1="180" x2="550" y2="210" stroke="${C.deep}" stroke-width="3"/>
  <path d="M360 320 h80" stroke="${C.deep}" stroke-width="6" stroke-linecap="round"/>`,
  'Can bang giua cong viec va doi song');

S['in-loop'] = wrapS(`
  <g fill="none" stroke="${C.accent}" stroke-width="6">
    <path d="M400 130 a95 95 0 1 1 -67 28" />
  </g>
  <path d="M320 175 l15 -45 l40 30 Z" fill="${C.accent}"/>
  <g fill="${C.deep}" font-family="sans-serif" font-size="22" text-anchor="middle">
    <text x="400" y="150">Kế hoạch</text><text x="520" y="240">Hành động</text>
    <text x="400" y="330">Đánh giá</text><text x="285" y="240">Điều chỉnh</text>
  </g>`,
  'Vong lap hoat dong cua AI Agent');

S['in-steps4'] = wrapS(`
  <g font-family="sans-serif" font-size="24" fill="${C.cream}" text-anchor="middle">
    <rect x="130" y="180" width="120" height="90" rx="12" fill="${C.accent}"/><text x="190" y="235">Rõ ràng</text>
    <rect x="280" y="180" width="120" height="90" rx="12" fill="${C.mid}"/><text x="340" y="235">Vai trò</text>
    <rect x="430" y="180" width="120" height="90" rx="12" fill="${C.accentSoft}"/><text x="490" y="235">Ví dụ</text>
    <rect x="580" y="180" width="120" height="90" rx="12" fill="${C.deep}"/><text x="640" y="235">Từng bước</text>
  </g>`,
  'Bon nguyen tac prompt engineering');

S['in-deploy'] = wrapS(`
  <rect x="120" y="200" width="130" height="90" rx="10" fill="${C.mid}"/>
  <text x="185" y="252" text-anchor="middle" font-family="sans-serif" font-size="22" fill="${C.cream}">Code</text>
  <rect x="340" y="200" width="130" height="90" rx="10" fill="${C.accent}"/>
  <text x="405" y="252" text-anchor="middle" font-family="sans-serif" font-size="22" fill="${C.cream}">GitHub</text>
  <rect x="560" y="200" width="130" height="90" rx="10" fill="${C.deep}"/>
  <text x="625" y="245" text-anchor="middle" font-family="sans-serif" font-size="18" fill="${C.cream}">Cloudflare</text>
  <path d="M250 245 h90 M470 245 h90" stroke="${C.deep}" stroke-width="4" marker-end=""/>
  <path d="M330 235 l20 10 l-20 10 Z" fill="${C.deep}"/><path d="M550 235 l20 10 l-20 10 Z" fill="${C.deep}"/>`,
  'Quy trinh deploy: Code den GitHub den Cloudflare Pages');

S['in-habit'] = wrapS(`
  <g fill="${C.accent}">
    <rect x="150" y="300" width="60" height="50" rx="6"/><rect x="230" y="270" width="60" height="80" rx="6"/>
    <rect x="310" y="235" width="60" height="115" rx="6"/><rect x="390" y="195" width="60" height="155" rx="6"/>
    <rect x="470" y="160" width="60" height="190" rx="6"/><rect x="550" y="120" width="60" height="230" rx="6"/>
  </g>
  <text x="400" y="390" text-anchor="middle" font-family="sans-serif" font-size="22" fill="${C.deep}">Thói quen nhỏ, tích lũy mỗi ngày</text>`,
  'Hieu ung tich luy cua thoi quen nho');

S['in-matrix'] = wrapS(`
  <g font-family="sans-serif" font-size="18" fill="${C.deep}" text-anchor="middle">
    <rect x="200" y="120" width="180" height="110" fill="${C.accent}" opacity="0.85"/><text x="290" y="180" fill="${C.cream}">Quan trọng + Gấp</text>
    <rect x="390" y="120" width="180" height="110" fill="${C.accentSoft}" opacity="0.8"/><text x="480" y="175" fill="${C.deep}">Quan trọng</text><text x="480" y="197" fill="${C.deep}">Không gấp</text>
    <rect x="200" y="240" width="180" height="110" fill="${C.mid}" opacity="0.7"/><text x="290" y="300" fill="${C.cream}">Gấp, ít quan trọng</text>
    <rect x="390" y="240" width="180" height="110" fill="${C.soft}" stroke="${C.mid}"/><text x="480" y="300" fill="${C.deep}">Loại bỏ</text>
  </g>`,
  'Ma tran uu tien Eisenhower');

S['in-yet'] = wrapS(`
  <text x="400" y="200" text-anchor="middle" font-family="sans-serif" font-size="54" font-weight="700" fill="${C.mid}">Chưa</text>
  <text x="400" y="270" text-anchor="middle" font-family="sans-serif" font-size="26" fill="${C.deep}">"Tôi chưa làm được"</text>
  <path d="M300 310 q100 40 200 0" fill="none" stroke="${C.accent}" stroke-width="5" stroke-linecap="round"/>
  <path d="M480 300 l25 8 l-18 20 Z" fill="${C.accent}"/>`,
  'Suc manh cua chu Chua trong tu duy phat trien');

let count = 0;
for (const [name, svg] of Object.entries(S)) {
  writeFileSync(join(OUT, `${name}.svg`), svg, 'utf8');
  count++;
}
console.log(`Generated ${count} SVG files in ${OUT}`);
