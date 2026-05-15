document.addEventListener("DOMContentLoaded", function () {
  // Card click-to-navigate
  var cards = document.querySelectorAll(".index .post-block");
  cards.forEach(function (card) {
    var titleLink = card.querySelector(".post-title-link");
    if (!titleLink) return;

    // Add category data attribute for color coding
    var catLink = card.querySelector(".post-categories a");
    if (catLink) {
      var href = catLink.getAttribute("href") || "";
      var match = href.match(/\/categories\/([^/]+)\//);
      if (match) {
        card.setAttribute("data-cat", match[1]);
      }
    }

    card.addEventListener("click", function (event) {
      var target = event.target;
      if (target && target.closest("a, button, input, textarea")) return;
      window.location.href = titleLink.getAttribute("href");
    });
  });

  // External link enhancement
  var links = document.querySelectorAll(".post-body a[href]");
  links.forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || !/^https?:\/\//.test(href)) return;
    if (link.dataset.enhanced === "1") return;
    link.dataset.enhanced = "1";
    link.classList.add("external-link");
    if (!link.textContent.includes("↗")) {
      link.textContent = link.textContent + " ↗";
    }
  });

  // Intersection Observer for scroll reveal
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
      revealObserver.observe(el);
    });
  }
});
