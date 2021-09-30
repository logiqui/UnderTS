import { CommandInteraction, MessageAttachment } from 'discord.js'
import { inspect } from 'util'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Ping extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'eval',
      description: 'Eval command',
      devOnly: true,
      options: [
        {
          name: 'code',
          description: 'O código que você deseja testar.',
          type: 'STRING',
          required: true
        }
      ]
    })
  }

  run = async (interaction: CommandInteraction) => {
    let code = interaction.options.getString('code', true)
    code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    let evaled

    try {
      const start = process.hrtime()
      evaled = eval(`(async () => { ${code} })()`)

      if (evaled instanceof Promise) evaled = await evaled

      const stop = process.hrtime(start)
      const res = `**Output:** \`\`\`js\n${clean(this.client, inspect(evaled, { depth: 0 }))}\n\`\`\`\n**Time Taken:** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms\`\`\``

      if (res.length < 2000)
        await interaction.reply({ content: res, ephemeral: true })
      else {
        const output = new MessageAttachment(Buffer.from(res), 'output.txt')
        await interaction.reply({ files: [output], ephemeral: true })
      }
    } catch (e: any) {
      await interaction.reply({ content: `**Error:** \`\`\`xl\n${clean(this.client, e)}\n\`\`\``, ephemeral: true })
    }
  }
}

function clean(client: Under, text: string) {
  if (typeof text === 'string') {
    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(new RegExp(client.config.token, 'gi'), '****')
  }

  return text
}
