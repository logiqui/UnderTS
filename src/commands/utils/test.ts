import { CommandInteraction } from "discord.js";

import Under from "../../Under";
import Command from "../../structures/Command";

export default class Test extends Command {
  constructor(client: Under) {
    super(client, {
      name: "test",
      description: "test command",
      roles: ["892218589115977739"],
    });
  }

  run = async (interaction: CommandInteraction) => {};
}
