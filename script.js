// === 通用工具 ===
function formatTime(num) {
  return String(num).padStart(2, '0');
}
function formatHMS(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${formatTime(hrs)}:${formatTime(mins)}:${formatTime(secs)}`;
}
function getDateTimeStr() {
  return new Date().toLocaleString();
}

// === 历史记录 ===
function saveHistory(mode, start, end, duration) {
  let history = JSON.parse(localStorage.getItem('timerHistory')) || [];
  history.unshift({
    mode,
    start,
    end,
    duration,
    date: getDateTimeStr()
  });
  history = history.slice(0, 4); // 保留最近 4 条
  localStorage.setItem('timerHistory', JSON.stringify(history));
  renderHistory();
}
function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  let history = JSON.parse(localStorage.getItem('timerHistory')) || [];
  list.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement('li');
    li.textContent = `[${h.date}] ${h.mode}: ${h.start} → ${h.end} (总时长 ${h.duration})`;
    list.appendChild(li);
  });
}

// === Stopwatch 模式 ===
if (document.getElementById('timer-display')) {
  let startTime, timerInterval, pausedTime = 0, isPaused = false;
  let sessionStart, sessionEnd;

  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resumeBtn = document.getElementById('resume-btn');
  const endBtn = document.getElementById('end-btn');
  const timerDisplay = document.getElementById('timer-display');
  const resultText = document.getElementById('result-text');

  function updateDisplay() {
    const elapsed = Date.now() - startTime + pausedTime;
    const seconds = Math.floor(elapsed / 1000);
    timerDisplay.textContent = formatHMS(seconds);
  }

  startBtn.addEventListener('click', () => {
    if (!startTime) {
      startTime = Date.now();
      sessionStart = new Date().toLocaleTimeString();
      pausedTime = 0;
      timerInterval = setInterval(updateDisplay, 1000);
      resultText.textContent = "Timer started...";
    }
  });

  pauseBtn.addEventListener('click', () => {
    if (startTime && !isPaused) {
      clearInterval(timerInterval);
      pausedTime += Date.now() - startTime;
      isPaused = true;
      resultText.textContent = "Paused.";
    }
  });

  resumeBtn.addEventListener('click', () => {
    if (isPaused) {
      startTime = Date.now();
      timerInterval = setInterval(updateDisplay, 1000);
      isPaused = false;
      resultText.textContent = "Resumed.";
    }
  });

  endBtn.addEventListener('click', () => {
    if (startTime) {
      clearInterval(timerInterval);
      sessionEnd = new Date().toLocaleTimeString();
      const elapsed = Date.now() - startTime + pausedTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      const totalMinutes = (totalSeconds / 60).toFixed(2);

      resultText.textContent = `Total time: ${totalSeconds} sec (≈ ${totalMinutes} min)`;
      saveHistory("Stopwatch", sessionStart, sessionEnd, formatHMS(totalSeconds));

      startTime = null;
      pausedTime = 0;
      isPaused = false;
      timerDisplay.textContent = '00:00:00';
    } else {
      resultText.textContent = "Please click start first.";
    }
  });

  renderHistory();
}

// === Countdown 模式 ===
if (document.getElementById('countdown-display')) {
  let countdownInterval, remainingTime, isPaused = false;
  let sessionStart, sessionEnd;

  const startBtn = document.getElementById('start-countdown');
  const pauseBtn = document.getElementById('pause-countdown');
  const resumeBtn = document.getElementById('resume-countdown');
  const resetBtn = document.getElementById('reset-countdown');
  const display = document.getElementById('countdown-display');
  const resultText = document.getElementById('countdown-result');
  const input = document.getElementById('minutes-input');

  function updateDisplay(seconds) {
    display.textContent = formatHMS(seconds);
  }

  startBtn.addEventListener('click', () => {
    const minutes = parseInt(input.value);
    if (!minutes || minutes <= 0) {
      resultText.textContent = "Please enter valid minutes.";
      return;
    }
    remainingTime = minutes * 60;
    updateDisplay(remainingTime);
    sessionStart = new Date().toLocaleTimeString();

    countdownInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        updateDisplay(remainingTime);
      } else {
        clearInterval(countdownInterval);
        sessionEnd = new Date().toLocaleTimeString();
        resultText.textContent = "⏰ Time's up!";
        alert("⏰ Countdown finished!");
        saveHistory("Countdown", sessionStart, sessionEnd, formatHMS(minutes * 60));
      }
    }, 1000);

    resultText.textContent = "Countdown started...";
  });

  pauseBtn.addEventListener('click', () => {
    if (!isPaused && remainingTime > 0) {
      clearInterval(countdownInterval);
      isPaused = true;
      resultText.textContent = "Paused.";
    }
  });

  resumeBtn.addEventListener('click', () => {
    if (isPaused && remainingTime > 0) {
      countdownInterval = setInterval(() => {
        if (remainingTime > 0) {
          remainingTime--;
          updateDisplay(remainingTime);
        } else {
          clearInterval(countdownInterval);
          sessionEnd = new Date().toLocaleTimeString();
          resultText.textContent = "⏰ Time's up!";
          alert("⏰ Countdown finished!");
          saveHistory("Countdown", sessionStart, sessionEnd, formatHMS(parseInt(input.value) * 60));
        }
      }, 1000);
      isPaused = false;
      resultText.textContent = "Resumed.";
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    sessionEnd = new Date().toLocaleTimeString();
    saveHistory("Countdown", sessionStart, sessionEnd, formatHMS(parseInt(input.value) * 60 - remainingTime));
    remainingTime = 0;
    updateDisplay(0);
    input.value = "";
    resultText.textContent = "Reset complete.";
  });

  renderHistory();
}
