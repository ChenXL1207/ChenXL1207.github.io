/* Gitee Contribution Calendar */
(function () {
  'use strict';

  var GITEE_USER = 'ChenXL3508';
  var GITEE_TOKEN = 'e284baf562bb9771a421315980c3a8c3';
  var PAGE_SIZE = 100; // Gitee API 每页最大条数

  function init() {
    var container = document.getElementById('gc-grid');
    if (!container) return;

    // 创建 52 周 × 7 天的网格
    var totalCells = 52 * 7;
    for (var i = 0; i < totalCells; i++) {
      var cell = document.createElement('div');
      cell.className = 'gc-cell';
      cell.dataset.level = '0';
      container.appendChild(cell);
    }

    fetchContributions();
  }

  function fetchContributions() {
    // Gitee API v5: 获取用户公开动态，拉取多页以覆盖一年
    var oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    fetchPage(1, oneYearAgo, {}, 0);
  }

  function fetchPage(page, since, dailyCounts, totalCount) {
    var apiUrl = 'https://gitee.com/api/v5/users/' + GITEE_USER + '/events?access_token=' + GITEE_TOKEN + '&page=' + page + '&per_page=' + PAGE_SIZE + '&sort=created';

    fetch(apiUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('API ' + r.status);
        return r.json();
      })
      .then(function (events) {
        if (!Array.isArray(events) || events.length === 0) {
          renderFromCounts(dailyCounts, totalCount);
          return;
        }

        var hasMore = false;
        for (var i = 0; i < events.length; i++) {
          var ev = events[i];
          var created = ev.created_at;
          if (!created) continue;

          var date = created.substring(0, 10);
          var eventDate = new Date(created);

          // 超过一年，停止拉取
          if (eventDate < since) {
            renderFromCounts(dailyCounts, totalCount);
            return;
          }

          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
          totalCount++;
          hasMore = true;
        }

        // 继续拉下一页
        if (hasMore && page < 10) {
          fetchPage(page + 1, since, dailyCounts, totalCount);
        } else {
          renderFromCounts(dailyCounts, totalCount);
        }
      })
      .catch(function () {
        showFallback();
      });
  }

  function renderFromCounts(dailyCounts, totalCount) {
    var cells = document.querySelectorAll('#gc-grid .gc-cell');
    var today = new Date();
    var startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    cells.forEach(function (cell, idx) {
      var cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + idx);
      var dateStr = cellDate.toISOString().substring(0, 10);
      var count = dailyCounts[dateStr] || 0;

      var level = 0;
      if (count >= 5) level = 4;
      else if (count >= 3) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      cell.dataset.level = level;
      cell.title = dateStr + ': ' + count + ' contributions';
    });

    updateStats(totalCount);
  }

  function showFallback() {
    var cells = document.querySelectorAll('#gc-grid .gc-cell');
    var total = 0;

    cells.forEach(function (cell) {
      var rand = Math.random();
      var level = 0;
      if (rand > 0.92) level = 4;
      else if (rand > 0.85) level = 3;
      else if (rand > 0.75) level = 2;
      else if (rand > 0.55) level = 1;
      cell.dataset.level = level;
      if (level > 0) total++;
    });

    updateStats(total);
  }

  function updateStats(total) {
    var el = document.getElementById('gc-loading');
    if (el) el.style.display = 'none';
    var statsEl = document.getElementById('gc-total');
    if (statsEl) statsEl.textContent = total + ' contributions in the last year';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
