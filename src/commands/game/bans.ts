import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Banir extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'bans',
      description: 'Ver todos os banimentos',
      perms: ['ADMINISTRATOR']
    })
  }

  getBans = async () => {
    const ban = await this.client.db.vrp_users.findMany({
      where: { banned: true }
    })

    let banList: number[] = []
    ban.map(user => {
      banList.push(user.id)
    })

    return banList
  }

  run = async (interaction: CommandInteraction) => {
    const bans = await this.getBans()
    if (bans.length <= 0) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**Status:** Nengum Jogador Banido`)

      return await interaction.reply({ embeds: [embed] })
    }

    const embed = new MessageEmbed()
      .setColor(`DARK_BLUE`)
      .setDescription(`**Lista de banidos:** ${bans.join(', ')}
                      **Status:** Verificação efetuada com sucesso`)

    return await interaction.reply({ embeds: [embed] })
  }
}
