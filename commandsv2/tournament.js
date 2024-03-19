

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder, ButtonBuilder
} = require("discord.js");
const User = require("../schema/profile-schema");
const Cooldowns = require("../schema/cooldowns");
const ms = require("pretty-ms");
const colors = require("../common/colors");
const { GET_STARTED_MESSAGE } = require("../common/constants");
const emotes = require("../common/emotes").emotes;
const pvpranks = require("../data/ranks.json");
const outfits = require("../data/characters.json")
const discord = require("discord.js");
const cars = require("../data/cardb.json");
const lodash = require("lodash");
const Tournament = require('../schema/tournaments');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tournament")
    .setDescription("Create a tournament for your server")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a bracket based tournament")
      
        .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the tournament")
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
          .setName("maxhp")
          .setDescription("The max hp for the tournament")
          .setRequired(true)
      )
      .addNumberOption((option) =>
      option
        .setName("players")
        .setDescription("The amount of players in the tournament")
        .setRequired(true)
        .addChoices(
          {name: '4', value: 4},
          {name: '8', value: 8},
          {name: '16', value: 16},
        )
    )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join")
        .setDescription("Join a tournament")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The id of the tournament")
            .setRequired(true)
        )
        .addStringOption((option) => option
        .setName("car")
        .setDescription("The car you want to use")
        .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("view")
      .setDescription("View a tournament")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("The id of the tournament")
          .setRequired(true)
      )

  )
  .addSubcommand((subcommand) =>
  subcommand
    .setName("list")
    .setDescription("View the list of tournaments")
    .addStringOption((option) =>
    option
      .setName("filter")
      .setDescription("Filter the tournament")
      .setRequired(false)
      .addChoices({name: "Started", value: "started"}, {name: "Not Started", value: "notstarted"})
  )
)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leave")
        .setDescription("Leave a tournament")
    )
    .addSubcommand((subcommand) => subcommand
    .setName("progress")
    .setDescription("Progress the tournament")
    )
    ,
  async execute(interaction) {

 
    let subcommand = interaction.options.getSubcommand();
  
    if (subcommand === "create") {
      let tournamentName = interaction.options.getString("name");
      let prize = interaction.options.getNumber("prize");
      let maxHP = interaction.options.getNumber("maxhp");
      let players = interaction.options.getNumber("players");
     await interaction.reply({content: "Creating tournament...", fetchReply: true})
     
     let tournamentowner = await Tournament.findOne({owner: interaction.user.id})

     if(tournamentowner){
        return await interaction.editReply("You already started a tournament, delete it, or wait for it to end before starting a new one")
     }
      // Logic to create a tournament and store the details
      const generateTournamentId = async () => {
        // Generate a random  id
        const characters = '0123456789';
        let id = '';
        for (let i = 0; i < 6; i++) {
          id += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Check if the generated id already exists in the database
        const existingTournament = await Tournament.findOne({ tournamentId: id })

        // If an existing tournament with the same id is found, generate a new id recursively
        if (existingTournament) {
          return await generateTournamentId();
        }

        // If no existing tournament is found, return the generated id
        return id;
      };

      // Generate a unique id for the tournament
      let tournamentId = await generateTournamentId();
      let maxplayers = "Unlimted"
      if(players){
        maxplayers = players
      }
      const tournamentDetails = {
        name: tournamentName,
        prize: prize,
        maxhp: maxHP,
        players: [],
        owner: interaction.user.id,
        maxPlayers: maxplayers,
        tournamentId: tournamentId,
        losers: [],
        started: false
      };
      console.log(tournamentDetails);


      // Create a new tournament document in the database
      const newTournament = new Tournament(tournamentDetails);
      await newTournament.save();

      // You can also perform any other necessary operations related to the tournament creation

      await interaction.editReply(`Tournament created: ${tournamentName} with the id ${tournamentId}!`);
    } else if (subcommand === "join") {
      // Logic to allow users to join the tournament
      let tournamentid = interaction.options.getString("id");
      let carid = interaction.options.getString("car");

      const tournament = await Tournament.findOne({ tournamentId: tournamentid });

      if (!tournament) {
        return await interaction.reply("Tournament not found");
      }

      // Check if the user is already in the tournament
      if (tournament.players.includes(interaction.user.id)) {
        return await interaction.reply("You are already in the tournament");
      }
      
      // Check if the tournament is full
      if (tournament.maxPlayers !== "Unlimited" && tournament.players.length >= tournament.maxPlayers) {
        return await interaction.reply("The tournament is full");
      }

      if(tournament.losers.includes(interaction.user.id)){
        return await interaction.reply("You have already lost in this tournament");
      }
      let userdata = await User.findOne({id: interaction.user.id})
      let findcar = userdata.cars.filter((car) => car.ID.toLowerCase() == carid.toLowerCase())[0]
      if(!findcar){
        return await interaction.reply("You don't own that car")
      }
      if(findcar.HP > tournament.maxhp){
        return await interaction.reply("Your car has too much HP for this tournament")
      }
      // Push the user's ID to the tournament's players array
      tournament.players.push({player: interaction.user.id, car: carid});
      await tournament.save();




      await interaction.reply("You have joined the tournament!");
    }
    else if (subcommand === "leave") {
      // Logic to allow users to leave the tournament
      const tournament = await Tournament.findOne({ players: interaction.user.id });
      

      if (!tournament) {
        return await interaction.reply("You are not in any tournament");
      }

      // Remove the user's ID from the tournament's players array
      tournament.players = tournament.players.filter((player) => player.player !== interaction.user.id);
      await tournament.save();

      await interaction.reply("You have left the tournament");
    }
    else if (subcommand === "progress") {
      // Logic to progress the tournament
      let tournament = await Tournament.findOne({ owner: interaction.user.id });

      if (!tournament) {
        return await interaction.reply("You are not the owner of any tournament");
      }

      let players = tournament.players
      
        
       await progress(interaction, players, tournament)

      // Update players in the database after each round
      tournament.players = players;
      tournament.started = true
      await Tournament.findOneAndUpdate({ owner: tournament.owner }, { players: players })

      
      if(players.length === 1){
        let winner = players[0]
        let winnerdata = await User.findOne({id: winner.player})
        winnerdata.cash += tournament.prize
        await winnerdata.save()
        let embed = new EmbedBuilder()
        .setTitle("Tournament Progress")
        .setDescription(`<@${winner.player}> has won the tournament and received ${tournament.prize} cash!`)
        .setColor(colors.blue)
        await interaction.reply({embeds: [embed]});
        return await Tournament.findOneAndDelete({ owner: tournament.owner })
      }
      else {
        let embed = new EmbedBuilder()
        .setTitle("Tournament Progress")
        .setDescription(`The tournament has progressed!\n\n${players.map((player) => `<@${player.player}>`).join("\n")} are left in the tournament!`)
        .setColor(colors.blue)
  
  
        await interaction.reply({embeds: [embed]});

      }

       
    }
    else if(subcommand == "view"){
      let id = interaction.options.getString("id");
   
        let tournament = await Tournament.findOne({tournamentId: id })

      

      if(!tournament){
        return interaction.reply("No tournament with that id exists")
      }
      let embed = new EmbedBuilder()
      .setTitle(tournament.name)
      .setDescription(`Prize: ${tournament.prize}\nPlayers Remaining: ${tournament.players.length}/${tournament.maxPlayers}\nStarted: ${tournament.started ? "Yes" : "No"}`)
      .setColor(colors.blue)
      .setFooter({text: `Tournament ID: ${tournament.tournamentId}`})
      await interaction.reply({embeds: [embed]});


    }
    else if(subcommand == "list"){
      let filter = interaction.options.getString("filter");
      let tournaments = []
      if(filter && filter.toLowerCase() == "started"){
        tournaments = await Tournament.find({started: true})

      }
      else if(filter && filter.toLowerCase() == "notstarted"){
        tournaments = await Tournament.find({started: false})

      }
      else {
        tournaments = await Tournament.find()
      }
      let tournamentlist = lodash.chunk(
        tournaments.map((a) => a),
        6
      );
      let page = 0

      let embed = new EmbedBuilder()
      .setTitle("Tournaments")
      .setDescription(tournamentlist[0].map((tournament) => `**${tournament.name} - ${tournament.tournamentId}**\nPlayers: ${tournament.players.length}/${tournament.maxPlayers}`).join("\n"))
      .setColor(colors.blue)
      .setFooter({text: `Page 1 of ${tournamentlist.length}`})

      let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId("prev")
        .setStyle("Primary")
        .setEmoji(`⬅️`),
        new ButtonBuilder()
        .setCustomId("next")
        .setStyle("Primary")
        .setEmoji("➡️"),

      )

      let msg = await interaction.reply({embeds: [embed], components: [row]})

      let filter2 = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
  
      const collector = msg.createMessageComponentCollector({
        filter: filter2,
      });

      collector.on('collect', async (i) => {

        if(i.customId === "prev"){
          if(page === 0){
            page = tournamentlist.length - 1
          }
          else {
            page--
          }
        }
        else if(i.customId === "next"){
          if(page === tournamentlist.length - 1){
            page = 0
          }
          else {
            page++
          }
        }
        let embed = new EmbedBuilder()
        .setTitle("Tournaments")
        .setDescription(tournamentlist[page].map((tournament) => `${tournament.name} - ${tournament.tournamentId}`).join("\n"))
        .setColor(colors.blue)
        .setFooter({text: `Page ${page + 1} of ${tournamentlist.length}`})
        await interaction.editReply({embeds: [embed]})

      })


    }

  },
};


async function progress(interaction, players, tournament, winners = []){
  const player1 = players.shift()
  const player2 = players.shift() ?? 0;
  let userdata1 = await User.findOne({id: player1.player})
  let userdata2 = await User.findOne({id: player2.player})

  let car1 = userdata1.cars.filter((car) => car.ID.toLowerCase() == player1.car.toLowerCase())[0]
  let car2 = userdata2?.cars?.filter((car) => car.ID.toLowerCase() == player2.car.toLowerCase())?.[0]

  let score1 = dorace(car1.Speed, car1.Acceleration, car1.Handling, car1.WeightStat)
  let score2 = car2 === undefined ? 0 : dorace(car2.Speed, car2.Acceleration, car2.Handling, car2.WeightStat)
  let winner = ''
  let loser = ''
  
  if(score1 > score2){
    winner = player1
    loser = player2
  }
  else if(score2 > score1){
    winner = player2
    loser = player1
  }

  else if (score1 === score2) {
    winner = player1
  }
  console.log(tournament)
  console.log(`losers: ${tournament.losers}`)
  await tournament.losers.push(loser.player)

  winners.push(winner)
  let playerin = await interaction.client.users.fetch(player1?.player);
  let player2in = player2 === 0 ? undefined : await interaction.client.users.fetch(player2.player);
  let winnerin = await interaction.client.users.fetch(winner?.player);

  console.log(`Matchup: ${playerin.username} vs ${player2in?.username || "-"}, Winner: ${winnerin.username}`)

  if(players.length > 0){
    return await progress(interaction, players, tournament, winners)
  }
  await Tournament.findOneAndUpdate({ owner: tournament.owner }, { players: players })
  tournament.save()

  players.push(...winners)

}

const dorace = function(speed, acceleration, handling, weight) {
  // Define the importance of each factor
  var speedImportance = 0.30;
  var accelerationImportance = 0.25;
  var handlingImportance = 0.20;
  var weightImportance = 0.25;



  var normalizedSpeed = speed
  var normalizedAcceleration = acceleration  // Lower acceleration is better
  var normalizedHandling = handling 
  var normalizedWeight = weight / 100  // Lower weight is better

  // Calculate the final score
  var score = (speedImportance * normalizedSpeed +
               accelerationImportance * normalizedAcceleration +
               handlingImportance * normalizedHandling -
               weightImportance - normalizedWeight);

  return score;
}