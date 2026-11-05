'use strict';
// Small offline renderer for the headings, tables, lists and fenced code in this guide.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'learning');
const stem = process.argv[2] || 'E1-1_Windows_따라하기';
if (path.basename(stem) !== stem) throw new Error('Use a Markdown stem, not a path');
const md = fs.readFileSync(path.join(root, stem + '.md'), 'utf8').replace(/^<!-- command-notes:(?:start|end) -->\r?\n/gm, '');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function inline(s) {
  const tokens = [];
  const token = html => '\u0000' + (tokens.push(html) - 1) + '\u0000';
  s = s.replace(/`([^`]+)`/g, (_, t) => token('<code>' + esc(t) + '</code>'));
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[^:\s)]+)\)/g, (_, label, url) => token('<a href="' + esc(url) + '">' + esc(label) + '</a>'));
  s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)]);
}
const lines = md.split(/\r?\n/), out = [], toc = [];
let i = 0, heading = 0;
const isTableDivider = s => /^\|\s*:?-+/.test(s || '');
const cells = s => s.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(x => x.trim());
while (i < lines.length) {
  const line = lines[i];
  if (!line.trim()) { i++; continue; }
  if (line.startsWith('```')) {
    const lang = line.slice(3).trim(); const body = []; i++;
    while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
    if (i >= lines.length) throw new Error('Unclosed code fence');
    i++;
    const langLabel = { bash: 'bash · Ubuntu 터미널 명령 (이 제목은 입력하지 않음)', powershell: 'PowerShell · Windows 명령', dockerfile: 'Dockerfile · 파일에 작성할 내용', markdown: 'Markdown · 문서에 작성할 예시' };
    out.push('<div class="code-label">' + esc(langLabel[lang] || lang || 'text') + '</div><pre><code>' + esc(body.join('\n')) + '</code></pre>');
    continue;
  }
  const h = /^(#{1,6}) (.+)$/.exec(line);
  if (h) {
    const level = h[1].length, id = 'section-' + (++heading);
    out.push('<h' + level + ' id="' + id + '">' + inline(h[2]) + '</h' + level + '>');
    if (level === 2) toc.push('<a href="#' + id + '">' + esc(h[2]) + '</a>');
    i++; continue;
  }
  if (line.startsWith('|') && isTableDivider(lines[i + 1])) {
    const heads = cells(line); i += 2; const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]));
    out.push('<div class="table-wrap"><table><thead><tr>' + heads.map(s => '<th>' + inline(s) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map(s => '<td>' + inline(s) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
    continue;
  }
  if (/^(?:- |\d+\. )/.test(line)) {
    const ordered = /^\d+\./.test(line), tag = ordered ? 'ol' : 'ul'; const items = [];
    while (i < lines.length && (ordered ? /^\d+\. / : /^- /).test(lines[i])) {
      let text = lines[i++].replace(ordered ? /^\d+\. / : /^- /, '');
      const check = /^\[([ x])\] /.exec(text);
      if (check) text = text.slice(4);
      items.push('<li>' + (check ? '<span class="checkbox" aria-hidden="true">' + (check[1] === 'x' ? '☑' : '☐') + '</span> ' : '') + inline(text) + '</li>');
    }
    out.push('<' + tag + '>' + items.join('') + '</' + tag + '>'); continue;
  }
  const para = [line]; i++;
  while (i < lines.length && lines[i].trim() && !/^(#|```|\||- |\d+\. )/.test(lines[i])) para.push(lines[i++]);
  out.push('<p>' + inline(para.join(' ')) + '</p>');
}
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(stem)}</title>
<style>
:root{font-family:"Malgun Gothic","Segoe UI",sans-serif;color:#233044;background:#f0f3f8;font-size:16px;line-height:1.85;scroll-behavior:smooth}*{box-sizing:border-box}body{margin:0}nav{position:fixed;inset:0 auto 0 0;width:280px;padding:28px 20px;background:#142b44;color:white;overflow-y:auto}nav strong{display:block;font-size:20px;margin-bottom:16px}nav a{display:block;color:#e0eafa;font-size:13px;text-decoration:none;padding:6px 8px;border-radius:6px}nav a:hover{background:#284561}main{margin:32px 40px 64px 320px;padding:42px 52px;max-width:1100px;background:white;border-radius:14px;box-shadow:0 6px 28px #142b440b}h1{font-size:2.2rem;line-height:1.35;color:#123a63;margin-top:0}h2{font-size:1.55rem;line-height:1.5;margin-top:64px;padding:14px 18px;background:#edf4fb;border-left:5px solid #2479bd;scroll-margin-top:20px}h3{font-size:1.15rem;margin-top:32px;color:#154977}p{margin:15px 0}a{color:#1266a4;text-underline-offset:3px}li{margin:8px 0}code{font-family:Consolas,"Cascadia Code",monospace;font-size:.9em;background:#edf1f6;padding:2px 5px;border-radius:4px;overflow-wrap:anywhere}pre{margin:0 0 24px;background:#162536;color:#e7f0fa;padding:20px 22px;overflow-x:auto;line-height:1.65;border-radius:0 0 8px 8px}pre code{font-size:14px;background:none;padding:0;color:inherit;white-space:pre;overflow-wrap:normal}.code-label{background:#263d53;color:#dce9f7;font:12px/1.8 Consolas,monospace;padding:5px 22px;border-radius:8px 8px 0 0;margin-top:18px}.table-wrap{overflow-x:auto;margin:22px 0}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;vertical-align:top;border:1px solid #d8e1eb;padding:12px 14px}th{background:#edf3f9;color:#153c65}tbody tr:nth-child(even){background:#fafcfe}.checkbox{color:#2b6c9e}strong{color:#143d64}nav strong{color:white}footer{margin-top:50px;border-top:1px solid #d8e1eb;padding-top:18px;color:#627183;font-size:13px}@media(max-width:1050px){nav{position:static;width:auto;max-height:280px}main{margin:20px;padding:28px}}@media(max-width:600px){main{margin:10px;padding:20px}h1{font-size:1.8rem}h2{font-size:1.3rem}pre{padding:15px}th,td{padding:8px}}@media print{nav{display:none}main{margin:0;padding:0;max-width:none;box-shadow:none}body,:root{background:white;font-size:11pt}h2{break-after:avoid}pre{white-space:pre-wrap;overflow:visible;background:#f2f4f7;color:#152b42}pre code{white-space:pre-wrap}.code-label{background:#e1e7ef;color:#152b42}a{color:inherit}table{font-size:10pt}}
</style></head><body><nav aria-label="목차"><strong>E1-1 실습 교재</strong>${toc.join('\n')}</nav><main>${out.join('\n')}<footer>수정 가능한 원본: ${esc(stem)}.md · 이 HTML은 외부 라이브러리 없이 열립니다.</footer></main></body></html>`;
let workbookHtml = stem === 'E1-1_Windows_따라하기' ? require('./add-mission-workbook.cjs')(html) : html;
const outputFile = path.join(root, stem + '.html');
if (fs.existsSync(outputFile)) {
  const prior = fs.readFileSync(outputFile, 'utf8').match(/<script id="workbook-data" type="application\/json">([\s\S]*?)<\/script>/);
  if (prior) {
    const saved = JSON.parse(prior[1]);
    if (saved.version === 1 && saved.steps && Object.keys(saved.steps).length) {
      workbookHtml = workbookHtml.replace(/(<script id="workbook-data" type="application\/json">)[\s\S]*?(<\/script>)/, (_, start, end) => start + JSON.stringify(saved).replace(/</g, '\\u003c') + end);
    }
  }
}
fs.writeFileSync(path.join(root, stem + '.html'), workbookHtml, 'utf8');
const required = ['Dockerfile', 'e11-web-bind', 'e11-vol-b', 'Get Ubuntu on WSL', '트러블슈팅', 'GitHub'];
for (const word of (stem === 'E1-1_Windows_따라하기' ? required : [])) if (!html.includes(word)) throw new Error('Missing guide content: ' + word);
console.log(JSON.stringify({output:stem+'.html', headings:heading, tocItems:toc.length, codeBlocks:(html.match(/<pre>/g)||[]).length, bytes:Buffer.byteLength(workbookHtml)}));
