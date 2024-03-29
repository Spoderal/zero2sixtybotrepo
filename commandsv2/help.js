const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");
const achievementdb = require("../data/achievements.json").Achievements;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of commands"),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("👍Vote")
        .setStyle("Link")
        .setURL("https://top.gg/bot/932455367777067079"),
      new ButtonBuilder()
        .setStyle("Link")
        .setLabel("💙 Support Server")
        .setURL("https://discord.gg/5j8SYkrf4z"),
      new ButtonBuilder()
        .setStyle("Link")
        .setLabel("🧡 Patreon")
        .setURL("https://www.patreon.com/zero2sixtybot")
    );

    const row2 = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Nothing selected")
        .addOptions([
          {
            label: "Page 1",
            description: "Page 1 of the commands list",
            value: "page_1",
            customId: "page1",
          },
          {
            label: "Page 2",
            description: "Page 2 of the commands list",
            value: "page_2",
            customId: "page2",
          },
          {
            label: "Page 3",
            description: "Page 3 of the commands list",
            value: "page_3",
            customId: "page3",
          },
          {
            label: "Page 4",
            description: "Page 4 of the commands list",
            value: "page_4",
            customId: "page4",
          },
          {
            label: "Page 5",
            description: "Page 5 of the commands list",
            value: "page_5",
            customId: "page5",
          },
          {
            label: "Beginner Commands",
            description: "Helpful for beginners",
            value: "page_h",
            customId: "pageh",
          },
          {
            label: "Restoring Barn Finds",
            description: "Information on restorations",
            value: "page_r",
            customId: "pager",
          },
        ])
    );

    let embed = new EmbedBuilder()
      .setColor(colors.blue)
      .setTitle("Help Menu")

      .setThumbnail("https://i.ibb.co/6BFf0g6/Logo-Makr-2gur-Vj.png")
      .setDescription(
        `
        Here you will find all the help you need to get started with the bot\n
        Run \`/start\` to begin the interactive tutorial that'll help you start the bot\n
        [YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)\n
        To get started, choose an option from the menu.\n
        Invite the bot to your server by using this [link.](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=321600&scope=bot%20applications.commands)\n
        \`Command Example\`\n
        [Support Server](https://discord.gg/5j8SYkrf4z)\n
        [Voting](https://top.gg/bot/932455367777067079) helps us a lot! Use /vote to vote for us to get a vote crate AND refill all of your cars!\n
        Try running \`/tutorial\` if you get stuck!\n
        *Need some extra cash? Join the support server for many more options for earning cash including QOTD with prizes, regular giveaways, and more!*
        `
      )
      .setFooter({ text: "Slash Commands Only" });

    await interaction.reply({ embeds: [embed], components: [row, row2] });

    const filter = (interaction) =>
      interaction.isSelectMenu() &&
      interaction.user.id === interaction.user.id &&
      interaction.customId == "select";

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });
    let filter2 = (btnInt) => {
      return interaction.user.id === btnInt.user.id;
    };
    const collector2 = interaction.channel.createMessageComponentCollector({
      filter: filter2,
    });

    let pageEmbed;

    collector.on("collect", async (collected) => {
      const value = collected.values[0];

      switch (value) {
        case "page_1": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setDescription(`
            bal - Check your balance of all your currency, barn maps, and more\n
            barn - Search for barn finds, these are restorable cars\n
            blueprint - Open a blueprint and find cars, and parts\n
            buy - Buy a car, item, house, etc\n
            carlist - View all the cars in the game\n
            code - Claim a code\n
            crew - View crew options\n
            daily - Claim your daily cash\n
            dealer cars - View the cars for sale\n
            dealer parts - View the parts for sale\n
            drift - Drift your car\n
            dyno - Test your car on the dyno\n
          `);
          pageEmbed.setColor(colors.blue);
          break;
        }
        case "page_2": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            editprofile - Edit your profile\n
            events - View current events\n
            exchange - Exchange gold for other currency\n
            fuse - Fuse T4 parts to make T5 parts\n
            garage - View your cars, parts, and items\n
            gas - Fill up your car with gas\n
            gold - View gold and its pricing\n
            houses - View listings for houses, and warehouses\n
            ids select - Select a car to a custom ID\n
            ids deselect - Deselect an ID\n
            ids favorite - Favorite a car
          `);
          break;
        }
        case "page_3": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
          imports - View exclusive car import crates\n
          invite - Invite the bot to your server\n
          itemshop - View the daily rotational item shop\n
          itemlist - View all the items in the game\n
          itemshop - View the daily item shop\n
          junkyard - Find parts to restore your barn finds\n
          leaderboard - View the global leaderboards\n
          livery submit - Submit a livery to a car for approval\n
          livery list - View liveries for a specific car\n
          livery view - View a specific livery\n
          market - View the user market\n
          open - Open a crate for profile customization items\n
          `);
          break;
        }
        case "page_4": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
          privacypolicy - View the privacy policy\n
          profile - View your profile\n
          races - View all of the race types and their rewards\n
          rank - Check your rank\n
          remove - Remove a part from your car\n
          restore - Restore a barn find\n
          season - View the current season\n
          sell - Sell an item, or car\n
          showcase - Showcase a car in your garage\n
          squad - View a squads information and race them\n
          start - Start the bot\n
            
          `);
          break;
        }
        case "page_5": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            stats - View the stats of a car, item, or part\n
            superwheelspin - Spin the super wheel for prizes\n
            tasks - View your daily and weekly tasks\n
            trade - Trade another user\n
            tutorial - Run tutorials on the bot\n
            unbox - Unbox an import crate\n
            updatelog - Check recent updates\n
            upgrade - Upgrade your car\n
            use - Use an item\n
            vote - Upvote the bot for rewards\n
            weekly - Claim weekly cash\n
            wheelspin - Spin the wheel for prizes\n
          `);
          break;
        }
        case "page_h": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            start - Start the game and its interactive tutorial\n
            bal - View the balances of your currencies\n
            buy - Buy a car, part, item, house, etc\n
            daily - Claim your daily cash\n
            garage - View your cars, parts, and items\n
            stats - View stats of cars and parts\n
            race - Race your car in numerous races\n
            races - View all the current race modes\n
            upgrade - Upgrade parts on your car\n
          `);
          break;
        }
        case "page_r": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            Restoring barn finds is a complex function on the bot, so we'll dive in and go one step at a time!

            First, you'll want barn finds, which can be received from crates, or racing in drag races!

            Once you have your barn map, you're going to run \`/barn\` and you'll either find a common, rare, or legendary barn find.

            Now that you've got the car you want to restore, its time to find parts for that car. You can find parts with \`/junkyard\`, or junk races!

            Ok, you've got your parts, what do you do? You collect them until you own 1 exhaust, 1 engine, 1 suspension, 1 body, and 1 intake!

            You just need to have them in your inventory so when you've collected them all, run \`/restore\` and now you've got yourself an oldie but a goodie!
          `);
          break;
        }
      }

      await interaction.editReply({
        embeds: [pageEmbed],
        components: [row2, row],
      });
    });
    collector2.on("collect", async (i) => {
      if (i.customId.includes("achievements")) {
        let embed = new EmbedBuilder();
        for (let ach in achievementdb) {
          let achievement = achievementdb[ach];

          embed.setColor(colors.blue);
          embed.addFields({
            name: `${achievement.Emote} ${achievement.Name}`,
            value: `${achievement.Task}`,
          });
        }
        await interaction.editReply({
          embeds: [embed],
          components: [row2, row],
        });
      }
    });
  },
};
