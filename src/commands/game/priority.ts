import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Priority extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'priority',
      description: 'Adicionar/Remover/Ver prioridade de um player',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'add',
          description: 'Adiciona prioridade para player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            },
            {
              name: 'steam',
              description: 'Steam (sem o `steam:`)',
              type: 'STRING',
              required: true
            },
            {
              name: 'lvl',
              description: 'Nível de Prioridade',
              type: 'INTEGER',
              required: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove prioridade para player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true,

            }
          ]
        },
        {
          name: 'get',
          description: 'Verifica se o player tem prioridade',
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
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'add') {
      const steam = interaction.options.getString('steam', true)
      const priority = interaction.options.getInteger('lvl', true)

      const hasPriority = await this.client.db.vrp_priority.findUnique({ where: { user_id: playerId } })
      if (hasPriority) {
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Status:** Este player já possui prioridade na fila`)

        return await interaction.reply({ embeds: [embed], ephemeral: true })
      }

      await this.client.db.vrp_priority.create({
        data: {
          user_id: playerId,
          steam: `steam:${steam}`,
          priority: priority
        }
      })

      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Steam:** ${steam}
                        **Prioridade:** ${priority}
                        **Status:** Prioridade adicionada com sucesso`)

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'remove') {
      const hasPriority = await this.client.db.vrp_priority.findUnique({ where: { user_id: playerId } })
      if (!hasPriority) {
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Status:** Este player não possui prioridade na fila`)

        return await interaction.reply({ embeds: [embed], ephemeral: true })
      }

      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Steam:** ${hasPriority.steam}
                        **Prioridade:** ${hasPriority.priority}
                        **Status:** Prioridade removida com sucesso`)

      await this.client.db.vrp_priority.delete({ where: { user_id: playerId } })
      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'get') {
      const player = await this.client.db.vrp_priority.findUnique({ where: { user_id: playerId } })
      if (!player) {
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Status:** Este player não tem prioridade na fila`)

        return await interaction.reply({ embeds: [embed], ephemeral: true })
      }

      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Steam:** ${player?.steam}
                        **Prioridade:** ${player?.priority}
                        **Status:** Verificação efetuada com sucesso`)

      return await interaction.reply({ embeds: [embed] })
    }
  }
}
