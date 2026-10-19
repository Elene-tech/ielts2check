/* Рендер графіків (pie / bar / line / table / картинка). Витягнуто з ядра модулів, без вправ. */
(function () {
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  /* ---------- кругові діаграми (g.pies) ---------- */
  function pieSVG(g) {
    var W = 640, n = g.pies.length, R = n === 2 ? 100 : n === 1 ? 112 : 72, CY = 190, PI = Math.PI;
    var s = '';
    s += '<text x="320" y="22" font-size="14" font-weight="600" text-anchor="middle" fill="#22271E" font-family="Georgia,serif">' + esc(g.svgTitle || g.title) + '</text>';
    g.pies.forEach(function (p, i) {
      var cx = n === 3 ? [105, 320, 515][i] : W * (i + 0.5) / n, tot = p.slices.reduce(function (a, b) { return a + b.value; }, 0), a0 = -PI / 2;
      s += '<text x="' + cx + '" y="' + (CY - R - 28) + '" font-size="14" font-weight="700" text-anchor="middle" fill="#22271E">' + esc(p.label) + '</text>';
      p.slices.forEach(function (sl) {
        var a1 = a0 + 2 * PI * sl.value / tot, mid = (a0 + a1) / 2;
        var x0 = cx + R * Math.cos(a0), y0 = CY + R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
        s += '<path d="M' + cx + ',' + CY + ' L' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' A' + R + ',' + R + ' 0 ' + ((a1 - a0) > PI ? 1 : 0) + ' 1 ' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' Z" fill="' + sl.color + '" stroke="#fff" stroke-width="2"/>';
        if (sl.value >= (n === 3 ? 12 : 8)) {
          s += '<text x="' + (cx + 0.64 * R * Math.cos(mid)).toFixed(1) + '" y="' + (CY + 0.64 * R * Math.sin(mid) + 4.5).toFixed(1) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">' + sl.value + '%</text>';
        } else {
          var ox = cx + (R + 4) * Math.cos(mid), oy = CY + (R + 4) * Math.sin(mid), tx = cx + (R + 17) * Math.cos(mid), ty = CY + (R + 17) * Math.sin(mid);
          s += '<line x1="' + ox.toFixed(1) + '" y1="' + oy.toFixed(1) + '" x2="' + tx.toFixed(1) + '" y2="' + ty.toFixed(1) + '" stroke="#8A8F80"/><text x="' + (tx + (Math.cos(mid) >= 0 ? 3 : -3)).toFixed(1) + '" y="' + (ty + 4).toFixed(1) + '" font-size="12" font-weight="600" text-anchor="' + (Math.cos(mid) >= 0 ? 'start' : 'end') + '" fill="#4A4F44">' + sl.value + '%</text>';
        }
        a0 = a1;
      });
    });
    var leg = g.pies[0].slices, lw = leg.map(function (sl) { return 20 + sl.name.length * 6.3 + 16; }), rows = [[]], cur = 0;
    leg.forEach(function (sl, k) { if (cur + lw[k] > 600 && rows[rows.length - 1].length) { rows.push([]); cur = 0; } rows[rows.length - 1].push(k); cur += lw[k]; });
    var ly = CY + R + 52;
    rows.forEach(function (row, ri) {
      var tw = row.reduce(function (a, k) { return a + lw[k]; }, 0), lx = 320 - tw / 2;
      row.forEach(function (k) {
        s += '<rect x="' + lx + '" y="' + (ly + ri * 24 - 10) + '" width="14" height="14" rx="3" fill="' + leg[k].color + '"/><text x="' + (lx + 20) + '" y="' + (ly + ri * 24 + 2) + '" font-size="12.5" fill="#4A4F44">' + esc(leg[k].name) + '</text>';
        lx += lw[k];
      });
    });
    var H = ly + rows.length * 24 + 8;
    return '<svg class="task-img" viewBox="0 0 640 ' + H + '" role="img" aria-label="' + esc(g.title) + '">' + s + '</svg>';
  }
  function pieTable(g) {
    var t = '<table class="t dt"><tr><th></th>' + g.pies.map(function (p) { return '<th>' + esc(p.label) + '</th>'; }).join('') + '</tr>';
    g.pies[0].slices.forEach(function (sl, k) { t += '<tr><th>' + esc(sl.name) + '</th>' + g.pies.map(function (p) { return '<td>' + p.slices[k].value + '%</td>'; }).join('') + '</tr>'; });
    return t + '</table>';
  }


  /* ---------- стовпчикові діаграми (g.bars) ---------- */
  function barSVG(g) {
    var B = g.bars, cats = B.cats, ns = B.series.length, nc = cats.length;
    var X0 = 64, X1 = 624, Y0 = 290, Y1 = 52, catW = (X1 - X0) / nc;
    var bw = Math.min(30, (catW * 0.84 - (ns - 1) * 3) / ns), tot = ns * bw + (ns - 1) * 3;
    var ys = function (v) { return Y0 - (Y0 - Y1) * v / B.max; };
    var s = '<text x="344" y="22" font-size="14" font-weight="600" text-anchor="middle" fill="#22271E" font-family="Georgia,serif">' + esc(g.svgTitle || g.title) + '</text>';
    for (var v = 0; v <= B.max; v += B.step) {
      s += '<line x1="' + X0 + '" y1="' + ys(v).toFixed(1) + '" x2="' + X1 + '" y2="' + ys(v).toFixed(1) + '" stroke="#E9E6D8"/><text x="' + (X0 - 8) + '" y="' + (ys(v) + 4).toFixed(1) + '" font-size="11" text-anchor="end" fill="#8A8F80">' + v + '</text>';
    }
    s += '<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X1 + '" y2="' + Y0 + '" stroke="#B9B6A6" stroke-width="1.5"/><line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="' + (Y1 - 6) + '" stroke="#B9B6A6" stroke-width="1.5"/>';
    s += '<text x="18" y="' + ((Y0 + Y1) / 2).toFixed(0) + '" font-size="11" text-anchor="middle" fill="#8A8F80" transform="rotate(-90 18 ' + ((Y0 + Y1) / 2).toFixed(0) + ')">' + esc(B.yLabel) + '</text>';
    var twoLines = false;
    cats.forEach(function (c, ci) {
      var gx = X0 + catW * (ci + 0.5), parts = [c];
      if (c.length > 11 && c.indexOf(' ') > 0) { var sp = c.indexOf(' ', Math.floor(c.length / 2) - 4); if (sp < 0) sp = c.lastIndexOf(' '); parts = [c.slice(0, sp), c.slice(sp + 1)]; twoLines = true; }
      parts.forEach(function (pt, k) { s += '<text x="' + gx.toFixed(1) + '" y="' + (Y0 + 17 + k * 13) + '" font-size="11.5" text-anchor="middle" fill="#4A4F44">' + esc(pt) + '</text>'; });
      B.series.forEach(function (sr, si) {
        var x = gx - tot / 2 + si * (bw + 3), val = sr.values[ci], y = ys(val);
        s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (Y0 - y).toFixed(1) + '" rx="2" fill="' + sr.color + '"/>';
        s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" font-size="10.5" font-weight="600" text-anchor="middle" fill="#4A4F44">' + val + '</text>';
      });
    });
    var lw = B.series.map(function (sr) { return 20 + sr.name.length * 6.6 + 18; }), rows = [[]], cur = 0;
    lw.forEach(function (w, k) { if (cur + w > 600 && rows[rows.length - 1].length) { rows.push([]); cur = 0; } rows[rows.length - 1].push(k); cur += w; });
    var ly = Y0 + (twoLines ? 54 : 41);
    rows.forEach(function (row, ri) {
      var tw = row.reduce(function (a, k) { return a + lw[k]; }, 0), lx = 344 - tw / 2;
      row.forEach(function (k) {
        s += '<rect x="' + lx.toFixed(1) + '" y="' + (ly + ri * 24 - 10) + '" width="14" height="14" rx="3" fill="' + B.series[k].color + '"/><text x="' + (lx + 20).toFixed(1) + '" y="' + (ly + ri * 24 + 2) + '" font-size="12.5" fill="#4A4F44">' + esc(B.series[k].name) + '</text>';
        lx += lw[k];
      });
    });
    var H = ly + rows.length * 24 + 6;
    return '<svg class="task-img" viewBox="0 0 660 ' + H + '" role="img" aria-label="' + esc(g.title) + '">' + s + '</svg>';
  }
  function barTable(g) {
    var B = g.bars, u = B.suffix || '';
    var t = '<table class="t dt"><tr><th></th>' + B.series.map(function (sr) { return '<th>' + esc(sr.name) + '</th>'; }).join('') + '</tr>';
    B.cats.forEach(function (c, ci) { t += '<tr><th>' + esc(c) + '</th>' + B.series.map(function (sr) { return '<td>' + sr.values[ci] + u + '</td>'; }).join('') + '</tr>'; });
    return t + '</table>';
  }

  /* ---------- таблиці (g.tab) ---------- */
  function tabFmt(T, v) { return (T.pre || '') + v + (T.suffix || ''); }
  function tabHTML(g, attrs) {
    var T = g.tab;
    var t = '<div class="tbl-box"><table class="tb"><caption class="tbl-title">' + esc(g.title) + '</caption><tr><th class="rh">' + esc(T.corner || '') + '</th>' + T.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
    T.rows.forEach(function (row, ri) {
      t += '<tr><th class="rh">' + esc(row[0]) + '</th>' + row.slice(1).map(function (v, ci) { return '<td' + (attrs ? attrs(ri, ci) : '') + '>' + tabFmt(T, v) + '</td>'; }).join('') + '</tr>';
    });
    return t + '</table>' + (T.caption ? '<div class="tbl-cap">' + esc(T.caption) + '</div>' : '') + '</div>';
  }

  /* ---------- графік ---------- */
  function imgHTML(g) {
    return '<figure class="imgfig"><img class="proc-img" src="' + esc(g.img) + '" alt="' + esc(g.alt || g.title || '') + '" data-act="zoom"><figcaption>🔍 Клікни на діаграму, щоб збільшити</figcaption></figure>';
  }
  function chartSVG(g) {
    if (g.img) return imgHTML(g);
    if (g.tab) return tabHTML(g);
    if (g.pies) return pieSVG(g);
    if (g.bars) return barSVG(g);
    var X0 = 70, X1 = 610, Y0 = 300, Y1 = 45, n = g.x.length;
    var xs = function (i) { return X0 + (X1 - X0) * i / (n - 1); };
    var ys = function (v) { return Y0 - (Y0 - Y1) * v / g.yMax; };
    var s = '<svg class="task-img" viewBox="0 0 640 365" role="img" aria-label="' + esc(g.title) + '">';
    s += '<text x="320" y="22" font-size="14" font-weight="600" text-anchor="middle" fill="#22271E" font-family="Georgia,serif">' + esc(g.svgTitle || g.title) + '</text>';
    for (var v = 0; v <= g.yMax; v += g.step) {
      s += '<line x1="' + X0 + '" y1="' + ys(v) + '" x2="' + X1 + '" y2="' + ys(v) + '" stroke="#E9E6D8"/><text x="62" y="' + (ys(v) + 4) + '" font-size="11" text-anchor="end" fill="#8A8F80">' + v + '</text>';
    }
    s += '<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X1 + '" y2="' + Y0 + '" stroke="#B9B6A6" stroke-width="1.5"/><line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="' + Y1 + '" stroke="#B9B6A6" stroke-width="1.5"/>';
    g.x.forEach(function (lab, i) { s += '<text x="' + xs(i).toFixed(1) + '" y="318" font-size="11" text-anchor="middle" fill="#8A8F80">' + lab + '</text>'; });
    s += '<text x="20" y="172" font-size="10.5" text-anchor="middle" fill="#8A8F80" transform="rotate(-90 20 172)">' + esc(g.yLabel) + '</text>';
    if (g.projFrom != null) {
      var px = xs(g.projFrom).toFixed(1);
      s += '<line x1="' + px + '" y1="' + Y1 + '" x2="' + px + '" y2="' + Y0 + '" stroke="#8A8F80" stroke-dasharray="2,3"/><text x="' + (+px + 6) + '" y="' + (Y1 + 14) + '" font-size="11" font-style="italic" fill="#6E7468">projection →</text>';
    }
    g.series.forEach(function (sr) {
      var pf = g.projFrom != null ? g.projFrom : n - 1;
      var pts = function (a, b) { var o = []; for (var i = a; i <= b; i++) o.push((i === a ? 'M' : 'L') + xs(i).toFixed(1) + ',' + ys(sr.values[i]).toFixed(1)); return o.join(' '); };
      s += '<path d="' + pts(0, pf) + '" fill="none" stroke="' + sr.color + '" stroke-width="2.6" stroke-linejoin="round"/>';
      if (pf < n - 1) s += '<path d="' + pts(pf, n - 1) + '" fill="none" stroke="' + sr.color + '" stroke-width="2.6" stroke-linejoin="round" stroke-dasharray="7,5"/>';
      sr.values.forEach(function (val, i) { s += '<circle cx="' + xs(i).toFixed(1) + '" cy="' + ys(val).toFixed(1) + '" r="3" fill="' + sr.color + '"/>'; });
    });
    var lw = g.series.map(function (sr) { return 30 + sr.name.length * 7 + 14; });
    var total = lw.reduce(function (a, b) { return a + b; }, 0), lx = 320 - total / 2;
    g.series.forEach(function (sr, k) {
      s += '<line x1="' + lx + '" y1="345" x2="' + (lx + 18) + '" y2="345" stroke="' + sr.color + '" stroke-width="3"/><text x="' + (lx + 24) + '" y="349" font-size="12.5" fill="#4A4F44">' + esc(sr.name) + '</text>';
      lx += lw[k];
    });
    return s + '</svg>';
  }
  function dataTable(g) {
    if (g.tab) return tabHTML(g);
    if (g.pies) return pieTable(g);
    if (g.bars) return barTable(g);
    var t = '<table class="t dt"><tr><th></th>' + g.x.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>';
    g.series.forEach(function (sr) { t += '<tr><th>' + esc(sr.name) + '</th>' + sr.values.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>'; });
    return t + '</table>';
  }

  window.chartSVG = chartSVG; window.dataTable = dataTable;
})();
