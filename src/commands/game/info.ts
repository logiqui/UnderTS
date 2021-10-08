import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Info extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'info',
      description: 'Ver informações do player',
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

  getIdentifiers = async (userId: number) => {
    const info = await this.client.db.vrp_user_identifiers.findMany({
      where: { user_id: userId }
    })

    let identifierList: string[] = []
    info.map(user => {
      identifierList.push(user.identifier)
    })

    return identifierList
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger('id', true)

    const userId = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!userId) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    const identifiers = await this.getIdentifiers(playerId)
    const embed = new MessageEmbed()
      .setColor(`DARK_BLUE`)
      .setDescription(`**ID:** ${playerId}
                      **Identifiers:** ${identifiers.join('\n')}\n
                      **Status:** Verificação efetuada com sucesso`)

    return await interaction.reply({ embeds: [embed] })
  }
}
