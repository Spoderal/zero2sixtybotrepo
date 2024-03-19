

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const {  toCurrency } = require("../common/utils");
const lodash = require("lodash");
const itemdb = require("../data/items.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("itemlist")
    .setDescription("Check the list of items on the bot")
    .addNumberOption((option) => option
    .setName("filter")
    .setDescription("Filter items by tier")
    .setRequired(false)
    .setMaxValue(3)
    .setMinValue(1)
    )
,
  async execute(interaction) {
    let itemlist = [];

    let filter = interaction.options.getNumber("filter")
    await interaction.reply("Please wait...");
  
    let embed = new EmbedBuilder().setTitle("List of items in the game");

      embed.setTitle("List of items in the game");
      for (let item in itemdb) {
        let price = itemdb[item].Price;
        if (price == 0 || !price) {
          price = `**Find Only**` || "**Not Obtainable**";
        } else {
          price = `**${toCurrency(price)}**`;
        }
       
        itemlist.push({
          Name: itemdb[item].Name,
          Emote: itemdb[item].Emote,
          Price: price,
          Tier: itemdb[item].Tier
        });
      }

      if(filter){
        embed.setTitle(`List of tier ${filter} items in the game`);

        itemlist = itemlist.filter((item) => item.Tier == filter)
      }

      itemlist = itemlist.sort(function(a, b){
        if(lodash.isInteger(a.Price) && lodash.isInteger(b.Price)){
            return a.Price - b.Price}
            
        });

        
  

    let displayitems = [];

    for (let dis in itemlist) {
      let car2 = itemlist[dis];
      let price = car2.Price;

      displayitems.push(`${car2.Emote} ${car2.Name} : ${price}`);
    }

    displayitems = lodash.chunk(
        displayitems.map((a) => a),
      10
    );

    let page = 1;

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("first")
        .setEmoji("⏮️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("last")
        .setEmoji("⏭️")
        .setStyle("Secondary")
    );

    embed
      .setDescription(`${displayitems[0].join("\n")}`)
      .setColor(colors.blue)
      .setFooter({ text: `Pages ${page}/${displayitems.length}` });

    let msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    let collector2 = msg.createMessageComponentCollector({
      filter: filter2,
    });

    collector2.on("collect", async (i) => {
      let current = page;
      if (i.customId.includes("previous") && page !== 1) {
        embed.data.fields = null;

        page--;
      } else if (i.customId.includes("next") && page !== displayitems.length) {
        embed.data.fields = null;

        page++;
      } else if (i.customId.includes("first")) {
        embed.data.fields = null;

        page = 1;
      } else if (i.customId.includes("last")) {
        embed.data.fields = null;

        page = displayitems.length;
      }

      if (current !== page) {
        embed.setFooter({ text: `Pages ${page}/${displayitems.length}` });

        embed.setDescription(`${displayitems[page - 1].join("\n")}`);

        await interaction.editReply({
          embeds: [embed],
          fetchReply: true,
        });
      } else {
        return interaction.editReply({ content: "No pages left!" });
      }
    });
  },
};
