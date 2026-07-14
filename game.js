/* MapTap Kids — USA Adventure!
   A tap-the-map geography game for children.
   Flow: spinning globe -> zoom into America -> tap states, cities,
   landmarks, rivers and mountains. */

(async function () {
  // ---------------------------------------------------------------
  // DATA
  // ---------------------------------------------------------------
  const STATE_CAPITALS = {
    Alabama: "Montgomery", Alaska: "Juneau", Arizona: "Phoenix", Arkansas: "Little Rock",
    California: "Sacramento", Colorado: "Denver", Connecticut: "Hartford", Delaware: "Dover",
    Florida: "Tallahassee", Georgia: "Atlanta", Hawaii: "Honolulu", Idaho: "Boise",
    Illinois: "Springfield", Indiana: "Indianapolis", Iowa: "Des Moines", Kansas: "Topeka",
    Kentucky: "Frankfort", Louisiana: "Baton Rouge", Maine: "Augusta", Maryland: "Annapolis",
    Massachusetts: "Boston", Michigan: "Lansing", Minnesota: "St. Paul", Mississippi: "Jackson",
    Missouri: "Jefferson City", Montana: "Helena", Nebraska: "Lincoln", Nevada: "Carson City",
    "New Hampshire": "Concord", "New Jersey": "Trenton", "New Mexico": "Santa Fe",
    "New York": "Albany", "North Carolina": "Raleigh", "North Dakota": "Bismarck",
    Ohio: "Columbus", Oklahoma: "Oklahoma City", Oregon: "Salem", Pennsylvania: "Harrisburg",
    "Rhode Island": "Providence", "South Carolina": "Columbia", "South Dakota": "Pierre",
    Tennessee: "Nashville", Texas: "Austin", Utah: "Salt Lake City", Vermont: "Montpelier",
    Virginia: "Richmond", Washington: "Olympia", "West Virginia": "Charleston",
    Wisconsin: "Madison", Wyoming: "Cheyenne"
  };

  const CITIES = [
    { name: "New York City", coords: [-74.006, 40.713], fact: "It's the biggest city in America — over 8 million people!" },
    { name: "Los Angeles", coords: [-118.243, 34.052], fact: "Movie stars make films here in Hollywood!" },
    { name: "Chicago", coords: [-87.630, 41.878], fact: "It's nicknamed the Windy City!" },
    { name: "Houston", coords: [-95.369, 29.760], fact: "Astronauts talk to Houston from space!" },
    { name: "Miami", coords: [-80.192, 25.762], fact: "Sunny beaches and dolphins live nearby!" },
    { name: "Seattle", coords: [-122.332, 47.606], fact: "It rains a lot here — bring an umbrella!" },
    { name: "Denver", coords: [-104.991, 39.739], fact: "It's exactly one mile above the sea — the Mile High City!" },
    { name: "New Orleans", coords: [-90.071, 29.951], fact: "Famous for jazz music and yummy beignets!" },
    { name: "Las Vegas", coords: [-115.139, 36.170], fact: "Its lights are so bright you can see them from space!" },
    { name: "San Francisco", coords: [-122.419, 37.775], fact: "Cable cars climb its steep, hilly streets!" },
    { name: "Washington, D.C.", coords: [-77.037, 38.907], fact: "The President of the United States lives here!" },
    { name: "Boston", coords: [-71.059, 42.360], fact: "One of the oldest cities in America!" },
    { name: "Nashville", coords: [-86.781, 36.163], fact: "It's called Music City — home of country music!" },
    { name: "Orlando", coords: [-81.379, 28.538], fact: "Home to some of the world's biggest theme parks!" },
    { name: "Phoenix", coords: [-112.074, 33.448], fact: "One of the hottest and sunniest cities in the USA!" }
  ];

  const LANDMARKS = [
    { name: "Statue of Liberty", coords: [-74.045, 40.689], fact: "She was a gift from France and holds a torch!" },
    { name: "Grand Canyon", coords: [-112.113, 36.107], fact: "It's a mile deep — carved by the Colorado River!" },
    { name: "Golden Gate Bridge", coords: [-122.478, 37.819], fact: "This famous orange bridge is in San Francisco!" },
    { name: "Mount Rushmore", coords: [-103.459, 43.879], fact: "Four presidents' faces are carved into the mountain!" },
    { name: "Yellowstone", coords: [-110.588, 44.428], fact: "It has geysers that shoot hot water into the sky!" },
    { name: "Niagara Falls", coords: [-79.074, 43.081], fact: "A giant waterfall between the USA and Canada!" },
    { name: "Gateway Arch", coords: [-90.185, 38.624], fact: "This shiny arch in St. Louis is as tall as 63 elephants!" },
    { name: "Space Needle", coords: [-122.349, 47.620], fact: "A flying-saucer tower in Seattle!" },
    { name: "The White House", coords: [-77.037, 38.898], fact: "The President's home has 132 rooms!" },
    { name: "The Alamo", coords: [-98.486, 29.426], fact: "A famous old fort in San Antonio, Texas!" },
    { name: "Hollywood Sign", coords: [-118.322, 34.134], fact: "Giant white letters on a hill in Los Angeles!" },
    { name: "Kennedy Space Center", coords: [-80.651, 28.573], fact: "Rockets blast off to space from here!" }
  ];

  const RIVERS = [
    { name: "Mississippi River", fact: "One of the longest rivers in the world — steamboats sailed it!",
      points: [[-95.2, 47.2], [-93.27, 44.98], [-91.1, 43.8], [-90.2, 38.63], [-89.18, 37.0], [-90.07, 35.15], [-91.1, 32.3], [-91.19, 30.45], [-90.07, 29.95], [-89.4, 29.1]] },
    { name: "Missouri River", fact: "The longest river in the USA — explorers Lewis & Clark paddled it!",
      points: [[-111.5, 45.93], [-111.3, 47.5], [-108.5, 47.8], [-103.6, 48.1], [-100.78, 46.8], [-100.35, 44.37], [-96.4, 42.5], [-95.94, 41.26], [-94.58, 39.1], [-92.2, 38.8], [-90.2, 38.8]] },
    { name: "Colorado River", fact: "This mighty river carved the Grand Canyon!",
      points: [[-105.8, 40.3], [-108.55, 39.06], [-109.55, 38.57], [-111.49, 36.94], [-112.11, 36.1], [-113.9, 36.0], [-114.74, 36.02], [-114.34, 34.48], [-114.62, 32.72]] },
    { name: "Rio Grande", fact: "Its name means 'Big River' in Spanish!",
      points: [[-106.9, 37.8], [-106.65, 35.08], [-106.49, 31.76], [-104.9, 30.4], [-103.25, 29.2], [-101.5, 29.6], [-99.5, 27.5], [-97.5, 25.9]] },
    { name: "Ohio River", fact: "It flows past Pittsburgh, Cincinnati and Louisville!",
      points: [[-80.0, 40.44], [-82.6, 38.75], [-84.51, 39.1], [-85.76, 38.25], [-87.57, 37.97], [-88.6, 37.07], [-89.18, 37.0]] },
    { name: "Columbia River", fact: "Salmon leap up this river in the Pacific Northwest!",
      points: [[-117.7, 48.9], [-119.3, 47.9], [-119.9, 46.6], [-118.9, 45.9], [-121.2, 45.6], [-122.4, 45.6], [-123.9, 46.2]] }
  ];

  const RANGES = [
    { name: "Rocky Mountains", plural: true, fact: "They stretch over 3,000 miles — the backbone of America!",
      points: [[-114.5, 48.8], [-113.0, 47.0], [-110.8, 44.8], [-109.5, 43.0], [-106.8, 40.5], [-105.5, 39.0], [-105.9, 37.5], [-106.0, 35.8]] },
    { name: "Appalachian Mountains", plural: true, fact: "Some of the oldest mountains on Earth!",
      points: [[-72.8, 44.3], [-74.2, 42.3], [-77.8, 40.6], [-79.5, 38.5], [-81.5, 36.5], [-84.0, 34.7]] },
    { name: "Sierra Nevada", fact: "Home to giant sequoia trees — the biggest trees alive!",
      points: [[-120.6, 39.8], [-119.8, 38.6], [-119.0, 37.4], [-118.29, 36.58]] },
    { name: "Cascade Range", fact: "A chain of volcanoes including Mount Rainier!",
      points: [[-121.7, 48.8], [-121.76, 46.85], [-121.7, 45.37], [-122.1, 44.0], [-122.1, 42.9]] }
  ];

  const PEAKS = [
    { name: "Denali", coords: [-151.007, 63.069], fact: "The tallest mountain in North America — it's in Alaska!" },
    { name: "Mount Rainier", coords: [-121.760, 46.853], fact: "A giant snowy volcano near Seattle!" },
    { name: "Pikes Peak", coords: [-105.042, 38.841], fact: "The view from the top inspired the song 'America the Beautiful'!" },
    { name: "Mount Whitney", coords: [-118.292, 36.578], fact: "The tallest peak in the lower 48 states!" }
  ];

  const CHEERS = ["Awesome! 🎉", "You got it! ⭐", "Super job! 🥳", "Way to go! 🌟", "Fantastic! 🎊", "You're a map star! 🗺️"];
  const TRY_AGAIN = ["Almost! Try again! 💪", "Not quite — you can do it! 🔍", "Oops! Give it another tap! 😊"];

  const QUESTIONS_PER_GAME = 8;
  const PASTELS = ["#ffd6a5", "#caffbf", "#9bf6ff", "#ffc6ff", "#fdffb6", "#a0c4ff", "#ffadad", "#bdb2ff", "#b5ead7", "#ffdac1"];

  // ---------------------------------------------------------------
  // LOAD MAP DATA
  // ---------------------------------------------------------------
  const [world, us] = await Promise.all([
    d3.json("data/countries-110m.json"),
    d3.json("data/states-10m.json")
  ]);
  const countries = topojson.feature(world, world.objects.countries).features;
  const allStates = topojson.feature(us, us.objects.states).features;

  // ---------------------------------------------------------------
  // SOUNDS (WebAudio, no files needed)
  // ---------------------------------------------------------------
  let audioCtx = null;
  function tone(freq, start, dur, type = "sine", vol = 0.18) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(audioCtx.currentTime + start);
    o.stop(audioCtx.currentTime + start + dur + 0.05);
  }
  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }
  const sndCorrect = () => { ensureAudio(); tone(523, 0, 0.15); tone(659, 0.12, 0.15); tone(784, 0.24, 0.3); };
  const sndWrong = () => { ensureAudio(); tone(220, 0, 0.25, "triangle", 0.12); };
  const sndTap = () => { ensureAudio(); tone(440, 0, 0.08, "sine", 0.08); };
  const sndFanfare = () => { ensureAudio(); [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.15, 0.35)); };

  // ---------------------------------------------------------------
  // START SCREEN: SPINNING GLOBE
  // ---------------------------------------------------------------
  const GLOBE_SIZE = 480;
  const globeSvg = d3.select("#globe-holder").append("svg")
    .attr("viewBox", `0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`);

  const globeProj = d3.geoOrthographic()
    .scale(GLOBE_SIZE / 2 - 10)
    .translate([GLOBE_SIZE / 2, GLOBE_SIZE / 2])
    .rotate([40, -20]);
  const globePath = d3.geoPath(globeProj);

  globeSvg.append("circle")
    .attr("cx", GLOBE_SIZE / 2).attr("cy", GLOBE_SIZE / 2).attr("r", GLOBE_SIZE / 2 - 10)
    .attr("fill", "#4aa3df");
  const globeLand = globeSvg.append("g").selectAll("path")
    .data(countries).join("path")
    .attr("fill", d => d.properties.name === "United States of America" ? "#ff8a5c" : "#8fd67a")
    .attr("stroke", "#ffffff").attr("stroke-width", 0.6);
  const globeGrat = globeSvg.append("path")
    .datum(d3.geoGraticule10())
    .attr("fill", "none").attr("stroke", "#ffffff").attr("stroke-opacity", 0.25);

  function drawGlobe() {
    globeLand.attr("d", globePath);
    globeGrat.attr("d", globePath);
  }
  drawGlobe();

  let spinTimer = d3.timer(elapsed => {
    globeProj.rotate([40 + elapsed * 0.012, -20]);
    drawGlobe();
  });

  // Zoom-into-America animation, then start the game.
  // The game start is driven by a plain timeout, not the transition's "end"
  // event — an interrupted or throttled animation must never strand the player.
  let zoomCbTimer = null;
  function zoomToAmerica(cb) {
    if (spinTimer) { spinTimer.stop(); spinTimer = null; }
    const startRotate = globeProj.rotate();
    const endRotate = [98, -39, 0]; // centers the USA
    const startScale = globeProj.scale();
    const endScale = startScale * 5.2;
    const ri = d3.interpolate(startRotate, endRotate);
    const si = d3.interpolate(startScale, endScale);
    d3.transition().duration(2000).ease(d3.easeCubicInOut)
      .tween("zoom", () => t => {
        globeProj.rotate(ri(Math.min(t * 1.4, 1))).scale(si(t));
        drawGlobe();
      });
    clearTimeout(zoomCbTimer);
    zoomCbTimer = setTimeout(cb, 2050);
  }

  // ---------------------------------------------------------------
  // USA MAP
  // ---------------------------------------------------------------
  const MAP_W = 975, MAP_H = 610;
  const usProj = d3.geoAlbersUsa().scale(1300).translate([MAP_W / 2, MAP_H / 2]);
  const usPath = d3.geoPath(usProj);
  const lineGen = d3.line().curve(d3.curveBasis);

  // Only keep the 50 states (things geoAlbersUsa can draw), skip tiny D.C.
  const states = allStates.filter(f => usPath(f) && STATE_CAPITALS[f.properties.name]);

  const mapSvg = d3.select("#map-holder").append("svg")
    .attr("viewBox", `0 0 ${MAP_W} ${MAP_H}`);
  const zoomRoot = mapSvg.append("g");
  const statesLayer = zoomRoot.append("g");
  const terrainLayer = zoomRoot.append("g").style("pointer-events", "none");
  const featureLayer = zoomRoot.append("g"); // question rivers / ranges / markers
  const labelLayer = zoomRoot.append("g");

  statesLayer.selectAll("path")
    .data(states).join("path")
    .attr("class", "state")
    .attr("d", usPath)
    .attr("vector-effect", "non-scaling-stroke")
    .attr("fill", (d, i) => PASTELS[i % PASTELS.length])
    .attr("data-name", d => d.properties.name);

  // Always-on topography: mountain ridges and rivers as landmarks to steer by
  const terrainRanges = terrainLayer.append("g");
  const terrainRivers = terrainLayer.append("g");
  RANGES.forEach(m => {
    const projected = m.points.map(p => usProj(p)).filter(Boolean);
    terrainRanges.append("path")
      .attr("d", lineGen(projected))
      .attr("fill", "none")
      .attr("stroke", "#b98a63")
      .attr("stroke-width", 14)
      .attr("stroke-opacity", 0.3)
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");
    projected.forEach(p => {
      terrainRanges.append("text").attr("x", p[0]).attr("y", p[1] + 4)
        .attr("text-anchor", "middle").attr("font-size", 12)
        .attr("opacity", 0.8).text("⛰️");
    });
  });
  PEAKS.filter(p => !["Mount Rainier", "Mount Whitney"].includes(p.name)).forEach(p => {
    const xy = usProj(p.coords);
    if (!xy) return;
    terrainRanges.append("text").attr("x", xy[0]).attr("y", xy[1] + 4)
      .attr("text-anchor", "middle").attr("font-size", 12)
      .attr("opacity", 0.8).text("⛰️");
  });
  RIVERS.forEach(r => {
    terrainRivers.append("path")
      .attr("d", lineGen(r.points.map(p => usProj(p)).filter(Boolean)))
      .attr("fill", "none")
      .attr("stroke", "#3f97d8")
      .attr("stroke-width", 2.5)
      .attr("stroke-opacity", 0.85)
      .attr("vector-effect", "non-scaling-stroke")
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");
  });

  // Zoom & pan (wheel, pinch, drag) plus the ➕ ➖ 🗺️ buttons
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [MAP_W, MAP_H]])
    .on("zoom", e => zoomRoot.attr("transform", e.transform));
  mapSvg.call(zoom).on("dblclick.zoom", null);
  document.getElementById("zoom-in").addEventListener("click", () =>
    mapSvg.transition().duration(300).call(zoom.scaleBy, 1.6));
  document.getElementById("zoom-out").addEventListener("click", () =>
    mapSvg.transition().duration(300).call(zoom.scaleBy, 1 / 1.6));
  document.getElementById("zoom-reset").addEventListener("click", () =>
    mapSvg.transition().duration(400).call(zoom.transform, d3.zoomIdentity));

  // ---------------------------------------------------------------
  // GAME STATE
  // ---------------------------------------------------------------
  const els = {
    start: document.getElementById("start-screen"),
    game: document.getElementById("game-screen"),
    end: document.getElementById("end-screen"),
    question: document.getElementById("question-text"),
    banner: document.getElementById("question-banner"),
    stars: document.getElementById("star-count"),
    progress: document.getElementById("progress"),
    toast: document.getElementById("feedback-toast"),
    endTitle: document.getElementById("end-title"),
    endStars: document.getElementById("end-stars"),
    endMessage: document.getElementById("end-message")
  };

  const CAT_LABELS = {
    states: "States", cities: "Cities", landmarks: "Landmarks", rivers: "Rivers",
    mountains: "Mountains", mix: "Mix It Up", lightning: "Lightning Round"
  };
  const DIFF_LABELS = { easy: "Little Explorer", hard: "Map Master" };

  let game = null; // { questions, index, stars, misses, locked, lightning, deadline, category }
  let lastResult = null; // last finished game, for sharing
  let challenge = null; // score parsed from a shared link
  let advanceTimer = null; // pending "next question" timeout
  let lightningTick = null; // countdown interval for lightning mode
  let difficulty = "easy"; // "easy" = borders + helper buttons, "hard" = blank map, tap from memory
  const LIGHTNING_SECONDS = 60;
  const TOL = { point: 55, river: 38, range: 60 }; // hard-mode tap tolerance (viewBox px)

  const shuffle = arr => d3.shuffle(arr.slice());
  const pick = (arr, n) => shuffle(arr).slice(0, n);
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];

  function buildQuestions(category) {
    const makers = {
      states: () => pick(states, QUESTIONS_PER_GAME).map(f => ({ type: "state", target: f })),
      cities: () => pick(CITIES, QUESTIONS_PER_GAME).map(c => ({ type: "point", kind: "city", target: c, pool: CITIES, emoji: "🏙️" })),
      landmarks: () => pick(LANDMARKS, QUESTIONS_PER_GAME).map(l => ({ type: "point", kind: "landmark", target: l, pool: LANDMARKS, emoji: "📍" })),
      rivers: () => pick(RIVERS.concat(RIVERS), QUESTIONS_PER_GAME).map(r => ({ type: "river", target: r })),
      mountains: () => {
        const qs = pick(RANGES, 4).map(r => ({ type: "range", target: r }))
          .concat(pick(PEAKS, 4).map(p => ({ type: "point", kind: "peak", target: p, pool: PEAKS, emoji: "⛰️" })));
        return shuffle(qs).slice(0, QUESTIONS_PER_GAME);
      },
      mix: () => {
        const qs = [
          ...pick(states, 2).map(f => ({ type: "state", target: f })),
          ...pick(CITIES, 2).map(c => ({ type: "point", kind: "city", target: c, pool: CITIES, emoji: "🏙️" })),
          ...pick(LANDMARKS, 2).map(l => ({ type: "point", kind: "landmark", target: l, pool: LANDMARKS, emoji: "📍" })),
          ...pick(RIVERS, 1).map(r => ({ type: "river", target: r })),
          ...pick(RANGES, 1).map(r => ({ type: "range", target: r }))
        ];
        return shuffle(qs);
      },
      lightning: () => shuffle([
        ...states.map(f => ({ type: "state", target: f })),
        ...CITIES.map(c => ({ type: "point", kind: "city", target: c, pool: CITIES, emoji: "🏙️" })),
        ...LANDMARKS.map(l => ({ type: "point", kind: "landmark", target: l, pool: LANDMARKS, emoji: "📍" })),
        ...PEAKS.map(p => ({ type: "point", kind: "peak", target: p, pool: PEAKS, emoji: "⛰️" })),
        ...RIVERS.map(r => ({ type: "river", target: r })),
        ...RANGES.map(r => ({ type: "range", target: r }))
      ])
    };
    return makers[category]();
  }

  function startGame(category) {
    clearTimeout(advanceTimer);
    clearInterval(lightningTick);
    const lightning = category === "lightning";
    game = { questions: buildQuestions(category), index: 0, stars: 0, misses: 0, locked: false, lightning, category };
    els.stars.textContent = "⭐ 0";
    if (lightning) {
      game.deadline = Date.now() + LIGHTNING_SECONDS * 1000;
      els.progress.textContent = `⏱️ ${LIGHTNING_SECONDS}s`;
      lightningTick = setInterval(() => {
        if (!game || !game.lightning) { clearInterval(lightningTick); return; }
        const left = Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000));
        els.progress.textContent = `⏱️ ${left}s`;
        if (left <= 0) endLightning();
      }, 200);
    }
    showQuestion();
  }

  function questionPrompt(q) {
    let name = q.type === "state" ? q.target.properties.name : q.target.name;
    if (q.type === "river" || q.type === "range") name = "the " + name;
    const isAre = q.target.plural ? "are" : "is";
    const forms = [`Can you find ${name}? 🔍`, `Tap on ${name}!`, `Where ${isAre} ${name}? 🤔`];
    return rand(forms);
  }

  // ---------------------------------------------------------------
  // QUESTION RENDERING
  // ---------------------------------------------------------------
  function clearFeatures() {
    featureLayer.selectAll("*").remove();
    labelLayer.selectAll("*").remove();
    const hard = difficulty === "hard";
    mapSvg.classed("hard-map", hard);
    statesLayer.selectAll(".state")
      .interrupt()
      .attr("fill", hard ? "#9fdc8b" : (d, i) => PASTELS[i % PASTELS.length])
      .style("stroke", hard ? "#9fdc8b" : null)
      .style("pointer-events", null)
      .on("click", null);
  }

  function showQuestion() {
    clearTimeout(advanceTimer);
    const q = game.questions[game.index];
    game.misses = 0;
    game.locked = false;
    hideToast();
    clearFeatures();
    if (!game.lightning) els.progress.textContent = `${game.index + 1} / ${game.questions.length}`;
    els.question.textContent = questionPrompt(q);

    const hard = difficulty === "hard";
    mapSvg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    // terrain is a searching aid — hide it only when it would give away an easy question
    terrainRivers.style("display", !hard && q.type === "river" ? "none" : null);
    terrainRanges.style("display", !hard && q.type === "range" ? "none" : null);
    if (q.type === "state") setupStateQuestion(q);
    else if (q.type === "point") (hard ? setupPointQuestionHard : setupPointQuestion)(q);
    else if (q.type === "river") hard ? setupLineQuestionHard(q, TOL.river, RIVER_STYLE) : setupRiverQuestion(q);
    else if (q.type === "range") hard ? setupLineQuestionHard(q, TOL.range, RANGE_STYLE) : setupRangeQuestion(q);
  }

  // --- states: tap directly on the colored map ---
  function setupStateQuestion(q) {
    statesLayer.selectAll(".state").on("click", function (event, d) {
      if (game.locked) return;
      if (d.properties.name === q.target.properties.name) {
        d3.select(this).attr("fill", "#7ed957").style("stroke", "#ffffff").classed("correct-flash", true);
        handleCorrect(q);
      } else {
        d3.select(this).transition().duration(180).attr("fill", "#c9c9c9")
          .transition().duration(600).attr("fill", d3.select(this).attr("fill"));
        const hint = difficulty === "hard"
          ? directionHint(...usPath.centroid(d), ...usPath.centroid(q.target)) : null;
        handleMiss(q, () => revealState(q), hint);
      }
    });
  }
  function revealState(q) {
    const sel = statesLayer.selectAll(".state").filter(d => d.properties.name === q.target.properties.name);
    sel.attr("fill", "#7ed957").style("stroke", "#ffffff").classed("correct-flash", true);
    revealDone(q);
  }

  // --- points (cities / landmarks / peaks): tap the right marker ---
  function setupPointQuestion(q) {
    const decoys = pick(q.pool.filter(p => p.name !== q.target.name), 4);
    const options = shuffle([q.target, ...decoys]);
    statesLayer.selectAll(".state").style("pointer-events", "none");

    const groups = featureLayer.selectAll("g.marker")
      .data(options).join("g")
      .attr("class", "marker")
      .attr("transform", d => `translate(${usProj(d.coords)})`);

    groups.append("circle").attr("class", "pulse").attr("r", 16).attr("fill", "#ff6b6b");
    groups.append("circle").attr("r", 15).attr("fill", "#ffffff").attr("stroke", "#1e3a5f").attr("stroke-width", 3);
    groups.append("text").attr("text-anchor", "middle").attr("dy", "0.35em").attr("font-size", 16).text(q.emoji);

    groups.on("click", function (event, d) {
      if (game.locked) return;
      if (d.name === q.target.name) {
        markerToStar(d3.select(this));
        labelPoint(q.target);
        handleCorrect(q);
      } else {
        d3.select(this).select("circle:nth-child(2)").attr("fill", "#c9c9c9");
        d3.select(this).style("opacity", 0.45).style("pointer-events", "none");
        handleMiss(q, () => revealPoint(q));
      }
    });
  }
  function markerToStar(g) {
    g.select("text").text("⭐").attr("font-size", 20);
    g.select("circle:nth-child(2)").attr("fill", "#ffd93d");
  }
  function revealPoint(q) {
    const g = featureLayer.selectAll("g.marker").filter(d => d.name === q.target.name);
    markerToStar(g);
    labelPoint(q.target);
    revealDone(q);
  }

  // --- HARD MODE: no helpers, tap the blank map from memory ---
  function addTapOverlay(onTap) {
    featureLayer.append("rect")
      .attr("x", 0).attr("y", 0).attr("width", MAP_W).attr("height", MAP_H)
      .attr("fill", "transparent")
      .on("click", function (event) {
        if (game.locked) return;
        const [x, y] = d3.pointer(event);
        onTap(x, y);
      });
  }

  function tapRipple(x, y) {
    featureLayer.append("circle")
      .attr("cx", x).attr("cy", y).attr("r", 5)
      .attr("fill", "none").attr("stroke", "#ff6b6b").attr("stroke-width", 4)
      .style("pointer-events", "none")
      .transition().duration(500).attr("r", 28).style("opacity", 0).remove();
  }

  function directionHint(x, y, tx, ty) {
    const dx = tx - x, dy = ty - y;
    const dirs = [];
    if (Math.abs(dy) > 30) dirs.push(dy < 0 ? "⬆️ north" : "⬇️ south");
    if (Math.abs(dx) > 30) dirs.push(dx < 0 ? "⬅️ west" : "➡️ east");
    return dirs.length ? `Try again — head ${dirs.join(" and ")}! 🧭` : "SO close! Tap right there! 🎯";
  }

  function dropStar(item) {
    const [x, y] = usProj(item.coords);
    const g = featureLayer.append("g").attr("class", "marker")
      .attr("transform", `translate(${x},${y})`)
      .style("pointer-events", "none");
    g.append("circle").attr("r", 15).attr("fill", "#ffd93d").attr("stroke", "#1e3a5f").attr("stroke-width", 3);
    g.append("text").attr("text-anchor", "middle").attr("dy", "0.35em").attr("font-size", 20).text("⭐");
    labelPoint(item);
  }

  function setupPointQuestionHard(q) {
    statesLayer.selectAll(".state").style("pointer-events", "none");
    const [tx, ty] = usProj(q.target.coords);
    addTapOverlay((x, y) => {
      if (Math.hypot(x - tx, y - ty) <= TOL.point) {
        dropStar(q.target);
        handleCorrect(q);
      } else {
        tapRipple(x, y);
        handleMiss(q, () => { dropStar(q.target); revealDone(q); }, directionHint(x, y, tx, ty));
      }
    });
  }

  const RIVER_STYLE = { stroke: "#1cb0f6", width: 6, decorate: false };
  const RANGE_STYLE = { stroke: "#7ed957", width: 18, decorate: true };

  function distToPolyline(x, y, pts) {
    let best = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const dx = x2 - x1, dy = y2 - y1;
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
      best = Math.min(best, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
    }
    return best;
  }

  function drawAnswerLine(item, style) {
    const projected = item.points.map(p => usProj(p)).filter(Boolean);
    featureLayer.append("path")
      .attr("d", lineGen(projected))
      .attr("fill", "none")
      .attr("vector-effect", "non-scaling-stroke")
      .attr("stroke", style.stroke)
      .attr("stroke-width", style.width)
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round")
      .style("pointer-events", "none");
    if (style.decorate) {
      projected.filter((p, i) => i % 2 === 0).forEach(p => {
        featureLayer.append("text").attr("x", p[0]).attr("y", p[1] + 5)
          .attr("text-anchor", "middle").attr("font-size", 15)
          .style("pointer-events", "none").text("⛰️");
      });
    }
    const [x, y] = projected[Math.floor(projected.length / 2)];
    labelLayer.append("text")
      .attr("class", "answer-label")
      .attr("x", x).attr("y", y - 18)
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .text(item.name);
  }

  function setupLineQuestionHard(q, tol, style) {
    statesLayer.selectAll(".state").style("pointer-events", "none");
    const pts = q.target.points.map(p => usProj(p)).filter(Boolean);
    addTapOverlay((x, y) => {
      if (distToPolyline(x, y, pts) <= tol) {
        drawAnswerLine(q.target, style);
        handleCorrect(q);
      } else {
        tapRipple(x, y);
        const [mx, my] = pts[Math.floor(pts.length / 2)];
        handleMiss(q, () => { drawAnswerLine(q.target, style); revealDone(q); }, directionHint(x, y, mx, my));
      }
    });
  }
  function labelPoint(item) {
    const [x, y] = usProj(item.coords);
    labelLayer.append("text")
      .attr("class", "answer-label")
      .attr("x", x).attr("y", y - 24)
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .text(item.name);
  }

  // --- rivers: several blue squiggles, tap the right one ---
  function setupRiverQuestion(q) {
    const decoys = pick(RIVERS.filter(r => r.name !== q.target.name), 3);
    const options = shuffle([q.target, ...decoys]);
    statesLayer.selectAll(".state").style("pointer-events", "none");
    drawLineOptions(q, options, {
      stroke: "#2f7fd1", width: 6, hitWidth: 26,
      correctStroke: "#1cb0f6", label: r => midpointOf(r)
    });
  }

  // --- mountain ranges: thick brown ridges, tap the right one ---
  function setupRangeQuestion(q) {
    const decoys = pick(RANGES.filter(r => r.name !== q.target.name), 3);
    const options = shuffle([q.target, ...decoys]);
    statesLayer.selectAll(".state").style("pointer-events", "none");
    drawLineOptions(q, options, {
      stroke: "#9c6b4f", width: 18, hitWidth: 34, opacity: 0.75, cap: "round",
      correctStroke: "#7ed957", label: r => midpointOf(r), decorate: true
    });
  }

  function midpointOf(item) {
    const pts = item.points.map(p => usProj(p)).filter(Boolean);
    return pts[Math.floor(pts.length / 2)];
  }

  function drawLineOptions(q, options, cfg) {
    const groups = featureLayer.selectAll("g.lineopt")
      .data(options).join("g").attr("class", "lineopt");

    groups.each(function (d) {
      const g = d3.select(this);
      const projected = d.points.map(p => usProj(p)).filter(Boolean);
      const dAttr = lineGen(projected);
      g.append("path")
        .attr("class", "visible-line")
        .attr("d", dAttr)
        .attr("fill", "none")
        .attr("vector-effect", "non-scaling-stroke")
        .attr("stroke", cfg.stroke)
        .attr("stroke-width", cfg.width)
        .attr("stroke-linecap", cfg.cap || "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", cfg.opacity ?? 0.9);
      if (cfg.decorate) {
        // little mountain peaks along the ridge
        projected.filter((p, i) => i % 2 === 0).forEach(p => {
          g.append("text").attr("x", p[0]).attr("y", p[1] + 5)
            .attr("text-anchor", "middle").attr("font-size", 15)
            .style("pointer-events", "none").text("⛰️");
        });
      }
      g.append("path")
        .attr("class", cfg.decorate ? "range-hit" : "river-hit")
        .attr("d", dAttr)
        .attr("fill", "none")
        .attr("stroke", "transparent")
        .attr("vector-effect", "non-scaling-stroke")
        .attr("stroke-width", cfg.hitWidth)
        .attr("stroke-linecap", "round");
    });

    groups.on("click", function (event, d) {
      if (game.locked) return;
      if (d.name === q.target.name) {
        d3.select(this).select(".visible-line").attr("stroke", cfg.correctStroke).attr("stroke-opacity", 1);
        labelLine(q.target, cfg);
        handleCorrect(q);
      } else {
        d3.select(this).style("opacity", 0.3).style("pointer-events", "none");
        handleMiss(q, () => {
          const g = featureLayer.selectAll("g.lineopt").filter(x => x.name === q.target.name);
          g.select(".visible-line").attr("stroke", cfg.correctStroke).attr("stroke-opacity", 1);
          labelLine(q.target, cfg);
          revealDone(q);
        });
      }
    });
  }
  function labelLine(item, cfg) {
    const [x, y] = cfg.label(item);
    labelLayer.append("text")
      .attr("class", "answer-label")
      .attr("x", x).attr("y", y - 18)
      .attr("text-anchor", "middle")
      .attr("font-size", 20)
      .text(item.name);
  }

  // ---------------------------------------------------------------
  // ANSWER HANDLING
  // ---------------------------------------------------------------
  function factFor(q) {
    if (q.type === "state") {
      const n = q.target.properties.name;
      return `The capital of ${n} is ${STATE_CAPITALS[n]}!`;
    }
    return q.target.fact;
  }
  function nameFor(q) {
    return q.type === "state" ? q.target.properties.name : q.target.name;
  }

  function handleCorrect(q) {
    game.locked = true;
    sndCorrect();
    const earned = game.lightning ? 1 : (game.misses === 0 ? 2 : 1);
    game.stars += earned;
    els.stars.textContent = `⭐ ${game.stars}`;
    clearTimeout(advanceTimer);
    if (game.lightning) {
      showToast(rand(CHEERS));
      advanceTimer = setTimeout(nextQuestion, 700);
    } else {
      confettiBurst();
      showToast(`${rand(CHEERS)} ${"⭐".repeat(earned)}`, factFor(q));
      advanceTimer = setTimeout(nextQuestion, 2600);
    }
  }

  function handleMiss(q, revealFn, hint) {
    sndWrong();
    game.misses++;
    els.banner.classList.remove("wiggle");
    void els.banner.offsetWidth; // restart animation
    els.banner.classList.add("wiggle");
    if (game.lightning || game.misses >= 2) {
      game.locked = true;
      revealFn();
    } else {
      showToast(hint || rand(TRY_AGAIN), null, 1600);
    }
  }

  function revealDone(q) {
    sndTap();
    clearTimeout(advanceTimer);
    if (game.lightning) {
      showToast(`${nameFor(q)} is here! 👀`);
      advanceTimer = setTimeout(nextQuestion, 1100);
    } else {
      showToast(`${nameFor(q)} is right here! 👀`, factFor(q));
      advanceTimer = setTimeout(nextQuestion, 2800);
    }
  }

  function nextQuestion() {
    if (!game) return; // went home mid-round
    game.index++;
    if (game.lightning) {
      if (Date.now() >= game.deadline) return endLightning();
      if (game.index >= game.questions.length) game.index = 0; // speedy kid — recycle the deck
      showQuestion();
    } else if (game.index >= game.questions.length) {
      endGame();
    } else {
      showQuestion();
    }
  }

  function endLightning() {
    if (!game || !game.lightning) return;
    clearInterval(lightningTick);
    clearTimeout(advanceTimer);
    sndFanfare();
    const n = game.stars;
    lastResult = { stars: n, max: null, category: "lightning", difficulty, lightning: true };
    els.endStars.textContent = "⭐".repeat(Math.max(1, Math.min(5, Math.ceil(n / 2))));
    els.endTitle.textContent = "⚡ Lightning Round Over!";
    els.endMessage.textContent = `You got ${n} answer${n === 1 ? "" : "s"} right in ${LIGHTNING_SECONDS} seconds! ` +
      (n >= 10 ? "Super speedy! 🚀" : "Can you beat that next time?") +
      challengeVerdict(n, "lightning");
    game = null;
    resetShareButton();
    hideToast();
    swapScreen(els.game, els.end);
    confettiBurst(60);
  }

  function endGame() {
    const max = game.questions.length * 2;
    const ratio = game.stars / max;
    sndFanfare();
    lastResult = { stars: game.stars, max, category: game.category, difficulty, lightning: false };
    els.endStars.textContent = "⭐".repeat(Math.max(1, Math.round(ratio * 5)));
    els.endTitle.textContent = ratio >= 0.9 ? "WOW! Map Champion! 🏆"
      : ratio >= 0.6 ? "Amazing job, explorer! 🎉"
      : "Great exploring! 🧭";
    els.endMessage.textContent = `You earned ${game.stars} out of ${max} stars. ` +
      (ratio >= 0.9 ? "You know America like the back of your hand!" : "Play again to earn even more stars!") +
      challengeVerdict(game.stars, game.category);
    game = null;
    resetShareButton();
    swapScreen(els.game, els.end);
    confettiBurst(60);
  }

  function challengeVerdict(stars, category) {
    if (!challenge || challenge.cat !== category) return "";
    if (stars > challenge.stars) return ` 🏆 You BEAT the challenge of ${challenge.stars} ⭐!`;
    if (stars === challenge.stars) return ` 🤝 You TIED the challenge of ${challenge.stars} ⭐!`;
    return ` The challenge was ${challenge.stars} ⭐ — so close, try again!`;
  }

  // ---------------------------------------------------------------
  // UI HELPERS
  // ---------------------------------------------------------------
  let toastTimer = null;
  function showToast(text, fact, autoHide) {
    clearTimeout(toastTimer);
    els.toast.innerHTML = "";
    els.toast.append(text);
    if (fact) {
      const f = document.createElement("span");
      f.className = "fact";
      f.textContent = "💡 " + fact;
      els.toast.appendChild(f);
    }
    els.toast.classList.remove("hidden");
    if (autoHide) toastTimer = setTimeout(hideToast, autoHide);
  }
  function hideToast() {
    clearTimeout(toastTimer);
    els.toast.classList.add("hidden");
  }

  function swapScreen(from, to) {
    from.classList.add("hidden");
    to.classList.remove("hidden");
  }

  function confettiBurst(n = 28) {
    const colors = ["#ff6b6b", "#ffd93d", "#7ed957", "#4aa3df", "#a78bfa", "#ff8ad1"];
    for (let i = 0; i < n; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 1.4 + Math.random() * 1.4 + "s";
      c.style.animationDelay = Math.random() * 0.3 + "s";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3200);
    }
  }

  // ---------------------------------------------------------------
  // WIRING
  // ---------------------------------------------------------------
  const DIFF_HINTS = {
    easy: "Colorful map with helper buttons!",
    hard: "No borders, no buttons — tap from memory! Compass hints if you miss."
  };
  document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      ensureAudio();
      sndTap();
      difficulty = btn.dataset.diff;
      document.querySelectorAll(".diff-btn").forEach(b => b.classList.toggle("selected", b === btn));
      document.getElementById("diff-hint").textContent = DIFF_HINTS[difficulty];
    });
  });

  document.querySelectorAll(".cat-btn[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      ensureAudio();
      sndTap();
      const cat = btn.dataset.cat;
      zoomToAmerica(() => {
        swapScreen(els.start, els.game);
        startGame(cat);
      });
    });
  });

  document.getElementById("home-btn").addEventListener("click", () => {
    game = null;
    clearTimeout(advanceTimer);
    clearInterval(lightningTick);
    hideToast();
    clearFeatures();
    swapScreen(els.game, els.start);
    resetGlobe();
  });

  document.getElementById("play-again-btn").addEventListener("click", () => {
    swapScreen(els.end, els.start);
    resetGlobe();
  });

  // ---------------------------------------------------------------
  // SHARE SCORE (link carries only score numbers — no names, no personal data)
  // ---------------------------------------------------------------
  const shareBtn = document.getElementById("share-btn");
  function resetShareButton() { shareBtn.textContent = "📤 Share My Score!"; }

  function shareUrl() {
    const p = new URLSearchParams();
    p.set("stars", lastResult.stars);
    if (lastResult.max) p.set("max", lastResult.max);
    p.set("cat", lastResult.category);
    p.set("diff", lastResult.difficulty);
    return `${location.origin}${location.pathname}?${p}`;
  }

  function shareText() {
    const diff = DIFF_LABELS[lastResult.difficulty];
    return lastResult.lightning
      ? `⚡ I got ${lastResult.stars} answers right in ${LIGHTNING_SECONDS} seconds on the MapTap Kids Lightning Round (${diff})! Think you're faster? 🌎🇺🇸`
      : `🌎 I earned ${lastResult.stars} out of ${lastResult.max} stars playing ${CAT_LABELS[lastResult.category]} on MapTap Kids (${diff})! Can you beat me? 🇺🇸`;
  }

  shareBtn.addEventListener("click", async () => {
    if (!lastResult) return;
    const text = shareText(), url = shareUrl();
    if (navigator.share) {
      try { await navigator.share({ title: "MapTap Kids", text, url }); return; }
      catch (e) { if (e.name === "AbortError") return; /* else fall through to copy */ }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      shareBtn.textContent = "✅ Copied! Paste it anywhere!";
    } catch {
      window.prompt("Copy your score link:", `${text} ${url}`);
    }
    setTimeout(resetShareButton, 2400);
  });

  // If this page was opened from a shared link, turn it into a challenge!
  (function readChallenge() {
    const p = new URLSearchParams(location.search);
    if (!p.has("stars") || !p.has("cat")) return;
    const cat = p.get("cat");
    if (!(cat in CAT_LABELS)) return;
    const stars = Math.max(0, Math.min(999, parseInt(p.get("stars"), 10) || 0));
    const max = Math.max(0, Math.min(999, parseInt(p.get("max"), 10) || 0)) || null;
    const diff = p.get("diff") === "hard" ? "hard" : "easy";
    challenge = { stars, max, cat, diff, lightning: cat === "lightning" };

    difficulty = diff;
    document.querySelectorAll(".diff-btn").forEach(b => b.classList.toggle("selected", b.dataset.diff === diff));
    document.getElementById("diff-hint").textContent = DIFF_HINTS[diff];

    const banner = document.getElementById("challenge-banner");
    banner.textContent = challenge.lightning
      ? `🏆 A friend got ${stars} right in the ⚡ Lightning Round (${DIFF_LABELS[diff]}) — can you beat them?`
      : `🏆 A friend earned ${stars}${max ? "/" + max : ""} ⭐ in ${CAT_LABELS[cat]} (${DIFF_LABELS[diff]}) — can you beat them?`;
    banner.classList.remove("hidden");

    const target = document.querySelector(`.cat-btn[data-cat="${cat}"]`);
    if (target) target.classList.add("pulse-btn");
  })();

  function resetGlobe() {
    globeProj.scale(GLOBE_SIZE / 2 - 10);
    if (!spinTimer) {
      spinTimer = d3.timer(elapsed => {
        globeProj.rotate([40 + elapsed * 0.012, -20]);
        drawGlobe();
      });
    }
  }
})();
