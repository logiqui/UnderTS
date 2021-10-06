import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Whitelist extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'wl',
      description: 'Adicionar/Remover whitelist',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'add',
          description: 'Adiciona whitelist em um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove whitelist de um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true,

            }
          ]
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger('id', true)

    const userId = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!userId) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'add') {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { whitelisted: true }
      })

      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Whitelist adicionada com sucesso`)

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'remove') {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { whitelisted: false }
      })

      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Whitelist removida com sucesso`)

      return await interaction.reply({ embeds: [embed] })
    }
  }
}
