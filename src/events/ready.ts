import Under from '../Under'
import Event from '../structures/Event'

import box from 'box-console'
import chalk from 'chalk'

export default class InteractionCreate extends Event {
  constructor(client: Under) {
    super(client, {
      name: 'ready'
    })
  }

  run = (client: Under, ...args: any[]) => {
    box([
      `Eu sou ${chalk.yellow(this.client.user?.tag)} e fui iniciado com o ID: ${chalk.yellow(this.client.user?.id)}`,
      `O Bot foi iniciado com ${chalk.yellow(this.client.users.cache.size)} usuarios em ${chalk.yellow(this.client.guilds.cache.size)} servidores`,
      `Foram carregados um total de ${chalk.yellow(this.client.commands.size)} comandos.`,
    ])

    this.client.registryCommands()
  }
}
