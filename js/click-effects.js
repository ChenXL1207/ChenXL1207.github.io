/* Click Effects - 点击弹出随机文字 + 粒子 */
(function () {
  'use strict';

  var TEXTS = ['❤️', '⭐', '✨', '🎉', '👏', '🔥', '💕', '🌟', 'Thanks!', '加油!', '棒!'];
  var COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4', '#f368e0'];
  var count = 0;

  document.addEventListener('click', function (e) {
    // 忽略链接、按钮、输入框上的点击
    var tag = e.target.tagName.toLowerCase();
    if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea') return;
    if (e.target.closest('a') || e.target.closest('button')) return;

    var x = e.clientX;
    var y = e.clientY;

    // 每次点击生成文字
    var text = document.createElement('div');
    text.className = 'ripple-text';
    text.textContent = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    text.style.left = (x - 15) + 'px';
    text.style.top = (y - 10) + 'px';
    document.body.appendChild(text);
    text.addEventListener('animationend', function () { text.remove(); });

    // 生成 6 个粒子
    for (var i = 0; i < 6; i++) {
      var p = document.createElement('div');
      p.className = 'ripple-particle';
      var angle = (Math.PI * 2 / 6) * i + Math.random() * 0.5;
      var dist = 30 + Math.random() * 40;
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
      p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.body.appendChild(p);
      p.addEventListener('animationend', function () { p.remove(); });
    }

    count++;
  }, false);
})();
