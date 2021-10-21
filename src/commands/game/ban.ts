import { CommandInteraction, MessageEmbed } from "discord.js";

import Under from "../../Under";
import Command from "../../structures/Command";

export default class ban extends Command {
  constructor(client: Under) {
    super(client, {
      name: "ban",
      description: "Adicionar/Remover banimento",
      perms: ["ADMINISTRATOR"],
      options: [
        {
          name: "add",
          description: "Adiciona banimento em um player",
          type: "SUB_COMMAND",
          options: [
            {
              name: "id",
              description: "ID desejado",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description: "Remove banimento de um player",
          type: "SUB_COMMAND",
          options: [
            {
              name: "id",
              description: "ID desejado",
              type: "INTEGER",
              required: true,
            },
          ],
        },
        {
          name: "get",
          description: "Ver se o player está banido",
          type: "SUB_COMMAND",
          options: [
            {
              name: "id",
              description: "ID Desejado",
              type: "INTEGER",
              required: true,
            },
          ],
        },
      ],
    });
  }

  run = async (interaction: CommandInteraction) => {
    const playerId = interaction.options.getInteger("id", true);

    const userId = await this.client.db.vrp_users.findUnique({
      where: { id: playerId },
    });
    if (!userId) {
      const embed = new MessageEmbed().setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Não existe no banco de dados`);

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.options.getSubcommand(true) === "add") {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { banned: true },
      });

      const embed = new MessageEmbed().setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Banimento efetuado com sucesso`);

      return await interaction.reply({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand(true) === "remove") {
      await this.client.db.vrp_users.update({
        where: { id: playerId },
        data: { banned: false },
      });

      const embed = new MessageEmbed().setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Status:** Banimento removido com sucesso`);

      return await interaction.reply({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand(true) === "get") {
      const embed = new MessageEmbed().setColor(`DARK_BLUE`)
        .setDescription(`**ID:** ${playerId}
                        **Banido:** ${userId.banned ? "True" : "False"}
                        **Status:** Verificação efetuada com sucesso`);

      return await interaction.reply({ embeds: [embed] });
    }
  };
}
