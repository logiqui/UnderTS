import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction, PermissionString } from 'discord.js';
import Under from '../Under';

declare interface CommandOptions {
  name: string
  description: string,
  options?: ApplicationCommandOptionData[]
  dev?: boolean
  perms?: PermissionString[]
  permissions?: ApplicationCommandPermissionData[]
}

export default class Command {
  client: Under
  name: string
  description: string
  options?: ApplicationCommandOptionData[]
  dev?: boolean
  perms?: PermissionString[]
  permissions?: ApplicationCommandPermissionData[]
  run: Function

  constructor(client: Under, options: CommandOptions) {
    this.client = client
    this.name = options.name
    this.description = options.description
    this.options = options.options
    this.dev = options.dev
    this.perms = options.perms
    this.permissions = options.permissions
    this.run = async (client: Under, interaction: CommandInteraction) => { }
  }
}
