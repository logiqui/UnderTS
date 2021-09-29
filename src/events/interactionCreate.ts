import { CommandInteraction, Interaction } from 'discord.js'
import Under from '../Under'
import Event from '../structures/Event'

export default class InteractionCreate extends Event {
  constructor(client: Under) {
    super(client, {
      name: 'interactionCreate'
    })
  }

  run = (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const command = this.client.commands.find(c => c.name === interaction.commandName)
      if (command) command.run(interaction)
    }
  }
}
