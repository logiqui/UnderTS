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
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
          { name: `Status: `, value: `\`\`\`Não existe no banco de dados.\`\`\`` }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }

    const identity = await this.client.db.vrp_user_identities.findUnique({ where: { user_id: playerId } })
    if (identity) {
      const embed = new MessageEmbed()
        .setTitle(`**__Sitema de verificação de Registro__**`)
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\``, inline: true },
          { name: `Nome: `, value: `\`\`\`${identity.name}\`\`\``, inline: true },
          { name: `Sobrenome: `, value: `\`\`\`${identity.secondname}\`\`\``, inline: true },
          { name: `Rg: `, value: `\`\`\`${identity.registration}\`\`\``, inline: true },
          { name: `Telefone: `, value: `\`\`\`${identity.phone}\`\`\``, inline: true },
          { name: `Idade: `, value: `\`\`\`${identity.age}\`\`\``, inline: true }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    } else {
      const embed = new MessageEmbed()
        .setTitle(`**__Sitema de verificação de Registro__**`)
        .setFields(
          { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\``, inline: true },
          { name: `Status: `, value: `\`\`\`Registro não encontrado\`\`\``, inline: true }
        )
        .setColor(`DARK_BLUE`)
        .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
        .setTimestamp()

      return await interaction.reply({ embeds: [embed] })
    }
  }
}
