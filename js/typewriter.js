/* Typewriter Effect - 副标题打字机动画 */
(function () {
  'use strict';

  var WORDS = [
    'Xdu teleCom student',
    'Software Developer',
    'Passionate Blogger',
    'Lifelong Learner'
  ];

  var TYPE_SPEED = 80;   // 打字速度 (ms)
  var DELETE_SPEED = 50; // 删除速度 (ms)
  var PAUSE_TIME = 2000; // 每个词停留时间 (ms)

  function init() {
    // 找到副标题元素（Next 主题）
    var subtitle = document.querySelector('.site-subtitle');
    if (!subtitle) return;

    // 保存原始文字
    var originalText = subtitle.textContent.trim();
    // 以第一个词作为起始
    var words = [originalText].concat(WORDS.filter(function (w) { return w !== originalText; }));

    subtitle.innerHTML = '<span class="tw-container"><span class="tw-text"></span><span class="tw-cursor"></span></span>';
    var textEl = subtitle.querySelector('.tw-text');

    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function type() {
      var currentWord = words[wordIndex % words.length];

      if (!isDeleting) {
        // 打字中
        textEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
          // 打完，停留后开始删除
          setTimeout(function () {
            isDeleting = true;
            type();
          }, PAUSE_TIME);
          return;
        }

        setTimeout(type, TYPE_SPEED + Math.random() * 40);
      } else {
        // 删除中
        textEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex++;
          setTimeout(type, 400);
          return;
        }

        setTimeout(type, DELETE_SPEED);
      }
    }

    // 启动
    setTimeout(type, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
