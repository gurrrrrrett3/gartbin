import path from "path";
import chalk from "chalk";

const GLOAL_LOG_SETTINGS = {
  // 0 : info, 1 : warn, 2 : error
  channelLogLevel: 1,
  consoleLogLevel: 0,
  fileLogLevel: 0,
  debugEnabled: process.argv.includes("--debug"),
};

export default class Logger {
  public static readonly LOG_FILE = path.resolve("./data/logs/latest.log");

  public static init() {

    // announce that we're in debug mode
    if (GLOAL_LOG_SETTINGS.debugEnabled) {
      console.log(chalk.blue.bold("[DEBUG] ") + chalk.blue("Debug mode enabled"));
    }
  }

  public static debug(method: string, ...message: any[]) {
    if (GLOAL_LOG_SETTINGS.debugEnabled) {
      const col = this.getColor(method);
      console.log(chalk.blue.bold(`[DEBUG]`) + chalk.hex(col).bold(`[${method}] `) + chalk.blue(`${message.join("\n")}`));
    }
  }

  public static log(method: string, ...message: any[]) {
    const col = this.getColor(method);
    if (GLOAL_LOG_SETTINGS.consoleLogLevel === 0)
      console.log(chalk.hex(col).bold(`[${method}] `) + chalk.green(`${message.join("\n")}`));

  }

  public static warn(method: string, ...message: any[]) {
    const col = this.getColor(method);
    if (GLOAL_LOG_SETTINGS.consoleLogLevel <= 1)
      console.warn(chalk.hex(col).bold(`[${method}] `) + chalk.yellow(`${message.join("\n")}`));

  }

  public static error(method: string, ...message: any[]) {
    const col = this.getColor(method);
    if (GLOAL_LOG_SETTINGS.consoleLogLevel <= 2)
      console.error(chalk.hex(col).bold(`[${method}] `) + chalk.red(`${message.join("\n")}`));
    

  }

  public static info = (method: string, ...message: any[]) => Logger.log(method, ...message);

  public static getColor(str: string) {
    // calculate hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // convert to hex
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

}
