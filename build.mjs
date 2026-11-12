import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(root, "src", "pages");
const version = Date.now().toString(36);
const email = "hello@gardenofgrowingcounseling.com";

const lotus = `<svg class="lotus" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M24 42c0-8 .4-15 0-24"/><path d="M24 39c-5.2-1.6-9.4-6.4-10.4-13 4 1 7.4 4 10.4 9.2"/><path d="M24 39c5.2-1.6 9.4-6.4 10.4-13-4 1-7.4 4-10.4 9.2"/><path d="M24 36c-7.2-.8-13.2-4.6-15.2-10.2 4.8.3 9.6 3.1 15.2 7.4"/><path d="M24 36c7.2-.8 13.2-4.6 15.2-10.2-4.8.3-9.6 3.1-15.2 7.4"/><path d="M24 33c-3.3-6-4.8-12-3.6-18 2.5 5 3.6 10.2 3.6 15.6"/><path d="M24 33c3.3-6 4.8-12 3.6-18-2.5 5-3.6 10.2-3.6 15.6"/></g></svg>`;

const logo = `<img class="brand-logo" src="images/brand/logo.png" width="905" height="509" alt="Garden of Growing Counseling. Grow. Heal. Thrive.">`;

const arrow = `<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const sprig = `<svg class="sprig" viewBox="0 0 120 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M4 20h112"/><path d="M60 20c-6-8-14-10-20-8 4 6 12 9 20 8zM60 20c6-8 14-10 20-8-4 6-12 9-20 8z"/><circle cx="60" cy="20" r="2.2"/></g></svg>`;

const nav = [
  ["index", "Home"],
  ["about", "About"],
  ["services", "Services"],
  ["blog", "Blog"],
  ["contact", "Contact"],
];

const current = (key, active) => (key === active ? ` aria-current="page"` : "");

const header = (active) => `
<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="index.html" aria-label="Garden of Growing Counseling, home">
      ${logo}
    </a>
    <nav class="desktop-nav" aria-label="Primary">
      ${nav.map(([key, label]) => `<a href="${key}.html"${current(key, active)}><span>${label}</span></a>`).join("\n      ")}
    </nav>
    <div class="header-end">
      <a class="btn btn-sm" href="book.html"${current("book", active)}><span class="btn-text"><span class="btn-label">Book a Session</span><span class="btn-label-short">Book</span></span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu"><span class="bars"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<div class="nav-panel" id="mobile-nav" hidden>
  <div class="nav-panel-media" aria-hidden="true"><img src="images/garden/watercolor-leaves-frame.jpg" alt=""></div>
  <div class="nav-panel-inner">
    <nav class="nav-panel-links" aria-label="Mobile">
      ${[...nav, ["book", "Book a Session"]]
        .map(([key, label], i) => `<a href="${key}.html"${current(key, active)} style="--i:${i}"><span class="num">0${i + 1}</span><span class="txt">${label}</span></a>`)
        .join("\n      ")}
    </nav>
    <div class="nav-panel-foot" style="--i:6">
      <p>In person &amp; by video<br>Weekdays, by appointment</p>
      <a href="mailto:${email}">${email}</a>
    </div>
  </div>
</div>`;

const footer = `
<footer class="site-footer">
  <div class="footer-mark" aria-hidden="true">${lotus}</div>
  <div class="wrap">
    <div class="footer-top">
      <p class="footer-statement">Grow. Heal. <em>Thrive.</em></p>
      <a class="btn btn-light" href="book.html"><span class="btn-text">Book a Session</span>${arrow}</a>
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="footer-logo" href="index.html" aria-label="Garden of Growing Counseling, home">
          ${logo}
        </a>
        <p>A private therapy practice for people who want care that is steady, human, and unhurried.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h2>Visit</h2>
        <ul>
          <li>In person and by video</li>
          <li>Sessions by appointment</li>
          <li>Weekdays</li>
        </ul>
      </div>
      <div>
        <h2>Connect</h2>
        <ul>
          <li><a href="book.html">Book a session</a></li>
          <li><a href="mailto:${email}">${email}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-base">
      <span>© <span data-year>2026</span> Garden of Growing Counseling</span>
      <span>Care, at a human pace.</span>
    </div>
  </div>
</footer>`;

const layout = ({ title, description, page, active, body }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#F8F4ED">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="images/garden/cosmos-white-bokeh.jpg">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css?v=${version}">
  <script>document.documentElement.classList.add("js");try{if(sessionStorage.getItem("gogc-visited"))document.documentElement.classList.add("no-loader")}catch(e){}</script>
</head>
<body class="page-${page}">
  <div class="loader" aria-hidden="true">
    <div class="loader-inner">
      <img class="loader-logo" src="images/brand/logo.png" width="905" height="509" alt="">
    </div>
  </div>
  <a class="skip" href="#main">Skip to content</a>
${header(active)}
  <main id="main">
${body}
  </main>
${footer}
  <script src="js/main.js?v=${version}"></script>
</body>
</html>
`;

for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".html"))) {
  const raw = readFileSync(join(pagesDir, file), "utf8");
  const match = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->\s*/);
  if (!match) throw new Error(`Missing meta block in ${file}`);
  const meta = JSON.parse(match[1]);
  const page = basename(file, ".html");
  const body = raw
    .slice(match[0].length)
    .replaceAll("{{arrow}}", arrow)
    .replaceAll("{{lotus}}", lotus)
    .replaceAll("{{sprig}}", sprig)
    .replaceAll("{{email}}", email);
  writeFileSync(join(root, file), layout({ ...meta, page, active: meta.active ?? page, body }));
  console.log(`built ${file}`);
}
