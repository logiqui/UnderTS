import { Client, ClientOptions, Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

import Config from "../config.json";
import Command from "./structures/Command";
import Event from "./structures/Event";
import Utils from "./structures/Utils";

import { PrismaClient } from "@prisma/client";

export default class Under extends Client {
  commands: Collection<string, Command>;
  events: Collection<string, Event>;
  config: typeof Config;
  utils: Utils;
  db: PrismaClient;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection();
    this.events = new Collection();
    this.utils = new Utils();
    this.db = new PrismaClient();
    this.config = Config;

    this.loadCommands();
    this.loadEvents();
  }

  registryCommands() {
    const guildCommands = toApplicationCommand(this.commands);
    this.guilds.cache.get("840070720275873812")?.commands.set(guildCommands);
  }

  loadCommands(path: string = "dist/src/commands") {
    const categories = readdirSync(join(process.cwd(), path));

    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`).filter((file) =>
        file.endsWith(".js")
      );

      for (const command of commands) {
        const commandClass = require(join(
          process.cwd(),
          `${path}/${category}/${command}`
        )).default;
        const handler = new commandClass(this);

        this.commands.set(handler.name, handler);
      }
    }
  }

  loadEvents(path: string = "dist/src/events") {
    const events = readdirSync(path).filter((file) => file.endsWith(".js"));

    for (const event of events) {
      const eventClass = require(join(
        process.cwd(),
        `${path}/${event}`
      )).default;
      const handler = new eventClass(this);

      this.events.set(handler.name, handler);
      this.on(handler.name, handler.run);
    }
  }

  init(token?: string) {
    super.login(process.env.TOKEN || token);
    return this;
  }
}

function toApplicationCommand(collection: Collection<string, Command>) {
  return collection.map((s) => {
    return { name: s.name, description: s.description, options: s.options };
  });
}
