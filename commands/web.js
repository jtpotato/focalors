const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("web")
    .setDescription("Series of commands for Web competitions")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start a Web competition and open submissions")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("submit")
        .setDescription("Submit your Google Lighthouse files.")
        .addStringOption((option) =>
          option
            .setName("weburl")
            .setDescription("Web URL for submission")
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("lighthousemobile")
            .setDescription("Google Lighthouse Mobile Results")
            .setRequired(true)
        )

        .addAttachmentOption((option) =>
          option
            .setName("lighthousedesktop")
            .setDescription("Google Lighthouse Desktop Results")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (interaction.options.getSubcommand() == "start") {
      await interaction.reply("Web competition started!");
    }
    if (interaction.options.getSubcommand() == "submit") {
      await interaction.reply({
        content:
          "Thank you for your submission. You may update it at any time by running this command again.",
        ephermeral: true,
      });
      const lighthouseMobileURL =
        interaction.options.getAttachment("lighthousemobile").url;
        const lighthouseDesktopURL = interaction.options.getAttachment("lighthousedesktop").url;
        const parseLighthouseResults = require("../parseLighthouseResults")
        parseLighthouseResults.parse(lighthouseMobileURL, lighthouseDesktopURL)
    }
  },
};
