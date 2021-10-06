import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'

export default class Inventory extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'inventory',
      description: 'Adicionar/Remover/Ver os itens do player',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'add',
          description: 'Adiciona item para um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            },
            {
              name: 'item',
              description: 'Item desejado',
              type: 'STRING',
              required: true
            },
            {
              name: 'quantity',
              description: 'Quantidade desejada',
              type: 'INTEGER',
              required: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove item para um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            },
            {
              name: 'item',
              description: 'Item desejado',
              type: 'STRING',
              required: true
            },
            {
              name: 'quantity',
              description: 'Quantidade desejada',
              type: 'INTEGER',
              required: true
            }
          ]
        },
        {
          name: 'get',
          description: 'Ver inventario do player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            }
          ]
        }
      ]
    })
  }

  getInventory = async (userId: number) => {
    const inventory = await this.client.db.vrp_user_data.findFirst({
      where: {
        user_id: userId,
        dkey: 'vRP:datatable'
      }
    })

    const data = JSON.parse(inventory?.dvalue!)
    return data.inventory
  }

  displayInventory = async (userId: number) => {
    const inventory = await this.client.db.vrp_user_data.findFirst({
      where: {
        user_id: userId,
        dkey: 'vRP:datatable'
      }
    })

    const data = JSON.parse(inventory?.dvalue!)

    let inventoryArray: string[] = []
    for (const [k, v] of Object.entries<any>(data.inventory)) {
      inventoryArray.push(`${this.client.utils.formatMoney(v.amount)}x - ${k}`)
    }

    return inventoryArray
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger('id', true)

    const userId = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!userId) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.options.getSubcommand(true) === 'add') {
      const item = interaction.options.getString('item', true)
      const quantity = interaction.options.getInteger('quantity', true)
      const inventory = await this.getInventory(playerId)

      inventory[item] ? inventory[item].amount += quantity : inventory[item] = { amount: quantity }

    }

    if (interaction.options.getSubcommand(true) === 'get') {
      const inventory = await this.displayInventory(playerId)

      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`** ID:** ${playerId}
                        **Inventario:** ${inventory.join('\n')}\n
                        **Status:** Adicionado com sucesso`)

      return await interaction.reply({ embeds: [embed] })
    }
  }
}
