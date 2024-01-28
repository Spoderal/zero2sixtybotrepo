

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const lodash = require("lodash");
const petdb = require("../data/pets.json");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pet")
    .setDescription("View your pet"),
  async execute(interaction) {
    let userdata = await User.findOne({ id: interaction.user.id });
    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);
    let personalities = [
      "is currently shy",
      "is currently joyful",
      "is currently calm",
      "is currently bored",
      "wants to go for a drive",
      "is currently gentle",
      "is currently serious",
      "is currently sassy",
      "is currently lonely",
      "is currently relaxed",
      "is currently amazed",
      "has the need for speed",
    ];
    let personality = lodash.sample(personalities);
    let pet = userdata.newpet;
    if (pet == null || !pet || pet == undefined) return interaction.reply(`You don't have a pet!`);
    let hunger = pet.hunger;
    let thirst = pet.thirst;
    let love = pet.love;
    let name = pet.name || "N/A";

    let petimage = petdb[pet.pet].Image;
    let petbreed = petdb[pet.pet].Breed;

    if (love < 75) {
      petimage = petdb[pet.pet].Sad;
    }

    if (love < 50) {
      petimage = petdb[pet.pet].Saddest;
    }
    let tier = petdb[pet.pet].Tier;


    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${petbreed}`, iconURL: petimage })
      .addFields([
        { name: "Name", value: `${name}`, inline: true },
        {
          name: "Status",
          value: `Your pet **${personality}**`,
          inline: true,
        },
        { name: "Hunger", value: `${hunger}`, inline: true },
        { name: "Thirst", value: `${thirst}`, inline: true },
        { name: "Love", value: `${love}`, inline: true },
      ])
      .setDescription(`Can find items up to tier ${tier}`)
      .setThumbnail(petimage)
      .setColor(colors.blue);

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Love")
        .setEmoji("💖")
        .setCustomId("love")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Water")
        .setEmoji("💧")
        .setCustomId("water")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Feed")
        .setEmoji("🥘")
        .setCustomId("feed")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setLabel("Change Name")
        .setEmoji("📝")
        .setCustomId("name")
        .setStyle("Secondary")
    );

    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Abandon")
        .setEmoji("❌")
        .setCustomId("leave")
        .setStyle("Secondary")
    );

    let msg = await interaction.reply({
      embeds: [embed],
      components: [row, row2],
      fetchReply: true,
    });

    let filter = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };

    let collector = msg.createMessageComponentCollector({
      filter: filter,
    });

    collector.on("collect", async (i) => {
      if (i.customId.includes("love")) {
        let pet = userdata.newpet;
        let hunger = pet.hunger;
        let thirst = pet.thirst;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "newpet.love": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        userdata.save();
        let newlove = await userdata.newpet.love;
        petimage = petdb[pet.pet].Image;
        let embed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${petbreed}`, iconURL: petimage })
          .addFields([
            { name: "Name", value: `${name}`, inline: true },
            {
              name: "Status",
              value: `Your pet **${personality}**`,
              inline: true,
            },
            { name: "Hunger", value: `${hunger}`, inline: true },
            { name: "Thirst", value: `${thirst}`, inline: true },
            { name: "Love", value: `${newlove}`, inline: true },
          ])
          .setThumbnail(petimage)
          .setColor(colors.blue);
        interaction.editReply({
          content: `You pet your ${petbreed}!`,
          embeds: [embed],
        });
      } else if (i.customId.includes("feed")) {
        let pet = userdata.newpet;
        let thirst = pet.thirst;
        let love = pet.love;
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "newpet.hunger": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        if (userdata.cash < 2000)
          return interaction.channel.send("You need $2k to feed your pet!");
        userdata.cash -= 2000;
        let usertasks = userdata.tasks;
        let taskfeed = usertasks.filter((task) => task.ID == "6");
        if (taskfeed[0]) {
          interaction.channel.send("Completed task **Feed your pet**");
          userdata.tasks.pull(taskfeed[0]);
          userdata.cash += 5000;
        }

        userdata.save();
        let newhunger = await userdata.newpet.hunger;

        let embed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${petbreed}`, iconURL: petimage })
          .addFields([
            { name: "Name", value: `${name}`, inline: true },
            {
              name: "Status",
              value: `Your pet **${personality}**`,
              inline: true,
            },
            { name: "Hunger", value: `${newhunger}`, inline: true },
            { name: "Thirst", value: `${thirst}`, inline: true },
            { name: "Love", value: `${love}`, inline: true },
          ])
          .setThumbnail(petimage)
          .setColor(colors.blue);
        interaction.editReply({
          content: `You fed your ${petbreed} costing you $2,000`,
          embeds: [embed],
        });
      } else if (i.customId.includes("water")) {
        let pet = userdata.newpet;
        let hunger = pet.hunger;
        let love = pet.love;

        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $set: {
              "newpet.thirst": 100,
            },
          }
        );
        userdata = await User.findOne({ id: i.user.id });
        userdata.cash -= 500;
        userdata.save();
        let newthirst = await userdata.newpet.thirst;

        let embed = new Discord.EmbedBuilder()
          .setAuthor({ name: `${petbreed}`, iconURL: petimage })
          .addFields([
            { name: "Name", value: `${name}`, inline: true },
            {
              name: "Status",
              value: `Your pet **${personality}**`,
              inline: true,
            },
            { name: "Hunger", value: `${hunger}`, inline: true },
            { name: "Thirst", value: `${newthirst}`, inline: true },
            { name: "Love", value: `${love}`, inline: true },
          ])
          .setThumbnail(petimage)
          .setColor(colors.blue);
        interaction.editReply({
          content: `You gave your ${petbreed} water costing you $500`,
          embeds: [embed],
        });
      } else if (i.customId.includes("name")) {
        let pet = userdata.newpet;
        let hunger = pet.hunger;
        let thirst = pet.thirst;
        let love = pet.love;

        i.channel.send(`Type the name you want to set`);

        const filter2 = (m = Discord.Message) => {
          return m.author.id === interaction.user.id;
        };
        let collector2 = interaction.channel.createMessageCollector({
          filter: filter2,
          max: 1,
          time: 1000 * 20,
        });
        let nametoset;
        collector2.on("collect", async (msg) => {
          nametoset = msg.content;

          let slurs = [
            "nigger",
            "nigga",
            "niger",
            "nig",
            "bitch",
            "fuck",
            "shit",
            "shitter",
            "fag",
            "faggot",
          ];

          const isValidUrl = (urlString) => {
            try {
              return Boolean(new URL(urlString));
            } catch (e) {
              return false;
            }
          };

          if (slurs[nametoset])
            return interaction.channel.send(
              "You cant set your pet name to this word!"
            );

          if (isValidUrl(nametoset))
            return interaction.channel.send("Pet names cant be links!");

          await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "newpet.name": nametoset,
              },
            }
          );
          userdata = await User.findOne({ id: i.user.id });
          userdata.save();

          name = userdata.newpet.name;
          let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `${petbreed}`, iconURL: petimage })
            .addFields([
              { name: "Name", value: `${name}`, inline: true },
              {
                name: "Status",
                value: `Your pet **${personality}**`,
                inline: true,
              },
              { name: "Hunger", value: `${hunger}`, inline: true },
              { name: "Thirst", value: `${thirst}`, inline: true },
              { name: "Love", value: `${love}`, inline: true },
            ])
            .setThumbnail(petimage)
            .setColor(colors.blue);
          interaction.editReply({ content: `You changed your pets name`, embeds: [embed] });
        });
      } else if (i.customId.includes("leave")) {
        await User.findOneAndUpdate(
          {
            id: interaction.user.id,
          },
          {
            $unset: {
              newpet: "",
            },
          }
        );

        interaction.editReply({
          content: `Left your ${petbreed} :(`,
          embeds: [],
          components: [],
        });
      }
    });
  },
};

