import { Client, ClientOptions } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

import Config from '../config.json'
import Command from './structures/Command'
import Event from './structures/Event'
import Logger from './structures/Logger'

export default class Under extends Client {
  commands: Array<Command>
  events: Array<Event>
  config: typeof Config
  utils: Logger

  constructor(options: ClientOptions) {
    super(options)

    this.commands = []
    this.events = []
    this.config = Config
    this.utils = new Logger()

    this.loadCommands()
    this.loadEvents()
  }

  registryCommands() {
    this.guilds.cache.get('840070720275873812')?.commands.set(this.commands)
  }

  loadCommands(path: string = 'dist/src/commands') {
    const categories = readdirSync(join(process.cwd(), path))

    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`).filter((file) => file.endsWith('.js'))

      for (const command of commands) {
        const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`)).default
        const handler = new commandClass(this)

        this.commands.push(handler)
      }
    }
  }

  loadEvents(path: string = 'dist/src/events') {
    const events = readdirSync(path).filter((file) => file.endsWith('.js'))

    for (const event of events) {
      const eventClass = require(join(process.cwd(), `${path}/${event}`)).default
      const handler = new eventClass(this)

      this.events.push(handler)
      this.on(handler.name, handler.run)
    }
  }

  init(token?: string) {
    super.login(this.config.token || token)
    return this
  }
}
