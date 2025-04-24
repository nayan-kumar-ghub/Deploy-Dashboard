// Express backend providing deployment environment and system stats

const express = require('express');
const os = require('os');
const { execSync } = require('child_process');
const app = express();
const port = 3001;

// Helper to detect environment
function detectEnvironment() {
  if (process.env.KUBERNETES_SERVICE_HOST) return 'Kubernetes';
  if (fs.existsSync('/.dockerenv')) return 'Docker Container';
  if (process.env.AWS_EXECUTION_ENV || process.env.ECS_CONTAINER_METADATA_URI) return 'AWS';
  return 'Local/Unknown';
}

app.get('/api/environment', (req, res) => {
  const environment = detectEnvironment();
  res.json({ environment });
});

app.get('/api/stats', (req, res) => {
  const cpuLoad = os.loadavg()[0];
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(2);
  let diskUsage = 'N/A';
  try {
    const stdout = execSync('df -h / | tail -1 | awk '{print $5}'').toString();
    diskUsage = stdout.trim();
  } catch (e) {}
  const uptime = `${Math.floor(os.uptime() / 60)} minutes`;
  res.json({
    cpu: cpuLoad.toFixed(2),
    memory: usedMemPercent,
    disk: diskUsage,
    uptime
  });
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
