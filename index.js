require("./src/database/DB");
const cluster = require("cluster");
const os = require("os");
const app = require("./app");
const http = require("http");
const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
