

const { SlashCommandBuilder } = require("@discordjs/builders");
const { numberWithCommas } = require("../common/utils");
const User = require("../schema/profile-schema");
const cardb = require("../data/cardb.json");
const perkdb = require("../data/perksdb.json").Perks
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const colors = require("../common/colors");
const Cooldowns = require("../schema/cooldowns")
const ms = require("pretty-ms")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perks")
    .setDescription("Do things with perks")
    .addSubcommand((subcommand) => subcommand
    .setName("view")
    .setDescription("View your cars perks")
    .addStringOption((option) => option 
    .setName("car")
    .setDescription("The car to view perks for")
    .setRequired(true)
)

    )
    .addSubcommand((subcommand) => subcommand
    .setName("roll")
    .setDescription("Roll for 2 perks on your car")
    .addStringOption((option) => option 
    .setName("car")
    .setDescription("The car to roll perks for")
    .setRequired(true)
)

    )
    .addSubcommand((subcommand) => subcommand
    .setName("list")
    .setDescription("View the list of perks in the game")
    ),
  
  async execute(interaction) {

    let userdata = await User.findOne({ id: interaction.user.id });
    let cooldowns = await Cooldowns.findOne({ id: interaction.user.id }) || new Cooldowns({ id: interaction.user.id })

    if (!userdata?.id) return await interaction.reply(GET_STARTED_MESSAGE);

    let subcommand = interaction.options.getSubcommand();

    if(subcommand == "view"){
        let car = interaction.options.getString("car");

        let selected = userdata.cars.filter((c) => c.ID.toLowerCase() == car.toLowerCase())[0]

        if(!selected) return await interaction.reply("You dont own that car!");

        let perks = selected.perks

        let perklist = []

        for (const perk in perks) {
            let perkin = perks[perk]
            perklist.push(`${perkdb[perkin.name.toLowerCase()].emote} ${perkdb[perkin.name.toLowerCase()].name} : ${perkin.description}`)
        }

        if(perklist.length == 0) return await interaction.reply("This car has no perks!")

        let carimage = selected.Image || selected.Livery || cardb.Cars[selected.Name.toLowerCase()].Image
        let embed = new EmbedBuilder()
        .setTitle(`Perks for your ${selected.Emote} ${selected.Name}`)
        .setDescription(perklist.join("\n"))
        .setColor(colors.blue)
        .setImage(carimage)
        
        await interaction.reply({embeds: [embed]});
    }
    else if(subcommand == "roll"){
        let perkrollcool = cooldowns.perks
        let timeout = 3600000
        if (perkrollcool !== null && timeout - (Date.now() - perkrollcool) > 0) {
            console.log('false')
            let time = ms(timeout - (Date.now() - perkrollcool));
            let timeEmbed = new EmbedBuilder()
              .setColor(colors.blue)
              .setDescription(
                `You've rolled perks recently!\n\nPlease wait ${time} before rolling again.\nAlternatively, you can pay 50 gold to skip the cooldown.`
              );

              let row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("skipperks")
                .setLabel("Skip cooldown")
                .setStyle("Secondary")
                .setEmoji("🪙")
              )
        let msg =  await interaction.reply({ embeds: [timeEmbed], fetchReply: true, components: [row] });

        let filter = (i) => i.user.id === interaction.user.id;
        let collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (i) => {

            if(i.customId == "skipperks"){
                if(userdata.gold < 50) return await interaction.editReply("You dont have enough gold to skip the cooldown!")
              
                userdata.gold -= 50
                cooldowns.perks = null

                cooldowns.save()
                userdata.save()
          }
          

        })

    }
    else{

        let car = interaction.options.getString("car");

        let selected = userdata.cars.filter((c) => c.ID.toLowerCase() == car.toLowerCase())[0]

        if(!selected) return await interaction.reply("You dont own that car!");

        let perks = selected.perks

        let perklist = []

        for (let perk in perkdb) {
            let perkin = perkdb[perk]
            perklist.push(perkin)
        }

        let rarities = [
            {
                name: 1,
                chance: 40
            },
            {
                name: 2,
                chance: 25
            },
            {
                name: 3,
                chance: 15
            },
            {
                name: 4,
                chance: 15
            },
            {
                name: 5,
                chance: 5
            }
        ]
        let rarities2 = [
            {
                name: 1,
                chance: 40
            },
            {
                name: 2,
                chance: 25
            },
            {
                name: 3,
                chance: 15
            },
            {
                name: 4,
                chance: 15
            },
            {
                name: 5,
                chance: 5
            }
        ]
        let perk1chance = Math.floor(Math.random() * 100)
        let perk2chance = Math.floor(Math.random() * 100)
        console.log(perk1chance)
        console.log(perk2chance)

        if(perk1chance < 5) perk1chance = 5
        if(perk2chance < 5) perk2chance = 5

        let rarity1 = rarities.filter((r) => r.chance <= perk1chance)[0]
        let rarity2 = rarities2.filter((r) => r.chance <= perk2chance)[0]
        console.log(rarity1)
        console.log(rarity2)

        let perk1list = perklist.filter((p) => p.rarity == rarity1.name)
        let perk2list = perklist.filter((p) => p.rarity == rarity2.name)
       
        let perk1 = perk1list[Math.floor(Math.random() * perk1list.length)]
        let perk2 = perk2list[Math.floor(Math.random() * perk2list.length)]


        let perk1name = perk1.name
        let perk2name = perk2.name

        let perk1desc = perk1.description
        let perk2desc = perk2.description

        let perk1emote = perk1.emote
        let perk2emote = perk2.emote

        // cooldowns.perks = Date.now()
        // cooldowns.save()
        

        let embed = new EmbedBuilder()
        .setTitle(`🎲 Rolling perks for your ${selected.Emote} ${selected.Name}...`)
        .setColor(colors.blue)
        await interaction.reply({embeds: [embed], fetchReply: true});

        setTimeout(async () => {
            
            embed = new EmbedBuilder()
           .setTitle(`Rolled perks for your ${selected.Emote} ${selected.Name}`)
           .setDescription(`${perk1emote} ${perk1name} : ${perk1desc}\n${perk2emote} ${perk2name} : ${perk2desc}`)
           .setColor(colors.blue)

           selected.perks = [
                {
                     name: perk1name,
                     description: perk1desc
                },
                {
                     name: perk2name,
                     description: perk2desc
                }
           ]

           await User.findOneAndUpdate(
            {
              id: interaction.user.id,
            },
            {
              $set: {
                "cars.$[car]": selected,
              },
            },
      
            {
              arrayFilters: [
                {
                  "car.Name": selected.Name,
                },
              ],
            }
          );

         await userdata.save()
           
           await interaction.editReply({embeds: [embed]});
            
        }, 2500);
    }

    }
    else if(subcommand == "list"){
        let t1perklist = []
        let t2perklist = []
        let t3perklist = []
        let t4perklist = []
        let t5perklist = []

        for (let perk in perkdb) {
            let perkin = perkdb[perk]
            if(perkin.rarity == 1) {
                t1perklist.push(`${perkin.emote} ${perkin.name} : ${perkin.description}`)

            }
            if(perkin.rarity == 2) {
                t2perklist.push(`${perkin.emote} ${perkin.name} : ${perkin.description}`)

            }
            if(perkin.rarity == 3) {
                t3perklist.push(`${perkin.emote} ${perkin.name} : ${perkin.description}`)

            }
            if(perkin.rarity == 4) {
                t4perklist.push(`${perkin.emote} ${perkin.name} : ${perkin.description}`)

            }
            if(perkin.rarity == 5) {
                t5perklist.push(`${perkin.emote} ${perkin.name} : ${perkin.description}`)

            }
        }
        

        let embed = new EmbedBuilder()
        .setTitle(`Tier 1 Perks in the game`)
        .setDescription(t1perklist.join("\n"))
        .setColor(colors.blue)
    
        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("t1perks")
            .setLabel("Tier 1")
            .setStyle("Secondary")
            .setEmoji("1️⃣"),
            new ButtonBuilder()
            .setCustomId("t2perks")
            .setLabel("Tier 2")
            .setStyle("Secondary")
            .setEmoji("2️⃣"),
            new ButtonBuilder()
            .setCustomId("t3perks")
            .setLabel("Tier 3")
            .setStyle("Secondary")
            .setEmoji("3️⃣"),
            new ButtonBuilder()
            .setCustomId("t4perks")
            .setLabel("Tier 4")
            .setStyle("Secondary")
            .setEmoji("4️⃣"),
            new ButtonBuilder()
            .setCustomId("t5perks")
            .setLabel("Tier 5")
            .setStyle("Secondary")
            .setEmoji("5️⃣")
        )
        
        let msg = await interaction.reply({embeds: [embed], components: [row]});

        let filter = (i) => i.user.id === interaction.user.id;

        let collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (i) => {
            if(i.customId == "t1perks"){
                 embed = new EmbedBuilder()
                .setTitle(`Tier 1 Perks in the game`)
                .setDescription(t1perklist.join("\n"))
                .setColor(colors.blue)
            }
            if(i.customId == "t2perks"){
                 embed = new EmbedBuilder()
                .setTitle(`Tier 2 Perks in the game`)
                .setDescription(t2perklist.join("\n"))
                .setColor(colors.blue)
            }
            if(i.customId == "t3perks"){
                 embed = new EmbedBuilder()
                .setTitle(`Tier 3 Perks in the game`)
                .setDescription(t3perklist.join("\n"))
                .setColor(colors.blue)
            }
            if(i.customId == "t4perks"){
                 embed = new EmbedBuilder()
                .setTitle(`Tier 4 Perks in the game`)
                .setDescription(t4perklist.join("\n"))
                .setColor(colors.blue)
            }
            if(i.customId == "t5perks"){
                 embed = new EmbedBuilder()
                .setTitle(`Tier 5 Perks in the game`)
                .setDescription(t5perklist.join("\n"))
                .setColor(colors.blue)
            }
            await interaction.editReply({embeds: [embed]})
        })
    }
   

    
  },
};
