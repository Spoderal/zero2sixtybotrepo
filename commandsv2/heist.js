const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const { randomRange, toCurrency } = require("../common/utils");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");
const { EmbedBuilder } = require("discord.js");
const heistdb = require("../data/heists.json");
const emotes = require("../common/emotes").emotes;

const colors = require("../common/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("heist")
    .setDescription("Start a heist to rob a big store!")
    .addStringOption((option) =>
      option
        .setDescription("The place to rob")
        .setName("location")
        .setRequired(true)
        .setChoices({ name: "Bank", value: "bank" })
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to rob with")
    ),

  async execute(interaction) {
    let userid = interaction.user.id;
    let user = interaction.user;
    let user2 = interaction.options.getUser("user");
    let location = interaction.options.getString("location");
    let userdata = await User.findOne({ id: userid });
    let cooldowndata = await Cooldowns.findOne({ id: userid });
    let cooldowndatau2 = await Cooldowns.findOne({ id: user2.id });
    let heistcool = cooldowndata.heist;
    let locationindb = heistdb[location.toLowerCase()];
    let timeout = 86400000;
    let itemsrequired = locationindb.items;
    if(user == user2) return interaction.reply("You can't start a heist with yourself!")

    for (let it in itemsrequired) {
      if (!userdata.items.includes(itemsrequired[it]))
        return interaction.reply(
          `You need a ${itemsrequired[it]} to start this heist!`
        );
    }
    let user1ready = false;

    if (user2) {
      let userdata2 = await User.findOne({ id: user2.id });
      for (let it in itemsrequired) {
        if (!userdata2.items.includes(itemsrequired[it]))
          return interaction.reply(
            `Your partner needs a ${itemsrequired[it]} to start this heist!`
          );
      }
    }

    let user1emote = "❌";
    if (user1ready == false) {
      user1emote = "❌";
    }

    let user2ready = false;

    let user2emote = "❌";
    if (user2ready == false) {
      user2emote = "❌";
    }


    let embed = new EmbedBuilder()
      .setTitle(`Waiting to start heist...`)
      .setDescription(`User 1 ready: ${user1emote}`)
      .setColor(colors.blue)
      .setThumbnail(locationindb.image);

    if (user2) {
      embed = new EmbedBuilder()
        .setTitle(`Waiting to start heist...`)
        .setDescription(
          `User 1 ready: ${user1emote}\nUser 2 ready: ${user2emote}`
        )
        .setColor(colors.blue)
        .setThumbnail(locationindb.image);
    }

    let row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Ready 1")
        .setStyle("Success")
        .setCustomId("ready1")
    );

    if (user2) {
      row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Ready 1")
          .setStyle("Success")
          .setCustomId("ready1"),
        new ButtonBuilder()
          .setLabel("Ready 2")
          .setStyle("Danger")
          .setCustomId("ready2")
      );
    }

    let msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      components: [row1],
    });

    let collector2 = msg.createMessageComponentCollector({});

    collector2.on("collect", async (i) => {
      if (i.customId == "ready1" && i.user.id == user.id) {
        row1.components[0].setDisabled(true);
        await msg.edit({ components: [row1], fetchReply: true });
        user1ready = true;
      }
      if (i.customId == "ready2" && i.user.id == user2.id) {
        row1.components[1].setDisabled(true);
        await msg.edit({ components: [row1], fetchReply: true });
        user2ready = true;
      }

      if (user1ready == true && !user2) {
        if (heistcool !== null && timeout - (Date.now() - heistcool) > 0) {
          let time = ms(timeout - (Date.now() - heistcool));
          let timeEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already done a heist today!\n\nRob again in ${time}.`
            );
          await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
          return;
        }

        let chance = 35;
        let mult = 1;
        let userdata2;
        if (user2) {
          let cooldowndata2 = await Cooldowns.findOne({ id: user2.id });
          let heistcool2 = cooldowndata2.heist;
          if (heistcool2 !== null && timeout - (Date.now() - heistcool2) > 0) {
            let time = ms(timeout - (Date.now() - heistcool2));
            let timeEmbed = new EmbedBuilder()
              .setColor(colors.blue)
              .setDescription(
                `${user2} has already done a heist today!\n\nRob again in ${time}.`
              );
            await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
            return;
          }

          chance = 60;
          userdata2 = await User.findOne({ id: user2.id });
          mult = 2;
        }
        let randomCash = randomRange(
          locationindb.payoutrangelow,
          locationindb.payoutrangehigh
        );
        let randomChance = randomRange(1, 100);

        embed
          .setTitle(
            `Starting heist for ${locationindb.emote} ${locationindb.name}`
          )
          .setThumbnail(locationindb.image)
          .setDescription(
            `This ${locationindb.name} has ${toCurrency(
              locationindb.payoutrangehigh
            )} stored\n\nDrilling...`
          )
          .setColor(colors.blue);

        await interaction.editReply({ embeds: [embed], fetchReply: true });

        setTimeout(async () => {
          embed.setDescription(
            `This ${locationindb.name} has ${toCurrency(
              locationindb.payoutrangehigh
            )} stored\n\nOpening Vault...`
          );
          await i.editReply({ embeds: [embed], fetchReply: true });
        }, 3000);

        setTimeout(async () => {
          let split = randomCash / mult;
          if (randomChance <= chance) {
            embed.setDescription(
              `You stole ${toCurrency(
                randomCash
              )}! *If you have another user, you split it*\n\nYou gained ${
                emotes.bounty
              } 500 bounty`
            );
            await i.editReply({ embeds: [embed], fetchReply: true });

            if (user2) {
              let items2 = userdata2.items;
              userdata.cash += split;
              userdata2.cash += split;
              userdata.bounty += 500;
              userdata2.bounty += 500;
              for (var i2 = 0; i2 < 1; i2++)
                items2.splice(items2.indexOf("mask"), 1);
              userdata2.items = items2;

              for (var i = 0; i < 1; i++)
                items2.splice(items2.indexOf("crowbar"), 1);
              userdata2.items = items2;
              userdata2.save();
              cooldowndata.heist = Date.now();
              cooldowndatau2.heist = Date.now();
              cooldowndatau2.save();
            } else {
              let items = userdata.items;
              cooldowndata.heist = Date.now();
              userdata.cash += randomCash;
              userdata.bounty += 500;
              for (var i4 = 0; i4 < 1; i4++)
                items.splice(items.indexOf("mask"), 1);
              userdata.items = items;

              for (var i3 = 0; i3 < 1; i3++)
                items.splice(items.indexOf("crowbar"), 1);
              userdata.items = items;
            }
            cooldowndata.save();
            userdata.save();
          } else {
            embed.setDescription(
              `You failed!\n\nYou gained ${emotes.bounty} 1000 bounty`
            );
            await i.editReply({ embeds: [embed], fetchReply: true });

            if (user2) {
              let items2 = userdata2.items;
              userdata.bounty += 1000;
              userdata2.bounty += 1000;
              cooldowndata.heist = Date.now();

              cooldowndatau2.heist = Date.now();
              cooldowndatau2.save();
              for (var i7 = 0; i7 < 1; i7++)
                items2.splice(items2.indexOf("mask"), 1);
              userdata2.items = items2;

              for (var i8 = 0; i8 < 1; i8++)
                items2.splice(items2.indexOf("crowbar"), 1);
              userdata2.items = items2;
              userdata2.save();
            } else {
              let items = userdata.items;
              cooldowndata.heist = Date.now();
              userdata.bounty += 1000;
              for (var i5 = 0; i5 < 1; i5++)
                items.splice(items.indexOf("mask"), 1);
              userdata.items = items;

              for (var i6 = 0; i6 < 1; i6++)
                items.splice(items.indexOf("crowbar"), 1);
              userdata.items = items;
            }
            cooldowndata.save();
            userdata.save();
          }
        }, 6000);
      } else if (user1ready == true && user2 && user2ready == true) {
        if (heistcool !== null && timeout - (Date.now() - heistcool) > 0) {
          let time = ms(timeout - (Date.now() - heistcool));
          let timeEmbed = new EmbedBuilder()
            .setColor(colors.blue)
            .setDescription(
              `You've already done a heist today!\n\nRob again in ${time}.`
            );
          await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
          return;
        }

        let chance = 35;
        let mult = 1;
        let userdata2;
        if (user2) {
          let cooldowndata2 = await Cooldowns.findOne({ id: user2.id });
          let heistcool2 = cooldowndata2.heist;
          if (heistcool2 !== null && timeout - (Date.now() - heistcool2) > 0) {
            let time = ms(timeout - (Date.now() - heistcool2));
            let timeEmbed = new EmbedBuilder()
              .setColor(colors.blue)
              .setDescription(
                `${user2} has already done a heist today!\n\nRob again in ${time}.`
              );
            await interaction.editReply({ embeds: [timeEmbed], fetchReply: true });
            return;
          }

          chance = 60;
          userdata2 = await User.findOne({ id: user2.id });
          mult = 2;
        }
        let randomCash = randomRange(
          locationindb.payoutrangelow,
          locationindb.payoutrangehigh
        );
        let randomChance = randomRange(1, 100);

        embed
          .setTitle(
            `Starting heist for ${locationindb.emote} ${locationindb.name}`
          )
          .setThumbnail(locationindb.image)
          .setDescription(
            `This ${locationindb.name} has ${toCurrency(
              locationindb.payoutrangehigh
            )} stored\n\nDrilling...`
          )
          .setColor(colors.blue);

        await interaction.editReply({ embeds: [embed], fetchReply: true });

        setTimeout(async () => {
          embed.setDescription(
            `This ${locationindb.name} has ${toCurrency(
              locationindb.payoutrangehigh
            )} stored\n\nOpening Vault...`
          );
          await i.editReply({ embeds: [embed], fetchReply: true });
        }, 3000);

        setTimeout(async () => {
          let split = randomCash / mult;
          if (randomChance <= chance) {
            embed.setDescription(
              `You stole ${toCurrency(
                randomCash
              )}! *If you have another user, you split it*\n\nYou gained ${
                emotes.bounty
              } 500 bounty`
            );
            await i.editReply({ embeds: [embed], fetchReply: true });

            if (user2) {
              userdata.cash += split;
              userdata2.cash += split;
              userdata.bounty += 500;
              userdata2.bounty += 500;
              userdata2.save();
              cooldowndata.heist = Date.now();

              cooldowndatau2.heist = Date.now();
              cooldowndatau2.save();
            } else {
              cooldowndata.heist = Date.now();
              userdata.cash += randomCash;
              userdata.bounty += 500;
            }
            cooldowndata.save();
            userdata.save();
          } else {
            embed.setDescription(
              `You failed!\n\nYou gained ${emotes.bounty} 1000 bounty`
            );
            await i.editReply({ embeds: [embed], fetchReply: true });

            if (user2) {
              userdata.bounty += 1000;
              userdata2.bounty += 1000;
              userdata2.save();
              cooldowndata.heist = Date.now();

              cooldowndatau2.heist = Date.now();
              cooldowndatau2.save();
            } else {
              cooldowndata.heist = Date.now();
              userdata.bounty += 1000;
            }
            cooldowndata.save();
            userdata.save();
          }
        }, 6000);
      }
    });
  },
};
