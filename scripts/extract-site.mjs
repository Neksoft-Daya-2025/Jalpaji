import { mkdir, writeFile } from 'node:fs/promises';

const base = 'http://127.0.0.1/jalpaji';
const routes = [
  ['/', 'home'],
  ['/agro-commodities/', 'agro-commodities'],
  ['/engineering-industrial-services/', 'engineering-industrial-services'],
  ['/jalpaji-complex-2/', 'jalpaji-complex'],
  ['/about-us/', 'about-us'],
  ['/contact/', 'contact'],
  ['/read-more/', 'read-more'],
  ['/south-africa/', 'south-africa'],
  ['/tanzania/', 'tanzania'],
  ['/our-registration-certificates/', 'registration-certificates'],
  ['/apeda-registration/', 'apeda-registration'],
  ['/gst-registration-certificate/', 'gst-registration-certificate'],
  ['/fassai-registration-certificate/', 'fassai-registration-certificate'],
  ['/privacy-policy/', 'privacy-policy']
];

function decodeEntities(value) {
  return value
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function extractMain(html) {
  const startMatch = html.match(/<main\b[^>]*id=["']content["'][^>]*>/i);
  if (!startMatch) return extractElementorPage(html);
  const start = startMatch.index + startMatch[0].length;
  let index = start;
  let depth = 1;
  const tagRe = /<\/?main\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let match;
  while ((match = tagRe.exec(html))) {
    if (match[0][1] === '/') depth -= 1;
    else depth += 1;
    if (depth === 0) {
      index = match.index;
      break;
    }
  }
  return html.slice(start, index);
}

function extractElementorPage(html) {
  const marker = /<div\b[^>]*data-elementor-type=["']wp-page["'][^>]*>/i;
  const startMatch = html.match(marker);
  if (!startMatch) return '';
  const startTagIndex = startMatch.index;
  const contentStart = startTagIndex;
  let depth = 0;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = startTagIndex;
  let match;
  while ((match = tagRe.exec(html))) {
    if (match[0][1] === '/') depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return `<div class="page-content">${html.slice(contentStart, tagRe.lastIndex)}</div>`;
    }
  }
  return html.slice(contentStart);
}

function cleanupHtml(html) {
  return html
    .replaceAll(`${base}/wp-content/`, '/wp-content/')
    .replaceAll('https://jalpaji.com/wp-content/', '/wp-content/')
    .replaceAll(`${base}/`, '/')
    .replaceAll('https://jalpaji.com/', '/')
    .replaceAll('http://127.0.0.1/jalpaji/', '/')
    .replace(/\sdata-src=/g, ' src=')
    .replace(/\sdata-srcset=/g, ' srcset=')
    .replace(/\sdata-sizes=/g, ' sizes=')
    .replace(/\ssrc=["']data:image\/svg\+xml[^"']*["']/g, '')
    .replaceAll(' loading="lazy"', '')
    .replaceAll(' decoding="async"', '');
}

function stylesheetPath(href) {
  if (!href.includes('/wp-content/')) return null;
  return href
    .replace(`${base}/wp-content/`, '/wp-content/')
    .replace('https://jalpaji.com/wp-content/', '/wp-content/')
    .replace(/ver=[^&]+/g, '')
    .replace(/[?&]$/, '');
}

await mkdir(new URL('../src/', import.meta.url), { recursive: true });

const pages = [];
const styles = new Set();

for (const [route, slug] of routes) {
  const response = await fetch(`${base}${route}`);
  if (!response.ok) throw new Error(`${route} failed: ${response.status}`);
  const html = await response.text();
  const title = decodeEntities((html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] || 'Jalpaji').trim());
  const main = cleanupHtml(extractMain(html));
  const stylesheetMatches = html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi);
  for (const match of stylesheetMatches) {
    const local = stylesheetPath(match[1]);
    if (local) styles.add(local);
  }
  pages.push({ path: route, slug, title, html: main });
  console.log(`extracted ${route} ${main.length} chars`);
}

const moduleBody = `export const stylesheets = ${JSON.stringify([...styles], null, 2)};\n\nexport const pages = ${JSON.stringify(pages, null, 2)};\n`;
await writeFile(new URL('../src/site-data.js', import.meta.url), moduleBody);
