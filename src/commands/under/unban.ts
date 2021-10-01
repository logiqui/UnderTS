import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Ban extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'unban',
      description: 'Desbanir um membro do discord',
      perms: ['BAN_MEMBERS'],
      options: [
        {
          name: 'id',
          description: 'ID desejado',
          type: 'STRING',
          required: true
        },
        {
          name: 'reason',
          description: 'Motivo do unban',
          type: 'STRING',
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    const userId = interaction.options.getString('id', true)
    const reason = interaction.options.getString('reason', true)

    interaction.guild?.members.unban(userId).then(user => {
      const embed = new MessageEmbed()
        .setTitle('** :no_entry: Novo Unban Registrado :no_entry:**')
        .addFields(
          { name: '**Usuário:**', value: `${user}`, inline: true },
          { name: '**Desbanido por:**', value: `${interaction.member}`, inline: true },
          { name: '**Motivo:**', value: `${reason}`, inline: true }
        )
        .setTimestamp()
        .setColor('DARK_BLUE')
        .setFooter('Under Evolution', interaction.guild?.iconURL({ dynamic: true })!)
        .setThumbnail("https://i.pinimg.com/originals/a1/1f/a3/a11fa3cdbfd567f934b6c0151c6a6d8b.gif")

      return interaction.reply({ embeds: [embed] })
    }).catch(e => {
      const embed = new MessageEmbed()
        .setDescription('Membro não econtrado, ou já desbanido')
        .setColor('DARK_BLUE')

      return interaction.reply({ embeds: [embed], ephemeral: true })
    })
  }
}
