import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Banir extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'reset',
      description: 'Resetar aparencia do jogador',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'id',
          description: 'ID desejado',
          type: 'INTEGER',
          required: true
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

    await this.client.db.vrp_user_data.deleteMany({
      where: {
        user_id: playerId,
        NOT: {
          dkey: 'vRP:datatable'
        }
      }
    })

    const embed = new MessageEmbed()
      .setColor(`DARK_BLUE`)
      .setDescription(`**ID:** ${playerId}
                      **Status:** Aparência resetada com sucesso`)

    return await interaction.reply({ embeds: [embed] })
  }
}
