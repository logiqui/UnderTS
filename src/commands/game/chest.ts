import { CommandInteraction, MessageEmbed } from "discord.js";

import Under from "../../Under";
import Command from "../../structures/Command";

export default class Chest extends Command {
  constructor(client: Under) {
    super(client, {
      name: "chest",
      description: "Ver bau da facção ou do carro",
      perms: ["ADMINISTRATOR"],
      options: [
        {
          name: "fac",
          description: "Ver bau da facção",
          type: "SUB_COMMAND",
          options: [
            {
              name: "name",
              description: "Nome da facção",
              type: "STRING",
              required: true,
            },
          ],
        },
        {
          name: "veh",
          description: "Ver bau de um carro",
          type: "SUB_COMMAND",
          options: [
            {
              name: "id",
              description: "ID desejado",
              type: "INTEGER",
              required: true,
            },
            {
              name: "name",
              description: "Nome do carro",
              type: "STRING",
              required: true,
            },
          ],
        },
      ],
    });
  }

  getChest = async (name: string) => {
    const chest = await this.client.db.vrp_srv_data.findUnique({
      where: { dkey: name },
    });
    const data = JSON.parse(chest?.dvalue!);
    return data;
  };

  displayChest = async (name: string) => {
    const chest = await this.getChest(name);

    let chestArray: string[] = [];
    for (const [k, v] of Object.entries<any>(chest)) {
      chestArray.push(`${this.client.utils.formatNumber(v.amount)}x - ${k}`);
    }

    return chestArray;
  };

  run = async (interaction: CommandInteraction) => {
    if (interaction.options.getSubcommand(true) === "fac") {
      const chestName = interaction.options.getString("name", true);

      const chestExists = this.client.config.groups.includes(chestName);
      if (!chestExists) {
        const embed = new MessageEmbed().setColor(`DARK_BLUE`)
          .setDescription(`**Chest:** ${chestName}
                          **Status:** Este baú não existe`);

        return await interaction.reply({ embeds: [embed] });
      }

      const chest = await this.displayChest(`chest:${chestName}`);
      const embed = new MessageEmbed().setColor(`DARK_BLUE`)
        .setDescription(`**Bau:** ${chestName}
                        **Itens:** ${chest.join("\n")}\n
                        **Status:** Verificação efetuada com sucesso`);

      return await interaction.reply({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand(true) === "veh") {
      const playerId = interaction.options.getInteger("id", true);
      const vehName = interaction.options.getString("name", true);

      const userId = await this.client.db.vrp_users.findUnique({
        where: { id: playerId },
      });
      if (!userId) {
        const embed = new MessageEmbed().setColor(`DARK_BLUE`)
          .setDescription(`**ID:** ${playerId}
                          **Status:** Não existe no banco de dados`);

        return await interaction.reply({ embeds: [embed] });
      }

      const vehChest = await this.displayChest(
        `chest:u${playerId}veh_${vehName}`
      );
      const embed = new MessageEmbed().setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Vehicle:** ${vehName}
                        **Itens:** ${vehChest.join("\n")}\n
                        **Status:** Verificação efetuada com sucesso`);

      return await interaction.reply({ embeds: [embed] });
    }
  };
}
