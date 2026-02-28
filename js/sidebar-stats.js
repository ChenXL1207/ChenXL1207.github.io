// 侧边栏统计功能
document.addEventListener('DOMContentLoaded', function() {
  // 计算总字数
  function countWords() {
    const articles = document.querySelectorAll('article');
    let totalWords = 0;
    articles.forEach(article => {
      const text = article.innerText;
      const matches = text.match(/[\u4e00-\u9fa5]/g);
      const chineseCount = matches ? matches.length : 0;
      const englishCount = text.split(/\s+/).length;
      totalWords += chineseCount + englishCount / 2;
    });
    return Math.round(totalWords);
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
  const totalWords = countWords();
  const totalViews = initPageViews();

  // 插入统计信息到侧边栏
  const siteState = document.querySelector('.site-state');
  if (siteState) {
    // 添加总字数项
    const wordsItem = document.createElement('div');
    wordsItem.className = 'site-state-item site-state-words';
    wordsItem.innerHTML = `
      <span class="site-state-item-count">${(totalWords / 1000).toFixed(1)}k</span>
      <span class="site-state-item-name">字数</span>
    `;
    siteState.appendChild(wordsItem);

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

    // 计算运行时间
    const startDate = new Date('2026-02-26');
    setInterval(function() {
      const now = new Date();
      const diff = now - startDate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      document.getElementById('runtime').textContent = `${days}天${hours}小时${minutes}分`;
    }, 1000);
  }
});
