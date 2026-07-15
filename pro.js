/* MapTap Pro — World Edition.
   maptap.gg-style play: a satellite globe (NASA Blue Marble raster,
   reprojected per-pixel onto an orthographic view), drag to spin,
   tap to guess. Score = proximity + speed. */

(async function () {
  // ---------------------------------------------------------------
  // QUESTION DATA
  // ---------------------------------------------------------------
  const CITIES = [
    { name: "Paris", coords: [2.352, 48.857] }, { name: "London", coords: [-0.128, 51.507] },
    { name: "New York", coords: [-74.006, 40.713] }, { name: "Tokyo", coords: [139.692, 35.690] },
    { name: "Sydney", coords: [151.209, -33.868] }, { name: "Rio de Janeiro", coords: [-43.173, -22.907] },
    { name: "Cairo", coords: [31.236, 30.044] }, { name: "Moscow", coords: [37.618, 55.756] },
    { name: "Beijing", coords: [116.407, 39.904] }, { name: "Mumbai", coords: [72.878, 19.076] },
    { name: "Cape Town", coords: [18.424, -33.925] }, { name: "Mexico City", coords: [-99.133, 19.433] },
    { name: "Buenos Aires", coords: [-58.382, -34.604] }, { name: "Toronto", coords: [-79.383, 43.653] },
    { name: "Singapore", coords: [103.820, 1.352] }, { name: "Dubai", coords: [55.271, 25.205] },
    { name: "Istanbul", coords: [28.979, 41.008] }, { name: "Rome", coords: [12.496, 41.903] },
    { name: "Berlin", coords: [13.405, 52.520] }, { name: "Madrid", coords: [-3.704, 40.417] },
    { name: "Bangkok", coords: [100.502, 13.756] }, { name: "Seoul", coords: [126.978, 37.567] },
    { name: "Nairobi", coords: [36.817, -1.286] }, { name: "Lagos", coords: [3.379, 6.524] },
    { name: "Lima", coords: [-77.043, -12.046] }, { name: "Honolulu", coords: [-157.858, 21.307] },
    { name: "Reykjavik", coords: [-21.940, 64.147] }, { name: "Athens", coords: [23.727, 37.984] },
    { name: "Amsterdam", coords: [4.895, 52.370] }, { name: "Los Angeles", coords: [-118.243, 34.052] }
  ];

  const LANDMARKS = [
    { name: "Eiffel Tower", coords: [2.294, 48.858] }, { name: "Great Pyramid of Giza", coords: [31.134, 29.979] },
    { name: "Great Wall of China", coords: [116.017, 40.354] }, { name: "Taj Mahal", coords: [78.042, 27.175] },
    { name: "Machu Picchu", coords: [-72.545, -13.163] }, { name: "Statue of Liberty", coords: [-74.045, 40.689] },
    { name: "Christ the Redeemer", coords: [-43.211, -22.952] }, { name: "Sydney Opera House", coords: [151.215, -33.857] },
    { name: "Stonehenge", coords: [-1.826, 51.179] }, { name: "Colosseum", coords: [12.492, 41.890] },
    { name: "Mount Everest", coords: [86.925, 27.988] }, { name: "Grand Canyon", coords: [-112.113, 36.107] },
    { name: "Niagara Falls", coords: [-79.074, 43.081] }, { name: "Victoria Falls", coords: [25.857, -17.925] },
    { name: "Uluru", coords: [131.036, -25.345] }, { name: "Angkor Wat", coords: [103.867, 13.412] },
    { name: "Petra", coords: [35.444, 30.329] }, { name: "Mount Kilimanjaro", coords: [37.355, -3.067] },
    { name: "Golden Gate Bridge", coords: [-122.478, 37.819] }, { name: "Mount Fuji", coords: [138.727, 35.361] }
  ];

  const COUNTRY_POOL = [
    "United States of America", "Canada", "Mexico", "Brazil", "Argentina", "Chile", "Peru", "Colombia",
    "United Kingdom", "France", "Spain", "Portugal", "Germany", "Italy", "Greece", "Norway", "Sweden",
    "Finland", "Poland", "Ukraine", "Iceland", "Ireland", "Switzerland", "Netherlands", "Turkey", "Russia",
    "Egypt", "Nigeria", "Kenya", "South Africa", "Madagascar", "Morocco", "Ethiopia", "Saudi Arabia",
    "India", "China", "Japan", "South Korea", "Thailand", "Vietnam", "Indonesia", "Philippines",
    "Australia", "New Zealand", "Mongolia", "Kazakhstan", "Pakistan", "Iran"
  ];

  const ROUNDS = 10;
  const QTIME = 15; // seconds per question
  const MAX_PTS = 5000;

  // ---------------------------------------------------------------
  // GLOBE SETUP
  // ---------------------------------------------------------------
  const canvas = document.getElementById("globe-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = d3.select("#overlay");
  const overlayNode = overlay.node();

  let W = innerWidth, H = innerHeight;
  let rotate = [20, -20];
  let baseScale = Math.min(W, H) * 0.42;
  let scale = baseScale;

  const projection = d3.geoOrthographic();
  const geoPathGen = d3.geoPath(projection);
  function syncProjection() {
    projection.rotate([rotate[0], rotate[1]]).scale(scale).translate([W / 2, H / 2]).clipAngle(90);
  }

  // stars (static per resize)
  let stars = [];
  function makeStars() {
    stars = d3.range(220).map(() => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.3, a: Math.random() * 0.7 + 0.15
    }));
  }

  // satellite texture
  const tex = { data: null, w: 0, h: 0 };
  await new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const tw = 2700, th = 1350; // downsample: plenty for a screen-sized globe
      const c = document.createElement("canvas");
      c.width = tw; c.height = th;
      c.getContext("2d").drawImage(img, 0, 0, tw, th);
      tex.data = c.getContext("2d").getImageData(0, 0, tw, th).data;
      tex.w = tw; tex.h = th;
      resolve();
    };
    img.onerror = () => resolve(); // fall back to flat-color globe
    img.src = "data/earth.jpg";
  });

  // countries (for country hit-testing and the no-texture fallback)
  const world = await d3.json("data/countries-110m.json");
  const countries = topojson.feature(world, world.objects.countries).features;
  const countryQs = COUNTRY_POOL
    .map(n => countries.find(f => f.properties.name === n))
    .filter(Boolean)
    .map(f => ({ name: f.properties.name, feature: f, coords: d3.geoCentroid(f) }));

  // Per-pixel raster reprojection of the equirectangular satellite image
  // onto the orthographic view. Rendered into a small buffer and scaled up;
  // coarse while interacting, fine when idle.
  const buf = document.createElement("canvas");
  const bufCtx = buf.getContext("2d");
  const DEG = Math.PI / 180;

  function renderGlobe(quality) {
    ctx.clearRect(0, 0, W, H);
    // space
    ctx.fillStyle = "#060a18";
    ctx.fillRect(0, 0, W, H);
    for (const s of stars) {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = "#cfe0ff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // atmosphere glow
    const cx = W / 2, cy = H / 2;
    const glow = ctx.createRadialGradient(cx, cy, scale * 0.95, cx, cy, scale * 1.12);
    glow.addColorStop(0, "rgba(90, 160, 255, 0.35)");
    glow.addColorStop(1, "rgba(90, 160, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, scale * 1.12, 0, 7); ctx.fill();

    if (!tex.data) { renderVectorFallback(); return; }

    const bw = quality, bh = Math.max(2, Math.round(quality * H / W));
    if (buf.width !== bw || buf.height !== bh) { buf.width = bw; buf.height = bh; }
    const img = bufCtx.createImageData(bw, bh);
    const px = img.data;
    const sx = W / bw, sy = H / bh;
    const lam0 = rotate[0] * DEG, sinPhi0 = Math.sin(-rotate[1] * DEG), cosPhi0 = Math.cos(-rotate[1] * DEG);
    const tw = tex.w, th = tex.h, td = tex.data;
    for (let j = 0; j < bh; j++) {
      const Y = (j + 0.5) * sy;
      const dy = (cy - Y) / scale; // screen up = +
      for (let i = 0; i < bw; i++) {
        const X = (i + 0.5) * sx;
        const dx = (X - cx) / scale;
        const rho2 = dx * dx + dy * dy;
        if (rho2 > 1) continue; // space stays transparent
        const cosc = Math.sqrt(1 - rho2);
        const phi = Math.asin(cosc * sinPhi0 + dy * cosPhi0);
        const lam = lam0 + Math.atan2(dx, cosc * cosPhi0 - dy * sinPhi0);
        let u = (lam / DEG + 180) / 360;
        u -= Math.floor(u);
        const v = (90 - phi / DEG) / 180;
        const ti = ((v * th | 0) * tw + (u * tw | 0)) * 4;
        const o = (j * bw + i) * 4;
        // slight limb darkening for a photographed-from-space look
        const shade = 0.68 + 0.32 * cosc;
        px[o] = td[ti] * shade;
        px[o + 1] = td[ti + 1] * shade;
        px[o + 2] = td[ti + 2] * shade;
        px[o + 3] = 255;
      }
    }
    bufCtx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buf, 0, 0, W, H);
  }

  function renderVectorFallback() {
    syncProjection();
    ctx.save();
    ctx.beginPath(); ctx.arc(W / 2, H / 2, scale, 0, 7); ctx.clip();
    ctx.fillStyle = "#0d3b66";
    ctx.fillRect(0, 0, W, H);
    const p = d3.geoPath(projection, ctx);
    ctx.fillStyle = "#3e7c4f";
    countries.forEach(f => { ctx.beginPath(); p(f); ctx.fill(); });
    ctx.restore();
  }

  const COARSE = 420, FINE = 900;
  let fineTimer = null;
  function draw(interactive) {
    syncProjection();
    renderGlobe(interactive ? COARSE : FINE);
    redrawOverlay();
    if (interactive) {
      clearTimeout(fineTimer);
      fineTimer = setTimeout(() => { renderGlobe(FINE); redrawOverlay(); }, 180);
    }
  }

  function resize() {
    W = innerWidth; H = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    overlay.attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
    baseScale = Math.min(W, H) * 0.42;
    scale = Math.max(baseScale * 0.7, Math.min(scale, baseScale * 8));
    makeStars();
    draw(false);
  }
  window.addEventListener("resize", resize);

  // ---------------------------------------------------------------
  // OVERLAY (pins, arc) — drawn with the same projection, so it clips
  // to the visible hemisphere automatically
  // ---------------------------------------------------------------
  let marks = null; // { guess: [lon,lat] | null, truth: [lon,lat], label }
  const circleGen = d3.geoCircle();

  function redrawOverlay() {
    overlay.selectAll("*").remove();
    if (!marks) return;
    syncProjection();
    const pinR = Math.max(0.4, 60 / scale * 8); // degrees, roughly constant on screen
    if (marks.guess) {
      overlay.append("path")
        .attr("d", geoPathGen({ type: "LineString", coordinates: [marks.guess, marks.truth] }))
        .attr("fill", "none").attr("stroke", "#ffd93d").attr("stroke-width", 2.5)
        .attr("stroke-dasharray", "6 6");
      overlay.append("path")
        .attr("d", geoPathGen(circleGen.center(marks.guess).radius(pinR)()))
        .attr("fill", "#ff5d5d").attr("stroke", "#fff").attr("stroke-width", 1.5);
    }
    overlay.append("path")
      .attr("d", geoPathGen(circleGen.center(marks.truth).radius(pinR)()))
      .attr("fill", "#35e08d").attr("stroke", "#fff").attr("stroke-width", 1.5);
    const center = [-rotate[0], -rotate[1]];
    if (d3.geoDistance(marks.truth, center) < 1.45) {
      const [x, y] = projection(marks.truth);
      overlay.append("text")
        .attr("x", x).attr("y", y - 14)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff").attr("font-size", 15).attr("font-weight", 700)
        .attr("paint-order", "stroke").attr("stroke", "#060a18").attr("stroke-width", 4)
        .text(marks.label);
    }
  }

  // ---------------------------------------------------------------
  // INTERACTION: drag to spin, wheel/pinch/buttons to zoom, tap to guess
  // ---------------------------------------------------------------
  let dragDist = 0;
  overlay.call(
    d3.drag()
      .on("start", () => { dragDist = 0; })
      .on("drag", e => {
        dragDist += Math.abs(e.dx) + Math.abs(e.dy);
        const sens = 57 / scale;
        rotate[0] += e.dx * sens;
        rotate[1] = Math.max(-89, Math.min(89, rotate[1] - e.dy * sens));
        draw(true);
      })
  );
  overlay.call(
    d3.zoom()
      .filter(ev => ev.type === "wheel" || (ev.touches && ev.touches.length >= 2))
      .scaleExtent([0.7, 8])
      .on("zoom", e => { scale = baseScale * e.transform.k; draw(true); })
  ).on("dblclick.zoom", null);

  function zoomStep(f) {
    scale = Math.max(baseScale * 0.7, Math.min(baseScale * 8, scale * f));
    draw(true);
  }
  document.getElementById("pro-zoom-in").addEventListener("click", () => zoomStep(1.4));
  document.getElementById("pro-zoom-out").addEventListener("click", () => zoomStep(1 / 1.4));

  overlayNode.addEventListener("click", ev => {
    if (dragDist > 6) return; // that was a drag, not a tap
    const [mx, my] = d3.pointer(ev, overlayNode);
    if (Math.hypot(mx - W / 2, my - H / 2) > scale) return; // tapped space
    syncProjection();
    const ll = projection.invert([mx, my]);
    if (ll && game && game.awaiting) onGuess(ll);
  });

  // ---------------------------------------------------------------
  // SOUNDS
  // ---------------------------------------------------------------
  let audioCtx = null;
  function tone(freq, start, dur, vol = 0.12) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(audioCtx.currentTime + start); o.stop(audioCtx.currentTime + start + dur + 0.05);
  }

  // ---------------------------------------------------------------
  // GAME
  // ---------------------------------------------------------------
  const els = {
    hud: document.getElementById("pro-hud"),
    kind: document.getElementById("pro-kind"),
    target: document.getElementById("pro-target"),
    round: document.getElementById("pro-round"),
    score: document.getElementById("pro-score"),
    timerFill: document.getElementById("pro-timer-fill"),
    toast: document.getElementById("pro-toast"),
    start: document.getElementById("pro-start"),
    end: document.getElementById("pro-end"),
    endScore: document.getElementById("pro-end-score"),
    endTitle: document.getElementById("pro-end-title"),
    endMsg: document.getElementById("pro-end-msg"),
    challenge: document.getElementById("pro-challenge")
  };

  let game = null; // { questions, index, score, awaiting, qStart, timer }
  let challengeScore = null;

  function buildQuestions() {
    const pick = (arr, n) => d3.shuffle(arr.slice()).slice(0, n);
    return d3.shuffle([
      ...pick(countryQs, 4).map(c => ({ kind: "Country", ...c })),
      ...pick(CITIES, 3).map(c => ({ kind: "City", ...c })),
      ...pick(LANDMARKS, 3).map(c => ({ kind: "Landmark", ...c }))
    ]);
  }

  function startGame() {
    game = { questions: buildQuestions(), index: 0, score: 0 };
    els.score.textContent = "0";
    els.start.classList.add("hidden");
    els.end.classList.add("hidden");
    els.hud.classList.remove("hidden");
    marks = null;
    askQuestion();
  }

  function askQuestion() {
    const q = game.questions[game.index];
    marks = null;
    hideToast();
    els.kind.textContent = q.kind;
    els.target.textContent = q.name;
    els.round.textContent = `${game.index + 1} / ${ROUNDS}`;
    game.awaiting = true;
    game.qStart = Date.now();
    clearInterval(game.timer);
    game.timer = setInterval(() => {
      const left = QTIME - (Date.now() - game.qStart) / 1000;
      els.timerFill.style.width = Math.max(0, left / QTIME * 100) + "%";
      els.timerFill.classList.toggle("low", left < 4);
      if (left <= 0) timeUp();
    }, 100);
    draw(false);
  }

  function scoreGuess(q, guess) {
    let km;
    if (q.kind === "Country" && d3.geoContains(q.feature, guess)) km = 0;
    else km = d3.geoDistance(guess, q.coords) * 6371;
    const left = Math.max(0, QTIME - (Date.now() - game.qStart) / 1000);
    const proximity = km === 0 ? 1 : Math.exp(-km / 1500);
    const speedFactor = 0.55 + 0.45 * (left / QTIME);
    return { km: Math.round(km), pts: Math.round(MAX_PTS * proximity * speedFactor) };
  }

  function onGuess(guess) {
    game.awaiting = false;
    clearInterval(game.timer);
    const q = game.questions[game.index];
    const { km, pts } = scoreGuess(q, guess);
    game.score += pts;
    els.score.textContent = game.score.toLocaleString();
    marks = { guess, truth: q.coords, label: q.name };
    tone(km < 300 ? 740 : 330, 0, 0.25);
    if (km < 300) tone(988, 0.12, 0.3);
    showToast(km === 0
      ? `🎯 Bullseye — inside ${q.name}! <span class="pts">+${pts.toLocaleString()}</span>`
      : `📏 ${km.toLocaleString()} km away · <span class="pts">+${pts.toLocaleString()}</span>`);
    flyTo(q.coords, () => setTimeout(nextQuestion, 1900));
  }

  function timeUp() {
    game.awaiting = false;
    clearInterval(game.timer);
    const q = game.questions[game.index];
    marks = { guess: null, truth: q.coords, label: q.name };
    tone(196, 0, 0.4);
    showToast(`⏰ Time's up! ${q.name} is here. <span class="pts">+0</span>`);
    flyTo(q.coords, () => setTimeout(nextQuestion, 1900));
  }

  function flyTo(coords, cb) {
    const target = [-coords[0], -coords[1]];
    const ri = d3.interpolate(rotate.slice(), target);
    d3.transition().duration(900).ease(d3.easeCubicInOut)
      .tween("fly", () => t => { rotate = ri(t); draw(true); });
    setTimeout(cb, 950);
  }

  function nextQuestion() {
    if (!game) return;
    game.index++;
    if (game.index >= game.questions.length) endGame();
    else askQuestion();
  }

  function endGame() {
    clearInterval(game.timer);
    const s = game.score;
    lastScore = s;
    const maxTotal = ROUNDS * MAX_PTS;
    els.endScore.textContent = s.toLocaleString();
    els.endTitle.textContent = s > maxTotal * 0.75 ? "🌍 World Master!"
      : s > maxTotal * 0.5 ? "✈️ Seasoned Traveler!"
      : s > maxTotal * 0.25 ? "🧭 Getting There!" : "🗺️ Keep Exploring!";
    let msg = `out of ${maxTotal.toLocaleString()} possible`;
    if (challengeScore != null) {
      msg += s > challengeScore ? ` — 🏆 you BEAT the challenge of ${challengeScore.toLocaleString()}!`
        : s === challengeScore ? ` — 🤝 you TIED the challenge!`
        : ` — the challenge was ${challengeScore.toLocaleString()}. So close!`;
    }
    els.endMsg.textContent = msg;
    game = null;
    els.hud.classList.add("hidden");
    document.getElementById("pro-share").textContent = "📤 Share Score";
    els.end.classList.remove("hidden");
  }

  // ---------------------------------------------------------------
  // TOAST / SHARE
  // ---------------------------------------------------------------
  function showToast(html) { els.toast.innerHTML = html; els.toast.classList.remove("hidden"); }
  function hideToast() { els.toast.classList.add("hidden"); }

  let lastScore = null;
  document.getElementById("pro-share").addEventListener("click", async () => {
    if (lastScore == null) return;
    const url = `${location.origin}${location.pathname}?score=${lastScore}`;
    const text = `🌍 I scored ${lastScore.toLocaleString()} on MapTap Pro — tap-the-globe geography, satellite view. Can you beat me?`;
    const btn = document.getElementById("pro-share");
    if (navigator.share) {
      try { await navigator.share({ title: "MapTap Pro", text, url }); return; }
      catch (e) { if (e.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      btn.textContent = "✅ Copied!";
    } catch {
      window.prompt("Copy your score link:", `${text} ${url}`);
    }
    setTimeout(() => (btn.textContent = "📤 Share Score"), 2400);
  });

  (function readChallenge() {
    const p = new URLSearchParams(location.search);
    if (!p.has("score")) return;
    challengeScore = Math.max(0, Math.min(ROUNDS * MAX_PTS, parseInt(p.get("score"), 10) || 0));
    els.challenge.textContent = `🏆 A friend scored ${challengeScore.toLocaleString()} — beat them!`;
    els.challenge.classList.remove("hidden");
  })();

  document.getElementById("pro-play").addEventListener("click", startGame);
  document.getElementById("pro-again").addEventListener("click", startGame);

  // idle globe: slow spin until the first game starts
  resize();
  const idleSpin = d3.timer(() => {
    if (game) { idleSpin.stop(); return; }
    rotate[0] += 0.04;
    draw(true);
  });
})();
