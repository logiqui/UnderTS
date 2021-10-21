import {
  ApplicationCommandOptionData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  PermissionString,
} from "discord.js";
import Under from "../Under";

type CommandOptions = {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  devOnly?: boolean;
  perms?: PermissionString[];
  permissions?: ApplicationCommandPermissionData[];
  roles?: string[];
};

export default class Command {
  client: Under;
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  devOnly?: boolean;
  perms?: PermissionString[];
  permissions?: ApplicationCommandPermissionData[];
  roles?: string[];
  run: Function;

  constructor(client: Under, options: CommandOptions) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.options = options.options;
    this.devOnly = options.devOnly;
    this.perms = options.perms;
    this.roles = options.roles;
    this.permissions = options.permissions;

    this.run = async (client: Under, interaction: CommandInteraction) => {};
  }
}
