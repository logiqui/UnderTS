import { Client, ClientEvents } from 'discord.js';
import Under from '../Under';

declare interface EventOptions {
  name: keyof ClientEvents
}

export default class Event {
  client: Under
  name: string
  run: Function

  constructor(client: Under, options: EventOptions) {
    this.client = client
    this.name = options.name

    this.run = async (client: Under, ...args: any[]) => { }
  }
}
