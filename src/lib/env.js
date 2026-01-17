import { config } from "dotenv";

config({ quiet: true });

export const Env = {
  /**
   *
   * @param {string} value
   * @param {string} defaultValue
   * @returns {string}
   */
  get(value, defaultValue) {
    const envValue = process.env[value];
    if (!envValue) {
      if (defaultValue) {
        return defaultValue;
      } else {
        throw new Error(`Environment variable ${value} not found`);
      }
    }
    return envValue;
  },
};
