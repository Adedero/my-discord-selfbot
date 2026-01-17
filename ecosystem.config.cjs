module.exports = {
  apps: [
    {
      name: "discord-bot",
      script: "./src/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      max_restarts: 3,
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      time: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
