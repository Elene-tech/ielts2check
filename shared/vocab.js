/* Рендер словника: використовується і в висувній панелі уроків, і на сторінці vocabulary.html.
   window.renderVocab(container, {focus:[id,...]}) */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  window.renderVocab = function (box, opts) {
    opts = opts || {};
    var V = window.VOCAB || [], focus = opts.focus || [];
    var state = { q: '', extra: false };
    box.innerHTML =
      '<div class="vc-tools"><input type="search" class="vc-q" placeholder="Знайти слово… (trend, respectively, пасив)"><label class="vc-x"><input type="checkbox" class="vc-extra"> Показати «Додатково»</label></div>' +
      '<div class="vc-list"></div>';
    var list = box.querySelector('.vc-list');
    function sectionHTML(sec, isFocus, open) {
      var rows = sec.rows.filter(function (r) { return !state.q || r.join(' ').toLowerCase().indexOf(state.q) >= 0; });
      if (!rows.length) return '';
      var th = sec.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('');
      var tr = rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i === 0 ? ' class="vc-first"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('');
      return '<details class="vc-sec' + (isFocus ? ' vc-focus' : '') + '"' + (open ? ' open' : '') + '><summary>' + esc(sec.title) + (isFocus ? ' <span class="vc-badge">для цього завдання</span>' : '') + (sec.tier === 'extra' ? ' <span class="vc-badge vc-ex">додатково</span>' : '') + '</summary><div class="vc-wrap"><table class="vc-t"><tr>' + th + '</tr>' + tr + '</table></div></details>';
    }
    function draw() {
      var f = V.filter(function (s) { return focus.indexOf(s.id) >= 0 && (state.extra || s.tier !== 'extra'); });
      var rest = V.filter(function (s) { return focus.indexOf(s.id) < 0 && (state.extra || s.tier !== 'extra'); });
      var h = '';
      f.forEach(function (s) { h += sectionHTML(s, true, !state.q ? true : true); });
      rest.forEach(function (s) { h += sectionHTML(s, false, !!state.q || !focus.length && s === rest[0]); });
      list.innerHTML = h || '<p class="vc-empty">Нічого не знайдено. Спробуй інше слово або увімкни «Додатково».</p>';
    }
    box.querySelector('.vc-q').addEventListener('input', function (e) { state.q = e.target.value.toLowerCase().trim(); draw(); });
    box.querySelector('.vc-extra').addEventListener('change', function (e) { state.extra = e.target.checked; draw(); });
    draw();
  };
})();
