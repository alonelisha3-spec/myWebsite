# CLAUDE.md — Elisha Law Website Project

## Project Overview
אתר משרד עורכי דין אלון אלישע — בנוי כ-static site (HTML/CSS/JS).

## URLs
- **אתר חי (דומיין סופי):** https://elisha-law.com
- **אתר חי (Netlify):** https://elisha-law.netlify.app
- **Netlify dashboard:** https://app.netlify.com/projects/elisha-law
- **צוואה בדיגיטל (מוטמע):** https://hebrew-will-guide.lovable.app/

## DNS (Namecheap → Netlify)
- Nameservers: Namecheap BasicDNS
- A Record: `@` → `75.2.60.5`
- CNAME Record: `www` → `elisha-law.netlify.app`

## פרטי קשר / אוטומציה
- **מייל לידים:** alonelisha3@gmail.com
- **טלפון / ווטסאפ:** 054-9260698 (wa.me/972549260698)
- **פייסבוק:** https://www.facebook.com/profile.php?id=61579276704370
- **לינקדאין:** https://www.linkedin.com/company/107369376/
- **Formspree endpoint:** https://formspree.io/f/mgopabze (שני הטפסים שולחים לכאן → מייל אוטומטי לalonelisha3@gmail.com)

## Deploy
לעדכון האתר החי אחרי שינויים:
```
git add .
git commit -m "תיאור השינוי"
git push origin main
```
**הוסטינג:** GitHub Pages (חינמי, ללא מגבלות)
**לשעבר:** Netlify — הושהה בגלל מגבלת תוכנית חינמית

## מבנה הסקשנים
1. בית (hero) — תמונה + שם + רשימת תחומים + טופס ליד
2. אודות — החזון שלנו + לוגו
3. תחומי התמחות — 6 תחומים
4. עושים סדר — בלוג 3 כתבות
5. מיקום — מפה (רמת השרון)
6. צור קשר — טופס + פרטים
7. צוואה בדיגיטל — iframe מוטמע

## קבצים
- `index.html` — מבנה האתר
- `style.css` — עיצוב (RTL, עברית, navy+gold)
- `script.js` — לוגיקה (טפסים, נגישות, ניווט)
- `externalContent/` — תמונות ולוגו מקוריים

## הנחיות עיצוב
- שפה: עברית, RTL
- צבעים: navy `#0d1b2e` + gold `#c9a84c`
- פונט: Heebo (עברית), Cormorant Garamond (כותרות), Montserrat (לוגו)
- הלוגו בניווט: ELISHA-LAW (טקסט Montserrat, לא תמונה)
- אין לציין שמות פלטפורמות חיצוניות באתר עצמו

## שינויים אחרונים
- תחומי התמחות — תוכן מקצועי מלא
- לוגו ELISHA-LAW — פונט Montserrat (מינוס ישר)
- טפסים — Formspree (mgopabze) שולח למייל
- צוואה בדיגיטל — כרטיס עם כפתור CTA
- המבורגר מנו — מובייל
- דומיין — elisha-law.com על Netlify
- מאמר SEO — article-tzavaah.html (כתיבת צוואה בישראל)
- Sitemap — sitemap.xml + robots.txt
- Google Search Console — מחובר, sitemap נשלח, אינדוקס התבקש
- קמפיין השקה — campaign/content-calendar.md (6 פוסטים, השקה 4.4.2026)
- מאמר תוקן 1.4.2026 — תיקונים משפטיים (ראה למטה)

## תיקונים משפטיים במאמר (חשוב!)
- ידועים בציבור: אינם "ללא כלום" אוטומטית — זכאות תלויה בנסיבות ומצריכה הליך
- מנת הילגיטימה: לא קיימת בחוק הישראלי — הוסר
- עלות צוואה: 1,500–5,500 ₪ (לא 800–3,000)
- הפקדה ברשם: ההפקדה הראשונה חינמית לחלוטין
- כתיבה ללא עורך דין: מכוון לכלי הדיגיטלי + השלמה במשרד

## מודל עסקי — צוואה בדיגיטל
- כלי חינמי: https://hebrew-will-guide.lovable.app/ — משתמש מכין צוואה בעצמו
- ליד מגיע אוטומטית ל-alonelisha3@gmail.com
- עורך הדין מציע השלמה מקצועית בתשלום
- השקה רשמית: 4.4.2026

## קבצים נוספים
- `article-tzavaah.html` — מאמר SEO על כתיבת צוואה
- `sitemap.xml` — מפת אתר לגוגל
- `robots.txt` — הוראות לסורקי גוגל
- `campaign/content-calendar.md` — לוח פרסום לפייסבוק ולינקדאין
- `campaign/medium-plain.txt` — טקסט המאמר ל-Medium (ללא markdown)
- `dashboard.html` — דשבורד ניהול פרויקט (פתח בדפדפן מקומי)
- `package.json` — npm scripts: `npm run optimize` (מינוי CSS/JS/HTML)
- `.github/workflows/deploy.yml` — GitHub Actions: דיפלוי אוטומטי ל-Pages בכל push

## כלי פיתוח (npm)
```
npm run optimize       # מינוי CSS + JS + HTML (הכל ביחד)
npm run minify-css     # cleancss → style.min.css
npm run minify-js      # terser → script.min.js
npm run minify-html    # html-minifier → index.min.html
```
devDependencies: clean-css-cli, terser, html-minifier-terser
