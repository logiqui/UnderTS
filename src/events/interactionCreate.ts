import { Interaction } from 'discord.js'
import Under from '../Under'
import Event from '../structures/Event'

export default class InteractionCreate extends Event {
  constructor(client: Under) {
    super(client, {
      name: 'interactionCreate'
    })
  }

  run = async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const command = this.client.commands.get(interaction.commandName)
      const member = await interaction.guild?.members.fetch(interaction.user.id)

      if (command?.perms && !member?.permissions.has(command.perms, true)) {
        return await this.client.utils.quickError(interaction, `Você precisa das seguintes permissões: ${await this.client.utils.missingPermissions(member!, command.perms)}.`)
      }

      if (command?.devOnly && this.client.config.devs) {
        const devId = this.client.config.devs.includes(interaction.user.id)
        if (!devId) return await this.client.utils.quickError(interaction, `Este comando foi feito para pessoas especiais.`)
      }

      if (command) await command.run(interaction)
    }
  }
}
