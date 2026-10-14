// Crawls every URL in the sitemap of a running site and checks the SEO basics.
//
//   npm run build && npm start            (in another terminal)
//   npm run check:seo                     checks http://localhost:3000
//   npm run check:seo -- https://www.closertothefather.com
//
// Exits 1 if any hard check fails. Title/description length issues are warnings.
// For Google's own view, paste a URL into https://search.google.com/test/rich-results
// and https://validator.schema.org/.

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
let failures = 0;
let warnings = 0;
const fail = (url, msg) => (failures++, console.log(`FAIL  ${url}  ${msg}`));
const warn = (url, msg) => (warnings++, console.log(`warn  ${url}  ${msg}`));

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`));
  return m ? decode(m[1]) : null;
};
// Fetch through the local server even when the sitemap lists the production origin.
const local = (url) => {
  const u = new URL(url);
  return base + u.pathname + u.search;
};

const REQUIRED = {
  Organization: ["name", "url", "logo"],
  WebSite: ["name", "url"],
  Person: ["name"],
  Article: ["headline", "author", "datePublished", "dateModified", "publisher"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  ItemList: ["itemListElement"],
  HowTo: ["name", "step"],
  VideoObject: ["name", "description", "thumbnailUrl", "uploadDate"],
  AboutPage: ["url"],
};

function checkJsonLd(url, html) {
  const types = [];
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      fail(url, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    for (const node of data["@graph"] ?? [data]) {
      const type = node["@type"];
      types.push(type);
      for (const key of REQUIRED[type] ?? []) {
        const v = node[key];
        if (v == null || (Array.isArray(v) && v.length === 0) || v === "") fail(url, `${type} is missing "${key}"`);
      }
    }
  }
  return types;
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const lastmods = new Set([...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]));
console.log(`Sitemap: ${urls.length} URLs, ${lastmods.size} distinct lastmod values\n`);
if (lastmods.size < 2) warn("sitemap", "every URL has the same lastmod");

const titles = new Map();
const descriptions = new Map();
for (const url of urls) {
  const res = await fetch(local(url), { redirect: "manual" });
  if (res.status !== 200) {
    fail(url, `status ${res.status}`);
    continue;
  }
  const html = await res.text();
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(url, `${h1} H1 elements`);
  // Heading levels should not skip (h1 -> h3 with no h2 in between).
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      fail(url, `heading jumps from h${levels[i - 1]} to h${levels[i]}`);
      break;
    }
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) fail(url, "no canonical");
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) fail(url, `canonical points to ${canonical}`);
  const robots = meta(html, "name", "robots") || "";
  if (/noindex/.test(robots)) fail(url, "listed in the sitemap but noindex");
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = meta(html, "name", "description") ?? "";
  if (title.length < 50 || title.length > 60) warn(url, `title ${title.length} chars: ${title}`);
  if (desc.length < 140 || desc.length > 160) warn(url, `description ${desc.length} chars`);
  if (titles.has(title)) fail(url, `duplicate title (also ${titles.get(title)})`);
  if (descriptions.has(desc)) fail(url, `duplicate description (also ${descriptions.get(desc)})`);
  titles.set(title, url);
  descriptions.set(desc, url);
  for (const [attr, name] of [["property", "og:title"], ["property", "og:description"], ["property", "og:image"], ["property", "og:url"], ["name", "twitter:card"], ["name", "twitter:image"]]) {
    if (!meta(html, attr, name)) fail(url, `missing ${name}`);
  }
  const types = checkJsonLd(url, html);
  console.log(`ok    ${url}  [${types.join(", ")}]`);
}

// Pages that must stay out of the index, and the llms.txt file.
const wall = await (await fetch(`${base}/prayer-wall`)).text();
const prayerLink = wall.match(/href="(\/prayer-wall\/[0-9a-f-]{36})"/)?.[1];
if (prayerLink) {
  const html = await (await fetch(base + prayerLink)).text();
  if (!/<meta name="robots" content="noindex, follow"/.test(html)) fail(prayerLink, "prayer detail page is not noindex, follow");
  else console.log(`ok    ${prayerLink}  noindex, follow`);
} else warn("/prayer-wall", "no prayer detail link found to test");
const llms = await fetch(`${base}/llms.txt`);
const llmsText = await llms.text();
if (llms.status !== 200 || !llmsText.startsWith("# ")) fail("/llms.txt", `status ${llms.status}`);
else console.log(`ok    /llms.txt  ${llmsText.split("\n").length} lines`);

console.log(`\n${failures} failures, ${warnings} warnings`);
process.exit(failures ? 1 : 0);
