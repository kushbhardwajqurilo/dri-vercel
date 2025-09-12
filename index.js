const connectDB = require("./src/database/DB");

if (process.env.VERCEL) {
  // 👉 On Vercel: Only connect DB + export app
  connectDB();
  module.exports = require("./app");
} else {
  // 👉 Local / VPS: Run with cluster + cron job
  const cluster = require("cluster");
  const os = require("os");
  const http = require("http");
  const numCPUs = os.cpus().length;
  const app = require("./app");
  const PORT = process.env.PORT || 5000;

  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died, restarting...`);
      cluster.fork();
    });
  } else {
    connectDB().then(() => {
      http.createServer(app).listen(PORT, () => {
        console.log(`Worker ${process.pid} running on port ${PORT}`);
      });
    });
  }
}
