/* Live2D Widget Drag Support - 看板娘拖拽 */
(function () {
  'use strict';

  // ========== 查找看板娘容器 ==========
  function findContainer() {
    return document.getElementById('waifu')
      || document.getElementById('live2d-widget')
      || document.querySelector('.waifu')
      || document.querySelector('[class*="waifu"]')
      || document.querySelector('canvas#live2d')?.parentElement
      || null;
  }

  // ========== 设置拖拽 ==========
  function makeDraggable(container) {
    var canvas = container.querySelector('canvas');
    var isDragging = false;
    var startX, startY, origLeft, origTop;

    // 将 right/bottom 转成 left/top
    function normalizePosition() {
      var rect = container.getBoundingClientRect();
      container.style.right = 'auto';
      container.style.bottom = 'auto';
      container.style.left = rect.left + 'px';
      container.style.top = rect.top + 'px';
    }

    // 容器和画布都加上 pointer-events + cursor
    container.style.cursor = 'grab';
    container.style.userSelect = 'none';
    container.style.touchAction = 'none';
    if (canvas) {
      canvas.style.cursor = 'grab';
      canvas.style.pointerEvents = 'auto';
    }

    function getPos(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
      if (e.button && e.button !== 0) return;

      isDragging = true;
      container.style.cursor = 'grabbing';
      if (canvas) canvas.style.cursor = 'grabbing';

      normalizePosition();

      var pos = getPos(e);
      startX = pos.x;
      startY = pos.y;
      origLeft = parseInt(container.style.left, 10);
      origTop = parseInt(container.style.top, 10);

      e.preventDefault();
      e.stopPropagation();
    }

    function onMove(e) {
      if (!isDragging) return;

      var pos = getPos(e);
      var dx = pos.x - startX;
      var dy = pos.y - startY;

      var rect = container.getBoundingClientRect();
      var newLeft = origLeft + dx;
      var newTop = origTop + dy;

      // 边界限制
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

      container.style.left = newLeft + 'px';
      container.style.top = newTop + 'px';

      e.preventDefault();
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';
      if (canvas) canvas.style.cursor = 'grab';
    }

    // 鼠标事件 - 同时绑定 container 和 canvas
    var targets = [container];
    if (canvas) targets.push(canvas);

    targets.forEach(function (t) {
      t.addEventListener('mousedown', onDown);
      t.addEventListener('touchstart', onDown, { passive: false });
    });

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    console.log('[Live2D Drag] 拖拽已启用');
  }

  // ========== 等待看板娘加载 ==========
  function waitForWidget() {
    var container = findContainer();
    if (container) {
      makeDraggable(container);
      return;
    }

    // 用 MutationObserver 监听 DOM 变化
    var observer = new MutationObserver(function () {
      var c = findContainer();
      if (c) {
        observer.disconnect();
        makeDraggable(c);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 兜底：10 秒后超时
    setTimeout(function () {
      observer.disconnect();
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForWidget);
  } else {
    waitForWidget();
  }
})();
