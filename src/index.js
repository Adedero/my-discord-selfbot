import { Client, Channel } from "djs-selfbot-v13";
import logger from "./utils/logger.js";
import { Env } from "./utils/env.js";
import { createClient } from "./utils/client.js";

function main() {
  const bots = [
    {
      botName: "Chike's Bot",
      token: Env.get("CHIKE_DISCORD_TOKEN"),
      alertChannelId: Env.get("CHIKE_ALERT_CHANNEL_ID"),
    },
    {
      botName: "Investor's Bot",
      token: Env.get("INVESTOR_DISCORD_TOKEN"),
      alertChannelId: Env.get("INVESTOR_ALERT_CHANNEL_ID"),
    },
  ];
  try {
    for (const bot of bots) {
      createClient(bot);
    }
  } catch (error) {
    logger.error(`Error in main: ${error}`);
  }
}

main();
