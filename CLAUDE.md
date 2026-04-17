# CLAUDE.md — Elisha Law Website Project
merges content from two existing sites:
1. **Main site**: https://www.elisha-law.com (Wix, Hebrew, RTL)
2. **Wills microsite**: https://hebrew-will-guide.lovable.app (Lovable/React, Hebrew, RTL)

The wills microsite content becomes a new **"צוואה" tab** in the main nav, sitting alongside:  
`בית | עושים סדר | אודות | צוואה | צור קשר`

---

## Step 0 — Scrape the Lovable Wills Site First

Before writing any application code, you MUST extract the full rendered content from the Lovable wills site using a headless browser. Run this script:

```bash
npm install -g puppeteer-cli   # or use a local script
```

Or create and run `scrape-wills.mjs`:

```js
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const routes = ['/', '/about', '/process', '/faq', '/contact', '/guide', '/צוואה', '/will'];

for (const route of routes) {
  try {
    await page.goto(`https://hebrew-will-guide.lovable.app${route}`, {
      waitUntil: 'networkidle2', timeout: 15000
    });
    await page.waitForSelector('body', { timeout: 5000 });
    const content = await page.evaluate(() => document.body.innerText);
    const html = await page.content();
    console.log(`\n\n=== ROUTE: ${route} ===\n`, content.slice(0, 5000));
  } catch (e) {
    console.log(`Skipping ${route}: ${e.message}`);
  }
}

await browser.close();
```

Run: `node scrape-wills.mjs > wills-content.txt`  
Then incorporate ALL text/sections from `wills-content.txt` into the צוואה tab/page of the new site.

---

## Tech Stack

- **Framework**: React + Vite (TypeScript)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + custom CSS variables for brand colors
- **Language/Direction**: Hebrew (RTL throughout — `dir="rtl"` on `<html>`)
- **Fonts**: `Heebo` (primary, Google Fonts — excellent Hebrew support) + `Frank Ruhl Libre` for headings
- **Deployment**: Netlify (static build output)
- **Build output**: `dist/` folder

---

## Project Structure

```
elisha-law/
├── public/
│   ├── images/           # Downloaded images from Wix CDN (see below)
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.tsx    # Nav with all tabs
│   │   ├── Footer.tsx
│   │   └── ContactForm.tsx
│   ├── pages/
│   │   ├── Home.tsx       # בית
│   │   ├── Blog.tsx       # עושים סדר (blog posts)
│   │   ├── About.tsx      # אודות
│   │   ├── Wills.tsx      # צוואה (NEW — from Lovable site)
│   │   └── Contact.tsx    # צור קשר
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── netlify.toml
└── package.json
```

---

## Brand & Design System

### Colors (CSS variables)

```css
:root {
  --color-primary: #1a3a5c;      /* Deep navy blue — authority, trust */
  --color-primary-light: #2a5a8c;
  --color-accent: #c8a96e;       /* Warm gold — prestige */
  --color-accent-light: #e8c98e;
  --color-bg: #f9f7f4;           /* Warm off-white */
  --color-bg-dark: #1a1a1a;
  --color-text: #1a1a1a;
  --color-text-muted: #5a5a5a;
  --color-border: #e0dbd3;
  --color-white: #ffffff;
}
```

### Typography

```css
/* Import in index.html */
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&family=Frank+Ruhl+Libre:wght@400;700;900&display=swap" rel="stylesheet">

body       { font-family: 'Heebo', sans-serif; }
h1, h2, h3 { font-family: 'Frank Ruhl Libre', serif; }
```

### Direction

Every page must be RTL:
```html
<html lang="he" dir="rtl">
```

```css
body { direction: rtl; text-align: right; }
```

---

## Images to Download

Download these images from the Wix CDN and save to `public/images/`:

```bash
# Attorney photo (main hero)
curl -o public/images/attorney-hero.png \
  "https://static.wixstatic.com/media/20add0_3eef00d1967f40d4be0883d05624449e~mv2.png/v1/fill/w_495,h_568,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/476355420_10235569587170143_6251574682942998069_n_edited.png"

# Attorney logo/portrait (vision section)
curl -o public/images/attorney-logo.png \
  "https://static.wixstatic.com/media/47f417_4476c15e70224c459ceb12b376c7f9ff~mv2.png/v1/fill/w_280,h_270,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ALON%20ELISHA%20(1)_edited_edited_edited.png"
```

Also try to extract and download any images used in the Lovable wills site (check the scraped HTML for `<img src=...>` tags).

---

## Navigation

```
בית | אודות | תחומי התמחות | עושים סדר | מיקום | צור קשר | צוואה בדיגיטל | חוזה דיגיטלי
```

- Desktop: horizontal nav bar, right-aligned (RTL), sticky on scroll
- Mobile: hamburger menu
- Active tab: gold underline accent (`var(--color-accent)`)
- Phone number `054-9260698` shown prominently in header (clickable `tel:` link)

---

## Page Content

### 1. בית (Home) — `/`

**Hero Section**
- Right side: Attorney photo (`attorney-hero.png`)
- Left side (RTL = visual left):
  - Firm name: `אלון אלישע — משרד עורכי דין`
  - Tagline: `ייעוץ וליווי משפטי מקיף, מדויק ומבוסס ניסיון רב-שנים`
  - CTA button: `צור קשר` (scroll to contact form)
  - CTA button 2: `054-9260698` (tel link)

**Practice Areas Section** — `תחומי התמחות`

Display as a 3-column card grid (2 on mobile):

| Icon | Title | Description |
|------|-------|-------------|
| ⚖️ | חוזים מסחריים | ליווי וניסוח חוזים מדויקים, מותאמים לצרכים שלך |
| 📋 | מכרזים | ייעוץ משפטי לאורך כל שלבי ההליך, משלב התנאים ועד לביצוע |
| ☀️ | אנרגיה מתחדשת | ליווי יזמים ובעלי נכסים בפרויקטים סולאריים |
| 🔒 | הגנת הפרטיות | ליווי וייעוץ בתחום הגנת הפרטיות, מאגרי מידע ומדיניות פרטיות |
| 📜 | צוואות וירושות | תכנון משפטי רגיש ומותאם אישית |
| 🤝 | ייפוי כוח מתמשך | עריכת מסמכים משפטיים המגנים על רצון האדם |

**Vision Section** — `החזון שלנו`
- Logo portrait (`attorney-logo.png`)
- Text: `משרדנו פועל מתוך מחויבות עמוקה לשירות משפטי מדויק, נגיש ומקצועי. אנו מאמינים ביצירת ערך אמיתי ללקוחותינו – לא רק בפתרון סכסוכים, אלא בליווי מניעתי חכם שמגן עליהם מראש. החזון שלנו הוא לשלב מומחיות משפטית עם הבנה עסקית ורגולטורית רחבה, וללוות כל לקוח בביטחון מלא.`

**Contact Form** (inline on home page)
- Fields: שם מלא | טלפון | אימייל | הודעה
- Submit button: `שלח`
- Success message: `תודה, נחזור אליכם בהקדם`
- Use `mailto:alonelisha3@gmail.com` via Netlify Forms (`netlify` attribute on form)

---

### 2. עושים סדר (Blog) — `/blog`

Blog section header: `עושים סדר — סיפורים ותובנות מזירת המשפט`

Display 3 blog post cards:

**Post 1**
- Title: `שוקלים לחתום על חוזה סולארי? עצרו רגע לחשוב.`
- Date: `10 נובמבר 2024`
- Excerpt: `25 שנות התחייבות, מערכת על הגג, הכנסה פאסיבית – אבל מה קורה כשהדברים מסתבכים? כעורך דין ויועץ אנרגיה, אני פוגש שוב ושוב בעלי נכסים שנכנסו להסכמים מבלי להבין את ההשלכות המשפטיות המלאות.`
- Read time: `2 דקות קריאה`

**Post 2**
- Title: `לפעמים המכרז מוכרע לא במספרים – אלא באנשים: למה הראיון האישי הוא הרגע הקריטי במכרזים הגדולים`
- Date: `10 נובמבר 2024`
- Excerpt: `בחלק מהמכרזים, הכל נראה מתמטי: מחיר, ניקוד טכני, עמידה בדרישות – והצעת המחיר הנמוכה זוכה. אבל ככל שהפרויקט גדול יותר, רגיש יותר, או מערב גורמים רגולטוריים – כך גדל משקל האדם שמאחורי ההצעה.`
- Read time: `2 דקות קריאה`

**Post 3**
- Title: `צדק לא מחייב חשבון בנק: סיוע משפטי לאישה קשת יום במסגרת תכנית "שכר מצווה"`
- Date: `6 נובמבר 2024`
- Excerpt: `בתוך עומס התיקים והעבודה השוטפת, ישנם מקרים שלא נמדדים בשכר טרחה – אלא בהשפעה על החיים עצמם. כך פגשתי את נ' – אישה צעירה, אם חד-הורית, שזקוקה לייצוג משפטי דחוף אך חסרת אמצעים.`
- Read time: `1 דקת קריאה`

Each card: title (navy), date + read time (muted), excerpt, `קרא עוד →` link button.

---

### 3. אודות (About) — `/about`

**Attorney profile:**
- Photo: `attorney-logo.png`
- Name: `עו"ד אלון אלישע`
- Long bio based on site vision text. Expand into professional paragraphs covering:
  - Background and founding philosophy
  - Areas of expertise
  - Commitment to accessible, preventive legal counsel
  - Combining legal expertise with business and regulatory understanding

**Stats bar** (3 items):
- `ניסיון רב שנים` | `ייצוג אישי ומקיף` | `זמינות ומענה מהיר`

---

### 4. צוואה (Wills) — `/wills`

> **IMPORTANT**: This page's content MUST be filled in from the scraped output of `https://hebrew-will-guide.lovable.app`. Run the Puppeteer scraper (Step 0) first and use ALL text, sections, FAQs, process steps, and CTAs found there.

**Fallback content** (use this ONLY if scrape fails):

**Hero**: 
- Headline: `רוצים להסדיר צוואה?`
- Subheadline: `התחילו עכשיו וקבלו ליווי מקצועי מותאם אישית`
- CTA: `לתיאום פגישה התקשרו: 054-9260698`

**Why a Will Section** — `למה חשוב לערוך צוואה?`
- Without a will, Israeli inheritance law (חוק הירושה) determines who gets your assets — often not what you'd want
- A will lets you protect your partner, children, or anyone else you care about
- Especially important for: blended families, business owners, property owners, people with specific wishes

**The Process** — `איך זה עובד?`

4-step process cards:
1. `פגישת ייעוץ ראשונית` — נבין את מצבכם, משפחתכם, ורצונותיכם
2. `תכנון מותאם אישית` — נבנה מסמך המשקף את רצונותיכם המדויקים
3. `עריכה וחתימה` — נדאג שהמסמך תקין משפטית ומוגן מפני ערעורים
4. `שמירה ורישום` — נסייע ברישום הצוואה ובשמירתה הבטוחה

**FAQ Section** — `שאלות נפוצות`
- `מה קורה אם אין צוואה?` — הרכוש מחולק לפי חוק הירושה, שלא תמיד משקף את רצון הנפטר
- `מי יכול לערוך צוואה?` — כל אדם מעל גיל 18 בגיר ובעל כשרות משפטית
- `האם צוואה ניתנת לשינוי?` — כן, ניתן לשנות או לבטל צוואה בכל עת כל עוד המצווה בחיים
- `מה זה ייפוי כוח מתמשך?` — מסמך משפטי המגדיר מי יקבל החלטות בשמכם אם לא תוכלו

**CTA Banner**: `מוכנים להתחיל? צרו קשר עוד היום`  
Button: `054-9260698` (tel link) + `שלח הודעה` (→ contact form)

---

### 5. צור קשר (Contact) — `/contact`

**Contact details:**
- 📞 `054-9260698`
- ✉️ `alonelisha3@gmail.com`
- 📍 Map embed or address (if found in scraped content)

**Contact form** (Netlify Forms):
```html
<form name="contact" method="POST" netlify>
  <input type="hidden" name="form-name" value="contact" />
  <!-- שם מלא, טלפון, אימייל, הודעה, שלח -->
</form>
```

---

### 6. חוזה דיגיטלי (Digital Contract) — `#contract`

> **Dev phase added: 2026-04-01**

A new tab added next to "צוואה בדיגיטל" in the navigation. Embeds the full contract creation tool built in React/Lovable.

**Implementation:**
- Section ID: `#contract`
- Embedded via `<iframe src="https://elisha-law.lovable.app/">` (full-height, 850px desktop / 600px mobile)
- Source code in `externalContent/Index (1).tsx` (React component with ContractTypeSelector, ContractForm, ContractPreview, AIContractGenerator)
- Built/saved version: `externalContent/image2.html`
- Live Lovable app: https://elisha-law.lovable.app/

**Functionality:**
- Two modes: "חוזה מתבנית" (template-based) and "חוזה עם AI" (AI-generated)
- Template flow: select contract type → fill details → preview/download
- AI flow: describe contract in plain language → AI generates it

**Note:** The iframe embeds the live Lovable app. If the Lovable app URL changes, update the `src` in `index.html` section `#contract`.

---

## Footer

```
© 2025 משרד עורכי דין אלון אלישע | alonelisha3@gmail.com | 054-9260698
[Facebook] [LinkedIn] [Instagram]
```

Social links (use placeholder `#` if actual URLs not found):
- Facebook: https://www.facebook.com/wix (replace with real if found)
- LinkedIn
- Instagram

---

## Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Custom Domain Setup (Namecheap → Netlify)

After deploying to Netlify, follow these steps:

### Step 1 — Add custom domain in Netlify
1. Go to **Site settings → Domain management → Add custom domain**
2. Enter `elisha-law.com` and `www.elisha-law.com`
3. Netlify will show you DNS records to configure

### Step 2 — Configure Namecheap DNS
Log in to Namecheap → **Domain List → Manage → Advanced DNS** and add:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 75.2.60.5 | Automatic |
| CNAME Record | www | `[your-netlify-subdomain].netlify.app` | Automatic |

Or use **Netlify DNS** (recommended — easier):
- In Namecheap: change **Nameservers** to "Custom DNS"
- Enter the 4 Netlify nameservers shown in your Netlify dashboard

### Step 3 — Enable HTTPS
Netlify auto-provisions a free Let's Encrypt SSL cert once DNS propagates (up to 48h).

---

## Local Development

```bash
# 1. Create project
npm create vite@latest elisha-law -- --template react-ts
cd elisha-law

# 2. Install dependencies
npm install react-router-dom @types/react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Install Puppeteer for scraping (Step 0)
npm install puppeteer
node scrape-wills.mjs

# 4. Run locally
npm run dev
# Opens at http://localhost:5173

# 5. Build for production
npm run build
npm run preview
```

---

## Deployment to Netlify

```bash
# Option A — Netlify CLI (recommended)
npm install -g netlify-cli
netlify login
netlify init        # link to new or existing site
netlify deploy --prod --dir=dist

# Option B — Netlify UI
# 1. Push code to GitHub
# 2. Go to https://app.netlify.com → "Add new site → Import from Git"
# 3. Set build command: npm run build
# 4. Set publish directory: dist
# 5. Deploy
```

---

## Quality Checklist

Before considering done, verify:

- [ ] All text is in Hebrew, fully RTL (`dir="rtl"`)
- [ ] Fonts render correctly in Hebrew (Heebo + Frank Ruhl Libre)
- [ ] All 5 nav tabs work and link to correct pages
- [ ] צוואה page contains all content from Lovable site scrape
- [ ] Contact form submits via Netlify Forms
- [ ] `054-9260698` is clickable as `tel:` link throughout
- [ ] Attorney photos display correctly
- [ ] Site is mobile-responsive (test at 375px and 768px)
- [ ] No broken images or links
- [ ] `netlify.toml` present for SPA routing
- [ ] Custom domain configured and HTTPS active
- [ ] Lighthouse score > 80 on Performance, Accessibility, SEO

---

## Key Details Summary

| Item | Value |
|------|-------|
| Attorney | עו"ד אלון אלישע |
| Phone | 054-9260698 |
| Email | alonelisha3@gmail.com |
| Domain | elisha-law.com |
| Language | Hebrew (RTL) |
| Hosting | Netlify (free tier) |
| DNS Registrar | Namecheap |
| Primary color | #1a3a5c (navy) |
| Accent color | #c8a96e (gold) |
| Font | Heebo + Frank Ruhl Libre |
| Wills source | https://hebrew-will-guide.lovable.app |
| Main source | https://www.elisha-law.com |