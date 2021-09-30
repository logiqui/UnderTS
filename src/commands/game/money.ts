import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Money extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'money',
      description: 'Adicionar/Remover/Ver o dinheiro do player',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'id',
          description: 'Id que deseja alterar',
          type: 'INTEGER',
          required: true
        },
        {
          name: 'action',
          description: 'Ação que será feita ao executar',
          type: 'INTEGER',
          required: false,
          choices: [
            { name: 'add', value: 1 },
            { name: 'remove', value: 2 }
          ]
        },
        {
          name: 'quantity',
          description: 'Quantidade de dinheiro',
          type: 'INTEGER',
          required: false
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger('id', true)
    const action = interaction.options.getInteger('action', false)
    const quantity = interaction.options.getInteger('quantity', false)

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

    const user = await this.client.db.vrp_user_moneys.findUnique({ where: { user_id: playerId } })
    if (user) {
      switch (action!) {
        case 1: //add
          const oldAddMoney = user.bank
          await this.client.db.vrp_user_moneys.update({
            where: { user_id: playerId },
            data: { bank: user.bank! += quantity! }
          })

          const addEmbed = new MessageEmbed()
            .setTitle(`**__Sitema de verificação de dinheiro__**`)
            .setFields(
              { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
              { name: `Banco atual: `, value: `\`\`\`${this.client.utils.formatNumber(user.bank!)}\`\`\`` },
              { name: `Banco antigo: `, value: `\`\`\`${this.client.utils.formatNumber(oldAddMoney!)}\`\`\`` }
            )
            .setColor(`DARK_BLUE`)
            .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
            .setTimestamp()

          await interaction.reply({ embeds: [addEmbed] })
          break

        case 2: //remove
          const oldRemoveMoney = user.bank
          await this.client.db.vrp_user_moneys.update({
            where: { user_id: playerId },
            data: { bank: user.bank! -= quantity! }
          })

          const removeEmbed = new MessageEmbed()
            .setTitle(`**__Sitema de verificação de dinheiro__**`)
            .setFields(
              { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
              { name: `Banco atual: `, value: `\`\`\`${this.client.utils.formatNumber(user.bank!)}\`\`\`` },
              { name: `Banco antigo: `, value: `\`\`\`${this.client.utils.formatNumber(oldRemoveMoney!)}\`\`\`` }
            )
            .setColor(`DARK_BLUE`)
            .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
            .setTimestamp()

          await interaction.reply({ embeds: [removeEmbed] })
          break

        default: //get
          const getEmbed = new MessageEmbed()
            .setTitle(`**__Sitema de verificação de dinheiro__**`)
            .setFields(
              { name: `ID verificado: `, value: `\`\`\`fix\n${playerId}\`\`\`` },
              { name: `Banco atual: `, value: `\`\`\`${this.client.utils.formatNumber(user.bank!)}\`\`\`` }
            )
            .setColor(`DARK_BLUE`)
            .setFooter(`Under Evolution`, interaction.guild?.iconURL({ dynamic: true })!)
            .setTimestamp()

          await interaction.reply({ embeds: [getEmbed] })
          break
      }
    }
  }
}
