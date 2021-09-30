import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class WL extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'wl',
      description: 'Adicionar/Remover whitelist',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'status',
          description: 'Adicionar ou remover whitelist',
          type: 'STRING',
          required: true,
          choices: [
            { name: 'add', value: 'addWl' },
            { name: 'remove', value: 'removeWl' },
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

    if (status === 'addWl') {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { whitelisted: true }
      })

      const embed = new MessageEmbed()
        .setTitle(`**__Sitema de whitelist In-game__**`)
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
          { name: `Status: `, value: `\`\`\`Whitelist adicionada com sucesso.\`\`\`` }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }

    if (status === 'removeWl') {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { whitelisted: false }
      })

      const embed = new MessageEmbed()
        .setTitle(`**__Sitema de whitelist In-game__**`)
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
          { name: `Status: `, value: `\`\`\`Whitelist removida com sucesso.\`\`\`` }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }
  }
}
