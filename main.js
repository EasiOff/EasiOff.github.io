
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
