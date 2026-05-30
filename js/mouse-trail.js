/* Mouse Trail Effect - 鼠标移动跟随小星星 */
(function () {
  'use strict';

  var SYMBOLS = ['✦', '✧', '⋆', '·', '°', '★', '☆', '✿'];
  var COLORS = ['#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#60a5fa', '#f87171', '#fb923c', '#e879f9'];
  var lastTime = 0;
  var THROTTLE = 50; // 每 50ms 最多生成一个

  document.addEventListener('mousemove', function (e) {
    var now = Date.now();
    if (now - lastTime < THROTTLE) return;
    lastTime = now;

    var star = document.createElement('div');
    star.className = 'mouse-star';
    star.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    star.style.left = (e.clientX - 6) + 'px';
    star.style.top = (e.clientY - 6) + 'px';
    star.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    star.style.fontSize = (8 + Math.random() * 10) + 'px';

    document.body.appendChild(star);
    star.addEventListener('animationend', function () { star.remove(); });
  }, false);
})();
