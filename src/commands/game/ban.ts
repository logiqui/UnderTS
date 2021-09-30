import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Ban extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'ban',
      description: 'Adicionar/Remover banimento',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'status',
          description: 'Adicionar ou remover banimento',
          type: 'STRING',
          required: true,
          choices: [
            { name: 'add', value: 'addBan' },
            { name: 'remove', value: 'removeBan' },
          ]
        },
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
    const status = interaction.options.getString('status', true)
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

    if (status === 'addBan') {
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

    if (status === 'removeBan') {
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
