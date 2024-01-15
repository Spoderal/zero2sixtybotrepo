const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../schema/profile-schema");
const lodash = require("lodash")
const colors = require("../common/colors")
const {randomRange} = require('../common/utils')
const ms = require("ms")
const cards = require("../common/cards")
const Cooldowns = require("../schema/cooldowns");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("Play blackjack for some grass")
    .addNumberOption((option) => option
    .setName("bet")
    .setMinValue(1)
    .setDescription("The amount to bet")
    .setRequired(true)
    ),
  async execute(interaction) {

    let userdata = await User.findOne({id: interaction.user.id}) || await new User({ id: interaction.user.id }); 
    let bet = interaction.options.getNumber("bet")
    let cash = userdata.cash

    let cooldowndata = await Cooldowns.findOne({ id: interaction.user.id }) || new Cooldowns({ id: interaction.user.id });
    let timeout = 1800000

    if (
        cooldowndata.gamble !== null &&
        timeout - (Date.now() - cooldowndata.gamble) > 0
      ) {
        let time = ms(timeout - (Date.now() - cooldowndata.gamble));
        let timeEmbed = new EmbedBuilder()
          .setColor(colors.blue)
          .setDescription(`You can gamble again in ${time}`);
        return await interaction.reply({ embeds: [timeEmbed], fetchReply: true });
      }

    if(bet > cash) return interaction.reply("You don't have enough money to bet this amount!")
    if(bet < 0) return interaction.reply("Your bet needs to be a positive number")
    if(bet > 1000000) return interaction.reply("The max you can bet is $1M")
    cooldowndata.gamble = Date.now()
    cooldowndata.save()
    let dealerSum = 0
    let yourSum = 0

    let dealerAceCount = 0
    let yourAceCount = 0
    let canHit = true;
    let dealerEmotes = ['<:BACK:1110485722055585802>']
    let yourEmotes = ['<:BACK:1110485722055585802>']
    let message = "";
    
    let hidden
    let deck

    let bett = bet

    let winnings = bett + (bett * 0.2)

    userdata.gambletimes += 1
    
    buildDeck()
    shuffleDeck()
    startGame()

    let hitRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("hit")
        .setEmoji("<:BACK:1110485722055585802>")
        .setLabel("Hit")
        .setStyle("Secondary"),
        new ButtonBuilder()
        .setCustomId("stand")
        .setLabel("Stand")
        .setStyle("Secondary")
    )


    let embed = new EmbedBuilder()
    .setTitle("Blackjack")
    .setColor(colors.blue)
    .addFields(
        {name: "Dealer", value: `${dealerSum}\n${dealerEmotes.join(' ')}`},
        {name: "You", value: `${yourSum}\n${yourEmotes.join(' ')}`}
    )
    .setThumbnail("https://i.ibb.co/3ThgNYc/bjlogo.png")

    let msg = await interaction.reply({embeds: [embed], components: [hitRow]})


    let filter = (btnInt) => {
        return interaction.user.id === btnInt.user.id;
      };
      let collector = msg.createMessageComponentCollector({
        filter: filter,
        time: 15000
      });

      collector.on('collect', async (i) => {
        if(i.customId == "hit"){
            hit()

            embed = new EmbedBuilder()
    .setTitle("Blackjack")
    .setColor(colors.blue)
    .addFields(
        {name: "Dealer", value: `${dealerSum}\n${dealerEmotes.join(' ')}`},
        {name: "You", value: `${yourSum}\n${yourEmotes.join(' ')}`}
    )
    .setThumbnail("https://i.ibb.co/3ThgNYc/bjlogo.png")
            await interaction.editReply({embeds: [embed], components: [hitRow]})

        }

        if(i.customId == "stand"){
            stand()
            embed  = new EmbedBuilder()
            .setTitle("Blackjack")
            .setColor(colors.blue)
            .addFields(
                {name: "Dealer", value: `${dealerSum}\n${dealerEmotes.join(' ')}`},
                {name: "You", value: `${yourSum}\n${yourEmotes.join(' ')}`}
            )
            .setThumbnail("https://i.ibb.co/3ThgNYc/bjlogo.png")
            .setDescription(message)
            userdata.save()

            await interaction.editReply({embeds: [embed], components: [hitRow]})
        }
      })

      collector.on('end', async (i) => {


        userdata.save()


      })
    
    function buildDeck(){
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        let types = ["C", "D", "H", "S"]
        deck = []
    
        for(let i = 0; i < types.length; i++){
            for(let j = 0; j < values.length; j++){
                deck.push(values[j] + types[i]);
            }
        }
        
    }
    function shuffleDeck(){
        for(let i = 0; i < deck.length; i++){
            let j = Math.floor(Math.random() * deck.length);
            let temp = deck[i]
            deck[i] = deck[j]
            deck[j] = temp
        }
    }
    
    function startGame(){
        hidden = deck.pop();
        dealerSum += getValue(hidden)
        dealerAceCount += checkAce(hidden);

        while (dealerSum < 17){
            let cardImg = ``
            let card = deck.pop()
            cardImg = `${cards[card]}`
 
            dealerSum += getValue(card)
            dealerAceCount += checkAce(card)
            dealerEmotes.push(cardImg)


        }
        console.log(dealerSum)

        for(let i =0; i < 2; i++){
            let cardImg = ``
            let card = deck.pop()
            cardImg = `${cards[card]}`
 
            yourSum += getValue(card)
            yourAceCount += checkAce(card)
            yourEmotes.push(cardImg)
        }

    }
    
    function getValue(card){
        let data = card.split("")
        let value = data[0]

        if(isNaN(value)){
            if(value == "A"){
                return 11;
            }
            return 10;
        }

        return parseInt(value);
    }

    function checkAce(card){
        if(card[0] == "A"){
            return 1;
        }
        else {
            return 0;
        }
    }

    function hit(){
        if(!canHit) {
            return
        }

        let cardImg = ``
            let card = deck.pop()
            cardImg = `${cards[card]}`
 
            yourSum += getValue(card)
            yourAceCount += checkAce(card)
            yourEmotes.push(cardImg)

            if(reduceAce(yourSum, yourAceCount) > 21){
                canHit = false;
            }

    }

    function stand(){
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        yourSum = reduceAce(yourSum, yourAceCount);

        canHit = false;

        dealerEmotes.push(cards[hidden])

        console.log(yourSum)

        if(yourSum > 21){
            message = `You lost $${bet}!!`;
            userdata.cash -= bet
        }
        else if(dealerSum > 21){
            message = `You won $${winnings}!`;
            userdata.cash += winnings
            userdata.gambewins += 1
        }
        else if(yourSum == dealerSum){
            message = `Tied! You got lost $${bet}`;
            userdata.cash -= bet
        }
        else if(yourSum > dealerSum){
            message = `You won $${winnings}!`;
            userdata.cash += winnings
            userdata.gambewins += 1
        }
        else if(yourSum < dealerSum){
            message = `You lost $${bet}!!`;
            userdata.cash -= bet
            
        }

    }
    
    function reduceAce(playerSum, playerAceCount){
        while(playerSum > 21 && playerAceCount > 0){
            playerSum -= 10;
            playerAceCount -= 1;
        }

        return playerSum;
    }


  },
};

