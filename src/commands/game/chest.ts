import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Chest extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'chest',
      description: 'Ver bau da facção',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'facção',
          description: 'Nome da facção',
          type: 'STRING',
          required: true
        }
      ]
    })
  }

  getChest = async (name: string) => {
    const chest = await this.client.db.vrp_srv_data.findUnique({ where: { dkey: name } })
    const data = JSON.parse(chest?.dvalue!)
    return data
  }

  displayChest = async (name: string) => {
    const chest = await this.getChest(name)

    let chestArray: string[] = []
    for (const [k, v] of Object.entries<any>(chest)) {
      chestArray.push(`${this.client.utils.formatNumber(v.amount)}x - ${k}`)
    }

    return chestArray
  }

  run = async (interaction: CommandInteraction) => {
    const chestName = interaction.options.getString('facção', true)

    const chestExists = this.client.config.groups.includes(chestName)
    if (!chestExists) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**Chest:** ${chestName}
                        **Status:** Este baú não existe`)

      return await interaction.reply({ embeds: [embed] })
    }

    const chest = await this.displayChest(`chest:${chestName}`)
    const embed = new MessageEmbed()
      .setColor(`DARK_BLUE`)
      .setDescription(`**Bau:** ${chestName}
                      **Itens:** ${chest.join('\n')}\n
                      **Status:** Verificação efetuada com sucesso`)

    return await interaction.reply({ embeds: [embed] })
  }
}
