import { config } from "dotenv";
import { Client } from "selfbot-discord";
import logger from "./lib/logger.js";
import pkg from "selfbot-discord";

function main() {
  config({ quiet: true });

  const client = new Client();
  /**
   * @type {pkg.Channel|null}
   */
  let channel = null;
  const TOKEN = process.env.DISCORD_TOKEN;
  const CHANNEL_ID = process.env.ALERT_CHANNEL_ID;
  if (!TOKEN) {
    logger.error("DISCORD_TOKEN environment variable is not set");
    return;
  }

  if (!CHANNEL_ID) {
    logger.error("ALERT_CHANNEL_ID environment variable is not set");
    return;
  }

  client.on("ready", async () => {
    channel = client.channels.find((c) => c.id === CHANNEL_ID);
    if (channel) {
      await channel.send("Bot is online!");
    }
    logger.info(`Bot is online as ${client.user.tag}`);
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
}

main();
