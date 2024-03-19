

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder,
} = require("discord.js");
const User = require("../schema/profile-schema");
const colors = require("../common/colors");
const emotes = require("../common/emotes").emotes;
const Carshow = require("../schema/carshows");
const { toCurrency } = require("../common/utils");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("carshow")
    .setDescription("Create a car show for your server, or friends")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a car show")
      
        .addStringOption((option) =>
        option
          .setName("theme")
          .setDescription("The theme of the tournament")
          .setRequired(true)
      )
        .addNumberOption((option) =>
          option
            .setName("prize")
            .setDescription("The amount of cash to give to the winner")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10000000)
        )
        .addNumberOption((option) =>
          option
            .setName("players")
            .setDescription("The amount of players to allow in the car show")
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(25)
        )
    
    )
    .addSubcommand((subcommand) => subcommand
    .setName("delete")
    .setDescription("Delete a car show")
    .addStringOption((option) => option
    .setName("id")
    .setDescription("The id of the car show you want to delete")
    .setRequired(true)
    )
    
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join")
        .setDescription("Join a car show")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the car show you want to join")
            .setRequired(true)
        )
        .addStringOption((option) => option
        .setName("car")
        .setDescription("The car you want to enter into the car show")
        .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leave")
        .setDescription("Leave a car show")
        .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("The id of the car show you want to join")
          .setRequired(true)
      )
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("view")
      .setDescription("View a car show")
        .addStringOption((option) =>
            option
            .setName("id")
            .setDescription("The id of the car show you want to view")
            .setRequired(true)
        )
        
  )
  .addSubcommand((subcommand) =>
  subcommand
    .setName("list")
    .setDescription("View your car shows")

)
  .addSubcommand((subcommand) =>
  subcommand
    .setName("vote")
    .setDescription("View the cars in a car show and vote for which one you like the most")
      .addStringOption((option) =>
          option
          .setName("id")
          .setDescription("The id of the car show you want to view")
          .setRequired(true)
      )
      
      
)
.addSubcommand((subcommand) =>
subcommand
  .setName("end")
  .setDescription("End a car show")
    .addStringOption((option) =>
        option
        .setName("id")
        .setDescription("The id of the car show you want to end")
        .setRequired(true)
    )
    
    
) ,
  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    let user = interaction.user;

    if(subcommand == "create"){
        let theme = interaction.options.getString("theme");
        let prize = interaction.options.getNumber("prize");
        let players = interaction.options.getNumber("players");

        let ownedamount = await Carshow.find({owner: user.id})

        if(ownedamount.length >= 5){
            return interaction.reply("You can only own 5 car shows at a time");
        }

        console.log("saved")
        const generateId = async () => {
            // Generate a random  id
            const characters = '0123456789';
            let id = '';
            for (let i = 0; i < 6; i++) {
              id += characters.charAt(Math.floor(Math.random() * characters.length));
            }
    
            // Check if the generated id already exists in the database
            const existingCarShow = await Carshow.findOne({ carshowId: id })
            console.log(id)
    
            // If an existing tournament with the same id is found, generate a new id recursively
            if (existingCarShow) {
              return generateId();
            }
            // If no existing tournament is found, return the generated id
            return id;
          };
            let id = await generateId();
        let carshow = new Carshow({
            theme: theme,
            prize: prize,
            players: [],
            carshowId: id,
            owner: user.id,
        });

        if(players){
            carshow.maxPlayers = players;
        }
        await carshow.save();

        
        await interaction.reply(`Car show created with id ${id}`);

    }

    else if(subcommand == "join"){
        let id = interaction.options.getString("id");

        let carid = interaction.options.getString("car");
        let carshow = await Carshow.findOne({carshowId: id})
        if(!carshow){
            return interaction.reply("No car show with that id exists");
        }
        let findplayer = carshow.players.find(player => player.id == user.id)
        if(findplayer){
            return interaction.reply("You are already in this car show");
        }

        if(carshow.maxPlayers && carshow.players.length >= carshow.maxPlayers){
            return interaction.reply("This car show is full");
        }
        let userdata = await User.findOne({id: user.id})

        let carinfo = userdata.cars.filter((car) => car.ID.toLowerCase() == carid.toLowerCase())[0]

        if(!carinfo){
            return interaction.reply("That car does not exist");
        }

        let carshowdata = {
            id: user.id,
            car: carinfo,
            votes: 0
        }

        carshow.players.push(carshowdata);
        await carshow.save();

        await interaction.reply("You have joined the car show");

    }
    else if(subcommand == "list"){
        let carshows = await Carshow.find({owner: user.id})
        if(!carshows){
            return interaction.reply("You do not own any car shows");
        }
        let carshowembed = new EmbedBuilder()
        .setTitle("Your car shows")
        .setColor(colors.blue)
        .setDescription("Use /carshow view to view a car show")
        .setThumbnail("https://i.ibb.co/CWqkrWK/carshowicon.png")
        .setFooter({text: "Use /carshow delete to delete a car show"})

        carshows.forEach((carshow) => {
            carshowembed.addFields({name: carshow.theme, value: `ID: ${carshow.carshowId}`})
        })

        await interaction.reply({embeds: [carshowembed]});

    }
    else if(subcommand == "leave"){
        let id = interaction.options.getString("id");
        let carshow = await Carshow.findOne({carshowId: id})
        if(!carshow){
            return interaction.reply("No car show with that id exists");
        }
        let findplayer = carshow.players.find(player => player.id == user.id)
        if(!findplayer){
            return interaction.reply("You are not in this car show");
        }
        if(carshow.owner == user.id){
            return interaction.reply("You cannot leave your own car show, use /carshow delete to delete the car show");
        }
        carshow.players = carshow.players.filter(player => player.id != user.id);
        await carshow.save();
        await interaction.reply("You have left the car show");
        
    }
    else if(subcommand == "delete"){
        let id = interaction.options.getString("id");
        let carshow = await Carshow.findOne({carshowId: id})
        if(!carshow){
            return interaction.reply("No car show with that id exists");
        }
        if(carshow.owner != user.id){
            return interaction.reply("You are not the owner of this car show");
        }
        await Carshow.findOneAndDelete({carshowId: id});
        await interaction.reply("Car show deleted");

    }
    else if(subcommand == "view"){
        let id = interaction.options.getString("id");
        let carshow = await Carshow.findOne({carshowId: id})
        if(!carshow){
            return interaction.reply("No car show with that id exists");
        }
        let maxMembers = carshow.maxPlayers || "Unlimited";
        let embed = new EmbedBuilder()
        .setTitle(carshow.theme)
        .setDescription(`Prize: ${toCurrency(carshow.prize)}`)
        .setColor(colors.blue)
        .addFields({name: "Members",value:  `${carshow.players.length}`},
        {name: "Max Members", value: `${maxMembers}`},
        {name: "Owner", value: `<@${carshow.owner}>`},
        {name: "ID", value: carshow.carshowId}
        )
        .setThumbnail("https://i.ibb.co/CWqkrWK/carshowicon.png")
        .setFooter({text: "Use /carshow join to join the car show"})

       await interaction.reply({embeds: [embed]});

    }
    else if(subcommand == "vote"){
        let id = interaction.options.getString("id");
        let carshow = await Carshow.findOne({carshowId: id})
        if(!carshow){
            return interaction.reply("No car show with that id exists");
        }
        
        // display cars in the car show by pages
        let page = 0;
        let vispage = 1

        let cars = carshow.players;
        let carlist = cars
        
        let carImage = carlist[0].car.Image || carlist[0].car.Livery || cars.Cars[carlist[0].car.Name.toLowerCase()].Image;
        let carlistembed = new EmbedBuilder()
        .setTitle("Car Show")
        .setDescription(`Theme: ${carshow.theme}`)
        .setColor(colors.blue)
        .setImage(carImage)
        .addFields({name: "Votes", value: `${carlist[0].votes}`}, {name: "Car", value: `**${carlist[0].car.Emote} ${carlist[0].car.Name}**\n${emotes.speed} ${carlist[0].car.Speed}\n${emotes.acceleration} ${carlist[0].car.Acceleration}\n${emotes.handling} ${carlist[0].car.Handling}\n${emotes.weight}${carlist[0].car.WeightStat}`})
        .setFooter({text: `Page ${vispage}/${Math.ceil(cars.length)}`})

        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("previous")
            .setEmoji('⬅️')
            .setStyle("Primary"),
            new ButtonBuilder()
            .setCustomId("next")
            .setEmoji('➡️')
            .setStyle("Primary"),
            new ButtonBuilder()
            .setCustomId("vote")
            .setLabel("Vote")
            .setEmoji('🗳️')
            .setStyle("Primary")

        )


      let msg = await interaction.reply({embeds: [carlistembed], components: [row]});
        let filter = (button) => button.user.id === user.id;
        let collector = msg.createMessageComponentCollector({filter});
        let user2
        collector.on('collect', async (i) => {
            // change page
            if(i.customId == "next"){

                page += 1
                vispage += 1
                console.log(page)
                let carimage = carlist[page].car.Image || carlist[page].car.Livery || cars.Cars[carlist[page].car.Name.toLowerCase()].Image;
                console.log(carlist)
                carlistembed.setImage(carimage)
                .setFooter({text: `Page ${vispage}/${Math.ceil(cars.length)}`})
                .setFields({name: "Votes", value: `${carlist[ page].votes}`}, {name: "Car", value: `**${carlist[page].car.Emote} ${carlist[page].car.Name}**\n${emotes.speed} ${carlist[page].car.Speed}\n${emotes.acceleration} ${carlist[page].car.Acceleration}\n${emotes.handling} ${carlist[page].car.Handling}\n${emotes.weight}${carlist[page].car.WeightStat}`})
                await interaction.editReply({embeds: [carlistembed]});
            }
            else if(i.customId == "previous"){
   
                page -= 1
                vispage -= 1
                let carimage = carlist[page].car.Image || carlist[page].car.Livery || cars.Cars[carlist[page].car.Name.toLowerCase()].Image;
                carlistembed.setImage(carimage)
                .setFooter({text: `Page ${vispage}/${Math.ceil(cars.length)}`})
                .setFields({name: "Votes", value: `${carlist[ page].votes}`}, {name: "Car", value: `**${carlist[page].car.Emote} ${carlist[page].car.Name}**\n${emotes.speed} ${carlist[page].car.Speed}\n${emotes.acceleration} ${carlist[ page].car.Acceleration}\n${emotes.handling} ${carlist[ page].car.Handling}\n${emotes.weight}${carlist[ page].car.WeightStat}`})
                await interaction.editReply({embeds: [carlistembed]});
            }
            else if(i.customId == "vote"){
              let carshow2 = await Carshow.findOne({carshowId: id})

              console.log(carshow2)
              if(carshow2.voted.includes(user.id)){
                return interaction.editReply("You have already voted")
              }
              user2 = carlist[page]
              console.log(user2)
                let car = cars.find(car => car.id == user2.id);
                let votes = car.votes
                
                let newvotes = votes += 1
                car.votes += 1;
                console.log(newvotes)
                console.log(car)
                carlistembed.setFields({name: "Votes", value: `${newvotes}`}, {name: "Car", value: `**${carlist[page].car.Emote} ${carlist[page].car.Name}**\n${emotes.speed} ${carlist[page].car.Speed}\n${emotes.acceleration} ${carlist[page].car.Acceleration}\n${emotes.handling} ${carlist[page].car.Handling}\n${emotes.weight}${carlist[page].car.WeightStat}`})
                carshow2.voted.push(user.id)
                await Carshow.findOneAndUpdate({ carshowId: id, "players.id": user2.id }, { $set: { "players.$[player].votes": car.votes }, }, { arrayFilters: [{ "player.id": user2.id }]});

                await carshow2.save();
                await interaction.editReply({content:`You have voted for the ${user2.car.Name}`, embeds: [carlistembed]});
            }


        })
    }
  
    else if(subcommand == "end"){
      let id = interaction.options.getString("id");
      let carshow = await Carshow.findOne({carshowId: id})
      if(!carshow){
          return interaction.reply("No car show with that id exists");
      }
      if(carshow.owner != user.id){
          return interaction.reply("You are not the owner of this car show");
      }

      if(carshow.players.length < 3){
          return interaction.reply("You need at least 3 players to end the car show");
      }

      let winner = carshow.players.sort((a, b) => b.votes - a.votes)[0];
      let winnerid = winner.id;
      if(winner){
          let winneruser = await interaction.client.users.fetch(winner.id);
          winner = winneruser.username;
      }
      else{
          winner = "No one";
      }
      await Carshow.findOneAndDelete({carshowId: id});
      let userdata = await User.findOne({id: winnerid})

      userdata.cash += carshow.prize;

      await userdata.save();
      await interaction.reply(`Car show ended, the winner is ${winner}, they've received ${toCurrency(carshow.prize)}`);

  }
  },
};


