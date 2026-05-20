// Sidebar statistics
document.addEventListener('DOMContentLoaded', function() {
  var isEnglish = window.location.pathname.startsWith('/en/');

  // Fetch total word count from wordcount.json
  function fetchTotalWords(callback) {
    fetch('/wordcount.json')
      .then(function(res) { return res.json(); })
      .then(function(data) { callback(data.totalWords || 0); })
      .catch(function() { callback(0); });
  }

  // Initialize page views from localStorage
  function initPageViews() {
    var views = localStorage.getItem('blog_total_views');
    if (!views) {
      views = Math.floor(Math.random() * 1000) + 500;
    } else {
      views = parseInt(views) + 1;
    }
    localStorage.setItem('blog_total_views', views);
    return views;
  }

  var totalViews = initPageViews();
  var siteState = document.querySelector('.site-state');
  if (siteState) {
    fetchTotalWords(function(totalWords) {
      var wordsItem = document.createElement('div');
      wordsItem.className = 'site-state-item site-state-words';
      wordsItem.innerHTML = '<span class="site-state-item-count">' + (totalWords / 1000).toFixed(1) + 'k</span>' +
        '<span class="site-state-item-name">' + (isEnglish ? 'Words' : '字数') + '</span>';
      siteState.appendChild(wordsItem);
    });
    var viewsItem = document.createElement('div');
    viewsItem.className = 'site-state-item site-state-views';
    viewsItem.innerHTML = '<span class="site-state-item-count">' + totalViews + '</span>' +
      '<span class="site-state-item-name">' + (isEnglish ? 'Views' : '浏览') + '</span>';
    siteState.appendChild(viewsItem);
  }

  // Stats panel
  var siteStateWrap = document.querySelector('.site-state-wrap');
  if (siteStateWrap) {
    var statsPanel = document.createElement('div');
    statsPanel.className = 'sidebar-stats-panel animated';
    var locale = isEnglish ? 'en-US' : 'zh-CN';
    statsPanel.innerHTML =
      '<div class="stats-item">' +
        '<span class="stats-label">' + (isEnglish ? 'Last Updated: ' : '最后更新：') + '</span>' +
        '<span class="stats-value">' + new Date().toLocaleDateString(locale) + '</span>' +
      '</div>' +
      '<div class="stats-item">' +
        '<span class="stats-label">' + (isEnglish ? 'Uptime: ' : '网站运行时间：') + '</span>' +
        '<span class="stats-value" id="runtime">' + (isEnglish ? 'Calculating...' : '计算中...') + '</span>' +
      '</div>';
    siteStateWrap.appendChild(statsPanel);

    var startDate = new Date('2026-02-26');
    function updateRuntime() {
      var now = new Date();
      var diff = now - startDate;
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var runtimeEl = document.getElementById('runtime');
      if (runtimeEl) {
        runtimeEl.textContent = isEnglish
          ? days + 'd ' + hours + 'h ' + minutes + 'm'
          : days + '天' + hours + '小时' + minutes + '分';
      }
    }
    updateRuntime();
    setInterval(updateRuntime, 60 * 1000);
  }
});
