import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Rg extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'rg',
      description: 'Ver registros do player',
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
    const playerId = interaction.options.getInteger('id', true)

    const userId = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!userId) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    const identity = await this.client.db.vrp_user_identities.findUnique({ where: { user_id: playerId } })
    if (!identity) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Registro não encontrado`)

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    const embed = new MessageEmbed()
      .setColor(`DARK_BLUE`)
      .setDescription(`**ID:** ${playerId}
                      **Nome:** ${identity.name}
                      **Sobrenome:** ${identity.secondname}
                      **Rg:** ${identity.registration}
                      **Telefone**: ${identity.phone}
                      **Idade:** ${identity.age}
                      **Status:** Verificação efetuada com sucesso`)

    return await interaction.reply({ embeds: [embed] })
  }
}
