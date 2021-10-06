import { CommandInteraction, MessageEmbed } from 'discord.js'

import Under from '../../Under'
import Command from '../../structures/Command'
import moment from 'moment'

export default class Car extends Command {
  constructor(client: Under) {
    super(client, {
      name: 'vehicle',
      description: 'Adicionar/Remover/Ver os carros do player',
      perms: ['ADMINISTRATOR'],
      options: [
        {
          name: 'add',
          description: 'Adiciona carro em um player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true
            },
            {
              name: 'vehicle',
              description: 'Veiculo desejado',
              type: 'STRING',
              required: true
            }
          ]
        },
        {
          name: 'remove',
          description: 'Remove veiculo do player',
          type: 'SUB_COMMAND',
          options: [
            {
              name: 'id',
              description: 'ID desejado',
              type: 'INTEGER',
              required: true,

            },
            {
              name: 'vehicle',
              description: 'Veiculo desejado',
              type: 'STRING',
              required: true
            }
          ]
        },
        {
          name: 'get',
          description: 'Ver carros do player',
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

  getVehicles = async (userId: number) => {
    const vehicles = await this.client.db.vrp_user_vehicles.findMany({
      where: { user_id: userId }
    })

    let vehList: string[] = []
    vehicles.forEach(vehicle => {
      vehList.push(vehicle.vehicle)
    })

    return vehList
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger('id', true)
    const vehicle = interaction.options.getString('vehicle', false)

    const userId = await this.client.db.vrp_users.findUnique({ where: { id: playerId } })
    if (!userId) {
      const embed = new MessageEmbed()
        .setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`)

      return await interaction.reply({ embeds: [embed] })
    }

    const user = await this.client.db.vrp_user_moneys.findUnique({ where: { user_id: playerId } })
    if (user) {
      if (interaction.options.getSubcommand(true) === 'add') {
        await this.client.db.vrp_user_vehicles.create({
          data: {
            user_id: playerId,
            vehicle: vehicle!,
            detido: 0,
            time: '0',
            engine: 1000,
            body: 1000,
            fuel: 100,
            ipva: moment().toString()
          }
        })

        const vehList = await this.getVehicles(playerId)
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Veiculo:** ${vehicle}
                          **Veiculos Atuais:** ${vehList.join(', ')}
                          **Status:** Adicionado com sucesso`)

        return await interaction.reply({ embeds: [embed] })
      }

      if (interaction.options.getSubcommand(true) === 'remove') {
        await this.client.db.vrp_user_vehicles.delete({
          where: {
            user_id_vehicle: {
              user_id: playerId,
              vehicle: vehicle!
            }
          }
        })

        const vehList = await this.getVehicles(playerId)
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Veiculo** ${vehicle}
                          **Veiculos Atuais:** ${vehList.join(', ')}
                          **Status:** Deletado com sucesso`)

        return await interaction.reply({ embeds: [embed] })
      }

      if (interaction.options.getSubcommand(true) === 'get') {
        const vehList = await this.getVehicles(playerId)
        const embed = new MessageEmbed()
          .setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Veiculos:** ${vehList.join(`, `)}`)

        return await interaction.reply({ embeds: [embed] })
      }
    }
  }
}
