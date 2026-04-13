document.addEventListener("DOMContentLoaded", function () {
  // 首页整卡可点击，保留内部链接优先级。
  const cards = document.querySelectorAll(".index .post-block");
  cards.forEach((card) => {
    const titleLink = card.querySelector(".post-title-link");
    if (!titleLink) return;

    card.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.closest("a, button, input, textarea")) return;
      window.location.href = titleLink.getAttribute("href");
    });
  });

  // 外链增加标识，提升阅读可预期性。
  const links = document.querySelectorAll(".post-body a[href]");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !/^https?:\/\//.test(href)) return;
    if (link.dataset.enhanced === "1") return;
    link.dataset.enhanced = "1";
    link.classList.add("external-link");
    if (!link.textContent.includes("↗")) {
      link.textContent = link.textContent + " ↗";
    }
  });
});
