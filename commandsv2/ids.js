const cars = require("../cardb.json");
const Discord = require("discord.js");
const parts = require("../partsdb.json");
const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ids')
    .setDescription("Manage your ids")
    .addSubcommand((subcommand) => subcommand
    .setName("select")
    .setDescription("Select a car to an ID")
    .addStringOption((option) =>option
    .setName("car")
    .setDescription("The car to set an id to")
    .setRequired(true))
    .addStringOption((option) =>option
    .setName("id")
    .setDescription("The id to set")
    .setRequired(true))
    )
    .addSubcommand((subcommand) => subcommand
    .setName("deselect")
    .setDescription("Deselect an ID")
    .addStringOption((option) =>option
    .setName("id")
    .setDescription("The id to deselect")
    .setRequired(true)
    ))
    ,
    async execute(interaction) {
      const db = require("quick.db")
      
      let option = interaction.options.getSubcommand()        
        
      
        
      
     if(option == "select"){
    let cars = require('../cardb.json')
     let usercars = db.fetch(`cars_${interaction.user.id}`)
    let idtochoose = interaction.options.getString("id")
    let created = db.fetch(`created_${interaction.user.id}`)
    if(!created) return interaction.reply("You haven't started yet! Run \`/start\` to start.")
    let newplayer = db.fetch(`newplayer_${interaction.user.id}`)
    let newplayerstage = db.fetch(`newplayerstage_${interaction.user.id}`)

    if(!usercars) return interaction.reply("You don't own any cars!")
    let selecting = interaction.options.getString("car")
    if(!selecting) return interaction.reply("Specify a car!")
    if(!idtochoose) return interaction.reply("Specify an id! Example: /ids select 1 1995 mazda miata")
    
    
    
    if(!cars.Cars[selecting.toLowerCase()]) return interaction.reply("Thats not a car!")
  
    if(!usercars.includes(selecting.toLowerCase())) return interaction.reply("You don't own that car!")
    if(db.fetch(`selected_${idtochoose}_${interaction.user.id}`) == selecting.toLowerCase()) return interaction.reply("That car is already set to that id! Run /ids Deselect [id] to deselect it")
    if(db.fetch(`selected_${idtochoose}_${interaction.user.id}`)) return interaction.reply("A car is already set to that id! Run /ids Deselect [id] to deselect it")
    if(idtochoose == cars.Cars[selecting.toLowerCase()].Name) return interaction.reply("A car id must be unique! Not the car name.")

    db.set(`selected_${idtochoose}_${interaction.user.id}`, selecting.toLowerCase())
    db.set(`isselected_${cars.Cars[selecting.toLowerCase()].Name}_${interaction.user.id}`, idtochoose)
    let embed = new Discord.MessageEmbed()
    .setTitle("Selected ✅")
    .setDescription(`Selected your **${cars.Cars[selecting.toLowerCase()].Name}** to the ID "${idtochoose}", check with \`/garage cars\``)
    .setColor(`#60b0f4`)
    interaction.reply({embeds: [embed]})

 
      }

      else if(option == "deselect"){
        let usercars = db.fetch(`cars_${interaction.user.id}`);
        let idtochoose = interaction.options.getString("id")
        let selectedids = db.fetch(`selectedids_${interaction.user.id}`);
        if (!usercars) return interaction.reply("You don't own any cars!");
        if(!idtochoose) return interaction.reply("Specify an id!")
        if (!db.fetch(`selected_${idtochoose}_${interaction.user.id}`))
          return interaction.reply(
            `There is no car set to that id! Run /ids select [id] [car] to select it, if you are reselecting a car, here's your old IDs: ${selectedids.join(', ')}`
          );
    
        let selectedcar = db.fetch(`selected_${idtochoose}_${interaction.user.id}`);

        let cartoremove = `${idtochoose} : ${cars.Cars[selectedcar.toLowerCase()].Name}`;
        const filtered = selectedids.filter(e => e !== cartoremove);
        db.set(`selectedids_${interaction.user.id}`, filtered)
        db.delete(`selected_${idtochoose}_${interaction.user.id}`);
        db.delete(`selected_${idtochoose}_${interaction.user.id}`);
        db.delete(`isselected_${cars.Cars[selectedcar.toLowerCase()].Name}_${interaction.user.id}`);
        db.delete(`selected_${cars.Cars[selectedcar.toLowerCase()].Name}_${interaction.user.id}`);
    
        interaction.reply(`You deselected ${idtochoose}`);
      }
      else if(option == "list"){
        let selectedids = db.fetch(`selectedids_${interaction.user.id}`) || []
        if(!selectedids || selectedids.length == 0) return interaction.reply("You don't have any IDs!")

        let embed = new Discord.MessageEmbed()
        .setTitle("Your IDs")
        .setColor('#60b0f4')
        .setDescription(`${selectedids.join('\n')}`)

        interaction.reply({embeds: [embed]})

      }


    }
  
};
