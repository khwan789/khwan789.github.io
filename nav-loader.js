(function () {
  'use strict';

  var targetId = 'site-nav';
  var file = (document.currentScript && document.currentScript.getAttribute('data-file')) || 'nav.html';

  var projectPages = {
    idleSheep: 'idleSheep',
    idleNinja: 'idleNinja',
    ninjaSurvivor: 'ninjaSurvivor',
    orbit: 'orbit',
    tenMatch: 'tenMatch'
  };

  var projectLabels = {
    idleSheep: { en: '- Shepherd Girl: Idle Sheep Farm', ko: '- 양 세는 소녀: 방치형 농장 키우기' },
    idleNinja: { en: '- Idle Ninja Online', ko: '- 닌자 키우기 온라인' },
    ninjaSurvivor: { en: '- Ninja Survivors Online', ko: '- 닌자 서바이벌 온라인' },
    orbit: { en: '- OR-BIT', ko: '- OR-BIT' },
    tenMatch: { en: '- Ten Match', ko: '- Ten Match' }
  };

  function getCurrentFile() {
    return (location.pathname || '').split('/').pop() || 'portfolio.html';
  }

  function isKoreanPage() {
    var htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    var currentFile = getCurrentFile();
    return htmlLang.indexOf('ko') === 0 || /^kr\.html$/i.test(currentFile) || /KR\.html$/i.test(currentFile);
  }

  function configureNavigation(mount) {
    var korean = isKoreanPage();
    var lang = korean ? 'ko' : 'en';

    var home = mount.querySelector('.home');
    if (home) home.setAttribute('href', korean ? 'kr.html' : 'portfolio.html');

    var projectsButton = mount.querySelector('.dropbtn');
    if (projectsButton) projectsButton.textContent = 'Projects';

    mount.querySelectorAll('a[data-page]').forEach(function (link) {
      var key = link.getAttribute('data-page');
      if (!projectPages[key]) return;
      link.setAttribute('href', projectPages[key] + (korean ? 'KR' : '') + '.html');
      link.textContent = projectLabels[key][lang];
    });

    var resume = mount.querySelector('.resume');
    if (resume) {
      resume.setAttribute('href', korean ? 'ResumeKR.pdf' : 'Resume.pdf');
      resume.textContent = korean ? '이력서' : 'Resume';
    }

    var currentFile = getCurrentFile().toLowerCase();
    mount.querySelectorAll('a[href]').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
      if (href && href === currentFile) link.classList.add('active');
    });
  }

  function afterInject() {
    var mount = document.getElementById(targetId);
    if (mount) configureNavigation(mount);
  }

  function injectNav() {
    var mount = document.getElementById(targetId);
    if (!mount) return;

    fetch(file, { cache: 'no-cache' })
      .then(function (response) { return response.text(); })
      .then(function (html) {
        mount.innerHTML = html;
        afterInject();
      })
      .catch(console.error);
  }

  if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.load === 'function') {
    window.jQuery(function ($) {
      $('#' + targetId).load(file, afterInject);
    });
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }
})();
