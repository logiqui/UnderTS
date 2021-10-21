import { CommandInteraction, MessageEmbed } from "discord.js";

import Under from "../../Under";
import Command from "../../structures/Command";

export default class Ban extends Command {
  constructor(client: Under) {
    super(client, {
      name: "unban",
      description: "Desbanir um membro do discord",
      perms: ["BAN_MEMBERS"],
      options: [
        {
          name: "id",
          description: "ID desejado",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  run = async (interaction: CommandInteraction) => {
    const userId = interaction.options.getString("id", true);

    interaction.guild?.members
      .unban(userId)
      .then((user) => {
        const embed = new MessageEmbed()
          .setColor("DARK_BLUE")
          .setDescription("Membro desbanido com sucesso!");

        return interaction.reply({ embeds: [embed], ephemeral: true });
      })
      .catch((e) => {
        const embed = new MessageEmbed()
          .setColor("DARK_BLUE")
          .setDescription("Membro não econtrado, ou já desbanido");

        return interaction.reply({ embeds: [embed], ephemeral: true });
      });
  };
}
