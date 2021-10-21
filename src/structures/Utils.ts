import { CommandInteraction, GuildMember, PermissionString } from "discord.js";

import moment from "moment";
import chalk from "chalk";

export default class Utils {
  async quickError(interaction: CommandInteraction, message: string) {
    try {
      await interaction.reply({ content: `${message}`, ephemeral: true });
    } catch (e) {
      await interaction
        .followUp({ content: `${message}`, ephemeral: true })
        .catch(() => {
          /* */
        });
    }
  }

  async quickSuccess(interaction: CommandInteraction, message: string) {
    try {
      await interaction.reply({ content: `${message}` });
    } catch (e) {
      await interaction.followUp({ content: `${message}` }).catch(() => {
        /* */
      });
    }
  }

  log(types: "SUCESS" | "ERROR" | "WARNING" | "INFO", message: string) {
    if (types === "SUCESS") {
      console.log(
        `${chalk.gray(`[` + moment().format("HH:mm:ss") + `]`)} ${chalk.green(
          types
        )}: ${message}`
      );
    }

    if (types === "ERROR") {
      console.log(
        `${chalk.gray(`[` + moment().format("HH:mm:ss") + `]`)} ${chalk.red(
          types
        )}: ${message}`
      );
    }

    if (types === "WARNING") {
      console.log(
        `${chalk.gray(`[` + moment().format("HH:mm:ss") + `]`)} ${chalk.yellow(
          types
        )}: ${message}`
      );
    }

    if (types === "INFO") {
      console.log(
        `${chalk.gray(`[` + moment().format("HH:mm:ss") + `]`)} ${chalk.blue(
          types
        )}: ${message}`
      );
    }
  }

  async missingPermissions(member: GuildMember, perms: PermissionString[]) {
    const missingPerms = member.permissions.missing(perms).map(
      (str) =>
        `\`${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
    );

    return missingPerms.length > 1
      ? `${missingPerms.slice(0, -1).join(",  ")} and ${
          missingPerms.slice(-1)[0]
        }`
      : missingPerms[0];
  }

  formatNumber(n: any) {
    var n = n.toString();
    var r = "";
    var x = 0;

    for (var i = n.length; i > 0; i--) {
      r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? "." : "");
      x = x == 2 ? 0 : x + 1;
    }

    return r.split("").reverse().join("");
  }

  formatMoney(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }
}
