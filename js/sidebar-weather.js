/* Sidebar Weather Widget - 实时时钟 + 定位 + 和风天气 */
(function () {
  'use strict';

  // ========== 配置 ==========
  // 和风天气开发者免费注册: https://devapi.qweather.com/
  // 注册后获取 key 和 host，填入下方
  var QWEATHER_KEY = '2969a5479a694feab6fbb6c0b1157015';
  var QWEATHER_HOST = 'ma7dn7p2x8.re.qweatherapi.com';

  // ========== 天气图标映射 ==========
  var WEATHER_ICONS = {
    '100': '☀️', '101': '⛅', '102': '⛅', '103': '🌤️', '104': '☁️',
    '150': '🌙', '151': '🌙', '152': '🌙', '153': '🌙',
    '300': '🌦️', '301': '🌧️', '302': '⛈️', '303': '⛈️', '304': '⛈️',
    '305': '🌧️', '306': '🌧️', '307': '🌧️', '308': '🌧️', '309': '🌧️',
    '310': '🌧️', '311': '🌧️', '312': '🌧️', '313': '🌧️', '314': '🌧️',
    '315': '🌧️', '316': '🌧️', '317': '🌧️', '318': '🌧️',
    '350': '🌧️', '351': '🌧️', '399': '🌧️',
    '400': '🌨️', '401': '🌨️', '402': '❄️', '403': '❄️', '404': '🌨️',
    '405': '🌨️', '406': '🌨️', '407': '🌨️', '408': '🌨️', '409': '🌨️',
    '410': '❄️', '456': '🌨️', '457': '🌨️', '499': '🌨️',
    '500': '🌫️', '501': '🌫️', '502': '🌫️', '503': '🌫️', '504': '🌫️',
    '507': '🌫️', '508': '🌫️', '509': '🌫️', '510': '🌫️', '511': '🌫️', '512': '🌫️', '513': '🌫️', '514': '🌫️', '515': '🌫️',
    '900': '🌡️', '901': '❄️', '999': '❓'
  };

  // ========== 实时时钟 ==========
  function updateClock() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    var el = document.getElementById('ww-clock-time');
    if (el) el.textContent = h + ':' + m + ':' + s;

    var days = ['日', '一', '二', '三', '四', '五', '六'];
    var y = now.getFullYear();
    var mon = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var el2 = document.getElementById('ww-clock-date');
    if (el2) el2.textContent = y + '年' + mon + '月' + d + '日 星期' + days[now.getDay()];
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ========== 和风天气天气代码 → 图标 ==========
  function getWeatherIcon(code) {
    return WEATHER_ICONS[code] || '🌡️';
  }

  // ========== 获取天气 ==========
  function fetchWeather(lat, lon) {
    if (QWEATHER_KEY === 'YOUR_QWEATHER_KEY') {
      // 未配置 API Key，显示提示
      var loading = document.getElementById('ww-loading');
      if (loading) {
        loading.innerHTML = '<i class="fa fa-exclamation-circle"></i> 请配置和风天气 API Key';
      }
      return;
    }

    var url = 'https://' + QWEATHER_HOST + '/v7/weather/now?location=' + lon + ',' + lat + '&key=' + QWEATHER_KEY;

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.code !== '200') throw new Error('API error: ' + data.code);
        var now = data.now;
        showWeather({
          temp: now.temp,
          feels: now.feelsLike,
          humidity: now.humidity,
          wind: now.windSpeed,
          desc: now.text,
          icon: now.icon
        });
      })
      .catch(function (err) {
        console.error('[Weather Widget]', err);
        var loading = document.getElementById('ww-loading');
        if (loading) {
          loading.innerHTML = '<i class="fa fa-exclamation-circle"></i> 天气获取失败';
        }
      });
  }

  // ========== 显示天气 ==========
  function showWeather(w) {
    document.getElementById('ww-loading').style.display = 'none';
    document.getElementById('ww-info').style.display = 'block';
    document.getElementById('ww-icon').textContent = getWeatherIcon(w.icon);
    document.getElementById('ww-temp').textContent = w.temp + '°C';
    document.getElementById('ww-desc').textContent = w.desc;
    document.getElementById('ww-humidity').textContent = w.humidity + '%';
    document.getElementById('ww-wind').textContent = w.wind + ' km/h';
    document.getElementById('ww-feels').textContent = w.feels + '°C';
  }

  // ========== 定位并获取天气 ==========
  function locateAndFetch() {
    if (!navigator.geolocation) {
      // 浏览器不支持定位，使用 IP 定位
      fetchWeatherByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        document.getElementById('ww-city').textContent = '当前位置';
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      function () {
        // 定位被拒绝，使用 IP 定位
        fetchWeatherByIP();
      },
      { timeout: 5000 }
    );
  }

  // ========== IP 定位 ==========
  function fetchWeatherByIP() {
    document.getElementById('ww-city').textContent = '自动定位中...';

    // 使用和风天气 GeoAPI 通过 IP 获取位置（如果支持），否则使用免费 IP 定位
    // 先尝试用 wttr.in 作为免费降级方案
    if (QWEATHER_KEY === 'YOUR_QWEATHER_KEY') {
      var loading = document.getElementById('ww-loading');
      if (loading) {
        loading.innerHTML = '<i class="fa fa-info-circle"></i> 配置 API Key 后显示天气';
      }
      // 仍然尝试免费方案
      fetchFreeWeather();
      return;
    }

    // 使用 IP 定位服务获取坐标
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.latitude && data.longitude) {
          document.getElementById('ww-city').textContent = data.city || '未知城市';
          fetchWeather(data.latitude, data.longitude);
        } else {
          throw new Error('IP location failed');
        }
      })
      .catch(function () {
        fetchFreeWeather();
      });
  }

  // ========== 免费天气降级方案 (wttr.in) ==========
  function fetchFreeWeather() {
    fetch('https://wttr.in/?format=j1')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var cur = data.current_condition[0];
        var area = data.nearest_area[0];
        document.getElementById('ww-city').textContent =
          (area.areaName && area.areaName[0].value) || '当前位置';
        showWeather({
          temp: cur.temp_C,
          feels: cur.FeelsLikeC,
          humidity: cur.humidity,
          wind: cur.windspeedKmph,
          desc: cur.lang_zh && cur.lang_zh[0] ? cur.lang_zh[0].value : cur.weatherDesc[0].value,
          icon: '100' // 默认图标
        });
      })
      .catch(function (err) {
        console.error('[Weather Widget] fallback failed', err);
        var loading = document.getElementById('ww-loading');
        if (loading) {
          loading.innerHTML = '<i class="fa fa-exclamation-circle"></i> 无法获取天气信息';
        }
      });
  }

  // ========== 启动 ==========
  locateAndFetch();
})();
