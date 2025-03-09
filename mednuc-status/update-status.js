const fs = require('fs');
const path = require('path');

function updateStatus(manuscriptNumber, title, status) {
  const statusData = {
    manuscriptNumber,
    title,
    status,
    lastCheck: new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      dateStyle: 'full',
      timeStyle: 'long'
    }),
    timestamp: Date.now()
  };

  const filePath = path.join(__dirname, 'src', 'assets', 'status.json');
  fs.writeFileSync(filePath, JSON.stringify(statusData, null, 2));
}

// Cette fonction sera appelée par le test Playwright
module.exports = { updateStatus }; 