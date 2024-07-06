
// renderer.js
let timer;
let timeLeft;
let totalTime;
let isStudyTime = true;
let currentSession = 1;
let totalSessions;
let studyDuration;
let breakDuration;
let isPaused = false;

const timerProgress = document.getElementById('timerProgress');
const timerText = document.getElementById('timerText');
const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle


function hiddenInput(action='add') {
  try{
      const form = document.querySelector('.container .left .form')
      const options = document.querySelector('.container .left .options')
      
      if(action === 'add') {
        form.classList.add('active');
        options.classList.add('active');
      }else {
        form.classList.remove('active');
        options.classList.remove('active');
      }
    } catch(err){
      console.log('form start' ,err)
    }   
}

function startStudySession() {
    const studyMinutes = parseInt(document.getElementById('studyMinutes').value);
    const breakMinutes = parseInt(document.getElementById('breakMinutes').value);
    totalSessions = parseInt(document.getElementById('sessions').value);

    if (isNaN(studyMinutes) || isNaN(breakMinutes) || isNaN(totalSessions) || 
        studyMinutes <= 0 || breakMinutes <= 0 || totalSessions <= 0) {
        alert('Please enter valid numbers for all fields.');
        return;
    }
  
    
    hiddenInput('add');
    studyDuration = studyMinutes * 60;
    breakDuration = breakMinutes * 60;
    currentSession = 1;
    isStudyTime = true;
    startTimer(studyDuration);
    updateSessionInfo();
}

function startTimer(duration) {
    clearInterval(timer);
    timeLeft = duration;
    totalTime = duration;
    isPaused = false;
    updateTimerDisplay();
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            handleTimerEnd();
        }
    }, 1000);
    document.getElementById('pauseResumeBtn').textContent = 'Pause';
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = timeString;
    timerText.textContent = timeString;

    // Update circular progress
    const progress = (totalTime - timeLeft) / totalTime;
    const dashoffset = circumference * (1 - progress);
    timerProgress.style.strokeDashoffset = dashoffset;
}

function handleTimerEnd() {
    clearInterval(timer);
    document.getElementById('endSound').play();
    if (isStudyTime) {
        if (currentSession < totalSessions) {
            alert('Study session ended. Take a break!');
            isStudyTime = false;
            startTimer(breakDuration);
        } else {
            alert('All study sessions completed!');
            resetTimer();
        }
    } else {
        alert('Break ended. Back to studying!');
        isStudyTime = true;
        currentSession++;
        startTimer(studyDuration);
    }
    updateSessionInfo();
}

function updateSessionInfo() {
    const sessionInfo = document.getElementById('sessionInfo');
    if (currentSession <= totalSessions) {
        sessionInfo.textContent = `Session ${currentSession} of ${totalSessions} - ${isStudyTime ? 'Studying' : 'Break'}`;
    } else {
        sessionInfo.textContent = 'All sessions completed!';
    }
}

function pauseResumeTimer() {
    if (isPaused) {
        startTimer(timeLeft);
        document.getElementById('pauseResumeBtn').textContent = 'Pause';
    } else {
        clearInterval(timer);
        isPaused = true;
        document.getElementById('pauseResumeBtn').textContent = 'Resume';
    }
}

function stopTimer() {
    hiddenInput('any');
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    document.getElementById('timerDisplay').textContent = '00:00';
    timerText.textContent = '00:00';
    timerProgress.style.strokeDashoffset = circumference;
    document.getElementById('sessionInfo').textContent = '';
    document.getElementById('pauseResumeBtn').textContent = 'Pause';
    isPaused = false;
}

// Initialize the stroke-dasharray for the progress circle
timerProgress.style.strokeDasharray = circumference;
timerProgress.style.strokeDashoffset = circumference;


