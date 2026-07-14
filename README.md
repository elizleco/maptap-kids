# 🌎 MapTap Kids — USA Adventure! 🇺🇸

A tap-the-map geography game for children. Spin the globe, zoom into America, and learn the
United States by tapping **states, cities, landmarks, rivers, and mountains**.

## How to play

1. Pick a difficulty:
   - 🐣 **Little Explorer** — colorful bordered map with helper buttons to tap
   - 🦅 **Map Master** — for older kids: no borders, no buttons. Tap locations from memory on a
     blank silhouette of America, with compass hints (⬆️⬅️) when you miss
2. Pick an adventure: 🗺️ States, 🏙️ Cities, 🗽 Landmarks, 🏞️ Rivers, ⛰️ Mountains, 🌟 Mix It Up! —
   or dare the ⚡ **Lightning Round**: 60 seconds, one try per question, as many answers as you can!
3. The globe zooms into America and asks 8 questions like *"Can you find Texas?"* or
   *"Tap on the Mississippi River!"*
4. Tap the right spot on the map — first try earns ⭐⭐, second try earns ⭐, and every answer
   comes with a fun fact (state questions teach the state capital!).
5. Wrong taps get a friendly "try again" — after two misses the answer is revealed. No fail states,
   just exploring!
6. Need a closer look? Zoom with the ➕/➖ buttons, pinch, or scroll, and drag to pan — 🗺️ resets
   the view. The map shows topography (river lines and ⛰️ mountain ridges) as landmarks to steer
   by; they hide automatically when they'd give an answer away.
7. 📤 **Share your score!** The end screen's share button posts your score to socials (native share
   sheet on phones, copy-link elsewhere). Friends who open the link see a challenge banner —
   *"A friend earned 14/16 ⭐ — can you beat them?"* — with the same mode pre-selected. Links carry
   only score numbers: no names, no personal data.

## Running it

It's a fully static page — no build step, no network calls (map data and libraries are vendored).
Serve the folder with any static server:

```sh
python3 -m http.server 8743
# then open http://localhost:8743
```

## Tech

- Plain HTML/CSS/JS, no framework
- [D3](https://d3js.org) + TopoJSON for the spinning globe (orthographic) and US map (Albers USA,
  so Alaska and Hawaii are included)
- Map data: [world-atlas](https://github.com/topojson/world-atlas) and
  [us-atlas](https://github.com/topojson/us-atlas)
- Sounds generated with WebAudio — no audio files
