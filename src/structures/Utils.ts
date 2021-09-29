import { CommandInteraction, GuildMember, PermissionString } from 'discord.js'

export default class Utils {
  async quickError(interaction: CommandInteraction, message: string) {
    try {
      await interaction.reply({ content: `${message}`, ephemeral: true })
    } catch (e) {
      await interaction.followUp({ content: `${message}`, ephemeral: true }).catch(() => { /* */ })
    }
  }

  async quickSuccess(interaction: CommandInteraction, message: string) {
    try {
      await interaction.reply({ content: `${message}` })
    } catch (e) {
      await interaction.followUp({ content: `${message}` }).catch(() => { /* */ })
    }
  }

  async log(types: 'SUCESS' | 'ERROR' | 'WARNING' | 'INFO', message: string) {

    if (types === 'SUCESS') {
      console.log(`[${types}] ${message}`)
    }

    if (types === 'ERROR') {
      console.log(`[${types}] ${message}`)
    }

    if (types === 'WARNING') {
      console.log(`[${types}] ${message}`)
    }

    if (types === 'INFO') {
      console.log(`[${types}] ${message}`)
    }
  }

  async missingPermissions(member: GuildMember, perms: PermissionString[]) {
    const missingPerms = member.permissions.missing(perms)
      .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``)

    return missingPerms.length > 1 ?
      `${missingPerms.slice(0, -1).join(',  ')} and ${missingPerms.slice(-1)[0]}` :
      missingPerms[0]
  }
}
