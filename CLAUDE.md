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
לעדכון האתר החי לאחר שינויים:
```
netlify deploy --prod --dir .
```

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
- פונט: Heebo (עברית), Cormorant Garamond (כותרות)
- הלוגו בניווט: ELISHA-LAW (טקסט, לא תמונה)
- אין לציין שמות פלטפורמות חיצוניות באתר עצמו
