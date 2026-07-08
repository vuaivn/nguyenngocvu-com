# Hướng dẫn deploy nguyenngocvu.com lên Cloudflare Pages

Repo: https://github.com/vuaivn/nguyenngocvu-com

## Cách A — Deploy qua Dashboard (khuyên dùng, không cần token)

1. Vào https://dash.cloudflare.com → chọn account của anh.
2. Menu trái: **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
3. Chọn repo **vuaivn/nguyenngocvu-com** (bấm *Install & Authorize* GitHub nếu được hỏi).
4. Cấu hình build:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - (tùy chọn) biến môi trường `NODE_VERSION=20`
5. Bấm **Save and Deploy** → chờ ~1–2 phút, site lên ở `nguyenngocvu-com.pages.dev`.

### Trỏ domain nguyenngocvu.com
6. Trong project vừa tạo → tab **Custom domains** → **Set up a custom domain**.
7. Nhập `nguyenngocvu.com` → **Continue** → **Activate domain**.
8. Vì domain đã ở Cloudflare, bản ghi CNAME sẽ tự thêm. Chờ vài phút SSL cấp xong.

Xong! Từ giờ mỗi lần push lên `main`, Cloudflare tự build & deploy lại.

## Cách B — Deploy qua Wrangler CLI (cần API token)

```powershell
$env:CLOUDFLARE_API_TOKEN="<token>"
cd nguyenngocvu-com
npm run build
npx wrangler pages project create nguyenngocvu-com --production-branch main
npx wrangler pages deploy dist --project-name nguyenngocvu-com
```

## Ghi chú
- Sitemap: https://nguyenngocvu.com/sitemap.xml
- RSS: https://nguyenngocvu.com/rss.xml
- Stack: Astro 4 + MDX, Tiếng Việt, 3 chuyên mục: Phật pháp / Công nghệ & AI / Phát triển bản thân.
