
let startTime;
let timerInterval;

const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const timerDisplay = document.getElementById('timer-display');
const resultText = document.getElementById('result-text');

function updateDisplay() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const format = num => String(num).padStart(2, '0');
    timerDisplay.textContent = `${format(hours % 24)}:${format(minutes % 60)}:${format(seconds % 60)}`;
}

startBtn.addEventListener('click', () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 1000);
        resultText.textContent = "Timer started...";
    }
});

endBtn.addEventListener('click', () => {
    if (startTime) {
        clearInterval(timerInterval);
        const elapsed = Date.now() - startTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const totalMinutes = (totalSeconds / 60).toFixed(2);
        
        resultText.textContent = `Total time: ${totalSeconds} seconds (approx. ${totalMinutes} minutes)`;
        
        startTime = null; // Reset for a new session
        timerDisplay.textContent = '00:00:00';
    } else {
        resultText.textContent = "Please click start first.";
    }
});
