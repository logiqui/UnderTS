import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Money extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'group',
      description: 'Adicionar/Remover/Ver os grupos de um player',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'add',
          description: 'Adiciona grupo em um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            },
            {
              name: 'group',
              description: 'Grupo desejado',
              type: 'STRING',
              required: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove grupo de um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true,

            },
            {
              name: 'group',
              description: 'Grupo desejado',
              type: 'STRING',
              required: true
            }
          ]
        },
        {
          name: 'get',
          description: 'Ver grupos de um player',
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

    const user = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (user) {
      if (interaction.options.getSubcommand(true) === 'add') {
        const group = interaction.options.getString('group', true)

        const groups = JSON.parse(userId?.groups!)
        const groupExists = this.client.config.groups.includes(group!)
        if (!groupExists) {
          const embed = new MessageEmbed()
            .setColor(`DARK_BLUE`)
            .setDescription(`**ID:** ${playerId}
                            **Status:** O grupo \`\`${group}\`\` não existe`)

          return await interaction.reply({ embeds: [embed] })
        }

        if (!groups[group!]) {
          groups[group!] = true

          await this.client.db.vrp_users.update({ where: { id: playerId }, data: { groups: JSON.stringify(groups) } })
          const embed = new MessageEmbed()
            .setColor(`DARK_BLUE`)
            .setDescription(`**ID:** ${playerId}
                            **Grupo Adicionado:** ${group}
                            **Grupos Atuais:** ${JSON.stringify(groups)}
                            **Status:** Adicionado com sucesso`)

          return await interaction.reply({ embeds: [embed] })
        }

        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Status:** Este player já possui o grupo \`\`${group}\`\``)

        return await interaction.reply({ embeds: [embed] })
      }

      if (interaction.options.getSubcommand(true) === 'remove') {
        const group = interaction.options.getString('group', true)

        const groups = JSON.parse(userId?.groups!)
        const groupExists = this.client.config.groups.includes(group!)
        if (!groupExists) {
          const embed = new MessageEmbed()
            .setColor(`DARK_BLUE`)
            .setDescription(`**ID:** ${playerId}
                            **Status:** O grupo \`\`${group}\`\` não existe`)

          return await interaction.reply({ embeds: [embed] })
        }

        if (groups[group!]) {
          delete groups[group!]

          await this.client.db.vrp_users.update({ where: { id: playerId }, data: { groups: JSON.stringify(groups) } })
          const embed = new MessageEmbed()
            .setColor(`DARK_BLUE`)
            .setDescription(`**ID:** ${playerId}
                            **Grupo Removido:** ${group}
                            **Grupos Atuais:** ${JSON.stringify(groups)}
                            **Status:** Removido com sucesso`)

          return await interaction.reply({ embeds: [embed] })
        }

        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Status:** O player não possui este grupo \`\`${group}\`\``)

        return await interaction.reply({ embeds: [embed] })
      }

      if (interaction.options.getSubcommand(true) === 'get') {
        const player = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })

        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Grupos Atuais:** ${JSON.stringify(player?.groups)}
                          **Status:** Checagem efetuada com sucesso`)

        return await interaction.reply({ embeds: [embed] })
      }
    }
  }
}
