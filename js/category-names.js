// Category name mapping - English slug to Chinese display name
var categoryNameMap = {
  'cpp': {
    name: 'C++ 开发',
    icon: '⚙️',
    color: '#2563eb'
  },
  'algorithm': {
    name: '算法与数据结构',
    icon: '🧮',
    color: '#16a34a'
  },
  'ai': {
    name: 'AI 应用开发',
    icon: '🤖',
    color: '#9333ea'
  },
  'embedded': {
    name: '嵌入式开发',
    icon: '🔧',
    color: '#ea580c'
  },
  // Legacy mappings (for backwards compatibility during transition)
  'linux-embedded': {
    name: '嵌入式开发',
    icon: '🔧',
    color: '#ea580c'
  },
  'ai-development': {
    name: 'AI 应用开发',
    icon: '🤖',
    color: '#9333ea'
  },
  'cpp-development': {
    name: 'C++ 开发',
    icon: '⚙️',
    color: '#2563eb'
  },
  'leetcode-algorithm': {
    name: '算法与数据结构',
    icon: '🧮',
    color: '#16a34a'
  },
  'C++项目': {
    name: 'C++ 开发',
    icon: '⚙️',
    color: '#2563eb'
  },
  'ai工具使用': {
    name: 'AI 应用开发',
    icon: '🤖',
    color: '#9333ea'
  },
  '鸿蒙应用开发学习': {
    name: '嵌入式开发',
    icon: '🔧',
    color: '#ea580c'
  },
  '算法心得': {
    name: '算法与数据结构',
    icon: '🧮',
    color: '#16a34a'
  }
};

// Replace English category slugs with Chinese names on page
document.addEventListener('DOMContentLoaded', function () {
  var categoryLinks = document.querySelectorAll('.post-categories a');
  categoryLinks.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var match = href.match(/\/categories\/([^/]+)\//);
    if (match) {
      var slug = match[1];
      var catInfo = categoryNameMap[slug];
      if (catInfo) {
        link.textContent = catInfo.name;
      }
    }
  });
});
