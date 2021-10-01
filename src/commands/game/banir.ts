import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Banir extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'gameban',
      description: 'Adicionar/Remover banimento',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'add',
          description: 'Adiciona banimento em um player',
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
          description: 'Remove banimento de um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
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
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
          { name: `Status: `, value: `\`\`\`Não existe no banco de dados.\`\`\`` }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'add') {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { banned: true }
      })

      const embed = new MessageEmbed()
        .setTitle(`**__Sitema de banimentos In-game__**`)
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
          { name: `Status: `, value: `\`\`\`Banimento adicionado com sucesso.\`\`\`` }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'remove') {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { banned: false }
      })

      const embed = new MessageEmbed()
        .setTitle(`**__Sitema de banimentos In-game__**`)
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
          { name: `Status: `, value: `\`\`\`Banimento removido com sucesso.\`\`\`` }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }
  }
}
