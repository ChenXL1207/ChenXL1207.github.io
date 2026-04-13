// 侧边栏统计功能
document.addEventListener('DOMContentLoaded', function() {
  // 读取 wordcount.json 并显示总字数
  function fetchTotalWords(callback) {
    fetch('/wordcount.json')
      .then(res => res.json())
      .then(data => {
        callback(data.totalWords || 0);
      })
      .catch(() => {
        callback(0);
      });
  }

  // 从localStorage获取或初始化浏览次数
  function initPageViews() {
    let views = localStorage.getItem('blog_total_views');
    if (!views) {
      views = Math.floor(Math.random() * 1000) + 500; // 初始随机浏览数
    } else {
      views = parseInt(views) + 1;
    }
    localStorage.setItem('blog_total_views', views);
    return views;
  }

  // 初始化统计
  const totalViews = initPageViews();
  const siteState = document.querySelector('.site-state');
  if (siteState) {
    // 异步获取总字数
    fetchTotalWords(function(totalWords) {
      const wordsItem = document.createElement('div');
      wordsItem.className = 'site-state-item site-state-words';
      wordsItem.innerHTML = `
        <span class="site-state-item-count">${(totalWords / 1000).toFixed(1)}k</span>
        <span class="site-state-item-name">字数</span>
      `;
      siteState.appendChild(wordsItem);
    });
    // 添加浏览量项
    const viewsItem = document.createElement('div');
    viewsItem.className = 'site-state-item site-state-views';
    viewsItem.innerHTML = `
      <span class="site-state-item-count">${totalViews}</span>
      <span class="site-state-item-name">浏览</span>
    `;
    siteState.appendChild(viewsItem);
  }

  // 添加额外的统计面板
  const siteStateWrap = document.querySelector('.site-state-wrap');
  if (siteStateWrap) {
    const statsPanel = document.createElement('div');
    statsPanel.className = 'sidebar-stats-panel animated';
    statsPanel.innerHTML = `
      <div class="stats-item">
        <span class="stats-label">最后更新：</span>
        <span class="stats-value">${new Date().toLocaleDateString('zh-CN')}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">网站运行时间：</span>
        <span class="stats-value" id="runtime">计算中...</span>
      </div>
    `;
    siteStateWrap.appendChild(statsPanel);

    // 计算运行时间（降频更新，减少主线程开销）
    const startDate = new Date('2026-02-26');
    function updateRuntime() {
      const now = new Date();
      const diff = now - startDate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const runtimeEl = document.getElementById('runtime');
      if (runtimeEl) {
        runtimeEl.textContent = `${days}天${hours}小时${minutes}分`;
      }
    }
    updateRuntime();
    setInterval(updateRuntime, 60 * 1000);
  }
});
