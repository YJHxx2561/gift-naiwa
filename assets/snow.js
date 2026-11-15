(function () {
  var canvas = document.getElementById('snow');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var width = 0;
  var height = 0;
  var dpr = 1;
  var flakes = [];
  var stars = [];
  var frameId = 0;
  var running = false;
  var lastTime = 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake(anywhere) {
    var depth = Math.random();
    return {
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -12,
      r: 0.8 + depth * 2.6,
      vy: 12 + depth * 34,
      vx: rand(-6, 6),
      phase: Math.random() * Math.PI * 2,
      wobble: rand(6, 18),
      alpha: 0.22 + depth * 0.55
    };
  }

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var flakeCount = Math.round(Math.min(150, Math.max(45, width / 9)));
    flakes = [];
    for (var i = 0; i < flakeCount; i++) flakes.push(makeFlake(true));

    var starCount = Math.round(Math.min(110, Math.max(40, width / 14)));
    stars = [];
    for (var j = 0; j < starCount; j++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.72,
        r: rand(0.4, 1.5),
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.4, 1.2)
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = 0.24 + 0.42 * (0.5 + 0.5 * Math.sin(time * 0.001 * s.speed + s.phase));
      ctx.beginPath();
      ctx.fillStyle = 'rgba(214, 230, 255, ' + alpha.toFixed(3) + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var k = 0; k < flakes.length; k++) {
      var f = flakes[k];
      var driftX = Math.sin(time * 0.001 + f.phase) * f.wobble * 0.15;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(236, 244, 255, ' + f.alpha.toFixed(3) + ')';
      ctx.arc(f.x + driftX, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function step(time) {
    if (!lastTime) lastTime = time;
    var dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy * dt;
      f.x += (f.vx + Math.sin(time * 0.0008 + f.phase) * f.wobble) * dt;

      if (f.y - f.r > height) {
        f.y = -f.r - Math.random() * 40;
        f.x = Math.random() * width;
      }
      if (f.x < -20) f.x = width + 20;
      else if (f.x > width + 20) f.x = -20;
    }

    draw(time);
    frameId = window.requestAnimationFrame(step);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    lastTime = 0;
    frameId = window.requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(frameId);
  }

  build();
  if (reduceMotion) {
    draw(0);
  } else {
    start();
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      build();
      if (reduceMotion) draw(0);
    }, 150);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });
})();
