// 分类名称映射表 - 将英文slug映射到中文名称和图标
const categoryNameMap = {
  'linux-embedded': {
    name: 'Linux嵌入式开发',
    icon: '🐧'
  },
  'ai-development': {
    name: 'AI应用开发',
    icon: '🤖'
  },
  'cpp-development': {
    name: 'C++软件开发',
    icon: '⚙️'
  },
  'research-exchange': {
    name: '科研学习交流',
    icon: '🔬'
  },
  'experience-sharing': {
    name: '心得体会',
    icon: '💡'
  }
};

// 将所有post-categories中的英文分类名替换为中文
document.addEventListener('DOMContentLoaded', function() {
  // 处理首页卡片上的分类名
  const categoryLinks = document.querySelectorAll('.post-categories a');
  categoryLinks.forEach(link => {
    const href = link.getAttribute('href');
    const match = href.match(/\/categories\/([^/]+)\//);
    if (match) {
      const slug = match[1];
      const catInfo = categoryNameMap[slug];
      if (catInfo) {
        link.textContent = catInfo.name;
      }
    }
  });
});
