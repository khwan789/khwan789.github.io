(function () {
  'use strict';

  var targetId = 'site-nav';
  var file = (document.currentScript && document.currentScript.getAttribute('data-file')) || 'nav.html';

  function getCurrentFile() {
    // pathname only (no query/hash)
    var p = (location.pathname || '').split('/').pop() || '';
    return p || 'en.html';
  }

  function detectKoreanPage() {
    var htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    var currentFile = getCurrentFile();
    return (
      htmlLang.indexOf('ko') === 0 ||
      /(^|\/)kr\.html$/i.test(currentFile) ||
      /KR\.html$/i.test(currentFile)
    );
  }

  function markActiveLinks(mount) {
    try {
      var path = getCurrentFile();
      var links = mount.querySelectorAll('a[href]');
      links.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (!href) return;
        var hfile = href.split('/').pop();
        if (!hfile) return;

        // Treat index.html as en.html
        var normalizedPath = (path === '' || path.toLowerCase() === 'index.html') ? 'en.html' : path;
        if (hfile === normalizedPath) a.classList.add('active');
      });
    } catch (e) {
      console.error(e);
    }
  }

  function swapLang(filename, to) {
    // Only swap between known EN/KR counterparts.
    // If it doesn't match, return as-is (don't force to en.html/kr.html).
    var f = filename || '';
    var low = f.toLowerCase();

    if (low === '' || low === 'index.html' || low === 'en.html' || low === 'kr.html') {
      return to === 'kr' ? 'kr.html' : 'en.html';
    }

    if (/(EN|KR)\.html$/i.test(f)) {
      return f.replace(/(EN|KR)\.html$/i, to === 'kr' ? 'KR.html' : 'EN.html');
    }

    // Unknown html page: do not rewrite
    return f;
  }

  function setResumeLink(mount, lang) {
    var resume = mount.querySelector('a.resume');
    if (!resume) return;
    // Requirement: if Korean page => open ResumeKR.pdf, otherwise Resume.pdf
    resume.setAttribute('href', lang === 'kr' ? 'ResumeKR.pdf' : 'Resume.pdf');
  }

  function setupLanguage(mount) {
    try {
      var currentFile = getCurrentFile();
      var isKR = detectKoreanPage();
      var lang = isKR ? 'kr' : 'en';

      var i18n = {
        en: { home: 'Home', projects: 'Projects', resume: 'Resume', btn: '한국어' },
        kr: { home: 'Home', projects: 'Projects', resume: '이력서', btn: 'EN' }
      };

      var elHome = mount.querySelector('.home[data-i18n]');
      var elProj = mount.querySelector('.dropbtn[data-i18n]');
      var elResume = mount.querySelector('.resume[data-i18n]');
      if (elHome) elHome.textContent = i18n[lang].home;
      if (elProj) elProj.textContent = i18n[lang].projects;
      if (elResume) elResume.textContent = i18n[lang].resume;

      var projectLabels = {
        idleSheep: { en: '- Shepherd Girl: Idle Sheep Farm', kr: '- 양 세는 소녀: 방치형 농장 키우기' },
        idleNinja: { en: '- Idle Ninja Online', kr: '- 닌자 키우기 온라인' },
        ninjaSurvivor: { en: '- Ninja Survivors Online', kr: '- 닌자 서바이벌 온라인' },
        orbit: { en: '- OR-BIT', kr: '- OR-BIT' },
        tenMatch: { en: '- Ten Match', kr: '- Ten Match' }
      };
      var projectLinks = mount.querySelectorAll('a[data-page]');
      projectLinks.forEach(function (a) {
        var key = a.getAttribute('data-page');
        if (projectLabels[key]) a.textContent = projectLabels[key][lang];
      });

      // Update internal links (only those without target)
      var internal = mount.querySelectorAll('a[href]:not([target])');
      internal.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (!href) return;
        // Keep any path prefix, only swap filename
        var parts = href.split('/');
        var hfile = parts.pop() || '';
        if (!hfile) return;
        parts.push(swapLang(hfile, lang));
        a.setAttribute('href', parts.join('/'));
      });

      setResumeLink(mount, lang);

      var btn = mount.querySelector('#langToggle');
      if (btn) {
        btn.textContent = i18n[lang].btn;
        btn.setAttribute('aria-label', isKR ? 'Switch to English' : '한국어로 보기');
        btn.onclick = function () {
          var target = swapLang(currentFile, isKR ? 'en' : 'kr');
          // If current file was unknown, fall back to home pages
          if (!target || target === currentFile) target = isKR ? 'en.html' : 'kr.html';
          location.href = target;
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

  function afterInject() {
    var mount = document.getElementById(targetId);
    if (!mount) return;
    setupLanguage(mount);
    markActiveLinks(mount);
  }

  function injectNav() {
    var mount = document.getElementById(targetId);
    if (!mount) return;

    // If already injected (e.g., hot reload), still re-run setup.
    fetch(file, { cache: 'no-cache' })
      .then(function (r) {
        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
        afterInject();
      })
      .catch(console.error);
  }

  // If jQuery is present, use it; otherwise use fetch.
  if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.load === 'function') {
    window.jQuery(function ($) {
      $('#' + targetId).load(file, function () {
        afterInject();
      });
    });
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectNav);
    } else {
      injectNav();
    }
  }
})();
