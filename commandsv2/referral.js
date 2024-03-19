const {
    ActionRowBuilder,
    EmbedBuilder,
    SelectMenuBuilder,
  } = require("discord.js");
  const { SlashCommandBuilder } = require("@discordjs/builders");
  const colors = require("../common/colors");
  const { emotes } = require("../common/emotes");
  const squads = require("../data/squads.json");
  const { toCurrency } = require("../common/utils");
  const Codes = require("../schema/codes");
  const User = require("../schema/profile-schema");
  


  module.exports = {
    data: new SlashCommandBuilder()
      .setName("refferal")
      .setDescription("Create a referral code for your friends")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("create")
          .setDescription("Create a referral code")

      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("use")
          .setDescription("Use a referral code")
          .addStringOption((option) =>
            option
              .setName("code")
              .setDescription("The code to use")
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand.setName("info").setDescription("Get info about referral codes")
      )
      .addSubcommand((subcommand) =>
      subcommand.setName("view").setDescription("View your referral code and uses")
    ),
    async execute(interaction) {
        let subcommand = interaction.options.getSubcommand();

        if(subcommand === "create") {
            let existingCode = await Codes.findOne({ code: interaction.user.username });
            if(existingCode) {
                return await interaction.reply("This code already exists");
            }
            let userCode = await Codes.findOne({ creator: interaction.user.id });
            if(userCode) {
                return await interaction.reply("You already have a code");
            }
            let newCode = new Codes({
                code: interaction.user.username,
                uses: 0,
                creator: interaction.user.id,
                createdAt: new Date(),
                usedBy: []
            });
            await newCode.save();
            return await interaction.reply(`Referral code ${interaction.user.username} created`);
        }
        else  if(subcommand === "use") {
            let code = interaction.options.getString("code");
            let userdata = await User.findOne({ id: interaction.user.id });
            let existingCode = await Codes.findOne({ code: code });
            if(!existingCode) {
                return await interaction.reply("This code does not exist");
            }
            if(existingCode.creator === interaction.user.id) {
                return await interaction.reply("You cannot use your own code");
            }
            if(existingCode.usedBy.includes(interaction.user.id)) {
                return await interaction.reply("You have already used this code");
            }
            let uses = existingCode.uses;
            let cash2 = 20000;
            if(uses <= 10) {
             cash2 = uses * 20000;
            }
            let userdata2 = await User.findOne({ id: existingCode.creator });
            existingCode.uses++;
            userdata.cash += 10000;
            userdata.save()
            userdata2.cash += cash2;
            userdata2.save();
            existingCode.usedBy.push(interaction.user.id);
            await existingCode.save();
            return await interaction.reply(`Referral code ${code} used`);
     
        }
        else if (subcommand == "info"){
            let codes = await Codes.find({ });
            let embed = new EmbedBuilder()
            .setTitle("Referral Codes")
            .setColor(colors.blue)
            .setDescription(`Referral codes are a way to earn money by inviting your friends to the bot. You can create a code and give it to your friends. When they use it, you will both get $10,000 cash. You can only use a code once. You cannot use your own code. You can only create one code. You can see how many codes have been created with this command.\n\nView your code with \`/referral view\``)
            .addFields({name:"Codes created", value:` ${codes.length}`})
            return await interaction.reply({ embeds: [embed] });
        }
        else if(subcommand == "view"){
            let userCode = await Codes.findOne({ creator: interaction.user.id });
            if(!userCode) {
                return await interaction.reply("You don't have a code");
            }
            let embed = new EmbedBuilder()
            .setTitle("Your Referral Code")
            .setColor(colors.blue)
            .setDescription(`Referral codes can be given to your friends to earn $10K, just use \`/referral use [your code]\`\n\nYour referral code is \`${userCode.code}\`\nYou have ${userCode.uses} uses\nYou've earned ${toCurrency(userCode.uses * 10000)} from your code.`)
            return await interaction.reply({ embeds: [embed] });
        }
    },
  };
  