import { CommandInteraction } from 'discord.js'
import Under from '../../Under'
import Command from '../../structures/Command'

export default class Ping extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'ping',
      description: 'ping server ms v2'
    })
  }

  run = (interaction: CommandInteraction) => {
    interaction.reply({
      content: `O ping do bot é \`${this.client.ws.ping}\`ms.`,
      ephemeral: true
    })
  }
}
