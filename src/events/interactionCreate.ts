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
        return await this.client.utils.quickError(interaction, `Você não tem as seguintes permissões: ${await this.client.utils.missingPermissions(member!, command.perms)}.`);
      }

      if (command) await command.run(interaction)
    }
  }
}
