/* PlanetMC — instalación como aplicación y modo sin conexión.
   Registra el service worker y ofrece el botón «Instalar» solo cuando el
   navegador dice que se puede (Android/Chrome/Edge). En iOS no existe ese
   aviso, así que ahí se explica el gesto de «Añadir a pantalla de inicio». */
(function () {
  'use strict';

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  var slots = document.querySelectorAll('[data-pwa-install]');
  if (!slots.length) return;

  var standalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (standalone) return;                       // ya está instalada

  var prompt = null;
  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function mostrar(texto, accion) {
    Array.prototype.forEach.call(slots, function (slot) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = slot.getAttribute('data-pwa-class') || '';
      b.textContent = texto;
      b.addEventListener('click', accion);
      slot.innerHTML = '';
      slot.appendChild(b);
      slot.hidden = false;
    });
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    prompt = e;
    mostrar('Instalar la app', function () {
      if (!prompt) return;
      prompt.prompt();
      prompt.userChoice.then(function () {
        prompt = null;
        Array.prototype.forEach.call(slots, function (s) { s.hidden = true; });
      });
    });
  });

  if (iOS) {
    mostrar('Añadir al inicio', function () {
      var aviso = document.getElementById('pwaIosAviso');
      if (aviso) { aviso.hidden = !aviso.hidden; return; }
      alert('Para instalarla: toca el botón Compartir y elige «Añadir a pantalla de inicio».');
    });
  }

  window.addEventListener('appinstalled', function () {
    Array.prototype.forEach.call(slots, function (s) { s.hidden = true; });
  });
})();
