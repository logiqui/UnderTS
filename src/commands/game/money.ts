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
          name: 'add',
          description: 'Adiciona dinheiro para um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            },
            {
              name: 'quantity',
              description: 'Quantidade de dinheiro',
              type: 'INTEGER',
              required: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove dinheiro para um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true,

            },
            {
              name: 'quantity',
              description: 'Quantidade de dinheiro',
              type: 'INTEGER',
              required: true
            }
          ]
        },
        {
          name: 'get',
          description: 'Ver dinheiro de um player',
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
    const quantity = interaction.options.getInteger('quantity', false)

    const userId = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!userId) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed] })
    }

    const user = await this.client.db.vrp_user_moneys.findUnique({ where: { user_id: playerId } })
    if (user) {
      if (interaction.options.getSubcommand(true) === 'add') {
        const oldAddMoney = user.bank
        await this.client.db.vrp_user_moneys.update({
          where: { user_id: playerId },
          data: { bank: user.bank! += quantity! }
        })

        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Bando Atual:** ${this.client.utils.formatNumber(user.bank!)}
                          **Banco Antigo:** ${this.client.utils.formatNumber(oldAddMoney!)}
                          **Status:** Adicionado com sucesso`)

        return await interaction.reply({ embeds: [embed] })
      }

      if (interaction.options.getSubcommand(true) === 'remove') {
        const oldMoney = user.bank
        await this.client.db.vrp_user_moneys.update({
          where: { user_id: playerId },
          data: { bank: user.bank! -= quantity! }
        })

        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Bando Atual:** ${this.client.utils.formatNumber(user.bank!)}
                          **Banco Antigo:** ${this.client.utils.formatNumber(oldMoney!)}
                          **Status:** Removido com sucesso`)

        return await interaction.reply({ embeds: [embed] })
      }

      if (interaction.options.getSubcommand(true) === 'get') {
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Bando Atual:** ${this.client.utils.formatNumber(user.bank!)}
                          **Status:** Verificação efetuada com sucesso`)

        return await interaction.reply({ embeds: [embed] })
      }
    }
  }
}
