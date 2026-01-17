import { Client, Channel } from "djs-selfbot-v13";
import logger from "./lib/logger.js";
import { Env } from "./lib/env.js";

function main() {
  try {
    const TOKEN = Env.get("DISCORD_TOKEN");
    const CHANNEL_ID = Env.get("ALERT_CHANNEL_ID");
    /**
     * @type {Channel|null}
     */
    let channel = null;

    const client = new Client();

    client.on("ready", async () => {
      logger.info("Bot is online");
      channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) {
        await channel.send("Bot is online");
      }
    });

    client.on("guildMemberAdd", async (member) => {
      try {
        if (!channel) {
          logger.error("Alert Channel not found");
          return;
        }
        const message = `${member.user.tag} joined ${member.guild.name}`;
        await channel.send(message);
      } catch (error) {
        logger.error(`Error sending join alert: ${error}`);
      }
    });

    client.login(TOKEN);
  } catch (error) {
    logger.error(`Error in main: ${error}`);
  }
}

main();
