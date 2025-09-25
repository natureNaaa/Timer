// script.js (在顶部或其他位置添加)

// 函数：检查并请求通知权限
function requestNotificationPermission() {
    // 检查浏览器是否支持通知
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification.");
        return;
    }

    // 检查是否已经获得授权
    if (Notification.permission === "granted") {
        console.log("Notification permission already granted.");
        return;
    }

    // 请求用户授权
    if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted!");
            } else {
                console.log("Notification permission denied.");
            }
        });
    }
}

// 在页面加载后立即尝试请求权限（或在用户点击“开始倒计时”时请求）
requestNotificationPermission();

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

// script.js (在文件底部添加新的逻辑)

let countdownTimeRemaining; // 剩余时间（秒）
let countdownInterval;

const countdownMinutesInput = document.getElementById('countdown-minutes');
const countdownStartBtn = document.getElementById('countdown-start-btn');

function formatTime(totalSeconds) {
    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor(totalSeconds / 3600);

    const format = num => String(num).padStart(2, '0');
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
}

function startCountdown() {
    // 清除任何正在运行的计时器
    clearInterval(timerInterval);
    clearInterval(countdownInterval);

    const minutes = parseInt(countdownMinutesInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        resultText.textContent = "Please enter a valid number of minutes (at least 1).";
        return;
    }

    countdownTimeRemaining = minutes * 60; // 转换为秒

    // 初始化显示
    timerDisplay.textContent = formatTime(countdownTimeRemaining);
    resultText.textContent = `Countdown started for ${minutes} minutes...`;

    // 启动倒计时逻辑
    countdownInterval = setInterval(() => {
        countdownTimeRemaining--;

        // 更新显示
        timerDisplay.textContent = formatTime(countdownTimeRemaining);

        // 倒计时结束
        if (countdownTimeRemaining <= 0) {
            clearInterval(countdownInterval);
            timerDisplay.textContent = "00:00:00";
            resultText.textContent = "Time's up! Countdown finished.";
            // 🌟🌟🌟 新增代码：发送系统通知 🌟🌟🌟
            if (Notification.permission === "granted") {
                new Notification("TIME'S UP!", {
                    body: "The countdown timer has finished!",
                    icon: "https://naturenaaa.github.io/Timer//path/to/icon.png" // 可选：指定一个图标 URL
                });
            }
            // 🌟🌟🌟 结束新增代码 🌟🌟🌟

            
        }
    }, 1000);
}

// 绑定新的按钮事件
countdownStartBtn.addEventListener('click', startCountdown);

// 【重要修改】确保正向计时在开始时清除倒计时，反之亦然。
// 你需要在原有的 startBtn 和 endBtn 的事件监听器中，也添加清除倒计时的逻辑。

// 修改原有的 startBtn.addEventListener('click', ...)
startBtn.addEventListener('click', () => {
    // 确保在开始正向计时前，清除倒计时
    clearInterval(countdownInterval);
    countdownTimeRemaining = 0;
    
    // ... 原有的逻辑 ...
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateDisplay, 1000);
        resultText.textContent = "Timer started...";
    }
});

// 修改原有的 endBtn.addEventListener('click', ...)
endBtn.addEventListener('click', () => {
    // 确保在停止正向计时前，清除倒计时
    clearInterval(countdownInterval);
    
    // ... 原有的逻辑 ...
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
