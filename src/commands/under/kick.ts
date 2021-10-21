import { CommandInteraction, MessageEmbed } from "discord.js";

import Under from "../../Under";
import Command from "../../structures/Command";

export default class Ban extends Command {
  constructor(client: Under) {
    super(client, {
      name: "kick",
      description: "Kickar um membro do discord",
      perms: ["KICK_MEMBERS"],
      options: [
        {
          name: "user",
          description: "Usuário que você deseja banir",
          type: "USER",
          required: true,
        },
        {
          name: "reason",
          description: "Motivo do banimento",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  run = async (interaction: CommandInteraction) => {
    const target = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);

    const memberTarget = await interaction.guild?.members.fetch(target.id);

    if (target.id === interaction.user.id || !memberTarget?.kickable) {
      const embed = new MessageEmbed()
        .setDescription("Você não pode kickar esta pessoa")
        .setColor("DARK_BLUE");

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (memberTarget?.permissions.has("ADMINISTRATOR")) {
      const embed = new MessageEmbed()
        .setDescription("Você não pode kickar um administrador")
        .setColor("DARK_BLUE");

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    memberTarget.kick(reason);

    const embed = new MessageEmbed()
      .setColor("DARK_BLUE")
      .setTitle("**PUNIÇÃO**").setDescription(`**Player:** ${memberTarget}
                      **Motivo:** ${reason}
                      \n**Caso você ache que punição foi aplicada incorretamente abra um ticket para contestar a mesma.**`);

    return await interaction.reply({ embeds: [embed] });
  };
}
