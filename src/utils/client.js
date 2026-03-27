import { Client, Channel } from "djs-selfbot-v13";
import logger from "./logger.js";

/**
 *
 * @param {CreateClientOptions} options
 */
export const createClient = (options) => {
  if (!options) {
    throw new Error("No options provided");
  }
  const { botName, token, alertChannelId } = options;
  /**
   * @type {Channel|null}
   */
  let channel = null;
  const client = new Client();

  try {
    client.on("ready", async () => {
      logger.info(`${botName} is online`);
      channel = client.channels.cache.get(alertChannelId);
      if (channel) {
        await channel.send(`${botName} is online`);
      }
    });

    client.on("messageCreate", async (msg) => {
      if (
        msg.channelId === alertChannelId &&
        msg.content?.toLowerCase()?.trim() === "ping"
      ) {
        await msg.reply("pong");
      }
    });

    client.on("guildMemberAdd", async (member) => {
      try {
        if (!channel) {
          logger.error(`Alert channel for ${botName} not found`);
          return;
        }
        const message = `${member.user.tag} joined ${member.guild.name}`;
        await channel.send(message);
      } catch (error) {
        logger.error(`Error sending join alert to ${botName}: ${error}`);
      }
    });

    client.login(token).catch((error) => {
      logger.error(`Error logging in bot with name ${botName}`, error);
    });

    return client;
  } catch (error) {
    logger.error(`Error initializing bot with name ${botName}: `, error);
  }
};

/**
 * @typedef {object} CreateClientOptions
 * @property {string} botName
 * @property {string} token
 * @property {string} alertChannelId
 */
