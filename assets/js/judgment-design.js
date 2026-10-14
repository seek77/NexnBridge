/* ko/judgment-design.html 페이지 고유 동작(Scrollcraft 엔진은 수정하지 않는다).

   시그니처 동작 "판단 명세"
   - 데스크톱: 왼쪽 여백 명세에 장마다 4개의 기입란이 있다. 해당 장을 읽어 내려가면(장 높이 대비
     화면 중앙의 진행률) 항목이 하나씩 기록되고 밑줄이 그어진다. 장을 다 지나면 표시점이 채워진다.
   - 정점(EDD 고정 구간): 다섯 단계의 선이 그려진 뒤, 피드백·개선에서 업무 이해로 돌아가는 선이 닫히면
     여백 명세도 마지막 항목에서 첫 항목으로 이어지는 선이 그어진다(--loop).
   - 폰·태블릿: 상단 폴리오 띠가 현재 장과 4칸 진행 표시를 보여 준다.

   기록은 되돌리지 않는다. 위로 다시 올라가도 이미 읽은 항목은 지워지지 않는다(읽은 기록이므로).
   엔진이 각 act에 쓰는 --sc-p를 정점 구간에서 읽고, 나머지는 이 파일이 직접 계산한다. */
(function () {
  'use strict';

  // EDD 고정 구간 길이: 폰에서는 더 짧게. 엔진이 마운트 시점에 data-sc-span을 읽으므로 그 전에 정한다.
  var eddEl = document.getElementById('edd');
  if (eddEl && matchMedia('(max-width: 760px)').matches) eddEl.setAttribute('data-sc-span', '1.8');

  var api = window.ScrollCraft ? window.ScrollCraft.mount(document.body) : null;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
  var entries = Array.prototype.slice.call(document.querySelectorAll('.jd-spec__entry'));
  var spec = document.querySelector('.jd-spec');
  var list = document.querySelector('.jd-spec__list');
  var folioNum = document.querySelector('[data-folio-num]');
  var folioTitle = document.querySelector('[data-folio-title]');
  var strip = document.querySelector('.jd-strip');
  var stripFolio = document.querySelector('[data-folio-strip]');
  var bars = Array.prototype.slice.call(document.querySelectorAll('.jd-strip__bars i'));
  var edd = document.getElementById('edd');
  var eddStage = edd && edd.querySelector('[data-sc-stage]');

  var TITLES = ['업무 판단 설계', '문제와 목표', '판단 기준', 'AI 설계', '사례 검증', 'Eval-Driven Development', '마감'];
  var NUMS = ['표지', '01', '02', '03', '04', 'EDD', ''];

  var written = {};      // "장-항목" -> true. 한 번 기록되면 유지한다.
  var done = {};         // 장 번호 -> true
  var looped = 0;        // 0..1, 한 번 닫히면 1로 유지
  var current = -1;
  var ticking = false;

  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };

  // 장 하나를 읽은 정도. 장 머리가 화면 중앙에 오면 0, 장 끝이 화면 중앙을 지나면 1.
  function readProgress(el) {
    var r = el.getBoundingClientRect();
    var mid = innerHeight * 0.55;
    return clamp01((mid - r.top) / Math.max(r.height, 1));
  }

  function placeLoop() {
    if (!spec || !list || !entries.length) return;
    var first = entries[0].querySelector('a');
    var last = entries[entries.length - 1];
    var top = first.offsetTop + list.offsetTop + first.offsetHeight / 2;
    var bottom = last.offsetTop + list.offsetTop + last.offsetHeight;
    spec.style.setProperty('--loop-top', top + 'px');
    spec.style.setProperty('--loop-h', Math.max(bottom - top, 1) + 'px');
  }

  function update() {
    ticking = false;

    // 1~4장: 진행률에 따라 항목 기록
    var cur = 0;
    chapters.forEach(function (ch) {
      var n = +ch.getAttribute('data-chapter');
      var r = ch.getBoundingClientRect();
      if (r.top <= innerHeight * 0.55 && r.bottom > innerHeight * 0.55) cur = n;
      if (n < 1 || n > 4) return;
      var p = readProgress(ch);
      var entry = entries[n - 1];
      if (!entry) return;
      var terms = entry.querySelectorAll('.jd-spec__terms li');
      for (var i = 0; i < terms.length; i++) {
        var key = n + '-' + i;
        // 네 항목을 장의 앞 70% 구간에 고르게 나눠 기록한다.
        if (!written[key] && p >= 0.08 + (i / terms.length) * 0.62) {
          written[key] = true;
          terms[i].classList.add('is-written');
        }
      }
      if (!done[n] && p >= 0.85) {
        done[n] = true;
        entry.classList.add('is-done');
        if (bars[n - 1]) bars[n - 1].classList.add('is-done');
      }
    });

    // 현재 장 표시
    if (cur !== current) {
      current = cur;
      entries.forEach(function (e, i) { e.classList.toggle('is-current', i + 1 === cur); });
      if (folioNum) folioNum.textContent = NUMS[cur] || '';
      if (folioTitle) folioTitle.textContent = TITLES[cur] || '';
      if (stripFolio) stripFolio.textContent = (NUMS[cur] && cur > 0 && cur < 5 ? NUMS[cur] + ' ' : '') + (TITLES[cur] || '');
    }
    if (strip) strip.classList.toggle('is-shown', cur > 0);

    // 정점: 엔진이 쓴 --sc-p로 돌아가는 선의 진행을 읽는다(page.css의 --ret와 같은 구간).
    if (edd) {
      var p = parseFloat(edd.style.getPropertyValue('--sc-p')) || 0;
      var draw = clamp01((p - 0.02) / 0.40);
      var ret = clamp01((p - 0.48) / 0.22);
      var loopNow = Math.max(looped, ret);
      if (loopNow >= 1) looped = 1;
      if (spec) spec.style.setProperty('--loop', loopNow.toFixed(3));
      // 검증 도구가 고정 구간의 실제 화면 변화를 읽도록 반올림한 상태를 게시한다.
      if (eddStage) {
        eddStage.setAttribute('data-sc-verify-state', 'line:' + draw.toFixed(2) + ' return:' + ret.toFixed(2));
        eddStage.setAttribute('data-sc-verify-hold', ret >= 1 ? 'true' : 'false');
      }
    }
  }

  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', function () { placeLoop(); request(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeLoop(); request(); });
  addEventListener('load', function () { placeLoop(); request(); });

  // 여백 명세의 링크로 장에 이동하면, 그 장 머리가 폴리오 아래 가려지지 않게 초점을 장 제목으로 옮긴다.
  entries.forEach(function (e) {
    var a = e.querySelector('a');
    a.addEventListener('click', function () {
      var target = document.querySelector(a.getAttribute('href'));
      var h = target && target.querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); setTimeout(function () { h.focus({ preventScroll: true }); }, reduce ? 0 : 400); }
    });
  });

  placeLoop();
  update();
  window.__judgmentSpec = { api: api };
})();
