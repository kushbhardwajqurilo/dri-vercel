module.exports = {
  apps: [
    {
      name: "app-server",
      script: "index.js",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "emi-cron",
      // script: "src/config/cron-job/nodeCron.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
