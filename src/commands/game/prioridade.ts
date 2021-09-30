import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Prioridade extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'prioridade',
      description: 'Adicionar/Remover prioridade',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'id',
          description: 'Id que deseja alterar',
          type: 'INTEGER',
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {

  }
}
