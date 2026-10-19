/* Сторінка екзаменаційного завдання: умова, графік(и), опис, поради, словник. Без полів для відповіді. */
(function () {
  'use strict';
  var id = window.TASK_ID, T = (window.TASKS || []).filter(function (t) { return t.id === id; })[0];
  var G = window.GRAPHS, root = document.getElementById('app');
  if (!T) { root.textContent = 'Завдання не знайдено'; return; }
  var gl = Array.isArray(T.graph) ? T.graph : [T.graph], two = gl.length > 1;
  var focus = (window.VOCAB || []).filter(function (s) { return s.id.indexOf(T.vocab + ':') === 0 && s.tier !== 'extra'; }).map(function (s) { return s.id; });
  var cells = gl.map(function (k) { return '<div class="gcell">' + window.chartSVG(G[k]) + '</div>'; }).join('');
  var html =
    '<div class="wrap"><div class="ex-kicker">Exam Task ' + T.n + ' / 7</div><h1>' + T.type + '</h1>' +
    '<div class="ex-meta"><span class="ex-pill">IELTS Academic · Writing Task 1</span><span class="ex-pill">≈ 20 хвилин</span><span class="ex-pill">мінімум 150 слів</span>' +
    (window.renderVocab ? '<button class="tb" data-act="vocab">📚 Словник</button>' : '') + '</div>' +
    '<div class="card"><span class="step-tag tag-blue">Завдання</span>' +
    '<div class="exam-box"><div class="exam-h">WRITING TASK 1</div><p>You should spend about 20 minutes on this task.</p><p><i>' + T.prompt + '</i></p>' +
    '<p><i>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</i></p><p>Write at least 150 words.</p></div>' +
    (two ? '<div class="pair">' + cells + '</div>' : cells) + '</div>' +
    '<div class="card"><span class="step-tag tag-green">Про завдання</span><p>' + T.descr + '</p></div>' +
    '<div class="card"><span class="step-tag tag-orange">Короткі поради</span><ul class="ex-tips">' + T.tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
    '<p class="small" style="margin-top:10px">Структура відповіді: Introduction → Overview → Body 1 → Body 2. Словник вище допоможе з формулюваннями.</p></div></div>' +
    (window.renderVocab ? '<div id="vocab-drawer"><div class="vd-head"><b>📚 Словник</b><a href="vocabulary.html?type=' + T.vocab + '" target="_blank" rel="noopener">Відкрити в новій вкладці ↗</a><button class="tb" data-act="vocab">✕</button></div><div id="vocab-body"></div></div>' : '');
  root.innerHTML = html;
  if (window.renderVocab) window.renderVocab(document.getElementById('vocab-body'), { focus: focus });
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    if (el.dataset.act === 'vocab') document.getElementById('vocab-drawer').classList.toggle('open');
    if (el.dataset.act === 'zoom') { var ov = document.createElement('div'); ov.className = 'zoom-ov'; ov.innerHTML = '<img src="' + el.src + '" alt="">'; ov.onclick = function () { ov.remove(); }; document.body.appendChild(ov); }
  });
  function notify() { try { parent.postMessage({ type: 'ielts-resize', id: 'exam-' + T.id, height: document.documentElement.scrollHeight + 8 }, '*'); } catch (e) {} }
  if (window.ResizeObserver) new ResizeObserver(notify).observe(document.body);
  window.addEventListener('load', notify); setInterval(notify, 1500);
})();
