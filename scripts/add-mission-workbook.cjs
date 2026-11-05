'use strict';
const fs = require('node:fs');
const path = require('node:path');
module.exports = function addWorkbook(html) {
  const client = fs.readFileSync(path.join(__dirname, 'mission-workbook-client.js'), 'utf8');
  let count = 0;
  html = html.replace(/(<h2 id="[^"]+">([^<]+)<\/h2>)([\s\S]*?)(?=<h2 |<footer>)/g, (whole, heading, title, content) => {
    const match = /^(\d+)\./.exec(title);
    if (!match) return whole;
    count++;
    const id = match[1];
    const entry = `<section class="workbook-entry" data-workbook-step="${id}" data-title="${title}" aria-label="${title} 실습 기록">
<div class="entry-title"><h3>✍ ${id}단계 · 내 실습 기록</h3><label class="done-label"><input type="checkbox" data-field="done"> 이 단계 완료</label></div>
<p class="entry-hint">실제로 수행한 내용을 적으세요. 작성 예시나 예상 결과는 실제 결과와 구분합니다.</p>
<label for="commands-${id}">실행한 명령</label><textarea id="commands-${id}" data-field="commands" rows="4" placeholder="터미널에 입력한 명령을 붙여넣으세요." spellcheck="false"></textarea>
<label for="output-${id}">실제 출력 결과</label><textarea id="output-${id}" data-field="output" rows="5" placeholder="실제로 나온 결과를 붙여넣으세요. 비밀번호·토큰은 제외합니다." spellcheck="false"></textarea>
<label for="notes-${id}">배운 점·문제와 해결</label><textarea id="notes-${id}" data-field="notes" rows="4" placeholder="무엇을 확인했는지, 막힌 문제와 해결 과정을 본인 말로 적으세요."></textarea>
<label for="evidence-${id}">증거 파일·링크·추가 메모</label><textarea id="evidence-${id}" data-field="evidence" rows="3" placeholder="예: docs/logs/03-terminal.txt 또는 캡처에 대한 설명"></textarea>
<label for="images-${id}">캡처 첨부 (PNG·JPG·WebP·GIF, 개당 8MB 이하)</label><input id="images-${id}" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple>
<div class="evidence-gallery"></div></section>`;
    return heading + content + entry;
  });
  if (count !== 15) throw new Error('Expected 15 step records, got ' + count);
  const toolbar = `<section class="workbook-toolbar" aria-label="기록장 저장">
<h2>직접 쓰는 실습 기록장</h2><p>교재를 읽고 각 단계 끝의 입력란에 먼저 기록하세요. 나중에 README 초안으로 내보낼 수 있습니다.</p>
<div class="workbook-actions"><button type="button" id="save-workbook">기록 포함 HTML 저장</button><button type="button" id="export-markdown">README 초안(.md) 내보내기</button><button type="button" id="export-backup">기록 백업(.json)</button><label class="import-label">백업 불러오기<input type="file" id="import-backup" accept=".json,application/json"></label></div>
<p><strong id="workbook-progress">0 / 15단계 완료</strong></p><p id="workbook-status" role="status" aria-live="polite"></p>
<details><summary>저장과 다시 열기 안내</summary><ol><li>입력 내용은 가능한 경우 같은 브라우저에 임시 저장됩니다.</li><li><strong>확실한 파일 보관은 「기록 포함 HTML 저장」을 누르세요.</strong> 다운로드 폴더에 작성 내용·이미지를 포함한 새 HTML이 생깁니다. 원본 파일을 자동 덮어쓰지는 않습니다.</li><li>저장한 HTML을 다시 열면 계속 작성할 수 있습니다. 이전 파일보다 최근 브라우저 임시 기록이 있으면 최근 기록을 불러옵니다.</li><li>Ctrl+S만으로 입력 내용이 보존된다고 가정하지 마세요. 위 저장 버튼을 사용하세요.</li><li>README 내보내기는 작성한 텍스트 기록의 초안입니다. 캡처 이미지는 HTML에 포함되고, GitHub에는 이미지 파일을 따로 넣어 링크합니다.</li><li>브라우저 데이터를 지우거나 파일을 옮기기 전에 HTML 또는 JSON 백업을 저장하세요. 기록은 외부 서버로 전송되지 않습니다.</li></ol></details></section>`;
  html = html.replace('<main>', '<main>' + toolbar);
  html = html.replace('</head>', `<style>
.workbook-toolbar{border:2px solid #9bbdd9;background:#f3f8fe;padding:22px;border-radius:12px;margin-bottom:40px}.workbook-toolbar h2{margin:0 0 10px;padding:0;border:0;background:none}.workbook-actions{display:flex;flex-wrap:wrap;gap:10px}button,.import-label{font:inherit;font-size:14px;border:1px solid #b6c9db;border-radius:7px;padding:9px 13px;background:white;color:#164b75;cursor:pointer}button:hover,.import-label:hover{background:#e4effa}#save-workbook{background:#155f9a;color:white;border-color:#155f9a}.import-label{display:inline-flex;align-items:center}.import-label input{width:180px;margin-left:8px;font-size:12px}#workbook-status,.entry-hint{font-size:13px;color:#52667a}details{font-size:14px}summary{cursor:pointer;font-weight:bold}.workbook-entry{border:1px solid #a8c7de;border-radius:12px;background:#f7fbff;padding:24px;margin:35px 0 50px}.entry-title{display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}.entry-title h3{margin:0}.done-label{font-size:14px;white-space:nowrap}.workbook-entry>label{display:block;font-size:14px;font-weight:bold;margin:18px 0 6px}.workbook-entry textarea{display:block;width:100%;padding:12px;border:1px solid #b9c9d8;border-radius:7px;background:white;color:#203348;font:14px/1.7 "Malgun Gothic",sans-serif;resize:vertical;min-height:70px}.workbook-entry textarea[data-field=commands],.workbook-entry textarea[data-field=output]{font-family:Consolas,"Malgun Gothic",monospace}.workbook-entry textarea:focus{outline:2px solid #4b94cb;outline-offset:1px}.evidence-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:16px}.evidence-gallery figure{margin:0;border:1px solid #cfdeeb;background:white;padding:10px;border-radius:8px}.evidence-gallery img{display:block;max-width:100%;max-height:420px;object-fit:contain;margin:auto}.evidence-gallery figcaption{font-size:12px;overflow-wrap:anywhere}.evidence-gallery button{font-size:12px;padding:4px 8px;margin-top:6px}@media print{.workbook-actions,.workbook-toolbar details,.workbook-entry input[type=file],.evidence-gallery button{display:none}.workbook-entry textarea{height:auto;min-height:100px}.workbook-entry{break-inside:auto}.workbook-toolbar{margin-bottom:20px}}
</style></head>`);
  html = html.replace('</body>', '<script id="workbook-data" type="application/json">{"version":1,"updatedAt":"","steps":{}}</script><script>' + client + '</script></body>');
  return html;
};
