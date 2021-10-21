import { PresenceData } from "discord.js";
import Under from "../Under";
import Event from "../structures/Event";

import box from "box-console";
import chalk from "chalk";

export default class Ready extends Event {
  constructor(client: Under) {
    super(client, {
      name: "ready",
    });
  }

  run = async (client: Under, ...args: any[]) => {
    box([
      `Eu sou ${chalk.yellow(
        this.client.user?.tag
      )} e fui iniciado com o ID: ${chalk.yellow(this.client.user?.id)}`,
      `O Bot foi iniciado com ${chalk.yellow(
        this.client.users.cache.size
      )} usuarios em ${chalk.yellow(this.client.guilds.cache.size)} servidores`,
      `Foram carregados um total de ${chalk.yellow(
        this.client.commands.size
      )} comandos.`,
    ]);

    this.client.user?.setActivity({
      name: `em Under Evoluion`,
      type: "PLAYING",
    });
    this.client.registryCommands();
  };
}
