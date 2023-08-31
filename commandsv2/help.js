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
        .setLabel("🗒️ Docs")
        .setURL("https://zero2sixty.app/commands"),
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
        If you need anymore help, make sure to check out the docs by clicking the "docs" button\n
        We're doing a Live Q&A at 500 servers! Make sure to ask questions and get answers to anything!\n
        [YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)\n
        To get started, choose an option from the menu.\n
        Invite the bot to your server by using this [link.](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=321600&scope=bot%20applications.commands)\n
        \`Command Example\`\n
        [Support Server](https://discord.gg/5j8SYkrf4z)\n
        *Need some extra cash? Join the support server for many more options for earning cash including a multiplier for running commands in the server, QOTD with prizes, regular giveaways, and more!*
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
            **bal - Check your balance of all your currency, barn maps, and more**\n
            **bal convert - Convert your bounty to cash to avoid the cops**\n
            **barn - Search for barn finds, these are restorable cars**\n
            **race - Race your car in multiple races**\n
            **blackmarket - View cars that are only on the black market**\n
            **boost - Claim your boost earnings for boosting the community server**\n
            **buy - Buy a car, item, house, etc**\n
            **charge - Charge an EV**\n
            **choose - Choose a car from a squad after beating it**\n
            **code - Claim a code**\n
            **convertbm - Convert barn maps**\n
            **crew - View crew options**\n
            **daily - Claim your daily cash**\n
            **dealership - View the car dealership**\n
          `);
          pageEmbed.setColor(colors.blue);
          break;
        }
        case "page_2": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            **editprofile - Edit your profile**\n
            **events - View current events**\n
            **exchange - Exchange gold for other currency**\n
            **fuse - Fuse T4 parts to make T5 parts**\n
            **garage - View your cars, parts, and items**\n
            **gold - View gold and its pricing**\n
            **houses - View listings for houses, and warehouses**\n
            **ids select - Select a car to a custom ID**\n
            **ids deselect - Deselect an ID**\n
            **install - Install fuse parts onto your car that'll give it more variety**\n
            **uninstall - Uninstall fuse parts from your car, make sure to put the fuse part name, like dualturbo**\n
            **fuseparts - View the fuse parts on your car**\n
            **imports - View exclusive car import crates**\n
            **invite - Invite the bot to your server**\n
            **itemshop - View the daily rotational item shop**\n
            **junkyard - Find parts to restore your barn finds**\n
            **leaderboard - View the global leaderboards (WIP)**\n
          `);
          break;
        }
        case "page_3": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            **livery submit - Submit a livery to a car for approval**\n
            **livery list - View liveries for a specific car**\n
            **livery view - View a specific livery**\n
            **open - Open a crate for profile customization items**\n
            **parts - View the available car upgrades to purchase**\n
            **prestige - Prestige your rank when you feel ready**\n
            **privacypolicy** - View the privacy policy\n
            **profile - View your profile**\n
            **races - View all of the race types and their rewards**\n
            **rank - Check your rank**\n
            **restore - Restore a barn find**\n
            **reward - Claim a crew season reward, or a season reward**\n
            **season - View the current season**\n
          `);
          break;
        }
        case "page_4": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            **sell - Sell an item, or car**\n
            **showcase - Showcase a car in your garage**\n
            **squad - View a squads information**\n
            **start - Start the bot**\n
            **stats - View the stats of a car, or part**\n
            **superwheelspin - Spin the super wheel for prizes**\n
            **tasks - View your daily and weekly tasks**\n
            **trade - Trade another user**\n
            **unbox - Unbox an import crate**\n
            **updatelog - Check recent updates**\n
            **upgrade - Upgrade your car**\n
            **use - Use an item**\n
            **vote - Upvote the bot for rewards**\n
            **weekly - Claim weekly cash**\n
            **wheelspin - Spin the wheel for prizes**\n
            **work - Work your job**\n
          `);
          break;
        }
        case "page_h": {
          pageEmbed = new EmbedBuilder();
          pageEmbed.setColor(colors.blue);
          pageEmbed.setDescription(`
            **start - Start the game and its interactive tutorial**\n
            **bal - View the balances of your currencies**\n
            **buy - Buy a car, part, item, house, etc**\n
            **daily - Claim your daily cash**\n
            **garage - View your cars, parts, and items**\n
            **stats - View stats of cars and parts**\n
            **race - Race your car in numerous races**\n
            **races - View all the current race modes**\n
            **upgrade - Upgrade parts on your car**\n
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

            Now that you've got the car you want to restore, its time to find parts for that car. You can find parts with \`/junkyard\` (TIP: If you have the **mechanic** business, you'll get 1 more part per junkyard run!)

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
        await i.update({
          embeds: [embed],
          components: [row2, row],
        });
      }
    });
  },
};
