const fs = require('fs');
const path = require('path');
const rimraf = require("rimraf");
const dotenv = require("dotenv").config();

const {
  spawn
} = require("child_process");

// writes environment variables
const setupEnv = () => {
  let defaultConfig = fs.readFileSync(path.join(__dirname, '/defaultConfig.json'), 'utf8');
  defaultConfig = JSON.parse(defaultConfig);

  defaultConfig.messenger.username = process.env.MESSENGER_USERNAME
  defaultConfig.messenger.password = process.env.MESSENGER_PASSWORD
  defaultConfig.discord.token = process.env.DISCORD_TOKEN
  defaultConfig.api.password = process.env.DASHBOARD_PASSWORD

  defaultConfig = JSON.stringify(defaultConfig);
  fs.writeFileSync(path.join(__dirname, '/config/config.json'), defaultConfig, {
    encoding: 'utf8'
  });
}

const start = () => {

  setupEnv();

  rimraf(path.join(__dirname, '/config/logs/*'), (err) => {
    if (err) console.error(err);
  });

  if (!fs.existsSync("./config/config.json")) {
    console.log("Config doesnt exist");
    return;
  }

  const proc = spawn('miscord', ['--dataPath', `./config`]);

  proc.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  proc.stderr.on("data", (data) => {
    console.log(`${data}`);
  });

  proc.on("close", (code) => {
    console.log(`Exit code: ${code}`);
  });
}

start();