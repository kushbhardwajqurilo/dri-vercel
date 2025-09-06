require("./src/database/DB");

if (process.env.VERCEL) {
  // 👉 On Vercel: just export the app (no listen, no cluster)
  module.exports = require("./app");
} else {
  // 👉 Local / VPS: run with cluster + listen
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
    http.createServer(app).listen(PORT, () => {
      console.log(`Worker ${process.pid} running on port ${PORT}`);
    });
  }
}
