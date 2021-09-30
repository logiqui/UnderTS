import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Ping extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'addban',
      description: 'Adicona um banimento no ID',
      perms: ['SEND_MESSAGES', 'EMBED_LINKS'],
      options: [
        {
          name: 'id',
          description: 'ID que você deseja banir.',
          type: 'INTEGER',
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger('id', true)

    const user = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!user) {
      const embed = new MessageEmbed()
        .addFields(
          { name: `**ID: **`, value: `\`\`\`fix\n ${playerId}\`\`\`` },
          { name: `**Status: **`, value: `\`\`\`Não existe no banco de dados.\`\`\`` }
        )
        .setColor(`#FF0000`)
        .setTimestamp()
        .setFooter(`© Under Evolution`, interaction.guild?.iconURL()!)

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (!user.banned) {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { banned: true }
      })
    }
  }
}
