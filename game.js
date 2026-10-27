/**
 * Speed Typist Racer - Arcade WPM Grand Prix Engine
 * Pure Vanilla JavaScript & Synthesized Web Audio API
 */

(function () {
  'use strict';

  // --- Curated Sentence Prompt Libraries ---
  const PROMPT_LIBRARIES = {
    cyberpunk: [
      "In the sprawling neon canyons of Neo-Veridia, autonomous hovercraft drift across magnetic highways while cybernetic couriers race through the digital rain.",
      "The neural network pulsed with brilliant ultraviolet light as quantum processors synthesized millions of encrypted data streams in the dead of night.",
      "High above the smog layer, megacity spires pierced the stratosphere where orbital shuttles docked beneath corporate synthetic stars.",
      "She adjusted her titanium optical lenses and jacked directly into the mainframe, feeling the electric rush of unfiltered cyberspace.",
      "Reflections of glowing holographic advertisements cascaded down wet asphalt as the silent electric engine roared toward the outer sector."
    ],
    tech: [
      "Artificial intelligence models learn complex patterns across billions of parameters, revolutionizing modern engineering, science, and creativity.",
      "Distributed consensus algorithms ensure that decentralized networks maintain immutable integrity without relying on a central authority.",
      "Modern web browsers execute just-in-time compiled JavaScript at lightning speeds to deliver rich interactive experiences directly to users.",
      "Quantum superposition allows particles to exist across multiple computational states simultaneously, unlocking exponential computing power.",
      "Clean architecture principles decouple business logic from framework details, creating robust codebases that stand the test of time."
    ],
    quotes: [
      "The only way to do great work is to love what you do. If you haven't found it yet, keep looking and do not settle.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts in the face of all adversity.",
      "Do not go where the path may lead, go instead where there is no path and leave a trail for others to follow.",
      "It does not matter how slowly you go as long as you do not stop pursuing your ultimate vision with focused discipline.",
      "The future belongs to those who believe in the beauty of their dreams and have the tenacity to turn them into reality."
    ],
    short: [
      "Speed is an illusion created by focused mind and rapid keystrokes.",
      "The swift red sports car accelerated across the rain-slicked highway.",
      "Type with fluid rhythm and let your fingers dance across the keys.",
      "Precision and velocity combine to unlock championship racing glory.",
      "Never brake into the turn when maximum torque will pull you through."
    ]
  };

  // --- AI Rival Difficulty Settings (Target WPM) ---
  const DIFFICULTY_PROFILES = {
    rookie: [
      { name: 'Scout Bot', baseWpm: 36, color: '#f59e0b', lane: 1 },
      { name: 'Drift Bot', baseWpm: 42, color: '#a855f7', lane: 2 },
      { name: 'Viper Bot', baseWpm: 48, color: '#ef4444', lane: 3 }
    ],
    pro: [
      { name: 'Phantom Bot', baseWpm: 55, color: '#f59e0b', lane: 1 },
      { name: 'Apex Bot', baseWpm: 65, color: '#a855f7', lane: 2 },
      { name: 'Cyclone Bot', baseWpm: 72, color: '#ef4444', lane: 3 }
    ],
    veteran: [
      { name: 'Titan Bot', baseWpm: 75, color: '#f59e0b', lane: 1 },
      { name: 'Overdrive Bot', baseWpm: 84, color: '#a855f7', lane: 2 },
      { name: 'Velocity Bot', baseWpm: 92, color: '#ef4444', lane: 3 }
    ],
    champion: [
      { name: 'Nitro God', baseWpm: 95, color: '#f59e0b', lane: 1 },
      { name: 'Quantum Bot', baseWpm: 104, color: '#a855f7', lane: 2 },
      { name: 'Omega Champ', baseWpm: 114, color: '#ef4444', lane: 3 }
    ]
  };

  // --- Web Audio Synthesizer ---
  let audioCtx = null;
  let isMuted = false;
  let engineOsc = null;
  let engineGain = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function startEngineSound() {
    if (isMuted || !audioCtx || engineOsc) return;
    try {
      engineOsc = audioCtx.createOscillator();
      engineGain = audioCtx.createGain();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.setValueAtTime(65, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, audioCtx.currentTime);

      engineGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

      engineOsc.connect(filter);
      filter.connect(engineGain);
      engineGain.connect(audioCtx.destination);
      engineOsc.start();
    } catch (e) {
      console.warn('Engine audio error', e);
    }
  }

  function stopEngineSound() {
    if (engineOsc) {
      try {
        engineOsc.stop();
        engineOsc.disconnect();
      } catch (e) {}
      engineOsc = null;
      engineGain = null;
    }
  }

  function setEngineRPM(wpm) {
    if (!engineOsc || isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const targetFreq = 65 + Math.min(wpm * 2.2, 220);
      engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);
    } catch (e) {}
  }

  function playSound(type) {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      if (type === 'key') {
        // Mechanical crisp keyboard click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 150, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.035);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'error') {
        // Dissonant error buzz
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(120, now + 0.05);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'finish') {
        // Checkered flag fanfare
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.3);
        });
      }
    } catch (e) {
      console.warn('Audio play sound error', e);
    }
  }

  // --- Canvas Setup ---
  const canvas = document.getElementById('raceCanvas');
  const ctx = canvas.getContext('2d');

  // --- DOM HUD & Elements ---
  const wpmVal = document.getElementById('wpmVal');
  const accuracyVal = document.getElementById('accuracyVal');
  const bestWpmVal = document.getElementById('bestWpmVal');
  const positionVal = document.getElementById('positionVal');
  const modeSubtitle = document.getElementById('modeSubtitle');

  const difficultySelect = document.getElementById('difficultySelect');
  const categorySelect = document.getElementById('categorySelect');
  const newRaceBtn = document.getElementById('newRaceBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');

  const startOverlay = document.getElementById('startOverlay');
  const startRaceBtn = document.getElementById('startRaceBtn');
  const finishOverlay = document.getElementById('finishOverlay');
  const finishTitle = document.getElementById('finishTitle');
  const finishSubtitle = document.getElementById('finishSubtitle');
  const finishBadge = document.getElementById('finishBadge');
  const finalPosEl = document.getElementById('finalPosEl');
  const finalWpmEl = document.getElementById('finalWpmEl');
  const finalAccEl = document.getElementById('finalAccEl');
  const finalTimeEl = document.getElementById('finalTimeEl');
  const playAgainBtn = document.getElementById('playAgainBtn');

  const promptDisplay = document.getElementById('promptDisplay');
  const hiddenTypingInput = document.getElementById('hiddenTypingInput');
  const progressBarFill = document.getElementById('progressBarFill');
  const charCountEl = document.getElementById('charCountEl');
  const cockpitHint = document.getElementById('cockpitHint');

  // Initialize Pause Button state (Disabled before game start)
  if (pauseBtn) {
    pauseBtn.disabled = true;
    pauseBtn.style.opacity = '0.4';
    pauseBtn.style.pointerEvents = 'none';
  }

  // --- Persistent LocalStorage Records ---
  let bestWpm = parseInt(localStorage.getItem('speed_typist_high_wpm') || '0', 10);
  let bestAccuracy = parseFloat(localStorage.getItem('speed_typist_best_accuracy') || '100');
  let racesWon = parseInt(localStorage.getItem('speed_typist_races_won') || '0', 10);

  if (bestWpmVal) bestWpmVal.textContent = `${bestWpm} WPM`;

  // --- Race State ---
  let isRunning = false;
  let isPaused = false;
  let isRaceOver = false;

  let currentPromptText = '';
  let typedText = '';
  let currentCharIndex = 0;
  let totalKeystrokes = 0;
  let errorCount = 0;
  let raceStartTime = 0;
  let raceEndTime = 0;

  let currentWpm = 0;
  let currentAccuracy = 100;
  let playerProgress = 0; // 0.0 to 1.0

  // Particle exhaust flames
  let exhaustParticles = [];

  // Road scrolling animation offset
  let roadScrollOffset = 0;

  // Competitor Cars Array: [Player (index 0), Rivals (index 1, 2, 3)]
  let cars = [];
  let finishedCount = 0;

  function initCars() {
    finishedCount = 0;
    const diff = difficultySelect ? difficultySelect.value : 'pro';
    const rivals = DIFFICULTY_PROFILES[diff] || DIFFICULTY_PROFILES.pro;

    cars = [
      {
        isPlayer: true,
        name: 'You (Player)',
        lane: 0,
        color: '#38bdf8',
        progress: 0,
        speed: 0,
        wpm: 0,
        finishTime: null,
        finishOrder: null
      },
      ...rivals.map((r, i) => ({
        isPlayer: false,
        name: r.name,
        lane: r.lane,
        color: r.color,
        baseWpm: r.baseWpm,
        currentWpm: r.baseWpm,
        progress: 0,
        finishTime: null,
        finishOrder: null
      }))
    ];
  }

  // --- Load Random Prompt by Category ---
  function loadNewPrompt() {
    const cat = categorySelect ? categorySelect.value : 'cyberpunk';
    const pool = PROMPT_LIBRARIES[cat] || PROMPT_LIBRARIES.cyberpunk;
    const prompt = pool[Math.floor(Math.random() * pool.length)];

    currentPromptText = prompt;
    typedText = '';
    currentCharIndex = 0;
    totalKeystrokes = 0;
    errorCount = 0;
    playerProgress = 0;
    currentWpm = 0;
    currentAccuracy = 100;

    renderPromptHTML();
    updateHUD();
  }

  // --- Render Prompt Characters with Visual Spans ---
  function renderPromptHTML() {
    if (!promptDisplay) return;

    let html = '';
    for (let i = 0; i < currentPromptText.length; i++) {
      const char = currentPromptText[i];
      let cls = 'char upcoming';

      if (i < typedText.length) {
        if (typedText[i] === char) {
          cls = 'char correct';
        } else {
          cls = 'char incorrect';
        }
      } else if (i === typedText.length) {
        cls = 'char current';
      }

      const displayChar = (char === ' ') ? '&nbsp;' : char;
      const isSpace = (char === ' ') ? ' space-char' : '';
      html += `<span class="${cls}${isSpace}" data-index="${i}">${displayChar}</span>`;
    }

    promptDisplay.innerHTML = html;

    if (charCountEl) {
      charCountEl.textContent = `${typedText.length} / ${currentPromptText.length} Chars`;
    }

    if (progressBarFill) {
      const pct = Math.min(100, Math.round((typedText.length / currentPromptText.length) * 100));
      progressBarFill.style.width = `${pct}%`;
    }
  }

  // --- Typing Input Handler ---
  function handleCharacterInput(char) {
    if (!isRunning || isPaused || isRaceOver) return;
    initAudio();

    if (typedText.length === 0 && raceStartTime === 0) {
      raceStartTime = performance.now();
      startEngineSound();
      if (cockpitHint) cockpitHint.textContent = '⚡ Accelerating down the speedway!';
    }

    totalKeystrokes++;

    const expectedChar = currentPromptText[typedText.length];

    if (char === expectedChar) {
      typedText += char;
      playSound('key');
    } else {
      typedText += char;
      errorCount++;
      playSound('error');
    }

    // Calculate real-time speed & accuracy
    recalculateMetrics();
    renderPromptHTML();

    // Check if prompt is completed
    if (typedText.length === currentPromptText.length) {
      // Check if text is completely correct
      if (typedText === currentPromptText) {
        finishRace();
      }
    }
  }

  function handleBackspace() {
    if (!isRunning || isPaused || isRaceOver || typedText.length === 0) return;
    typedText = typedText.slice(0, -1);
    playSound('key');
    recalculateMetrics();
    renderPromptHTML();
  }

  function recalculateMetrics() {
    const charsDone = typedText.length;
    let correctCount = 0;
    for (let i = 0; i < charsDone; i++) {
      if (typedText[i] === currentPromptText[i]) correctCount++;
    }

    // Progress
    playerProgress = charsDone / currentPromptText.length;
    cars[0].progress = playerProgress;

    // Time elapsed in minutes
    if (raceStartTime > 0) {
      const elapsedSec = (performance.now() - raceStartTime) / 1000;
      const elapsedMin = elapsedSec / 60;

      if (elapsedMin > 0.01) {
        // Standard WPM = (correct chars / 5) / minutes
        currentWpm = Math.max(0, Math.round((correctCount / 5) / elapsedMin));
        cars[0].wpm = currentWpm;
        setEngineRPM(currentWpm);
      }

      currentAccuracy = (totalKeystrokes > 0) 
        ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100))
        : 100;
    }

    updateHUD();
  }

  // --- Get Ranked Cars by Arrival / Progress ---
  function getSortedCarRanks() {
    return [...cars].sort((a, b) => {
      // 1. Both finished: sort by finishOrder ascending (1st arrived, 2nd arrived...)
      if (a.finishOrder !== null && b.finishOrder !== null) {
        return a.finishOrder - b.finishOrder;
      }
      // 2. One finished and one still racing: finished car is ahead
      if (a.finishOrder !== null) return -1;
      if (b.finishOrder !== null) return 1;
      // 3. Neither finished: compare progress down the track
      return b.progress - a.progress;
    });
  }

  // --- Update Live HUD ---
  function updateHUD() {
    if (wpmVal) wpmVal.textContent = `${currentWpm} WPM`;
    if (accuracyVal) accuracyVal.textContent = `${currentAccuracy}%`;
    if (bestWpmVal) bestWpmVal.textContent = `${bestWpm} WPM`;

    // Calculate current position rank
    const sortedCars = getSortedCarRanks();
    const playerRank = sortedCars.findIndex(c => c.isPlayer) + 1;
    const rankSuffix = (playerRank === 1) ? '1st 🏁' : (playerRank === 2) ? '2nd 🥈' : (playerRank === 3) ? '3rd 🥉' : '4th ⚠️';

    if (positionVal) positionVal.textContent = rankSuffix;
    if (modeSubtitle) {
      modeSubtitle.textContent = isRunning ? `Race Active • Live Speed: ${currentWpm} WPM` : `Grand Prix Speedway • Type to Accelerate`;
    }
  }

  // --- Game Flow Methods ---
  function startRace() {
    initAudio();

    isRunning = true;
    isPaused = false;
    isRaceOver = false;
    raceStartTime = 0;
    raceEndTime = 0;

    initCars();
    loadNewPrompt();

    // Enable Pause Button
    if (pauseBtn) {
      pauseBtn.disabled = false;
      pauseBtn.innerHTML = '⏸️ Pause';
      pauseBtn.style.opacity = '1';
      pauseBtn.style.pointerEvents = 'auto';
    }

    startOverlay?.classList.add('hidden');
    finishOverlay?.classList.add('hidden');

    if (hiddenTypingInput) {
      hiddenTypingInput.value = '';
      hiddenTypingInput.focus();
    }
  }

  function finishRace() {
    if (isRaceOver) return;
    isRaceOver = true;
    isRunning = false;
    raceEndTime = performance.now();
    stopEngineSound();

    // Disable Pause Button
    if (pauseBtn) {
      pauseBtn.disabled = true;
      pauseBtn.innerHTML = '⏸️ Pause';
      pauseBtn.style.opacity = '0.4';
      pauseBtn.style.pointerEvents = 'none';
    }

    const elapsedTotalSec = Math.max(1, ((raceEndTime - raceStartTime) / 1000)).toFixed(1);
    const finalWpm = Math.max(currentWpm, Math.round((currentPromptText.length / 5) / (elapsedTotalSec / 60)));
    cars[0].progress = 1.0;

    // Record player's finish arrival
    if (cars[0].finishOrder === null) {
      finishedCount++;
      cars[0].finishOrder = finishedCount;
      cars[0].finishTime = elapsedTotalSec;
    }

    // Rank all cars accurately by arrival
    const finishRanks = getSortedCarRanks();
    const finalRank = finishRanks.findIndex(c => c.isPlayer) + 1;

    // Audio cue based on victory vs lower finish
    if (finalRank === 1) {
      playSound('finish');
    } else {
      playSound('key');
    }

    // Save Persistent High Score Records
    if (finalWpm > bestWpm) {
      bestWpm = finalWpm;
      localStorage.setItem('speed_typist_high_wpm', bestWpm.toString());
    }

    if (finalRank === 1) {
      racesWon++;
      localStorage.setItem('speed_typist_races_won', racesWon.toString());
    }

    localStorage.setItem('speed_typist_best_accuracy', currentAccuracy.toString());

    // Update Result Modal
    const rankLabel = (finalRank === 1) ? '1st Place 🏆' : (finalRank === 2) ? '2nd Place 🥈' : (finalRank === 3) ? '3rd Place 🥉' : '4th Place';
    if (finalPosEl) finalPosEl.textContent = rankLabel;
    if (finalWpmEl) finalWpmEl.textContent = `${finalWpm} WPM`;
    if (finalAccEl) finalAccEl.textContent = `${currentAccuracy}%`;
    if (finalTimeEl) finalTimeEl.textContent = `${elapsedTotalSec}s`;

    if (finishTitle) {
      finishTitle.textContent = (finalRank === 1) ? 'Victory! 1st Place 🏆' : `${rankLabel} Finish`;
      finishTitle.className = (finalRank === 1) ? 'overlay-title gold-title' : 'overlay-title';
    }
    if (finishBadge) {
      finishBadge.textContent = (finalRank === 1) ? 'GRAND PRIX CHAMPION' : 'CHECKERED FLAG';
      finishBadge.className = (finalRank === 1) ? 'tactical-badge gold-badge' : 'tactical-badge';
    }
    if (finishSubtitle) {
      finishSubtitle.textContent = (finalRank === 1)
        ? `Incredible driving! You dominated the speedway at ${finalWpm} WPM.`
        : `Race concluded in ${rankLabel} behind AI rivals. Practice your typing rhythm to climb the podium!`;
    }

    finishOverlay?.classList.remove('hidden');
    updateHUD();
  }

  function togglePause() {
    if (!isRunning || isRaceOver) return;
    isPaused = !isPaused;
    if (pauseBtn) {
      pauseBtn.innerHTML = isPaused ? '▶️ Resume' : '⏸️ Pause';
    }
    if (isPaused) {
      stopEngineSound();
    } else {
      if (typedText.length > 0) startEngineSound();
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (muteBtn) {
      muteBtn.innerHTML = isMuted ? '🔇 Muted' : '🔊 Sound';
    }
    if (isMuted) stopEngineSound();
  }

  // --- Animation & Physics Loop ---
  function update() {
    if (!isRunning || isPaused || isRaceOver) return;

    // Advance road background offset
    const playerSpeedFactor = Math.max(1, currentWpm / 15);
    roadScrollOffset = (roadScrollOffset + playerSpeedFactor * 4) % 60;

    // Advance AI Rival Cars realistically based on their target WPM
    if (raceStartTime > 0) {
      const elapsedMin = (performance.now() - raceStartTime) / 60000;
      cars.forEach(car => {
        if (!car.isPlayer && car.progress < 1.0) {
          // Slight human-like jitter
          const jitter = Math.sin(performance.now() / 600 + car.lane) * 3;
          const effectiveWpm = car.baseWpm + jitter;
          const targetCharsDone = (effectiveWpm * 5) * elapsedMin;
          car.progress = Math.min(1.0, targetCharsDone / currentPromptText.length);
          if (car.progress >= 1.0 && car.finishOrder === null) {
            finishedCount++;
            car.finishOrder = finishedCount;
            car.finishTime = ((performance.now() - raceStartTime) / 1000).toFixed(1);
          }
        }
      });
    }

    // Exhaust Particles for Player Car
    if (currentWpm > 10 && Math.random() < 0.65) {
      const laneY = 15 + cars[0].lane * 55 + 27;
      const carX = 60 + cars[0].progress * 620;
      exhaustParticles.push({
        x: carX - 22,
        y: laneY + (Math.random() - 0.5) * 6,
        vx: -2 - Math.random() * 3,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2 + Math.random() * 3,
        life: 1.0,
        color: (Math.random() < 0.5) ? '#38bdf8' : '#0284c7'
      });
    }

    // Update Particles
    for (let i = exhaustParticles.length - 1; i >= 0; i--) {
      const p = exhaustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        exhaustParticles.splice(i, 1);
      }
    }
  }

  // --- Draw Sleek Cyber Car on Track ---
  function drawCyberCar(ctx, x, y, color, isPlayer) {
    ctx.save();
    ctx.translate(x, y);

    // Car shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glow underbody
    ctx.shadowColor = color;
    ctx.shadowBlur = isPlayer ? 14 : 8;

    // Chassis body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-22, -10, 44, 20, 5);
    ctx.fill();

    // Cockpit cabin glass
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(-8, -7, 18, 14, 3);
    ctx.fill();

    // Windshield reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 8;
    ctx.fillRect(20, -8, 2, 4);
    ctx.fillRect(20, 4, 2, 4);

    // Tail lights
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.fillRect(-22, -8, 2, 4);
    ctx.fillRect(-22, 4, 2, 4);

    // Wheels
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-15, -13, 10, 3);
    ctx.fillRect(5, -13, 10, 3);
    ctx.fillRect(-15, 10, 10, 3);
    ctx.fillRect(5, 10, 10, 3);

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const laneHeight = canvas.height / 4;

    // 1. Draw 4 Racetrack Asphalt Lanes
    for (let lane = 0; lane < 4; lane++) {
      const laneY = lane * laneHeight;

      // Dark asphalt
      ctx.fillStyle = (lane % 2 === 0) ? '#0b1120' : '#090e17';
      ctx.fillRect(0, laneY, canvas.width, laneHeight);

      // Lane separator dashed lines
      if (lane > 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([16, 14]);
        ctx.lineDashOffset = -roadScrollOffset;
        ctx.beginPath();
        ctx.moveTo(0, laneY);
        ctx.lineTo(canvas.width, laneY);
        ctx.stroke();
      }

      // Lane tag label
      ctx.font = '600 11px Outfit, sans-serif';
      ctx.fillStyle = (lane === 0) ? 'rgba(56, 189, 248, 0.65)' : 'rgba(148, 163, 184, 0.45)';
      ctx.textAlign = 'left';
      const label = (lane === 0) ? 'LANE 1 • YOU' : `LANE ${lane + 1} • AI`;
      ctx.fillText(label, 12, laneY + 16);
    }

    // 2. Finish Line Checkered Banner at X = 720
    const finishX = 720;
    ctx.save();
    ctx.setLineDash([]);
    const checkW = 10;
    const checkH = 10;
    for (let y = 0; y < canvas.height; y += checkH) {
      for (let x = finishX; x < finishX + checkW * 2; x += checkW) {
        const isBlack = ((Math.floor(x / checkW) + Math.floor(y / checkH)) % 2 === 0);
        ctx.fillStyle = isBlack ? '#ffffff' : '#0f172a';
        ctx.fillRect(x, y, checkW, checkH);
      }
    }
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(finishX, 0, checkW * 2, canvas.height);
    ctx.restore();

    // 3. Draw Exhaust Particles
    exhaustParticles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Draw All Cars
    cars.forEach(car => {
      const laneY = car.lane * laneHeight + laneHeight / 2;
      // Start at X = 60, Finish line is at X = 720 (total span 660px)
      const carX = 60 + car.progress * (finishX - 60);

      drawCyberCar(ctx, carX, laneY, car.color, car.isPlayer);

      // Car driver tag & progress above car
      ctx.save();
      ctx.font = '700 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = car.isPlayer ? '#38bdf8' : '#94a3b8';
      const statusText = car.finishOrder
        ? `${car.name} • ${car.finishOrder === 1 ? '1st 🏆' : car.finishOrder === 2 ? '2nd 🥈' : car.finishOrder === 3 ? '3rd 🥉' : '4th'}`
        : `${car.name} (${Math.round(car.progress * 100)}%)`;
      ctx.fillText(statusText, carX, laneY - 16);
      ctx.restore();
    });

    // 5. Visual Paused Overlay
    if (isPaused) {
      ctx.save();
      ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 28px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#38bdf8';
      ctx.fillText('⏸️ RACE PAUSED', canvas.width / 2, canvas.height / 2 - 8);

      ctx.font = '600 14px Outfit, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText('Press Esc or click Resume to continue grand prix', canvas.width / 2, canvas.height / 2 + 22);
      ctx.restore();
    }
  }

  // --- Render Loop ---
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // --- Keyboard & Input Listeners ---
  window.addEventListener('keydown', (e) => {
    // Escape key toggles pause without conflicting with text typing
    if (e.key === 'Escape') {
      e.preventDefault();
      togglePause();
      return;
    }

    if (!isRunning || isPaused || isRaceOver) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      handleCharacterInput(e.key);
    }
  });

  // Mobile virtual keyboard input bridge
  hiddenTypingInput?.addEventListener('input', (e) => {
    if (!isRunning || isPaused || isRaceOver) return;
    const inputVal = hiddenTypingInput.value;
    if (inputVal.length > 0) {
      const lastChar = inputVal[inputVal.length - 1];
      handleCharacterInput(lastChar);
      hiddenTypingInput.value = '';
    }
  });

  promptDisplay?.addEventListener('click', () => {
    hiddenTypingInput?.focus();
  });

  // --- Toolbar & Action Bindings ---
  startRaceBtn?.addEventListener('click', startRace);
  playAgainBtn?.addEventListener('click', startRace);
  newRaceBtn?.addEventListener('click', startRace);
  pauseBtn?.addEventListener('click', togglePause);
  muteBtn?.addEventListener('click', toggleMute);

  difficultySelect?.addEventListener('change', () => {
    if (!isRunning) initCars();
  });

  categorySelect?.addEventListener('change', () => {
    if (!isRunning) loadNewPrompt();
  });

  // Initial setup
  initCars();
  loadNewPrompt();
  requestAnimationFrame(loop);
})();
