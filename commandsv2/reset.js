

const { SlashCommandBuilder } = require("@discordjs/builders");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const User = require("../schema/profile-schema");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { emotes } = require("../common/emotes");
const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Reset your account to start from square one."),

  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let row = new ActionRowBuilder().setComponents(
      new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle("Success")
    );

    let msg = await interaction.reply({
      content: `Are you sure? You'll lose everything and this action is irreversible`,
      fetchReply: true,
      components: [row],
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let collector = msg.createMessageComponentCollector({
      filter: filter,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId == "yes") {
        userdata.deleteOne()
        await interaction.editReply({
        
          fetchReply: true,
          components: [],
          content: "Reset your account successfully",
        });
      }
    });
  },
};
