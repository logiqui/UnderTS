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
        },
        {
          name: 'punishment',
          description: 'Punição',
          type: 'STRING',
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const target = interaction.options.getUser('user', true)
    const reason = interaction.options.getString('reason', true)
    const punishment = interaction.options.getString('punishment', true)

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
      .setTitle('**PUNIÇÃO**')
      .setDescription(`**Player:** ${memberTarget}
                      **Motivo:** ${reason}
                      **Punição:** ${punishment}
                      \n**Caso você ache que punição foi aplicada incorretamente abra um ticket para contestar a mesma.**`)
      .setTimestamp()
      .setColor('DARK_BLUE')
      .setFooter('Under Evolution', interaction.guild?.iconURL({ dynamic: true })!)
      .setThumbnail('https://cdn.discordapp.com/attachments/541115401837346827/893611729865539614/a_9a8ca1be1fd4b3f022ab426e9a0f06bc.gif')

    return await interaction.reply({ embeds: [embed] })
  }
}
