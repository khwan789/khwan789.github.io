
(function() {
  var targetId = 'site-nav';
  var file = (document.currentScript && document.currentScript.getAttribute('data-file')) || 'nav.html';

  function markActiveLinks(mount) {
    try {
      var path = (location.pathname.split('/').pop() || 'en.html');
      var links = mount.querySelectorAll('a[href]');
      links.forEach(function(a) {
        var href = a.getAttribute('href') || '';
        if (!href) return;
        var hfile = href.split('/').pop();
        if (hfile === path || ((path === '' || path === 'index.html') && hfile.toLowerCase() === 'en.html')) {
          a.classList.add('active');
        }
      });
    } catch (e) { console.error(e); }
  }

  function swapLang(filename, to) {
    var f = filename || 'en.html';
    var low = f.toLowerCase();
    if (low === 'en.html' || low === 'kr.html' || low === '' || low === 'index.html') {
      return to === 'kr' ? 'kr.html' : 'en.html';
    }
    if (/EN\.html$/i.test(f) || /KR\.html$/i.test(f)) {
      return f.replace(/(EN|KR)\.html$/i, to === 'kr' ? 'KR.html' : 'EN.html');
    }
    if (/\.html$/i.test(f)) {
      return to === 'kr' ? 'kr.html' : 'en.html';
    }
    return to === 'kr' ? 'kr.html' : 'en.html';
  }

  function setupLanguage(mount) {
    try {
      var htmlLang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
      var currentFile = (location.pathname.split('/').pop() || 'en.html');
      var isKR = htmlLang.indexOf('ko') === 0 || currentFile.toLowerCase() === 'kr.html';
      var lang = isKR ? 'kr' : 'en';

      var i18n = {
        en: { home: 'Home', projects: 'Projects', resume: 'Resume', btn: '한국어' },
        kr: { home: 'Home',  projects: 'Projects', resume: '이력서', btn: 'EN' }
      };
      var elHome = mount.querySelector('.home[data-i18n]');
      var elProj = mount.querySelector('.dropbtn[data-i18n]');
      var elResume = mount.querySelector('.resume[data-i18n]');
      if (elHome) elHome.textContent = i18n[lang].home;
      if (elProj) elProj.textContent = i18n[lang].projects;
      if (elResume) elResume.textContent = i18n[lang].resume;

      var projectLabels = {
        idleNinja:    { en: '- Idle Ninja Online',       kr: '- 닌자 키우기 온라인' },
        ninjaSurvivor:{ en: '- Ninja Survivors Online',  kr: '- 닌자 서바이벌 온라인' },
        orbit:        { en: '- OR-BIT',                  kr: '- OR-BIT' },
        tenMatch:     { en: '- Ten Match',               kr: '- Ten Match' }
      };
      var projectLinks = mount.querySelectorAll('a[data-page]');
      projectLinks.forEach(function(a){
        var key = a.getAttribute('data-page');
        if (projectLabels[key]) a.textContent = projectLabels[key][lang];
      });

      var internal = mount.querySelectorAll('a[href]:not([target])');
      internal.forEach(function(a){
        var href = a.getAttribute('href') || '';
        if (!href) return;
        var hfile = href.split('/').pop();
        if (!hfile) return;
        a.setAttribute('href', swapLang(hfile, lang));
      });

      var btn = mount.querySelector('#langToggle');
      if (btn) {
        btn.textContent = i18n[lang].btn;
        btn.setAttribute('aria-label', isKR ? 'Switch to English' : '한국어로 보기');
        btn.addEventListener('click', function() {
          var target = swapLang(currentFile, isKR ? 'en' : 'kr');
          location.href = target;
        });
      }
    } catch (e) { console.error(e); }
  }

  function afterInject() {
    var mount = document.getElementById(targetId);
    if (!mount) return;
    setupLanguage(mount);
    markActiveLinks(mount);
  }

  if (window.jQuery && typeof jQuery.fn.load === 'function') {
    jQuery(function($){
      $('#' + targetId).load(file, function() { afterInject(); });
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      var mount = document.getElementById(targetId);
      if (!mount) return;
      fetch(file, {cache:'no-cache'}).then(function(r){ return r.text(); }).then(function(html){
        mount.innerHTML = html;
        afterInject();
      }).catch(console.error);
    });
  }
})();
