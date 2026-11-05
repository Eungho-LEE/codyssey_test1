(function () {
  'use strict';
  const VERSION = 1;
  const KEY = 'codyssey-e11-workbook-v1';
  const fields = ['commands', 'output', 'notes', 'evidence'];
  const labels = { commands: '실행한 명령', output: '실제 출력 결과', notes: '배운 점·문제와 해결', evidence: '증거 파일·링크·추가 메모' };
  const status = document.getElementById('workbook-status');
  const sections = Array.from(document.querySelectorAll('[data-workbook-step]'));
  let data = { version: VERSION, updatedAt: '', steps: {} };
  let timer;
  function message(text) { status.textContent = text; }
  function valid(d) {
    return d && d.version === VERSION && typeof d.steps === 'object' && d.steps !== null;
  }
  try {
    const embedded = JSON.parse(document.getElementById('workbook-data').textContent);
    if (valid(embedded)) data = embedded;
    const cached = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (valid(cached) && String(cached.updatedAt || '') > String(data.updatedAt || '')) data = cached;
  } catch (_) { /* File URLs may disable browser storage; HTML save still works. */ }
  function step(id) {
    if (!data.steps[id] || typeof data.steps[id] !== 'object') data.steps[id] = {};
    const s = data.steps[id];
    if (!Array.isArray(s.images)) s.images = [];
    return s;
  }
  function collect() {
    sections.forEach(section => {
      const s = step(section.dataset.workbookStep);
      s.title = section.dataset.title;
      fields.forEach(key => { s[key] = section.querySelector('[data-field="' + key + '"]').value; });
      s.done = section.querySelector('[data-field="done"]').checked;
    });
    return data;
  }
  function updateProgress() {
    const done = sections.filter(s => s.querySelector('[data-field="done"]').checked).length;
    document.getElementById('workbook-progress').textContent = done + ' / ' + sections.length + '단계 완료';
  }
  function cache() {
    collect();
    data.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      message('브라우저에 임시 저장됨 · 파일로 보관하려면 「기록 포함 HTML 저장」을 누르세요.');
    } catch (_) {
      message('브라우저 임시 저장을 사용할 수 없습니다. 「기록 포함 HTML 저장」으로 파일을 보관하세요.');
    }
    updateProgress();
  }
  function drawImages(section) {
    const s = step(section.dataset.workbookStep);
    const gallery = section.querySelector('.evidence-gallery');
    gallery.replaceChildren();
    s.images.forEach((record, index) => {
      if (!record || !/^data:image\/(png|jpeg|webp|gif);base64,/.test(record.src || '')) return;
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = record.src;
      img.alt = record.name || '실습 증거';
      const caption = document.createElement('figcaption');
      caption.textContent = record.name || '실습 증거';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '이 이미지 제거';
      remove.addEventListener('click', () => { s.images.splice(index, 1); drawImages(section); cache(); });
      figure.append(img, caption, remove);
      gallery.append(figure);
    });
  }
  function restore() {
    sections.forEach(section => {
      const s = step(section.dataset.workbookStep);
      fields.forEach(key => { section.querySelector('[data-field="' + key + '"]').value = typeof s[key] === 'string' ? s[key] : ''; });
      section.querySelector('[data-field="done"]').checked = s.done === true;
      drawImages(section);
    });
    updateProgress();
  }
  function stamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  function serialize() {
    collect();
    data.updatedAt = new Date().toISOString();
    const doc = document.documentElement.cloneNode(true);
    // Serialize input properties explicitly. Ctrl+S is not relied upon for form state.
    doc.querySelectorAll('textarea').forEach(el => { el.textContent = ''; });
    doc.querySelectorAll('input[type="checkbox"]').forEach(el => el.removeAttribute('checked'));
    doc.querySelectorAll('.evidence-gallery').forEach(el => el.replaceChildren());
    doc.querySelector('#workbook-data').textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    return '<!doctype html>\n' + doc.outerHTML;
  }
  function codeBlock(text) {
    const runs = text.match(/`+/g) || [];
    const fence = '`'.repeat(Math.max(2, ...runs.map(x => x.length)) + 1);
    return fence + 'text\n' + text + '\n' + fence;
  }
  function markdown() {
    collect();
    const result = ['# E1-1 실습 기록 초안', '', 'HTML 기록장에서 내보낸 본인의 기록입니다. 제출 전 개요·실행 환경·재현 방법·트러블슈팅 2건과 증거 경로를 정리하세요.', '', '## 수행 체크리스트', ''];
    sections.forEach(section => {
      const s = step(section.dataset.workbookStep);
      result.push('- [' + (s.done ? 'x' : ' ') + '] ' + section.dataset.title);
    });
    sections.forEach(section => {
      const s = step(section.dataset.workbookStep);
      result.push('', '## ' + section.dataset.title, '');
      fields.forEach(key => {
        const text = typeof s[key] === 'string' ? s[key].trim() : '';
        if (text) result.push('### ' + labels[key], '', key === 'commands' || key === 'output' ? codeBlock(text) : text, '');
      });
      s.images.forEach((im, i) => {
        if (!/^data:image\/(png|jpeg|webp|gif);base64,/.test(im.src || '')) return;
        result.push('증거 이미지 ' + (i + 1) + ': ' + (im.name || '캡처') + ' — HTML 기록장에 포함됨. 저장소 docs/images/에 파일을 넣고 Markdown 이미지 링크를 추가하세요.', '');
      });
    });
    return result.join('\n') + '\n';
  }
  sections.forEach(section => {
    section.addEventListener('input', event => {
      if (!event.target.matches('textarea,input[type="checkbox"]')) return;
      message('입력 중…');
      clearTimeout(timer); timer = setTimeout(cache, 400);
    });
    section.querySelector('input[type="file"]').addEventListener('change', async event => {
      const input = event.target;
      for (const file of Array.from(input.files)) {
        if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 8 * 1024 * 1024) {
          message('PNG·JPG·WebP·GIF 이미지(개당 8MB 이하)를 선택하세요.');
          continue;
        }
        try {
          const src = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('이미지 읽기 실패'));
            reader.readAsDataURL(file);
          });
          step(section.dataset.workbookStep).images.push({ name: file.name, src });
          drawImages(section); cache();
        } catch (_) { message('이미지를 읽지 못했습니다. 다시 선택해주세요.'); }
      }
      input.value = '';
    });
  });
  document.getElementById('save-workbook').addEventListener('click', () => {
    download('E1-1_내실습기록_' + stamp() + '.html', serialize(), 'text/html;charset=utf-8');
    message('기록을 포함한 HTML 다운로드를 요청했습니다. 다운로드 폴더에서 파일이 저장됐는지 확인하세요.');
  });
  document.getElementById('export-markdown').addEventListener('click', () => {
    download('E1-1_README_기록초안.md', '\ufeff' + markdown(), 'text/markdown;charset=utf-8');
    message('Markdown 초안 다운로드를 요청했습니다. 이미지는 HTML에 보관되며 저장소에는 별도 파일로 추가하세요.');
  });
  document.getElementById('export-backup').addEventListener('click', () => {
    collect(); data.updatedAt = new Date().toISOString();
    download('E1-1_기록백업_' + stamp() + '.json', JSON.stringify(data, null, 2), 'application/json');
    message('기록·이미지 백업 JSON 다운로드를 요청했습니다.');
  });
  document.getElementById('import-backup').addEventListener('change', async event => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      const candidate = JSON.parse(await file.text());
      if (!valid(candidate)) throw new Error('지원하지 않는 기록 파일');
      if (!window.confirm('현재 기록을 선택한 백업 내용으로 바꿀까요? 필요하면 먼저 HTML 저장 또는 백업을 해주세요.')) return;
      data = candidate; restore(); cache();
      message('백업을 불러왔습니다. HTML로 저장해 보관할 수 있습니다.');
    } catch (_) { message('올바른 E1-1 기록 백업 JSON을 선택하세요.'); }
    event.target.value = '';
  });
  window.addEventListener('beforeunload', () => {
    collect();
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  });
  restore();
  message(data.updatedAt ? '저장된 기록을 불러왔습니다. 계속 작성할 수 있습니다.' : '각 단계 끝의 기록란에 작성하세요. 파일 보관은 「기록 포함 HTML 저장」을 사용하세요.');
  // Exposed for local validation; no network or external services are used.
  window.missionWorkbook = { collect, serialize, markdown };
}());
