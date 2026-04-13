document.addEventListener("DOMContentLoaded", function () {
  // 保留页面文件位置不迁移的前提下，把指定页面桥接到分类页展示。
  const header = document.querySelector(".collection-header");
  if (!header) return;

  const title = (header.textContent || "").trim();
  if (!title.includes("C++项目")) return;

  const listRoot = document.querySelector(".posts-collapse .post-content");
  if (!listRoot) return;

  const existed = Array.from(listRoot.querySelectorAll(".post-title-link")).some((link) =>
    (link.getAttribute("href") || "").includes("/CppProgram/CacheSystem.html")
  );
  if (existed) return;

  const article = document.createElement("article");
  article.setAttribute("itemscope", "");
  article.setAttribute("itemtype", "http://schema.org/Article");
  article.innerHTML = `
    <header class="post-header">
      <div class="post-meta-container">
        <time datetime="2026-04-01" content="2026-04-01">04-01</time>
      </div>
      <div class="post-title">
        <a class="post-title-link" href="/CppProgram/CacheSystem.html" itemprop="url">
          <span itemprop="name">C++缓存系统项目</span>
        </a>
      </div>
    </header>
  `;

  listRoot.appendChild(article);
});
