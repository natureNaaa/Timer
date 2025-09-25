let countdownInterval, remainingTime, isPaused = false;

const startBtn = document.getElementById('start-countdown');
const pauseBtn = document.getElementById('pause-countdown');
const resumeBtn = document.getElementById('resume-countdown');
const resetBtn = document.getElementById('reset-countdown');
const display = document.getElementById('countdown-display');
const resultText = document.getElementById('countdown-result');
const input = document.getElementById('minutes-input');

function updateDisplay(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const format = num => String(num).padStart(2, '0');
  display.textContent = `${format(hrs)}:${format(mins)}:${format(secs)}`;
}

startBtn.addEventListener('click', () => {
  const minutes = parseInt(input.value);
  if (!minutes || minutes <= 0) {
    resultText.textContent = "Please enter valid minutes.";
    return;
  }
  remainingTime = minutes * 60;
  updateDisplay(remainingTime);

  countdownInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay(remainingTime);
    } else {
      clearInterval(countdownInterval);
      resultText.textContent = "⏰ Time's up!";
      alert("⏰ Countdown finished!");
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
        resultText.textContent = "⏰ Time's up!";
        alert("⏰ Countdown finished!");
      }
    }, 1000);
    isPaused = false;
    resultText.textContent = "Resumed.";
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  remainingTime = 0;
  updateDisplay(0);
  input.value = "";
  resultText.textContent = "Reset complete.";
});
