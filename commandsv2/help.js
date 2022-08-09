const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const colors = require("../common/colors");

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
        .setURL("https://discord.gg/AK3m3CSn58"),
      new ButtonBuilder()
        .setStyle("Link")
        .setLabel("🗒️ Docs")
        .setURL("http://zero2sixty.xyz/docs.html"),
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
        ])
    );

    let embed = new EmbedBuilder();
    embed.setTitle("Help Menu");
    embed.setFooter({ text: "Slash Commands Only" });
    embed.setThumbnail("https://i.ibb.co/6BFf0g6/Logo-Makr-2gur-Vj.png");
    embed.setDescription(`\n\nHere you will find all the help you need to get started with the bot\n
      Run \`/start\` to begin the interactive tutorial that'll help you start the bot
      \nIf you need anymore help, make sure to check out the docs by clicking the "docs" button\n
      We're doing a Live Q&A at 500 servers! Make sure to ask questions and get answers to anything!\n[YouTube tutorial on Zero2Sixty](https://www.youtube.com/watch?v=HA5lm8UImWo&ab_channel=Zero2Sixty)\n
      To get started, choose an option from the menu.\n\nInvite the bot to your server by using this [link.](https://discord.com/api/oauth2/authorize?client_id=932455367777067079&permissions=321600&scope=bot%20applications.commands)\n
      \`Command Example\`\n\n[Support Server](https://discord.gg/5j8SYkrf4z)\n\n*Need some extra cash? Join the support server for many more options for earning cash including a multiplier for running commands in the server, QOTD with prizes, regular giveaways, and more!*`);

    embed.setColor(colors.blue);

    const filter = (interaction) =>
      interaction.isSelectMenu() &&
      interaction.user.id === interaction.user.id &&
      interaction.customId == "select";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 1000 * 30,
    });

    let embed2;

    collector.on("collect", async (collected) => {
      const value = collected.values[0];

      if (value === "page_1") {
        embed2 = new EmbedBuilder();
        embed2.setDescription(`
                  **bal - Check your balance of all your currency, barn maps, and more**\n
                  **bank deposit - Deposit money to your bank for bet racing**\n
                  **bank withdraw - Withdraw money from your bank**\n
                  **barn - Search for barn finds, these are restorable cars**\n
                  **betrace - Race against the odds and race any car in the game**\n
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
        embed2.setColor(colors.blue);
        interaction.editReply({ embeds: [embed2], components: [row2, row] });
      } else if (value === "page_2") {
        embed2 = new EmbedBuilder();
        embed2.setColor(colors.blue);
        embed2.setDescription(`
        **editprofile - Edit your profile**\n
        **events - View current events**\n
        **exchange - Exchange gold for other currency**\n
        **fuse - Fuse T4 parts to make T5 parts**\n
        **garage - View your cars, parts, and items**\n
        **gold - View gold and its pricing**\n
        **houses - View listings for houses, and warehouses**\n
        **ids select - Select a car to a custom ID**\n
        **ids deselect - Deselect an ID**\n
        **imports - View exclusive car import crates**\n
        **invite - Invite the bot to your server**\n
        **itemshop - View the daily rotational item shop**\n
        **junkyard - Find parts to restore your barn finds**\n
            **leaderboard - View the global leaderboards (WIP)**\n
            `);

        interaction.editReply({ embeds: [embed2], components: [row2, row] });
      } else if (value === "page_3") {
        embed2 = new EmbedBuilder();
        embed2.setColor(colors.blue);
        embed2.setDescription(`
            **livery submit - Submit a livery to a car for approval**\n
            **livery list - View liveries for a specific car**\n
            **livery view - View a specific livery**\n
            **open - Open a crate for profile customization items**\n
            **parts - View the available car upgrades to purchase**\n
            **prestige - Prestige your rank when you feel ready**\n
            **privacypolicy** - View the privacy policy\n
            **profile - View your profile**\n
            **racetypes - View all of the race types and their rewards**\n
            **rank - Check your rank**\n
            **remove - Remove a part from your car**\n
            **restore - Restore a barn find**\n
            **reward - Claim a crew season reward, or a season reward**\n
            **season - View the current season**\n
            
            `);

        interaction.editReply({ embeds: [embed2], components: [row2, row] });
      } else if (value === "page_4") {
        embed2 = new EmbedBuilder();
        embed2.setColor(colors.blue);
        embed2.setDescription(`
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
        interaction.editReply({ embeds: [embed2], components: [row2, row] });
      } else if (value === "page_h") {
        embed2 = new EmbedBuilder();
        embed2.setColor(colors.blue);
        embed2.setDescription(`
  **start - Start the game and its interactive tutorial**\n
  **bal - View the balances of your currencies**\n
  **buy - Buy a car, part, item, house, etc**\n
  **daily - Claim your daily cash**\n
  **garage - View your cars, parts, and items**\n
  **stats - View stats of cars and parts**\n
  **racetypes - View all the current race modes**\n
  **upgrade - Upgrade parts on your car**\n
  
  `);
        interaction.editReply({ embeds: [embed2], components: [row2, row] });
      }
    });
  },
};
