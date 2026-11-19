// 本站运行时间：从 2026-11-16（北京时间 00:00）起实时计时。
(function () {
  var el = document.getElementById('uptime');
  if (!el) return;

  var start = new Date('2026-11-16T00:00:00+08:00').getTime();

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function render() {
    var diff = Date.now() - start;
    if (diff < 0) diff = 0;

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    el.innerHTML =
      '<b>' + days + '</b>天 ' +
      '<b>' + pad(hours) + '</b>时 ' +
      '<b>' + pad(minutes) + '</b>分 ' +
      '<b>' + pad(seconds) + '</b>秒';
  }

  render();
  window.setInterval(render, 1000);
})();
