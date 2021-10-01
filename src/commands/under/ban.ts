import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Ban extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'ban',
      description: 'Banir um membro do discord',
      perms: ['BAN_MEMBERS'],
      options: [
        {
          name: 'user',
          description: 'Usuário que você deseja banir',
          type: 'USER',
          required: true
        },
        {
          name: 'reason',
          description: 'Motivo do banimento',
          type: 'STRING',
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const target = interaction.options.getUser('user', true)
    const reason = interaction.options.getString('reason', true)

    const memberTarget = await interaction.guild?.members.fetch(target.id)

    if (target.id === interaction.user.id || !memberTarget?.bannable) {
      const embed = new MessageEmbed()
        .setDescription('Você não pode banir esta pessoa')
        .setColor('DARK_BLUE')

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (memberTarget?.permissions.has('ADMINISTRATOR')) {
      const embed = new MessageEmbed()
        .setDescription('Você não pode banir um administrador')
        .setColor('DARK_BLUE')

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if (reason.length > 512) {
      const embed = new MessageEmbed()
        .setDescription('Reação excedeu o limite máximo de caracteres')
        .setColor('DARK_BLUE')

      return await interaction.reply({ embeds: [embed], ephemeral: true })
    }

    memberTarget.ban({ days: 0, reason: reason })

    const embed = new MessageEmbed()
      .setTitle('** :no_entry: Novo Banimento Registrado :no_entry:**')
      .addFields(
        { name: '**Usuário:**', value: `${memberTarget}`, inline: true },
        { name: '**Banido por:**', value: `${interaction.member}`, inline: true },
        { name: '**Motivo:**', value: `${reason}`, inline: true }
      )
      .setTimestamp()
      .setColor('DARK_BLUE')
      .setFooter('Under Evolution', interaction.guild?.iconURL({ dynamic: true })!)
      .setThumbnail("https://media1.tenor.com/images/de413d89fff5502df7cff9f68b24dca5/tenor.gif")

    return await interaction.reply({ embeds: [embed] })
  }
}
