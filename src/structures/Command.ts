import { ApplicationCommandOptionData, CommandInteraction } from 'discord.js';
import Under from '../Under';

declare interface CommandOptions {
  name: string
  description: string,
  options?: ApplicationCommandOptionData[]
}

export default class Command {
  client: Under
  name: string
  description: string
  options?: ApplicationCommandOptionData[]
  run: Function

  constructor(client: Under, options: CommandOptions) {
    this.client = client
    this.name = options.name
    this.description = options.description
    this.options = options.options
    this.run = (client: Under, interaction: CommandInteraction) => { }
  }
}
