/* PlanetMC — Guías: menú móvil + buscador. Sin dependencias. */
(function () {
  'use strict';

  /* ── Menú lateral en móvil ───────────────────────────── */
  var burger = document.getElementById('wkBurger');
  var side = document.getElementById('wkSide');
  if (burger && side) {
    var mob = function () { return window.matchMedia('(max-width: 980px)').matches; };
    if (mob()) side.hidden = true;
    burger.addEventListener('click', function () {
      side.hidden = !side.hidden;
      burger.setAttribute('aria-expanded', side.hidden ? 'false' : 'true');
    });
    side.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && mob()) side.hidden = true;
    });
    window.addEventListener('resize', function () { if (!mob()) side.hidden = false; });
  }

  /* ── Buscador ────────────────────────────────────────── */
  var IX = window.WK_INDEX || [];
  var norm = function (s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  };

  // Un documento por página y uno por sección, para poder saltar al ancla exacta.
  var DOCS = [];
  IX.forEach(function (p) {
    DOCS.push({ t: p.t, d: p.d, u: p.u, c: p.c, hay: norm(p.t + ' ' + p.d + ' ' + (p.k || '')), w: 3 });
    (p.s || []).forEach(function (s) {
      DOCS.push({ t: s.t, d: p.t, u: p.u + '#' + s.a, c: p.c, hay: norm(s.t + ' ' + (s.k || '') + ' ' + p.t), w: 1 });
    });
  });

  function search(q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var out = [];
    DOCS.forEach(function (d) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var at = d.hay.indexOf(terms[i]);
        if (at < 0) return;                       // todos los términos deben aparecer
        score += d.w + (at === 0 ? 2 : 0) + (at < 30 ? 1 : 0);
      }
      out.push({ d: d, score: score });
    });
    out.sort(function (a, b) { return b.score - a.score || a.d.t.length - b.d.t.length; });
    var seen = {}, res = [];
    out.forEach(function (o) {
      if (seen[o.d.u]) return;
      seen[o.d.u] = 1;
      res.push(o.d);
    });
    return res.slice(0, 9);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  document.querySelectorAll('[data-wk-search]').forEach(function (box) {
    var input = box.querySelector('input');
    var list = box.querySelector('[data-wk-results]');
    if (!input || !list) return;
    var sel = -1;

    function render(items) {
      sel = -1;
      if (!items.length) {
        list.innerHTML = '<p>Sin resultados. Prueba con «proteger», «dinero», «casa», «rtp» o «/p».</p>';
        list.hidden = false;
        return;
      }
      list.innerHTML = items.map(function (d) {
        return '<a href="' + d.u + '"><span class="wk-rcat">' + esc(d.c) + '</span>' +
          '<b>' + esc(d.t) + '</b><em>' + esc(d.d) + '</em></a>';
      }).join('');
      list.hidden = false;
    }

    function move(step) {
      var links = list.querySelectorAll('a');
      if (!links.length) return;
      if (sel >= 0) links[sel].classList.remove('sel');
      sel = (sel + step + links.length) % links.length;
      links[sel].classList.add('sel');
      links[sel].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q.length < 2) { list.hidden = true; list.innerHTML = ''; return; }
      render(search(q));
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Escape') { list.hidden = true; input.blur(); }
      else if (e.key === 'Enter') {
        var links = list.querySelectorAll('a');
        var go = links[sel >= 0 ? sel : 0];
        if (go) { e.preventDefault(); window.location.href = go.getAttribute('href'); }
      }
    });

    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) list.hidden = true;
    });
  });

  /* Atajo: «/» enfoca el buscador (salvo si ya se está escribiendo) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
    var first = document.querySelector('[data-wk-search] input');
    if (first) { e.preventDefault(); first.focus(); }
  });
})();
