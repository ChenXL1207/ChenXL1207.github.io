// 侧边栏统计功能
document.addEventListener('DOMContentLoaded', function() {
  // 优化字数统计，兼容 Next 主题所有页面
  function countWords() {
    // 统计所有正文内容（.post-content），如果没有则统计所有可见文本
    let totalWords = 0;
    const contents = document.querySelectorAll('.post-content');
    if (contents.length > 0) {
      contents.forEach(content => {
        const text = content.innerText || '';
        // 中文字数
        const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        // 英文单词数
        const englishCount = (text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g) || []).length;
        totalWords += chineseCount + englishCount;
      });
    } else {
      // 兜底：统计整个 body 的可见文本
      const text = document.body.innerText || '';
      const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
      const englishCount = (text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g) || []).length;
      totalWords = chineseCount + englishCount;
    }
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
