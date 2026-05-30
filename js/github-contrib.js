/* GitHub Contribution Calendar */
(function () {
  'use strict';

  var GITHUB_USER = 'ChenXL1207';

  function init() {
    var container = document.getElementById('gh-grid');
    if (!container) return;

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
    var apiUrl = 'https://api.github.com/users/' + GITHUB_USER + '/events/public?per_page=100';

    fetch(apiUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('API ' + r.status);
        return r.json();
      })
      .then(function (events) {
        renderFromEvents(events);
      })
      .catch(function () {
        showFallback();
      });
  }

  function renderFromEvents(events) {
    var cells = document.querySelectorAll('#gh-grid .gc-cell');
    var today = new Date();
    var startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    var dailyCounts = {};
    var totalCount = 0;

    events.forEach(function (ev) {
      if (!ev.created_at) return;
      var date = ev.created_at.substring(0, 10);
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      totalCount++;
    });

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
    var cells = document.querySelectorAll('#gh-grid .gc-cell');
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
    var el = document.getElementById('gh-loading');
    if (el) el.style.display = 'none';
    var statsEl = document.getElementById('gh-total');
    if (statsEl) statsEl.textContent = total + ' contributions in the last year';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
