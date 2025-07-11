// List of upcoming projects and their deadlines (null for TBD)
const upcomingProjects = [
  {
    selector: 'A Platformer Game',
    deadline: null // No date set, will show TBD
  },
  {
    selector: 'Placeholder',
    deadline: '2025-08-15T23:59:59Z' // Example date
  },
  {
    selector: 'Placeholder',
    deadline: '2025-09-01T12:00:00Z' // Example date
  }
];

function formatTimeLeft(ms) {
  if (ms <= 0) return "Deadline passed. Mission failed. We'll get them next time.";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateTimers() {
  upcomingProjects.forEach(project => {
    // Find the project box by h3 text
    const boxes = document.querySelectorAll('#upcoming-projects .project-box');
    boxes.forEach(box => {
      const h3 = box.querySelector('h3');
      if (h3 && h3.textContent.trim() === project.selector) {
        let timer = box.querySelector('.deadline-timer');
        if (!timer) {
          timer = document.createElement('div');
          timer.className = 'deadline-timer';
          timer.style.marginTop = '0.5rem';
          timer.style.fontSize = '0.95em';
          timer.style.color = '#b23b3b';
          box.appendChild(timer);
        }
        if (!project.deadline) {
          timer.textContent = 'Deadline: TBD';
        } else {
          // Convert now to PST/PDT
          const now = new Date();
          // Get the current time in PST/PDT
          const nowPST = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
          // Parse the deadline as UTC, then convert to PST/PDT
          const endUTC = new Date(project.deadline);
          const endPST = new Date(endUTC.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
          const ms = endPST - nowPST;
          timer.textContent = 'Deadline: ' + formatTimeLeft(ms);
        }
      }
    });
  });
}

// Initial call and interval for live update
updateTimers();
setInterval(updateTimers, 1000);

// --- Guess the Number Game ---
let secretNumber = Math.floor(Math.random() * 100) + 1;
let guessCount = 0;
let guessHistory = [];

function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    guessCount = 0;
    guessHistory = [];
    document.getElementById('guess-feedback').textContent = '';
    document.getElementById('guess-history').textContent = '';
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-btn').disabled = false;
    document.getElementById('restart-btn').style.display = 'none';
}

function handleGuess() {
    const input = document.getElementById('guess-input');
    const feedback = document.getElementById('guess-feedback');
    const historyDiv = document.getElementById('guess-history');
    let guess = Number(input.value);

    if (!guess || guess < 1 || guess > 100) {
        feedback.textContent = "Please enter a number between 1 and 100!";
        return;
    }

    guessCount++;
    guessHistory.push(guess);

    if (guess === secretNumber) {
        feedback.textContent = `🎉 Correct! The number was ${secretNumber}. You guessed it in ${guessCount} tries!`;
        document.getElementById('guess-btn').disabled = true;
        document.getElementById('restart-btn').style.display = 'inline-block';
    } else if (guess < secretNumber) {
        feedback.textContent = "Too low! Try again.";
    } else {
        feedback.textContent = "Too high! Try again.";
    }

    historyDiv.textContent = `Your guess(es): ${guessHistory.join(', ')}`;
    input.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const guessBtn = document.getElementById('guess-btn');
    const restartBtn = document.getElementById('restart-btn');
    if (guessBtn && restartBtn) {
        guessBtn.addEventListener('click', handleGuess);
        document.getElementById('guess-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') handleGuess();
        });
        restartBtn.addEventListener('click', resetGame);
    }
});
