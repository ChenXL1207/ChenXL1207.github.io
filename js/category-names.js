// 分类名称映射表 - 将英文slug映射到中文名称
const categoryNameMap = {
  'linux-embedded': 'Linux嵌入式开发',
  'ai-development': 'AI应用开发',
  'cpp-development': 'C++软件开发',
  'research-exchange': '科研学习交流',
  'experience-sharing': '心得体会'
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
      const cnName = categoryNameMap[slug];
      if (cnName) {
        link.textContent = cnName;
      }
    }
  });
});
