(() => {
  'use strict';

  const STORAGE_KEY = 'pogo-map:counts:v1';
  const byId = Object.fromEntries(POKEMON.map((p) => [p.id, p]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // ── 체크리스트 저장소 ─────────────────────────
  // { id: 1 } 형태로 저장 (예전 버전의 마릿수 기록도 1 이상이면 잡은 것으로 취급)
  let counts = {};
  try { counts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { counts = {}; }
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(counts)); } catch { /* 무시 */ } };
  const isCaught = (id) => (counts[id] || 0) > 0;
  // 이로치는 { id: 1 } 로 따로 저장. 일반(counts)과 이로치는 서로 독립 (이로치만 있는 경우도 있음)
  const SHINY_KEY = 'pogo-map:shiny:v1';
  let shiny = {};
  try { shiny = JSON.parse(localStorage.getItem(SHINY_KEY)) || {}; } catch { shiny = {}; }
  const saveShiny = () => { try { localStorage.setItem(SHINY_KEY, JSON.stringify(shiny)); } catch { /* 무시 */ } };
  const isShiny = (id) => !!shiny[id];
  function setCaught(id, caught) {
    if (caught) counts[id] = 1;
    else delete counts[id];
    save();
    renderAll();
  }
  function setShiny(id, on) {
    if (on) shiny[id] = 1; else delete shiny[id];
    saveShiny();
    renderAll();
  }
  const pageOf = (p) => (p.zone === 'UNOWN' ? 'unown' : p.raid ? 'raid' : 'wild');

  // ── 표시 헬퍼 ────────────────────────────────
  const spriteUrl = (p, shinySprite = false) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinySprite ? 'shiny/' : ''}${p.sprite || p.dex}.png`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dexNo = (p) => '#' + String(p.dex).padStart(3, '0');

  function pokeItem(p) {
    const li = document.createElement('li');
    li.className = 'poke' + (isCaught(p.id) ? ' owned' : '') + (isShiny(p.id) ? ' shiny-owned' : '');
    const tip = [p.note, p.approx && '경계가 특히 부정확할 수 있음'].filter(Boolean).join(' · ');
    li.innerHTML = `
      <img loading="lazy" alt="" src="${spriteUrl(p, isShiny(p.id))}">
      <div>
        <div class="name">${dexNo(p)} ${esc(p.ko)}
          ${p.form ? `<span class="form">${esc(p.form)}</span>` : ''}
          ${p.raid ? '<span class="tag">레이드</span>' : ''}
          ${p.approx ? `<span class="warn" title="${esc(tip)}">⚠</span>` : ''}</div>
        <div class="meta">${esc(p.en)}${p.formEn ? ' · ' + esc(p.formEn) : ''} — ${esc(p.region)}${p.note ? ' · ' + esc(p.note) : ''}</div>
      </div>
      <div class="checks">
        <label><input type="checkbox" class="catch" ${isCaught(p.id) ? 'checked' : ''}>일반</label>
        <label><input type="checkbox" class="shiny" ${isShiny(p.id) ? 'checked' : ''}>이로치</label>
      </div>`;
    $('.catch', li).addEventListener('change', (e) => setCaught(p.id, e.target.checked));
    $('.shiny', li).addEventListener('change', (e) => setShiny(p.id, e.target.checked));
    return li;
  }

  // ── 검색어 생성 ──────────────────────────────
  function compressNumbers(nums) {
    const out = [];
    for (let i = 0; i < nums.length; i++) {
      let j = i;
      while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
      out.push(j - i >= 2 ? `${nums[i]}-${nums[j]}` : nums.slice(i, j + 1).join(','));
      i = j;
    }
    return out.join(',');
  }

  function buildQuery(entries, opts) {
    let list = entries;
    if (!opts.evo) list = list.filter((p) => !p.evo);
    if (opts.owned === 'caught') list = list.filter((p) => isCaught(p.id));
    if (opts.owned === 'shiny') list = list.filter((p) => isShiny(p.id));
    if (!list.length) return '';
    let q;
    if (opts.mode === 'name') q = [...new Set(list.map((p) => p.ko))].join(',');
    else q = compressNumbers([...new Set(list.map((p) => p.dex))].sort((a, b) => a - b));
    const suffix = opts.suffix.trim();
    if (suffix) q += (/^[&,|]/.test(suffix) ? '' : '&') + suffix;
    return q;
  }

  // 검색어 박스: 옵션은 박스별로 유지
  function mountQuery(container, getEntries, defaults = {}) {
    const node = $('#query-tpl').content.firstElementChild.cloneNode(true);
    container.appendChild(node);
    const mode = $('.q-mode', node), owned = $('.q-owned', node), evo = $('.q-evo', node);
    const suffix = $('.q-suffix', node), out = $('.q-out', node), note = $('.q-note', node);
    evo.checked = !!defaults.evo;
    const update = () => {
      const entries = getEntries();
      const q = buildQuery(entries, { mode: mode.value, owned: owned.value, evo: evo.checked, suffix: suffix.value });
      out.textContent = q || '(대상 없음)';
      const notes = [];
      if (entries.some((p) => p.form)) notes.push('검색어는 폼을 구분하지 못합니다. 같은 번호의 다른 폼(예: 깝질무 서쪽/동쪽)도 함께 검색됩니다.');
      if (mode.value === 'name') notes.push('한글 이름은 게임 언어가 한국어일 때만 동작합니다. 도감번호는 언어와 무관합니다.');
      note.textContent = notes.join(' ');
    };
    [mode, owned, evo].forEach((el) => el.addEventListener('change', update));
    suffix.addEventListener('input', update);
    $('.q-copy', node).addEventListener('click', async (e) => {
      const text = out.textContent;
      if (!text || text.startsWith('(')) return;
      try { await navigator.clipboard.writeText(text); e.target.textContent = '복사됨'; }
      catch { e.target.textContent = '실패'; }
      setTimeout(() => (e.target.textContent = '복사'), 1200);
    });
    update();
    return update;
  }

  // ── 벤다이어그램 ─────────────────────────────
  function chip(p) {
    const caught = isCaught(p.id), sh = isShiny(p.id);
    const el = document.createElement('div');
    // area 가 없는 포켓몬(지형 기준·안농)은 위치로 판정할 수 없으므로 강조·흐림 둘 다 하지 않음
    const mark = !point || !p.area ? '' : inArea(p.area, point.lat, point.lng) ? ' here' : ' dim';
    el.className = 'chip' + (caught ? ' owned' : '') + (sh ? ' shiny-owned' : '') + mark;
    el.dataset.id = p.id;
    const info = [`${p.ko}${p.form ? ' ' + p.form : ''} — ${p.region}`, p.note, p.approx && '⚠ 경계가 특히 부정확할 수 있음'];
    el.innerHTML = `
      <button type="button" class="shiny-btn" aria-pressed="${sh}" title="${sh ? '이로치 체크 해제' : '이로치로 체크'}">✨</button>
      <button type="button" class="c-body" aria-pressed="${caught}">
        <span class="check-mark" aria-hidden="true"></span>
        <img loading="lazy" alt="" src="${spriteUrl(p, sh)}">
        <span class="cn">${esc(p.ko)} ${p.approx ? '<span class="w">⚠</span>' : ''}</span>
        ${p.form ? `<span class="cf">${esc(p.form)}</span>` : ''}
        ${p.scope ? `<span class="cs">📍${esc(p.scope)}</span>` : ''}
      </button>`;
    const body = $('.c-body', el);
    body.title = [...info, caught ? '눌러서 일반 체크 해제' : '눌러서 일반으로 체크'].filter(Boolean).join('\n');
    body.addEventListener('click', () => setCaught(p.id, !caught));
    $('.shiny-btn', el).addEventListener('click', () => setShiny(p.id, !sh));
    return el;
  }

  function renderVenn() {
    $$('[data-zone]').forEach((cell) => {
      const zone = cell.dataset.zone;
      const page = cell.closest('.page').dataset.page;
      const box = $('.chips', cell);
      box.innerHTML = '';
      // 권역 전체 → 일부 지역 순, 같은 그룹 안에서는 도감번호 순
      const list = POKEMON.filter((p) => p.zone === zone && !p.evo && pageOf(p) === page)
        .sort((a, b) => (!!a.scope - !!b.scope) || a.dex - b.dex);
      // 폼 다이어그램에서는 폼이 많은 트리미앙을 아랫줄로 따로 모음
      const isFurfrou = (p) => zone.startsWith('F_') && p.dex === 676;
      list.filter((p) => !isFurfrou(p)).forEach((p) => box.appendChild(chip(p)));
      const furfrou = list.filter(isFurfrou);
      if (furfrou.length) {
        box.appendChild(Object.assign(document.createElement('span'), { className: 'row-break' }));
        furfrou.forEach((p) => box.appendChild(chip(p)));
      }
    });

    // 위치가 있으면 해당 권역 강조
    // F_ 접두어(폼 다이어그램)도 같은 권역으로 판정
    const zoneHit = point ? {
      AM: inArea('americas', point.lat, point.lng),
      EM: inArea('emea', point.lat, point.lng),
      AP: inArea('apac', point.lat, point.lng),
      WEST: point.lng < 0, EAST: point.lng >= 0,
      ISLAND: inArea('pau_islands', point.lat, point.lng),
      IBERIA: inArea('iberia', point.lat, point.lng),
      FAR_NORTH: inArea('pachirisu_zone', point.lat, point.lng),
      NORTH: point.lat >= 0, SOUTH: point.lat < 0, TROPICS: inArea('tropics', point.lat, point.lng),
    } : {};
    const hit = (zone) => !!zoneHit[zone.replace(/^(F|PT)_/, '')];
    $$('[data-zone-ell]').forEach((el) => el.classList.toggle('active', hit(el.dataset.zoneEll)));
    $$('.split-cols > [data-zone]').forEach((el) => el.classList.toggle('active', hit(el.dataset.zone)));
    $('.board').classList.toggle('has-point', !!point);
    $('#clear-point').hidden = !point;
    $('#board-status').textContent = point
      ? `${point.label || `${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}`} 에서 나오는 포켓몬을 강조했어요.`
      : '포켓몬을 누르면 일반, ✨를 누르면 이로치로 따로 체크돼요.';
    // 탭 이름에 그 페이지에서 강조된(현재 위치에서 나오는) 수 표시
    const PAGE_LABEL = { wild: '야생', raid: '레이드', unown: '안농' };
    $$('.page-tab').forEach((t) => {
      const page = t.dataset.page;
      const n = placeEntries.filter((p) => !p.evo && pageOf(p) === page).length;
      t.textContent = PAGE_LABEL[page] + (point && page !== 'unown' ? ` ${n}` : '');
    });
    const unown = POKEMON.filter((p) => p.zone === 'UNOWN');
    $('#unown-progress').textContent =
      `(일반 ${unown.filter((p) => isCaught(p.id)).length}/${unown.length} · 이로치 ${unown.filter((p) => isShiny(p.id)).length}/${unown.length})`;

  }

  // ── 위치 검색 탭 ──────────────────────────────
  let point = null;
  let placeEntries = [];
  let updatePlaceQuery = () => {};

  function setPoint(lat, lng, label) {
    point = { lat, lng, label };
    placeEntries = POKEMON.filter((p) => p.area && inArea(p.area, lat, lng));
    switchTab('place');
    renderAll();
  }
  // ── 야생 / 레이드 페이지 ───────────────────────
  const PAGE_KEY = 'pogo-map:page';
  function showPage(name) {
    $$('.page-tab').forEach((t) => t.classList.toggle('active', t.dataset.page === name));
    $$('.board .page').forEach((pg) => { pg.hidden = pg.dataset.page !== name; });
    try { localStorage.setItem(PAGE_KEY, name); } catch { /* 무시 */ }
  }
  $$('.page-tab').forEach((t) => t.addEventListener('click', () => showPage(t.dataset.page)));
  // 주소의 ?page=raid 가 우선, 없으면 마지막으로 본 페이지
  let startPage = new URLSearchParams(location.search).get('page');
  if (!startPage) try { startPage = localStorage.getItem(PAGE_KEY); } catch { /* 무시 */ }
  if (startPage === 'raid' || startPage === 'unown') showPage(startPage);

  $('#clear-point').addEventListener('click', () => {
    point = null;
    placeEntries = [];
    $('#place-info').textContent = '지명이나 좌표를 입력하면 그곳에서 나오는 포켓몬을 다이어그램에 강조해 보여줍니다.';
    renderAll();
  });

  function renderPlace() {
    const list = $('#place-list');
    list.innerHTML = '';
    if (!point) return;
    const { lat, lng, label } = point;
    const owned = placeEntries.filter((p) => isCaught(p.id)).length;
    const shinyOwned = placeEntries.filter((p) => isShiny(p.id)).length;
    $('#place-info').innerHTML = `${label ? `<b>${esc(label)}</b><br>` : ''}${lat.toFixed(4)}, ${lng.toFixed(4)} — 지역 한정 <b>${placeEntries.length}</b>종 (일반 ${owned} · 이로치 ${shinyOwned})`;
    placeEntries.forEach((p) => list.appendChild(pokeItem(p)));
    updatePlaceQuery();
  }

  async function geocode(q) {
    const coord = q.match(/^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$/);
    const results = $('#geo-results');
    results.innerHTML = '';
    if (coord) return setPoint(Number(coord[1]), Number(coord[2]), null);
    results.innerHTML = '<li>검색 중…</li>';
    try {
      const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=ko&q=' + encodeURIComponent(q);
      const data = await (await fetch(url)).json();
      results.innerHTML = '';
      if (!data.length) { results.innerHTML = '<li>결과가 없습니다.</li>'; return; }
      if (data.length === 1) return setPoint(Number(data[0].lat), Number(data[0].lon), data[0].display_name);
      data.forEach((d) => {
        const li = document.createElement('li');
        li.textContent = d.display_name;
        li.addEventListener('click', () => { results.innerHTML = ''; setPoint(Number(d.lat), Number(d.lon), d.display_name); });
        results.appendChild(li);
      });
    } catch {
      results.innerHTML = '<li>검색에 실패했습니다. 좌표(위도, 경도)로 입력해 보세요.</li>';
    }
  }

  $('#place-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#place-input').value.trim();
    if (q) geocode(q);
  });
  $('#locate-btn').addEventListener('click', () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPoint(pos.coords.latitude, pos.coords.longitude, '현재 위치'),
      () => { $('#place-info').textContent = '현재 위치를 가져오지 못했습니다.'; });
  });

  // ── 체크리스트 탭 ─────────────────────────────
  let updateDexQuery = () => {};
  function dexEntries() {
    const q = $('#dex-filter').value.trim().toLowerCase();
    const own = $('#dex-own').value;
    const page = $('#dex-page').value;
    const evo = $('#show-evo').checked;
    return POKEMON.filter((p) => {
      if (!evo && p.evo) return false;
      if (page !== 'all' && pageOf(p) !== page) return false;
      if (own === 'owned' && !isCaught(p.id)) return false;
      if (own === 'missing' && isCaught(p.id)) return false;
      if (own === 'shiny' && !isShiny(p.id)) return false;
      if (own === 'shiny-missing' && isShiny(p.id)) return false;
      if (!q) return true;
      return [p.ko, p.en, p.form, p.formEn, p.region, p.scope, String(p.dex)].some((s) => s && s.toLowerCase().includes(q));
    }).sort((a, b) => a.dex - b.dex);
  }

  function renderDex() {
    const list = $('#dex-list');
    list.innerHTML = '';
    dexEntries().forEach((p) => list.appendChild(pokeItem(p)));
    const total = POKEMON.length;
    const owned = POKEMON.filter((p) => isCaught(p.id)).length;
    $('#progress-bar').style.width = (owned / total) * 100 + '%';
    const shinyN = POKEMON.filter((p) => isShiny(p.id)).length;
    $('#progress-text').textContent = `일반 ${owned} / ${total} · 이로치 ${shinyN} / ${total}`;
    $('#progress-badge').textContent = `${owned}/${total}`;
    updateDexQuery();
  }
  ['input', 'change'].forEach((ev) => {
    $('#dex-filter').addEventListener(ev, renderDex);
    $('#dex-own').addEventListener(ev, renderDex);
    $('#dex-page').addEventListener(ev, renderDex);
    $('#show-evo').addEventListener(ev, renderDex);
  });

  // ── 저장 / 불러오기 / 파일 ─────────────────────
  const SLOT_KEY = 'pogo-map:saved:v1';
  const pad = (n) => String(n).padStart(2, '0');
  const fmtTime = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  function ioStatus(text) { $('#io-status').textContent = text; }

  // 알 수 없는 id·0 이하·false 값은 버리고 잡은 것은 1로 맞춤
  function cleanCounts(obj) {
    return Object.fromEntries(Object.entries(obj || {})
      .filter(([id, n]) => byId[id] && (n === true || Number(n) > 0))
      .map(([id]) => [id, 1]));
  }
  function applyCounts(next, message, nextShiny = {}) {
    counts = cleanCounts(next);
    shiny = cleanCounts(nextShiny);
    save();
    saveShiny();
    renderAll();
    ioStatus(message);
  }

  function readSlot() {
    try { return JSON.parse(localStorage.getItem(SLOT_KEY)); } catch { return null; }
  }
  function showSlotInfo() {
    const slot = readSlot();
    ioStatus(slot ? `마지막 저장: ${fmtTime(slot.savedAt)}` : '저장된 기록이 없습니다.');
  }

  $('#save-btn').addEventListener('click', () => {
    const slot = { savedAt: new Date().toISOString(), counts, shiny };
    try {
      localStorage.setItem(SLOT_KEY, JSON.stringify(slot));
      ioStatus(`저장했습니다 · ${fmtTime(slot.savedAt)}`);
    } catch { ioStatus('저장에 실패했습니다. 브라우저 저장소를 사용할 수 없습니다.'); }
  });
  $('#load-btn').addEventListener('click', () => {
    const slot = readSlot();
    if (!slot) return ioStatus('저장된 기록이 없습니다.');
    if (!confirm(`${fmtTime(slot.savedAt)}에 저장한 기록으로 되돌릴까요?\n지금 기록은 사라집니다.`)) return;
    applyCounts(slot.counts, `${fmtTime(slot.savedAt)} 기록을 불러왔습니다.`, slot.shiny);
  });

  // 파일 형식: 다시 불러올 때는 caught·shiny(id 목록)만 사용하고, entries 는 사람이 읽기 위한 정보
  $('#export-btn').addEventListener('click', () => {
    const now = new Date();
    // 일반이나 이로치 중 하나라도 체크한 항목
    const owned = POKEMON.filter((p) => isCaught(p.id) || isShiny(p.id)).sort((a, b) => a.dex - b.dex);
    const data = {
      app: 'pogo-regional-dex',
      version: 4,
      exportedAt: now.toISOString(),
      summary: {
        normal: owned.filter((p) => isCaught(p.id)).length,
        shiny: owned.filter((p) => isShiny(p.id)).length,
        total: POKEMON.length,
      },
      caught: owned.filter((p) => isCaught(p.id)).map((p) => p.id),
      shiny: owned.filter((p) => isShiny(p.id)).map((p) => p.id),
      entries: owned.map((p) => ({
        id: p.id, dex: p.dex, name: p.ko, form: p.form || null, region: p.region,
        category: { wild: '야생', raid: '레이드', unown: '안농' }[pageOf(p)],
        normal: isCaught(p.id), shiny: isShiny(p.id),
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pogo-regionals-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    ioStatus(`파일로 저장했습니다 · ${owned.length}종`);
  });
  $('#import-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      // caught 배열(v2), counts 객체(v1), entries 배열, 또는 { id: 값 } 자체를 모두 받음
      let next = Array.isArray(data.caught) ? Object.fromEntries(data.caught.map((id) => [id, 1])) : data.counts;
      if (!next && Array.isArray(data.entries)) next = Object.fromEntries(data.entries.map((x) => [x.id, x.normal ?? x.count ?? 1]));
      if (!next) next = data;
      const nextShiny = Array.isArray(data.shiny) ? Object.fromEntries(data.shiny.map((id) => [id, 1]))
        : Array.isArray(data.entries) ? Object.fromEntries(data.entries.filter((x) => x.shiny).map((x) => [x.id, 1])) : {};
      const n = new Set([...Object.keys(cleanCounts(next)), ...Object.keys(cleanCounts(nextShiny))]).size;
      if (!confirm(`${file.name}에서 ${n}종의 기록을 불러올까요?\n지금 기록은 사라집니다.`)) return;
      applyCounts(next, `${file.name}을(를) 불러왔습니다 · ${n}종`, nextShiny);
    } catch { ioStatus('파일을 읽을 수 없습니다. 이 앱에서 저장한 JSON 파일인지 확인하세요.'); }
  });
  $('#reset-btn').addEventListener('click', () => {
    if (!confirm('체크를 모두 해제할까요?')) return;
    applyCounts({}, '체크리스트를 초기화했습니다.');
  });

  // ── 탭 / 초기화 ──────────────────────────────
  function switchTab(name) {
    $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
    $$('.tab-body').forEach((b) => b.classList.toggle('active', b.id === 'tab-' + name));
  }
  $$('.tab').forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  function renderAll() {
    renderVenn();
    renderPlace();
    renderDex();
  }

  showSlotInfo();
  updatePlaceQuery = mountQuery($('#place-query'), () => placeEntries, { evo: true });
  updateDexQuery = mountQuery($('#dex-query'), dexEntries);
  // 주소 뒤에 #위도,경도 를 붙이면 그 위치로 시작 (예: #37.56,126.97)
  const hash = decodeURIComponent(location.hash.slice(1)).match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/);
  if (hash) setPoint(Number(hash[1]), Number(hash[2]), null);
  else renderAll();
})();
