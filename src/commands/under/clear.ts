import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Template extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'clear',
      description: 'Template Description',
      perms: ['MANAGE_MESSAGES'],
      options: [
        {
          name: 'amount',
          description: 'Quantidade de mensagens',
          type: 'INTEGER'
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const quantity = interaction.options.getInteger('amount', true)


  }
}
